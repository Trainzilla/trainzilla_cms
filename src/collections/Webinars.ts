import type { CollectionConfig } from 'payload'

import { richTextEditor } from '../fields/editor'
import { seoGroup } from '../fields/seo'

/**
 * Webinars. 1:1 with `src/data/webinarData.ts` `interface Webinar` — field names
 * are kept identical so the website's `Webinar` type and its 4 consumers are
 * untouched. Stale Feb-2024 schedule dates get refreshed during seeding.
 */
export const Webinars: CollectionConfig = {
  slug: 'webinars',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'level', 'category', '_status'],
    group: 'Content',
  },
  versions: { drafts: true, maxPerDoc: 15 },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, admin: { description: 'Was `id` in webinarData.ts' } },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'subtitle', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'longDescription', type: 'richText', localized: true, editor: richTextEditor },
    {
      name: 'instructor',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'title', type: 'text', localized: true },
        { name: 'bio', type: 'textarea', localized: true },
        { name: 'image', type: 'text' },
        { name: 'credentials', type: 'array', localized: true, fields: [{ name: 'value', type: 'text', required: true }] },
      ],
    },
    {
      name: 'schedule',
      type: 'group',
      fields: [
        { name: 'date', type: 'text', admin: { description: 'Display string, e.g. "March 15, 2026"' } },
        { name: 'time', type: 'text' },
        { name: 'duration', type: 'text' },
        { name: 'timezone', type: 'text' },
      ],
    },
    { name: 'topics', type: 'array', localized: true, fields: [{ name: 'value', type: 'text', required: true }] },
    { name: 'benefits', type: 'array', localized: true, fields: [{ name: 'value', type: 'text', required: true }] },
    { name: 'targetAudience', type: 'array', localized: true, fields: [{ name: 'value', type: 'text', required: true }] },
    { name: 'features', type: 'array', localized: true, fields: [{ name: 'value', type: 'text', required: true }] },
    { name: 'prerequisites', type: 'array', localized: true, fields: [{ name: 'value', type: 'text', required: true }] },
    { name: 'materialsIncluded', type: 'array', localized: true, fields: [{ name: 'value', type: 'text', required: true }] },
    {
      name: 'price',
      type: 'group',
      fields: [
        { name: 'amount', type: 'number' },
        { name: 'currency', type: 'text', defaultValue: 'INR' },
        { name: 'originalPrice', type: 'number' },
      ],
    },
    { name: 'category', type: 'text' },
    {
      name: 'level',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' },
      ],
    },
    { name: 'language', type: 'array', fields: [{ name: 'value', type: 'text', required: true }] },
    {
      type: 'row',
      fields: [
        { name: 'maxParticipants', type: 'number' },
        { name: 'currentRegistrations', type: 'number', defaultValue: 0 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'certificateProvided', type: 'checkbox', defaultValue: false },
        { name: 'recordingAvailable', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'tags', type: 'array', localized: true, fields: [{ name: 'value', type: 'text', required: true }] },
    seoGroup(),
  ],
}
