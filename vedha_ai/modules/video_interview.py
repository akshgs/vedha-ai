import os
import cv2
import groq
import tempfile
import traceback
import numpy as np
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from dotenv import load_dotenv

from mediapipe.python.solutions import face_mesh as mp_face_mesh
from mediapipe.python.solutions import pose as mp_pose

from sqlalchemy import text
from utils.db import get_connection

load_dotenv()
router = APIRouter()

ALLOWED_EXTENSIONS = (".mp4", ".webm", ".avi", ".mov")

# ── Groq client (lazy — only when needed) ──────────────
def get_groq_client():
    return groq.Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── LLM ───────────────────
print("Loading Video Interview models...")
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3
)
print("Video Interview models loaded! ✅")

# ═══════════════════════════════════════════════
# EYE CONTACT
# ═══════════════════════════════════════════════

def calculate_eye_contact(landmarks) -> bool:
    LEFT_IRIS = [474, 475, 476, 477]
    RIGHT_IRIS = [469, 470, 471, 472]

    try:
        left_iris_x = np.mean([landmarks[i].x for i in LEFT_IRIS])
        left_iris_y = np.mean([landmarks[i].y for i in LEFT_IRIS])

        right_iris_x = np.mean([landmarks[i].x for i in RIGHT_IRIS])
        right_iris_y = np.mean([landmarks[i].y for i in RIGHT_IRIS])

        center_x = (left_iris_x + right_iris_x) / 2
        center_y = (left_iris_y + right_iris_y) / 2

        return 0.3 < center_x < 0.7 and 0.3 < center_y < 0.7

    except (IndexError, AttributeError):
        return False

# ═══════════════════════════════════════════════
# POSTURE
# ═══════════════════════════════════════════════

def calculate_posture_score(pose_landmark) -> dict:
    if not pose_landmark:
        return {"score": 0, "feedback": ["No pose detected"]}

    landmarks = pose_landmark.landmark
    left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    nose = landmarks[mp_pose.PoseLandmark.NOSE]

    shoulder_diff = abs(left_shoulder.y - right_shoulder.y)
    shoulders_level = shoulder_diff < 0.05
    head_centered = 0.3 < nose.x < 0.7

    score = 100
    feedback = []

    if not shoulders_level:
        score -= 30
        feedback.append("Straighten your shoulders")
    if not head_centered:
        score -= 20
        feedback.append("Center yourself in frame")

    return {
        "score": max(score, 0),
        "feedback": feedback if feedback else ["Good posture!"]
    }

# ═══════════════════════════════════════════════
# FILLER WORDS
# ═══════════════════════════════════════════════

def detect_filler_words(transcript: str) -> dict:
    filler_words = [
        "um", "uh", "like", "you know", "basically",
        "actually", "literally", "kind of", "sort of",
        "i mean", "right", "okay so", "so basically"
    ]

    transcript_lower = transcript.lower()
    found_fillers = {}
    total_count = 0

    for filler in filler_words:
        count = transcript_lower.count(filler)
        if count > 0:
            found_fillers[filler] = count
            total_count += count

    word_count = len(transcript.split())

    return {
        "total_fillers": total_count,
        "filler_breakdown": found_fillers,
        "word_count": word_count,
        "filler_rate": round(total_count / max(word_count, 1) * 100, 1)
    }

# ═══════════════════════════════════════════════
# AUDIO TRANSCRIPTION — Groq Whisper cloud
# ═══════════════════════════════════════════════

def transcribe_audio(video_path: str) -> str:
    try:
        client = get_groq_client()
        with open(video_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-large-v3-turbo",
                file=audio_file,
                response_format="text"
            )
        return transcription.strip() if transcription else ""
    except Exception as e:
        print(f"Transcription error: {e}")
        return ""

# ═══════════════════════════════════════════════
# VIDEO ANALYSIS
# ═══════════════════════════════════════════════

def analyze_video(video_path: str) -> dict:
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise HTTPException(status_code=400, detail="Cannot open video file")

    total_frames = 0
    eye_contact_frames = 0
    posture_scores = []
    frames_with_face = 0
    frames_with_pose = 0

    face_mesh = mp_face_mesh.FaceMesh(
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    pose = mp_pose.Pose(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    frame_skip = 5
    frame_count = 0

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1
            if frame_count % frame_skip != 0:
                continue

            total_frames += 1

            # Ensure frame is contiguous uint8 array, RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            rgb_frame = np.ascontiguousarray(rgb_frame, dtype=np.uint8)
            rgb_frame.flags.writeable = False

            # Face analysis
            try:
                face_results = face_mesh.process(rgb_frame)
                if face_results.multi_face_landmarks:
                    frames_with_face += 1
                    face_landmarks = face_results.multi_face_landmarks[0].landmark
                    if calculate_eye_contact(face_landmarks):
                        eye_contact_frames += 1
            except Exception:
                print("face_mesh.process error:")
                traceback.print_exc()

            # Pose analysis
            try:
                pose_results = pose.process(rgb_frame)
                if pose_results.pose_landmarks:
                    frames_with_pose += 1
                posture = calculate_posture_score(pose_results.pose_landmarks)
                if posture["score"] > 0:
                    posture_scores.append(posture["score"])
            except Exception:
                print("pose.process error:")
                traceback.print_exc()

    finally:
        cap.release()
        face_mesh.close()
        pose.close()

    eye_contact_percent = round(
        (eye_contact_frames / max(total_frames, 1)) * 100, 1
    )
    avg_posture = round(np.mean(posture_scores) if posture_scores else 0, 1)

    print(
        f"[analyze_video] total_frames={total_frames}, "
        f"frames_with_face={frames_with_face}, "
        f"frames_with_pose={frames_with_pose}, "
        f"eye_contact_frames={eye_contact_frames}"
    )

    return {
        "eye_contact_percent": eye_contact_percent,
        "posture_score": avg_posture,
        "frames_analyzed": total_frames,
        "frames_with_face": frames_with_face,
        "frames_with_pose": frames_with_pose,
        "eye_contact_feedback": (
            "Excellent eye contact!" if eye_contact_percent > 70
            else "Try to look at the camera more"
        )
    }

# ═══════════════════════════════════════════════
# ANSWER SCORING
# ═══════════════════════════════════════════════

answer_prompt = PromptTemplate(
    input_variables=["question", "answer", "role"],
    template="""You are an expert interviewer evaluating a candidate for {role} position.

Interview Question: {question}
Candidate's Answer: {answer}

Evaluate the answer on these criteria (score out of 100):
1. Technical accuracy (40 points)
2. Clarity and structure (30 points)
3. Real-world examples (30 points)

Provide:
- TOTAL SCORE: X/100
- STRENGTHS: (2 points)
- IMPROVEMENTS: (2 points)
- IDEAL ANSWER: (brief 3-4 sentences)

Be encouraging but honest."""
)

answer_chain = answer_prompt | llm | StrOutputParser()

# ═══════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════

@router.post("/analyze")
async def analyze_interview(
    student_id: int = Form(...),
    video: UploadFile = File(...),
    question: str = Form(...),
    role: str = Form("Machine Learning Engineer")
):
    if not video.filename or not video.filename.lower().endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail="Please upload MP4, WebM, AVI, or MOV video"
        )

    video_bytes = await video.read()
    if len(video_bytes) > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Video too large! Max 50MB.")

    if len(video_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    ext = os.path.splitext(video.filename)[1].lower()
    tmp_path = None

    try:
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
            tmp.write(video_bytes)
            tmp_path = tmp.name

        print("Analyzing video...")
        try:
            video_analysis = analyze_video(tmp_path)
        except HTTPException:
            raise
        except Exception:
            print("Video analysis error:")
            traceback.print_exc()
            video_analysis = {
                "eye_contact_percent": 0,
                "posture_score": 0,
                "frames_analyzed": 0,
                "eye_contact_feedback": "Video analysis failed."
            }

        print("Transcribing audio via Groq Whisper...")
        transcript = transcribe_audio(tmp_path)

        filler_analysis = detect_filler_words(transcript)

        answer_feedback = "No speech detected in video."
        if transcript:
            try:
                answer_feedback = await answer_chain.ainvoke({
                    "question": question,
                    "answer": transcript,
                    "role": role
                })
            except Exception as e:
                answer_feedback = f"Feedback unavailable: {e}"

        eye_score = video_analysis["eye_contact_percent"]
        posture_score = video_analysis["posture_score"]
        filler_penalty = min(filler_analysis["total_fillers"] * 5, 30)

        overall_score = round(
            (eye_score * 0.3) +
            (posture_score * 0.3) +
            (max(70 - filler_penalty, 0) * 0.4),
            1
        )

        # Save interview result
        try:
            session = get_connection()
            try:
                session.execute(
                    text("""
                        INSERT INTO interview_results
                        (student_id, role, question, overall_score, transcript, created_at)
                        VALUES
                        (:student_id, :role, :question, :overall_score, :transcript, NOW())
                    """),
                    {
                        "student_id": student_id,
                        "role": role,
                        "question": question,
                        "overall_score": overall_score,
                        "transcript": transcript
                    }
                )
                session.commit()
            except Exception as e:
                session.rollback()
                print("Interview Save Error:", e)
            finally:
                session.close()
        except Exception as e:
            print("DB Connection Error:", e)

        return {
            "student_id": student_id,
            "question": question,
            "role": role,
            "transcript": transcript,
            "video_analysis": video_analysis,
            "filler_analysis": filler_analysis,
            "answer_feedback": answer_feedback,
            "overall_score": overall_score,
            "timestamp": datetime.now().isoformat()
        }
    finally:
        if tmp_path:
            try:
                os.unlink(tmp_path)
            except Exception:
                pass


@router.get("/questions/{role}")
async def get_interview_questions(role: str):
    questions = {
        "Machine Learning Engineer": [
            "What is overfitting in machine learning?",
            "Explain bias vs variance.",
            "What is gradient descent?",
            "Difference between supervised and unsupervised learning?",
            "How would you evaluate a classification model?"
        ],
        "Data Scientist": [
            "Explain the Central Limit Theorem.",
            "What is p-value?",
            "Difference between mean and median?",
            "How do you handle missing values?",
            "Explain precision and recall."
        ],
        "Python Developer": [
            "What are Python decorators?",
            "Difference between list and tuple?",
            "What is a generator?",
            "Explain OOP concepts.",
            "What is multithreading?"
        ]
    }

    return {
        "role": role,
        "questions": questions.get(role, questions["Machine Learning Engineer"])
    }