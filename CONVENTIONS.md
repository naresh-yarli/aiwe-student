# Conventions & Standards

These standards keep the course consistent, maintainable, and safe. Every module follows them.

---

## 1. Repository & naming

- Modules are numbered `NN-kebab-case-name/`. Numbers imply the prerequisite order.
- Files use `kebab-case.md`, `kebab-case.json`. Diagrams are `NN-descriptive-name.md`.
- No spaces in filenames. No secrets in filenames.
- Every module `README.md` starts with the metadata block (objectives, prereqs, duration).

## 2. n8n workflow standards (SOLID for workflows)

We treat workflows like software. The design goals:

- **Single Responsibility** — a workflow does one job. Cross-cutting concerns (LLM calls,
  logging, validation, retrieval) live in **reusable sub-workflows** under
  `shared/sub-workflows/` and are invoked via the *Execute Workflow* node.
- **Open/Closed** — extend behavior by adding nodes/sub-workflows, not by rewriting core
  logic. Route with *Switch* nodes on a typed `event.type`.
- **Liskov-ish substitution** — sub-workflows honor a stable **contract** (documented
  input/output JSON schema) so callers can swap implementations (e.g. OpenRouter →
  Bedrock) without changing callers.
- **Interface Segregation** — small, focused sub-workflows (`llm-complete`, `embed-text`,
  `vector-search`, `log-event`, `validate-input`) instead of one mega-workflow.
- **Dependency Inversion** — callers depend on the *contract*, not the provider. Provider
  selection is driven by env vars / input, not hard-coded.

### Required patterns in every workflow

1. **Trigger** node clearly named (`Webhook: ...`, `Schedule: ...`, `Manual: ...`).
2. **Input validation** first (a `Code`/`Set`/sub-workflow that rejects bad input early).
3. **Retries** on all external calls: enable *Retry On Fail* (3 attempts, backoff) on HTTP/AI nodes.
4. **Timeouts** set on HTTP Request nodes.
5. **Error handling**: every production workflow references an **Error Workflow** (see
   `shared/sub-workflows/error-handler.json`) via *Settings → Error Workflow*.
6. **Structured logging**: emit a normalized log event through `log-event` sub-workflow.
7. **No inline secrets**: use n8n **Credentials** or `$env`. Prompts are referenced from
   the prompt library, not pasted inline where reuse is expected.
8. **Idempotency**: webhook-triggered workflows compute/accept an idempotency key.

### Node naming

- Verb-first, human readable: `Validate input`, `Route by intent`, `Call LLM (complete)`,
  `Upsert vectors`, `Return response`.
- Avoid default names like `HTTP Request1`.

## 3. Prompt library standard

Prompts are **externalized**, **versioned**, and **testable**. See
`shared/prompt-library/README.md`. Each prompt file carries YAML front-matter:

```yaml
---
id: rag.answer.v2
description: Answer a question strictly from provided context with citations.
model_hint: openai/gpt-4o-mini
inputs: [question, context]
temperature: 0.2
version: 2
owner: curriculum
changelog:
  - v2: added citation format + refusal rule
  - v1: initial
---
```

Workflows load prompts via a `Set`/`Code` node reading the versioned prompt text, or via
the `load-prompt` sub-workflow. Never fork a prompt inline; bump the version instead.

## 4. Datasets

- Small, synthetic, license-clean sample data lives in `assets/` (module) or
  `shared/datasets/` (cross-module).
- Formats: `.json`, `.jsonl`, `.csv`, `.md`. Each dataset ships with a `SCHEMA.md`.
- Never include real PII. Use the synthetic `acme-*` fixtures.

## 5. Diagrams

- All diagrams are **Mermaid** in fenced ```mermaid blocks so they render in Git hosts.
- Each module has at least one **logical** diagram and, in Part II, one **deployment** diagram.
- Use consistent shapes: rounded = process, cylinder = datastore, hexagon = external service.

## 6. Security baseline (applies everywhere)

- Least privilege by default (IAM scoped to specific ARNs; n8n credentials scoped per workflow).
- Secrets only in Secrets Manager / n8n Credentials / `.env` (never in JSON, prompts, or logs).
- Validate & sanitize all external input; treat LLM output as **untrusted** before acting on it.
- Log metadata, never full secrets or full user PII. Redact before logging.
- Every AWS module includes a **teardown checklist** to avoid surprise cost.

## 7. Versioning

- The curriculum is versioned in `CHANGELOG.md` using semantic-ish versions
  (`MAJOR.MINOR.PATCH` where MAJOR = structural change, MINOR = new module/lesson,
  PATCH = fixes).
- Workflow JSON files carry a `meta.courseVersion` tag and a `name` prefixed with the module.

## 8. Instructor voice-over scripts

- All `modules/**/instructor-notes/script.md` files follow the premium Udemy VO standard
  in [`.cursor/rules/instructor-vo-scripts.mdc`](.cursor/rules/instructor-vo-scripts.mdc).
- Before writing or editing a script, read [`AUDIENCE_PERSONA.md`](AUDIENCE_PERSONA.md) and
  [`COURSE_OBJECTIVES.md`](COURSE_OBJECTIVES.md); write only to that module’s outcome IDs.
- Required layout: On-Screen Visuals table → Speaker Script beats → Key Takeaways →
  optional Facilitation notes (not spoken).
- British English; technical terms wrapped in `<u>term</u>`; narrative continuity and
  immersion rules are mandatory (no syllabus narration).
- Plain conversational teaching only — no contrast rhetoric (“not X; it is Y”,
  “not merely…”, essay-style punch lines). Prefer cause → effect and concrete actions.
