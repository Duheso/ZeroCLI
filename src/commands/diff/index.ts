import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

export default {
  type: 'local-jsx',
  name: 'diff',
  description: t('cmd_diff') as string,
  load: () => import('./diff.js'),
} satisfies Command
