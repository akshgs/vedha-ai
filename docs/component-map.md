# Reusable Components Map

This document catalogues all reusable components developed for the AI module and the Learning Platform, outlining their locations and purposes.

---

## 1. Unified AI Module Components (`src/ai/components/`)

| Component Name | Relative Path | Purpose |
| :--- | :--- | :--- |
| **AIChat** | `components/AIChat.tsx` | Customizable chatbot feed and prompts form |
| **ChatMessage** | `components/ChatMessage.tsx` | Single bubble formatting for AI replies and user prompts |
| **PromptInput** | `components/PromptInput.tsx` | Custom textarea capturing user prompts |
| **ThinkingIndicator** | `components/ThinkingIndicator.tsx` | Animated sparks dots loading indicators |
| **CitationPanel** | `components/CitationPanel.tsx` | References source log block for PDF vector charts |
| **SkillRadar** | `components/SkillRadar.tsx` | Recharts polar radial chart measuring capability scores |
| **SkillGapCard** | `components/SkillGapCard.tsx` | Highlights matching vs deficient skill metrics |
| **CareerScoreCard** | `components/CareerScoreCard.tsx` | Custom gauge rating placement preparation metrics |
| **ResumeScoreCard** | `components/ResumeScoreCard.tsx` | Section scoring indicators checklist for ATS scans |

---

## 2. Reusable Learning UI Library (`src/components/ui/learning/`)

| Component Name | Relative Path | Purpose |
| :--- | :--- | :--- |
| **RecommendationCard** | `RecommendationCard.tsx` | High-impact course suggestions matched to gaps |
| **CourseCard** | `CourseCard.tsx` | Course metadata details wrapper with bookmarks and progress |
| **LessonCard** | `LessonCard.tsx` | Playlist index checklist items |
| **VideoPlayer** | `VideoPlayer.tsx` | Video frame with playback state callbacks |
| **ProgressTracker** | `ProgressTracker.tsx` | Progress bar and completion checks |
| **QuizCard** | `QuizCard.tsx` | Multiple choice card evaluating answers |
| **AssignmentCard** | `AssignmentCard.tsx` | Submission tracker supporting code file uploads |
| **CertificateCard** | `CertificateCard.tsx` | Verified credential indicator with pdf claim actions |
| **LearningTimeline** | `LearningTimeline.tsx` | Progression checklists mapping active nodes |
