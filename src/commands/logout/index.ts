import type { Command } from '../../commands.js'
import { isEnvTruthy } from '../../utils/envUtils.js'
import { t } from '../../i18n/index.js'

export default {
  type: 'local-jsx',
  name: 'logout',
  description: t('cmd_logout') as string,
  isEnabled: () => !isEnvTruthy(process.env.DISABLE_LOGOUT_COMMAND),
  load: () => import('./logout.js'),
} satisfies Command
