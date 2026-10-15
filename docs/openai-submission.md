# OpenAI app submission

Run `npm run pack:zip` to create a ZIP and SHA-256 file under artifacts/. The archive root contains plugin.json, mcp.json, skills/, assets/, LICENSE and README; it is not an archive of the development repository. Tests extract the ZIP, validate the manifests and compare the packaged icon.

The portable manifest includes OpenAI listing metadata and icon paths under extensions.com.openai.interface. It uses the same Remote MCP endpoint and shared Skills as other distributions. No credential, app reference, hook or agent runner is bundled.

## Current submission status

The maintainer uploaded version 0.1.0, completed the review information and confirmed submission to OpenAI on 2026-10-15. The app is awaiting OpenAI review; submission does not mean approval or publication.

The listing links to the public [privacy policy](https://statedock.dev/privacy) and [terms](https://statedock.dev/terms). The portal's metadata, Skills, and MCP checks reported no findings before submission. The maintainer supplied a video walkthrough and saved positive and negative review cases in the portal.

See [review cases](openai-review-cases.json) and [walkthrough notes](openai-review-walkthrough.md) for public test scenarios and boundaries. No reviewer credentials or account-specific login details are stored here.

Official source: https://developers.openai.com/plugins/deploy/submission
