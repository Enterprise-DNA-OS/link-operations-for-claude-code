---
description: Observe for the link operations desk
---

# observe

Read CLAUDE.md and docs/cli.md. Replace placeholders with the operator's supplied facts.

```bash
node scripts/links.mjs observe "<placement>" --state=live --date=YYYY-MM-DD --rel=sponsored --evidence="<manual observation reference>" --actor="<operator>"
```

Read the page and record what was observed, the date, link attributes and evidence reference. Never turn an unvisited page into a live result.

Ambiguous matches must be shown to the operator, never silently selected. Keep client information and generated documents private.
