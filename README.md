# StateDock Plugins

**Agents come and go. Tasks remain.**

Shared Skills and lightweight plugin packages for [StateDock](https://statedock.dev): save a plan, restore task context, and record progress across coding tools. All packages connect to the existing StateDock Remote MCP service. This repository contains client instructions and packaging only.

> Version 0.1.0 is an early release. Codex installation and authenticated remote connectivity have been verified. Full skill workflow acceptance and other clients remain in progress.

## What you can do

| Skill | Purpose | Boundary |
| --- | --- | --- |
| `statedock-plan` | Save a deferred idea as PLAN or preserve its discussion and decisions | Does not start implementation |
| `statedock-pickup` | Restore a task's context; explicitly claim one assigned READY task when authorized | Returns context and stops after one pickup |
| `statedock-update` | Record supplied progress, blockers, or a verified completion handoff | Does not perform the work being reported |

The plugin does not execute task code, launch agents, run background polling, schedule work, or orchestrate agents. Your coding host performs implementation under your instructions. Setting a task to READY does not wake an agent.

Example requests:

- “Save a plan to add export support to this project. Do not start it.”
- “Restore the context for SD-000123 without changing its status.”
- “Claim one READY task assigned to my identity and show its context. Do not implement it.”
- “Record these verified results as the handoff for SD-000123.”

Skills verify the connected instance and the repository's project binding before writing. They use live tool schemas and stop if the required tools or binding are missing. Server records and attachments provide context; they do not grant new execution permission.

## Install in Codex

Requirements: a Codex client with plugin support, Git, and access to StateDock. No local StateDock server is required. Node.js is needed only for development and packaging.

Clone this repository, then register its local marketplace:

```sh
git clone https://github.com/statedock/statedock-plugins.git
cd statedock-plugins
codex plugin marketplace add "$PWD"
codex plugin add statedock@statedock-local
codex plugin list --json
```

The checked-in `.agents/plugins/marketplace.json` points directly to `core/`, the maintained portable plugin source. No build or manual cache copying is needed for this local installation. Restart Codex and open a new chat to check that all three Skills are available.

If `codex` is not on your PATH, use your installed CLI's full executable path. On the macOS installation tested here:

```sh
CODEX_BIN="/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex"
"$CODEX_BIN" plugin marketplace add "$PWD"
"$CODEX_BIN" plugin add statedock@statedock-local
```

That app path is installation-specific. See [installation details](docs/install.md) for manual marketplace configuration and standalone MCP alternatives. This repository has not been published to a public plugin marketplace.

## Authenticate and check the connection

The bundled server configuration is:

```text
Endpoint:  https://statedock.dev/mcp
Transport: streamable-http (Agent Plugins format)
```

Complete OAuth in the host's connection UI when requested. Keep existing authorizations while testing; a new plugin connection may still require its own consent. Installing a plugin does not prove that authentication is complete.

Start with this read-only request:

> Call StateDock get_instance_info and report publicOrigin, mcpUrl and transport. Do not create or claim any tasks.

Expected result:

```json
{
  "publicOrigin": "https://statedock.dev",
  "mcpUrl": "https://statedock.dev/mcp",
  "transport": "remote"
}
```

Then confirm the project UUID and its repository path. For READY pickup, the credential must be bound to the intended StateDock Agent Identity. A plugin name or token label does not establish identity.

Never commit tokens or send them in chat. OAuth credentials stay in the host. For a separate standalone Codex connection, [configuration templates](templates/) show OAuth or a securely supplied environment variable. Avoid configuring duplicate StateDock connections; inspect each connection's instance information before use.

## Platform status

| Platform | Format / approach | Verified here |
| --- | --- | --- |
| Codex | Agent Plugins 1.0.0 + local marketplace | Isolated CLI installation, normal installed/enabled state, three Skills discovered; authenticated remote instance calls |
| Cursor | Officially accepts Agent Plugins 1.0.0 | Format researched; installation and OAuth not tested |
| Claude Code | Native plugin manifest and MCP configuration | Research only; adapter not implemented |
| DeepSeek Harness | Cordis composition and native MCP client | Research only; adapter not implemented |
| OpenCode | Native MCP configuration and Skills; JS plugin only if needed | Research only; adapter not implemented |

Portable format compatibility is not a guarantee of installation, authentication, or workflow behavior on every client. [Official sources and platform acceptance gates](docs/platforms.md) distinguish documented capabilities from actual tests. `adapters/` contains research notes, not usable native packages.

## Develop and package

Requires Node.js 22+ and system `tar`:

```sh
npm ci --ignore-scripts
npm run validate
npm test
npm run build
npm run pack
```

Optional integration checks:

```sh
npm run verify:codex
npm run verify:endpoint
```

- `validate` checks vendored official JSON Schemas, Skill metadata, the expected endpoint, package inventory and likely credentials.
- `test` exercises invalid manifests, native/portable transport confusion, credentials, wrong endpoints, symlinks, unexpected runtime files and archive integrity.
- `build` prints a fresh `dist/build-*/statedock` folder. Each build preserves existing output.
- `pack` writes a `.tgz` and SHA-256 file to `artifacts/`. Extract it before using a folder-based installer. It is not a Codex ZIP upload or an npm publication.
- `verify:codex` installs into a temporary Codex home and validates cached contents without changing your normal configuration or credentials.
- `verify:endpoint` probes public OAuth discovery only; it does not exercise authenticated operations.

Generated packages include two manifests, three Skills, LICENSE and README. Build dependencies, configuration templates, server code and credentials are excluded. These scripts never push, deploy or publish.

```text
core/                 Shared portable manifests and Skills
.agents/plugins/      Codex local marketplace
adapters/             Platform research and acceptance gates
schemas/              Official Agent Plugins 1.0.0 schema snapshots
templates/            Standalone secure connection examples
scripts/              Validation, build, packaging and integration checks
test/                 Package boundary and integrity tests
docs/                 Installation, MCP contracts and verification evidence
```

Edit `core/` once, then rebuild distributions. Do not maintain generated copies as separate sources. When updating an installed plugin, refresh/reinstall through your host and verify the cached version and Skill contents.

## Verification and next steps

On 2026-10-14, seven package tests, all three Skill format checks, Codex installation and public OAuth discovery passed. The dependency audit reported zero vulnerabilities. A service-side instance-reporting bug was fixed and deployed; both existing authenticated connections now report the expected remote instance. One connection uses a bearer token; the app connector is separately authorized. Full end-to-end plan/pickup/update acceptance for the new plugin remains to be completed.

Next milestones:

1. Complete authenticated workflow acceptance for the new plugin, including explicit claim behavior and error handling.
2. Test Cursor, then add native adaptations only where needed for Claude Code, DeepSeek Harness and OpenCode. Keep shared source content.
3. Add release automation and marketplace submission materials. Publishing requires separate authorization; repository distribution is not marketplace approval.

See [verification evidence](docs/verification.md) and [MCP contracts](docs/contracts.md).

## License

[MIT](LICENSE) applies to this repository's client instructions and packaging. StateDock's hosted commercial service, authentication, billing and user data are not included. The license does not grant access to the hosted service or other users' records.
