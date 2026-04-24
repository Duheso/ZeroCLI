import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const stats = {
  type: 'local-jsx',
  name: 'stats',
  description: t('cmd_stats') as string,
  load: () => import('./stats.js'),
} satisfies Command

export default stats
