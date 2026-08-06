# ═══════════════════════════════════════════════
# IMPORTS
# ═══════════════════════════════════════════════

import cv2


import os


import tempfile


import numpy as np


from fer import FER


from collections import Counter
# Count items in a list
# Counter(["happy","neutral","happy"]) → {"happy":2, "neutral":1}

from fastapi import APIRouter, UploadFile, File, HTTPException
# FastAPI tools for API endpoints

router = APIRouter()
# Manages routes in this file

# ═══════════════════════════════════════════════
# LOAD MODEL — once when server starts
# ═══════════════════════════════════════════════

print("Loading Emotion Detection model...")

detector = FER(mtcnn=True)
# FER() = create emotion detection model
# mtcnn=True = uses MTCNN face detector
#   MTCNN = Multi-task Cascaded Convolutional Network
#   Detects side faces, partially visible faces too
#   More accurate than default detector

print("Emotion Detection ready! ✅")

# ═══════════════════════════════════════════════
# HELPER FUNCTION 1 — Confidence score calculate
# ═══════════════════════════════════════════════

def calculate_confidence_score(emotion_percentages: dict) -> int:
    # Takes emotion percentages → returns interview confidence score (0-100)

    score = 50
    # Start with average score of 50

    happy   = emotion_percentages.get("happy", 0)
    neutral = emotion_percentages.get("neutral", 0)
    angry   = emotion_percentages.get("angry", 0)
    fear    = emotion_percentages.get("fear", 0)
    sad     = emotion_percentages.get("sad", 0)
    # .get("key", 0) = returns 0 if key not found

    score += happy * 0.3
    # Happy = positive signal, increase score
    # 50% happy → +15 points

    score += neutral * 0.2
    # Neutral = professional composure, good for interview
    # 60% neutral → +12 points

    score -= fear * 0.3
    # Fear/nervousness = decrease score
    # 30% fear → -9 points

    score -= angry * 0.4
    # Angry expression = decrease score more

    score -= sad * 0.2
    # Sad expression = slight decrease

    return max(0, min(100, round(score)))
    # max(0, ...) = never go below 0
    # min(100, ...) = never go above 100
    # round() = convert to integer


# ═══════════════════════════════════════════════
# HELPER FUNCTION 2 — Feedback generate
# ═══════════════════════════════════════════════

def generate_feedback(dominant: str, percentages: dict) -> list:
    # Takes dominant emotion → returns list of feedback points

    feedback = []
    # Empty list to collect feedback

    # Main feedback based on dominant emotion
    if dominant == "neutral":
        feedback.append("✅ Good professional composure during interview")
    elif dominant == "happy":
        feedback.append("✅ Positive energy — great for interview!")
    elif dominant == "fear":
        feedback.append("⚠️ You appear nervous — practice more mock interviews")
    elif dominant == "angry":
        feedback.append("⚠️ Try to maintain calm expression throughout")
    elif dominant == "sad":
        feedback.append("⚠️ Try to appear more confident and positive")
    else:
        feedback.append(f"Dominant emotion detected: {dominant}")

    # Additional tips based on percentages
    if percentages.get("fear", 0) > 20:
        feedback.append("💡 Tip: Take deep breaths before answering each question")

    if percentages.get("neutral", 0) < 30:
        feedback.append("💡 Tip: Maintain calm expression when listening")

    if percentages.get("happy", 0) > 40:
        feedback.append("✅ Great smile — shows enthusiasm!")

    return feedback


# ═══════════════════════════════════════════════
# CORE FUNCTION — 
# ═══════════════════════════════════════════════

def analyze_emotions_from_video(video_path: str) -> dict:
    # Input: video file path on disk
    # Output: dictionary with emotion analysis results

    # ── Step 1: Open video ──────────────────────
    cap = cv2.VideoCapture(video_path)
    # VideoCapture = object to read video file
    # 0 = webcam, "path.mp4" = video file

    if not cap.isOpened():
        raise HTTPException(
            status_code=400,
            detail="Cannot open video file!"
        )
    # If video can't open = corrupted or wrong format

    # ── Step 2: Get video info ──────────────────
    fps = cap.get(cv2.CAP_PROP_FPS)
    # FPS = Frames Per Second
    # 30fps = 30 images per second

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    # Total number of frames in video

    frame_skip = max(1, int(fps / 3))
    # Analyze only 3 frames per second (not all frames)
    # fps=30 → frame_skip=10 (every 10th frame)
    # max(1, ...) = frame_skip never becomes 0

    print(f"Video: {fps:.1f} FPS, {total_frames} frames")
    print(f"Analyzing every {frame_skip}th frame...")

    # ── Step 3: Storage variables ───────────────
    all_emotions = []
    # Store detected emotion per frame
    # Will look like: ["neutral", "happy", "neutral", "fear"]

    emotion_timeline = []
    # Store timestamp + emotion
    # Will look like: [{"second": 1.0, "emotion": "neutral"}]

    frame_count = 0
    # Track current frame number

    # ── Step 4: Loop through frames ─────────────
    while True:
        ret, frame = cap.read()
        # cap.read() = get next frame from video
        # ret = True if frame exists, False if video ended
        # frame = image as numpy array (height × width × 3)

        if not ret:
            break
        # Video ended — stop loop

        frame_count += 1

        if frame_count % frame_skip != 0:
            continue
        # Skip frames that are not multiples of frame_skip
        # frame_skip=10: process frames 10, 20, 30, 40...

        # ── Step 5: CNN emotion detection ───────
        result = detector.detect_emotions(frame)
        # FER CNN model runs here
        # Input: image array
        # Output: [{"box": [x,y,w,h],
        #           "emotions": {"happy": 0.8, "neutral": 0.2, ...}}]

        if not result:
            continue
        # No face found in this frame — skip

        emotions = result[0]["emotions"]
        # result[0] = first detected face
        # ["emotions"] = dict of all emotion probabilities
        # Example: {"happy": 0.85, "neutral": 0.14, "angry": 0.01}

        dominant = max(emotions, key=emotions.get)
        # Find emotion with highest probability
        # max with key=emotions.get compares values
        # {"happy": 0.85, "neutral": 0.14} → returns "happy"

        confidence = round(emotions[dominant], 3)
        # Probability of dominant emotion, rounded to 3 decimals

        all_emotions.append(dominant)
        # Add to overall list

        second = round(frame_count / max(fps, 1), 1)
        # Convert frame number to seconds
        # frame 30 / fps 30 = 1.0 second
        # frame 60 / fps 30 = 2.0 seconds

        emotion_timeline.append({
            "second": second,
            "emotion": dominant,
            "confidence": confidence
        })
        # Add to timeline

    # ── Step 6: Release resources ────────────────
    cap.release()
    # Free memory — always do this after VideoCapture

    # ── Step 7: Calculate results ────────────────
    if not all_emotions:
        return {
            "error": "No face detected in video!",
            "tip": "Make sure your face is clearly visible"
        }

    emotion_counts = Counter(all_emotions)
    # Count each emotion
    # ["happy","neutral","happy"] → Counter({"happy":2, "neutral":1})

    total_detected = len(all_emotions)
    # Total frames where face was found

    emotion_percentages = {
        emotion: round((count / total_detected) * 100, 1)
        for emotion, count in emotion_counts.items()
    }
    # Calculate percentage for each emotion
    # happy: 2 out of 10 frames = 20.0%
    # Dictionary comprehension — creates new dict from existing dict

    dominant_emotion = emotion_counts.most_common(1)[0][0]
    # most_common(1) = list with most frequent item
    # [0] = first item in list → ("neutral", 8)
    # [0] = key only → "neutral"

    confidence_score = calculate_confidence_score(emotion_percentages)
    # Call helper function to get interview confidence score

    feedback = generate_feedback(dominant_emotion, emotion_percentages)
    # Call helper function to get feedback points

    return {
        "dominant_emotion": dominant_emotion,
        "emotion_percentages": emotion_percentages,
        "emotion_timeline": emotion_timeline[:20],
        # Only first 20 entries — too much data otherwise
        "frames_analyzed": total_detected,
        "confidence_score": confidence_score,
        "feedback": feedback
    }


# ═══════════════════════════════════════════════
# API ENDPOINT
# ═══════════════════════════════════════════════

@router.post("/analyze-emotion")
async def analyze_emotion(video: UploadFile = File(...)):
    # User uploads video → emotion analysis

    # File type check
    if not video.filename.lower().endswith((".mp4", ".webm", ".avi", ".mov")):
        raise HTTPException(
            status_code=400,
            detail="Please upload MP4, WebM, AVI, or MOV video"
        )

    # Read file bytes
    video_bytes = await video.read()
    # await = wait for async operation to complete
    # video_bytes = raw binary data of video

    # Size check — 50MB max
    if len(video_bytes) > 50 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Video too large! Max 50MB"
        )

    # Save to temp file
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
        tmp.write(video_bytes)
        # Write binary data to disk
        tmp_path = tmp.name
        # tmp.name = path like "C:\Temp\tmp12345.mp4"

    try:
        print(f"Analyzing emotions...")
        result = analyze_emotions_from_video(tmp_path)
        # Call core function
        return result
        # Return JSON response

    finally:
        # Always delete temp file — error or not
        try:
            os.unlink(tmp_path)
            # unlink = delete file
        except:
            pass


@router.get("/emotions-info")
def get_emotions_info():
    # Returns info about what emotions are detected
    return {
        "emotions_detected": [
            "happy", "sad", "angry",
            "fear", "surprise", "neutral", "disgust"
        ],
        "model": "FER2013 CNN",
        "what_it_does": "Analyzes facial expressions frame by frame in interview video",
        "output": "Emotion percentages + confidence score + feedback"
    }