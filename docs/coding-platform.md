# Coding Platform (LeetCode-like Sandbox)

This document describes the design and components of the LeetCode-like algorithm solving workspace.

---

## 1. Module Structure

```
src/
 ├── services/
 │    ├── problems.ts      # Catalog, editorial, discussion lists
 │    ├── compiler.ts      # Sandbox compile runners
 │    ├── contests.ts      # Weekly challenges, achievements and leaderboard
 │    └── submissions.ts   # Code submission logs
 └── components/ui/career/
      ├── ProblemCard.tsx  # Catalog card preview
      ├── ProblemTable.tsx # Tabular list grid
      ├── CodeRunner.tsx   # Run buttons control panel
      ├── ContestCard.tsx  # Contest countdown panels
      ├── Leaderboard.tsx  # Rank standings
      └── BadgeCard.tsx    # Achievement badges
```

---

## 2. Problem Detail Workspace

- **Left Split Panel:** Description statements, editorial answers, and discussions thread.
- **Right Monaco Editor Panel:** Tiered `CodeEditor` supporting Level 1 Monaco Editor, Level 2 Syntax editor fallback, and Level 3 styled Textarea.
- **Console Terminal logs:** Execution runtime and memory metrics outputs.
- **AI Coding Assistant:** Generates inline debug hints and complexity diagnostics.
