import type { CollectionBeforeOperationHook } from 'payload'

/**
 * Force writes that arrive through the MCP plugin (`req.payloadAPI === 'MCP'`)
 * to be saved as a *draft version* — the currently published version stays live
 * on the site, the MCP edit accumulates on top as an unpublished draft, and a
 * human publishes it deliberately in the Payload admin.
 *
 * This sets the `draft: true` operation flag (rather than writing
 * `_status: 'draft'` onto the main document, which would demote the whole doc
 * and pull it out of the published API the website build reads).
 *
 * Applied to every content collection that has `versions.drafts` enabled.
 */
export const mcpDraftGuard: CollectionBeforeOperationHook = ({ req, args, operation }) => {
  if (req.payloadAPI === 'MCP' && (operation === 'create' || operation === 'update')) {
    return { ...args, draft: true }
  }
  return args
}
