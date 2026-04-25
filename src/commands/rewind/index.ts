import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const rewind = {
  description: t('cmd_rewind') as string,
  name: 'rewind',
  aliases: ['checkpoint'],
  argumentHint: '',
  type: 'local',
  supportsNonInteractive: false,
  load: () => import('./rewind.js'),
} satisfies Command

export default rewind
