# Link Operations for Claude Code

Run one agency's private editorial link records desk. One database per agency, operated by trusted staff. This is not a public multi-tenant service. Read the CLI result before answering.

## Rules

- Never send, schedule outreach, publish, purchase links or scrape contacts. Drafts stay local.
- Unknown and withdrawn permissions block follow-up drafts. Record evidence and scope for express permission. Suppression applies across campaigns through the unique contact address.
- Claimed wins and observed placements are different records. Never invent live links, link attributes, traffic, rankings or returns.
- Every mutation names --actor. This is an audit label, not authenticated identity. Keep database access restricted.
- Use ISO dates and real evidence references. Observation freshness of 30 days and quiet work of 14 days are local policies, not statutory periods.
- Keep real data, imports, exports, reports and credentials out of Git. Back up before additive schema changes.
- Run npm test after changes. Use the existing CLI and commands, not a parallel workflow.

## Routing

- /campaigns: .claude/commands/campaigns.md
- /contacts: .claude/commands/contacts.md
- /opportunities: .claude/commands/opportunities.md
- /opportunity: .claude/commands/opportunity.md
- /follow-ups: .claude/commands/follow-ups.md
- /permission-review: .claude/commands/permission-review.md
- /link-checks: .claude/commands/link-checks.md
- /client-report: .claude/commands/client-report.md
- /attention: .claude/commands/attention.md
- /compliance: .claude/commands/compliance.md
- /history: .claude/commands/history.md
- /insights: .claude/commands/insights.md
- /weekly-review: .claude/commands/weekly-review.md
- /add-campaign: .claude/commands/add-campaign.md
- /close-campaign: .claude/commands/close-campaign.md
- /add-contact: .claude/commands/add-contact.md
- /permission: .claude/commands/permission.md
- /suppress: .claude/commands/suppress.md
- /add: .claude/commands/add.md
- /attach-contact: .claude/commands/attach-contact.md
- /plan: .claude/commands/plan.md
- /move: .claude/commands/move.md
- /log: .claude/commands/log.md
- /record-placement: .claude/commands/record-placement.md
- /observe: .claude/commands/observe.md
- /import: .claude/commands/import.md
- /export: .claude/commands/export.md
- /draft-follow-up: .claude/commands/draft-follow-up.md
- /draft-client-report: .claude/commands/draft-client-report.md
- /view: .claude/commands/view.md
- /documents: .claude/commands/documents.md
- /customise: .claude/commands/customise.md
- /new-view: .claude/commands/new-view.md

## Storage

DATABASE_URL selects private Postgres. Unset uses local PGlite. Row security and revoked public permissions block unrelated roles; the database owner has full access. No public API is provided. Read docs/compliance.md and docs/replace-pitchbox.md before using real records.
