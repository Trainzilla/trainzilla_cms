import type { GlobalConfig } from 'payload'

/**
 * Headline platform stat numbers. Sourced from `src/config/metrics.ts`
 * (`PLATFORM_METRICS`). Kept as free text (values carry their own formatting,
 * e.g. "100+", "4.8★"). Not localized in v1.
 */
export const PlatformMetrics: GlobalConfig = {
  slug: 'platformMetrics',
  access: { read: () => true },
  admin: { group: 'Landing' },
  versions: { drafts: true, max: 20 },
  fields: [
    { name: 'trainers', type: 'text' },
    { name: 'countries', type: 'text' },
    { name: 'clients', type: 'text' },
    { name: 'workouts', type: 'text' },
    { name: 'rating', type: 'text' },
    { name: 'cities', type: 'text' },
    { name: 'downloads', type: 'text' },
    { name: 'hoursSaved', type: 'text' },
  ],
}
