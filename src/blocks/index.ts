import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

/** Plain editor (no nested blocks) for rich-text fields that live *inside* a block. */
const nestedRichText = lexicalEditor()

/**
 * Shared Lexical blocks used inside the rich-text `body` / `sections` fields of
 * `articles`, `legalPages` and `pages`. Each block maps 1:1 to a React renderer
 * in trainzilla-website `src/components/cms/Blocks.tsx`. Keep the two in sync.
 *
 * Rich text prose (headings, lists, links, blockquote, bold/italic) is handled
 * natively by Lexical — blocks are only for the structured, styled fragments the
 * bespoke article/landing JSX uses today (callout boxes, stat grids, tables, CTA
 * cards, card grids, inline images).
 */

export const Callout: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  labels: { singular: 'Callout', plural: 'Callouts' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Tip', value: 'tip' },
      ],
    },
    { name: 'title', type: 'text', localized: true },
    { name: 'body', type: 'richText', localized: true, required: true, editor: nestedRichText },
    { name: 'icon', type: 'text', admin: { description: 'lucide-react icon name, optional' } },
  ],
}

export const StatGrid: Block = {
  slug: 'statGrid',
  interfaceName: 'StatGridBlock',
  labels: { singular: 'Stat grid', plural: 'Stat grids' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "40%", "2.5x"' } },
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'accent', type: 'text', admin: { description: 'optional colour token, e.g. "green"' } },
      ],
    },
  ],
}

export const PullQuote: Block = {
  slug: 'pullQuote',
  interfaceName: 'PullQuoteBlock',
  labels: { singular: 'Pull quote', plural: 'Pull quotes' },
  fields: [
    { name: 'quote', type: 'textarea', localized: true, required: true },
    { name: 'attribution', type: 'text' },
    { name: 'role', type: 'text', localized: true },
  ],
}

export const CTACard: Block = {
  slug: 'ctaCard',
  interfaceName: 'CTACardBlock',
  labels: { singular: 'CTA card', plural: 'CTA cards' },
  fields: [
    { name: 'heading', type: 'text', localized: true, required: true },
    { name: 'body', type: 'textarea', localized: true },
    { name: 'buttonLabel', type: 'text', localized: true, required: true },
    { name: 'buttonHref', type: 'text', required: true },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'gradient',
      options: [
        { label: 'Gradient', value: 'gradient' },
        { label: 'Solid', value: 'solid' },
        { label: 'Outline', value: 'outline' },
      ],
    },
  ],
}

export const DataTable: Block = {
  slug: 'dataTable',
  interfaceName: 'DataTableBlock',
  labels: { singular: 'Data table', plural: 'Data tables' },
  fields: [
    { name: 'caption', type: 'text', localized: true },
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'header', type: 'text', localized: true, required: true }],
    },
    {
      name: 'rows',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'cells',
          type: 'array',
          minRows: 1,
          fields: [{ name: 'value', type: 'text', localized: true }],
        },
      ],
    },
  ],
}

export const CardGrid: Block = {
  slug: 'cardGrid',
  interfaceName: 'CardGridBlock',
  labels: { singular: 'Card grid', plural: 'Card grids' },
  fields: [
    {
      name: 'columns',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'lucide-react icon name' } },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}

export const ImageBlock: Block = {
  slug: 'imageBlock',
  interfaceName: 'ImageBlockBlock',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    {
      name: 'src',
      type: 'text',
      required: true,
      admin: { description: 'Absolute URL or /images/... path. Binary uploads are a follow-up.' },
    },
    { name: 'alt', type: 'text', localized: true, required: true },
    { name: 'caption', type: 'text', localized: true },
  ],
}

export const contentBlocks: Block[] = [
  Callout,
  StatGrid,
  PullQuote,
  CTACard,
  DataTable,
  CardGrid,
  ImageBlock,
]
