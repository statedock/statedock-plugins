# Verification

Initial Git inspection: empty worktree, main with no commits, existing origin `git@github.com:statedock/statedock-plugins.git`. Existing content was preserved. The initial implementation did not push or publish. Subsequent repository push is explicitly authorized; public marketplace publication and repository visibility changes are outside this task.

Executed 2026-10-14:

- `npm run validate`: official manifest and MCP schema validation, skill metadata, exact endpoint/transport and credential/inventory checks passed.
- `npm test`: 7 tests passed, including invalid manifest/native transport rejection, credential detection, wrong endpoint rejection, symlink rejection, unapproved runtime-file rejection, and archive extraction/content/SHA-256 roundtrip.
- `npm run pack`: generated a usable tgz and SHA-256 file. Archive contains LICENSE, README, two manifests and three Skills only; no node_modules, server implementation, templates, credentials or scripts.
- `npm run verify:codex`: actual `codex-cli 0.162.0-alpha.17.2` registered the isolated local marketplace, installed version 0.1.0, listed it as installed/enabled, and passed cached schema/three-skill content checks. Final temporary installation: `/var/folders/80/42zdf60d23d995_81fk5l8h80000gq/T/statedock-codex-b4vfuM`. This does not prove runtime skill invocation or authenticated remote discovery.
- `npm run verify:endpoint`: unauthenticated initialize POST returned the expected 401 OAuth challenge; protected resource and PKCE S256 authorization metadata passed.
- skill-creator `quick_validate.py`: all three Skills valid, using a temporary Python environment because system Python lacked PyYAML.
- `npm audit`: zero vulnerabilities after updating pinned development dependencies to ajv 8.20.0 and yaml 2.9.1. Dependencies are build-time only and are not bundled.

Official schema SHA-256 snapshots:

```text
plugin.schema.json  0a4aad95ce337878ad38802ebf0daa3fde76abe3f65400c86bcbb1ec0b3ab883
mcp.schema.json     6539175bfcdf43085855183e86da40ea94b166547a72b47ae9a0a390516d3acb
```

Remaining acceptance: full newly installed plugin tool discovery and plan/pickup/update lifecycle; runtime invocation of Skills; real installation/OAuth in Cursor, Claude Code, OpenCode and DeepSeek Harness. A future preview-platform release may require renewed format checks. The repository is MIT-licensed. Repository push has been authorized; no marketplace publication or visibility change is performed.

Production follow-up (2026-10-14): the online service was missing the public-origin argument, causing authenticated HTTP calls to report local defaults. After deploying service version `a59a0235-cdff-4d80-a7d2-06a0d1b4e9a4`, direct authenticated HTTP and both callable connections report the correct public origin, MCP URL and remote transport. The normal Codex installation is enabled and all three Skills are discoverable. A connection using an environment bearer token and a separately authorized app connector were checked; this does not establish the new plugin's full OAuth and workflow acceptance. The server fix passed 85 web/online tests, a full build and type checks. See contracts.md for the remaining acceptance gate.
