import type { Command } from '../../commands.js'
import {
  isVoiceGrowthBookEnabled,
  isVoiceModeEnabled,
} from '../../voice/voiceModeEnabled.js'
import { t } from '../../i18n/index.js'

const voice = {
  type: 'local',
  name: 'voice',
  description: t('cmd_voice') as string,
  availability: ['claude-ai'],
  isEnabled: () => isVoiceGrowthBookEnabled(),
  get isHidden() {
    return !isVoiceModeEnabled()
  },
  supportsNonInteractive: false,
  load: () => import('./voice.js'),
} satisfies Command

export default voice
