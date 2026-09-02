import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * POSTs the Netlify build hook when *published* content changes, so editing in
 * the CMS redeploys trainzilla.in (whose build reads a committed snapshot of
 * this content).
 *
 * - No-op unless `NETLIFY_BUILD_HOOK_URL` is set (so local dev never triggers).
 * - Only fires when the published version could have changed: a publish, an edit
 *   to a published doc, or an unpublish/delete. Pure draft saves — including
 *   every MCP write (mcpDraftGuard forces `draft: true`) — are ignored.
 * - Debounced ~60s: a burst of edits coalesces into one build.
 */
const DEBOUNCE_MS = 60_000
let timer: ReturnType<typeof setTimeout> | null = null

function scheduleBuild(reason: string) {
  const url = process.env.NETLIFY_BUILD_HOOK_URL
  if (!url) return
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = null
    fetch(url, { method: 'POST' })
      .then((res) => console.log(`[netlify] build hook -> ${res.status} (${reason})`))
      .catch((err) => console.error('[netlify] build hook failed', err))
  }, DEBOUNCE_MS)
}

const affectsPublished = (status: unknown, prevStatus: unknown) =>
  status === 'published' || prevStatus === 'published'

export const triggerNetlifyBuildAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  operation,
  collection,
}) => {
  if (affectsPublished(doc?._status, previousDoc?._status)) {
    scheduleBuild(`${collection?.slug}.${operation}`)
  }
  return doc
}

export const triggerNetlifyBuildAfterDelete: CollectionAfterDeleteHook = ({ doc, collection }) => {
  scheduleBuild(`${collection?.slug}.delete`)
  return doc
}

export const triggerNetlifyBuildGlobalAfterChange: GlobalAfterChangeHook = ({
  doc,
  previousDoc,
  global,
}) => {
  if (doc?._status !== 'draft' || previousDoc?._status === 'published') {
    scheduleBuild(`global.${global?.slug}`)
  }
  return doc
}
