import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const stickers = {
  type: 'local',
  name: 'stickers',
  description: t('cmd_stickers') as string,
  supportsNonInteractive: false,
  load: () => import('./stickers.js'),
} satisfies Command

export default stickers
