# New view

Read CLAUDE.md. Turn the operator's question into a read-only query against the existing records. Add a named entry to views.json. If a new database view is needed, use an additive migration and security_invoker=true, revoke public access and test restricted-role access. Render with npm run view, inspect the HTML and show the output path. Do not add a server, form or action button.
