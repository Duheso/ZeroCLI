import type { Command } from '../../commands.js'
import { isEnvTruthy } from '../../utils/envUtils.js'
import { t } from '../../i18n/index.js'

const doctor: Command = {
  name: 'doctor',
  description: t('cmd_doctor') as string,
  isEnabled: () => !isEnvTruthy(process.env.DISABLE_DOCTOR_COMMAND),
  type: 'local-jsx',
  load: () => import('./doctor.js'),
}

export default doctor
