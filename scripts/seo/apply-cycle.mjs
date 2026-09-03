#!/usr/bin/env node
// Push a reviewed SEO cycle into the CMS *as drafts*.
//
// Run this on a trusted machine AFTER the cycle PR has been reviewed and its
// drafts/*.json edited to taste. It never publishes — every write lands as a
// Payload draft version (enforced by the server's mcpDraftGuard hook). A human
// then publishes each one in the Payload admin UI.
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
  const args = { data, draft: true }
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
    console.log(`  DRY   ${tool}  ${key || slug || '(new)'}  fields: ${Object.keys(data).join(', ')}`)
    applied.push(name)
    continue
  }

  try {
    await callTool(tool, args)
    console.log(`  ok    ${tool}  ${key || slug || '(new)'}`)
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
  console.log('  Next: open https://cms.trainzilla.in/admin, review each draft version,')
  console.log('  and click "Publish changes" on the ones you want live. Nothing is live yet.')
}
process.exit(failed.length ? 1 : 0)
