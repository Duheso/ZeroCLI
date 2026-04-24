import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const tasks = {
  type: 'local-jsx',
  name: 'tasks',
  aliases: ['bashes'],
  description: t('cmd_tasks') as string,
  load: () => import('./tasks.js'),
} satisfies Command

export default tasks
