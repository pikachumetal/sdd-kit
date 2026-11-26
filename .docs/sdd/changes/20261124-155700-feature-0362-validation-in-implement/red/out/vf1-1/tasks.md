---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | ad58bf1 | |
| 2 | Listado de canceladas | done | baa2813 | |



Revisión final: Spec opus+high, con arreglos (2 Important) · Código sonnet+high, con arreglos (5 Important) · Arquitectura no (plan), sobre 13bc857
Pasada de fix: 8a2d84b, 3 hallazgos RED→GREEN (verificados por mutación) + 2 e2e retirados

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo, dependencia ni contrato nuevos) → no sale
- Final: fixed «sin --motivo» sin test — «cancelar sin motivo lo rechaza» RED→GREEN (con la validación anulada falla), suite 7/7
- Final: fixed pérdida de «cancelar sin reserva» — «cancelar sin reserva lo dice» RED→GREEN, suite 7/7
- Final: fixed test de `canceladas` dependiente del orden (cierra el Ruling de la Task 2) — import fresco, suite 7/7
- Final: fixed e2e «rechaza un motivo…» y «la cancelada sale en canceladas…» fuera de flujos core — retirados, cubiertos en test/cancel.test.js
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía
- Final: minor (deferred): `--motivo` seguido de otro flag se toma como motivo (la lista lo rechaza)
- Final: Ruling: spec dice ADDED y no MODIFIED, y la numeración de decisiones salta de 1 a 3 — es de la spec aprobada, no del código — coste si es erróneo: el CHANGELOG no marca que `cancelar` sin `--motivo` ya no cancela; anotarlo al archivar
- Final: Ruling: sin `--motivo` y sin reserva responde «motivo no válido» antes que «sin reserva» — coherente con el THEN de la spec — coste si es erróneo: mensaje menos útil en un caso raro
- Final: Ruling: --motivo antes de sala/día y mayúsculas distintas se rechazan — la spec fija la sintaxis y la lista cerrada — coste: rechazo de una entrada razonable
- Final: Gate: `node --test test/` · `node e2e/run.mjs` → unit: corrió 7/7 · e2e: corrió 5/5
