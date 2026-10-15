# StateDock for DeepSeek Harness

A native Cordis Bundle for DeepSeek Harness **0.2.0-rc.2**, matching the desktop release tested on 2026-10-14. Its only default component is a packaged Skill provider. It reuses the shared plan/pickup/update instructions and your existing StateDock Remote MCP connection.

The adapter does not execute task code, create agents, run model turns, schedule work or orchestrate agents. It contains no StateDock server implementation. Other Harness versions are not claimed compatible; exact host peers intentionally prevent untested upgrades.

## Build

From the statedock-plugins repository:

```sh
npm ci --ignore-scripts
npm run build:harness
```

The output gives a package directory and `statedock-dsh-plugin-0.1.1.tgz`. Shared Skills and the logo are copied during build; edit `core/` rather than generated files. No registry publication occurs.

## Install from npm

Published publicly as `@statedock/dsh-plugin@0.1.0`. The updated 0.1.1 package is prepared locally but is not published. On 2026-10-14, the official npm registry returned the released version and an isolated Harness CLI profile successfully installed it from the registry.

```sh
dsh plugin --profile web add @statedock/dsh-plugin@0.1.0
# For the desktop profile instead:
dsh plugin --profile desktop add @statedock/dsh-plugin@0.1.0
```

Use the matching 0.2.0-rc.2 Harness runtime. The default plugin reuses your existing authenticated StateDock MCP connection.

## Install in your desktop profile

In Harness's Plugins install view, enter the absolute path of the generated `.tgz` or package directory. Enable StateDock after installation. Keep your existing `mcp-statedock` connection and its credentials unchanged. Use the Plugins view to confirm `statedock-skills` is enabled and `statedock-remote-mcp` remains disabled.

CLI alternative with the matching official runtime (replace the tarball path):

```sh
npx --yes @deepseek-ai/dsh@0.2.0-rc.2 plugin --profile desktop add @statedock/dsh-plugin@0.1.0 --ignore-scripts --config.auto-install-peers=false
```

The desktop application supplies host packages; do not install new peer versions over them. Restart the desktop host if its composition does not reload. Installation changes the selected profile, so use a scratch profile for experiments. Remove or disable through the same plugin manager rather than deleting host files manually.

## Authentication

The default Bundle does not introduce a second MCP connection. The observed desktop profile already has an authenticated Streamable HTTP entry for `https://statedock.dev/mcp`, which the Skills can reuse.

For a host without an existing connection, `statedock-remote-mcp` is an optional component. Securely provide `STATEDOCK_TOKEN` to the Harness process, then explicitly enable that component. It uses the host's native MCP client under the distinct `statedock_plugin` namespace and fails clearly if the environment variable is absent. Do not paste the token into chats, the package, patch files or command arguments. Avoid logging composed configuration when credentials are in use.

The inspected 0.2.0-rc.2 native HTTP transport accepts headers; it does not configure an OAuth authProvider. This adapter therefore does not claim automatic native OAuth. Existing host-managed authorization can be reused. No external OAuth proxy or subprocess bridge is installed by this package.

Before writes, require get_instance_info to report `https://statedock.dev`, `https://statedock.dev/mcp`, and `remote`. Confirm the repository/project UUID and credential identity. Pickup claims at most one explicitly authorized READY task and returns context without implementation.

## Verification

The reproducible check uses matching host modules, not copied host code:

```sh
STATEDOCK_DSH_RUNTIME=/absolute/path/to/runtime npm run verify:harness
# Optional: with STATEDOCK_TOKEN already supplied securely to this process
STATEDOCK_DSH_RUNTIME=/absolute/path/to/runtime npm run verify:harness -- --remote
```

The runtime directory must contain `node_modules/@deepseek-ai/` with dsh, Cordis and native Skill/MCP modules. For this development run, the installed desktop's ASAR was extracted into a temporary directory using the official `@electron/asar` CLI; the app bundle was not edited.

Verified with the installed desktop runtime: all three Skills are discovered and their loaded bodies match shared sources; provider disposal removes them; the actual DSH CLI installs the tgz in a fresh temporary home and composes both Bundle rows, with optional MCP disabled. A separate native MCP bridge test discovers 26 tools and calls only get_instance_info against the live server; disposal removes the registered tools. That bridge test uses a capture registry to avoid creating agents or model sessions.

Limits: the everyday desktop profile was not changed; Computer Use access to DeepSeek Harness was denied. GUI installation, preset visibility, model invocation and write/claim workflows still need user acceptance. The existing MCP credentials were not copied into the package or modified.

Sources: [native MCP client](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/mcp/mcp-client/README.md), [Skill filesystem provider](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/skill/skill-filesystem/README.md), [Bundle management](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/plugin-manager/README.md). Runtime behavior was checked against the installed 0.2.0-rc.2 build, commit 5e9e301dd9dc8923b2762f76dacfc5751f6ca851, because upstream master is newer.
