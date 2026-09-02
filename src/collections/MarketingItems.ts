import type { CollectionConfig } from 'payload'

/**
 * The array-shaped bespoke marketing copy — a clean field lift that avoids
 * block-render risk. Each row is one card / stat / caption, addressed by
 * `groupKey` + `order`. The website reads these pre-grouped as
 * `Record<groupKey, MarketingItem[]>`.
 *
 * Sources: HomePage.tsx arrays (mainFeatures/quickStats/valueProps/appFeatures/
 * capabilities), Testimonials.tsx, SuccessStoriesPage.tsx, TrainingVideosPage.tsx,
 * ProductShowcase.tsx, DemoSection.tsx, AgentDemoReel.tsx, AiCoachReel.tsx,
 * McpConnectReel.tsx.
 */
export const MarketingItems: CollectionConfig = {
  slug: 'marketingItems',
  labels: { singular: 'Marketing item', plural: 'Marketing items' },
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'groupKey', 'order', '_status'],
    group: 'Landing',
  },
  versions: { drafts: true, maxPerDoc: 10 },
  fields: [
    {
      name: 'groupKey',
      type: 'select',
      required: true,
      options: [
        'home.mainFeatures',
        'home.quickStats',
        'home.valueProps',
        'home.appFeatures',
        'home.capabilities',
        'testimonials',
        'successStories.caseStudies',
        'trainingVideos',
        'productShowcase',
        'demoCaptions.agent',
        'demoCaptions.aiCoach',
        'demoCaptions.mcpConnect',
      ].map((v) => ({ label: v, value: v })),
    },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'icon', type: 'text', admin: { description: 'lucide-react icon name' } },
    { name: 'title', type: 'text', localized: true },
    { name: 'body', type: 'textarea', localized: true },
    { name: 'metric', type: 'text', admin: { description: 'e.g. "40%", "4.8/5"' } },
    { name: 'metricLabel', type: 'text', localized: true },
    { name: 'image', type: 'text' },
    { name: 'href', type: 'text' },
    { name: 'extra', type: 'json', admin: { description: 'Odd one-off fields for this group' } },
  ],
}
