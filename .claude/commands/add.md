---
description: Add for the link operations desk
---

# add

Read CLAUDE.md and docs/cli.md. Replace placeholders with the operator's supplied facts.

```bash
node scripts/links.mjs add --campaign="<campaign>" --name="<opportunity>" --url="https://publisher.example" --owner="<owner>" --due=YYYY-MM-DD --actor="<operator>"
```

Present the actual result. Do not invent missing records or evidence.

Ambiguous matches must be shown to the operator, never silently selected. Keep client information and generated documents private.
