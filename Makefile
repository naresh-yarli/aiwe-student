# AI Workflow Engineering — developer convenience targets.
# Requires: Docker, Node >= 20. Copy .env.example to .env first.

COMPOSE = docker compose --env-file .env -f modules/00-course-intro-and-setup/assets/docker-compose.yml

.PHONY: help up down logs validate seed publish publish-status publish-release publish-unrelease

# Optional: make publish-release MODULE=00
MODULE ?=

help:
	@echo "Targets:"
	@echo "  make up                 - start local lab stack (n8n + Postgres + Qdrant)"
	@echo "  make down               - stop the stack (keeps volumes/data)"
	@echo "  make logs               - tail n8n logs"
	@echo "  make validate           - structurally validate all workflow JSON"
	@echo "  make publish-status     - show public release status"
	@echo "  make publish            - sync released modules to public student repo"
	@echo "  make publish-release MODULE=00   - mark module released + sync"
	@echo "  make publish-unrelease MODULE=00 - mark draft + remove from public sync"

up:
	$(COMPOSE) up -d
	@echo "n8n:    http://localhost:5678"
	@echo "qdrant: http://localhost:6333/dashboard"

down:
	$(COMPOSE) stop

logs:
	$(COMPOSE) logs -f n8n

validate:
	node shared/scripts/validate-workflows.mjs

publish-status:
	node scripts/publish-public.mjs --status

publish:
	node scripts/publish-public.mjs

publish-release:
	@test -n "$(MODULE)" || (echo "Usage: make publish-release MODULE=00"; exit 1)
	node scripts/publish-public.mjs --release $(MODULE)

publish-unrelease:
	@test -n "$(MODULE)" || (echo "Usage: make publish-unrelease MODULE=00"; exit 1)
	node scripts/publish-public.mjs --unrelease $(MODULE)
