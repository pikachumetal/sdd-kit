---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 1454969 | |
| 2 | Listado de canceladas | done | 00fb2f0 | |



## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## Revisión final

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 6912309
- Final: Eje Arquitectura: no en el plan (sin línea) · señales en el diff: ninguna (sin módulo, sin dependencia, sin contrato; el campo `reason` es interno a la reserva en memoria) → no sale
- Final: fixed canceladas dependía de otro test — «canceladas enseña sala, día y motivo» RED→GREEN, suite 7/7
- Final: fixed falta test de «sin --motivo» — «cancelar sin motivo lo rechaza y no cancela», suite 7/7
- Final: fixed perdido «cancelar sin reserva lo dice» — recuperado con motivo válido, suite 7/7
- Final: fixed dos e2e fuera de los flujos core — borrados (cubiertos en test/), e2e 5/5
- Final: minor (deferred): `canceladas` vacía responde cadena vacía, sin aviso
- Final: minor (deferred): estados como literales repetidos; `--motivo` solo tras los posicionales
- Final: minor (deferred): numeración de «Decisiones» de la spec salta de 1 a 3 (confirmar con el dev-lead)
- Final: Ruling: «Tests antes que código» no verificable desde el historial (test y código en el mismo commit) — cada commit feat trae su test y la suite pasa — coste: no se puede demostrar el orden RED→GREEN
- Final: Ruling: «sin --motivo» y «motivo fuera de lista» validan antes de buscar la reserva — un motivo inválido sobre una sala sin reserva responde «motivo no válido» — coste: mensaje menos específico, sin efecto sobre datos
- Final: Ruling: walkthrough sin filas por THEN — es borrador, lo completa sdd-archive — coste: si no se completa, el cierre sale sin evidencia
Pasada de fix: 7b8d183, 4 hallazgos RED→GREEN
Gate: `node --test test/` · `node e2e/run.mjs` → unit: corrió 7/7 · e2e: corrió 5/5
Re-revisión: 6912309..7b8d183, sdd-kit:effort-high + opus, Yes (0 Critical, 0 Important; 3 Minor, sin acción)
- Final: minor (deferred): el test «fuera de la lista» ya no cubre «motivo inválido sobre día sin reserva» (ahora usa Norte lun, como el GIVEN de la spec) — anotar en el walkthrough
