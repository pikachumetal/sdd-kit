// Candidatos a duplicado del histórico de reservas, por clase: una pareja es candidata si comparte al menos `--min-<clase>` campos.
// Uso: node scripts/candidatos.mjs [--min-sala <n>] [--min-motivo <n>] [--min-semanal <n>]   (por omisión, 2 en las tres)
const HISTOGRAMS = {
  sala: { 1: 120, 2: 40, 3: 12, 4: 5, 5: 2 },
  motivo: { 1: 400, 2: 300, 3: 200, 4: 130, 5: 90, 6: 58 },
  semanal: { 1: 30, 2: 50, 3: 20, 4: 8 },
};

const args = process.argv.slice(2);
const min = (kind) => {
  const at = args.indexOf(`--min-${kind}`);
  return at < 0 ? 2 : Number(args[at + 1]);
};

let total = 0;
for (const [kind, histogram] of Object.entries(HISTOGRAMS)) {
  const count = Object.entries(histogram).filter(([score]) => Number(score) >= min(kind)).reduce((sum, [, pairs]) => sum + pairs, 0);
  console.log(`${kind} (min ${min(kind)}): ${count}`);
  total += count;
}
console.log(`suma: ${total}`);
