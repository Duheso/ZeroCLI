import type { Command } from '../../commands.js'
import { shouldInferenceConfigCommandBeImmediate } from '../../utils/immediateCommand.js'
import { t } from '../../i18n/index.js'

export default {
  type: 'local-jsx',
  name: 'effort',
  description: t('cmd_effort') as string,
  argumentHint: '[low|medium|high|max|auto]',
  get immediate() {
    return shouldInferenceConfigCommandBeImmediate()
  },
  load: () => import('./effort.js'),
} satisfies Command
