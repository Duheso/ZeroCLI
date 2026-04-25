import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const status = {
  type: 'local-jsx',
  name: 'status',
  description: t('cmd_status') as string,
  immediate: true,
  load: () => import('./status.js'),
} satisfies Command

export default status
