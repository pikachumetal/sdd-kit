---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-12
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | b7b9132 | `tasks.md` no se escribió antes de la Task 1: se crea en la pasada de fix, desde el ledger |
| 2 | Listado de canceladas | done | 7a9c950 | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → 2/2
- [x] Task 2 — `node --test test/cancel.test.js` → 3/3

## Revisión

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 7a9c950
Pasada de fix: juntada en el cierre, 2 hallazgos RED→GREEN
Re-revisión: 7a9c950..juntada en el cierre, sdd-kit:effort-high + opus, limpia

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Final: minor (deferred): Spec#3 el test del motivo no válido usa Sur mar en vez del GIVEN Norte lun; no fija que la reserva quede intacta
- Final: minor (deferred): Spec#4 / Código#M1 `canceladas` sin canceladas imprime una línea vacía; un mensaje nuevo cambia la salida observable y pide enmienda de la spec
- Final: minor (deferred): Código#M2 el test de `canceladas` depende del estado que deja el primer test (bookings del módulo)
- Final: minor (deferred): Código#M3 `--motivo` solo funciona tras sala y día (misma convención que `--cada-semana`)
- Final: minor (deferred): Código#M4 un motivo no válido se informa antes que «sin reserva» (orden de comprobaciones)
- Final: Ruling: --motivo antes de sala y día (declinado, Spec) — la spec fija el formato `cancelar <sala> <día> --motivo <motivo>`; queda como minor M3 — un usuario que lo ponga primero recibe «sin reserva --motivo otro»
- Final: Ruling: motivo de varias palabras sin comillas (declinado, Spec) — lo parte el shell y la spec escribe el motivo entre comillas; no se toca — «sala ocupada» sin comillas responde «motivo no válido», que es al menos un error visible
- Final: Ruling: persistencia del motivo (declinado, Spec) — es la 0014 del roadmap — si no, el motivo se pierde al cerrar el proceso, igual que hoy las reservas
- Final: Ruling: informe de canceladas por sala con total (declinado, Spec) — es la 0012 — ninguno
- Final: Ruling: anulaciones del responsable (declinado, Spec y Código) — 0011, fuera de Scope; voidBooking no registra motivo — ninguno en esta feature
- Final: Ruling: dependencia de orden del test 3 (declinado, Spec) — le toca a Código, que la da como minor M2 — un reorden rompe el test, no la app
- Final: Ruling: partir `run` en manejadores por comando (declinado, Código) — eje Arquitectura no sale y son 6 ramas — crecerá con más comandos
- Final: Ruling: `bookings` como estado del módulo (declinado, Código) — diseño de la base, fuera del diff — ninguno nuevo
