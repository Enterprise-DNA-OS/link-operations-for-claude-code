# Actual fictional demo output

Captured 29 October 2026. These are CLI results, not a customer account.

## Follow-ups worth reviewing

Which overdue follow-ups have permission recorded?

```text
node scripts/links.mjs follow-ups
  name                      campaign          owner  next_due    quiet_days
  ------------------------  ----------------  -----  ----------  ----------
  Journal research feature  Coastal research  Aroha  2026-10-26  18
```

## Placement evidence

Which placements need a closer look?

```text
node scripts/links.mjs link-checks
  name              campaign          page_url                         state    observed_on  stale  qualification_gap
  ----------------  ----------------  -------------------------------  -------  -----------  -----  -----------------
  Alpine placement  Alpine guide      https://outdoors.example/guide   live     2026-10-27   false  true             
  Coastal mention   Coastal research  https://coastnews.example/story  missing  2026-09-14   true   false
```

## Claims and observations

Do our reported wins have current placement evidence?

```text
node scripts/links.mjs client-report
  name              client           opportunities  claimed_wins  current_live  overdue
  ----------------  ---------------  -------------  ------------  ------------  -------
  Alpine guide      Alpine Example   2              2             1             0      
  Coastal research  Coastal Example  4              1             0             3
```
