# StateDock for Cursor

StateDock's shared Agent Plugins package provides plan, pickup, and update Skills with the existing StateDock Remote MCP service. It records task context; it does not execute code, schedule work, or orchestrate agents.

## Availability

The repository contains Cursor marketplace metadata at `.cursor-plugin/marketplace.json`, but a Cursor installation and public listing are not verified. Do not describe this as a published Cursor Marketplace plugin yet.

## Install and verify

For a local test, copy the shared Agent Plugin into Cursor's local plugin directory:

```sh
mkdir -p ~/.cursor/plugins/local
cp -R core ~/.cursor/plugins/local/statedock
```

Restart Cursor or run **Developer: Reload Window**, then open **Customize** and confirm StateDock and its three Skills appear. This tests a local copy; it does not add a public Marketplace listing. For a published plugin, install StateDock from **Customize → Marketplace**. After installation, complete OAuth and make a read-only `get_instance_info` call before using task workflows. Avoid `PLUGIN_ROOT` or `PLUGIN_DATA` substitutions; Cursor does not expand them.

Official format reference: [Cursor Plugins](https://prod.cursor.com/docs/reference/plugins).
