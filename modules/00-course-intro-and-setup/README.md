# Module 00 — Course Intro & Environment Setup

> Get every learner to an identical, working local lab and the accounts they need, with
> good secret hygiene from minute one.

## 1. Learning objectives

By the end of this module a learner can:

- Explain the two-stage path: learn workflow automation on existing platforms, then design
  and implement the enterprise platform on AWS.
- Stand up a local lab with **n8n + Postgres + Qdrant** via Docker Compose.
- Create an **OpenRouter** account and API key and store it safely (never in Git).
- Import a workflow into n8n and run a first "hello, LLM" call through OpenRouter.
- Apply the repo's conventions for secrets, prompts, and workflow design.

## 2. Prerequisites

- A computer with **Docker Desktop** (or Docker Engine + Compose) and 8 GB+ RAM free.
- **Node.js ≥ 20** (for the validation script) and **Git**.
- A credit/debit card or prepaid balance for OpenRouter (usage is a few cents for the course).
- Comfort with a terminal and a text editor.

## 3. Estimated duration

**~2 hours** (lecture 30 min, lab 60 min, quiz + wrap 30 min).

## 4. Lesson plan

| Time | Segment | Activity |
|------|---------|----------|
| 0:00–0:10 | Welcome & two-stage path | Slides 1–5: learn automation, then build enterprise on AWS |
| 0:10–0:25 | Tooling overview | n8n vs code, OpenRouter, vector DB, AWS preview |
| 0:25–0:30 | Secret hygiene | `.env`, credentials, what never to commit |
| 0:30–1:30 | **Lab**: stand up the stack, run hello-LLM | `labs/lab.md` |
| 1:30–1:45 | Troubleshooting clinic | Common setup failures |
| 1:45–2:00 | Quiz + preview of Module 01 | `quizzes/quiz.md` |

## 5–11. Deliverables in this folder

- **Hands-on lab** → [`labs/lab.md`](labs/lab.md)
- **Sample datasets / configs** → [`assets/`](assets/) (Docker Compose, Qdrant bootstrap)
- **Diagrams** → [`diagrams/`](diagrams/) (PNG visuals for the module)
- **n8n workflow JSON** → [`workflow-json/00-hello-openrouter.json`](workflow-json/00-hello-openrouter.json)
- **Prompt templates** → uses `shared/prompt-library/system.assistant.base.v1`

## 12. Troubleshooting guide

| Symptom | Likely cause | Fix |
|--------|--------------|-----|
| `n8n` container restarts / won't start | Bad `N8N_ENCRYPTION_KEY` change after first run | Keep the key stable; delete the `n8n_data` volume only if you accept losing local workflows |
| Can't reach `http://localhost:5678` | Port in use / container unhealthy | `docker compose ps`, `docker compose logs n8n`; change host port mapping |
| Qdrant connection refused from n8n | Wrong URL (`localhost` vs service name) | From inside n8n use `http://qdrant:6333`, not `localhost` |
| OpenRouter `401 Unauthorized` | Missing/incorrect API key | Check `OPENROUTER_API_KEY` in `.env` and that n8n was restarted to pick it up |
| OpenRouter `402`/insufficient credits | No balance | Add credit or use a free-tier model id |
| Env var not visible in n8n | Set after container start | `docker compose up -d --force-recreate n8n` |
| Validation script errors on JSON | Editor added BOM/comments | Ensure pure JSON, re-run `node shared/scripts/validate-workflows.mjs` |

## 13. Best practices

- Treat `.env` as radioactive: it is gitignored — keep it that way. Share `.env.example` only.
- Pin your model ids in `.env`, not in workflows, so you can change providers in one place.
- Use **n8n Credentials** for the OpenRouter key in real workflows; `$env` is fine for labs.
- Name your workflows with the module prefix (e.g. `00-hello-openrouter`) for traceability.
- Commit early and often on a feature branch; never commit secrets or `n8n_data/`.

## 14. Security considerations

- The local basic-auth on n8n is **dev only**; never expose port 5678 publicly.
- API keys grant spend — rotate immediately if leaked, and set an OpenRouter spend limit.
- Docker volumes persist data on your disk; treat them as sensitive.
- Prompt-injection begins now: from Module 01 we treat any external text as untrusted data.

## 15. Enterprise migration path

See [`enterprise-notes/migration.md`](enterprise-notes/migration.md). Preview: the local
`.env` becomes **AWS Secrets Manager**, the OpenRouter key becomes **Bedrock IAM
permissions**, and Qdrant becomes **OpenSearch Serverless**.

## 16. Quiz

10 questions in [`quizzes/quiz.md`](quizzes/quiz.md), answers in
[`quizzes/answers.md`](quizzes/answers.md).

## 17. Practical assignment

[`assignments/assignment.md`](assignments/assignment.md) — reproduce the stack, run the
hello workflow, and submit a screenshot + the validation script output.

## 18. Capstone extensions

- Add **pgAdmin** and the **Qdrant dashboard** to the compose file for observability.
- Parameterize the compose file for a second "staging" profile to preview multi-env thinking.
- Write a `Makefile` (`make up`, `make down`, `make validate`) to standardize the team workflow.
