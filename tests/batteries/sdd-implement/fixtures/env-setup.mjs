import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('data', { recursive: true });
writeFileSync('data/bookings.json', '[]\n');
writeFileSync('.sdd-env.json', JSON.stringify({ ticket: process.env.TICKET ?? 'worktree', state: 'active', created: new Date().toISOString() }) + '\n');
console.log('entorno activo: data/ y .sdd-env.json');
