import type { CollectionConfig } from 'payload'

/**
 * Per-route SEO metadata. Models the `SEO_PAGES` map in trainzilla-website
 * `src/components/SEOPageHead.tsx`. `key` matches the existing `page=` prop
 * values verbatim so the 20 call sites are untouched by the migration.
 */
export const SeoPages: CollectionConfig = {
  slug: 'seoPages',
  labels: { singular: 'SEO page', plural: 'SEO pages' },
  access: { read: () => true },
  admin: {
    useAsTitle: 'key',
    defaultColumns: ['key', 'title', 'inUse'],
    group: 'SEO',
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'e.g. home, agent, pricing — matches SEOPageHead `page` prop' },
    },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'description', type: 'textarea', localized: true, required: true },
    {
      name: 'keywords',
      type: 'text',
      localized: true,
      admin: { description: 'Comma-separated' },
    },
    {
      name: 'canonicalPath',
      type: 'text',
      required: true,
      admin: { description: 'Relative path, e.g. /solutions. Build derives the absolute URL.' },
    },
    { name: 'ogImage', type: 'text' },
    { name: 'noindex', type: 'checkbox', defaultValue: false },
    {
      name: 'inUse',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Uncheck for keys no page renders today (~19 of them). Kept for reference; excluded from the generated bundle.',
      },
    },
  ],
}
