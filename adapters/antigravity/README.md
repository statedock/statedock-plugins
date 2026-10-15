# StateDock for Google Antigravity

StateDock's Antigravity plugin packages the shared `statedock-pickup`, `statedock-plan`, and `statedock-update` Skills with a remote MCP connection to `https://statedock.dev/mcp`. It works with the Antigravity app, CLI, and IDE plugin format.

This adapter is version **0.1.1**. It is part of the `statedock-plugins` repository and distributed as a local build/GitHub-source plugin. Google documents an interest form for Marketplace listing; submission is a separate review process.

## About and language

Use this short About description: **“Save plans, restore task context, and record progress with StateDock.”** The plugin README, description, and bundled Skill instructions are in **English**. Google's documented `plugin.json` schema supports `name` and `description` only; it has no language property, so do not add an unsupported `language` key to the manifest. Record the language in marketplace or submission copy when that form provides a language field.

## Install from this repository

Clone this repository and point Antigravity to the plugin directory:

```sh
git clone https://github.com/statedock/statedock-plugins.git
agy plugin install ./statedock-plugins/adapters/antigravity
```

The Antigravity CLI also accepts a local plugin directory from `/plugin install <local-path>`. For project-scoped manual installation, place the built plugin directory under `.agents/plugins/`; for global installation, use `~/.gemini/config/plugins/`. Marketplace installation requires Google's separate listing process.

The CLI command is documented by Google as `agy plugin install <local-directory>`. The interactive CLI manager opens with `/plugin` (or `/plugins`); select **Install from local directory**. In the app, use **Customizations → Marketplace** only for catalog entries and **Customizations → Installed** to inspect a local/manual installation.

## Authenticate

The plugin declares the StateDock remote MCP endpoint and lets Antigravity handle OAuth where supported. Complete the host's authentication flow when prompted. Do not put access tokens in the plugin files or commit credentials. If using a separately provisioned bearer-token connection, configure it through the host's secure MCP settings rather than modifying the shared package.

Start with a read-only check: ask the agent to call StateDock `get_instance_info` and confirm `publicOrigin` is `https://statedock.dev`, `mcpUrl` is `https://statedock.dev/mcp`, and transport is remote. Confirm the intended project binding before task actions. A connected MCP does not establish Agent Identity or authorize claiming tasks.

## Updates

Antigravity syncs plugins installed through its app with the CLI's Installed list. This is cross-surface visibility, not a promise that arbitrary GitHub or local installations will automatically download new repository versions. To update a GitHub/local installation, install the new release through the supported plugin manager or replace it with a freshly built package, then check its version/components. Marketplace-managed updates depend on Google's catalog and host behavior; this repository does not claim automatic updates until verified there.

Build a fresh installable folder from this repository with `npm run build:antigravity`, or a ZIP with SHA-256 using `npm run pack:antigravity`. The ZIP contains the plugin directory contents (`plugin.json`, `mcp_config.json`, shared Skills, README, and license). The build copies the maintained `core/skills/` source; generated output is disposable. Do not edit copied skills in the built folder. The `plugin.json` follows Google's documented schema; the release version is recorded in the archive name and repository metadata.

## Scope

This plugin records and restores StateDock task state. It does not execute project code, launch agents, schedule work, or orchestrate agents. See the shared [StateDock plugin documentation](https://github.com/statedock/statedock-plugins) for behavior and limits.

Official references: [Antigravity plugin format and install commands](https://antigravity.google/docs/plugins), [Marketplace install guide](https://antigravity.google/docs/marketplace).
