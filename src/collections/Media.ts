import type { CollectionConfig } from 'payload'

/**
 * Upload collection. NOT populated in Stage 3 — image fields elsewhere stay as
 * `text` URLs (matching today's Unsplash hot-linking). Binary/media migration
 * is a documented follow-up.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
  ],
  upload: true,
}
