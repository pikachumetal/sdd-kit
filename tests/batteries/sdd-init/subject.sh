#!/usr/bin/env bash
# Sujeto de la batería de sdd-init: un repo en el punto de la init que mide el escenario.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
MOLD="$(cell Molde)"
# Un kit sin sdd-init (el RED) usa la init vieja que toca y el molde en la forma 2.x que esa lee.
if [ -d "$1/skills/sdd-init" ]; then SKILL=sdd-init; else
  case "$MOLD" in blank|template) SKILL=sdd-init-greenfield ;; *) SKILL=sdd-init-brownfield ;; esac
fi
subject_init "$1" "$2" "$4" "$SKILL"
ASK="$(cell Petición)"; ASK="${ASK//sdd-kit:sdd-init/sdd-kit:$SKILL}"

doc() { printf -- '# %s — Reservas\n\n%b\n' "$1" "$2" | put "$3"; }
mold_blank() { printf '# Reservas de salas\n' | put README.md; }
mold_code() {
  mold_blank
  printf '{\n  "name": "reservas",\n  "scripts": { "dev": "vite", "test": "vitest run", "e2e": "playwright test" },\n  "devDependencies": { "vite": "^7.0.0", "vitest": "^4.0.0", "@playwright/test": "^1.55.0" }\n}\n' | put package.json
  printf "export function reserve(room: string, slot: string): string {\n  return \`reservada \${room} \${slot}\`;\n}\n" | put src/app.ts
  printf 'name: ci\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test\n' | put .github/workflows/ci.yml
  printf '# Reservas\n\n- Usa `npm run dev` en el puerto 3000.\n- Las fechas van en UTC.\n' | put CLAUDE.md
}
approved_new() {
  local list="$1"
  printf '{"init": {"approved": [%s], "config": {"ids": {"mode": "sequence"}, "control": {"profile": "delegate", "maxParallelAgents": 3, "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}}, "execution": "auto", "validation": {"mode": "manual"}}}}\n' "$list" | put .docs/sdd/sdd-kit.json
}
progress_new() {
  doc Product '## Users\n\nEl equipo de oficina reserva salas.\n\n## Product Purpose\n\nReservar salas por franja.' PRODUCT.md
  doc Constitution '## Reglas de producto\n\n- **Dónde viven los datos**: en memoria.' .docs/sdd/steering/constitution.md
}
progress_old() {
  doc Mission 'El equipo de oficina reserva salas por franja.' .docs/sdd/mission.md
  doc Constitution '## Reglas de producto\n\n- **Dónde viven los datos**: en memoria.' .docs/sdd/constitution.md
}
claude_new() {
  progress_new
  doc Operations '## Comandos\n\n- **Arrancar**: `npm run dev` (puerto 3000)\n\n## Testing\n\n- **Gate de cierre**: `npm test`' .docs/sdd/steering/operations.md
  doc Architecture 'Una SPA con Vite.' .docs/sdd/steering/architecture.md
  printf '# Roadmap — Reservas\n\n## Now\n\n## Next\n\n## Later\n' | put ROADMAP.md
  doc Debt '## Por triar' .docs/sdd/steering/debt.md
  doc Estimation 'Método: horas.' .docs/sdd/steering/estimation.md
  approved_new '"PRODUCT.md", ".docs/sdd/steering/constitution.md", ".docs/sdd/steering/operations.md", ".docs/sdd/steering/architecture.md", "ROADMAP.md", ".docs/sdd/steering/debt.md", ".docs/sdd/steering/estimation.md"'
}
claude_old() {
  progress_old
  doc 'Tech stack' '- **Arrancar**: `npm run dev` (puerto 3000)\n- **Tests**: `npm test`' .docs/sdd/tech-stack.md
  doc Architecture 'Una SPA con Vite.' .docs/sdd/architecture.md
  printf '# Roadmap — Reservas\n\n## Próximo\n' | put .docs/sdd/roadmap.md
}
mold_template() {
  printf '{\n  "name": "nuevo-proyecto",\n  "scripts": { "dev": "ng serve", "test": "ng test" }\n}\n' | put package.json
  printf 'export function login(user: string): boolean {\n  return user.length > 0;\n}\n' | put src/login.ts
  doc Mission '<!-- sdd-template: pending -->' .docs/sdd/mission.md
  printf '# Roadmap\n\n<!-- sdd-template: pending -->\n' | put .docs/sdd/roadmap.md
  doc Constitution '## Convenciones\n\n- Commits convencionales.\n\n## Reglas de producto\n\n<!-- sdd-template: pending -->' .docs/sdd/constitution.md
  doc 'Tech stack' '- Angular 20 y .NET 10.\n- **Tests**: `ng test`' .docs/sdd/tech-stack.md
  doc Architecture 'Frontend Angular, backend .NET, login con cookie.' .docs/sdd/architecture.md
  doc Environments '- **Runner**: `pnpm env:setup`' .docs/sdd/environments.md
  printf '{"version": "1.1.0", "channel": "plugin", "updated": "2026-09-01"}\n' | put .docs/sdd/sdd-kit.json
}

case "$MOLD" in
  blank) mold_blank ;;
  code) mold_code ;;
  code-progress) mold_code; if [ "$SKILL" = sdd-init ]; then progress_new; approved_new '"PRODUCT.md", ".docs/sdd/steering/constitution.md"'; else progress_old; fi ;;
  code-claude) mold_code; if [ "$SKILL" = sdd-init ]; then claude_new; else claude_old; fi ;;
  template) mold_template ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
g init -q -b main; commit "feat: base del molde"

MAX_TURNS="${MAX_TURNS:-30}" subject_launch "$ASK"
for kept in CLAUDE.md PRODUCT.md .docs/sdd/sdd-kit.json .docs/sdd/steering/operations.md .docs/sdd/tech-stack.md .docs/sdd/mission.md; do
  [ -f "$R/$kept" ] && subject_keep "$R/$kept" "$(basename "$kept")"
done
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## diff"; g diff --stat; } | subject_save
