import type { CollectionConfig } from 'payload'

import { richTextEditor } from '../fields/editor'

/**
 * FAQ entries. Sourced from `src/pages/help/FAQPage.tsx` `faqData` (~30 Q&As).
 * `featuredOnPages` drives which routes emit a FAQPage JSON-LD block for that
 * question (wired in website WS-2 / WS-5).
 */
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  access: { read: () => true },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', '_status'],
    group: 'Content',
  },
  versions: { drafts: true, maxPerDoc: 10 },
  fields: [
    { name: 'question', type: 'text', localized: true, required: true },
    { name: 'answer', type: 'richText', localized: true, required: true, editor: richTextEditor },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Getting Started', value: 'getting-started' },
        { label: 'Billing & Pricing', value: 'billing' },
        { label: 'Features', value: 'features' },
        { label: 'Account', value: 'account' },
        { label: 'Technical', value: 'technical' },
        { label: 'General', value: 'general' },
      ],
      defaultValue: 'general',
    },
    { name: 'order', type: 'number', defaultValue: 0 },
    {
      name: 'featuredOnPages',
      type: 'select',
      hasMany: true,
      options: ['faq', 'home', 'pricing', 'features', 'agent', 'ai-integration', 'marketplace'].map(
        (v) => ({ label: v, value: v }),
      ),
      admin: { description: 'Routes whose JSON-LD should include this Q&A' },
    },
  ],
}
