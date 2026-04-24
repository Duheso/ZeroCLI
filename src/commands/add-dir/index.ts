import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const addDir = {
  type: 'local-jsx',
  name: 'add-dir',
  description: t('cmd_add_dir') as string,
  argumentHint: '<path>',
  load: () => import('./add-dir.js'),
} satisfies Command

export default addDir
