/**
 * Seeds the 5 legalPages docs (WS-6). Bodies are the prose extracted from the
 * current prerendered pages, in scripts/legal-bodies/<slug>.json.
 * Run:  npx payload run scripts/seed-legal.ts
 * Idempotent: upserts by slug.
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const body = (slug: string) =>
  JSON.parse(readFileSync(resolve(HERE, 'legal-bodies', `${slug}.json`), 'utf8'))

const payload = await getPayload({ config })

const PAGES = [
  { slug: 'privacy-policy', title: 'Privacy Policy', lastUpdated: '2025-01-15' },
  { slug: 'terms-of-service', title: 'Terms of Service', lastUpdated: '2025-01-15' },
  { slug: 'refund-policy', title: 'Refund Policy', lastUpdated: '2025-01-15' },
  { slug: 'gst-policy', title: 'GST Policy', lastUpdated: '2025-09-22' },
  { slug: 'app-privacy-policy', title: 'Privacy Policy for Trainzilla Client App', lastUpdated: '2025-12-16' },
]

for (const p of PAGES) {
  const existing = await payload.find({
    collection: 'legalPages',
    where: { slug: { equals: p.slug } },
    limit: 1,
    depth: 0,
  })
  const data = {
    slug: p.slug,
    title: p.title,
    lastUpdated: p.lastUpdated,
    body: body(p.slug),
    _status: 'published' as const,
  }
  if (existing.docs[0]) await payload.update({ collection: 'legalPages', id: existing.docs[0].id, data, depth: 0 })
  else await payload.create({ collection: 'legalPages', data, depth: 0 })
}

// eslint-disable-next-line no-console
console.log('seed-legal: done', PAGES.length)
process.exit(0)
