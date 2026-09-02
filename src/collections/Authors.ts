import type { CollectionConfig } from 'payload'

/** Article authors. Sourced from the per-article `author` / `authorBio` literals. */
export const Authors: CollectionConfig = {
  slug: 'authors',
  access: { read: () => true },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug'], group: 'Blog' },
  versions: { drafts: true, maxPerDoc: 10 },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'shortBio', type: 'text', localized: true },
    { name: 'bio', type: 'textarea', localized: true },
    { name: 'avatar', type: 'text', admin: { description: 'Image URL or /images/... path' } },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
