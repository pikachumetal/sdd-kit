# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit | Verificación visual |
| --- | --- | --- | --- |
| 1 — Cancelar con motivo | hecha (revisión limpia tras 1 ronda de fix) | d4c598d0e975e99f6d7b7e8fedbce812d1843232 | no aplica (backend) |
| 2 — Listado de canceladas | hecha (revisión limpia) | hash en el cierre | no aplica (backend) |

Revisión final: Spec opus+high, Ready: sí · Código sonnet+high, With fixes (1 Important) · Arquitectura no (plan), sobre 395aedc
Pasada de fix: 4a12f48, 1 hallazgo RED→GREEN
Re-revisión: 395aedc..4a12f48, sdd-kit:effort-high + opus, limpia

## Rulings

- Setup: sin worktree nuevo — la rama feature/0010-cancel-reason ya está aislada de main y no hay preferencia declarada; baseline `node --test` en worktree desacoplado: 4/4 verde — si el dev-lead quería worktree, se mueve la rama sin coste.
- Setup: el plan no trae línea «Modelo» por task — implementador sonnet + sdd-kit:effort-medium, revisores sonnet + effort-medium — si falla, sube un nivel en el fix loop.
- Validación del motivo antes de buscar la reserva — la spec no fija orden y así el error de motivo no depende del estado — si el dev-lead quería «sin reserva» primero, se invierte en una línea.
- `canceladas` sin canceladas devuelve cadena vacía — la spec no lo dice, mínimo sin inventar texto — coste: un texto nuevo si lo piden.
- El test de listado dependía del estado que dejaba el de cancelar (única reserva activa, Norte lun) — la revisión final lo marcó Important y se arregló en 4a12f48: ahora prepara su propio estado.

## Minors diferidos

- Task 1: `cancel.test.js` reescrito entero por finales de línea (ruido CRLF→LF).
- Task 1: `cancelar --motivo otro Norte lun` toma `--motivo` como sala (params posicionales).
- Task 2 / Final: sin test de la cadena vacía ni de que `canceladas` excluye `voided` (hace falta otra reserva activa; lo toca la 0011).
- Final: `canceladas` sin canceladas imprime una línea en blanco.
- Final: motivo de varias palabras sin comillas (`--motivo cambio de planes`) se rechaza leyendo solo «cambio»; la spec usa comillas.
- Final: constantes entre funciones; literal «sin reserva» duplicado de antes.
