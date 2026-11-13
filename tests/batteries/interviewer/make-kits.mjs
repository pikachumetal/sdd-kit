// Una copia de dist/ por núcleo, con solo skills/sdd-grilling/SKILL.md sustituido; --check compara cada copia con su núcleo.
// Uso: node make-kits.mjs <dist> <carpeta de núcleos> <destino> [--check]
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL = join('skills', 'sdd-grilling', 'SKILL.md');

export const coreNames = (coresDir) => readdirSync(coresDir).filter((f) => f.endsWith('.md') && f !== 'NOTICE.md').map((f) => f.slice(0, -'.md'.length));

const kitDir = (targetDir, core) => join(targetDir, `kit-${core}`);

export function makeKits(distDir, coresDir, targetDir) {
  if (!existsSync(join(distDir, SKILL))) throw new Error(`${distDir} no lleva ${SKILL}: ¿falta moon run kit:build?`);
  for (const core of coreNames(coresDir)) {
    rmSync(kitDir(targetDir, core), { recursive: true, force: true });
    cpSync(distDir, kitDir(targetDir, core), { recursive: true });
    writeFileSync(join(kitDir(targetDir, core), SKILL), readFileSync(join(coresDir, `${core}.md`)));
  }
}

export function mismatches(coresDir, targetDir) {
  return coreNames(coresDir).filter((core) => {
    const copy = join(kitDir(targetDir, core), SKILL);
    return !existsSync(copy) || !readFileSync(copy).equals(readFileSync(join(coresDir, `${core}.md`)));
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [distDir, coresDir, targetDir, flag] = process.argv.slice(2);
  if (!distDir || !coresDir || !targetDir) {
    console.error('uso: node make-kits.mjs <dist> <carpeta de núcleos> <destino> [--check]');
    process.exit(2);
  }
  if (flag !== '--check') makeKits(distDir, coresDir, targetDir);
  const bad = mismatches(coresDir, targetDir);
  console.log(bad.length === 0 ? `copias: ${coreNames(coresDir).join(', ')}` : `difieren de su núcleo: ${bad.join(', ')}`);
  process.exit(bad.length === 0 ? 0 : 1);
}
