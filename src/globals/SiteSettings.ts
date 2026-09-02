import type { GlobalConfig } from 'payload'

/**
 * Org identity — feeds the Organization JSON-LD and reconciles the competing
 * static block in trainzilla-website `index.html`. Sourced from `SEOHead.tsx`
 * (`organizationSchema`, `SOCIAL_SAME_AS`) + `index.html:94-139`.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  access: { read: () => true },
  admin: { group: 'SEO' },
  versions: { drafts: true, max: 20 },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'TrainZilla' },
    { name: 'orgDescription', type: 'textarea', localized: true },
    { name: 'logoUrl', type: 'text' },
    { name: 'ogImageDefault', type: 'text' },
    {
      name: 'social',
      type: 'array',
      admin: { description: 'schema.org sameAs list' },
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'addressLocality', type: 'text' },
        { name: 'addressRegion', type: 'text' },
        { name: 'addressCountry', type: 'text', defaultValue: 'IN' },
      ],
    },
    { name: 'foundingDate', type: 'text', defaultValue: '2024' },
  ],
}
