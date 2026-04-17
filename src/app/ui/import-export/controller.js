/**
 * Import/Export controller for profile data tokens
 */
export function setupImportExport(deps) {
  const {
    buildExportTokenFeature,
    importProfileToken: importProfileTokenFeature,
    localStorageRef = localStorage,
    locationRef = location,
    documentRef = document
  } = deps;

  const tokenButton = documentRef.getElementById('token-button');
  const tokenOutput = documentRef.getElementById('token-output');
  const tokenInput = documentRef.getElementById('token-input');
  const tokenCopy = documentRef.getElementById('token-copy');
  const tokenImport = documentRef.getElementById('token-import');

  function buildExportToken() {
    return buildExportTokenFeature(localStorageRef);
  }

  function importToken(rawToken) {
    try {
      importProfileTokenFeature(rawToken, localStorageRef);
      locationRef.reload();
    } catch {
      if (tokenInput) tokenInput.classList.add('is-invalid');
    }
  }

  tokenButton?.addEventListener('click', () => {
    if (tokenOutput) {
      tokenOutput.value = buildExportToken();
    }
    if (tokenInput) {
      tokenInput.classList.remove('is-invalid');
    }
  });

  tokenCopy?.addEventListener('click', async () => {
    if (!tokenOutput) return;
    const text = tokenOutput.value;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      tokenOutput.focus();
      tokenOutput.select();
      documentRef.execCommand('copy');
    }
  });

  tokenImport?.addEventListener('click', () => {
    if (tokenInput) {
      tokenInput.classList.remove('is-invalid');
      importToken(tokenInput.value.trim());
    }
  });
}
