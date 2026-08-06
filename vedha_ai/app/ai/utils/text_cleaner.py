"""
app/ai/utils/text_cleaner.py
Text preprocessing utilities: normalization, chunking helpers, truncation.
Reusable across NLP, RAG, and AI services.
"""
import re
import unicodedata


def normalize_text(text: str) -> str:
    """Normalize unicode, strip extra whitespace."""
    text = unicodedata.normalize("NFKD", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def truncate_text(text: str, max_chars: int = 8000) -> str:
    """Truncate to max_chars, preserving word boundaries."""
    if len(text) <= max_chars:
        return text
    truncated = text[:max_chars]
    last_space = truncated.rfind(" ")
    return truncated[:last_space] if last_space > 0 else truncated


def split_into_chunks(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Split text into overlapping chunks for RAG ingestion.
    Splits on sentence boundaries where possible.
    """
    sentences = re.split(r"(?<=[.!?])\s+", text)
    chunks: list[str] = []
    current_chunk: list[str] = []
    current_len = 0

    for sentence in sentences:
        sentence_len = len(sentence)
        if current_len + sentence_len > chunk_size and current_chunk:
            chunks.append(" ".join(current_chunk))
            # Keep overlap sentences
            overlap_sentences: list[str] = []
            overlap_len = 0
            for s in reversed(current_chunk):
                if overlap_len + len(s) <= overlap:
                    overlap_sentences.insert(0, s)
                    overlap_len += len(s)
                else:
                    break
            current_chunk = overlap_sentences
            current_len = overlap_len
        current_chunk.append(sentence)
        current_len += sentence_len

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return [c for c in chunks if c.strip()]


def clean_resume_text(text: str) -> str:
    """
    Clean extracted resume text: remove page numbers,
    excessive newlines, and non-ASCII artifacts.
    """
    # Remove page numbers like "Page 1 of 2"
    text = re.sub(r"Page\s+\d+\s+of\s+\d+", "", text, flags=re.IGNORECASE)
    # Remove repeated dashes/underscores (horizontal rules)
    text = re.sub(r"[-_=]{3,}", "", text)
    # Collapse multiple newlines
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Remove non-printable characters
    text = re.sub(r"[^\x20-\x7E\n]", " ", text)
    return normalize_text(text)


def extract_sections(text: str) -> dict[str, str]:
    """
    Heuristically extract resume sections by common headers.
    Returns dict: {section_name: section_content}
    """
    section_patterns = [
        "experience", "education", "skills", "projects",
        "certifications", "summary", "objective",
        "publications", "awards", "languages",
    ]
    pattern = r"(?i)(?:^|\n)\s*(" + "|".join(section_patterns) + r")\s*[:\n]"
    splits = re.split(pattern, text)

    sections: dict[str, str] = {}
    if len(splits) < 3:
        return {"full_text": text}

    i = 1
    while i < len(splits) - 1:
        section_name = splits[i].lower().strip()
        section_content = splits[i + 1].strip() if i + 1 < len(splits) else ""
        sections[section_name] = section_content
        i += 2

    return sections
