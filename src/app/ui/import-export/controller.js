export function setupImportExport({
  documentRef = document,
  onImport = () => window.location.reload()
} = {}) {
  const tokenModal = documentRef.getElementById('token-modal');
  const tokenOutput = documentRef.getElementById('token-output');
  const tokenInput = documentRef.getElementById('token-input');
  const tokenCopy = documentRef.getElementById('token-copy');
  const tokenImport = documentRef.getElementById('token-import');

  if (!tokenModal || !tokenOutput || !tokenInput || !tokenCopy || !tokenImport) {
    return;
  }

  const copyReplacement = tokenCopy.cloneNode(true);
  tokenCopy.replaceWith(copyReplacement);

  const importReplacement = tokenImport.cloneNode(true);
  tokenImport.replaceWith(importReplacement);

  copyReplacement.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const text = tokenOutput.value || '';

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      tokenOutput.focus();
      tokenOutput.select();
      documentRef.execCommand('copy');
    }
  });

  importReplacement.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    tokenInput.classList.remove('is-invalid');

    const value = String(tokenInput.value || '').trim();
    if (!value) {
      tokenInput.classList.add('is-invalid');
      return;
    }

    onImport(value);
  });
}