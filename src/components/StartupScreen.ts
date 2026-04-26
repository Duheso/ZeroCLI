/**
 * Zero CLI startup screen — filled-block text logo with sunset gradient.
 * Called once at CLI startup before the Ink UI renders.
 *
 * Addresses: https://github.com/Duheso/ZeroCLI/issues/55
 */

import { isLocalProviderUrl, resolveProviderRequest } from '../services/api/providerConfig.js'
import { getLocalOpenAICompatibleProviderLabel } from '../utils/providerDiscovery.js'
import { getSettings_DEPRECATED } from '../utils/settings/settings.js'
import { parseUserSpecifiedModel } from '../utils/model/model.js'
import { t } from '../i18n/index.js'

declare const MACRO: { VERSION: string; DISPLAY_VERSION?: string }

const ESC = '\x1b['
const RESET = `${ESC}0m`
const DIM = `${ESC}2m`

type RGB = [number, number, number]
const rgb = (r: number, g: number, b: number) => `${ESC}38;2;${r};${g};${b}m`

function lerp(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

function gradAt(stops: RGB[], t: number): RGB {
  const c = Math.max(0, Math.min(1, t))
  const s = c * (stops.length - 1)
  const i = Math.floor(s)
  if (i >= stops.length - 1) return stops[stops.length - 1]
  return lerp(stops[i], stops[i + 1], s - i)
}

function paintLine(text: string, stops: RGB[], lineT: number, wavePos?: number): string {
  const WHITE: RGB = [255, 255, 255]
  let out = ''
  const len = text.length
  for (let i = 0; i < len; i++) {
    const charT = len > 1 ? lineT * 0.5 + (i / (len - 1)) * 0.5 : lineT
    const base = gradAt(stops, charT)
    let color = base
    if (wavePos !== undefined) {
      const wave = (i / Math.max(1, len - 1)) - wavePos
      const shimmer = Math.max(0, Math.sin(wave * Math.PI * 3)) ** 4
      color = lerp(base, WHITE, shimmer * 0.88)
    }
    out += `${rgb(...color)}${text[i]}`
  }
  return out + RESET
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const PURPLE_CYAN_GRAD: RGB[] = [
  [160, 32, 240],
  [120, 60, 250],
  [70, 120, 255],
  [0, 180, 255],
  [0, 240, 240],
]

const ACCENT: RGB = [0, 220, 240]
const CREAM: RGB = [200, 180, 230]
const DIMCOL: RGB = [100, 80, 140]
const BORDER: RGB = [80, 50, 130]

// ─── Filled Block Text Logo ───────────────────────────────────────────────────

const LOGO_ZERO = [
  `  ███████╗███████╗██████╗  ██████╗     ██████╗██╗     ██╗`,
  `  ╚══███╔╝██╔════╝██╔══██╗██╔═══██╗   ██╔════╝██║     ██║`,
  `    ███╔╝ █████╗  ██████╔╝██║   ██║   ██║     ██║     ██║`,
  `   ███╔╝  ██╔══╝  ██╔══██╗██║   ██║   ██║     ██║     ██║`,
  `  ███████╗███████╗██║  ██║╚██████╔╝██╗╚██████╗███████╗██║`,
  `  ╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝ ╚═════╝╚══════╝╚═╝`,
]

// ─── Provider detection ───────────────────────────────────────────────────────

export function detectProvider(): { name: string; model: string; baseUrl: string; isLocal: boolean } {
  const useGemini = process.env.CLAUDE_CODE_USE_GEMINI === '1' || process.env.CLAUDE_CODE_USE_GEMINI === 'true'
  const useGithub = process.env.CLAUDE_CODE_USE_GITHUB === '1' || process.env.CLAUDE_CODE_USE_GITHUB === 'true'
  const useOpenAI = process.env.CLAUDE_CODE_USE_OPENAI === '1' || process.env.CLAUDE_CODE_USE_OPENAI === 'true'
  const useMistral = process.env.CLAUDE_CODE_USE_MISTRAL === '1' || process.env.CLAUDE_CODE_USE_MISTRAL === 'true'

  if (useGemini) {
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
    const baseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai'
    return { name: 'Google Gemini', model, baseUrl, isLocal: false }
  }

  if (useMistral) {
    const model = process.env.MISTRAL_MODEL || 'devstral-latest'
    const baseUrl = process.env.MISTRAL_BASE_URL || 'https://api.mistral.ai/v1'
    return { name: 'Mistral', model, baseUrl, isLocal: false }
  }

  if (useGithub) {
    const model = process.env.OPENAI_MODEL || 'github:copilot'
    const baseUrl =
      process.env.OPENAI_BASE_URL || 'https://api.githubcopilot.com'
    return { name: 'GitHub Copilot', model, baseUrl, isLocal: false }
  }

  if (useOpenAI) {
    const rawModel = process.env.OPENAI_MODEL || 'gpt-4o'
    const resolvedRequest = resolveProviderRequest({
      model: rawModel,
      baseUrl: process.env.OPENAI_BASE_URL,
    })
    const baseUrl = resolvedRequest.baseUrl
    const isLocal = isLocalProviderUrl(baseUrl)
    let name = 'OpenAI'
    if (/nvidia/i.test(baseUrl) || /nvidia/i.test(rawModel) || process.env.NVIDIA_NIM)
      name = 'NVIDIA NIM'
    else if (/minimax/i.test(baseUrl) || /minimax/i.test(rawModel) || process.env.MINIMAX_API_KEY)
      name = 'MiniMax'
    else if (resolvedRequest.transport === 'codex_responses' || baseUrl.includes('chatgpt.com/backend-api/codex'))
      name = 'Codex'
    else if (/moonshot/i.test(baseUrl) || /kimi/i.test(rawModel))
      name = 'Moonshot (Kimi)'
    else if (/deepseek/i.test(baseUrl) || /deepseek/i.test(rawModel))
      name = 'DeepSeek'
    else if (/openrouter/i.test(baseUrl))
      name = 'OpenRouter'
    else if (/together/i.test(baseUrl))
      name = 'Together AI'
    else if (/groq/i.test(baseUrl))
      name = 'Groq'
    else if (/mistral/i.test(baseUrl) || /mistral/i.test(rawModel))
      name = 'Mistral'
    else if (/azure/i.test(baseUrl))
      name = 'Azure OpenAI'
    else if (/llama/i.test(rawModel))
      name = 'Meta Llama'
    else if (isLocal)
      name = getLocalOpenAICompatibleProviderLabel(baseUrl)
    
    // Resolve model alias to actual model name + reasoning effort
    let displayModel = resolvedRequest.resolvedModel
    if (resolvedRequest.reasoning?.effort) {
      displayModel = `${displayModel} (${resolvedRequest.reasoning.effort})`
    }
    
    return { name, model: displayModel, baseUrl, isLocal }
  }

  // Default: Anthropic - check settings.model first, then env vars
  const settings = getSettings_DEPRECATED() || {}
  const modelSetting = settings.model || process.env.ANTHROPIC_MODEL || process.env.CLAUDE_MODEL || 'claude-sonnet-4-6'
  const resolvedModel = parseUserSpecifiedModel(modelSetting)
  const baseUrl = process.env.ANTHROPIC_BASE_URL ?? 'https://api.anthropic.com'
  const isLocal = isLocalProviderUrl(baseUrl)
  return { name: 'Anthropic', model: resolvedModel, baseUrl, isLocal }
}

// ─── Box drawing ──────────────────────────────────────────────────────────────

function boxRow(content: string, width: number, rawLen: number): string {
  const pad = Math.max(0, width - 2 - rawLen)
  return `${rgb(...BORDER)}\u2502${RESET}${content}${' '.repeat(pad)}${rgb(...BORDER)}\u2502${RESET}`
}

// ─── Main ─────────────────────────────────────────────────────────────────────

/** Builds the provider info box lines as ANSI strings (used by ProviderInfoBox Ink component). */
export function buildProviderInfoLines(): string[] {
  const p = detectProvider()
  const W = 62
  const out: string[] = []

  out.push(`  ${rgb(...ACCENT)}\u2726${RESET} ${rgb(...CREAM)}${t('tagline')}${RESET} ${rgb(...ACCENT)}\u2726${RESET}`)

  out.push(`${rgb(...BORDER)}\u2554${'\u2550'.repeat(W - 2)}\u2557${RESET}`)

  const lbl = (k: string, v: string, c: RGB = CREAM): [string, number] => {
    const padK = k.padEnd(9)
    return [` ${DIM}${rgb(...DIMCOL)}${padK}${RESET} ${rgb(...c)}${v}${RESET}`, ` ${padK} ${v}`.length]
  }

  const provC: RGB = p.isLocal ? [130, 175, 130] : ACCENT
  let [r, l] = lbl(t('providerLabel'), p.name, provC)
  out.push(boxRow(r, W, l))
  ;[r, l] = lbl(t('modelLabel'), p.model)
  out.push(boxRow(r, W, l))
  const ep = p.baseUrl.length > 38 ? p.baseUrl.slice(0, 35) + '...' : p.baseUrl
  ;[r, l] = lbl(t('endpointLabel'), ep)
  out.push(boxRow(r, W, l))

  out.push(`${rgb(...BORDER)}\u2560${'\u2550'.repeat(W - 2)}\u2563${RESET}`)

  const sC: RGB = p.isLocal ? [130, 175, 130] : ACCENT
  const sL = p.isLocal ? t('statusLocal') : t('statusCloud')
  const sReady = t('statusReady')
  const helpIdx = sReady.indexOf('/help')
  const readyBefore = helpIdx >= 0 ? sReady.slice(0, helpIdx) : sReady
  const readyAfter = helpIdx >= 0 ? sReady.slice(helpIdx + 5) : ''
  const sRow = ` ${rgb(...sC)}\u25cf${RESET} ${DIM}${rgb(...DIMCOL)}${sL}${RESET}    ${DIM}${rgb(...DIMCOL)}${readyBefore.trimEnd()}${RESET} ${rgb(...ACCENT)}/help${RESET}${DIM}${rgb(...DIMCOL)}${readyAfter}${RESET}`
  const sLen = ` \u25cf ${sL}    ${sReady}`.length
  out.push(boxRow(sRow, W, sLen))

  out.push(`${rgb(...BORDER)}\u255a${'\u2550'.repeat(W - 2)}\u255d${RESET}`)
  out.push(`  ${DIM}${rgb(...DIMCOL)}zero ${RESET}${rgb(...ACCENT)}v${MACRO.DISPLAY_VERSION ?? MACRO.VERSION}${RESET}`)

  return out
}

/** Prints the provider info box to stdout before Ink starts (legacy — now a no-op).
 *  The logo and provider info are rendered by Ink (ShimmerLogo + ProviderInfoBox). */
export function printStartupScreen(): void {
  // Provider info is now rendered by Ink in ProviderInfoBox component
}
