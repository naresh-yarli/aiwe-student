# AI Workflow Engineering — Student Materials

> Learn **workflow automation** on **n8n + OpenRouter**, then design and implement an
> enterprise AI workflow platform on **AWS**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Released modules](https://img.shields.io/badge/released-1-brightgreen.svg)](README.md)

Labs, workflows, diagrams, quizzes, and assignments for **released** modules.

---

## Who this is for

- Automation engineers / RevOps / Ops adding AI to workflows
- Software & platform engineers moving prototypes to production
- Solutions architects designing enterprise AI on AWS

You need basic scripting literacy, a willingness to use the terminal, and an AWS account
for Stage 2 modules.

---

## Released modules

- [`00-course-intro-and-setup`](modules/00-course-intro-and-setup/) — **Course Intro & Environment Setup** (released 2026-07-26)

---

## Getting started

1. Clone this repo.
2. Copy `.env.example` → `.env` and fill in keys (never commit `.env`).
3. Start the local lab (Module 00):

```bash
make up
# n8n → http://localhost:5678
# Qdrant → http://localhost:6333/dashboard
```

4. Validate workflow JSON anytime:

```bash
npm run validate
# or: make validate
```

---

## Repository layout

```text
.
├── README.md / SYLLABUS.md / LICENSE
├── .env.example
├── shared/                 # Prompts, sub-workflows, datasets, helpers
└── modules/<nn>-name/      # Released modules only
    ├── README.md
    ├── labs/
    ├── assets/
    ├── diagrams/           # PNG diagrams
    ├── workflow-json/
    ├── quizzes/quiz.md
    ├── assignments/
    └── enterprise-notes/
```

---

## Learning paths

See [`SYLLABUS.md`](SYLLABUS.md). Work through released modules in number order unless a
path says otherwise.

---

## Licence

MIT — see [`LICENSE`](LICENSE).
