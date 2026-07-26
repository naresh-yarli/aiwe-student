# Shared Prompt Library

Prompts are **externalized, versioned, and testable** artifacts — not strings buried in
workflow nodes. This directory is the single source of truth for cross-module prompts.
Module-specific prompts live in each module's `prompt-library/` folder and follow the same
standard.

## File format

Each prompt is a Markdown file with YAML front-matter followed by the prompt body.

```markdown
---
id: rag.answer.v2               # stable, dot-namespaced id + version suffix
description: One line on purpose
model_hint: openai/gpt-4o-mini  # suggested model (overridable)
inputs: [question, context]     # variables interpolated as {{question}}
temperature: 0.2
version: 2
owner: curriculum
changelog:
  - v2: added citation format + refusal rule
  - v1: initial
---
System:
You are ...

User:
{{question}}
```

## How workflows consume prompts

Two supported patterns:

1. **Inline load (simple)** — a `Set`/`Code` node holds the prompt text keyed by `id`.
   Fine for small workflows.
2. **`load-prompt` sub-workflow (preferred at scale)** — call
   `shared/sub-workflows/load-prompt.json` with `{ id, vars }`; it returns the fully
   interpolated `system` and `user` strings. This keeps prompts DRY across workflows.

## Rules

- **Never edit a prompt in place in a way that changes behavior** — bump the version and
  add a changelog entry. Callers pin a version.
- Keep prompts **provider-neutral** where possible; put provider-specific tuning in the
  `model_hint` and temperature, not the body.
- Structured-output prompts must define the exact JSON schema and include a
  "respond with JSON only" instruction plus an example.
- Include **refusal / grounding rules** for anything customer-facing (see `rag.answer`).

## Index

| id | purpose |
|----|---------|
| `system.assistant.base.v1` | Baseline helpful/safe system prompt used as a prefix |
| `rag.answer.v2` | Answer strictly from retrieved context, with citations |
| `router.intent.v1` | Classify an inbound message into an intent enum (structured) |
| `extract.structured.v1` | Extract fields into a strict JSON schema |
