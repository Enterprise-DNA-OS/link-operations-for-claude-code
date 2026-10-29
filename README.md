# Link Operations for Claude Code

See which follow-up is overdue, which claimed win has evidence and which placement has gone missing. Your campaigns, permission records, opportunities and manual link observations live in a database you own. MIT licensed. Built by Enterprise DNA.

| Do it yourself | We customise it | We run it for you |
|---|---|---|
| Free. Install the base and bring a prepared opportunity export across. | Your fields, rules, reports, data migration and connections. | Installed and operated through Omni by Enterprise DNA. One setup fee, then a retainer. |
| [Quick start](#quick-start) | [Get your version built](https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=pitchbox&utm_medium=readme) | [Talk to Sam](https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=pitchbox&utm_medium=readme) |

Pitchbox Scale lists US$1,200 a month with monthly billing, or US$825 a month billed annually. That is US$14,400 or US$9,900 over a year, respectively. Both billing options carry a one-year commitment. [Vendor pricing](https://pitchbox.com/pricing/), checked 29 October 2026. This is a list-price comparison, not a verified customer invoice.

This base replaces the editorial records desk: campaign plans, existing publisher relationships, due follow-ups, placement evidence and client reports. It does not reproduce Pitchbox's discovery index, inbox, email sending, deliverability tools or automated link monitoring. An agency uses its own existing contacts and observations. No paid data provider or OAuth connection is needed to run these workflows.

## Quick start

```bash
git clone https://github.com/Enterprise-DNA-OS/link-operations-for-claude-code.git
cd link-operations-for-claude-code
npm install
npm test
npm run demo
```

Use Node 22. Tests and demo use temporary fictional data and ignore DATABASE_URL. To retain a fictional demo, run `npm run migrate` then `npm run seed`. For real work, migrate an empty private database without seeding. With no DATABASE_URL, local PGlite stores data under .data/db. Set DATABASE_URL for a private Postgres database with verified remote TLS. Back up and protect the database and its credentials.

Open this folder in Claude Code, Codex, OpenCode or Cursor and ask for /follow-ups. The same 33 command recipes work through every agent. The code makes no model calls; the agent account is separate.

```bash
node scripts/links.mjs follow-ups
node scripts/links.mjs link-checks
node scripts/links.mjs client-report
npm run view
npm run docs
```

Three read-only dashboards show the week, placements and permission exceptions. Three document types produce client placement reports, follow-up worksheets and evidence worksheets. Change your business name, logo and colours in brand.json. Keep these local reports private.

## The five weekly rituals

- /follow-ups: due work with recorded express permission for review.
- /permission-review: unknown and withdrawn permissions across active opportunities.
- /link-checks: manual observations, stale evidence and paid-link attribute gaps.
- /client-report: claimed wins beside current observed live placements.
- /weekly-review: a Monday brief from attention, link checks and compliance.

/compliance checks the limited records controls in [docs/compliance.md](docs/compliance.md). /draft-follow-up and /draft-client-report write local drafts and never send. /customise changes fields and rules through an additive migration. /new-view adds a read-only report. All reads have --json output. Names and partial IDs resolve only when unambiguous. [Every command and its options](docs/cli.md).

## Bring your Pitchbox opportunities

Use Pitchbox's Opportunity Search or Pipeline export. Its help centre documents a CSV containing domain, URL, milestone, tags and metrics. Match headings once if your export differs, then bring the prepared file across in one command:

```bash
node scripts/links.mjs import pitchbox examples/pitchbox.csv --campaign="Coastal research" --actor="Operator" --dry-run
```

Review the dry run, then omit --dry-run. Import is atomic. Identical source rows skip; changed source rows fail for reconciliation. Every original column is preserved. Unknown milestones become review. Contact permission is never inferred from a CSV. A Won milestone does not prove a live placement. The included sample is synthetic, not an untouched vendor export. [Mapping and acceptance guide](docs/replace-pitchbox.md).

## Ten questions answered from your records

/insights runs these today. These combine your own records, without claiming that Pitchbox cannot build a comparable custom report.

1. Which overdue follow-ups have recorded permission?
2. Which active opportunities have unknown or withdrawn permission?
3. Which claimed wins still lack a placement record?
4. Which paid or gifted placements lack a qualifying link attribute?
5. Which placements need a fresh observation?
6. Which campaigns report more wins than current live placements?
7. Which owners have overdue work with unresolved permission?
8. Which placements are missing at the latest observation?
9. Which publishers appear across several campaigns?
10. Which active opportunities have no next review date?

## Your first hour: ten things to ask for

1. Show this week's follow-ups.
2. Show contacts whose permission needs review.
3. Find wins with no placement evidence.
4. Show missing links and the last observation date.
5. Draft the Coastal client report.
6. Record the editor's reply using its real date.
7. Suppress an address that withdrew permission.
8. Show paid links missing a qualifying attribute.
9. Put our brand on the evidence worksheet.
10. Add our editorial priority field through /customise.

## Evidence and access

One private database serves one agency's trusted operators. Actor labels record who was named, not authenticated identity. Public privileges are revoked, row security is enabled and views use invoker permissions. The database owner can bypass these controls. This base has no public API, client portal or shared approval system.

Observations and activity history are append-only through normal operations. They are not tamper-proof against a database owner. Store source evidence privately, keep regular backups and test restores. `export` creates a full JSON archive; use normal database backup tools for disaster recovery.

## Verification

npm test exercises migrations, repeatable seed data, commands, permission changes, suppression, chronological observations, import dry runs, repeated and conflicting rows, rollback, private archives, restricted database roles and escaped HTML. GitHub Actions runs Node 22 on Windows and Linux. Local execution is Linux with PGlite; see [verification](docs/verification.md) for completed checks.

[Operating rules](CLAUDE.md), [screen-free scope](docs/why-no-front-end.md), [selection evidence](docs/research.md). MIT licence.
