import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const exit = {
  type: 'local-jsx',
  name: 'exit',
  aliases: ['quit'],
  description: t('cmd_exit') as string,
  immediate: true,
  load: () => import('./exit.js'),
} satisfies Command

export default exit
