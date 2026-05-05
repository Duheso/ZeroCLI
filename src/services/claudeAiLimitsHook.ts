import { useEffect, useState } from 'react'
import {
  type ZeroAILimits,
  currentLimits,
  statusListeners,
} from './claudeAiLimits.js'

export function useZeroAiLimits(): ZeroAILimits {
  const [limits, setLimits] = useState<ZeroAILimits>({ ...currentLimits })

  useEffect(() => {
    const listener = (newLimits: ZeroAILimits) => {
      setLimits({ ...newLimits })
    }
    statusListeners.add(listener)

    return () => {
      statusListeners.delete(listener)
    }
  }, [])

  return limits
}
