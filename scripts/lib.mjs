// Shared loader: evaluates content/cv-data.js in a sandbox and returns window.CV.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const root = fileURLToPath(new URL('..', import.meta.url));

export function loadCV() {
  const sandbox = { window: {} };
  vm.runInNewContext(readFileSync(new URL('../content/cv-data.js', import.meta.url), 'utf8'), sandbox, { filename: 'content/cv-data.js' });
  if (!sandbox.window.CV) throw new Error('content/cv-data.js did not define window.CV');
  return sandbox.window.CV;
}
