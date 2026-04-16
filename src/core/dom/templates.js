export function cloneTemplate(templateId) {
  const template = document.getElementById(templateId);
  return template?.content?.firstElementChild?.cloneNode(true) ?? null;
}
