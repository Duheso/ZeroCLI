import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const update: Command = {
  name: 'update',
  description: t('cmd_update') as string,
  type: 'local-jsx',
  isEnabled: () => true,
  load: () => import('./update.js'),
}

export default update
