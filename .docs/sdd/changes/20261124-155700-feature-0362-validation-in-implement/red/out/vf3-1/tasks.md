---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 750d18a | |
| 2 | Listado de canceladas | done | 50d62fd | |



## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## Revisión final

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, no · Arquitectura no (plan), sobre 4049afc
Pasada de fix: 0a1b7e3, 4 hallazgos RED→GREEN
Re-revisión: 4049afc..0a1b7e3, sdd-kit:effort-high + opus, arreglos confirmados, sin Crítico ni Importante nuevo

- Final: Eje Arquitectura: no en el plan (sin línea; decidido al despachar) · señales en el diff: ninguna (sin módulo nuevo, `package.json` intacto, sin contrato entre módulos, solo un campo `reason` en memoria) → no sale
- Final: fixed `freeRooms` contaba las canceladas como ocupadas (`src/app.js:7`, Crítico de Spec y Código) — `cancelar libera la sala en libres` RED→GREEN, suite 8/8 y e2e 7/7
- Final: fixed el test de `canceladas` dependía de otro (Importante de ambos ejes) — cada test crea su app con `import(...?session=N)`, suite 8/8
- Final: fixed faltaban los tests de `cancelar` sin `--motivo`, de `sin reserva` y del motivo inválido sobre una reserva existente (Importante) — `cancelar sin --motivo responde lo mismo`, `cancelar sin reserva lo dice` RED→GREEN, suite 8/8
- Final: Ruling: el ruling de la Task 2 (test de `canceladas` reutilizando la cancelación del primero) queda sustituido por el fix anterior — coste si es erróneo: ninguno, el test ya prepara sus datos
- Final: minor (deferred): `src/app.js` pasó de CRLF a LF entero en 968e72d y el diff oculta el cambio real
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía
- Final: minor (deferred): `e2e/cancel.e2e.mjs` › «rechaza un motivo fuera de la lista» repite el test unitario; el e2e sube a 48 s frente a un presupuesto de 0,5 min
- Final: minor (deferred): una cancelada responde «sin reserva» al volver a cancelarla
- Final: minor (deferred): `cancelar --motivo otro` toma `--motivo` como sala (sin parser de flags, preexistente)
- Final: minor (deferred): `test/cancel.test.js:20` prueba «no cancela nada» con `canceladas === ''`, que fija la salida vacía diferida; mejor comprobar con `libres`
