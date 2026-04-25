import type { Command } from '../../commands.js'
import { t } from '../../i18n/index.js'

const onboardGithub: Command = {
  name: 'onboard-github',
  aliases: ['onboarding-github', 'onboardgithub', 'onboardinggithub'],
  description: t('cmd_onboard_github') as string,
  type: 'local-jsx',
  load: () => import('./onboard-github.js'),
}

export default onboardGithub
