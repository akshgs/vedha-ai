# Machine Learning Architecture - Phase 10

This document details the Machine Learning and predictive analytics pipelines implemented for recommendations and trajectory modeling.

---

## 1. Skill & Path Prediction Engines

We employ a combination of semantic text similarity and regression modeling:
- **Salary Predictor:** Handled via `career_ai_service.predict_salary`, estimating compensation thresholds based on input parameters (experience, region, core skills).
- **Career Growth Trajectories:** Handled via `predict_career_path`, evaluating current skill vectors to chart multi-path growth probabilities.

---

## 2. Recommender Systems Layout

The platform implements modular recommendation blocks:

```
[Candidate Skills Vector] ──┐
                            ├─► [Cosine Similarity / NLP] ─► [Ranked Fit Recommendations]
[Job Requirements Vector] ──┘
```

- **Job Matching:** Matches user profiles against `CompanyJob` tables, scoring fits dynamically.
- **Learning Recommendations:** Identifies missing skill categories and recommends relevant Course guides.
