#!/usr/bin/env node
// Build a pre-verified pool of commercially-usable images, one file per SEO
// focus area, into scripts/seo/_images/. The weekly SEO content routine picks
// hero + social images from this committed pool — its sandbox cannot reach
// image hosts directly (egress policy), so selection has to happen offline.
//
// Source: Wikimedia Commons API (keyless, generous limits). Only
// commercially-usable licences are kept: CC0 / Public Domain / CC BY / CC BY-SA.
// CC BY and CC BY-SA REQUIRE attribution — every entry carries `creator`,
// `license`, `license_url` and a ready-to-paste `attribution` string, which the
// playbook copies into images.md and the drafts.
//
// Usage:  node scripts/seo/build-image-pool.mjs [--min-per-focus=6]
// Zero dependencies. Node >= 18.

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'scripts/seo/_images'
const API = 'https://commons.wikimedia.org/w/api.php'
const UA = 'trainzilla-seo-pipeline/1.0 (https://trainzilla.in; nitish.gulati22@gmail.com)'
const MIN = Number((process.argv.find((a) => a.startsWith('--min-per-focus=')) || '').split('=')[1]) || 6
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// index = ISO week % 6 — mirrors docs/feature-inventory.md "Rotating focus areas".
const FOCUS = [
  { slug: 'ai-auto-adjust', name: 'AI auto-adjust & coach-in-the-loop',
    queries: ['personal trainer client gym', 'fitness trainer instructing', 'gym coaching one on one', 'fitness assessment trainer', 'strength coach spotting'] },
  { slug: 'gym-operations', name: 'Gym / franchise operations',
    queries: ['gym interior members', 'fitness studio training floor', 'gym reception staff', 'group fitness class studio'] },
  { slug: 'nutrition-flexibility', name: 'Nutrition flexibility',
    queries: ['healthy meal vegetables plate', 'meal prep food containers', 'cooking healthy kitchen', 'fresh vegetables market'] },
  { slug: 'scale-solo-team', name: 'Scale for solo to small team',
    queries: ['personal trainer studio', 'fitness coach laptop', 'small gym training', 'trainer with clients'] },
  { slug: 'recovery-aware', name: 'Recovery-aware programming',
    queries: ['stretching exercise', 'yoga class studio', 'foam roller mobility', 'physiotherapy session', 'sports massage recovery', 'runner stretching'] },
  { slug: 'trust-transparency', name: 'Trust & transparency',
    queries: ['personal trainer talking client', 'fitness coach explaining', 'gym consultation', 'trainer client conversation'] },
]

const OK_LICENCE = /^(cc0|cc by(?:-sa)? \d|public domain|pdm|no restrictions)/i
const BAD_LICENCE = /nc|nd|gfdl|fair use|non-free|copyright/i
const JUNK_TITLE =
  /banner|logo|poster|screenshot|\bmap\b|diagram|chart|infographic|flyer|\bsign(age)?\b|dispenser|qr code|certificate|award|plaque|book cover|magazine|playground|kletterger|cricket|\bfootball\b|baseball|\bsoccer\b|\bNARA\b|archiv|painting|statue|monument|postage|stamp|coat of arms|\bflag\b/i
// Must read as a fitness / coaching / nutrition / wellness scene — kills the
// archival + off-topic noise Commons search returns.
const RELEVANT =
  /trainer|coach|coaching|gym|fitness|workout|exercis|training|strength|weight|dumbbell|barbell|treadmill|studio|pilates|yoga|stretch|mobility|physio|massage|recovery|meal|nutrition|diet|\bfood\b|vegetable|fruit|salad|kitchen|cooking|athlete|runner|running|wellness|personal training/i

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

async function search(q) {
  const u = `${API}?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=25&gsrsearch=${encodeURIComponent(
    q,
  )}&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1600&origin=*`
  const r = await fetch(u, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`)
  const j = await r.json()
  return Object.values(j.query?.pages || {})
}

async function imageOk(url) {
  try {
    const r = await fetch(url, { method: 'GET', headers: { 'User-Agent': UA, Range: 'bytes=0-2047' }, redirect: 'follow' })
    return r.ok && (r.headers.get('content-type') || '').startsWith('image/')
  } catch {
    return false
  }
}

function pick(page) {
  const ii = page.imageinfo?.[0]
  if (!ii || !(ii.mime || '').startsWith('image/')) return null
  if (JUNK_TITLE.test(page.title)) return null
  const m = ii.extmetadata || {}
  const haystack = `${page.title} ${stripHtml(m.ImageDescription?.value)} ${stripHtml(m.Categories?.value)}`
  if (!RELEVANT.test(haystack)) return null
  const licence = stripHtml(m.LicenseShortName?.value) || stripHtml(m.License?.value)
  if (!licence || !OK_LICENCE.test(licence) || BAD_LICENCE.test(licence)) return null
  const w = ii.thumbwidth || ii.width
  const h = ii.thumbheight || ii.height
  if (!w || w < 1000) return null
  if (h && w < h) return null // landscape / square only
  const creator = stripHtml(m.Artist?.value) || 'Unknown'
  const licenceUrl = stripHtml(m.LicenseUrl?.value) || ''
  const credit = /cc0|public domain|pdm|no restrictions/i.test(licence)
    ? `${creator} / Wikimedia Commons (${licence})`
    : `Photo: ${creator} / Wikimedia Commons — ${licence}${licenceUrl ? ` (${licenceUrl})` : ''}`
  return {
    title: page.title.replace(/^File:/, '').replace(/\.\w+$/, ''),
    url: ii.thumburl || ii.url, // rendered <=1600px on upload.wikimedia.org
    full_url: ii.url,
    width: w,
    height: h || null,
    creator,
    license: licence,
    license_url: licenceUrl || null,
    needs_attribution: !/cc0|public domain|pdm|no restrictions/i.test(licence),
    attribution: credit,
    source_page: ii.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
  }
}

async function buildFocus(f) {
  const seen = new Set()
  const kept = []
  for (const q of f.queries) {
    if (kept.length >= 12) break
    let pages
    try {
      pages = await search(q)
    } catch (e) {
      console.log(`  WARN  [${f.slug}] "${q}": ${String(e).slice(0, 100)}`)
      await sleep(1500)
      continue
    }
    for (const p of pages) {
      if (kept.length >= 12) break
      const cand = pick(p)
      if (!cand || seen.has(cand.full_url)) continue
      seen.add(cand.full_url)
      if (!(await imageOk(cand.url))) continue
      kept.push({ query: q, ...cand })
    }
    await sleep(1000)
  }
  return kept
}

async function main() {
  mkdirSync(OUT, { recursive: true })
  const index = { builtAt: new Date().toISOString(), source: 'wikimedia-commons', focus: {} }
  for (const f of FOCUS) {
    const images = await buildFocus(f)
    writeFileSync(join(OUT, `${f.slug}.json`), JSON.stringify({ focus: f.name, slug: f.slug, images }, null, 2))
    index.focus[f.slug] = { name: f.name, count: images.length, file: `${f.slug}.json` }
    console.log(`  ${f.slug.padEnd(22)} ${images.length} images${images.length < MIN ? `  (< ${MIN} — thin)` : ''}`)
  }
  writeFileSync(join(OUT, '_index.json'), JSON.stringify(index, null, 2))
  console.log(`\n  wrote ${OUT}/  (_index.json summarises counts)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
