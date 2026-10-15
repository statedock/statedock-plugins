# Installation

StateDock has one shared set of Skills and platform-specific install paths. Only Codex, DeepSeek Harness and Google Antigravity currently have installable packages or verified local installation routes in this repository. ChatGPT is waiting for review; Cursor installation is not yet verified; Claude Code and OpenCode directories contain research notes only.

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

The plugin-bundled connection uses OAuth by default. For a standalone token connection, Codex's `Bearer token env var` setting takes an environment variable **name**, such as `STATEDOCK_TOKEN`, not the token value. Codex sends the token in `Authorization: Bearer <token>` automatically:

```sh
codex mcp add statedock --url https://statedock.dev/mcp --bearer-token-env-var STATEDOCK_TOKEN
```

Set `STATEDOCK_TOKEN` in the host's secure environment before connecting; its value is the raw token, without the `Bearer ` prefix. In Codex's **Bearer token env var** field, enter `STATEDOCK_TOKEN` (the variable name). Do not replace this value with `Authorization` or paste the token itself there. Codex sends `Authorization: Bearer <token>` automatically. If a host setup screen instead asks for a generic custom HTTP header, use key `Authorization` and value `Bearer <token>`; use the host's secure settings and never commit the real value. These are alternatives to OAuth; don't configure both methods for the same connection unless you intentionally need separate credentials.

After authentication, invoke a read-only tool and check instance information before enabling any state-writing workflow. If the returned instance is local or has null origin, stop and inspect the connection rather than infer identity from the plugin name or OAuth UI.

## Portable clients

The package has root `plugin.json`, root `mcp.json`, and immediate `skills/*/SKILL.md`. Codex and Cursor document this format; actual Cursor installation and OAuth have not been tested here. Follow that host's installation UI and verify the three skills plus StateDock tools. Never rename portable `mcp.json` to a native config without translating the transport format.

Cursor can use the shared portable package format, but installation and OAuth have not been verified in this repository. For a local test, copy `core/` to `~/.cursor/plugins/local/statedock`, restart Cursor or run **Developer: Reload Window**, then inspect **Customize**. For a published plugin, install it from **Customize → Marketplace** after approval. See the [Cursor guide](../adapters/cursor/README.md) and [Cursor's plugin instructions](https://cursor.com/docs/plugins).

DeepSeek Harness has a separate native Cordis Bundle, not a portable Agent Plugins package. Install the published `@statedock/dsh-plugin@0.1.0` with `dsh plugin --profile web add @statedock/dsh-plugin@0.1.0` (or select `--profile desktop`). Its optional MCP component stays disabled by default and reuses an existing connection unless explicitly enabled. See [the Harness guide](../adapters/deepseek-harness/README.md).

Google Antigravity has a native adapter under `adapters/antigravity/`. Build it with `npm run build:antigravity`, then install the printed plugin directory with `agy plugin install /absolute/path/to/statedock`. The app can also install a local directory from its Customizations/plugin manager; Google's docs describe workspace placement at `.agents/plugins/` and global placement at `~/.gemini/config/plugins/`. See [the Antigravity guide](../adapters/antigravity/README.md).

The ChatGPT app's version 0.1.0 submission is awaiting review. Claude Code and OpenCode currently have research notes only and are not installable packages.
