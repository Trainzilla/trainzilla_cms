import type { CollectionConfig } from 'payload'

import { richTextEditor } from '../fields/editor'
import { seoGroup } from '../fields/seo'

/**
 * Long-form legal documents. Sourced from `src/components/{PrivacyPolicy,
 * TermsOfService,RefundPolicy,GSTPolicy}.tsx` and `src/pages/AppPrivacyPolicy.tsx`
 * — each becomes one rich-text `body` field (headings/lists native, the odd
 * table/callout as blocks).
 */
export const LegalPages: CollectionConfig = {
  slug: 'legalPages',
  labels: { singular: 'Legal page', plural: 'Legal pages' },
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'lastUpdated', '_status'],
    group: 'SEO',
  },
  versions: { drafts: true, maxPerDoc: 10 },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'privacy-policy | terms-of-service | refund-policy | gst-policy | app-privacy-policy',
      },
    },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'lastUpdated', type: 'date' },
    { name: 'body', type: 'richText', localized: true, required: true, editor: richTextEditor },
    seoGroup(),
  ],
}
