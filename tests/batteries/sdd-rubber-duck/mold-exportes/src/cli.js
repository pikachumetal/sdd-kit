import { exportMonth } from './export/index.js';

const [command, ...args] = process.argv.slice(2);

if (command === 'exportar') {
  const month = args[args.indexOf('--mes') + 1];
  console.log(exportMonth(month));
}
