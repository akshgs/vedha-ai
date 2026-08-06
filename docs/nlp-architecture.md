# Natural Language Processing Architecture - Phase 10

This manual documents the NLP frameworks used for parsing resumes, extracting skills, and analyzing textual data.

---

## 1. Resume Parsing & Information Extraction

Resume parsing runs in two layers:
1. **Structural Parser:** Extracts text blocks from PDF attachments, filtering raw whitespace formatting.
2. **LLM Information Extractor:** Parses details (education, certifications, experiences) into structured JSON formats.

---

## 2. Skill Extraction & NER

- **Named Entity Recognition (NER):** Extracts technologies, frameworks, and job titles.
- **Semantic Text Matching:** Computes text similarities to check if candidate skills match job descriptions (e.g. mapping "ReactJS" and "React" to the same skill taxonomy).
