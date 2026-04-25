import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const theme = {
  type: 'local-jsx',
  name: 'theme',
  description: t('cmd_theme') as string,
  load: () => import('./theme.js'),
} satisfies Command

export default theme
