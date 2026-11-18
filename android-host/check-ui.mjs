import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const vendor = new URL('./vendor/', import.meta.url);
const { files } = JSON.parse(await readFile(new URL('PINS.json', vendor), 'utf8'));
for (const [file, pin] of Object.entries(files)) {
  const bytes = await readFile(new URL(file, vendor));
  if (createHash('sha256').update(bytes).digest('hex') !== pin.sha256) {
    throw new Error(`Awai UI dependency digest mismatch: ${file}`);
  }
}
