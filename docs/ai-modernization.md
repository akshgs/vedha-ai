# AI Modernization Overview - 2026 AI Engineering

This guide details the structural and architectural upgrades made to modernize the Vedha AI system.

---

## 1. Modular Directory Structure

All AI models, prompts, pipelines, and agents reside inside the centralized `app/ai/` package:

```
app/ai/
 ├── agents/             # Reasoning loop handlers (CareerMentorAgent, CodingSpecialistAgent)
 ├── workflows/          # Coordinated multi-agent step orchestrations
 ├── rag/                # Advanced hybrid searches and citation formatting pipelines
 ├── embeddings/         # Decoupled embeddings transformer factories
 ├── vector_store/       # Pluggable vector database adapter layers
 ├── prompts/            # Structured, versioned prompts
 ├── llm/                # Central model factory initializing providers
 ├── services/           # Endpoints business services consuming modular modules
 ├── evaluation/         # LLM-as-a-Judge quality feedback logs
 ├── memory/             # Session windowed and summary memory brokers
 ├── tools/              # Predefined tools for agents calling hooks
 └── utils/              # JSON extraction and Explainable AI (XAI) rationale logs
```

---

## 2. Advanced AI memory Management

Conversational memory is handled by `AIChatMemory` mapping to the session broker:
- **Windowed Retrieval:** Restricts context sizes to prevent buffer limits context overflows.
- **Commit Hooks:** Asynchronously logs user queries and LLM replies to maintain live history.

---

## 3. Observability and Explainable AI (XAI)
- Every complex inference includes explainability blocks via `XAIExplainer`.
- Evaluators monitor model outputs dynamically through LLM-as-a-Judge execution hooks in `LLMEvaluator`.
