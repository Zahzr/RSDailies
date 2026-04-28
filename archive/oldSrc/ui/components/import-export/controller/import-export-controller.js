import {
  cloneInteractiveElement,
  copyTextToClipboard,
  getImportExportElements,
  hasImportExportElements,
  readImportToken
} from '../logic/import-export.logic.js';

export function setupImportExport({
  documentRef = document,
  navigatorRef = navigator,
  onImport = () => window.location.reload()
} = {}) {
  const elements = getImportExportElements(documentRef);
  if (!hasImportExportElements(elements)) return;

  const copyReplacement = cloneInteractiveElement(elements.tokenCopy);
  const importReplacement = cloneInteractiveElement(elements.tokenImport);

  copyReplacement.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await copyTextToClipboard(elements.tokenOutput.value || '', elements.tokenOutput, documentRef, navigatorRef);
  });

  importReplacement.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    elements.tokenInput.classList.remove('is-invalid');
    const value = readImportToken(elements.tokenInput);

    if (!value) {
      elements.tokenInput.classList.add('is-invalid');
      return;
    }

    onImport(value);
  });
}
