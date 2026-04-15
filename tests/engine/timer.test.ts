/**
 * Timer Reset Logic Tests
 * 
 * Tests for calculating next reset times for daily, weekly, and monthly tasks.
 * All times are in UTC.
 * 
 * Reset Times:
 * - Daily: 00:00 UTC
 * - Weekly: Wednesday 00:00 UTC (day 3 in Luxon)
 * - Monthly: 1st of month 00:00 UTC
 */

import { getNextReset } from '@engine/timer'

describe('Timer Reset Logic', () => {
  // Mock Date.now() to freeze time for testing
  const mockNow = (isoString: string) => {
    jest.useFakeTimers()
    const mockDate = new Date(isoString)
    jest.setSystemTime(mockDate)
  }

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Daily Reset', () => {
    it('should return tomorrow 00:00 UTC if not yet reached today', () => {
      // Given: Tuesday Jan 2, 2024 at 15:30 UTC
      mockNow('2024-01-02T15:30:00Z')

      // When
      const reset = getNextReset('daily')

      // Then: should be Wednesday Jan 3, 2024 00:00 UTC
      expect(reset.toISOString()).toBe('2024-01-03T00:00:00.000Z')
    })

    it('should return tomorrow 00:00 UTC even if today 00:00 has passed', () => {
      // Given: Tuesday Jan 2, 2024 at 00:00:01 UTC (1 second after daily reset)
      mockNow('2024-01-02T00:00:01Z')

      // When
      const reset = getNextReset('daily')

      // Then: should be Wednesday Jan 3, 2024 00:00 UTC
      expect(reset.toISOString()).toBe('2024-01-03T00:00:00.000Z')
    })

    it('should handle month boundaries correctly', () => {
      // Given: Tuesday Jan 31, 2024 at 10:00 UTC
      mockNow('2024-01-31T10:00:00Z')

      // When
      const reset = getNextReset('daily')

      // Then: should be Thursday Feb 1, 2024 00:00 UTC (next day wraps to next month)
      expect(reset.toISOString()).toBe('2024-02-01T00:00:00.000Z')
    })

    it('should handle year boundaries correctly', () => {
      // Given: Tuesday Dec 31, 2024 at 10:00 UTC
      mockNow('2024-12-31T10:00:00Z')

      // When
      const reset = getNextReset('daily')

      // Then: should be Thursday Jan 1, 2025 00:00 UTC (next day wraps to next year)
      expect(reset.toISOString()).toBe('2025-01-01T00:00:00.000Z')
    })
  })

  describe('Weekly Reset', () => {
    it('should return next Wednesday 00:00 UTC if today is before Wednesday', () => {
      // Given: Tuesday Jan 2, 2024 at 15:30 UTC (day before weekly reset)
      mockNow('2024-01-02T15:30:00Z')

      // When
      const reset = getNextReset('weekly')

      // Then: should be Wednesday Jan 3, 2024 00:00 UTC (next day)
      expect(reset.toISOString()).toBe('2024-01-03T00:00:00.000Z')
    })

    it('should return next Wednesday if today is Wednesday after 00:00', () => {
      // Given: Wednesday Jan 3, 2024 at 00:00:01 UTC (1 second after weekly reset)
      mockNow('2024-01-03T00:00:01Z')

      // When
      const reset = getNextReset('weekly')

      // Then: should be Wednesday Jan 10, 2024 00:00 UTC (next week)
      expect(reset.toISOString()).toBe('2024-01-10T00:00:00.000Z')
    })

    it('should return Wednesday if today is Thursday-Tuesday', () => {
      // Given: Thursday Jan 4, 2024 at 10:00 UTC
      mockNow('2024-01-04T10:00:00Z')

      // When
      const reset = getNextReset('weekly')

      // Then: should be Wednesday Jan 10, 2024 00:00 UTC (6 days later)
      expect(reset.toISOString()).toBe('2024-01-10T00:00:00.000Z')
    })

    it('should handle month/year boundaries for weekly resets', () => {
      // Given: Thursday Jan 31, 2024 at 10:00 UTC (near end of month)
      mockNow('2024-01-31T10:00:00Z')

      // When
      const reset = getNextReset('weekly')

      // Then: should be Wednesday Feb 7, 2024 00:00 UTC (wraps to next month)
      expect(reset.toISOString()).toBe('2024-02-07T00:00:00.000Z')
    })

    it('should handle year boundary for weekly reset', () => {
      // Given: Thursday Dec 28, 2024 at 10:00 UTC (week with year boundary)
      mockNow('2024-12-28T10:00:00Z')

      // When
      const reset = getNextReset('weekly')

      // Then: should be Wednesday Jan 1, 2025 00:00 UTC (wraps to next year)
      expect(reset.toISOString()).toBe('2025-01-01T00:00:00.000Z')
    })
  })

  describe('Monthly Reset', () => {
    it('should return 1st of next month 00:00 UTC if today is after 1st', () => {
      // Given: Tuesday Jan 15, 2024 at 10:30 UTC
      mockNow('2024-01-15T10:30:00Z')

      // When
      const reset = getNextReset('monthly')

      // Then: should be Friday Feb 1, 2024 00:00 UTC
      expect(reset.toISOString()).toBe('2024-02-01T00:00:00.000Z')
    })

    it('should return 1st of next month if today is 1st after 00:00', () => {
      // Given: Wednesday Jan 1, 2024 at 00:00:01 UTC (1 second after monthly reset)
      mockNow('2024-01-01T00:00:01Z')

      // When
      const reset = getNextReset('monthly')

      // Then: should be Sunday Feb 1, 2024 00:00 UTC
      expect(reset.toISOString()).toBe('2024-02-01T00:00:00.000Z')
    })

    it('should handle December monthly reset (year boundary)', () => {
      // Given: Tuesday Dec 15, 2024 at 10:00 UTC
      mockNow('2024-12-15T10:00:00Z')

      // When
      const reset = getNextReset('monthly')

      // Then: should be Thursday Jan 1, 2025 00:00 UTC (wraps to next year)
      expect(reset.toISOString()).toBe('2025-01-01T00:00:00.000Z')
    })

    it('should handle leap year February', () => {
      // Given: Saturday Feb 3, 2024 at 10:00 UTC (leap year)
      mockNow('2024-02-03T10:00:00Z')

      // When
      const reset = getNextReset('monthly')

      // Then: should be Sunday Mar 1, 2024 00:00 UTC
      expect(reset.toISOString()).toBe('2024-03-01T00:00:00.000Z')
    })
  })

  describe('Edge Cases', () => {
    it('should handle invalid reset type', () => {
      mockNow('2024-01-02T15:30:00Z')
      expect(() => getNextReset('invalid' as any)).toThrow()
    })

    it('should always return a future date (never the current time if already past)', () => {
      // Given: any current time
      mockNow('2024-06-15T12:00:00Z')

      // When: get next reset times
      const daily = getNextReset('daily')
      const weekly = getNextReset('weekly')
      const monthly = getNextReset('monthly')

      // Then: all should be strictly in the future
      const now = new Date('2024-06-15T12:00:00Z')
      expect(daily.getTime()).toBeGreaterThan(now.getTime())
      expect(weekly.getTime()).toBeGreaterThan(now.getTime())
      expect(monthly.getTime()).toBeGreaterThan(now.getTime())
    })
  })
})
