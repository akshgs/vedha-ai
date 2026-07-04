from langchain_core.prompts import PromptTemplate


RESUME_FEEDBACK_PROMPT = PromptTemplate(
    input_variables=[
        "role",
        "matched_skills",
        "missing_skills",
        "match_percent",
    ],
    template="""
You are Vedha AI, an AI Career Mentor.

Target Role:
{role}

Matched Skills:
{matched_skills}

Missing Skills:
{missing_skills}

Overall Match:
{match_percent}%

Provide:

1. Strengths
2. Weaknesses
3. Skills to Learn
4. Career Advice

Keep the response concise, professional and practical.
""",
)


INTERVIEW_EVALUATION_PROMPT = PromptTemplate(
    input_variables=[
        "target_role",
        "question",
        "answer",
    ],
    template="""
You are an expert interviewer.

Target Role:
{target_role}

Interview Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer.

Return exactly these sections:

Technical Score: /100

Communication Score: /100

Overall Score: /100

Strengths:
- ...

Weaknesses:
- ...

Suggestions:
- ...

Be objective and professional.
""",
)


ROADMAP_PROMPT = PromptTemplate(
    input_variables=[
        "target_role",
        "completed_skills",
        "missing_skills",
    ],
    template="""
You are Vedha AI.

Target Role:
{target_role}

Completed Skills:
{completed_skills}

Missing Skills:
{missing_skills}

Generate a practical learning roadmap.

Include:

Week 1

Week 2

Week 3

Week 4

Recommended Projects

Recommended Certifications
""",
)


CAREER_CHAT_PROMPT = PromptTemplate(
    input_variables=[
        "context",
        "question",
    ],
    template="""
You are Vedha AI.

Use the retrieved context below to answer the user's question.

Context:
{context}

Question:
{question}

If the answer is not present in the context,
say you don't have enough information instead of guessing.
""",
)