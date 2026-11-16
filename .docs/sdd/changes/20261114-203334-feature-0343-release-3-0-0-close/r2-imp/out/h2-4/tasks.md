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
| 1 | Cancelar con motivo | done | e6bc36a | Minor diferidos: tests dependen del orden; `--motivo` seguido de otro flag lo toma como motivo |
| 2 | Listado de canceladas | done | e1682b6 | Minor diferido: el test depende del orden |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 0: Ruling: orden de validación en `cancelar` — primero reserva (`sin reserva …`), después motivo — la spec fija los THEN con la reserva existente y el test `sin reserva` existente (sin motivo) sigue vigente — si es al revés, se invierte el orden en una línea
- Task 0: Ruling: implementador sonnet + sdd-kit:effort-medium en ambas tasks — el plan no declara Modelo; 1-2 ficheros pero descrito en prosa (suelo mid-tier) — coste si falla: una ronda más
- Task 0: Ruling: el test de listado (T2) depende del estado en memoria que deja el cancel exitoso de T1 (una sola reserva en `app.js`, un proceso por fichero de test); se ordenan y se comenta — si se rompe el orden falla ruidosamente
- Task 1: Ruling: Minor diferidos — tests dependen del orden (ya en ruling previo); --motivo seguido de otro flag se toma como motivo y acaba en «motivo no válido» (inocuo); CRLF del test corregido por el hilo (formato, culpa del RED del hilo)
- Task 2: Ruling: Minor diferidos — test depende del orden; cancelReason sin defensa porque cancelBooking siempre lo asigna
- Final: Ruling: ejes Spec (opus+high) y Code (sonnet+high), sin Arquitectura — sin señales — si hacía falta, un eje más
- Final: re-grade: el Important del eje Code (test de `canceladas` dependiente del orden) baja a Minor por su efecto — falla ruidoso solo si se lanza aislado, `node --test` corre el fichero en orden y arreglarlo exige un hook de reset en producción; el eje Spec lo graduó Minor — si se quiere Important, es un test más y un reset
- Final: minor (deferred): test de `canceladas` depende del test anterior (Code #1, Spec #3)
- Final: minor (deferred): solo se prueba la aceptación de «sala ocupada»; «cambio de planes» y «otro» sin test de aceptación (Spec #1)
- Final: minor (deferred): ningún test fija que `canceladas` excluye anuladas/activas ni cómo une varias (Spec #2)
- Final: minor (deferred): `canceladas` sin canceladas imprime línea vacía; sin motivo y motivo inválido comparten mensaje, como fija la spec (Code #2, #1; Spec #4)
- Final: minor (deferred): reasonFrom indulgente con el orden de argumentos y `--motivo` final sin valor sin test (Code #3)
- Final: minor (deferred): nombres CANCEL_REASONS/cancelReason en inglés y constante entre funciones (Code #4, #6)
- Final: Ruling: Code «declined»: RED antiguos reescritos — el primero cambió porque la spec cambia el comportamiento (sin --motivo ya no cancela), contrato nuevo del preflight — sin coste
- Final: Ruling: Code/Spec «declined»: spec, arquitectura, `voidBooking`/`anular` — fuera de eje o de alcance (0011) — sin coste
- Final: Ruling: Spec «declined»: persistencia entre ejecuciones del CLI (cada proceso arranca con el fixture en memoria) — ya era así antes y guardar el motivo es la 0014 — si el dev-lead lo espera ahora, es una feature más
- Final: Ruling: Spec «declined»: variantes `--motivo=…`, sin comillas o con otras mayúsculas — se rechazan con el texto que lista los válidos; lista cerrada decidida con el dev-lead — coste: una variante más a aceptar
- Final: Ruling: Spec «declined»: ADDED vs MODIFIED en la spec y la numeración «1, 3» de las decisiones — defectos de redacción de la spec aprobada, no de código; se anotan para el walkthrough — sin coste
- Final: Ruling: Spec «declined»: CHANGELOG y estado del ROADMAP — lo hace sdd-archive

Revisión final: Spec opus+high, con fixes (0 Critical, 0 Important, 4 Minor) · Código sonnet+high, con fixes (1 Important bajado a Minor por su efecto, 6 Minor) · Arquitectura no (plan: sin señales), sobre e1682b6
