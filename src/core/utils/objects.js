export function mergeDefined(base, overrides) {
  return Object.fromEntries(
    Object.entries({ ...base, ...overrides }).filter(([, value]) => value !== undefined)
  );
}
