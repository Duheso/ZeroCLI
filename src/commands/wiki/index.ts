import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const wiki = {
  type: 'local-jsx',
  name: 'wiki',
  description: t('cmd_wiki') as string,
  argumentHint: '[init|status]',
  immediate: true,
  load: () => import('./wiki.js'),
} satisfies Command

export default wiki
