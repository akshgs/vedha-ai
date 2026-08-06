# Code Execution & Compilation Sandbox

This document outlines the API endpoints, schemas, and sandboxes supporting user code execution.

---

## 1. Sandbox Compilation Endpoints

```
[POST] /coding/problems/:id/run    # Run test cases
[POST] /coding/problems/:id/submit # Submit solution
```

- Multi-language compilers support JavaScript, Python, and C++.
- Runs static assertions and feeds execution prints to the terminal console panel.

---

## 2. Compile Output Schema

```typescript
export interface CompileResult {
  status: "success" | "error";
  output: string;
  runtime?: string;
  memory?: string;
}
```
- Runtime averages are measured in milliseconds.
- Memory allocations are tracked in megabytes.
