# Hardened Student Module Documentation

This document outlines the hardened modules, personalized workspace structure, and interactive components engineered for the Student Portal.

## Feature Architecture

### 1. Dashboard Customization & Personalization
- **Widget Controls:** Toggled and reordered dynamically through a preferences panel saved to `localStorage`.
- **Ecosystem Timeline:** Unified feeds tracking parsed resumes, certifications, mock interview scores, and application updates.
- **AI Recommendation Engine:** Analyzes current profile score metrics and upskilling statistics to recommend daily priorities.

### 2. AI Resume Suite
- **Multiple Templates:** Supports "Tech Premium", "Modern Minimalist", and "Executive Classic" styles in the live builder preview.
- **Side-by-Side Comparison:** Interactive modal visualizes ATS score gains, extracted skills updates, and missing gaps differences between two selected resume versions.
- **ATS Metrics:** Structured checklists highlighting formatting, aesthetics, action verb checks.

### 3. Skills Intelligence
- **Proficiency Levels:** Detailed gauges tracking skill levels from Beginner to Expert (0-100%).
- **History Graphs:** Line charts tracking upskilling trends over weeks.
- **Direct Job Links:** Connects missing skill gaps directly to corresponding active openings on the Job Board.

### 4. Coding Sandbox
- **Monaco Editor Integration:** Embedded editor matching vs-dark syntax highlighting with a responsive styled fallback.
- **Submission History:** Logs candidate attempts, execution speeds, and memory allocations.
- **Streaks & Rankings:** Visualizes weekly leaderboards.

### 5. Career Intelligence
- **AI Mentorship:** Reusable API service supporting LLM advice.
- **Multi-Region Salary Curve:** Supports INR (LPA), USD, EUR, and GBP wages predictions.
- **Similarity Matching:** Compatibility analyzer checklist showing match rates against criteria.
