import type { Command } from '../../commands.js'
import { isConsumerSubscriber } from '../../utils/auth.js'
import { t } from '../../i18n/index.js'

const privacySettings = {
  type: 'local-jsx',
  name: 'privacy-settings',
  description: t('cmd_privacy') as string,
  isEnabled: () => {
    return isConsumerSubscriber()
  },
  load: () => import('./privacy-settings.js'),
} satisfies Command

export default privacySettings
