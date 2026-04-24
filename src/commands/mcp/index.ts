import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const mcp = {
  type: 'local-jsx',
  name: 'mcp',
  description: t('cmd_mcp') as string,
  immediate: true,
  argumentHint: '[enable|disable [server-name]]',
  load: () => import('./mcp.js'),
} satisfies Command

export default mcp
