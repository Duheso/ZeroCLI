import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'
import { getFeatureValue_CACHED_MAY_BE_STALE } from '../../services/analytics/growthbook.js'
import { isPolicyAllowed } from '../../services/policyLimits/index.js'

const web = {
  type: 'local-jsx',
  name: 'web-setup',
  description: t('cmd_web_setup') as string,
  availability: ['claude-ai'],
  isEnabled: () =>
    getFeatureValue_CACHED_MAY_BE_STALE('tengu_cobalt_lantern', false) &&
    isPolicyAllowed('allow_remote_sessions'),
  get isHidden() {
    return !isPolicyAllowed('allow_remote_sessions')
  },
  load: () => import('./remote-setup.js'),
} satisfies Command

export default web
