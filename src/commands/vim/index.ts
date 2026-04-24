import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const command = {
  name: 'vim',
  description: t('cmd_vim') as string,
  supportsNonInteractive: false,
  type: 'local',
  load: () => import('./vim.js'),
} satisfies Command

export default command
