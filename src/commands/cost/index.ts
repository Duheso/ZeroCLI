/**
 * Cost command - minimal metadata only.
 * Implementation is lazy-loaded from cost.ts to reduce startup time.
 */
import type { Command } from '../../commands.js'
import { isZeroAISubscriber } from '../../utils/auth.js'
import { t } from '../../i18n/index.js'

const cost = {
  type: 'local',
  name: 'cost',
  description: t('cmd_cost') as string,
  get isHidden() {
    // Keep visible for Ants even if they're subscribers (they see cost breakdowns)
    if (process.env.USER_TYPE === 'ant') {
      return false
    }
    return isZeroAISubscriber()
  },
  supportsNonInteractive: true,
  load: () => import('./cost.js'),
} satisfies Command

export default cost
