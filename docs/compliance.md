# Permission and placement evidence controls

Checked 29 October 2026. This is an editorial records desk, not legal advice, a certification service or an email sender. The operator determines which law applies and whether any proposed message fits the recorded permission. It does not perform legal review or verify the contents of evidence references.

| Record check | Implemented behaviour | Source and scope |
|---|---|---|
| Permission evidence | New contacts and imported opportunities start unknown. A follow-up draft requires express permission with date and evidence, and an active campaign. | [NZ DIA](https://www.dia.govt.nz/Spam-Three-Steps) and [ACMA](https://www.acma.gov.au/avoid-sending-spam) require consent for commercial electronic messages. Express-only is this base's narrower local policy, not a claim that it is the only lawful basis. |
| Withdrawal | Suppression takes effect immediately and applies to the unique address across campaigns. The base cannot remove it. | Both authorities describe action within five working days. Immediate exclusion is our stricter workflow; no holiday calendar or legal deadline calculator is claimed. |
| Sender and unsubscribe text | Follow-up drafts require sender identity and contact details and include a reply-to-unsubscribe line. | These are draft completeness checks. The operator must maintain a real working unsubscribe method and correct sender details before any external sending. |
| Paid or gifted links | A recorded placement with consideration needs a recorded sponsored or nofollow attribute, otherwise it appears in compliance. | [Google's outbound-link guidance](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) covers paid-link qualification. Google policy is not legislation. |
| Evidence freshness | A manual observation older than 30 calendar days, or missing, is flagged. | Local review policy, not a statutory retention period. |
| Claimed wins | A Won milestone without a placement record appears in compliance. Current live counts require a latest live observation within 30 days. | Local reporting policy. Observed live does not prove traffic, ranking value or Google policy compliance. |

There is no contact discovery, scraping, mail connection or sending capability. Do not use this system to purchase manipulative links or to run unsolicited bulk messages. An unknown email or a published contact address is not consent evidence. The code never grants permission on import.

Retention periods, evidence storage, access and client boundaries must be set by the agency. Audit entries are append-only for normal operations but the database owner remains privileged. A declared --actor is not a verified person or signature. Keep one private agency database, protect credentials and add authenticated, scoped access before broader shared use.
