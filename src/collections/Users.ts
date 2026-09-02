import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email'],
  },
  // useAPIKey lets a service user (e.g. build@trainzilla.in) hold a static key
  // for `?draft=true` preview builds. Published builds need no key.
  auth: {
    useAPIKey: true,
  },
  fields: [
    { name: 'name', type: 'text' },
  ],
}
