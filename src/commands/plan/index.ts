import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const plan = {
  type: 'local-jsx',
  name: 'plan',
  description: t('cmd_plan') as string,
  argumentHint: '[open|<description>]',
  load: () => import('./plan.js'),
} satisfies Command

export default plan
