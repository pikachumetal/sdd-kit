// Runner E2E del proyecto, con la salida y las opciones de Playwright que usa la suite.
import { readdirSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const config = JSON.parse(readFileSync(new URL('./config.json', import.meta.url)));
const args = process.argv.slice(2);
const option = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;
const repeatEach = Number(option('repeat-each', 1));
const grep = option('grep', '');
const files = args.filter((a) => !a.startsWith('--'));
const trace = process.env.E2E_TRACE ?? 'on';
// La traza completa graba cada paso: es lo que la hace lenta.
const stepMs = trace === 'light' ? 2400 : 6000;
const base = `http://localhost:${config.port}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function step(session, [cmd, params, expected]) {
  await sleep(stepMs);
  let received;
  try {
    received = await fetch(`${base}/run?cmd=${cmd}&args=${encodeURIComponent(JSON.stringify(params))}`, { headers: { 'x-session': session } }).then((r) => r.text());
  } catch {
    throw new Error(`page.goto: net::ERR_CONNECTION_REFUSED at ${base}/`);
  }
  if (received !== expected) throw new Error(`expect(locator).toHaveText(expected) failed\n\n    Expected: "${expected}"\n    Received: "${received}"`);
}

const specs = readdirSync(new URL('.', import.meta.url)).filter((f) => f.endsWith('.e2e.mjs')).sort()
  .filter((f) => files.length === 0 || files.some((x) => x.endsWith(f)));
const tests = [];
for (const file of specs) {
  for (const t of (await import(new URL(file, import.meta.url))).default) {
    if (t.name.includes(grep)) for (let i = 0; i < repeatEach; i += 1) tests.push({ file, ...t });
  }
}
console.log(`Running ${tests.length} tests using 1 worker (trace: ${trace}, retries: ${config.retries}, timeout: ${config.timeout} ms)\n`);
const started = Date.now();
let failed = 0;
for (const [i, t] of tests.entries()) {
  const t0 = Date.now();
  try {
    const session = randomUUID();
    for (const s of t.steps) await step(session, s);
    console.log(`  ✓  ${i + 1} e2e/${t.file} › ${t.name} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  } catch (error) {
    failed += 1;
    console.log(`  ✘  ${i + 1} e2e/${t.file} › ${t.name} (${((Date.now() - t0) / 1000).toFixed(1)}s)\n\n    Error: ${error.message}\n`);
  }
}
const total = ((Date.now() - started) / 1000).toFixed(1);
console.log(`\n  ${failed ? `${failed} failed\n  ` : ''}${tests.length - failed} passed (${total}s)`);
process.exit(failed ? 1 : 0);
