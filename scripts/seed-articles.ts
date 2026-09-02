/**
 * Seeds authors + blog categories + the 7 blog articles (WS-3).
 * Run:  npx payload run scripts/seed-articles.ts
 *
 * Article bodies are the prose extracted from the current prerendered pages,
 * in scripts/article-bodies/<slug>.json (Payload Lexical JSON).
 * Idempotent: upserts by slug.
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const body = (slug: string) =>
  JSON.parse(readFileSync(resolve(HERE, 'article-bodies', `${slug}.json`), 'utf8'))

const payload = await getPayload({ config })

const upsert = async (collection: any, where: any, data: any) => {
  const existing = await payload.find({ collection, where, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    await payload.update({ collection, id: existing.docs[0].id, data, depth: 0 })
    return existing.docs[0].id as string
  }
  const created = await payload.create({ collection, data, depth: 0 })
  return created.id as string
}

// --- authors --------------------------------------------------------------
const AUTHORS: Record<string, { name: string; bio: string }> = {
  'priya-sharma': {
    name: 'Dr. Priya Sharma',
    bio: 'AI Researcher & Fitness Technology Expert with 12 years of experience in health tech innovation.',
  },
  'rajesh-kumar': {
    name: 'Rajesh Kumar',
    bio: 'Fitness Entrepreneur & Business Coach with 15+ successful fitness ventures across tier-2 Indian cities.',
  },
  'sneha-joshi': {
    name: 'Sneha Joshi',
    bio: 'Digital Marketing Specialist & Fitness Industry Expert with 7 years helping trainers grow their online presence.',
  },
  'vikram-singh': {
    name: 'Vikram Singh',
    bio: "Senior Fitness Coach with 12+ years experience managing clients through India's diverse festival calendar across multiple cities.",
  },
  'kavya-reddy': {
    name: 'Kavya Reddy',
    bio: 'Certified Trainer & Monsoon Fitness Specialist with 8 years of experience in seasonal training programs.',
  },
  'arjun-patel': {
    name: 'Dr. Arjun Patel',
    bio: 'Nutritionist & Sports Dietitian with 10+ years specializing in Indian vegetarian nutrition for athletes.',
  },
  'arun-malhotra': {
    name: 'Arun Malhotra',
    bio: 'Financial Technology Expert & Business Consultant specializing in digital payments for small businesses across India.',
  },
}
const authorId: Record<string, string> = {}
for (const [slug, a] of Object.entries(AUTHORS)) {
  authorId[slug] = await upsert(
    'authors',
    { slug: { equals: slug } },
    { slug, name: a.name, shortBio: a.bio, bio: a.bio, _status: 'published' },
  )
}

// --- blog categories (replace the CMS-0 placeholders with topic categories) --
const CATEGORIES = [
  { slug: 'ai-technology', name: 'AI & Technology', description: 'How AI and new tools are reshaping coaching in India.' },
  { slug: 'business-growth', name: 'Business & Growth', description: 'Client acquisition, pricing, marketing and payments for fitness businesses.' },
  { slug: 'client-management', name: 'Client Management', description: 'Retention, communication and coaching clients through real life.' },
  { slug: 'nutrition', name: 'Nutrition', description: 'Diet planning and nutrition guidance for Indian clients.' },
]
const KEEP = new Set(CATEGORIES.map((c) => c.slug))
for (const stale of await payload.find({ collection: 'blogCategories', limit: 100, depth: 0 })
  .then((r) => r.docs)) {
  if (!KEEP.has((stale as any).slug)) await payload.delete({ collection: 'blogCategories', id: (stale as any).id })
}
const catId: Record<string, string> = {}
for (const c of CATEGORIES) {
  catId[c.slug] = await upsert(
    'blogCategories',
    { slug: { equals: c.slug } },
    { ...c, _status: 'published' },
  )
}

// --- articles ------------------------------------------------------------
const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`

type A = {
  slug: string
  title: string
  excerpt: string
  author: string
  category: string
  publishedDate: string
  readTime: string
  heroImage: string
  tags: string[]
  related: string[]
}
const ARTICLES: A[] = [
  {
    slug: 'ai-fitness-revolution',
    title: 'The Future of Personal Training in India: AI Revolution',
    excerpt:
      'Discover how AI technology is transforming the fitness industry across India, from Mumbai to Chennai, and why Indian trainers are leading this digital revolution.',
    author: 'priya-sharma',
    category: 'ai-technology',
    publishedDate: '2025-01-10',
    readTime: '8 min read',
    heroImage: IMG('1571019613454-1cb2f99b2d8b'),
    tags: ['AI Technology', 'Fitness Tech', 'Digital Transformation', 'Indian Market', 'Personal Training'],
    related: ['digital-marketing-fitness-professionals', 'business-growth-tier2-cities'],
  },
  {
    slug: 'business-growth-tier2-cities',
    title: 'Building a Sustainable Fitness Business in Tier-2 Cities',
    excerpt:
      'Learn strategies for establishing and growing your personal training business in smaller Indian cities like Indore, Chandigarh, and Kochi.',
    author: 'rajesh-kumar',
    category: 'business-growth',
    publishedDate: '2025-01-08',
    readTime: '6 min read',
    heroImage: IMG('1571019613454-1cb2f99b2d8b'),
    tags: ['Business Growth', 'Tier-2 Cities', 'Entrepreneurship', 'Fitness Business', 'Indian Market'],
    related: ['digital-marketing-fitness-professionals', 'upi-digital-payments-guide'],
  },
  {
    slug: 'digital-marketing-fitness-professionals',
    title: 'Digital Marketing for Indian Fitness Professionals',
    excerpt:
      'Master WhatsApp Business, Instagram Reels, and local SEO to attract more clients in your city and build your brand.',
    author: 'sneha-joshi',
    category: 'business-growth',
    publishedDate: '2024-12-30',
    readTime: '9 min read',
    heroImage: IMG('1611224923853-80b023f02d71'),
    tags: ['Digital Marketing', 'Social Media', 'WhatsApp Business', 'Local SEO', 'Fitness Marketing'],
    related: ['business-growth-tier2-cities', 'ai-fitness-revolution'],
  },
  {
    slug: 'festival-season-client-management',
    title: 'Managing Client Expectations During Festival Seasons',
    excerpt:
      'Navigate Diwali, Holi, and regional festivals while keeping your clients motivated and on track with their fitness goals.',
    author: 'vikram-singh',
    category: 'client-management',
    publishedDate: '2024-12-28',
    readTime: '9 min read',
    heroImage: IMG('1578662996442-48f60103fc96'),
    tags: ['Client Management', 'Festival Season', 'Motivation', 'Indian Festivals', 'Fitness Goals'],
    related: ['monsoon-fitness-training', 'vegetarian-nutrition-planning'],
  },
  {
    slug: 'monsoon-fitness-training',
    title: 'Monsoon Fitness: Keeping Clients Active During Rainy Season',
    excerpt:
      "Practical tips for maintaining client engagement and fitness routines during India's monsoon season with indoor alternatives.",
    author: 'kavya-reddy',
    category: 'client-management',
    publishedDate: '2025-01-05',
    readTime: '7 min read',
    heroImage: IMG('1519823551278-64ac92734fb1'),
    tags: ['Monsoon Fitness', 'Indoor Workouts', 'Seasonal Training', 'Client Retention', 'Weather Challenges'],
    related: ['festival-season-client-management', 'ai-fitness-revolution'],
  },
  {
    slug: 'vegetarian-nutrition-planning',
    title: 'Nutrition Planning for Indian Vegetarian Clients',
    excerpt:
      'Complete guide to creating effective vegetarian meal plans that honor Indian dietary traditions while meeting fitness goals.',
    author: 'arjun-patel',
    category: 'nutrition',
    publishedDate: '2025-01-03',
    readTime: '7 min read',
    heroImage: IMG('1512621776951-a57141f2eefd'),
    tags: ['Vegetarian Nutrition', 'Indian Diet', 'Meal Planning', 'Protein Sources', 'Fitness Nutrition'],
    related: ['festival-season-client-management', 'monsoon-fitness-training'],
  },
  {
    slug: 'upi-digital-payments-guide',
    title: 'UPI and Digital Payments: Complete Guide for Trainers',
    excerpt:
      'Everything you need to know about accepting digital payments, managing GST, and growing your income with modern payment solutions.',
    author: 'arun-malhotra',
    category: 'business-growth',
    publishedDate: '2024-12-25',
    readTime: '6 min read',
    heroImage: IMG('1556742049-0cfed4f6a45d'),
    tags: ['UPI Payments', 'Digital Payments', 'GST', 'Finance', 'Business Growth'],
    related: ['business-growth-tier2-cities', 'digital-marketing-fitness-professionals'],
  },
]

// pass 1: create/update without `related` (need all ids first)
const artId: Record<string, string> = {}
for (const a of ARTICLES) {
  artId[a.slug] = await upsert(
    'articles',
    { slug: { equals: a.slug } },
    {
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: catId[a.category],
      author: authorId[a.author],
      publishedDate: a.publishedDate,
      updatedDate: a.publishedDate,
      readTime: a.readTime,
      heroImage: a.heroImage,
      tags: a.tags.map((tag) => ({ tag })),
      body: body(a.slug),
      _status: 'published',
    },
  )
}
// pass 2: wire `related`
for (const a of ARTICLES) {
  await payload.update({
    collection: 'articles',
    id: artId[a.slug],
    data: { related: a.related.map((s) => artId[s]).filter(Boolean) },
    depth: 0,
  })
}

// eslint-disable-next-line no-console
console.log('seed-articles: done', {
  authors: Object.keys(authorId).length,
  categories: Object.keys(catId).length,
  articles: Object.keys(artId).length,
})
process.exit(0)
