import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const memory: Command = {
  type: 'local-jsx',
  name: 'memory',
  description: t('cmd_memory') as string,
  load: () => import('./memory.js'),
}

export default memory
