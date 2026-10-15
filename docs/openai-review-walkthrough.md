# OpenAI review walkthrough

The maintainer confirmed that the OpenAI app was submitted for review on 2026-10-15. The review information includes the supplied video URL and positive and negative test scenarios. Submission is awaiting OpenAI review; it does not imply approval. The scenarios are instructions for reviewers, not a claim that the portal executed them.

See openai-review-cases.json for the five positive and three negative cases. Reviewers should use the dedicated sample account details provided through the review portal and keep credentials, private project content, OAuth codes and session cookies out of recordings and public source control.

## Recording sequence

1. Show the installed StateDock plugin and its three Skills.
2. Sign in with a test StateDock account and authorize its Remote MCP connection; keep credentials and codes off the recording.
3. Run the read-only instance-information case. Show the public origin, MCP URL and remote transport.
4. In a dedicated Plugin Review project, save the deferred plan. Show its returned reference and PLAN status in the web app.
5. Restore context without changing status, then record the supplied discussion update. Show the same reference.
6. On a separate WORKING fixture task, record the user-verified handoff and show DONE. Do not execute code through the plugin.
7. Demonstrate the three unrelated prompts without invoking StateDock.
8. The submitted review information contains the maintainer-provided video URL. Reviewers should confirm it is accessible from their review environment.

No reviewer credentials are included in this repository.
