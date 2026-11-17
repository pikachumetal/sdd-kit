#!/usr/bin/env node
// Statusline para Claude Code: lee el JSON de sesión por stdin y pinta una línea.
const { readFileSync } = require('node:fs');
const { formatModel, formatCost } = require('./lib/format');
const { gitBranch } = require('./lib/git');

function main() {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const parts = [
    formatModel(input.model),
    gitBranch(input.workspace?.current_dir),
    formatCost(input.cost?.total_cost_usd),
  ].filter(Boolean);
  process.stdout.write(parts.join(' | '));
}

main();
