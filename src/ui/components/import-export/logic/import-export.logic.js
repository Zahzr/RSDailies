import { IMPORT_EXPORT_ELEMENT_IDS } from '../constants/import-export.constants.js';

export function getImportExportElements(documentRef = document) {
  return {
    tokenButton: documentRef.getElementById(IMPORT_EXPORT_ELEMENT_IDS.button),
    tokenModal: documentRef.getElementById(IMPORT_EXPORT_ELEMENT_IDS.modal),
    tokenOutput: documentRef.getElementById(IMPORT_EXPORT_ELEMENT_IDS.output),
    tokenInput: documentRef.getElementById(IMPORT_EXPORT_ELEMENT_IDS.input),
    tokenCopy: documentRef.getElementById(IMPORT_EXPORT_ELEMENT_IDS.copy),
    tokenImport: documentRef.getElementById(IMPORT_EXPORT_ELEMENT_IDS.import)
  };
}

export function hasImportExportElements(elements) {
  return Boolean(elements.tokenButton && elements.tokenModal && elements.tokenOutput && elements.tokenInput && elements.tokenCopy && elements.tokenImport);
}

export async function copyTextToClipboard(text, fallbackTarget, documentRef = document, navigatorRef = navigator) {
  try {
    await navigatorRef.clipboard.writeText(text);
  } catch {
    fallbackTarget.focus();
    fallbackTarget.select();
    documentRef.execCommand('copy');
  }
}

export function readImportToken(input) {
  return String(input.value || '').trim();
}
