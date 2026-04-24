import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const agents = {
  type: 'local-jsx',
  name: 'agents',
  description: t('cmd_agents') as string,
  load: () => import('./agents.js'),
} satisfies Command

export default agents
