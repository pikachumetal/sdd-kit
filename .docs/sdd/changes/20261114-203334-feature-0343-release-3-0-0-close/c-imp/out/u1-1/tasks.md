---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | (commit de la task 1) | |
| 2 | Listado de canceladas | done | (este commit) | enmienda 2026-11-15: sin «quién canceló» |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 99396bf
Pasada de fix: 4af395d, 3 hallazgos RED→GREEN (por mutación; el test del listado, aislado)

Re-revisión: 99396bf..4af395d, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin roturas nuevas

## Rulings

Final: Ruling: sin Política de modelos en la spec; despacho Spec (opus+high) y Code (sonnet+high) en paralelo — por la tabla de sdd-verify — coste si me equivoco: revisión más cara de lo necesario para 13 líneas
Final: minor (deferred): canceladas sin canceladas imprime una línea vacía (spec callada; cambiar el texto cambia la salida observable)
Final: minor (deferred): cancelar --motivo X sin sala ni día toma --motivo como sala (fuera de la spec)
Final: minor (deferred): literales de estado 'active'/'cancelled'/'voided' repetidos (ya estaban antes de la rama)
Final: Ruling: Declined (Spec) anulaciones de la 0011 fuera de alcance — canceladas filtra status cancelled y no las lista; sigue en pie — coste si me equivoco: una anulación aparecería como cancelada
Final: Ruling: Declined (Spec) orden del listado con varias canceladas — hoy solo hay una reserva semilla y los datos son en memoria — coste si me equivoco: orden arbitrario cuando haya más reservas
Final: Ruling: Declined (Spec) --motivo antes de sala o día — la spec define solo cancelar <sala> <día> --motivo <motivo> — coste si me equivoco: error poco claro al invertir el orden
Final: Ruling: Declined (Code) arquitectura de app.js y el estado global del módulo — es del eje Arquitectura, que no sale — coste si me equivoco: acoplamiento entre tests ya mitigado con import aislado
Final: Ruling: no verificado de Spec (motivo de varias palabras por CLI, guion U+2014) — verificados yo: CLI imprime «cancelada Norte lun (cambio de planes)» y el byte es e2 80 94 — coste si me equivoco: ninguno, comprobado
Final: minor (deferred): invalidReason declarado a media altura del test y el texto repetido a mano en el test de arriba (re-revisión)
