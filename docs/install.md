# Installation

## Codex local test

`npm run verify:codex` creates a temporary marketplace and child-only `CODEX_HOME`, installs the freshly built portable package with the actual Codex CLI, lists it and verifies cached skills. It never reads or changes the user's credentials/configuration. This checks installation, not authenticated tool discovery or model execution. Temporary paths are printed for inspection.

For normal installation from this repository, register the repository path directly; its checked-in marketplace points to `./core`, so no build is required. For a standalone generated distribution, build and copy the printed plugin directory to `plugins/statedock` in a repository of your choice. Create or merge `.agents/plugins/marketplace.json` at that repository root:

```json
{
  "name": "statedock-local",
  "plugins": [{
    "name": "statedock",
    "source": { "source": "local", "path": "./plugins/statedock" },
    "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
    "category": "Productivity"
  }]
}
```

`source.path` is relative to the marketplace repository root. Preserve other marketplace entries. With a CLI supporting `plugin`:

```sh
codex plugin marketplace add /absolute/path/to/marketplace-repository
codex plugin add statedock@statedock-local
codex plugin list --json
```

Authenticate the bundled MCP through the host's connection UI. The smoke test does not log in. For a **standalone** connection instead, merge `templates/codex.oauth.toml`, then run `codex mcp login statedock`. Never replace an existing local connection silently. The token template is an alternative requiring a securely supplied `STATEDOCK_TOKEN`; it contains no secret value.

After authentication, invoke a read-only tool and check instance information before enabling any state-writing workflow. If the returned instance is local or has null origin, stop and inspect the connection rather than infer identity from the plugin name or OAuth UI.

## Portable clients

The package has root `plugin.json`, root `mcp.json`, and immediate `skills/*/SKILL.md`. Codex and Cursor document this format; actual Cursor installation and OAuth have not been tested here. Follow that host's installation UI and verify the three skills plus StateDock tools. Never rename portable `mcp.json` to a native config without translating the transport format.

Claude Code, OpenCode and DeepSeek Harness need platform-specific installation/configuration work; their research notes are not installation packages. No support is claimed until tested.
