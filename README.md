# ACE Music for OpenCode 2

[简体中文](readme/README_zh_Hans.md)

Create ACE Music songs and lyrics, upload reference audio, cover one owned track, blend two, and retrieve the original task. This OpenCode 2 integration connects to the [hosted ACE Music MCP](https://platform.acedata.cloud/documents/mcp-acemusic). You can use the plugin independently of other music integrations.

## Install

```sh
opencode plugin add github:AceDataCloud/ACEMusicOpenCode
```

Requires OpenCode 2.0.26 or newer in the 2.x series. In OpenCode use `/connect` and select ACE Music by Ace Data Cloud, or expose `ACEDATACLOUD_ACEMUSIC_API_TOKEN` to OpenCode using your secret manager. Reconnect after changing the key. Get a general or service API key with ACE Music access from [Applications](https://platform.acedata.cloud/console/applications). Enter the raw key through the client configuration. Keep it out of prompts and repositories.

## First use

Ask “List the ACE Music models and capabilities.” This only reads service information. To make a song, describe the idea or provide the title, lyrics and style. A successful song task returns two candidates. Uploading a reference and generating lyrics are separate billable actions. For a cover, supply one owned audio ID; for a mashup, two different compatible IDs. Keep the returned task ID and query it after reconnecting. [Pricing](https://platform.acedata.cloud/services/acemusic) · [MCP tool reference](https://platform.acedata.cloud/documents/mcp-acemusic)
