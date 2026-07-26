# AI Workflow Engineering — student lab helpers.
# Requires: Docker, Node >= 20. Copy .env.example to .env first.

COMPOSE = docker compose --env-file .env -f modules/00-course-intro-and-setup/assets/docker-compose.yml

.PHONY: help up down logs validate

help:
	@echo "Targets:"
	@echo "  make up        - start local lab stack (n8n + Postgres + Qdrant)"
	@echo "  make down      - stop the stack (keeps volumes/data)"
	@echo "  make logs      - tail n8n logs"
	@echo "  make validate  - structurally validate all workflow JSON"

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
