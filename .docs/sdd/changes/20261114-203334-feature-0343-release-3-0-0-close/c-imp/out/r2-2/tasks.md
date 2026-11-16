# Tasks — 0012 Informe de canceladas

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Comando `informe` | hecha | c91e1c8 |

## Rulings

Revisión final: self-review sin subagentes (Spec, Código; Arquitectura no sale), sin Critical ni Important, 2 minors diferidos, sobre c91e1c8

- Setup: Ruling: trabajo en el checkout de la rama feature/0012-cancelled-report, sin worktree nuevo — la rama ya aísla de main y no hay preferencia declarada — coste si falla: ninguno, baseline corrió en worktree desacoplado (4/4 verde).
- Task 1: Ruling: exporto `bookings` desde src/app.js — la decisión 2 de la spec («sin canceladas») solo se prueba vaciando el almacén y el plan ya lo declara como interfaz consumida — coste si falla: una exportación de más en un módulo de la app.
- Task 1: Ruling: la línea de sala sale literal `<Sala>: <n> canceladas` también con n=1 («Sur: 1 canceladas») — la spec fija ese formato y no pide singular — coste si falla: texto con concordancia pobre, se corrige con una enmienda a la spec.
- Final: Ruling: sin herramienta de subagentes — Final review: self-review (no subagent tool) — pasadas Spec, Código y Arquitectura hechas por el autor sobre c91e1c8 — coste si falla: puntos ciegos del autor; el dev-lead decide si basta antes de fusionar.
- Final: minor (deferred): `cancelledReport` se exporta aunque solo la usa `run` — coherente con el resto de funciones del módulo, sin consumidor externo.
- Final: minor (deferred): un día fuera de lun–vie ordenaría primero (`indexOf` = -1) — hoy los datos solo traen lun–vie.
