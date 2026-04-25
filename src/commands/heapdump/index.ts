import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const heapDump = {
  type: 'local',
  name: 'heapdump',
  description: t('cmd_heapdump') as string,
  isHidden: true,
  supportsNonInteractive: true,
  load: () => import('./heapdump.js'),
} satisfies Command

export default heapDump
