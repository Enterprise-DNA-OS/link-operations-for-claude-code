---
description: Add contact for the link operations desk
---

# add-contact

Read CLAUDE.md and docs/cli.md. Replace placeholders with the operator's supplied facts.

```bash
node scripts/links.mjs add-contact --name="<name>" --email="<address>" --actor="<operator>"
```

Present the actual result. Do not invent missing records or evidence.

Ambiguous matches must be shown to the operator, never silently selected. Keep client information and generated documents private.
