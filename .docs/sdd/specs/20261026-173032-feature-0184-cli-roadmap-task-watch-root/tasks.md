---
id: 20261026-173032-feature-0184-cli-roadmap-task-watch-root
title: Tasks — CLI: columnas del roadmap, task start lite, vigía reanudado y raíz del proyecto
spec: ./spec.md
plan: ./plan.md
created: 2026-10-26
---

# Tasks — CLI: columnas del roadmap, task start lite, vigía reanudado y raíz del proyecto (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0184-cli-roadmap-task-watch-root`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `roadmap check`: celdas por fila y filas que apuntan a una tarea ✅ | done | 3ec9e6cf | escapa cinco filas del `roadmap.md` del repo |
| 2 | `task start` con spec lite | done | e39eebd8 | |
| 3 | El vigía no da por terminado un subagente reanudado | done | 41fbd711 | |
| 4 | `--project-root` en todo verbo que sitúa el proyecto | done | 926fa5be | |
| 5 | `sdd merge` dice qué test falló | done | 03ff781c | |

## Verificación por task

- [x] Task 1 — `pnpm --dir cli exec vitest run test/roadmap/check.test.ts test/roadmap/debt.test.ts` → 71/71; `roadmap check --path .docs/sdd` → `Roadmap válido`
- [x] Task 2 — `pnpm --dir cli exec vitest run test/tasks/brief.test.ts` → 3/3; smoke `task start` sobre una spec lite → `brief:` y `base:`, código 0
- [x] Task 3 — `pnpm --dir cli exec vitest run test/watch/watch.test.ts` → 25/25
- [x] Task 4 — `pnpm --dir cli exec vitest run test/cli.test.ts test/docs-claims.test.ts` → 514/514
- [x] Task 5 — `pnpm --dir cli exec vitest run test/merge/verify.test.ts` → 13/13; lentas de merge 35/35

Revisión final: Spec opus+high, With fixes (1 Important, 5 Minor) · Código sonnet+high, Yes (8 Minor) · Arquitectura no (plan), sobre 03ff781c
Pasada de fix: juntada en el cierre, 10 hallazgos (1 Important RED→GREEN por mutación, 9 Minor), 4 adjudicados con ruling
Re-revisión: 03ff781c..juntada en el cierre, sdd-kit:effort-high + opus, todos los hallazgos resueltos; 1 Minor nuevo adjudicado

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 1: Ruling: «rejects a different release header» espera también las dos filas de 5 celdas bajo la cabecera de 4 — son ciertas y el THEN no dice «solo» — si es incorrecto: filtrar las filas cuando la cabecera no es la de la plantilla
- Task 1: Ruling: el roadmap del repo tenía 5 filas con | sin escapar dentro de un código (líneas 16, 27, 63, 127, 529); escapadas con \| en el commit de la task — si es incorrecto: nada, el texto se lee igual
- Task 1: Ruling: aviso real en roadmap.md:332 (deuda «Actuar → 0214», la 0214 ✅) — no se salda aquí: es fila de otra feature; va al ticket — si es incorrecto: una fila más por saldar
- Baseline: Ruling: gate de cierre 1344/1345, único rojo «Conjunto rápido del pre-commit tarda menos del umbral» (78,58 s) con Vitest corriendo a la vez — carga, no código; se repite sin carga en la validación final — si es incorrecto: el pre-commit es lento en develop y va a deuda
- Task 4: Ruling: el fixture de los tests de --project-root gana specs/.gitkeep — estimation log sale con 1 sin specs/ ni changes/; el test pedía código 0 — si es incorrecto: nada, solo cambia el fixture
- Task 5: Ruling: sin test en attempt.test.ts — abortedMergeError necesita git; lo cubren failureReport y las pruebas lentas de merge (failures, verify, base-red: 35/35) — si es incorrecto: un test lento de hook en rojo con [-] (la revisión final lo rebatió: la pasada de fix añadió los dos tests lentos)
- Final: Ruling: Spec Minor 4 (falta la opción --path no nombra --project-root) — no se cambia: es un texto observable que la spec no fija y cambiarlo es freno de alcance — si es incorrecto: una llamada fallida más antes de leer la ayuda
- Final: Ruling: Spec Minor 5 (un año dentro de la negrita anula el aviso) — se queda: la convención deja la fecha fuera de la negrita y el coste es un aviso que no sale — si es incorrecto: una fila sin saldar sin aviso
- Final: Ruling: Código Minor 6 (con spec lite, TASK_NUMBER se ignora sin avisar) — se queda: la decisión 4 de la spec dice «sea cual sea TASK_NUMBER» — si es incorrecto: un brief de nombre task-7 con la spec
- Final: Ruling: Código Minor 7 (FAILED_TEST con «1920 × 1080», ANSI y duplicados FAIL/×) — se queda: efecto cosmético en un merge ya rojo; ANSI no medido (moon sin TTY en el hook) — si es incorrecto: líneas de más o ninguna con color forzado
- Final: Ruling: re-revisión Minor (if (log !== '') rmSync en el test nuevo de --verify deja el .log en tmpdir si el patrón no casa) — se queda: sin segunda pasada de fix; el test ya exige el mensaje con «salida completa en» — si es incorrecto: un .log huérfano en tmpdir
- Final: Ruling: Declined to judge (Código y Spec): orden de mensajes, «2 × 3», propuesta sin flecha, celda vacía final, pista en verbos nuevos, carrera del vigía, roadmap de usuarios con | en código — se quedan: la spec los fija o los deja fuera — si es incorrecto: un pre-commit rojo en un proyecto hasta escapar la fila
