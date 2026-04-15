/**
 * useTimer Hook Tests
 * 
 * Tests for custom React hook that manages countdown timers.
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useTimer } from '@react/hooks/useTimer'
import { ResetType } from '../../engine'

describe('useTimer Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Basic Countdown', () => {
    it('should render countdown for daily reset', () => {
      const mockNow = new Date('2024-01-02T15:30:00Z')
      jest.setSystemTime(mockNow)

      const { result } = renderHook(() => useTimer('daily'))

      // Should have ~8.5 hours = 30600 seconds
      expect(result.current.secondsLeft).toBeGreaterThan(30000)
      expect(result.current.secondsLeft).toBeLessThan(31000)
    })

    it('should return formatted time string', () => {
      const { result } = renderHook(() => useTimer('daily'))

      expect(result.current.formattedTime).toMatch(/^\d+[hm]/i)
    })

    it('should update countdown every second', async () => {
      const { result } = renderHook(() => useTimer('daily'))

      const initial = result.current.secondsLeft

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(result.current.secondsLeft).toBe(initial - 1)
      })
    })

    it('should format time as hours and minutes', () => {
      jest.setSystemTime(new Date('2024-01-02T15:30:00Z'))

      const { result } = renderHook(() => useTimer('daily'))

      // ~8.5 hours = 8h 30m
      expect(result.current.formattedTime).toContain('h')
    })
  })

  describe('Weekly & Monthly Timers', () => {
    it('should handle weekly reset timer', () => {
      jest.setSystemTime(new Date('2024-01-04T15:00:00Z'))

      const { result } = renderHook(() => useTimer('weekly'))

      expect(result.current.secondsLeft).toBeGreaterThan(0)
      expect(result.current.resetType).toBe('weekly')
    })

    it('should handle monthly reset timer', () => {
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))

      const { result } = renderHook(() => useTimer('monthly'))

      expect(result.current.secondsLeft).toBeGreaterThan(0)
      expect(result.current.resetType).toBe('monthly')
    })
  })

  describe('Timer Lifecycle', () => {
    it('should cleanup interval on unmount', () => {
      const { result, unmount } = renderHook(() => useTimer('daily'))

      const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
      clearIntervalSpy.mockRestore()
    })
  })

  describe('Time Formatting', () => {
    it('should format under 1 hour as minutes', () => {
      jest.setSystemTime(new Date('2024-01-02T23:45:00Z'))

      const { result } = renderHook(() => useTimer('daily'))

      // 15 minutes = 900 seconds
      expect(result.current.secondsLeft).toBeLessThan(1000)
      expect(result.current.formattedTime).toMatch(/\d+m/)
    })

    it('should format over 1 hour with hours', () => {
      jest.setSystemTime(new Date('2024-01-02T12:00:00Z'))

      const { result } = renderHook(() => useTimer('daily'))

      // 12 hours until reset
      expect(result.current.formattedTime).toMatch(/\d+h/)
    })

    it('should have isReady flag', () => {
      const { result } = renderHook(() => useTimer('daily'))

      expect(typeof result.current.isReady).toBe('boolean')
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple hook instances independently', () => {
      const { result: daily } = renderHook(() => useTimer('daily'))
      const { result: weekly } = renderHook(() => useTimer('weekly'))

      expect(daily.current.resetType).toBe('daily')
      expect(weekly.current.resetType).toBe('weekly')
    })
  })
})
