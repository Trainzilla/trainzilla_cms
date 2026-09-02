import type { CollectionConfig } from 'payload'

/**
 * Blog category taxonomy. Sourced from `BlogCategoryPage.tsx` `categoryConfig`
 * (the 4 real keys only). Article membership is a reverse query on
 * `articles.category` — there is deliberately no `articles[]` list field, which
 * is what removes the phantom slugs the old hardcoded lists carried.
 */
export const BlogCategories: CollectionConfig = {
  slug: 'blogCategories',
  labels: { singular: 'Blog category', plural: 'Blog categories' },
  access: { read: () => true },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug'], group: 'Blog' },
  versions: { drafts: true, maxPerDoc: 10 },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'getting-started | client-management | scheduling-booking | analytics-reports',
      },
    },
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'icon', type: 'text', admin: { description: 'lucide-react icon name' } },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'keywords', type: 'text', localized: true },
      ],
    },
  ],
}
