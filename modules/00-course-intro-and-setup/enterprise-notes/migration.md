# Enterprise Migration Notes — Module 00

The local lab is deliberately simple. Here's how each piece maps to the enterprise platform
on AWS (built out in Stage 2).

| Local lab component | Enterprise equivalent | Why it changes |
|---------------------|-----------------------|----------------|
| `.env` file | **AWS Secrets Manager** / SSM Parameter Store | Central rotation, audit, least-privilege access, no files on disk |
| **OpenRouter** (LLM gateway / model marketplace) | **Amazon Bedrock** | Models run in your AWS account/region; IAM + private networking; no third-party model proxy |
| OpenRouter **API key** | **IAM role** with `bedrock:InvokeModel` / `bedrock:Converse` | Identity-based access, no long-lived keys in files |
| Chat model ids (e.g. `openai/gpt-4o-mini`, `anthropic/claude-3.5-haiku` via OpenRouter) | **Bedrock foundation model ids** (e.g. `anthropic.claude-3-5-haiku-…`, `amazon.nova-lite-…`) | Must be **enabled per region/account** in Bedrock Model access; pin ids in config/env |
| Embedding model (e.g. `openai/text-embedding-3-small` via OpenRouter) | **Bedrock embedding models** (e.g. `amazon.titan-embed-text-v2:0`, Cohere embed on Bedrock) | Same rule: one embedding model for ingest and query; dimension must match the vector store |
| Model routing / fallback (env + workflow) | **Step Functions Choice/Catch**, or a router Lambda selecting Bedrock model ARNs | Same policy (cheap/default vs stronger fallback), managed retries |
| n8n basic auth | **Cognito** + API Gateway authorizers / SSO | Real authn/z, MFA, org identity |
| Qdrant (local) | **OpenSearch Serverless** (vector) or Bedrock Knowledge Bases | Managed, scalable, encrypted, backed up |
| Postgres (local) | **RDS/Aurora** or **DynamoDB** (for KV/state) | Managed durability, backups, IAM auth |
| Docker on laptop | **ECS/Fargate** or fully **serverless (Lambda)** | Elastic scale, no server management |
| `console.log` logging | **CloudWatch Logs** + structured logs + X-Ray | Centralized observability, tracing, alarms |

### Model mapping (preview)

| Role in Stage 1 (`.env`) | Typical Stage 2 (Bedrock) |
|--------------------------|---------------------------|
| `LLM_DEFAULT_MODEL` (small/fast via OpenRouter) | Bedrock Haiku / Nova Lite (or your org’s default text model) |
| `LLM_FALLBACK_MODEL` (stronger via OpenRouter) | Bedrock Sonnet / larger text model (scoped IAM ARN) |
| `EMBEDDING_MODEL` (via OpenRouter) | `amazon.titan-embed-text-v2:0` (or Cohere on Bedrock) |

Detail on Converse API, usage/cost, and routing lands in Module 02 and Module 09 enterprise notes.

## Migration path (preview)

1. Externalize all config/secrets (done — we use `.env`, never inline).
2. Adopt provider-neutral **contracts** via sub-workflows (Module 01) so the LLM/vector
   backends can be swapped for Bedrock/OpenSearch without rewriting business logic.
3. Enable Bedrock model access; map Stage 1 model env vars to Bedrock model ids; invoke via IAM
   (no OpenRouter key in production).
4. Re-platform stateless steps to Lambda; orchestrate with Step Functions (Module 09).
5. Move state to DynamoDB and documents to S3 (Module 08/11).
6. Wrap it in API Gateway + Cognito, wire EventBridge for async (Modules 09–10).
7. Layer observability, governance, and FinOps (Module 12).

The key idea introduced now: **design against contracts, not providers**, so moving from
OpenRouter models to Bedrock models is a swap behind `llm-complete` / `embed-text`, not a
rewrite of every workflow.
