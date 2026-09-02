import type { GlobalConfig } from 'payload'

/**
 * Source for the SoftwareApplication + WebSite JSON-LD currently hardcoded in
 * `SEOHead.tsx:135-205`. Article / FAQPage schema are derived at build time
 * from the `articles` / `faqs` collections, not stored here. Mine the dead
 * `src/components/StructuredData.tsx` for shape, then delete that file in WS-2.
 */
export const StructuredData: GlobalConfig = {
  slug: 'structuredData',
  access: { read: () => true },
  admin: { group: 'SEO' },
  versions: { drafts: true, max: 20 },
  fields: [
    {
      name: 'softwareApplication',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', defaultValue: 'TrainZilla' },
        { name: 'softwareVersion', type: 'text', defaultValue: '2.0' },
        { name: 'datePublished', type: 'text', defaultValue: '2024-01-01' },
        { name: 'applicationCategory', type: 'text', defaultValue: 'BusinessApplication' },
        {
          name: 'operatingSystem',
          type: 'array',
          fields: [{ name: 'value', type: 'text', required: true }],
        },
        {
          name: 'offers',
          type: 'array',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'price', type: 'text', required: true },
            { name: 'priceCurrency', type: 'text', defaultValue: 'INR' },
            { name: 'description', type: 'text', localized: true },
          ],
        },
        {
          name: 'featureList',
          type: 'array',
          localized: true,
          fields: [{ name: 'value', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'website',
      type: 'group',
      fields: [
        {
          name: 'searchUrlTemplate',
          type: 'text',
          admin: { description: 'e.g. https://trainzilla.in/search?q={search_term_string}' },
        },
      ],
    },
  ],
}
