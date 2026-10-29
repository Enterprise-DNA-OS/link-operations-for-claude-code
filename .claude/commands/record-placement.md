---
description: Record placement for the link operations desk
---

# record-placement

Read CLAUDE.md and docs/cli.md. Replace placeholders with the operator's supplied facts.

```bash
node scripts/links.mjs record-placement "<opportunity>" --page="https://publisher.example/story" --target="https://client.example/resource" --consideration=none --actor="<operator>"
```

Present the actual result. Do not invent missing records or evidence.

Ambiguous matches must be shown to the operator, never silently selected. Keep client information and generated documents private.
