import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const outputStyle = {
  type: 'local-jsx',
  name: 'output-style',
  description: t('cmd_output_style') as string,
  isHidden: true,
  load: () => import('./output-style.js'),
} satisfies Command

export default outputStyle
