import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const buddy = {
  type: 'local-jsx',
  name: 'buddy',
  description: t('cmd_buddy') as string,
  immediate: true,
  argumentHint: '[status|mute|unmute|help]',
  load: () => import('./buddy.js'),
} satisfies Command

export default buddy
