import os
import io
import spacy
import pdfplumber
import docx
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import numpy as np
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

print("loading NLP models....")
nlp = spacy.load("en_core_web_sm")

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
)


embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

print("model loaded....")

ROLE_SKILLS = {
    "Machine Learning Engineer": [
        "python", "pytorch", "tensorflow", "scikit-learn",
        "deep learning", "neural networks", "model training",
        "data preprocessing", "feature engineering", "mlops",
        "numpy", "pandas", "statistics", "linear algebra"
    ],
    "Data Scientist": [
        "python", "r", "statistics", "data analysis",
        "machine learning", "pandas", "numpy", "visualization",
        "sql", "tableau", "power bi", "hypothesis testing",
        "data cleaning", "exploratory data analysis"
    ],
    "Full Stack Developer": [
        "javascript", "react", "nodejs", "python",
        "fastapi", "sql", "mongodb", "html", "css",
        "rest api", "git", "docker", "typescript"
    ],
    "NLP Engineer": [
        "python", "nlp", "bert", "transformers", "spacy",
        "nltk", "text classification", "named entity recognition",
        "language models", "hugging face", "pytorch", "rag"
    ],
    "DevOps Engineer": [
        "docker", "kubernetes", "aws", "linux", "ci/cd",
        "jenkins", "terraform", "ansible", "monitoring",
        "git", "bash scripting", "nginx"
    ]
}

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n" 
    return text.strip()

def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = docx.Document(io.BytesIO(file_bytes))
    paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
    return "\n".join(paragraphs) 

def extract_text(file_bytes: bytes, filename: str) -> str:
    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif filename.endswith(".docx"):
        return extract_text_from_docx(file_bytes)
    else:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files supported!"
        )

def extract_skills_nlp(resume_text: str) -> list:
    doc = nlp(resume_text.lower())
    extracted = set()

    all_known_skills = set()
    for skill in ROLE_SKILLS.values():
        all_known_skills.update(skill) 

    for skill in all_known_skills:
        if skill in resume_text.lower():
            extracted.add(skill)

    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.strip()
        if len(chunk_text) > 2:
            for skill in all_known_skills:
                if skill in chunk_text:
                    extracted.add(skill)

    for ent in doc.ents:
        if ent.label_ in ["PRODUCT", "ORG", "GPE"]:
            ent_text = ent.text.lower().strip()
            if ent_text in all_known_skills:
                extracted.add(ent_text)

    return list(extracted)

def calculate_role_match(resume_skills: list, role: str) -> dict:
    required_skills = ROLE_SKILLS.get(role, [])

    if not required_skills or not resume_skills:
        return {"match_percent": 0, "matched_skills": [], "missing_skills": required_skills}

    resume_text = " ".join(resume_skills)
    required_text = " ".join(required_skills)

    resume_embedding = embedding_model.encode([resume_text])
    required_embedding = embedding_model.encode([required_text])

   
    similarity = cosine_similarity(resume_embedding, required_embedding)[0][0]

    match_percent = round(float(similarity) * 100, 1)

    matched = [s for s in required_skills if s in resume_skills]
    missing = [s for s in required_skills if s not in resume_skills]

    return {
        "match_percent": match_percent,
        "matched_skills": matched,
        "missing_skills": missing[:5],
    }

feedback_prompt = PromptTemplate(
    input_variables=["role", "matched_skills", "missing_skills", "match_percent"],
    template="""You are a career counselor analyzing a resume for Kerala students.

Target Role: {role}
Match Score: {match_percent}%
Skills Found: {matched_skills}
Skills Missing: {missing_skills}

Give practical advice in 4 bullet points:
1. Overall assessment
2. Top 2 skills to learn immediately
3. Free resources to learn them (Coursera/YouTube/docs)
4. Realistic timeline to be job-ready

Be encouraging and specific to Indian job market."""
)


feedback_chain = feedback_prompt | llm | StrOutputParser()

@router.post("/scan")
async def scan_resume(
    file: UploadFile = File(...),
    target_role: str = Form("Machine Learning Engineer")
   
):
    file_bytes = await file.read()

    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large! Max 5MB.")

    resume_text = extract_text(file_bytes, file.filename)

    if len(resume_text) < 100:
        raise HTTPException(
            status_code=400,
            detail="Resume text too short. Please upload a proper resume."
        )

   
    extracted_skills = extract_skills_nlp(resume_text)

    if target_role not in ROLE_SKILLS:
        target_role = "Machine Learning Engineer"

    
    match_result = calculate_role_match(extracted_skills, target_role)

    try:
        feedback = await feedback_chain.ainvoke({
            "role": target_role,
            "matched_skills": ", ".join(match_result["matched_skills"]),
            "missing_skills": ", ".join(match_result["missing_skills"]),
            "match_percent": match_result["match_percent"]
        })
    except Exception as e:
        feedback = "AI feedback temporarily unavailable."

    return {
        "filename": file.filename,
        "target_role": target_role,
        "extracted_skills": extracted_skills,
        "total_skills_found": len(extracted_skills),
        "match_result": match_result,
        "ai_feedback": feedback,
        "available_roles": list(ROLE_SKILLS.keys())
    }