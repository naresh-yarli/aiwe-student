# Shared Sub-Workflows (SOLID building blocks)

These are the reusable, single-responsibility workflows that modules compose via the
**Execute Workflow** node. They enforce Dependency Inversion: callers depend on a stable
**input/output contract**, not on a specific provider. In Part II we swap implementations
(OpenRouter → Bedrock, Qdrant → OpenSearch) *without changing callers*.

| Sub-workflow | Responsibility | Input contract | Output contract |
|--------------|----------------|----------------|-----------------|
| `validate-input.json` | Fail-fast input validation | `{ payload, required[], maxLen? }` | `{ valid, payload }` |
| `load-prompt.json` | Load + interpolate versioned prompt | `{ id, vars }` | `{ id, system, user }` |
| `llm-complete.json` | Chat completion w/ retries | `{ system, user, model?, temperature?, max_tokens?, json? }` | `{ content, model, usage, finish_reason }` |
| `embed-text.json` | Text → vectors | `{ input, model? }` | `{ vectors, model, usage }` |
| `vector-search.json` | Similarity search | `{ vector, topK?, filter? }` | `{ matches:[{id,score,payload}] }` |
| `log-event.json` | Structured, redacted logging | `{ level, event, correlationId, attrs }` | normalized record |
| `error-handler.json` | Global error workflow | (n8n Error Trigger) | logged error event |

## How to install

1. Import each JSON into your n8n instance (**Import from File**).
2. Note the workflow ID n8n assigns; reference it from the *Execute Workflow* node in callers.
3. Set `error-handler` as the **Error Workflow** (Workflow → Settings → Error Workflow) in
   every production workflow.

## Why this matters (SOLID)

- **S**ingle responsibility: each does exactly one thing and is independently testable.
- **O**pen/closed: add new capabilities as new sub-workflows; don't rewrite callers.
- **L**iskov substitution: any implementation honoring the contract is swappable.
- **I**nterface segregation: small focused contracts beat one mega-workflow.
- **D**ependency inversion: provider choice is config, not hard-coded in business logic.
