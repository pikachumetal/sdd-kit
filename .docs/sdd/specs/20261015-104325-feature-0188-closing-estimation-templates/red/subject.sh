#!/usr/bin/env bash
# Sujeto headless de la feature 0188 (estimación post hoc y esfuerzo real medido).
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   p1  cierre del patch 0042, cuyo commit del fix trae patch.md sin «- Estimación:» en §5.
#       Se mide si la estimación que escribe el cierre lleva «(post hoc)» y de dónde saca el tiempo real.
#   f1  paso 2 de sdd-end-feature (tiempo real) en el walkthrough de la feature 0043.
#       Se mide qué escribe en «Esfuerzo real» y si pega las líneas de sdd session tokens.
# La green/ reutiliza este script.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
case "$3" in
  p1) SKILL=sdd-end-patch ;;
  f1) SKILL=sdd-end-feature ;;
  *)  echo "escenario desconocido: $3" >&2; exit 1 ;;
esac
subject_init "$1" "$2" "$4" "$SKILL"

at() { export GIT_AUTHOR_DATE="$1" GIT_COMMITTER_DATE="$1"; }

put package.json <<'EOF'
{ "name": "facturas", "private": true, "type": "module", "scripts": { "test": "node --test" } }
EOF
put src/total.js <<'EOF'
export function invoiceTotal(lines) {
  return lines.reduce((sum, line) => sum + line.units * line.price, 0);
}
EOF
put test/total.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { invoiceTotal } from '../src/total.js';

test('suma unidades por precio', () => {
  assert.equal(invoiceTotal([{ units: 2, price: 3 }, { units: 1, price: 4 }]), 10);
});
EOF
put .docs/sdd/constitution.md <<'EOF'
# Constitution — facturas

## Art. I — Pruebas
Todo cambio de código lleva su test con `node --test`.

## Art. II — Git
git-flow: `main` estable, `develop` de integración, `feature/<id>` desde `develop`. Commits en castellano.
EOF
put .docs/sdd/mission.md <<'EOF'
# Mission — facturas

Calcula el total de las facturas de una tienda pequeña.
EOF
put .docs/sdd/tech-stack.md <<'EOF'
# Tech Stack — facturas

Node 22, sin dependencias.

## Testing

- **Gate de cierre**: `npm test`
EOF
put .docs/sdd/estimation.md <<'EOF'
# Método de estimación — facturas

## Método

- El `plan.md` de cada feature estima la implementación en horas, con base y confianza (alta · media · baja).
- El `walkthrough.md` registra el tiempo real. Si la desviación supera el ±30 %, la causa es obligatoria. Un tiempo desconocido se aproxima y se marca como aproximado; nunca se deja en blanco.
- Los patches estiman en la pregunta de su carril y escriben la estimación y la hora de inicio antes del fix; al cerrar, el tiempo real.
- `estimation-log.md` se genera, no se escribe.

## Notas de calibración de este proyecto

_Sin notas todavía._
EOF
put .docs/sdd/changelog.md <<'EOF'
# Changelog

## [Unreleased]

## [0.1.0] - 2026-10-01

### Added

- Total de una factura.
EOF
put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — facturas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0043 | Descuento por volumen en el total | 🔄 |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar la factura a PDF | cliente |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| El total no redondea a céntimos | medio | **Actuar**: patch 0042 |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

### v0.1.0 — 2026-10-01

Primera versión: total de una factura.
EOF
put_kit_marker '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "validation": {"mode": "field"}'

g init -q -b main
at 2026-10-01T09:00:00Z; commit "feat: total de una factura"
g checkout -q -b develop

if [ "$3" = p1 ]; then
  g checkout -q -b feature/0042
  put src/total.js <<'EOF'
export function invoiceTotal(lines) {
  const total = lines.reduce((sum, line) => sum + line.units * line.price, 0);
  return Math.round(total * 100) / 100;
}
EOF
  put test/round.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { invoiceTotal } from '../src/total.js';

test('redondea el total a céntimos', () => {
  assert.equal(invoiceTotal([{ units: 3, price: 0.1 }]), 0.3);
});
EOF
  put .docs/sdd/specs/20261014-090000-patch-0042-round-total/patch.md <<'EOF'
---
id: 20261014-090000-patch-0042-round-total
task: 0042
title: Patch — el total no redondea a céntimos
type: patch
solution: causa raíz
status: done
created: 2026-10-14
branch: feature/0042
commit: <hash>
---

# Patch 0042 — el total no redondea a céntimos

## Capacidades

- Ninguna, porque ninguna capacidad describe `invoiceTotal`

## 1. Síntoma

Una factura de 3 líneas a 0,10 € enseña `0.30000000000000004`.

## 2. Causa raíz

`invoiceTotal` suma flotantes sin redondear (`src/total.js:2`); 3 × 0,1 en coma flotante no es 0,3.

## 3. Fix

- **Fichero(s)**: `src/total.js`, `test/round.test.js`
- **Cambio**: el total se redondea a céntimos con `Math.round(total * 100) / 100`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `invoiceTotal([{ units: 3, price: 0.1 }])` → 0.3 | ✅ `npm test` 2/2 |

## 5. Tiempo (ligero)

- Inicio: 2026-10-14T09:00Z
EOF
  at 2026-10-14T09:40:00Z; commit "fix(total): redondear el total a céntimos (patch 0042)"
  ASK="Invoca la skill sdd-kit:sdd-end-patch y cierra el patch 0042. No fusiones ni empujes: el merge lo hago yo."
else
  g checkout -q -b feature/0043
  D=.docs/sdd/specs/20261014-100000-feature-0043-volume-discount
  put $D/spec.md <<'EOF'
---
id: 20261014-100000-feature-0043-volume-discount
feature: 0043
title: Descuento por volumen en el total
mode: full
status: approved
created: 2026-10-14
---

# Spec — Descuento por volumen

Un total de 1.000 € o más lleva un 5 % de descuento.
EOF
  put $D/plan.md <<'EOF'
---
id: 20261014-100000-feature-0043-volume-discount
feature: 0043
title: Plan de implementación — Descuento por volumen
status: approved
created: 2026-10-14
---

# Plan — Descuento por volumen

**Ejecución**: native, una task.

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 1h
- Base de la estimación: una task, una función
- Confianza: alta
EOF
  put $D/walkthrough.md <<'EOF'
---
id: 20261014-100000-feature-0043-volume-discount
feature: 0043
title: Walkthrough — Descuento por volumen
created: 2026-10-14
---

# Walkthrough — Descuento por volumen

## 1. Qué se hizo

- `invoiceTotal` aplica un 5 % de descuento desde 1.000 €.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 1h
- Esfuerzo real:
- Desviación:
- Tokens del hilo:
- Tokens de subagentes:
- Coste de la sesión:
- Coste de sujetos: no aplica
EOF
  at 2026-10-14T10:05:00Z; commit "docs(sdd): apertura de la feature 0043"
  put src/total.js <<'EOF'
export function invoiceTotal(lines) {
  const total = lines.reduce((sum, line) => sum + line.units * line.price, 0);
  return total >= 1000 ? total * 0.95 : total;
}
EOF
  at 2026-10-14T10:50:00Z; commit "feat(total): descuento por volumen (feature 0043)"
  ASK="Invoca la skill sdd-kit:sdd-end-feature y haz solo su paso 2 (tiempo real) en el walkthrough de la feature 0043. No hagas ningún otro paso del cierre ni commitees."
fi
unset GIT_AUTHOR_DATE GIT_COMMITTER_DATE
[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; exit 0; }

subject_launch "$ASK"
{ echo "## git log"; g log --oneline --all --decorate; echo "## git status"; g status --short --untracked-files=all; } | subject_save
if [ "$3" = p1 ]; then
  subject_keep "$R/.docs/sdd/specs/20261014-090000-patch-0042-round-total/patch.md" patch.md
else
  subject_keep "$R/.docs/sdd/specs/20261014-100000-feature-0043-volume-discount/walkthrough.md" walkthrough.md
fi
exit 0
