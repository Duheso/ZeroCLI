import { describe, expect, test } from 'bun:test'
import { join } from 'path'

import { optionForPermissionSaveDestination } from '../components/permissions/rules/AddPermissionRules.tsx'
import { isZeroSettingsPath } from './permissions/filesystem.ts'
import { getValidationTip } from './settings/validationTips.ts'

describe('Zero CLI settings path surfaces', () => {
  test('isZeroSettingsPath recognizes project .zero settings files', () => {
    expect(
      isZeroSettingsPath(
        join(process.cwd(), '.zerocli', 'settings.json'),
      ),
    ).toBe(true)

    expect(
      isZeroSettingsPath(
        join(process.cwd(), '.zerocli', 'settings.local.json'),
      ),
    ).toBe(true)
  })

  test('permission save destinations point user settings to ~/.zero', () => {
    expect(optionForPermissionSaveDestination('userSettings')).toEqual({
      label: 'User settings',
      description: 'Saved in ~/.zerocli/settings.json',
      value: 'userSettings',
    })
  })

  test('permission save destinations point project settings to .zero', () => {
    expect(optionForPermissionSaveDestination('projectSettings')).toEqual({
      label: 'Project settings',
      description: 'Checked in at .zerocli/settings.json',
      value: 'projectSettings',
    })

    expect(optionForPermissionSaveDestination('localSettings')).toEqual({
      label: 'Project settings (local)',
      description: 'Saved in .zerocli/settings.local.json',
      value: 'localSettings',
    })
  })
})

describe('Zero CLI validation tips', () => {
  test('permissions.defaultMode invalid value keeps suggestion but no Zero docs link', () => {
    const tip = getValidationTip({
      path: 'permissions.defaultMode',
      code: 'invalid_value',
      enumValues: [
        'acceptEdits',
        'bypassPermissions',
        'default',
        'dontAsk',
        'plan',
      ],
    })

    expect(tip).toEqual({
      suggestion:
        'Valid modes: "acceptEdits" (ask before file changes), "plan" (analysis only), "bypassPermissions" (auto-accept all), or "default" (standard behavior)',
    })
  })
})
