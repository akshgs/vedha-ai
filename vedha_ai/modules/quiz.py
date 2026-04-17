from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.db import get_connection
import random

router = APIRouter()

QUESTIONS = {
    "Python": [
        {"id":1,"question":"What does len() return?","options":["Memory size","Number of elements","Object ID","None"],"answer":1},
        {"id":2,"question":"Which is a mutable data type?","options":["Tuple","String","List","Integer"],"answer":2},
        {"id":3,"question":"What keyword defines a function?","options":["function","def","fun","define"],"answer":1},
        {"id":4,"question":"Output of type(3.14)?","options":["int","float","double","decimal"],"answer":1},
        {"id":5,"question":"Result of list(range(0,6,2))?","options":["[0,2,4]","[0,2,4,6]","[2,4,6]","[0,1,2,3,4,5]"],"answer":0}
    ],
    "Machine Learning": [
        {"id":6,"question":"What is overfitting?","options":["Good on train, bad on test","Bad on train","Too few params","Ignores data"],"answer":0},
        {"id":7,"question":"Gradient descent minimises?","options":["Accuracy","Loss function","Dataset size","Layer count"],"answer":1},
        {"id":8,"question":"Dropout reduces?","options":["Underfitting","Overfitting","Learning rate","Batch size"],"answer":1},
        {"id":9,"question":"What is an epoch?","options":["A single layer","One full pass through data","Learning rate","Loss function"],"answer":1},
        {"id":10,"question":"SVM is best for?","options":["Clustering","Classification with clear margin","Dim reduction","Time series"],"answer":1}
    ],
    "Statistics": [
        {"id":11,"question":"Standard deviation measures?","options":["Average","Most frequent","Spread around mean","Middle value"],"answer":2},
        {"id":12,"question":"p-value < 0.05 means?","options":["Accept null","Reject null","No conclusion","Data is normal"],"answer":1},
        {"id":13,"question":"NOT affected by outliers?","options":["Mean","Std deviation","Median","Range"],"answer":2},
        {"id":14,"question":"Normal distribution is?","options":["Always skewed","Bell-shaped symmetric","Always uniform","Bimodal"],"answer":1},
        {"id":15,"question":"Correlation measures?","options":["Causation","Linear relationship","Dataset average","Difference"],"answer":1}
    ],
    "DSA": [
        {"id":16,"question":"Binary search complexity?","options":["O(n)","O(n²)","O(log n)","O(1)"],"answer":2},
        {"id":17,"question":"LIFO order uses?","options":["Queue","Stack","Heap","Linked List"],"answer":1},
        {"id":18,"question":"In-order traversal?","options":["Root,Left,Right","Left,Right,Root","Left,Root,Right","Right,Root,Left"],"answer":2},
        {"id":19,"question":"Hash table uses?","options":["Sorting","Key hash","Binary search","Linear scan"],"answer":1},
        {"id":20,"question":"QuickSort worst case?","options":["O(n log n)","O(n)","O(n²)","O(log n)"],"answer":2}
    ]
}

def get_grade(score: int) -> str:
    if score >= 90:   return "A+ — Excellent!"
    elif score >= 75: return "A — Great!"
    elif score >= 60: return "B — Good"
    elif score >= 40: return "C — Keep Learning"
    else:             return "D — Practice More"

@router.get("/topics")
def get_topics():
    return {"topics": list(QUESTIONS.keys()), "total": len(QUESTIONS)}

@router.get("/questions/{topic}")
def get_questions(topic: str, count: int = 5):
    if topic not in QUESTIONS:
        raise HTTPException(status_code=400, detail=f"Topic not found! Available: {list(QUESTIONS.keys())}")
    all_q    = QUESTIONS[topic]
    selected = random.sample(all_q, min(count, len(all_q)))
    return {
        "topic":     topic,
        "count":     len(selected),
        "questions": [{"id":q["id"],"question":q["question"],"options":q["options"]} for q in selected]
    }

class SubmitRequest(BaseModel):
    student_id: int
    topic:      str
    answers:    dict

@router.post("/submit")
def submit_quiz(data: SubmitRequest):
    if data.topic not in QUESTIONS:
        raise HTTPException(status_code=400, detail="Invalid topic!")

    questions = QUESTIONS[data.topic]
    correct   = 0
    results   = []

    for q in questions:
        q_id = str(q["id"])
        if q_id not in data.answers:
            continue

        user_ans    = data.answers[q_id]
        correct_ans = q["answer"]

       
        if not isinstance(user_ans, int) or not (0 <= user_ans < len(q["options"])):
            raise HTTPException(
                status_code=422,
                detail=f"Invalid answer index for question {q_id}: {user_ans}"
            )

        is_correct = user_ans == correct_ans
        if is_correct:
            correct += 1

        results.append({
            "question":       q["question"],
            "your_answer":    q["options"][user_ans],
            "correct_answer": q["options"][correct_ans],
            "is_correct":     is_correct
        })

    
    total     = len(results)
    score_pct = int((correct / total) * 100) if total > 0 else 0

   
    conn = get_connection()
    try:
        conn.execute(
            "UPDATE students SET quiz_score = ? WHERE id = ?",
            (score_pct, data.student_id)
        )
        conn.commit()
    except Exception:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Database error! Score could not be saved.")
    finally:
        conn.close()

    return {
        "student_id": data.student_id,
        "topic":      data.topic,
        "correct":    correct,
        "total":      total,
        "score":      score_pct,
        "grade":      get_grade(score_pct),
        "results":    results
    }