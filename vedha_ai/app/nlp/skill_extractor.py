import spacy

nlp = spacy.load("en_core_web_sm")


ROLE_SKILLS = {
    "Machine Learning Engineer": [
        "python", "pytorch", "tensorflow", "scikit-learn",
        "deep learning", "neural networks", "model training",
        "data preprocessing", "feature engineering", "mlops",
        "numpy", "pandas", "statistics", "linear algebra"
    ],
    "Data Scientist": [
        "python", "r", "statistics", "data analysis",
        "machine learning", "pandas", "numpy",
        "visualization", "sql", "tableau",
        "power bi", "hypothesis testing",
        "data cleaning",
        "exploratory data analysis"
    ],
    "Full Stack Developer": [
        "javascript", "react", "nodejs",
        "python", "fastapi", "sql",
        "mongodb", "html", "css",
        "rest api", "git", "docker",
        "typescript"
    ],
    "NLP Engineer": [
        "python", "nlp", "bert",
        "transformers", "spacy",
        "nltk", "text classification",
        "named entity recognition",
        "language models",
        "hugging face",
        "pytorch",
        "rag"
    ],
    "DevOps Engineer": [
        "docker", "kubernetes",
        "aws", "linux",
        "ci/cd", "jenkins",
        "terraform", "ansible",
        "monitoring",
        "git",
        "bash scripting",
        "nginx"
    ],
}


def extract_skills(resume_text: str) -> list[str]:

    doc = nlp(resume_text.lower())

    extracted = set()

    all_skills = set()

    for skills in ROLE_SKILLS.values():
        all_skills.update(skills)

    for skill in all_skills:
        if skill in resume_text.lower():
            extracted.add(skill)

    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.strip()

        for skill in all_skills:
            if skill in chunk_text:
                extracted.add(skill)

    for ent in doc.ents:
        if ent.label_ in ["PRODUCT", "ORG", "GPE"]:

            if ent.text.lower() in all_skills:
                extracted.add(ent.text.lower())

    return sorted(list(extracted))