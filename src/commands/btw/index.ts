import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const btw = {
  type: 'local-jsx',
  name: 'btw',
  description: t('cmd_btw') as string,
  immediate: true,
  argumentHint: '<question>',
  load: () => import('./btw.js'),
} satisfies Command

export default btw
