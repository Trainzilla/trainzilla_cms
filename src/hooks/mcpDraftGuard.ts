import type { CollectionBeforeOperationHook } from 'payload'

/**
 * Force writes that arrive through the MCP plugin (`req.payloadAPI === 'MCP'`)
 * to be saved as a *draft version* — the currently published version stays live
 * on the site, the MCP edit accumulates on top as an unpublished draft, and a
 * human publishes it deliberately in the Payload admin.
 *
 * Exception: collections in `MCP_AUTO_PUBLISH_COLLECTIONS`. `seoPages` writes
 * (title/description/keywords metadata refreshes from the weekly SEO pipeline)
 * are low-risk and easy to revert with another write, so they're allowed to
 * publish immediately instead of waiting on a manual admin click — this lets
 * `scripts/seo/apply-cycle.mjs` publish seoPages refreshes directly. Every
 * other collection — `articles` first among them — keeps landing as a draft:
 * a human still reviews and publishes those deliberately.
 *
 * This sets the `draft: true` operation flag (rather than writing
 * `_status: 'draft'` onto the main document, which would demote the whole doc
 * and pull it out of the published API the website build reads). For an
 * auto-publish collection, the guard leaves `args.draft` exactly as the
 * caller sent it — the caller decides, not this hook.
 *
 * Applied to every content collection that has `versions.drafts` enabled.
 */
const MCP_AUTO_PUBLISH_COLLECTIONS: ReadonlySet<string> = new Set(['seoPages'])

export const mcpDraftGuard: CollectionBeforeOperationHook = ({ req, args, operation, collection }) => {
  if (
    req.payloadAPI === 'MCP' &&
    (operation === 'create' || operation === 'update') &&
    !MCP_AUTO_PUBLISH_COLLECTIONS.has(collection.slug)
  ) {
    return { ...args, draft: true }
  }
  return args
}
