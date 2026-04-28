export function closeRestoreMenu(menu, trigger) {
  if (!menu || !trigger) return;
  menu.style.display = 'none';
  trigger.setAttribute('aria-expanded', 'false');
}

export function openRestoreMenu(menu, trigger) {
  if (!menu || !trigger) return;
  menu.style.display = 'flex';
  trigger.setAttribute('aria-expanded', 'true');
}
