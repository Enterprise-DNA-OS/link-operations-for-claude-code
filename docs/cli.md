# CLI reference

Use Node 22. Options have the form --key=value. Add --json for machine output. Writes require --actor, a declared audit label, not an authenticated identity. Names match without case sensitivity; ambiguous partial names and IDs list candidates and exit 1. Dates are UTC calendar dates. Historical evidence cannot be future-dated.

## campaigns

```bash
node scripts/links.mjs campaigns
```

## contacts

```bash
node scripts/links.mjs contacts
```

## opportunities

```bash
node scripts/links.mjs opportunities
```

## opportunity

```bash
node scripts/links.mjs opportunity "<name or id>"
```

## follow-ups

```bash
node scripts/links.mjs follow-ups
```

## permission-review

```bash
node scripts/links.mjs permission-review
```

## link-checks

```bash
node scripts/links.mjs link-checks
```

## client-report

```bash
node scripts/links.mjs client-report
```

## attention

```bash
node scripts/links.mjs attention
```

## compliance

```bash
node scripts/links.mjs compliance
```

## history

```bash
node scripts/links.mjs history
```

## insights

```bash
node scripts/links.mjs insights
```

## weekly-review

```bash
node scripts/links.mjs weekly-review
```

## add-campaign

```bash
node scripts/links.mjs add-campaign --name="<campaign>" --client="<client>" --owner="<owner>" --target="https://example.com/resource" --actor="<operator>"
```

## close-campaign

```bash
node scripts/links.mjs close-campaign "<campaign>" --actor="<operator>"
```

## add-contact

```bash
node scripts/links.mjs add-contact --name="<name>" --email="<address>" --actor="<operator>"
```

## permission

```bash
node scripts/links.mjs permission "<contact>" --evidence="<source and scope>" --date=YYYY-MM-DD --actor="<operator>"
```

## suppress

```bash
node scripts/links.mjs suppress "<contact>" --evidence="<withdrawal reference>" --actor="<operator>"
```

## add

```bash
node scripts/links.mjs add --campaign="<campaign>" --name="<opportunity>" --url="https://publisher.example" --owner="<owner>" --due=YYYY-MM-DD --actor="<operator>"
```

## attach-contact

```bash
node scripts/links.mjs attach-contact "<opportunity>" --contact="<contact>" --actor="<operator>"
```

## plan

```bash
node scripts/links.mjs plan "<opportunity>" --due=YYYY-MM-DD --owner="<owner>" --actor="<operator>"
```

## move

```bash
node scripts/links.mjs move "<opportunity>" --milestone=review --actor="<operator>"
```

## log

```bash
node scripts/links.mjs log "<opportunity>" --kind=note --note="<what actually happened>" --date=YYYY-MM-DD --actor="<operator>"
```

## record-placement

```bash
node scripts/links.mjs record-placement "<opportunity>" --page="https://publisher.example/story" --target="https://client.example/resource" --consideration=none --actor="<operator>"
```

## observe

```bash
node scripts/links.mjs observe "<placement>" --state=live --date=YYYY-MM-DD --rel=sponsored --evidence="<manual observation reference>" --actor="<operator>"
```

## import

```bash
node scripts/links.mjs import pitchbox examples/pitchbox.csv --campaign="<campaign>" --actor="<operator>" --dry-run
```

## export

```bash
node scripts/links.mjs export
```

## draft-follow-up

```bash
node scripts/links.mjs draft-follow-up "<opportunity>" --sender="<business name>" --sender-contact="<contact address>"
```

## draft-client-report

```bash
node scripts/links.mjs draft-client-report "<campaign>"
```

## view

```bash
npm run view
```

## documents

```bash
npm run docs
```

Milestones: prospect, review, contacted, reply, won, lost, paused. A milestone is a claimed workflow state, not proof of a live link. Activity kinds: note, reply, follow-up, review. Observations: live, missing, unknown. Consideration: none, paid, gifted, unknown. Links are manually observed; there is no crawler. Permission starts unknown. Suppression is immediate and cannot be reversed by this base. Export produces a complete JSON archive, not a PostgreSQL backup or restore utility.
