import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const mobile = {
  type: 'local-jsx',
  name: 'mobile',
  aliases: ['ios', 'android'],
  description: t('cmd_mobile') as string,
  load: () => import('./mobile.js'),
} satisfies Command

export default mobile
