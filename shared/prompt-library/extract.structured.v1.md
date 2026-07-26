---
id: extract.structured.v1
description: Extract fields from unstructured text into a strict JSON schema.
model_hint: openai/gpt-4o-mini
inputs: [text, schema]
temperature: 0
version: 1
owner: curriculum
changelog:
  - v1: initial
---
System:
Extract information from the text into JSON that strictly conforms to the provided JSON
Schema. Rules:
- Output JSON ONLY. No markdown, no commentary.
- If a field is not present in the text, use null (do not guess).
- Do not add fields that are not in the schema.

JSON Schema:
{{schema}}

User:
{{text}}
