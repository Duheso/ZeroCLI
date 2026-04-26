import { getInitialSettings } from '../utils/settings/settings.js'
import { isPortuguese } from '../i18n/index.js'

export function getSpinnerVerbs(): string[] {
  const settings = getInitialSettings()
  const config = settings.spinnerVerbs
  const baseVerbs = isPortuguese() ? SPINNER_VERBS_PT_BR : SPINNER_VERBS_EN
  if (!config) {
    return baseVerbs
  }
  if (config.mode === 'replace') {
    return config.verbs.length > 0 ? config.verbs : baseVerbs
  }
  return [...baseVerbs, ...config.verbs]
}

// PT-BR spinner verbs – verbos de carregamento em português
export const SPINNER_VERBS_PT_BR = [
  'Analisando',
  'Arquitetando',
  'Calculando',
  'Compilando',
  'Computando',
  'Concebendo',
  'Construindo',
  'Depurando',
  'Desenvolvendo',
  'Elaborando',
  'Engenhando',
  'Estruturando',
  'Explorando',
  'Formulando',
  'Gerando',
  'Idealizando',
  'Implementando',
  'Inferindo',
  'Integrando',
  'Mapeando',
  'Modulando',
  'Orquestrando',
  'Otimizando',
  'Processando',
  'Programando',
  'Racioc\u00EDnando',
  'Refinando',
  'Resolvendo',
  'Sintetizando',
  'Sistematizando',
  'Testando',
  'Transformando',
  'Verificando',
  'Zerando', // Mantive este por ser o nome do seu projeto
]

// Spinner verbs for loading messages
export const SPINNER_VERBS_EN = [
  'Analyzing',
  'Architecting',
  'Bootstrapping',
  'Calculating',
  'Cascading',
  'Choreographing',
  'Coalescing',
  'Composing',
  'Computing',
  'Crunching',
  'Crystallizing',
  'Deciphering',
  'Determining',
  'Effecting',
  'Engineering', // Adicionado para manter o tom
  'Envisioning',
  'Forging',
  'Generating',
  'Hashing',
  'Ideating',
  'Implementing',
  'Inferring',
  'Integrating',
  'Mapping',    // Adicionado
  'Modulating', // Adicionado
  'Orchestrating',
  'Optimizing',  // Adicionado
  'Processing',
  'Refining',
  'Resolving',
  'Reticulating',
  'Synthesizing',
  'Transforming',
  'Verifying',
  'Zeroing',     // Mantido para alinhar com o projeto
]
