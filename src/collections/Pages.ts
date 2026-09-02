import type { CollectionConfig } from 'payload'

import { richTextEditor } from '../fields/editor'
import { seoGroup } from '../fields/seo'

/**
 * Long-form bespoke narrative pages. Sourced from AIIntegrationPage.tsx (993 L),
 * MarketplacePage.tsx, AgentPage.tsx, help/GettingStartedPage.tsx,
 * ContactSupportPage.tsx, TrainingVideosPage.tsx, and the HomePage hero. Prose
 * lives in `sections` (rich text + blocks); repeating card/stat lists that also
 * appear here should prefer `marketingItems`.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: { read: () => true },
  admin: {
    useAsTitle: 'pageKey',
    defaultColumns: ['pageKey', '_status'],
    group: 'Landing',
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    {
      name: 'pageKey',
      type: 'select',
      required: true,
      unique: true,
      options: [
        'home',
        'ai-integration',
        'marketplace',
        'agent',
        'success-stories',
        'training-videos',
        'getting-started',
        'contact-support',
      ].map((v) => ({ label: v, value: v })),
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'subheading', type: 'textarea', localized: true },
        {
          name: 'primaryCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', localized: true },
            { name: 'href', type: 'text' },
          ],
        },
        {
          name: 'secondaryCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', localized: true },
            { name: 'href', type: 'text' },
          ],
        },
      ],
    },
    { name: 'sections', type: 'richText', localized: true, editor: richTextEditor },
    seoGroup(),
  ],
}
