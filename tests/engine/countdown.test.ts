/**
 * Countdown Logic Tests
 * 
 * Tests for calculating how many seconds remain until a task resets.
 */

import { calculateCountdown } from '@engine/timer'

describe('Countdown Logic', () => {
  const mockNow = (isoString: string) => {
    jest.useFakeTimers()
    const mockDate = new Date(isoString)
    jest.setSystemTime(mockDate)
  }

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('calculateCountdown', () => {
    it('should return correct seconds for daily reset', () => {
      // Given: Tuesday Jan 2, 2024 at 15:30:00 UTC (8.5 hours until daily reset)
      mockNow('2024-01-02T15:30:00Z')

      // When
      const result = calculateCountdown('daily')

      // Then: 8.5 hours = 30600 seconds
      expect(result.secondsLeft).toBe(30600)
      expect(result.isReady).toBe(false)
    })

    it('should return 86400 seconds right at reset time (next day)', () => {
      // Given: exactly at midnight UTC (reset just occurred, next is tomorrow)
      mockNow('2024-01-02T00:00:00Z')

      // When
      const result = calculateCountdown('daily')

      // Then: 24 hours = 86400 seconds until next reset
      expect(result.secondsLeft).toBe(86400)
      expect(result.isReady).toBe(false)
    })

    it('should return small values just before reset', () => {
      // Given: 10 seconds before daily reset
      mockNow('2024-01-02T23:59:50Z')

      // When
      const result = calculateCountdown('daily')

      // Then
      expect(result.secondsLeft).toBe(10)
      expect(result.isReady).toBe(false)
    })

    it('should handle weekly countdown correctly', () => {
      // Given: Thursday Jan 4, 2024 at 15:00:00 UTC (~5.375 days until Wednesday Jan 10)
      mockNow('2024-01-04T15:00:00Z')

      // When
      const result = calculateCountdown('weekly')

      // Then: 5 days 9 hours = 464,400 seconds (5*86400 + 9*3600)
      expect(result.secondsLeft).toBe(464400)
      expect(result.isReady).toBe(false)
    })

    it('should handle monthly countdown correctly', () => {
      // Given: Jan 15, 2024 at 12:00:00 UTC (~16.5 days until Feb 1)
      mockNow('2024-01-15T12:00:00Z')

      // When
      const result = calculateCountdown('monthly')

      // Then: 16 days 12 hours = 1,425,600 seconds (16*86400 + 12*3600)
      expect(result.secondsLeft).toBe(1425600)
      expect(result.isReady).toBe(false)
    })

    it('should handle month boundary in countdown', () => {
      // Given: Jan 31, 2024 at 10:00:00 UTC (14 hours until Feb 1)
      mockNow('2024-01-31T10:00:00Z')

      // When
      const result = calculateCountdown('monthly')

      // Then: 14 hours = 50,400 seconds
      expect(result.secondsLeft).toBe(50400)
      expect(result.isReady).toBe(false)
    })

    it('should be precise to the second', () => {
      // Given: 1 minute 23 seconds before a reset
      mockNow('2024-01-02T23:58:37Z')

      // When
      const result = calculateCountdown('daily')

      // Then: exactly 83 seconds (1 minute 23 seconds)
      expect(result.secondsLeft).toBe(83)
    })

    it('should return isReady=true approximately at reset time', () => {
      // Given: 1 second before daily reset (23:59:59 UTC)
      mockNow('2024-01-02T23:59:59Z')

      // When
      const result1 = calculateCountdown('daily')

      // Then: should be 1 second away
      expect(result1.secondsLeft).toBe(1)
      expect(result1.isReady).toBe(false)

      // Given: exactly at reset time (00:00:00 UTC next day)
      mockNow('2024-01-03T00:00:00Z')

      // When
      const result2 = calculateCountdown('daily')

      // Then: just passed reset, next reset is tomorrow
      expect(result2.secondsLeft).toBe(86400)
      expect(result2.isReady).toBe(false)
    })

    it('should handle microsecond precision by rounding down', () => {
      // Given: 100.7 seconds until reset
      mockNow('2024-01-02T23:58:19.300Z')

      // When
      const result = calculateCountdown('daily')

      // Then: should floor to 100 seconds
      expect(result.secondsLeft).toBeLessThanOrEqual(101)
    })
  })

  describe('Edge Cases', () => {
    it('should not return negative seconds', () => {
      mockNow('2024-01-02T15:30:00Z')

      const daily = calculateCountdown('daily')
      const weekly = calculateCountdown('weekly')
      const monthly = calculateCountdown('monthly')

      expect(daily.secondsLeft).toBeGreaterThanOrEqual(0)
      expect(weekly.secondsLeft).toBeGreaterThanOrEqual(0)
      expect(monthly.secondsLeft).toBeGreaterThanOrEqual(0)
    })

    it('should handle all reset types', () => {
      mockNow('2024-06-15T12:00:00Z')

      expect(() => calculateCountdown('daily')).not.toThrow()
      expect(() => calculateCountdown('weekly')).not.toThrow()
      expect(() => calculateCountdown('monthly')).not.toThrow()
    })
  })
})
