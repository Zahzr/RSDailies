import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const mustExist = [
  'src/ui/app-shell/html/index.html',
  'src/ui/app-shell/runtime/layout-loader.js',
  'src/ui/app-shell/runtime/render-app-shell.js',
  'src/ui/app-shell/runtime/section-panel.js',
  'src/ui/app-shell/styles/index.css',
  'src/ui/components/headers/header.render.js',
  'src/ui/components/tracker/rows/row.render.js',
  'src/ui/components/tracker/rows/columns/column.render.js',
  'src/ui/components/tracker/parents/parent.render.js',
  'src/ui/components/tracker/subparents/subparent.render.js',
  'src/ui/components/tracker/sections/index.js',
  'src/ui/components/tracker/sections/controls/section-controls-bindings.js',
  'src/ui/components/tracker/sections/renderers/common.js',
  'src/ui/components/tracker/sections/renderers/farming.js',
  'src/ui/components/tracker/sections/renderers/standard.js',
  'src/ui/components/tracker/sections/renderers/storage.js',
  'src/ui/components/tracker/tables/utils/table.utils.js',
  'src/ui/components/tracker/tables/styles/table.css',
  'src/ui/components/tracker/farming/styles/farming.css',
  'src/ui/components/tracker/rows/templates/row-sample.html',
  'src/ui/components/custom-tasks/modal/custom-task-controller.js',
  'src/ui/components/import-export/index.js',
  'src/ui/components/import-export/controller/import-export-controller.js',
  'src/ui/components/import-export/logic/import-export.logic.js',
  'src/ui/components/profiles/profile-view.js',
  'src/ui/components/settings/settings-menu.js',
  'src/ui/components/views/view-panel.js',
  'src/ui/components/views/views-menu.js',
  'src/features/sections/domain/state.js',
  'src/features/farming/domain/timer-math.js',
  'src/app/boot/bootstrap.js'
];
for (const rel of mustExist) {
  if (!fs.existsSync(path.join(root, rel))) failures.push('Missing required file: ' + rel);
}
const forbidden = [
  'src/ui/features/tables/ui/headers',
  'src/ui/features/tables',
  'src/ui/features/tables/ui/rows',
  'src/ui/components/tracker/parent',
  'src/ui/components/tracker/sub-parent',
  'src/app/shell',
  'src/features/tables/ui',
  'src/features/tables/styles',
  'src/features/custom-tasks',
  'src/ui/features/custom-tasks',
  'src/features/import-export',
  'src/ui/features/import-export',
  'src/features/overview',
  'src/ui/features/overview',
  'src/ui/features/sections/ui',
  'src/ui/features/farming',
  'src/ui/features/profiles',
  'src/ui/features/views',
  'src/ui/features',
  'src/features/profiles/ui',
  'src/features/settings/ui',
  'src/features/views/ui',
  'src/features/sections/ui',
  'src/ui/app-shell/runtime/overview-panel.js',
  'src/features/views/ui',
  'src/app/runtime/legacy',
  'src/features/profiles/controller.js',
  'src/features/profiles/model.js',
  'src/features/profiles/store.js',
  'src/features/profiles/view.js',
  'src/features/profiles/index.js',
  'src/features/sections/state.js',
  'src/features/sections/logic.js',
  'src/features/sections/index.js',
  'src/features/settings/state.js',
  'src/features/settings/controller.js',
  'src/features/settings/index.js',
  'src/features/views/model.js',
  'src/features/views/controller.js',
  'src/features/views/view.js',
  'src/features/views/index.js',
  'src/features/views/index',
  'src/app/runtime/legacy-app.js',
  'src/ui/app-shell/html/dashboard.html',
  'src/ui/components/custom-tasks/modal/custom-task-modal.js',
  'src/features/tasks/index.js'
];
for (const rel of forbidden) {
  if (fs.existsSync(path.join(root, rel))) failures.push('Forbidden removed or misplaced path remains: ' + rel);
}
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const next = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(next, out);
    else out.push(next);
  }
  return out;
}
for (const file of walk(path.join(root, 'src'))) {
  if (!/\.(js|html|css|md)$/.test(file)) continue;
  const rel = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8');
  if (text.includes('src/app/shell')) failures.push('Stale app shell reference: ' + rel);
  if (/from ['"].*src\/app\/shell/.test(text)) failures.push('Stale shell import: ' + rel);
  if (text.includes('ui/features/tables/ui/rows')) failures.push('Stale rows compatibility reference: ' + rel);
  if (text.includes('ui/features/import-export') || text.includes('features/import-export')) failures.push('Stale import/export reference: ' + rel);
  if (text.includes('ui/features/sections/ui') || text.includes('features/sections/ui')) failures.push('Stale section UI reference: ' + rel);
  if (text.includes('ui/features/farming') || text.includes('features/farming/styles')) failures.push('Stale farming UI style reference: ' + rel);
  if (text.includes('ui/features/profiles') || text.includes('features/profiles/ui')) failures.push('Stale profile UI reference: ' + rel);
  if (text.includes('ui/features/views') || text.includes('features/views/ui')) failures.push('Stale views UI reference: ' + rel);
  if (/\blegacy\b/i.test(text)) failures.push('Legacy wording remains in active source: ' + rel);
  if (/\bshim\b/i.test(text)) failures.push('Shim wording remains in active source: ' + rel);
  if (/\bcompatibility\b/i.test(text) || /\bcompatible\b/i.test(text)) failures.push('Compatibility wording remains in active source: ' + rel);
  if (text.includes('ParentHandler') || text.includes('SubParentHandler') || text.includes('SubParentLogic')) failures.push('Stale handler naming remains: ' + rel);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Topology audit passed. Canonical UI tracker rows, columns, headers, parents, subparents, custom tasks, and import/export are present with removed paths forbidden.');
