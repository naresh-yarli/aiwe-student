# Shared Dataset Schemas

All data here is **synthetic** and safe to commit. The fictional company is "Acme Cloud".
No real PII. Emails use the reserved `.example` domain.

## `acme-kb.jsonl` — knowledge base articles

Used by Modules 04 (embeddings), 05 (RAG), 06 (agents), 11 (enterprise RAG).

| field | type | description |
|-------|------|-------------|
| `id` | string | Stable article id (`kb-###`) |
| `title` | string | Article title |
| `category` | string | One of: `account`, `billing`, `api`, `security`, `product` |
| `content` | string | Article body (the retrievable text) |

## `acme-support-tickets.jsonl` — inbound support messages

Used by Modules 03 (prompts), 06 (agents), 10 (event-driven triage).

| field | type | description |
|-------|------|-------------|
| `id` | string | Ticket id (`t-####`) |
| `channel` | string | `email` or `chat` |
| `subject` | string | Subject line (may be empty for chat) |
| `body` | string | Message body |
| `customer_tier` | string | `starter`, `team`, or `enterprise` |

### Suggested intent labels (for classification exercises)

`login_issue`, `billing_question`, `refund_request`, `rate_limit`, `data_deletion`,
`upload_issue`, `integration_help`, `complaint`, `other`.
