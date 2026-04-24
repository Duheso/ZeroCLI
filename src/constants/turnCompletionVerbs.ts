import { isPortuguese } from '../i18n/index.js'

// Past tense verbs for turn completion messages
// These verbs work naturally with "for [duration]" (e.g., "Worked for 5s")
export const TURN_COMPLETION_VERBS = [
  'Baked',
  'Brewed',
  'Churned',
  'Cogitated',
  'Cooked',
  'Crunched',
  'Sautéed',
  'Worked',
]

// PT-BR past tense verbs – "Trabalhou por 5s"
export const TURN_COMPLETION_VERBS_PT_BR = [
  'Processou',
  'Elaborou',
  'Computou',
  'Analisou',
  'Concluiu',
  'Resolveu',
  'Executou',
  'Trabalhou',
]

export function getTurnCompletionVerbs(): string[] {
  return isPortuguese() ? TURN_COMPLETION_VERBS_PT_BR : TURN_COMPLETION_VERBS
}
