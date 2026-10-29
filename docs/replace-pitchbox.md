# Replace the Pitchbox opportunity desk

Checked 29 October 2026. [Pitchbox's export instructions](https://help.pitchbox.com/article/160-how-do-i-export-all-of-my-won-opportunities) describe account-wide Management Report and Opportunity Search exports, plus project Pipeline exports. The documented example filters Won opportunities. Choose the records you actually intend to bring across and reconcile the export count with the active filter; a Won-only file is not your whole history.

1. Export the relevant opportunity list. Keep the untouched original private. The vendor documents domain, URL, milestone, tags and metrics, but not a universal exact heading contract. Header labels can differ.
2. Create a campaign in the new empty database. Choose its client, owner and target resource. Import one campaign's file at a time to preserve context.
3. Match the actual headings to examples/column-map.json if necessary. Save as UTF-8 CSV. The supplied file is a synthetic contract example, not a captured customer or vendor file.
4. Run the import with --dry-run, check accepted counts and fix malformed records. Rerun without --dry-run to commit the whole file atomically.
5. Compare opportunity counts, source identifiers, URLs, milestones, tags and retained metrics. Unknown milestones become review. A Won record remains a claimed win. Attach reviewed contact records, record permission evidence, set next dates and enter placement observations separately.
6. Keep email history, attachments, prospecting subscriptions, sender connections, blocklists and automated monitoring history separately. They are not reconstructed from the opportunity export. Confirm scope and totals before retiring the old subscription.

```bash
npm run migrate
node scripts/links.mjs add-campaign --name="Editorial research" --client="Your client" --owner="Operator" --target="https://client.example/research" --actor="Operator"
node scripts/links.mjs import pitchbox imports/opportunities.csv --campaign="Editorial research" --map=examples/column-map.json --actor="Operator" --dry-run
node scripts/links.mjs import pitchbox imports/opportunities.csv --campaign="Editorial research" --map=examples/column-map.json --actor="Operator"
```

| Destination | Default labels | Behaviour |
|---|---|---|
| Source key | Opportunity ID, ID | If absent, the full URL becomes the key within this campaign. |
| Name | Name, Opportunity Name, Domain | If absent, use the URL hostname. |
| Publisher URL | URL, Opportunity URL, Website | Required absolute http or https URL. |
| Milestone | Milestone, Status | Known labels map; other labels need review. |
| Owner | Owner, Assigned To | If absent, use campaign owner. |
| Original record | Every source column | Retained as source_data, including tags and metrics. |

Imported rows have no contact attached and no presumed consent. The permission workflow records express permission for this sender and purpose; suppression applies across campaigns for a unique email address. Historical consent in another system requires independent review.

A second identical import skips existing rows without overwriting later work. A changed row under the same source key fails the whole import. Duplicate keys within one file fail. Use separate campaign exports or stable IDs when several opportunities share a URL. Do not silently merge distinct opportunities to make the import succeed.

One command imports the prepared opportunity register. Full migration, contact permissions, connection setup and acceptance are separate work. Enterprise DNA can map the wider history and build the connections your agency needs.
