#!/usr/bin/env node
// Read-only snapshot of the CMS content this pipeline touches.
//
// Pulls the *published* copy of seoPages, articles, authors, webinars, faqs,
// blogCategories + the three globals from the public REST API (no auth needed).
// Writes machine JSON + a human-readable index into a cycle directory.
//
// Usage:
//   node scripts/seo/fetch-cms-state.mjs cycles/2026-09-08
//   node scripts/seo/fetch-cms-state.mjs            # defaults to cycles/<today>/
//   node scripts/seo/fetch-cms-state.mjs scripts/seo/_snapshot --slim
//
// --slim drops the heavy Lexical body fields (articles.body, webinars.longDescription)
// from the written JSON — used for the committed repo snapshot so it doesn't churn.
// The human-readable content-index.md is unaffected (it still summarises bodies).
//
// Zero dependencies. Needs Node >= 18 (global fetch).

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.env.PAYLOAD_CMS_URL || 'https://cms.trainzilla.in'
const today = new Date().toISOString().slice(0, 10)
const args = process.argv.slice(2)
const slim = args.includes('--slim')
const outDir = args.find((a) => !a.startsWith('--')) || `cycles/${today}`
const inputsDir = join(outDir, 'inputs')

const HEAVY = { articles: ['body', 'related'], webinars: ['longDescription'] }
function slimDocs(slug, docs) {
  if (!slim || !HEAVY[slug]) return docs
  return docs.map((d) => {
    const c = { ...d }
    for (const k of HEAVY[slug]) delete c[k]
    return c
  })
}

const COLLECTIONS = ['seoPages', 'articles', 'authors', 'webinars', 'faqs', 'blogCategories']
const GLOBALS = ['siteSettings', 'structuredData', 'platformMetrics']

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  return res.json()
}

async function fetchCollection(slug) {
  const url = `${BASE}/api/${slug}?depth=1&limit=500&where[_status][equals]=published&draft=false`
  const j = await getJson(url)
  return j.docs || []
}

async function fetchGlobal(slug) {
  return getJson(`${BASE}/api/globals/${slug}?depth=1`)
}

function lexToText(node, acc = []) {
  if (!node || typeof node !== 'object') return acc
  if (typeof node.text === 'string') acc.push(node.text)
  const kids = node.children || node.root?.children || []
  for (const k of kids) lexToText(k, acc)
  return acc
}

function mdIndex(state) {
  const L = []
  L.push(`# CMS content snapshot — ${today}`)
  L.push('')
  L.push(`Source: ${BASE} (published only). Regenerate with \`node scripts/seo/fetch-cms-state.mjs ${outDir}\`.`)
  L.push('')

  L.push('## seoPages (' + state.seoPages.length + ')')
  L.push('')
  L.push('| key | inUse | noindex | title | description |')
  L.push('| --- | --- | --- | --- | --- |')
  for (const p of state.seoPages.sort((a, b) => String(a.key).localeCompare(b.key))) {
    const d = (p.description || '').replace(/\|/g, '\\|').slice(0, 90)
    L.push(`| \`${p.key}\` | ${p.inUse ?? ''} | ${p.noindex ?? ''} | ${(p.title || '').replace(/\|/g, '\\|')} | ${d} |`)
  }
  L.push('')

  L.push('## articles (' + state.articles.length + ')')
  L.push('')
  L.push('| slug | title | category | published | updated | readTime |')
  L.push('| --- | --- | --- | --- | --- | --- |')
  for (const a of state.articles) {
    const cat = a.category?.slug || a.category?.name || a.category || ''
    L.push(`| \`${a.slug}\` | ${(a.title || '').replace(/\|/g, '\\|')} | ${cat} | ${a.publishedDate || ''} | ${a.updatedDate || ''} | ${a.readTime || ''} |`)
  }
  L.push('')
  for (const a of state.articles) {
    const words = lexToText(a.body).join(' ').split(/\s+/).filter(Boolean).length
    L.push(`- **${a.slug}** — excerpt: ${(a.excerpt || '').slice(0, 160)}  _(~${words} words in body)_`)
  }
  L.push('')

  L.push('## webinars (' + state.webinars.length + ')')
  L.push('')
  for (const w of state.webinars) {
    L.push(`- **${w.slug}** — ${w.title}`)
    if (w.subtitle) L.push(`  - ${w.subtitle}`)
    if (Array.isArray(w.topics) && w.topics.length) {
      L.push(`  - topics: ${w.topics.map((t) => t.topic || t).join('; ')}`)
    }
  }
  L.push('')

  L.push('## faqs (' + state.faqs.length + ')')
  L.push('')
  for (const f of state.faqs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))) {
    L.push(`- [${f.category || '?'}] ${f.question}`)
  }
  L.push('')

  L.push('## blogCategories (' + state.blogCategories.length + ')')
  L.push('')
  for (const c of state.blogCategories) L.push(`- \`${c.slug}\` — ${c.name}`)
  L.push('')

  L.push('## globals')
  L.push('')
  for (const g of GLOBALS) L.push(`- \`${g}\` — see inputs/globals.${g}.json`)
  L.push('')
  return L.join('\n')
}

async function main() {
  mkdirSync(inputsDir, { recursive: true })
  const state = {}
  for (const slug of COLLECTIONS) {
    try {
      state[slug] = await fetchCollection(slug)
      writeFileSync(join(inputsDir, `${slug}.json`), JSON.stringify(slimDocs(slug, state[slug]), null, 2))
      console.log(`  ok    ${slug.padEnd(16)} ${state[slug].length} docs${slim && HEAVY[slug] ? ' (slim)' : ''}`)
    } catch (e) {
      state[slug] = []
      console.log(`  WARN  ${slug.padEnd(16)} ${String(e).slice(0, 120)}`)
    }
  }
  for (const slug of GLOBALS) {
    try {
      const g = await fetchGlobal(slug)
      writeFileSync(join(inputsDir, `globals.${slug}.json`), JSON.stringify(g, null, 2))
      console.log(`  ok    global ${slug}`)
    } catch (e) {
      console.log(`  WARN  global ${slug} ${String(e).slice(0, 120)}`)
    }
  }
  writeFileSync(join(inputsDir, 'content-index.md'), mdIndex(state))
  writeFileSync(
    join(inputsDir, '_meta.json'),
    JSON.stringify({ fetchedAt: new Date().toISOString(), base: BASE, outDir }, null, 2),
  )
  console.log(`\n  wrote ${inputsDir}/  (content-index.md is the human-readable summary)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
