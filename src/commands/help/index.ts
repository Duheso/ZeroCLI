import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const help = {
  type: 'local-jsx',
  name: 'help',
  description: t('cmd_help') as string,
  load: () => import('./help.js'),
} satisfies Command

export default help
