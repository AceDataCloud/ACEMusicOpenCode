import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

export const INTEGRATION_ID = "acedatacloud-acemusic"
export const SERVER_NAME = "acemusic-by-acedatacloud"
export const ENDPOINT = "https://acemusic.mcp.acedata.cloud/mcp"
const skillPath = fileURLToPath(new URL("../skills/ace-music/SKILL.md", import.meta.url))

export const aceMusicPlugin = {
  id: "acedatacloud.acemusic",
  async setup(ctx) {
    const content = await readFile(skillPath, "utf8")
    await ctx.integration.transform((editor) => {
      editor.update(INTEGRATION_ID, (integration) => {
        integration.name = "ACE Music by Ace Data Cloud"
      })
      editor.method.update({
        integrationID: INTEGRATION_ID,
        method: { type: "key", label: "Ace Data Cloud API Token — ACE Music" },
      })
      editor.method.update({
        integrationID: INTEGRATION_ID,
        method: { type: "env", names: ["ACEDATACLOUD_ACEMUSIC_API_TOKEN"] },
      })
    })

    async function currentToken() {
      const connection = await ctx.integration.connection.active(INTEGRATION_ID)
      const credential = connection ? await ctx.integration.connection.resolve(connection) : undefined
      return credential?.type === "key" ? credential.key : undefined
    }

    let token = await currentToken()
    await ctx.mcp.transform((editor) => {
      if (editor.get(SERVER_NAME)) return
      editor.set(SERVER_NAME, {
        type: "remote",
        url: ENDPOINT,
        oauth: false,
        disabled: !token,
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      })
    })
    await ctx.skill.transform((editor) => {
      if (editor.get("acemusic-by-acedatacloud")) return
      editor.add({
        id: "acemusic-by-acedatacloud",
        name: "ace-music",
        description: "Create ACE Music songs and lyrics, upload reference audio, cover one owned track, blend two, and retrieve the original task.",
        path: skillPath,
        content,
      })
    })

    const controller = new AbortController()
    const events = ctx.event.subscribe({ signal: controller.signal })
    void (async () => {
      try {
        for await (const event of events) {
          if (!["server.connected", "credential.updated", "credential.switched"].includes(event.type)) continue
          const next = await currentToken()
          if (next === token) continue
          token = next
          await ctx.mcp.reload()
        }
      } catch {
        // A broken credential watch must not leave a previously saved key in use.
        if (!controller.signal.aborted && token) {
          token = undefined
          await ctx.mcp.reload().catch(() => {})
        }
      }
    })()
    return () => controller.abort()
  },
}
