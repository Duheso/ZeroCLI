import { useContext } from 'react'
import type { WizardContextValue } from './types.js'
import { WizardContext } from './WizardProvider.js'

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext) as WizardContextValue | null
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider')
  }
  return context
}
