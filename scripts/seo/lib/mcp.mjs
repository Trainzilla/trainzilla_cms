// Minimal client for the Payload MCP endpoint (@payloadcms/plugin-mcp).
//
// Transport: HTTP Streamable — POST /api/mcp, Bearer auth, JSON-RPC 2.0,
// response framed as Server-Sent Events (one `data: ` line carries the JSON).
//
// Every create/update routed through here is forced to `draft: true` by the
// server-side `mcpDraftGuard` hook — publishing is only possible by a human in
// the Payload admin UI. That is deliberate: this pipeline never publishes.
//
// Needs env TRAINZILLA_CMS_MCP_KEY. Never commit the key; it lives in the
// gitignored MCP_LOCAL_NOTES.md and in the shell env of whoever runs apply.

const MCP_URL = process.env.TRAINZILLA_CMS_MCP_URL || 'https://cms.trainzilla.in/api/mcp'
const KEY = process.env.TRAINZILLA_CMS_MCP_KEY

export function requireKey() {
  if (!KEY) {
    console.error(
      '\n  TRAINZILLA_CMS_MCP_KEY is not set.\n' +
        '  Export it first (see MCP_LOCAL_NOTES.md, gitignored):\n' +
        '    export TRAINZILLA_CMS_MCP_KEY=...\n',
    )
    process.exit(1)
  }
}

export async function callTool(name, args) {
  requireKey()
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: { name, arguments: args },
    }),
  })
  const text = await res.text()
  const line = text.split('\n').find((l) => l.startsWith('data: '))
  let json
  try {
    json = line ? JSON.parse(line.slice(6)) : JSON.parse(text)
  } catch {
    throw new Error(`MCP ${name}: unparseable response: ${text.slice(0, 300)}`)
  }
  if (json.error) throw new Error(`MCP ${name}: ${JSON.stringify(json.error)}`)
  if (json.result?.isError) {
    throw new Error(`MCP ${name}: ${json.result.content?.[0]?.text || 'tool error'}`)
  }
  return json.result?.content?.[0]?.text ?? json.result
}

// where-clause helpers for the update* tools (they take a JSON string).
export const whereKey = (key) => JSON.stringify({ key: { equals: key } })
export const whereSlug = (slug) => JSON.stringify({ slug: { equals: slug } })
