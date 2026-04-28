import capitalize from 'lodash-es/capitalize.js'
import type { SettingSource } from 'src/utils/settings/constants.js'
import { getSettingSourceName } from 'src/utils/settings/constants.js'
import { t } from '../../i18n/index.js'

export function getAgentSourceDisplayName(
  source: SettingSource | 'all' | 'built-in' | 'plugin',
): string {
  if (source === 'all') {
    return t('agents_title')
  }
  if (source === 'built-in') {
    return t('agents_builtin_source')
  }
  if (source === 'plugin') {
    return t('agents_plugin_source')
  }
  return capitalize(getSettingSourceName(source))
}
