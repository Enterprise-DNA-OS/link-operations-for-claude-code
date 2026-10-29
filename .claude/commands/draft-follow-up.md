---
description: Draft follow up for the link operations desk
---

# draft-follow-up

Read CLAUDE.md and docs/cli.md. Replace placeholders with the operator's supplied facts.

```bash
node scripts/links.mjs draft-follow-up "<opportunity>" --sender="<business name>" --sender-contact="<contact address>"
```

Draft locally only. Read and review permission scope first. Do not send, schedule, connect mail or treat the generated draft as approval.

Ambiguous matches must be shown to the operator, never silently selected. Keep client information and generated documents private.
