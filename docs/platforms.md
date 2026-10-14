# Platform evidence and support limits

Official sources fetched/inspected on 2026-10-14; installation support must be verified separately from format documentation.

| Platform | Verified format | Repository status |
| --- | --- | --- |
| [Agent Plugins 1.0.0](https://agent-plugins.org/specification) | Root plugin.json with required schema/name; fixed skills/ and mcp.json; streamable-http transport | Implemented; official schema validation |
| [Codex](https://developers.openai.com/plugins/build/plugins) | Portable package supported; `.codex-plugin/plugin.json` remains compatibility fallback; repo marketplace under `.agents/plugins/` | Actual isolated CLI installation test; OAuth/model invocation separate |
| [Cursor](https://prod.cursor.com/docs/reference/plugins) | Portable package supported, plus native `.cursor-plugin/plugin.json`; standard root/data variables not expanded | Shared portable package candidate; no actual Cursor installation claim |
| [Claude Code](https://code.claude.com/docs/en/plugins-reference) | Native `.claude-plugin/plugin.json`, `.mcp.json`, skills/; `claude plugin validate` checks native package | Research only; CLI unavailable in this environment |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | Cordis composition; built-in [MCP client](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/mcp/mcp-client/README.md) supports stdio and streamable-http | Implemented native 0.2.0-rc.2 Bundle; isolated CLI/Skills/remote bridge checks passed, everyday GUI/model acceptance pending |
| [OpenCode plugins](https://docs.opencode.ai/docs/plugins/) | JS/TS modules and npm plugin entries | Research only; state-only integration may need no JS plugin |
| [OpenCode MCP](https://docs.opencode.ai/docs/mcp-servers/) | Native `mcp` config uses `type: remote`; host handles OAuth | Research only; no universal manifest claimed |

Codex standalone [MCP documentation](https://developers.openai.com/codex/mcp) documents OAuth and `bearer_token_env_var`. Portable transport names differ from native Codex/Claude JSON `http` and OpenCode `remote`. Root portable manifests do not declare native `skills` or `mcpServers` path fields.

Schema snapshots in `schemas/` came directly from [plugin schema](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json) and [MCP schema](https://agent-plugins.org/schemas/1.0.0/mcp.schema.json). Validation is offline; schema updates require review rather than downloading new schemas during plugin loading.
