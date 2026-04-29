export function resetCustomTaskForm({ nameInput, noteInput, wikiInput, resetSelect, alertInput, timerMinsInput, timerBlock }) {
  nameInput.value = '';
  noteInput.value = '';
  wikiInput.value = '';
  resetSelect.value = 'daily';
  alertInput.value = '0';
  timerMinsInput.value = '60';
  timerBlock.style.display = 'none';
  timerBlock.style.visibility = 'hidden';
  nameInput.classList.remove('is-invalid');
  wikiInput.classList.remove('is-invalid');
}

export function syncTimerVisibility(resetSelect, timerBlock, alertInput) {
  const isTimer = resetSelect.value === 'timer';
  timerBlock.style.display = isTimer ? '' : 'none';
  timerBlock.style.visibility = isTimer ? 'visible' : 'hidden';
  if (alertInput) {
    alertInput.disabled = isTimer;
    if (isTimer) alertInput.value = '0';
  }
}

export function readTaskForm({ nameInput, noteInput, wikiInput, resetSelect, alertInput, timerMinsInput }) {
  return {
    rawName: String(nameInput.value || '').trim(),
    rawNote: String(noteInput.value || '').trim(),
    rawWiki: String(wikiInput.value || '').trim(),
    rawReset: String(resetSelect.value || 'daily').trim().toLowerCase(),
    rawAlertDaysBeforeReset: String(alertInput.value || '0').trim(),
    rawTimerMinutes: String(timerMinsInput.value || '60').trim()
  };
}
