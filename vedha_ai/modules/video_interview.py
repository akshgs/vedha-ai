import os
import cv2
import groq
import tempfile
import json
import numpy as np
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

from mediapipe.python.solutions import face_mesh as mp_face_mesh
from mediapipe.python.solutions import pose as mp_pose
from mediapipe.python.solutions import drawing_utils as mp_drawing

load_dotenv()
router = APIRouter()

# ── Groq client (lazy — only when needed) ──────────────
def get_groq_client():
    return groq.Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── LLM — upgraded to llama-3.3-70b ───────────────────
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

def calculate_eye_contact(landmarks, frame_width, frame_height) -> bool:
    LEFT_IRIS = [474, 475, 476, 477]
    RIGHT_IRIS = [469, 470, 471, 472]

    try:
        left_iris_x = np.mean([landmarks[i].x for i in LEFT_IRIS])
        left_iris_y = np.mean([landmarks[i].y for i in LEFT_IRIS])

        right_iris_x = np.mean([landmarks[i].x for i in RIGHT_IRIS])
        right_iris_y = np.mean([landmarks[i].y for i in RIGHT_IRIS])

        center_x = (left_iris_x + right_iris_x) / 2
        center_y = (left_iris_y + right_iris_y) / 2

        looking_at_camera = (
            0.3 < center_x < 0.7 and
            0.3 < center_y < 0.7
        )
        return looking_at_camera

    except (IndexError, AttributeError):
        return False

# ═══════════════════════════════════════════════
# POSTURE
# ═══════════════════════════════════════════════

def calculate_posture_score(pose_landmark) -> dict:
    if not pose_landmark:
        return {"score": 0, "feedback": "No pose detected"}

    landmarks = pose_landmark.landmark
    left_shoulder  = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    nose           = landmarks[mp_pose.PoseLandmark.NOSE]

    shoulder_diff  = abs(left_shoulder.y - right_shoulder.y)
    shoulders_level = shoulder_diff < 0.05
    head_centered  = 0.3 < nose.x < 0.7

    score    = 100
    feedback = []

    if not shoulders_level:
        score -= 30
        feedback.append("Straighten your shoulders")
    if not head_centered:
        score -= 20
        feedback.append("Center yourself in frame")

    return {
        "score":    max(score, 0),
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
    found_fillers    = {}
    total_count      = 0

    for filler in filler_words:
        count = transcript_lower.count(filler)
        if count > 0:
            found_fillers[filler] = count
            total_count += count

    word_count = len(transcript.split())

    return {
        "total_fillers":    total_count,
        "filler_breakdown": found_fillers,
        "word_count":       word_count,
        "filler_rate":      round(total_count / max(word_count, 1) * 100, 1)
    }

# ═══════════════════════════════════════════════
# AUDIO TRANSCRIPTION — Groq Whisper cloud
# ═══════════════════════════════════════════════

def transcribe_audio(video_path: str) -> str:
    """
    Local whisper replaced with Groq cloud whisper-large-v3-turbo.
    10x faster, zero local RAM usage.
    """
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

    total_frames      = 0
    eye_contact_frames = 0
    posture_scores    = []

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

    frame_skip  = 5
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        if frame_count % frame_skip != 0:
            continue

        total_frames += 1
        rgb_frame     = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_height, frame_width = frame.shape[:2]

        # Face analysis
        face_results = face_mesh.process(rgb_frame)
        if face_results.multi_face_landmarks:
            face_landmarks = face_results.multi_face_landmarks[0].landmark
            if calculate_eye_contact(face_landmarks, frame_width, frame_height):
                eye_contact_frames += 1

        # Pose analysis
        pose_results = pose.process(rgb_frame)
        posture      = calculate_posture_score(pose_results.pose_landmarks)
        if posture["score"] > 0:
            posture_scores.append(posture["score"])

    cap.release()
    face_mesh.close()
    pose.close()

    eye_contact_percent = round(
        (eye_contact_frames / max(total_frames, 1)) * 100, 1
    )
    avg_posture = round(np.mean(posture_scores) if posture_scores else 0, 1)

    return {
        "eye_contact_percent": eye_contact_percent,
        "posture_score":       avg_posture,
        "frames_analyzed":     total_frames,
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
    video:    UploadFile = File(...),
    question: str        = Form(...),
    role:     str        = Form("Machine Learning Engineer")
):
    if not video.filename.lower().endswith((".mp4", ".webm", ".avi", ".mov")):
        raise HTTPException(
            status_code=400,
            detail="Please upload MP4, WebM, AVI, or MOV video"
        )

    video_bytes = await video.read()
    if len(video_bytes) > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Video too large! Max 50MB.")

    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
        tmp.write(video_bytes)
        tmp_path = tmp.name

    try:
        print("Analyzing video...")
        video_analysis = analyze_video(tmp_path)

        print("Transcribing audio via Groq Whisper...")
        transcript = transcribe_audio(tmp_path)

        filler_analysis = detect_filler_words(transcript)

        answer_feedback = "No speech detected in video."
        if transcript:
            try:
                answer_feedback = await answer_chain.ainvoke({
                    "question": question,
                    "answer":   transcript,
                    "role":     role
                })
            except Exception as e:
                answer_feedback = f"Feedback unavailable: {e}"

        eye_score      = video_analysis["eye_contact_percent"]
        posture_score  = video_analysis["posture_score"]
        filler_penalty = min(filler_analysis["total_fillers"] * 5, 30)

        overall_score = round(
            (eye_score     * 0.3) +
            (posture_score * 0.3) +
            (max(70 - filler_penalty, 0) * 0.4),
            1
        )

        return {
            "question":       question,
            "role":           role,
            "transcript":     transcript,
            "video_analysis": video_analysis,
            "filler_analysis": filler_analysis,
            "answer_feedback": answer_feedback,
            "overall_score":  overall_score,
            "timestamp":      datetime.now().isoformat()
        }

    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


@router.get("/questions/{role}")
async def get_interview_questions(role: str):

    questions_prompt = PromptTemplate(
        input_variables=["role"],
        template="""Generate 5 technical interview questions for {role} position.
Mix of:
- 2 conceptual questions
- 2 practical/coding questions
- 1 system design question

Format as JSON array:
[{{"id": 1, "question": "...", "difficulty": "easy/medium/hard", "topic": "..."}}]

Return ONLY the JSON array, no other text."""
    )

    questions_chain = questions_prompt | llm | StrOutputParser()

    try:
        result       = await questions_chain.ainvoke({"role": role})
        result_clean = result.strip()
        if result_clean.startswith("```"):
            result_clean = result_clean.split("```")[1]
            if result_clean.startswith("json"):
                result_clean = result_clean[4:]
        questions = json.loads(result_clean)
        return {"role": role, "questions": questions}

    except Exception as e:
        return {
            "role": role,
            "questions": [
                {"id": 1, "question": f"Explain your experience with {role} technologies.", "difficulty": "easy",   "topic": "General"},
                {"id": 2, "question": "Describe a challenging project you worked on.",       "difficulty": "medium", "topic": "Experience"},
                {"id": 3, "question": "How do you stay updated with latest tech trends?",    "difficulty": "easy",   "topic": "Learning"},
            ]
        }