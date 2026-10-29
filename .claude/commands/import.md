---
description: Import for the link operations desk
---

# import

Read CLAUDE.md and docs/cli.md. Replace placeholders with the operator's supplied facts.

```bash
node scripts/links.mjs import pitchbox examples/pitchbox.csv --campaign="<campaign>" --actor="<operator>" --dry-run
```

Read docs/replace-pitchbox.md. Match headings once, run the dry run, reconcile row counts, then rerun without --dry-run. Imported wins remain unverified until placement evidence is recorded.

Ambiguous matches must be shown to the operator, never silently selected. Keep client information and generated documents private.
