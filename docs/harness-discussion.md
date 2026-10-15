Published: https://github.com/deepseek-ai/deepseek-harness/discussions/9776

# DSH | StateDock | Keep plans, task context and handoffs across coding tools

> Unofficial project, independently developed and maintained by ByteYellow. Not affiliated with or endorsed by DeepSeek.

Hi everyone — I built **StateDock**, a shared project-state service for people who move between coding tools and sessions. The Harness plugin brings the same plan / pickup / update Skills used by our Codex and Cursor packages into DSH.

**Project:** https://statedock.dev
**Source (MIT plugin code):** https://github.com/statedock/statedock-plugins
**Harness adapter and setup:** https://github.com/statedock/statedock-plugins/tree/main/adapters/deepseek-harness
**npm:** https://www.npmjs.com/package/@statedock/dsh-plugin

### What it does

- **Plan:** save a deferred idea and its discussion without starting work.
- **Pickup:** restore an existing task’s context, or claim at most one explicitly authorized READY task and stop at returning its context.
- **Update:** record user-provided progress, blockers or verified handoff results.

The goal is to keep the task, decisions and handoff available when you switch tools. The plugin does **not** execute task code, launch agents, schedule work or orchestrate agents.

### Install and connect

Version **0.1.0** targets **Harness 0.2.0-rc.2**; compatibility with other host versions has not been verified.

```sh
dsh plugin --profile web add @statedock/dsh-plugin@0.1.0
# For a desktop profile instead:
dsh plugin --profile desktop add @statedock/dsh-plugin@0.1.0
```

It is a native Cordis Bundle with a packaged Skill provider. The default installation reuses an existing authenticated StateDock Remote MCP connection at `https://statedock.dev/mcp`. A StateDock account and authorized connection are required; installing the package alone does not authenticate you. The optional native MCP component is disabled by default and uses a securely supplied environment token if enabled; see the adapter README. No token belongs in the package, chat or command arguments.

### Try it

In your own StateDock test project, with the MCP connection configured:

1. Ask: “Save a deferred plan called Review dark mode in this project. Record that it is an idea for later; do not start it.”
2. Keep the returned task reference. In a later session or another connected tool, ask: “Restore the context of [that reference] without changing its status or claiming any task.”
3. Ask: “For that plan, record this discussion: prefer system theme by default; contrast review is still pending. Keep it deferred.”

You should see the same plan and discussion in StateDock, still in PLAN. READY claiming is optional and requires an assigned Agent Identity plus explicit user authorization.

### Demo and verification

[StateDock workflow demo](https://youtu.be/X5FFUXCoGHo)

![StateDock public feature overview](https://statedock.dev/examples/feature-universe-preview-en.png)
*Public StateDock feature overview; this image is not the Harness interface.*

The published npm package was installed in an isolated Harness CLI profile. Matching native-runtime checks discovered all three shared Skills and verified a read-only Remote MCP connection. A full model-driven workflow in the everyday Harness GUI has not been independently verified.

Feedback and reproducible issues are welcome: https://github.com/statedock/statedock-plugins/issues
