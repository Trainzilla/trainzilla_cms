import type { CollectionConfig } from 'payload'

/**
 * Real testimonials from coaches, studios and gyms using Trainzilla.
 *
 * Every published entry must be a verbatim quote from a real person who agreed
 * to be quoted (the earlier invented testimonials were removed from the site in
 * Sep 2026). `consentConfirmed` is enforced on publish; drafts can be saved
 * without it while approval is still being collected.
 */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  access: { read: () => true },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'organization', 'kind', 'order', '_status'],
    group: 'Landing',
  },
  versions: { drafts: true, maxPerDoc: 10 },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: { description: 'Verbatim from the person. Trim for length only; never reword or add claims.' },
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'coach',
      options: [
        { label: 'Coach', value: 'coach' },
        { label: 'Studio', value: 'studio' },
        { label: 'Gym', value: 'gym' },
      ],
    },
    { name: 'authorName', type: 'text', required: true },
    { name: 'role', type: 'text', admin: { description: 'e.g. Founder, Head coach, Online coach' } },
    { name: 'organization', type: 'text', admin: { description: 'Studio / gym / business name' } },
    { name: 'city', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'avatar', type: 'text', admin: { description: 'Photo URL (must be the person, with permission)' } },
    { name: 'logo', type: 'text', admin: { description: 'Studio/gym logo URL (optional)' } },
    {
      name: 'result',
      type: 'text',
      admin: { description: 'Optional headline result the person themselves stated, e.g. "Saves ~5 hrs a week". Leave blank if none.' },
    },
    { name: 'profileUrl', type: 'text', admin: { description: 'Optional link to their Trainzilla profile or website' } },
    {
      name: 'featuredOn',
      type: 'select',
      hasMany: true,
      options: ['home', 'success-stories', 'for-coaches', 'gyms'].map((v) => ({ label: v, value: v })),
      defaultValue: ['success-stories'],
      admin: { description: 'Pages where this quote is shown' },
    },
    { name: 'order', type: 'number', defaultValue: 0 },
    {
      name: 'consentConfirmed',
      type: 'checkbox',
      defaultValue: false,
      validate: (val: unknown) => val === true || 'Confirm the person agreed to be quoted before publishing',
      admin: { position: 'sidebar', description: 'They agreed to this quote, name and photo being published' },
    },
    {
      name: 'consentNote',
      type: 'text',
      admin: { position: 'sidebar', description: 'Internal: where/when they agreed (e.g. WhatsApp, 21 Oct). Not published.' },
    },
  ],
}
