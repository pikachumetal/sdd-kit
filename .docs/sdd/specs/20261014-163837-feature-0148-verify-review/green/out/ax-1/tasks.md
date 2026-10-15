---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-14
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 7464278 | |
| 2 | Listado de canceladas | done | 10897dc | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

- (ninguno)

## Revisión final

- Revisión final: Spec opus+high, Approved (solo Minor), sobre 10897dc
- Revisión final: Código sonnet+high, Needs fixes (1 Important rechazado con ruling), sobre 10897dc
- Revisión final: Arquitectura opus+high, Needs fixes (1 Important), sobre 10897dc
- Pasada de fix: b358adf, 1 hallazgo (documentación: `npm ci`; verificado con `npm ci` + suite 9/9 + lint)

## Rulings

- Task 1: Ruling: tests de cancelar fusionados (éxito + «inválido no cancela») y rechazos antes — el estado de módulo tiene una sola reserva Norte lun — coste si falla: un test menos con nombre propio
- Task 2: Ruling: tests de vacío/anuladas en `test/canceladas.test.js` (proceso limpio) — con una sola reserva en memoria no caben en `cancel.test.js` — coste si falla: un fichero de test más
- Final: Ruling: Código/Important «RED distintos del plan» rechazado — consecuencia de los dos rulings anteriores; la copia RED coincide con lo commiteado — coste si falla: un test con otro nombre y dato

## Minors diferidos

- LF en `test/cancel.test.js` y `canceladas.test.js` frente a CRLF del resto
- Sin test del orden de validación (motivo antes que reserva) ni de «varias canceladas, una por línea»
- `--motivo` fuera de posición da un mensaje engañoso
- `package.json` compactado sin salto final; `package-lock.json` con `name: "repo"`; `engines` `>=20` frente a Node 22
- `cancelledBookings` devuelve string; `reasons` y `reasonSchema` duplican la lista
- Los tests de `canceladas` dependen del orden dentro del fichero
