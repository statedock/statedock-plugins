# StateDock Plugins

**Agents come and go. Tasks remain.**

Shared Skills and lightweight plugin packages for [StateDock](https://statedock.dev): save a plan, restore task context, and record progress across coding tools. All packages connect to the existing StateDock Remote MCP service. This repository contains client instructions and packaging only.

> Version 0.1.1 adds structured Git Code Reference guidance to task pickup and completion. Codex local marketplace installation and authenticated remote connectivity have been verified. DeepSeek Harness and ChatGPT distributions at 0.1.0 remain the published/submitted versions; updated 0.1.1 packages are prepared locally and have not been published or resubmitted.

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

### Codex authentication

The plugin's bundled Remote MCP connection uses the host's OAuth flow by default. Install the plugin, authorize StateDock when Codex prompts you, then start a new chat. Do not replace this with a second connection unless you intentionally want a separate token-based setup.

For a standalone Codex MCP connection using a StateDock token, Codex can add the bearer scheme for you. Set the environment variable securely and configure its **name**, not the token itself:

```sh
codex mcp add statedock --url https://statedock.dev/mcp --bearer-token-env-var STATEDOCK_TOKEN
```

Set `STATEDOCK_TOKEN` in the host's secure environment before connecting; keep its value as the raw token without the `Bearer ` prefix. The resulting request header is `Authorization: Bearer <token>`. In a Codex connection screen, the **Bearer token env var** field takes `STATEDOCK_TOKEN` (the variable name), not `Authorization` and not the token value. If the host instead provides generic custom-header fields, use **Key** `Authorization` and **Value** `Bearer <token>`. Never commit a real token or paste one into shared files. OAuth and a manually configured bearer token are alternative authentication methods.

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

## Platform introductions and installation

StateDock provides the same three workflows on hosts that support the shared Agent Plugins package: save a deferred plan, restore task context, and record progress or a verified handoff. The integration stores and restores task state; it does not run code, launch agents, schedule work, or orchestrate agents. Installability and review status differ by platform:

| Platform | What the integration provides | Current distribution and install path |
| --- | --- | --- |
| **Codex** | Shared plan, pickup, and update Skills plus StateDock Remote MCP. | Install from this repository's local marketplace using the commands above. This has been verified in an isolated Codex CLI profile. It is not a public Codex Marketplace listing. |
| **ChatGPT app** | The same shared Skills and authenticated StateDock MCP connection. | Version 0.1.0 is submitted for review. It will be discoverable in the ChatGPT plugin directory after approval and publication; 0.1.1 is prepared locally but has not been resubmitted. |
| **Cursor** | The shared Agent Plugins package, with no Cursor-specific service code. | Repository marketplace metadata and local-test instructions are present. A real Cursor install and Marketplace listing still need verification; see the [Cursor guide](adapters/cursor/README.md) and [submission notes](docs/cursor-submission.md). |
| **DeepSeek Harness** | Native Cordis Bundle containing the shared Skills; an optional MCP component can connect to StateDock when explicitly enabled. | `@statedock/dsh-plugin@0.1.0` is published on npm. Install with `dsh plugin --profile web add @statedock/dsh-plugin@0.1.0` or use `--profile desktop`. See the [Harness guide](adapters/deepseek-harness/README.md). |
| **Google Antigravity** | Native plugin manifest and remote MCP configuration, packaged with the shared Skills. | The adapter is in this repository at `adapters/antigravity/`. Build and install it locally as described below. Marketplace inclusion requires Google's separate review. |
| **Claude Code** | Planned native manifest and MCP configuration around the shared Skills. | Research notes only; there is no installable Claude Code package yet. |
| **OpenCode** | Planned native MCP connection and shared Skills. | Research notes only; there is no installable OpenCode package yet. |

### Google Antigravity

The Antigravity adapter's **About** copy is: “Save plans, restore task context, and record progress with StateDock.” **Language: English** (plugin description, README, and bundled Skill instructions). Google’s documented `plugin.json` schema accepts the plugin name and description and rejects extra fields, so language belongs in the About/listing text rather than the manifest.

To build an installable plugin folder and ZIP from the repository root:

```sh
npm ci --ignore-scripts
npm run build:antigravity
npm run pack:antigravity
```

The build prints the plugin folder under `dist/antigravity-*/statedock`; the ZIP and SHA-256 file are written under `artifacts/`. In Antigravity CLI, install the folder printed by the build:

```sh
agy plugin install /absolute/path/to/dist/antigravity-.../statedock
agy plugin list
```

Or start the interactive CLI and use `/plugin`, then choose **Install from local directory**. For a workspace-scoped manual install, copy the built `statedock` folder to `<workspace>/.agents/plugins/`; for all workspaces, use `~/.gemini/config/plugins/`. In the Antigravity app, open **Customizations → Installed** to review the installed plugin. These local installation routes are documented by Google; they do not mean the plugin is already listed in Google's Marketplace. See the [Antigravity adapter guide](adapters/antigravity/README.md).

The plugin connects to `https://statedock.dev/mcp`. Complete the host's supported authentication flow, then verify `get_instance_info` reports `publicOrigin=https://statedock.dev`, `mcpUrl=https://statedock.dev/mcp`, and remote transport before using StateDock task workflows. Do not add a token to `mcp_config.json`.

### DeepSeek Harness

The Harness adapter exposes StateDock's shared planning, context pickup, and progress handoff Skills. Its optional native MCP component is disabled by default so it does not create a duplicate connection when Harness already has an authenticated StateDock server. Install the published package with:

```sh
dsh plugin --profile web add @statedock/dsh-plugin@0.1.0
# Or install into the desktop profile:
dsh plugin --profile desktop add @statedock/dsh-plugin@0.1.0
```

The local 0.1.1 package is not yet published. See the [Harness adapter guide](adapters/deepseek-harness/README.md) for authentication, optional MCP setup, and verification.

### ChatGPT app and Cursor

The ChatGPT app package is awaiting review; users cannot install it from the public directory until OpenAI approves and it is published. Cursor's repository marketplace metadata is included, but we do not claim a completed marketplace listing or a verified Cursor install. Follow the platform submission notes linked above for current gates.

Claude Code and OpenCode currently have research notes only. Do not use their adapter directories as install packages yet.

## Cursor Marketplace application

The root `.cursor-plugin/marketplace.json` exposes the same portable plugin in `core/` for repository discovery. A brand logo is committed under `core/assets/`. See [submission fields and remaining acceptance checks](docs/cursor-submission.md). Marketplace materials are being prepared; actual Cursor installation and marketplace approval are not yet verified.

## Published and submitted listings

- **DeepSeek Harness:** [`@statedock/dsh-plugin`](https://www.npmjs.com/package/@statedock/dsh-plugin) `0.1.0` is published for Harness `0.2.0-rc.2`; updated `0.1.1` is prepared locally but not published. The project is introduced in the [official Show Your Plugins discussion](https://github.com/deepseek-ai/deepseek-harness/discussions/9776). A curated-directory contribution is prepared and will be submitted after its repository-age requirement is met.
- **ChatGPT app:** version `0.1.0` is submitted to OpenAI for review; updated `0.1.1` package materials are prepared locally but not resubmitted. Approval and publication are pending.
- **Codex:** installable from this GitHub repository as a local marketplace. This is not a Codex Marketplace listing.
- **Cursor:** Marketplace submission materials are in preparation; installation and approval remain unverified.

Portable format compatibility is not a guarantee of installation, authentication, or workflow behavior on every client. [Official sources and platform acceptance gates](docs/platforms.md) distinguish documented capabilities from actual tests.

## Develop and package

Requires Node.js 22+ and system `tar`:

```sh
npm ci --ignore-scripts
npm run validate
npm test
npm run build
npm run pack
npm run pack:zip
```

Optional integration checks:

```sh
npm run verify:codex
npm run verify:endpoint
```

- `validate` checks vendored official JSON Schemas, Skill metadata, the expected endpoint, package inventory and likely credentials.
- `validate:antigravity` checks the native Antigravity manifest, remote MCP endpoint and shared Skill inventory; `build:antigravity` creates an installable folder and `pack:antigravity` creates a ZIP with SHA-256. These do not publish or submit to Google's Marketplace.
- `test` exercises invalid manifests, native/portable transport confusion, credentials, wrong endpoints, symlinks, unexpected runtime files and archive integrity.
- `build` prints a fresh `dist/build-*/statedock` folder. Each build preserves existing output.
- `pack` writes a `.tgz` and SHA-256 file to `artifacts/`. Extract it before using a folder-based installer. It is not a Codex ZIP upload or an npm publication.
- `verify:codex` installs into a temporary Codex home and validates cached contents without changing your normal configuration or credentials.
- `verify:endpoint` probes public OAuth discovery only; it does not exercise authenticated operations.

Generated core packages include two manifests, three Skills, the brand logo, LICENSE and README. `pack:zip` creates a ZIP with the plugin files at the archive root for OpenAI upload. The separate Antigravity adapter contains its native manifest, MCP configuration, three Skills, LICENSE and platform README. Build dependencies, configuration templates, server code and credentials are excluded. These scripts never push, deploy or publish.

```text
core/                 Shared portable manifests and Skills
.agents/plugins/      Codex local marketplace
.cursor-plugin/       Cursor repository marketplace
core/assets/          Shared publisher brand logo
adapters/             Harness Bundle sources and other platform research
adapters/antigravity/ Google Antigravity native plugin source and setup guide
schemas/              Official Agent Plugins 1.0.0 schema snapshots
templates/            Standalone secure connection examples
scripts/              Validation, build, packaging and integration checks
test/                 Package boundary and integrity tests
docs/                 Installation, MCP contracts and verification evidence
```

Edit `core/` once, then rebuild distributions. Do not maintain generated copies as separate sources. When updating an installed plugin, refresh/reinstall through your host and verify the cached version and Skill contents.

## DeepSeek Harness

Run `npm run build:harness` to produce the native `@statedock/dsh-plugin` tgz for the tested 0.2.0-rc.2 host. Default installation reuses an existing authenticated StateDock connection. The optional environment-token connection is disabled until explicitly enabled. See [installation and verification](adapters/deepseek-harness/README.md).

## Verification and next steps

On 2026-10-14, seven package tests, all three Skill format checks, Codex installation and public OAuth discovery passed. The dependency audit reported zero vulnerabilities. A service-side instance-reporting bug was fixed and deployed; both existing authenticated connections now report the expected remote instance. One connection uses a bearer token; the app connector is separately authorized. Full end-to-end plan/pickup/update acceptance for the new plugin remains to be completed.

Next milestones:

1. Complete authenticated workflow acceptance for the new plugin, including explicit claim behavior and error handling.
2. Test Cursor, then add native adaptations only where needed for Claude Code, DeepSeek Harness and OpenCode. Keep shared source content.
3. Add release automation and marketplace submission materials. Publishing requires separate authorization; repository distribution is not marketplace approval.

See [verification evidence](docs/verification.md) and [MCP contracts](docs/contracts.md).

## License

[MIT](LICENSE) applies to this repository's client instructions and packaging. StateDock's hosted commercial service, authentication, billing and user data are not included. The license does not grant access to the hosted service or other users' records.
