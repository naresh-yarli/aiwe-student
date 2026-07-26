# Quiz — Module 00 (10 questions)

Pass mark: 80% (8/10). Answers in `answers.md`.

1. What is the primary reason we keep `.env` out of Git but commit `.env.example`?
2. Inside the Docker network, what hostname should an n8n node use to reach Qdrant, and why not `localhost`?
3. Which single value, if changed after first run, can prevent n8n from decrypting stored credentials?
4. What does OpenRouter give you that calling one model provider directly does not?
5. True/False: The n8n basic-auth login is production-grade security.
6. You changed `OPENROUTER_API_KEY` in `.env` but n8n still returns 401. What's the most likely fix?
7. What HTTP status indicates insufficient OpenRouter credits?
8. Name two things the `validate-workflows.mjs` script checks for.
9. Why do we pin model ids in `.env` rather than inside each workflow?
10. In Stage 2 on AWS, what typically replaces the local `.env` secrets file?
