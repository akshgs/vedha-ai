# Agentic AI & Orchestration Design - Phase 10

This document outlines the multi-agent reasoning, workflows, and tool-calling systems.

---

## 1. Multi-Agent Reasoning Loops

We use an agentic design to isolate domain-specific tasks:
- **`CareerMentorAgent`:** Manages queries related to career path planning, salary metrics, and trends analysis.
- **`CodingSpecialistAgent`:** Manages software debugging, code optimizations, and algorithm analysis.

Each agent inherits from `BaseAgent`, which configures custom system instructions and provides access to registered tool catalogs.

---

## 2. Tool Calling & Function Execution

Agents can dynamically invoke tools based on user inputs:
- **`get_market_role_demands`:** Looks up required skills for specific job roles.
- **Result Parsing:** Standardized output structures parse returned tool results, enabling LLMs to answer questions using fresh data.

---

## 3. Workflow Orchestration

Multi-step pipelines are managed by `AIWorkflowOrchestrator`:
- Coordinates sequential tasks (e.g. running resume ATS scoring before calculating specific skill gaps).
- Combines outputs into a unified response schema, ensuring structural alignment and quality controls.
