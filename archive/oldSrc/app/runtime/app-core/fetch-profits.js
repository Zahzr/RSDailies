export async function fetchProfits(documentRef = document) {
  const nodes = [...documentRef.querySelectorAll('.item_profit[data-item][data-qty]')];
  if (!nodes.length) return;
  const items = [...new Set(nodes.map((node) => node.dataset.item).filter(Boolean))];
  if (!items.length) return;

  try {
    const response = await fetch(`https://runescape.wiki/api.php?action=ask&query=[[Exchange:${items.join('||Exchange:')}]]|?Exchange:Price&format=json&origin=*`);
    const json = await response.json();
    const results = json?.query?.results || {};
    nodes.forEach((node) => {
      const item = node.dataset.item;
      const qty = parseInt(node.dataset.qty || '0', 10);
      const price = results[`Exchange:${item}`]?.printouts?.['Exchange:Price']?.[0]?.num;
      node.textContent = price ? ` ~${Math.round(price * qty).toLocaleString()} gp` : '';
    });
  } catch {
    nodes.forEach((node) => {
      node.textContent = '';
    });
  }
}
