import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const rename = {
  type: 'local-jsx',
  name: 'rename',
  description: t('cmd_rename') as string,
  immediate: true,
  argumentHint: '[name]',
  load: () => import('./rename.js'),
} satisfies Command

export default rename
