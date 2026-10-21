import { readFileSync } from 'node:fs';

const { port } = JSON.parse(readFileSync(new URL('../e2e/config.json', import.meta.url)));
await fetch(`http://localhost:${port}/shutdown`).then(() => console.log('entorno parado'), () => console.log('no había entorno'));
