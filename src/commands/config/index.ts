import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const config = {
  aliases: ['settings'],
  type: 'local-jsx',
  name: 'config',
  description: t('cmd_config') as string,
  load: () => import('./config.js'),
} satisfies Command

export default config
