#!/usr/bin/env node
/**
 * validate-workflows.mjs
 * Structural validator for all n8n workflow JSON files in the repo.
 *
 * Checks per file:
 *   - Valid JSON
 *   - Has `nodes` (array) and `connections` (object)
 *   - Node names are unique and non-empty
 *   - At least one trigger-like node exists
 *   - No plaintext secrets embedded (OpenRouter/OpenAI keys, AWS access keys)
 *
 * Usage:  node shared/scripts/validate-workflows.mjs
 * Exit code 0 = all good, 1 = one or more failures.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const SEARCH_DIRS = ["modules", "shared/sub-workflows"];

const SECRET_PATTERNS = [
  { name: "OpenRouter/OpenAI key", re: /sk-(or-)?[A-Za-z0-9]{20,}/ },
  { name: "AWS access key id", re: /AKIA[0-9A-Z]{16}/ },
  { name: "AWS secret access key", re: /aws_secret_access_key\s*[:=]\s*[A-Za-z0-9/+]{30,}/i },
  { name: "Private key block", re: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
];

const TRIGGER_HINTS = [
  "trigger", "webhook", "manualTrigger", "scheduleTrigger",
  "executeWorkflowTrigger", "cron", "formTrigger", "chatTrigger",
];

function walk(dir, acc = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return acc; }
  for (const entry of entries) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (extname(full) === ".json") acc.push(full);
  }
  return acc;
}

function isTrigger(node) {
  const t = (node.type || "").toLowerCase();
  return TRIGGER_HINTS.some((h) => t.includes(h.toLowerCase()));
}

let failures = 0;
let checked = 0;

for (const base of SEARCH_DIRS) {
  const files = walk(join(ROOT, base));
  for (const file of files) {
    const rel = file.replace(ROOT + "/", "");
    const raw = readFileSync(file, "utf8");

    // Secret scan (applies to any JSON file)
    for (const { name, re } of SECRET_PATTERNS) {
      if (re.test(raw)) {
        console.error(`❌ ${rel}: possible embedded secret (${name})`);
        failures++;
      }
    }

    let wf;
    try { wf = JSON.parse(raw); } catch (e) {
      console.error(`❌ ${rel}: invalid JSON — ${e.message}`);
      failures++;
      continue;
    }

    // Only structurally validate files that look like workflows
    if (!("nodes" in wf) && !("connections" in wf)) continue;
    checked++;

    if (!Array.isArray(wf.nodes)) {
      console.error(`❌ ${rel}: 'nodes' must be an array`);
      failures++;
      continue;
    }
    if (typeof wf.connections !== "object" || wf.connections === null) {
      console.error(`❌ ${rel}: 'connections' must be an object`);
      failures++;
    }

    const names = wf.nodes.map((n) => n.name);
    const empties = names.filter((n) => !n || !n.trim()).length;
    if (empties) { console.error(`❌ ${rel}: ${empties} node(s) with empty name`); failures++; }

    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    if (dupes.length) { console.error(`❌ ${rel}: duplicate node names: ${[...new Set(dupes)].join(", ")}`); failures++; }

    if (!wf.nodes.some(isTrigger)) {
      console.error(`⚠️  ${rel}: no trigger-like node found (ok for pure sub-workflows called via Execute Workflow, otherwise fix)`);
    }
  }
}

console.log(`\nValidated ${checked} workflow file(s).`);
if (failures) {
  console.error(`\n${failures} problem(s) found. ❌`);
  process.exit(1);
} else {
  console.log("All workflow files passed structural checks. ✅");
}
