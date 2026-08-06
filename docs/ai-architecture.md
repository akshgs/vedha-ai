# AI Module Architecture

This document describes the unified AI subsystem architecture built under the `src/ai` folder.

---

## 1. Directory Blueprint

All AI business logic, context, hooks, and types are unified under a dedicated module to prevent component leakage:

```
src/ai/
 ├── services/
 │    └── ai.ts          # Centralized Axios AI operations
 ├── hooks/
 │    └── useAIChat.ts   # Chat state & loading session lifecycle
 ├── components/         # Reusable AI widgets
 │    ├── AIChat.tsx
 │    ├── ChatMessage.tsx
 │    ├── PromptInput.tsx
 │    ├── ThinkingIndicator.tsx
 │    ├── CitationPanel.tsx
 │    ├── SkillRadar.tsx
 │    ├── SkillGapCard.tsx
 │    ├── CareerScoreCard.tsx
 │    └── ResumeScoreCard.tsx
 ├── types/
 │    └── index.ts       # Typed request/response interfaces
 ├── prompts/            # System prompt templates
 └── index.ts            # Entrypoint exports
```

---

## 2. API Connectivity & Server-Status Detection

The services layer includes dynamic server status probing:

```typescript
export async function checkBackendAvailability(): Promise<boolean> {
  try {
    const res = await api.get("/health", { timeout: 1500 });
    return res.status === 200;
  } catch {
    return false;
  }
}
```

- When the backend is online, requests resolve directly via `/ai/...` endpoints.
- If offline, the client logs fallbacks to offline mock vectors automatically, avoiding white screens.

---

## 3. Monaco Sandbox Code Explainer Integration

The Coding page uses the assistant endpoint directly inside code compilation scopes:
- Sends current code state + active problem identifiers + compiler error logs.
- Renders suggested optimizations in a beautiful, code-safe markdown dialog.
