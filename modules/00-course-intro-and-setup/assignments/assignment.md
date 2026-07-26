# Assignment — Module 00

**Objective:** prove you have a reproducible local lab and can run an LLM call.

## Tasks

1. Stand up the stack and confirm all three services are running.
2. Import and run `00-hello-openrouter.json`. Change the `question` to something of your
   choice and re-run.
3. Run `node shared/scripts/validate-workflows.mjs`.
4. Set a **spend limit** on your OpenRouter account and take note of it.

## Submit

- Screenshot of the `Shape output` node showing `answer`, `model`, and `usage`.
- Terminal output of the validation script.
- One paragraph: what would break if you accidentally committed `.env`, and how you'd remediate.

## Grading rubric (10 pts)

| Criteria | Pts |
|----------|-----|
| Stack runs (all 3 services healthy) | 3 |
| Hello workflow returns a valid answer with usage | 3 |
| Validation script passes | 2 |
| Thoughtful `.env` leak remediation answer (rotate key, purge history, spend cap) | 2 |
