---
description: Suppress for the link operations desk
---

# suppress

Read CLAUDE.md and docs/cli.md. Replace placeholders with the operator's supplied facts.

```bash
node scripts/links.mjs suppress "<contact>" --evidence="<withdrawal reference>" --actor="<operator>"
```

Present the actual result. Do not invent missing records or evidence.

Ambiguous matches must be shown to the operator, never silently selected. Keep client information and generated documents private.
