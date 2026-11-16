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
| 1 | Cancelar pide un motivo de la lista | done | 9d32be3 | |
| 2 | El listado de canceladas enseña el motivo | done | 402dfb3 | `export const bookings` se hizo aquí, donde se usa |

## Verificación por task

- [x] Task 1 — `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
- [x] Task 2 — `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings


Revisión final: Spec opus+high, listo para fusionar · Código sonnet+high, con arreglos (solo menores tras reclasificar) · Arquitectura opus+high, con arreglos (solo menores tras reclasificar), sobre 402dfb3

Task 1: Ruling: export const bookings se hizo en la Task 2, donde se usa — el plan lo lista en §1.1 sin task — coste si falla: ninguno
Final: Ruling: Código #1 (`--motivo` antes de los posicionales da «sin reserva --motivo otro») bajado de Important a Minor — la spec fija la sintaxis `cancelar <sala> <día> --motivo <motivo>`; con el orden de la spec no ocurre — coste si falla: mensaje confuso al reordenar argumentos
Final: Ruling: Código #2/#3 (tests dependientes del orden y `bookings` exportado) bajados a Minor — el plan decidió el estado compartido; el usuario no lo ve — coste si falla: un test suelto con --test-name-pattern puede fallar
Final: minor (deferred): `--motivo` sin valor, `--motivo` antes de sala/día y `canceladas` vacío sin test
Final: minor (deferred): el test de anuladas no comprueba que `anular` responda «anulada Sur mar»
Final: minor (deferred): finales de línea CRLF→LF en app.js, cancel.test.js, architecture.md, operations.md y package.json compacto sin salto final (ruido en blame)
Final: minor (deferred): `package-lock.json` con `"name": "repo"`; `package.json` sin `name`/`private`
Final: minor (deferred): línea en blanco entre «Instalar» y «Arrancar» en operations.md
Final: minor (deferred): `architecture.md` dice «validar entradas» y hoy solo valida el motivo
Final: Ruling: no verificado «zod instala y el lock es válido»: verificado por mí — `npm install zod` corrió en la Task 1 (0 vulnerabilidades) y la suite pasó con la dependencia instalada — coste si falla: ninguno
Final: Ruling: Arquitectura recomienda `npm ci` antes del gate — el gate de operations.md corre en una instalación ya hecha; lo hago antes del gate de cierre — coste si falla: un clon limpio falla sin instalar (operations.md ya dice «Instalar»)
Final: Ruling: Declined (Spec) — salida vacía de `canceladas`, mensaje de `cancelar` sin motivo, orden motivo→reserva, mayúsculas de motivo: decisiones 3, 4 y 5 del plan; una lista vacía da salida vacía y una persona razonable lo espera en una CLI — coste si falla: texto distinto en un caso límite
Final: Ruling: Declined (Código/Arquitectura) — `anular` sin motivo, orden/agrupación del listado, ADR de zod, `engines` vs Node 22, `includes` en vez de zod: fuera de la 0010 o fijado por la spec — coste si falla: ninguno para la 0010
