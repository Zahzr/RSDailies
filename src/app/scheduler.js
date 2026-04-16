let started = false;

export function startAppScheduler() {
  if (started) {
    return;
  }

  started = true;
}
