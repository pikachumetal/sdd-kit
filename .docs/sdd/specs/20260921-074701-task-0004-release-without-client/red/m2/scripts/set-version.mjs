import { readFileSync, writeFileSync } from 'node:fs';

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Uso: node scripts/set-version.mjs X.Y.Z');
  process.exit(1);
}
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
pkg.version = version;
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
const app = readFileSync('src/app.js', 'utf8').replace(/^\/\/ salas.*$/m, `// salas v${version}`);
writeFileSync('src/app.js', app);
console.log(`Versión ${version}`);
