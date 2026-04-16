export function createScheduler() {
  const intervals = new Set();
  const timeouts = new Set();

  function every(callback, delay) {
    const id = window.setInterval(callback, delay);
    intervals.add(id);
    return id;
  }

  function after(callback, delay) {
    const id = window.setTimeout(() => {
      timeouts.delete(id);
      callback();
    }, delay);

    timeouts.add(id);
    return id;
  }

  function cancelInterval(id) {
    window.clearInterval(id);
    intervals.delete(id);
  }

  function cancelTimeout(id) {
    window.clearTimeout(id);
    timeouts.delete(id);
  }

  function stop() {
    for (const id of intervals) {
      window.clearInterval(id);
    }

    for (const id of timeouts) {
      window.clearTimeout(id);
    }

    intervals.clear();
    timeouts.clear();
  }

  return {
    every,
    after,
    cancelInterval,
    cancelTimeout,
    stop,
  };
}