/**
 * Zero CLI – Internationalization (i18n) module
 *
 * Language detection priority:
 *  1. ZERO_LANG environment variable  (e.g. ZERO_LANG=pt-BR)
 *  2. uiLanguage field from user settings file
 *  3. System locale  ($LANG / $LC_ALL / $LC_MESSAGES)
 *  4. Fallback: English ('en')
 *
 * Supported locales: 'en', 'pt-BR'
 */

import { en } from './locales/en.js'
import { ptBR } from './locales/pt-BR.js'
import type { TranslationKeys } from './locales/en.js'

export type SupportedLocale = 'en' | 'pt-BR'

const LOCALES: Record<SupportedLocale, TranslationKeys> = {
  en,
  'pt-BR': ptBR,
}

/**
 * Detect locale from the system LANG / LC_ALL / LC_MESSAGES env vars.
 * Returns a SupportedLocale or null when unrecognised.
 */
function detectSystemLocale(): SupportedLocale | null {
  const raw =
    process.env['ZERO_LANG'] ??
    process.env['LANG'] ??
    process.env['LC_ALL'] ??
    process.env['LC_MESSAGES'] ??
    ''

  const normalised = raw.toLowerCase().replace('_', '-')

  if (normalised.startsWith('pt-br') || normalised.startsWith('pt_br')) return 'pt-BR'
  if (normalised.startsWith('pt')) return 'pt-BR'
  if (normalised.startsWith('en')) return 'en'

  return null
}

/**
 * Read uiLanguage from the user settings without importing the full
 * settings module at module-load time (avoids circular deps).
 * Returns null when not set or when the settings cannot be read.
 */
function getSettingsUiLanguage(): SupportedLocale | null {
  try {
    // Lazy import to avoid circular dependency issues at startup
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getInitialSettings } = require('../utils/settings/settings.js') as typeof import('../utils/settings/settings.js')
    const settings = getInitialSettings()
    const lang = (settings as Record<string, unknown>)['uiLanguage'] as string | undefined
    if (!lang) return null
    const key = lang.toLowerCase().replace('_', '-')
    if (key === 'pt-br' || key === 'portuguese' || key === 'português') return 'pt-BR'
    if (key === 'en' || key === 'english') return 'en'
    return null
  } catch {
    return null
  }
}

let _locale: SupportedLocale | null = null

/** Resolve and cache the active locale once. */
function resolveLocale(): SupportedLocale {
  if (_locale) return _locale

  // Priority 1: ZERO_LANG env var (checked inline so we never miss it)
  const envLang = process.env['ZERO_LANG']
  if (envLang) {
    const k = envLang.toLowerCase().replace('_', '-')
    if (k === 'pt-br' || k.startsWith('pt')) {
      _locale = 'pt-BR'
      return _locale
    }
    if (k === 'en' || k.startsWith('en')) {
      _locale = 'en'
      return _locale
    }
  }

  // Priority 2: uiLanguage from settings
  const fromSettings = getSettingsUiLanguage()
  if (fromSettings) {
    _locale = fromSettings
    return _locale
  }

  // Priority 3: system locale
  const fromSystem = detectSystemLocale()
  if (fromSystem) {
    _locale = fromSystem
    return _locale
  }

  // Priority 4: fallback
  _locale = 'en'
  return _locale
}

/** The active translations object. */
function getTranslations(): TranslationKeys {
  return LOCALES[resolveLocale()]
}

/**
 * Main translation accessor.
 *
 * Usage:
 *   import { t } from '../i18n/index.js'
 *   const label = t('pressEnterBold')            // string key
 *   const msg   = t('spentOnProvider')('$5', 'Anthropic')  // function key
 */
export function t<K extends keyof TranslationKeys>(key: K): TranslationKeys[K] {
  return getTranslations()[key]
}

/** Returns the currently active locale identifier. */
export function getActiveLocale(): SupportedLocale {
  return resolveLocale()
}

/** Returns true when the active locale is Portuguese (Brazil). */
export function isPortuguese(): boolean {
  return resolveLocale() === 'pt-BR'
}

/**
 * Reset the cached locale (useful in tests or when settings change at runtime).
 */
export function resetLocaleCache(): void {
  _locale = null
}

export type { TranslationKeys }
