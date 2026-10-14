# Cursor Marketplace submission

Prepared 2026-10-14. This is an application draft, not evidence of marketplace approval or Cursor runtime acceptance.

## Application fields

- Organization name: StateDock
- Organization handle: statedock
- Repository: https://github.com/statedock/statedock-plugins
- Website: https://statedock.dev
- Logo URL: https://statedock.dev/logo.png (the same brand asset is committed as core/assets/logo.png)
- Contact email and owner: keep the publisher's existing form values; no personal contact data is committed here.

Suggested description:

> StateDock keeps project goals, decisions, progress and handoff context available across coding sessions. This plugin provides three shared Skills: save a deferred plan, restore task context or claim one explicitly authorized READY task, and record progress or verified results through StateDock Remote MCP. It does not execute task code, launch agents, schedule work or orchestrate agents. Agents come and go. Tasks remain.

## Repository entry point

The repository contains `.cursor-plugin/marketplace.json` with one entry whose source is `core`. That directory contains the standard Agent Plugins manifest, Streamable HTTP MCP configuration and shared Skills. No native adapter or copied skill tree is introduced. Codex uses its own marketplace pointing to the same source.

## Evidence and remaining gates

Completed: official portable schema checks, package integrity tests, actual Codex installation and authenticated remote instance calls. The configured endpoint is https://statedock.dev/mcp; OAuth is handled by the host, with no bundled secret.

Before submitting, confirm the repository is public and test installation, OAuth, tool discovery and the three workflows in Cursor. Codex results do not establish Cursor behavior. The application should not claim automatic agent execution or orchestration.

The form's final Submit Application action accepts Cursor Publisher Terms. The publisher should review and accept those terms before submitting. No acceptance or submission is performed by preparing these files.

Sources: [Cursor plugin reference](https://prod.cursor.com/docs/reference/plugins) and [application page](https://cursor.com/marketplace/publish).
