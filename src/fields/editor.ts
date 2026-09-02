import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { contentBlocks } from '../blocks'

/**
 * Lexical editor with the shared content blocks enabled. Used both as the
 * project-level `editor` and per rich-text field so every prose field can drop
 * in a Callout / StatGrid / DataTable / CTACard / CardGrid / ImageBlock / PullQuote.
 */
export const richTextEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    BlocksFeature({ blocks: contentBlocks }),
  ],
})
