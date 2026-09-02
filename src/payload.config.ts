import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { SeoPages } from './collections/SeoPages'
import { Authors } from './collections/Authors'
import { BlogCategories } from './collections/BlogCategories'
import { Articles } from './collections/Articles'
import { Webinars } from './collections/Webinars'
import { Faqs } from './collections/Faqs'
import { LegalPages } from './collections/LegalPages'
import { MarketingItems } from './collections/MarketingItems'
import { Pages } from './collections/Pages'
import { SiteSettings } from './globals/SiteSettings'
import { StructuredData } from './globals/StructuredData'
import { PlatformMetrics } from './globals/PlatformMetrics'
import { richTextEditor } from './fields/editor'
import { localization } from './locales'
import { mcpDraftGuard } from './hooks/mcpDraftGuard'
import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Every content collection/global: MCP clients (Claude) may find / create /
// update, but never delete. Drafts are on, so an MCP write lands as a draft;
// publishing stays a deliberate action in the Payload admin.
const editCreateFind = { find: true, create: true, update: true, delete: false }
const findUpdate = { find: true, update: true }

// Append the MCP draft-guard beforeOperation hook to a content collection.
const withMcpGuard = (c: CollectionConfig): CollectionConfig => ({
  ...c,
  hooks: {
    ...c.hooks,
    beforeOperation: [...(c.hooks?.beforeOperation ?? []), mcpDraftGuard],
  },
})

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [
    Users,
    Media,
    ...[SeoPages, Authors, BlogCategories, Articles, Webinars, Faqs, LegalPages, MarketingItems, Pages].map(
      withMcpGuard,
    ),
  ],
  globals: [SiteSettings, StructuredData, PlatformMetrics],
  localization,
  editor: richTextEditor,
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    mcpPlugin({
      userCollection: 'users',
      collections: {
        seoPages: { description: 'Per-route SEO meta: title, description, keywords, canonical path', enabled: editCreateFind },
        articles: { description: 'Blog articles: title, excerpt, Lexical body with blocks, tags, related', enabled: editCreateFind },
        authors: { description: 'Blog article author bios', enabled: editCreateFind },
        blogCategories: { description: 'Blog category taxonomy (name, description, SEO)', enabled: editCreateFind },
        webinars: { description: 'Webinar detail records (agenda, instructor, schedule, pricing)', enabled: editCreateFind },
        faqs: { description: 'FAQ Q&A entries with category and featuredOnPages targeting', enabled: editCreateFind },
        legalPages: { description: 'Long-form legal documents as rich text', enabled: editCreateFind },
        marketingItems: { description: 'Landing/showcase list items keyed by groupKey + order', enabled: editCreateFind },
        pages: { description: 'Bespoke landing pages: hero + Lexical block sections', enabled: editCreateFind },
      },
      globals: {
        siteSettings: { description: 'Org identity, social links, contact point', enabled: findUpdate },
        structuredData: { description: 'SoftwareApplication + WebSite JSON-LD source', enabled: findUpdate },
        platformMetrics: { description: 'Headline platform stat numbers', enabled: findUpdate },
      },
    }),
  ],
})
