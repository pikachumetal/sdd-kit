import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const { port } = JSON.parse(readFileSync(new URL('../e2e/config.json', import.meta.url)));
const base = `http://localhost:${port}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const healthy = () => fetch(`${base}/health`).then((r) => r.ok, () => false);

await fetch(`${base}/shutdown`).catch(() => {});
await sleep(500);
const server = spawn(process.execPath, [fileURLToPath(new URL('../server.mjs', import.meta.url))], { detached: true, stdio: 'ignore' });
server.unref();
for (let i = 0; i < 20; i += 1) {
  if (await healthy()) { console.log(`entorno arriba: ${base} (pid ${server.pid})`); process.exit(0); }
  await sleep(250);
}
console.error(`el entorno no responde en ${base}/health`);
process.exit(1);
