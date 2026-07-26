# Lab 00 — Stand up the local lab and run your first LLM call

**Goal:** a running n8n + Postgres + Qdrant stack, and a successful OpenRouter call from n8n.
**Time:** ~60 minutes. **Difficulty:** ★☆☆☆☆

## Prerequisites checklist

- [ ] Docker Desktop running
- [ ] Node.js ≥ 20 (`node --version`)
- [ ] Git installed
- [ ] Repo cloned locally

## Step 1 — Create your `.env`

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:

- `OPENROUTER_API_KEY` (from https://openrouter.ai/keys)
- `N8N_ENCRYPTION_KEY` — a long random string, e.g. `openssl rand -hex 24`
- `POSTGRES_PASSWORD`, `N8N_BASIC_AUTH_PASSWORD` — pick strong values

> ✅ **Checkpoint:** `git status` should NOT list `.env` (it's gitignored).

## Step 2 — Start the stack

```bash
docker compose --env-file .env -f modules/00-course-intro-and-setup/assets/docker-compose.yml up -d
docker compose --env-file .env -f modules/00-course-intro-and-setup/assets/docker-compose.yml ps
```

> ✅ **Checkpoint:** `postgres` is healthy, `n8n` and `qdrant` are running.

Verify Qdrant: open http://localhost:6333/dashboard — you should see the Qdrant UI.

## Step 3 — Open n8n

Open http://localhost:5678, log in with your basic-auth user/password. Complete the
owner-account setup screen if prompted.

## Step 4 — Import and run the hello workflow

1. In n8n: top-right **⋮ → Import from File**.
2. Choose `modules/00-course-intro-and-setup/workflow-json/00-hello-openrouter.json`.
3. Click **Execute Workflow** (the "Run once (manual)" trigger).
4. Open the **Shape output** node's output.

> ✅ **Checkpoint:** you see an `answer` string, a `model`, and `usage` token counts.

If you get `401`, your key is wrong or n8n didn't pick up the env — recreate it:

```bash
docker compose --env-file .env -f modules/00-course-intro-and-setup/assets/docker-compose.yml up -d --force-recreate n8n
```

## Step 5 — Validate workflows in the repo

```bash
node shared/scripts/validate-workflows.mjs
```

> ✅ **Checkpoint:** "All workflow files passed structural checks. ✅"

## Step 6 — Tidy up (optional)

To stop without losing data: `docker compose ... stop`.
To remove everything **including volumes**: add `-v` to `down` (this deletes local workflows!).

## Deliverable

Capture: (a) a screenshot of the `answer` output, and (b) the validator output. You'll
submit these in the assignment.
