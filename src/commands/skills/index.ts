import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const skills = {
  type: 'local-jsx',
  name: 'skills',
  description: t('cmd_skills') as string,
  load: () => import('./skills.js'),
} satisfies Command

export default skills
