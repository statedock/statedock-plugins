# OpenAI upload draft

Run `npm run pack:zip` to create a ZIP and SHA-256 file under artifacts/. The archive root contains plugin.json, mcp.json, skills/, assets/, LICENSE and README; it is not an archive of the development repository. Tests extract the ZIP, validate the manifests and compare the packaged icon.

The portable manifest includes OpenAI listing metadata and icon paths under extensions.com.openai.interface. It uses the same Remote MCP endpoint and shared Skills as other distributions. No credential, app reference, hook or agent runner is bundled.

## Current upload gate

On 2026-10-14, the Platform upload entry required a verified developer identity. The selected Personal organization showed Start for individual verification. Billing verification alone did not unblock the uploader. Complete verification personally or select an already verified organization, then retry uploading at https://platform.openai.com/plugins.

## Before requesting review

The draft includes product and support links, but privacy-policy and terms-of-service URLs have not been supplied or verified. Do not invent these pages. Reviewer access, demonstration recording and full workflow review evidence still need preparation. Keep reviewer credentials outside the ZIP. Uploading creates a draft; it does not submit for review or publish the plugin.

Official source: https://developers.openai.com/plugins/deploy/submission
