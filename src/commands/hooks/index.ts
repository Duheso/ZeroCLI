import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const hooks = {
  type: 'local-jsx',
  name: 'hooks',
  description: t('cmd_hooks') as string,
  immediate: true,
  load: () => import('./hooks.js'),
} satisfies Command

export default hooks
