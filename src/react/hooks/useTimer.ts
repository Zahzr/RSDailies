/**
 * useTimer Hook
 * 
 * Custom React hook for managing countdown timers.
 * Updates every second to show time remaining until reset.
 */

import { useState, useEffect, useCallback } from 'react'
import { ResetType, calculateCountdown } from '../../engine'

interface UseTimerReturn {
  secondsLeft: number
  formattedTime: string
  resetType: ResetType
  isReady: boolean
}

/**
 * Hook for countdown timer until next reset
 * @param resetType - 'daily', 'weekly', or 'monthly'
 * @returns Timer data with formatted time display
 */
export function useTimer(resetType: ResetType): UseTimerReturn {
  if (!['daily', 'weekly', 'monthly'].includes(resetType)) {
    throw new Error(`Invalid reset type: ${resetType}`)
  }

  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const { secondsLeft } = calculateCountdown(resetType)
    return secondsLeft
  })

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      const { secondsLeft } = calculateCountdown(resetType)
      setSecondsLeft(secondsLeft)
    }, 1000)

    return () => clearInterval(interval)
  }, [resetType])

  // Format seconds into readable time string
  const formattedTime = useCallback((): string => {
    const hours = Math.floor(secondsLeft / 3600)
    const minutes = Math.floor((secondsLeft % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }, [secondsLeft])

  const { isReady } = calculateCountdown(resetType)

  return {
    secondsLeft,
    formattedTime: formattedTime(),
    resetType,
    isReady,
  }
}
