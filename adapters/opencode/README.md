# StateDock for OpenCode — planned adapter

The planned OpenCode setup would provide StateDock's shared plan, pickup, and update Skills alongside a native remote MCP connection. It would record and restore task context without executing code, scheduling work, or orchestrating agents.

This directory is a research note, not an installable package. There is no OpenCode adapter or npm package yet. OpenCode's native remote MCP configuration uses `type: "remote"`; first test whether Skills plus MCP configuration are sufficient before adding a JavaScript/TypeScript plugin. Verify Skill discovery, OAuth, and a read-only StateDock instance check before claiming support.

Official references: [OpenCode Plugins](https://docs.opencode.ai/docs/plugins/) and [MCP Servers](https://docs.opencode.ai/docs/mcp-servers/).
