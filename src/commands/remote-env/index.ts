import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'
import { isPolicyAllowed } from '../../services/policyLimits/index.js'
import { isClaudeAISubscriber } from '../../utils/auth.js'

export default {
  type: 'local-jsx',
  name: 'remote-env',
  description: t('cmd_remote_env') as string,
  isEnabled: () =>
    isClaudeAISubscriber() && isPolicyAllowed('allow_remote_sessions'),
  get isHidden() {
    return !isClaudeAISubscriber() || !isPolicyAllowed('allow_remote_sessions')
  },
  load: () => import('./remote-env.js'),
} satisfies Command
