# Remote MCP contract evidence

Checked 2026-10-14. Public [StateDock setup guide](https://statedock.dev/agent.md) identifies `https://statedock.dev/mcp`. Unauthenticated initialize POST returns 401 and points to OAuth protected-resource metadata. The resource advertises that same URL; authorization metadata advertises PKCE S256, read/write scopes and authorization-code flow.

The setup guide contains historical stdio bridge and literal-token examples. This repository uses current official host-native Remote MCP/OAuth documentation instead; it does not copy those credential examples or install lifecycle rules automatically.

Read-only inspection of the existing StateDock repository confirmed that the online session service imports the shared MCP tool registration. No implementation was copied. Relevant tool inputs, also exposed by current connected local tools:

| Raw tool | Inputs used by skills | Effect |
| --- | --- | --- |
| get_instance_info | {} | origin, MCP URL, transport, agent identity |
| list_projects | {} | available projects |
| get_project / resume_project | project UUID | project binding / context |
| get_plan | reference | existing task |
| create_plan | project, title, body, status: PLAN | save deferred idea |
| update_plan | reference, body/summary/status | record authorized changes |
| claim_next_task | project, mode: mine or authorized unassigned | atomically claim one READY; result `{claimed, plan?}` |
| pause_task | reference, reason | WAITING; configured server notifications may fire |
| submit_handoff | reference, changes, verification, nextSteps, optional codeReference | summary and DONE; stores codeReference separately when supplied |

`codeReference` contains a full Git commit SHA, branch (nullable for detached HEAD), `workingTree: clean | dirty`, and optional repository identifier and credential-free HTTPS commit or pull-request URL. Omit it when no Git repository is available. A dirty state makes clear that HEAD may not include all work; this is a locator, not verification or independent review evidence.

These are source/schema evidence, not proof that a particular authenticated remote deployment exposes them. Skills must inspect live schemas and stop when required tools are missing. Host tool prefixes are not fixed.

Initial calls returned local/default instance information because the online service omitted the public origin when constructing its MCP server. A direct authenticated HTTP probe reproduced the same result, establishing a server-side reporting bug rather than proving a local connection. After the 2026-10-14 service fix, both callable connections report `publicOrigin: https://statedock.dev`, `mcpUrl: https://statedock.dev/mcp` and `transport: remote`. This confirms authenticated remote instance calls, not full workflow acceptance for the newly installed plugin.

## Authenticated remote acceptance gate

In a host actually connected to the expected endpoint:

1. Discover live tools; call get_instance_info and require exact origin/URL and remote transport. Confirm credential-bound identity for pickup.
2. Read list_projects, confirm project UUID/localPath, then resume_project and get_plan. Never guess or fall back to another instance.
3. With explicit permission for disposable test records, create a PLAN, revise its body, read it back, and record the cancellation as DROPPED. For claim testing, arrange a disposable READY assigned to this identity first; claim once, verify project, then hand off with truthful evidence and read DONE back.
4. Test scope denial and no-READY behavior without touching real tasks. Do not claim unrelated work or send external messages.

The plugin does not run this gate automatically. Credentials remain in the host; no token is requested in chat or committed.
