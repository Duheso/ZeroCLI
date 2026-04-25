import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const permissions = {
  type: 'local-jsx',
  name: 'permissions',
  aliases: ['allowed-tools'],
  description: t('cmd_permissions') as string,
  load: () => import('./permissions.js'),
} satisfies Command

export default permissions
