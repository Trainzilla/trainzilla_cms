import type { Field } from 'payload'

/**
 * Reusable per-document SEO override group. Every field is optional — the
 * website build falls back to the generated defaults (from the `seoPages`
 * collection / `structuredData` global) when a value is blank.
 */
export const seoGroup = (): Field => ({
  name: 'seo',
  type: 'group',
  admin: { description: 'Optional per-document SEO overrides. Blank = use the page default.' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'keywords', type: 'text', localized: true, admin: { description: 'Comma-separated' } },
    { name: 'canonicalPath', type: 'text', admin: { description: 'Relative, e.g. /blog/my-post' } },
    { name: 'ogImage', type: 'text' },
    { name: 'noindex', type: 'checkbox', defaultValue: false },
  ],
})
