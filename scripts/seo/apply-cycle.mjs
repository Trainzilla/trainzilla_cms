#!/usr/bin/env node
// Push a reviewed SEO cycle into the CMS.
//
// Run this on a trusted machine AFTER the cycle PR has been reviewed and its
// drafts/*.json edited to taste.
//
// `seoPages` writes publish immediately — the server's mcpDraftGuard hook
// (src/hooks/mcpDraftGuard.ts) deliberately exempts that collection, because
// title/description/keywords refreshes are low-risk and easy to revert with
// another write. Every other collection (articles first among them) is
// forced to land as an unpublished Payload draft version no matter what this
// script sends — a human still reviews and publishes those in the admin UI.
//
// Usage:
//   export TRAINZILLA_CMS_MCP_KEY=...        # from MCP_LOCAL_NOTES.md (gitignored)
//   node scripts/seo/apply-cycle.mjs cycles/2026-09-08
//   node scripts/seo/apply-cycle.mjs cycles/2026-09-08 --dry-run
//   node scripts/seo/apply-cycle.mjs cycles/2026-09-08 --only seo-refresh-pricing
//
// Each file in <cycle>/drafts/*.json must be an object:
//   {
//     "collection": "seoPages" | "articles" | "webinars" | "authors" | "faqs",
//     "op":         "update" | "create",
//     "key":        "<seoPages key>",     // update targeting (seoPages)
//     "slug":       "<slug>",             // update targeting (articles/webinars/...)
//     "data":       { ...fields to write... },
//     "_rationale": "why this change (kept local, not sent to the CMS)"
//   }

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { callTool, requireKey } from './lib/mcp.mjs'

const cycleDir = process.argv[2]
const dryRun = process.argv.includes('--dry-run')
const onlyIdx = process.argv.indexOf('--only')
const only = onlyIdx > -1 ? process.argv[onlyIdx + 1] : null

if (!cycleDir) {
  console.error('usage: node scripts/seo/apply-cycle.mjs cycles/<date> [--dry-run] [--only <name>]')
  process.exit(1)
}
if (!dryRun) requireKey()

const pascal = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// Kept in sync with MCP_AUTO_PUBLISH_COLLECTIONS in src/hooks/mcpDraftGuard.ts.
// Sending draft:false for anything else would be a no-op — the server forces
// draft:true for every other collection regardless of what this script sends.
const AUTO_PUBLISH_COLLECTIONS = new Set(['seoPages'])

const draftsDir = join(cycleDir, 'drafts')
let files
try {
  files = readdirSync(draftsDir).filter((f) => f.endsWith('.json')).sort()
} catch {
  console.error(`no drafts directory at ${draftsDir}`)
  process.exit(1)
}
if (only) files = files.filter((f) => f.replace(/\.json$/, '') === only || f === only)

const applied = []
const failed = []

for (const f of files) {
  const name = f.replace(/\.json$/, '')
  let spec
  try {
    spec = JSON.parse(readFileSync(join(draftsDir, f), 'utf8'))
  } catch (e) {
    console.log(`  SKIP  ${name}  (invalid JSON: ${String(e).slice(0, 100)})`)
    failed.push(name)
    continue
  }

  const { collection, op = 'update', key, slug, data } = spec
  if (!collection || !data) {
    console.log(`  SKIP  ${name}  (missing collection/data)`)
    failed.push(name)
    continue
  }

  const tool = `${op === 'create' ? 'create' : 'update'}${pascal(collection)}`
  const publishing = AUTO_PUBLISH_COLLECTIONS.has(collection)
  // The MCP tools take each field flat at the top level (confirmed via
  // tools/list) — there is no `data` wrapper in their input schema.
  // `draft: false` alone does not publish on this Payload setup — the
  // versioned `_status` field has to be set explicitly, or the write lands
  // as an unpublished draft version even though the call "succeeds".
  const args = { ...data, draft: !publishing, ...(publishing && { _status: 'published' }) }
  if (op !== 'create') {
    if (key != null) args.where = JSON.stringify({ key: { equals: key } })
    else if (slug != null) args.where = JSON.stringify({ slug: { equals: slug } })
    else {
      console.log(`  SKIP  ${name}  (update needs key or slug)`)
      failed.push(name)
      continue
    }
  }

  if (dryRun) {
    console.log(
      `  DRY   ${tool}  ${key || slug || '(new)'}  ${publishing ? '[PUBLISH]' : '[draft]'}  fields: ${Object.keys(data).join(', ')}`,
    )
    applied.push(name)
    continue
  }

  try {
    const result = await callTool(tool, args)
    console.log(`  ok    ${tool}  ${key || slug || '(new)'}  ${publishing ? '[published]' : '[draft]'}`)
    console.log(`        response: ${(typeof result === 'string' ? result : JSON.stringify(result)).slice(0, 2000)}`)
    applied.push(name)
  } catch (e) {
    console.log(`  FAIL  ${tool}  ${key || slug || '(new)'}  ${String(e).slice(0, 240)}`)
    failed.push(name)
  }
}

console.log('')
console.log(`  applied ${applied.length} / ${files.length}${failed.length ? `,  failed: ${failed.join(', ')}` : ''}`)
if (!dryRun && applied.length) {
  console.log('')
  console.log(`  seoPages writes above marked [published] are already live — no admin step needed.`)
  console.log('  Next: open https://cms.trainzilla.in/admin, review each remaining draft version,')
  console.log('  and click "Publish changes" on the ones you want live.')
}
process.exit(failed.length ? 1 : 0)
