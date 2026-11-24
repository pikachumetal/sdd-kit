// Sujeto de la batería de sdd-validate: el de sdd-archive, con la tabla de escenarios de esta carpeta.
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.BATTERY_DIR = dirname(fileURLToPath(import.meta.url));
await import('../sdd-archive/subject.mjs');
