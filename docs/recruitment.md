# Recruitment Marketplace Hub

This document details the Job and Internship marketplace connecting upskilled candidates to corporate hirers.

---

## 1. Components & Services Structure

```
src/
 ├── services/
 │    └── jobs.ts             # recommended jobs index
 └── components/ui/career/
      ├── JobCard.tsx         # listings card with matching percentages
      └── CompanyCard.tsx     # company bio specs details
```

---

## 2. Match Scores & Recommendations

- The system queries recommended vacancies via `/jobs/recommend`.
- AI analysis filters current skills list against job descriptions, yielding dynamic suitability gauges.
- Filters separate internships, fulltime positions, and remote jobs.
