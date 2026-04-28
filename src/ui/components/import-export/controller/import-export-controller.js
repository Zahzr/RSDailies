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
  buildExportToken = () => '',
  importProfileToken = () => {},
  onImport = () => window.location.reload(),
  storage = window.localStorage,
} = {}) {
  const elements = getImportExportElements(documentRef);
  if (!hasImportExportElements(elements)) return;

  const buttonReplacement = cloneInteractiveElement(elements.tokenButton);
  const copyReplacement = cloneInteractiveElement(elements.tokenCopy);
  const importReplacement = cloneInteractiveElement(elements.tokenImport);

  buttonReplacement.addEventListener('click', () => {
    elements.tokenOutput.value = buildExportToken(storage);
    elements.tokenInput.classList.remove('is-invalid');
  });

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

    importProfileToken(value, storage);
    onImport(value);
  });
}
