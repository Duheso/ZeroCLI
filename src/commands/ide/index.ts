import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const ide = {
  type: 'local-jsx',
  name: 'ide',
  description: t('cmd_ide') as string,
  argumentHint: '[open]',
  load: () => import('./ide.js'),
} satisfies Command

export default ide
