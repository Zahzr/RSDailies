export function normalizeWikiUrl(url) { const value = String(url || '').trim(); if (!value) return ''; try { return new URL(value).toString(); } catch { return ''; } }
export function wikiTitleFromUrl(url) { const clean = normalizeWikiUrl(url); if (!clean) return ''; return decodeURIComponent(clean.split('/').pop() || '').replace(/_/g, ' '); }
