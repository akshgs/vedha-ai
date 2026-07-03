import spacy

nlp = spacy.load("en_core_web_sm")


KNOWN_SKILLS = {
    "python",
    "pytorch",
    "tensorflow",
    "scikit-learn",
    "numpy",
    "pandas",
    "sql",
    "postgresql",
    "mysql",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "fastapi",
    "flask",
    "django",
    "machine learning",
    "deep learning",
    "neural networks",
    "computer vision",
    "nlp",
    "transformers",
    "bert",
    "llm",
    "rag",
    "langchain",
    "git",
    "linux",
    "mlops",
    "airflow",
    "spark",
    "hadoop",
    "power bi",
    "tableau",
    "statistics",
    "data analysis",
    "feature engineering",
    "data preprocessing",
}


def extract_job_skills(text: str) -> list[str]:

    if not text:
        return []

    text = text.lower()

    doc = nlp(text)

    skills = set()

    for skill in KNOWN_SKILLS:
        if skill in text:
            skills.add(skill)

    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.strip()

        if chunk_text in KNOWN_SKILLS:
            skills.add(chunk_text)

    return sorted(skills)