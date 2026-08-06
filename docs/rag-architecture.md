# RAG & Retrieval Architecture - Phase 10

This document outlines the Retrieval-Augmented Generation (RAG) pipeline, vector search adapters, and citation formatting specifications.

---

## 1. Advanced Hybrid Search Pipeline

The `RAGPipeline` performs retrieval in two steps:
1. **Dense Vector Search:** Performs semantic search against FAISS indexes using `BAAI/bge-small-en-v1.5` embeddings.
2. **Keyword Match Re-ranking:** Re-scores retrieved documents based on token keyword match weights before feeding the context to the LLM.

---

## 2. Pluggable Vector Store Adapters

Vector database storage is abstracted via `BaseVectorStoreAdapter`:
- Swapping the database (e.g. from local FAISS to Pinecone or Milvus) only requires writing a new adapter class inheriting from `BaseVectorStoreAdapter`.
- The core application RAG logic remains completely unchanged.

---

## 3. Citation-aware Context Formatting
- Documents are formatted as structured citation blocks: `[Citation i | Source: s]`.
- This ensures LLM responses reference factual sources, reducing hallucinations.
