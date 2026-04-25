import type { Command } from '../../commands.js';
import { t } from '../../i18n/index.js';
const plugin = {
  type: 'local-jsx',
  name: 'plugin',
  aliases: ['plugins', 'marketplace'],
  description: t('cmd_plugin') as string,
  immediate: true,
  load: () => import('./plugin.js')
} satisfies Command;
export default plugin;
