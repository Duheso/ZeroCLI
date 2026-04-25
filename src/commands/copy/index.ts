/**
 * Copy command - minimal metadata only.
 * Implementation is lazy-loaded from copy.tsx to reduce startup time.
 */
import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const copy = {
  type: 'local-jsx',
  name: 'copy',
  description: t('cmd_copy') as string,
  load: () => import('./copy.js'),
} satisfies Command

export default copy
