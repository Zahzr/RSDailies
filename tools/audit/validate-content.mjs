import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const contentRoot = path.join(root, 'src', 'content');
const validatorUrl = pathToFileURL(path.join(root, 'src', 'core', 'domain', 'content', 'validate-content.js')).href;
const { validateContentPageDefinition } = await import(validatorUrl);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const next = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(next, out);
    else out.push(next);
  }
  return out;
}

const pageFiles = walk(contentRoot).filter((file) => file.endsWith('.page.js'));
const failures = [];

for (const file of pageFiles) {
  const moduleUrl = pathToFileURL(file).href;
  const loaded = await import(moduleUrl);
  const page = loaded.default || Object.values(loaded).find((value) => value && typeof value === 'object');

  try {
    validateContentPageDefinition(page);
  } catch (error) {
    failures.push(`${path.relative(root, file)}: ${error.message}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Content audit passed for ${pageFiles.length} page definitions.`);
