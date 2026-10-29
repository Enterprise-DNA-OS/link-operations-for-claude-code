# Customise

Read CLAUDE.md and docs/cli.md. Agree the requested field, label or rule with the operator. Back up the private database first. Add a numbered migration; never edit an applied migration. Update the CLI, documents and affected command recipe together. Test the change against a temporary database, run npm test, then apply the migration to the selected private database. Verify the result and explain it in chat. Never weaken permission checks to make a test pass.
