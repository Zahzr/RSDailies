export function normalizeQuantity(qty) { const number = Number(qty); return Number.isFinite(number) ? number : 0; }
export function calculateGoldValue(unitPrice, qty = 1) { const price = Number(unitPrice); if (!Number.isFinite(price)) return 0; return Math.round(price * normalizeQuantity(qty)); }
export function formatGold(value) { const number = Number(value); if (!Number.isFinite(number)) return '0 gp'; return `${Math.round(number).toLocaleString()} gp`; }
