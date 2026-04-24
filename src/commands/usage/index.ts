import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

export default {
  type: 'local-jsx',
  name: 'usage',
  description: t('cmd_usage') as string,
  availability: ['claude-ai'],
  load: () => import('./usage.js'),
} satisfies Command
