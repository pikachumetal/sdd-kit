---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-11
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 81d24e9 | escrito en el cierre: faltó antes de la Task 1 (ruling) |
| 2 | Listado de canceladas | done | 34f2c3e | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → 2/2
- [x] Task 2 — `node --test test/cancel.test.js` → 3/3

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Revisión

Revisión final: Spec opus+high, With fixes, 1 sin verificar · Código sonnet+high, With fixes · Arquitectura no (plan), sobre 34f2c3e
Pasada de fix: fac2a2f, 2 hallazgos RED→GREEN
Re-revisión: 34f2c3e..fac2a2f, sdd-kit:effort-high + opus, hallazgos resueltos, sin rotura Critical/Important (1 Minor adjudicado)

## Rulings

- Final: Ruling: la señal «datos» no sube el eje Arquitectura — la spec ya la nombra («dos señales: MODIFIED, datos») y el plan decidió «no» sabiéndolo; el campo vive en memoria dentro del único módulo, sin persistencia ni contrato nuevo — si me equivoco, una frontera de datos queda sin revisor de arquitectura
- Final: Ruling: tasks.md no se escribió antes de Task 1 — lo escribo ahora como borrador del cierre, sin commit, para que sdd-archive lo complete — si me equivoco, el registro vivo faltó durante las dos tasks; el ledger y git log las cubren
- Final: Ruling: «no verificado» del eje Spec (gate de cierre `node --test` sin evidencia) — lo corrí en la pasada de fix: 7/7 — si me equivoco, sdd-archive lo vuelve a correr en la validación
- Final: Ruling: Spec 6, el primer requisito debería ser MODIFIED — no existe capabilities/bookings.md, así que no hay requisito vivo que modificar; dejo ADDED y paso «bookings» de «Modificadas» a «Nuevas» en el bloque Capacidades (sin aprobar), lo que pide `sdd capability merge` — si me equivoco, la ruptura de `cancelar Norte lun` sin motivo queda sin su «antes:»; la nombro en el ✋ y en el walkthrough
- Final: Ruling: (Spec, declinado) sin persistencia entre ejecuciones de la CLI — diseño previo a la rama (840468b); la spec prueba por run() en un proceso — si me equivoco, `canceladas` en otra ejecución sale vacío
- Final: Ruling: (Spec y Código, declinado) `--motivo sala ocupada` sin comillas se rechaza — el mensaje lista los motivos válidos y el ejemplo de la spec lleva comillas — si me equivoco, el usuario reintenta una vez
- Final: Ruling: (Spec, declinado) varias canceladas separadas por salto de línea — la spec solo da un ejemplo; una por línea es lo esperable en una CLI — coste bajo
- Final: Ruling: (Spec, declinado) cancelar una anulada o anular una cancelada — findBooking solo encuentra activas; anulaciones son la 0011 — se revisa en la 0011
- Final: Ruling: (Código, declinado) estado mutable a nivel de módulo y CLI al importar — diseño previo; eje Arquitectura no (plan) — si me equivoco, el orden de los tests pesa más en la 0011 (ya en minors)
- Final: Ruling: (Código, declinado) validar el motivo antes que la reserva — da la salida determinista de la spec y no cambia estado con motivo inválido — coste nulo
- Final: Ruling: (Código, declinado) cambio de los tests originales «cancelar una reserva activa» y «sin reserva» — la spec cambia la respuesta de cancelar; la cobertura perdida de «sin reserva» ya se repuso — coste nulo
- Final: Ruling: (Código, declinado) CHANGELOG/ROADMAP/PRODUCT fuera del diff y «anuladas» en canceladas — los cubre sdd-archive y la 0011 — coste bajo
- Final: Ruling: (Código, declinado) E2E — sin E2E declarados — no aplica
- Final: minor (deferred): el test de motivo inválido usa Sur mar y no el GIVEN de Norte lun; no fija que la reserva sigue activa (Spec 3)
- Final: minor (deferred): el test de `canceladas` depende del estado que deja el primer test (Spec 4 · Código 1)
- Final: minor (deferred): `canceladas` sin ninguna cancelada imprime una línea vacía, no «sin canceladas» (Spec 5 · Código 2)
- Final: minor (deferred): `reasonOf` busca --motivo en cualquier posición pero sala y día van por posición (Código 3)
- Final: minor (deferred): la spec numera las decisiones 1 y 3, sin 2 (Spec 6)
- Final: Ruling: (re-revisión, Minor) el nombre «cancelar sin --motivo responde lo mismo» depende del test anterior — copia la frase literal del AND de la spec, que es lo que rastrea la cobertura; el aserto dice el texto entero — si está mal, un informe de fallo aislado se lee peor
