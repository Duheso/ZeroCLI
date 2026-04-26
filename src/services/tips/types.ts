import type { FileStateCache } from '../../utils/fileStateCache.js'
import type { ThemeName } from '../../utils/theme.js'

/** Context passed to tip relevance checks and content generators. */
export type TipContext = {
  /** Current UI theme name. */
  theme: ThemeName
  /** Cache of read-file state (used by relevance checks). */
  readFileState?: FileStateCache
  /** Set of bash tool names encountered in the session. */
  bashTools?: Set<string>
}

/** A single spinner tip entry. */
export type Tip = {
  /** Unique stable identifier for this tip. */
  id: string
  /** Async function returning the display string; receives context for theming. */
  content: (ctx: TipContext) => Promise<string>
  /** Minimum sessions between re-showing; 0 = always eligible. */
  cooldownSessions: number
  /** Optional relevance guard; defaults to always relevant if omitted. */
  isRelevant?: (context?: TipContext) => Promise<boolean>
}
