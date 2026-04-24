import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const tag = {
  type: 'local-jsx',
  name: 'tag',
  description: t('cmd_tag') as string,
  isEnabled: () => process.env.USER_TYPE === 'ant',
  argumentHint: '<tag-name>',
  load: () => import('./tag.js'),
} satisfies Command

export default tag
