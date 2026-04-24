import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const releaseNotes: Command = {
  description: t('cmd_release_notes') as string,
  name: 'release-notes',
  type: 'local',
  supportsNonInteractive: true,
  load: () => import('./release-notes.js'),
}

export default releaseNotes
