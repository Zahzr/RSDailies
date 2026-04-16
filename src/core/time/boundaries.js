export function nextDailyBoundary(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
}

export function nextWeeklyBoundary(now = new Date()) {
  const boundary = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const day = boundary.getUTCDay();
  let daysUntilWednesday = (3 - day + 7) % 7;

  if (daysUntilWednesday === 0) {
    daysUntilWednesday = 7;
  }

  boundary.setUTCDate(boundary.getUTCDate() + daysUntilWednesday);
  return boundary;
}

export function nextMonthlyBoundary(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));
}
