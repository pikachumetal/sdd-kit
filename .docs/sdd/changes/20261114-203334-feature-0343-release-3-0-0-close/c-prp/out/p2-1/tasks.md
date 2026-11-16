---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-15
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo de la lista | done | 391aaae | |
| 2 | Comando `canceladas` | done | 9bb14c5 | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → `ℹ fail 0`
- [x] Task 2 — `node --test test/cancel.test.js` → `ℹ fail 0`

Revisión final: Spec opus+high, sin hallazgos Critical ni Important, 1 minor · Código sonnet+high, sin Critical ni Important, 7 minor · Arquitectura no (plan), sobre 9bb14c5

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Setup: Ruling: trabajo en la rama feature/0010-cancel-reason sin worktree aparte — no es main y el perfil es delegate — coste si me equivoco: ninguno, nada fuera de la rama.
- Pre-flight: ambas tasks comparten test/cancel.test.js y src/app.js; el estado de bookings es global y cancelar muta: los tests deben aislarse | Ruling: cada test usa un orden/estado que no dependa de otro (ver Task 1) — coste si me equivoco: tests acoplados por orden
- Final: minor (deferred): src/app.js:4 `=[` sin espacio (regresión mía: el original tenía `= [`) — coste: estilo
- Final: minor (deferred): test/cancel.test.js pasó de CRLF a LF al reescribirlo; el diff reescribe todo el fichero — coste: historial menos legible
- Final: minor (deferred): optionValue/listCancelled lejos de run; sin test de `--motivo` sin valor — coste: legibilidad/documentación
- Final: minor (deferred): la spec no registra en Enmiendas que `cancelar` sin motivo ahora se rechaza (MODIFIED sin THEN); añadirlo cambia la spec, así que es del dev-lead — coste: el archive copiará un delta sin esa regla
- Final: minor (deferred): tasks.md con el commit de la Task 2 en «—» (se rellena en el cierre)
- Final: Ruling: `cancelar --motivo otro Norte lun` (opción delante) → `sin reserva --motivo otro` — la spec fija la forma `cancelar <sala> <día> --motivo <motivo>` — coste: mensaje poco claro con otro orden
- Final: Ruling: motivo con mayúsculas o espacios extra («Sala ocupada») → no válido — lista cerrada con texto exacto (decisión 1) — coste: fricción al teclear
- Final: Ruling: cancelar una reserva ya cancelada → `sin reserva` — comportamiento previo, findBooking no cambia — coste: ninguno
- Final: Ruling: `canceladas` con varias líneas unidas por `\n` sin test — no hay forma de tener dos canceladas por los comandos públicos (reservar es un stub) — coste: formato multilínea sin probar
