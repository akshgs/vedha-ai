# Code Sandbox Compiler Architecture - Phase 9

This document details the multi-language sandboxed execution architecture.

---

## 1. Abstraction Hierarchy

We use a modular, decoupled execution pipeline:

```
[API Endpoint]
      ↓
[CompilerService]
      ↓ (Resolves Language)
[BaseLanguageAdapter]
      ↓ (Python / JavaScript / Cpp Concrete Adapters)
[ExecutionRunner]  ← (Handles process spawning, timeouts, and resource checks)
      ↓ (Stdout / Stderr parsing)
[ResultParser]
```

- **Execution Isolation:** Process runs in independent sub-executables using `subprocess.run`.
- **Replacing Execution Layer:** The adapters inherit from a unified `BaseLanguageAdapter`, which makes the underlying execution layer easily replaceable (e.g., swapping local processes with Docker, gVisor, or an external API executor like Judge0).

---

## 2. Constraints and Limits

To prevent infinite loops, system freezes, and resource exhaustion:
- **Execution Timeout:** Enforced at exactly 2.0 seconds. Timeout exceptions yield `Time Limit Exceeded` verdicts.
- **Compiler Availability Check:** Adapters check compiler presence on start. If `g++` or `node` is not in the system paths, they raise a `CompilerUnavailableException`, yielding a structured error payload.

---

## 3. Dynamic Assertions Wrapping
- User code is wrapped inside a language-specific test runner.
- The runner injects examples, executes the target class/function, verifies return values, and prints a standardized JSON metadata block to stdout.
