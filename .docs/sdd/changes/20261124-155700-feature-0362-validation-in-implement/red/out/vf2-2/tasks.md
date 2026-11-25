---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | c7586a0 | |
| 2 | Listado de canceladas | done | 13149f2 | |



## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo nuevo, sin dependencia en manifiestos —`package.json` sin cambios—, sin contrato entre módulos ni datos persistidos) → no sale

Revisión final: Spec opus+high, no listo (1 Critical, 1 Important) · Código sonnet+high, no listo (1 Critical, 4 Important) · Arquitectura no (plan), sobre 864d419
- Final: fixed Crítico `libres` trataba la cancelada como ocupada (14880cc, fuera de plan) — «la sala cancelada vuelve a salir en libres» RED→GREEN, suite 8/8 + e2e 5/5 (arreglo b73aa3e)
- Final: fixed Important CRLF→LF de `src/app.js` — el diff contra 13149f2 queda en la línea de `libres`, suite 8/8 (arreglo b73aa3e)
- Final: fixed Important test de `canceladas` dependiente del orden (anula el Ruling de la Task 2) — cada test importa su copia del módulo; los 6 pasan sueltos con `--test-name-pattern`, suite 8/8 (arreglo b73aa3e)
- Final: fixed Important sin test del THEN «sin --motivo» — «cancelar sin motivo pide un motivo de la lista» RED→GREEN (pasa sobre código ya correcto), suite 8/8 (arreglo b73aa3e)
- Final: fixed Important/Minor sin test de «cancelar sin reserva» y del motivo inválido sobre reserva existente — repuestos, suite 8/8 (arreglo b73aa3e)
- Final: fixed Important presupuesto E2E 48 s > 0,5 min — quitados «rechaza un motivo fuera de la lista» y «la cancelada sale en canceladas» (cubiertos en unit), e2e 5/5 en 30,2 s (arreglo b73aa3e)
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía
- Final: minor (deferred): estados `'active'`/`'cancelled'`/`'voided'` como cadenas repetidas
- Final: minor (deferred): `reasonOf` devuelve el token siguiente aunque sea otra opción (el resultado sigue siendo «motivo no válido»)
- Final: Ruling: orden de validación (motivo antes que existencia de la reserva) — una persona recibe antes el aviso del motivo que el de sala inexistente, ambos accionables — coste si es erróneo: un mensaje distinto en un caso con dos errores
- Final: Ruling: Decisión 3 sin «Decisión 2» en la spec (numeración 1→3) y ADDED sobre un comando que ya existía — defecto de redacción de la spec, el diff sigue el comportamiento descrito — coste si es erróneo: ninguno en el código
- Final: Ruling: `canceladas` solo vive en el proceso — la spec lo limita hasta la 0014 — coste si es erróneo: se pierde al reiniciar
Pasada de fix: b73aa3e, 1 hallazgo RED→GREEN (libres) y 5 sin RED posible (formato, orden, cobertura repuesta, presupuesto)
Re-revisión: 864d419..b73aa3e, sdd-kit:effort-high + opus, 7/7 hallazgos atendidos y 1 Important nuevo (test RED de la Task 1 reescrito)
- Final: fixed Important de la re-revisión: test RED «cancelar con un motivo fuera de la lista» restaurado (Sur mar) y el caso Norte lun en un test aparte — suite 9/9 + e2e 5/5 en 30,1 s (arreglo 0eee659)
- Final: sin revisar: 0eee659 — repone un test de la Task 1 y añade uno (solo test/cancel.test.js)
