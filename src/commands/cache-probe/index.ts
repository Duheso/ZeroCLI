import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'
import { isEnvTruthy } from '../../utils/envUtils.js'

const cacheProbe: Command = {
  type: 'local',
  name: 'cache-probe',
  description: t('cmd_cache_probe') as string,
  argumentHint: '[model] [--no-key]',
  isEnabled: () =>
    isEnvTruthy(process.env.CLAUDE_CODE_USE_OPENAI) ||
    isEnvTruthy(process.env.CLAUDE_CODE_USE_GITHUB),
  supportsNonInteractive: false,
  load: () => import('./cache-probe.js'),
}

export default cacheProbe
