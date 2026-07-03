import io

import docx
import pdfplumber
from fastapi import HTTPException


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

    paragraphs = [
        para.text
        for para in doc.paragraphs
        if para.text.strip()
    ]

    return "\n".join(paragraphs)


def extract_text(
    file_bytes: bytes,
    filename: str,
) -> str:

    filename = filename.lower()

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)

    if filename.endswith(".docx"):
        return extract_text_from_docx(file_bytes)

    raise HTTPException(
        status_code=400,
        detail="Only PDF and DOCX files are supported.",
    )