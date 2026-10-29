# Verification

The test suite uses Node 22 and PGlite with a temporary fictional database. DATABASE_URL is explicitly empty during tests and demo, so local environment files cannot point them at a live database.

The CI matrix runs the same test and demo commands on ubuntu-latest and windows-latest. Its results must be checked after pushing. Portable code is not by itself proof of a Windows pass. No live Postgres service was contacted in the local run. The migration uses portable Postgres features and the common adapter, with row security, invoker views and private permissions.

The included export fixture is synthetic. No live Pitchbox account or customer export was used. The standard headings are supported aliases, with an explicit map for variations. A real migration requires an owner to reconcile source totals and evidence.

Generated HTML documents and dashboards are internal, read-only files. Tests check renderer success and HTML escaping. The comparison page includes output captured from three actual demo CLI executions.

## Completed run, 29 October 2026

Local `npm install`, `npm test` and `npm run demo` passed on Node 22.23.4 and Linux. The suite completed 69 checks and shipped 33 workflow commands. Brand lint reported zero errors; the prose scan found no TODO(author), em dashes or banned words.

[GitHub Actions run 40964911683](https://github.com/Enterprise-DNA-OS/link-operations-for-claude-code/actions/runs/40964911683) did not start any test steps. GitHub's annotation says recent account payments failed or the spending limit needs increasing. The Linux job was blocked and Windows was cancelled by the matrix. This is an account execution block, not a test failure. Windows remains unverified until the configured job can run. No billing or spending settings were changed.
