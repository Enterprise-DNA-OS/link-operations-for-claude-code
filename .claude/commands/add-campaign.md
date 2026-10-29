---
description: Add campaign for the link operations desk
---

# add-campaign

Read CLAUDE.md and docs/cli.md. Replace placeholders with the operator's supplied facts.

```bash
node scripts/links.mjs add-campaign --name="<campaign>" --client="<client>" --owner="<owner>" --target="https://example.com/resource" --actor="<operator>"
```

Present the actual result. Do not invent missing records or evidence.

Ambiguous matches must be shown to the operator, never silently selected. Keep client information and generated documents private.
