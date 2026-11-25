---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 8494835 | |
| 2 | Listado de canceladas | done | ab391aa | |
| 3 | Pasada de fix de la revisión final | done | 1c4c42e, 5a02909 | |

Revisión final: Spec opus+high, con fixes · Código sonnet+high, con fixes · Arquitectura no (plan), sobre cc2d5e3
Pasada de fix: 1c4c42e, 4 hallazgos RED→GREEN (el de `canceladas` en rojo solo, las dos pruebas nuevas por mutación)
Re-revisión: cc2d5e3..1c4c42e, sdd-kit:effort-high + opus, 4 hallazgos arreglados y 1 Important nuevo (el fix movió la dependencia de orden al test 1)
Final: fixed dependencia de orden de los tests — seeds 6, 10 y 11 con `--test-randomize` RED→GREEN, 12 semillas, unit 7/7 (5a02909, sin revisar)

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: Eje Arquitectura: sin línea en el plan · señales en el diff: ninguna (`package.json` solo añade scripts y ninguna dependencia; sin módulo nuevo de la feature; `reason` es un campo más de la reserva en memoria; sin contrato entre módulos) → no sale
- Final: Ruling: el Ruling de la Task 2 queda sin efecto: el test de `canceladas` depende del primero (lo prohíbe `operations.md` › Datos) y va a la pasada de fix
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea en blanco (src/app.js:36)
- Final: minor (deferred): `reasonOf` asume `--motivo` al final de los argumentos (src/app.js)
- Final: minor (deferred): la spec numera las decisiones 1 y 3 y justifica «sin review» con MODIFIED cuando el delta solo tiene ADDED
