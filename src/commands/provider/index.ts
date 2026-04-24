import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const provider = {
  type: 'local-jsx',
  name: 'provider',
  description: t('cmd_provider') as string,
  load: () => import('./provider.js'),
} satisfies Command

export default provider
