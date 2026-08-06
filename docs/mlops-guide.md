# MLOps & LLMOps Operations Manual - Phase 10

This manual documents the MLOps pipelines, model registries, and LLM evaluations configurations.

---

## 1. Experiment & Model Registry Tracking (MLflow)

- **MLflow Tracking:** Logs model runs, hyperparameters, and accuracies.
- **Model Registry:** Recommender and embedding models are registered with versions (e.g. `Embedding-BGE-v1.5`), facilitating staging-to-production transitions.

---

## 2. LLMOps & Prompt Versioning

- **Prompt Versioning:** Prompt files under `app/ai/prompts/` are tracked using Git version controls, separating prompts from code changes.
- **Asynchronous Monitoring:** Custom interaction logs track durations, input/output tokens, and error metrics in the database.

---

## 3. Evaluation Pipelines

LLM outputs are audited via an automated LLM-as-a-Judge pipeline in `LLMEvaluator`:
- Evaluates alignment and accuracy scores (0-100).
- Triggers alerts for responses scoring below 80, facilitating continuous prompt tuning.
