/**
 * Timer Reset Logic
 * 
 * Calculates when daily, weekly, and monthly tasks reset in UTC.
 * 
 * Reset Schedule (all UTC):
 * - Daily: 00:00 every day
 * - Weekly: 00:00 Wednesday (day 3)
 * - Monthly: 00:00 on 1st of month
 */

export type ResetType = 'daily' | 'weekly' | 'monthly'

/**
 * Get the next reset time for a given reset type.
 * @param type - 'daily', 'weekly', or 'monthly'
 * @returns Date at 00:00 UTC of the next reset
 */
export function getNextReset(type: ResetType): Date {
  if (!['daily', 'weekly', 'monthly'].includes(type)) {
    throw new Error(`Invalid reset type: ${type}. Must be 'daily', 'weekly', or 'monthly'`)
  }

  const now = new Date()
 // Get today at 00:00 UTC
  const todayAtMidnight = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0, 0
  ))

  if (type === 'daily') {
    // Next daily reset is tomorrow at 00:00 UTC
    const tomorrow = new Date(todayAtMidnight.getTime() + 24 * 60 * 60 * 1000)
    return tomorrow
  }

  if (type === 'weekly') {
    // Wednesday = day 3 in Luxon/JS weekday scheme (Sunday=0, Monday=1, ..., Wednesday=3)
    // Calculate days until next Wednesday
    const todayDay = now.getUTCDay()
    const wednesdayDay = 3
    let daysUntilWednesday = (wednesdayDay - todayDay + 7) % 7

    // If today is Wednesday and we're past 00:00 UTC, next reset is next Wednesday
    if (daysUntilWednesday === 0) {
      daysUntilWednesday = 7
    }

    const nextWednesday = new Date(
      todayAtMidnight.getTime() + daysUntilWednesday * 24 * 60 * 60 * 1000
    )
    return nextWednesday
  }

  if (type === 'monthly') {
    // Next monthly reset is 1st of next month at 00:00 UTC
    const nextMonth = new Date(Date.UTC(
      now.getUTCMonth() === 11 ? now.getUTCFullYear() + 1 : now.getUTCFullYear(),
      now.getUTCMonth() === 11 ? 0 : now.getUTCMonth() + 1,
      1,
      0, 0, 0, 0
    ))
    return nextMonth
  }

  throw new Error(`Unhandled reset type: ${type}`)
}

/**
 * Countdown result for a task reset
 */
export interface CountdownResult {
  /** Seconds until next reset */
  secondsLeft: number
  /** True if reset time is now (secondsLeft <= 0) */
  isReady: boolean
}

/**
 * Calculate countdown until next reset.
 * @param resetType - 'daily', 'weekly', or 'monthly'
 * @returns Countdown object with secondsLeft and isReady boolean
 */
export function calculateCountdown(resetType: ResetType): CountdownResult {
  const now = Date.now()
  const nextReset = getNextReset(resetType)
  const secondsLeft = Math.floor((nextReset.getTime() - now) / 1000)

  return {
    secondsLeft: Math.max(0, secondsLeft),
    isReady: secondsLeft <= 0,
  }
}

/**
 * Get the previous reset time for a given reset type.
 * @param type - 'daily', 'weekly', or 'monthly'
 * @returns Date at 00:00 UTC of the previous reset
 */
export function getPreviousReset(type: ResetType): Date {
  const now = new Date();
  if (type === 'daily') {
    // Today at 00:00 UTC
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }
  if (type === 'weekly') {
    const todayDay = now.getUTCDay(); // Sunday = 0, Wednesday = 3
    const wednesdayDay = 3;
    const daysSinceWednesday = (todayDay - wednesdayDay + 7) % 7;
    const previousWednesday = new Date(now.getTime());
    previousWednesday.setUTCDate(now.getUTCDate() - daysSinceWednesday);
    return new Date(Date.UTC(previousWednesday.getUTCFullYear(), previousWednesday.getUTCMonth(), previousWednesday.getUTCDate()));
  }
  if (type === 'monthly') {
    // First day of the current month at 00:00 UTC
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  }
  throw new Error(`Unhandled reset type: ${type}`);
}

/**
 * Check if a task has been completed in the current period.
 * @param lastCompletedTime - Timestamp (ms) when task was last marked complete
 * @param resetType - When the task resets
 * @returns true if task is still marked complete in current period, false if period has reset
 */
export function isTaskStillCompleteThisPeriod(
  lastCompletedTime: number,
  resetType: ResetType
): boolean {
  const previousReset = getPreviousReset(resetType);
  // A task is "still complete" if it was completed after the most recent reset.
  return lastCompletedTime >= previousReset.getTime();
}
