# StateDock for Claude Code — planned adapter

The planned Claude Code adapter would provide StateDock's shared plan, pickup, and update Skills through a native Claude Code plugin and connect to the existing StateDock Remote MCP service. It would record task context without executing code or orchestrating agents.

This directory is a research note, not an installable package. No Claude Code manifest or release has been built, and we have not verified installation or OAuth in Claude Code. Do not try to install this directory. Before claiming support, add the native `.claude-plugin/plugin.json` and `.mcp.json`, run `claude plugin validate`, then test Skill/tool discovery and a read-only StateDock instance check.

Official reference: [Claude Code Plugins](https://code.claude.com/docs/en/plugins-reference).
