import type { CollectionConfig } from 'payload'

import { richTextEditor } from '../fields/editor'
import { seoGroup } from '../fields/seo'

/**
 * Blog articles. Sourced from the 7 `src/pages/articles/*Page.tsx` files (+
 * `articles/data/nutritionVegetarianData.ts`). `slug` is identical to the
 * current URL so no redirects are needed for the canonical paths.
 *
 * The 200–350 lines of bespoke JSX prose per article convert into `body`:
 * headings / lists / links / blockquote are native Lexical; the styled
 * fragments (callout boxes, stat grids, `<Card>` pairs, protein/meal tables,
 * closing gradient CTA) become the shared blocks.
 */
export const Articles: CollectionConfig = {
  slug: 'articles',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'publishedDate', '_status'],
    group: 'Blog',
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'excerpt', type: 'textarea', localized: true, required: true },
    { name: 'category', type: 'relationship', relationTo: 'blogCategories', required: true },
    { name: 'author', type: 'relationship', relationTo: 'authors', required: true },
    {
      type: 'row',
      fields: [
        { name: 'publishedDate', type: 'date', required: true },
        { name: 'updatedDate', type: 'date' },
        { name: 'readTime', type: 'text', admin: { description: 'e.g. "6 min read"' } },
      ],
    },
    { name: 'heroImage', type: 'text', admin: { description: 'Image URL or /images/... path' } },
    { name: 'tags', type: 'array', localized: true, fields: [{ name: 'tag', type: 'text', required: true }] },
    { name: 'body', type: 'richText', localized: true, required: true, editor: richTextEditor },
    {
      name: 'related',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      maxRows: 3,
      admin: { description: 'Replaces the per-file relatedArticles arrays' },
    },
    seoGroup(),
  ],
}
