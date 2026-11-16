---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-14
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 2f84f44 | |
| 2 | Listado de canceladas | done | fba2e80 | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Ruling: trabajo en el sitio, sin worktree nuevo — sin preferencia declarada, rama de feature (no main), ejecución sin interlocutor — coste si me equivoco: el dev-lead prefería worktree; se mueve con un `git worktree add`.
- Ruling: ejecución subagent (línea del plan) y no native (sdd-kit.json `execution`) — manda la línea `Ejecución` del plan — coste: ninguno.
- Ruling: sin tipo de effort declarado en el plan — dispatch con `sdd-kit:effort-medium` + `sonnet` (prosa, 1 fichero de código) — coste: algún turno de más.
- Ruling: T1 guarda `booking.reason` — spec Approach lo manda, el plan lo calla — coste si me equivoco: T2 lo reajusta.
- Ruling: motivo validado antes que la reserva; tests existentes de `cancelar` reescritos con motivo — la spec manda sobre el plan — coste: un test.
- Ruling: tests con módulo fresco por import con query — aislamiento sin añadir API de reset a src — coste: ninguno.
- Final: Ruling: Eje Arquitectura no — decidido al despachar, plan sin la línea — coste si me equivoco: un eje menos de revisión
- Final: minor (deferred): canceladas sin canceladas devuelve '' y el CLI imprime línea en blanco (Spec 1, Code 1) — arreglarlo cambia la salida observable: es decisión del dev-lead, no un arreglo
- Final: minor (deferred): sin test de que canceladas excluya voided, ni del formato multilínea (Spec 2-3, Code 4)
- Final: minor (deferred): freshApp con id escrito a mano (Code 2); EOL del fichero de test (Code 3); readReason acepta otra flag como motivo (Code 5); literales de estado repetidos (Code 6)
- Final: Ruling: declined (Spec) estado en memoria, canceladas vacío desde terminal hasta la 0014 — la 0014 «Motivo guardado» del ROADMAP lo salda — coste si me equivoco: canceladas inútil por CLI hasta entonces
- Final: Ruling: declined (Spec) `--motivo` antes de sala/día, mayúsculas del motivo, orden de validación — la spec fija la sintaxis y la lista cerrada; el mensaje orienta — coste: un caso de uso raro
- Final: Ruling: declined (Code) README/CHANGELOG sin entrada, estructura de módulo con estado — el README no documenta comandos; estructura previa a la rama — coste: ninguno
- Final: Ruling: no verificado (Spec) comportamiento real por terminal y suite — suite corrida por el hilo (ver abajo); la terminal con comillas queda sin probar — coste: tokenizado de la shell no probado

## Revisión final

Revisión final: Spec opus+high, sin hallazgos Critical ni Important (3 Minor) · Código sonnet+high, sin hallazgos Critical ni Important (6 Minor) · Arquitectura no (plan), sobre fba2e80
