---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 56c2090 | |
| 2 | Listado de canceladas | done | 911e7bb | |
| 3 | Pasada de fix de la revisión final | done | juntado en el cierre | tests: sin --motivo, sin reserva, cada test con su estado; fuera 2 E2E no core |



## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## Revisión final

Revisión final: Spec opus+high, con arreglos (0 Critical · 2 Important · 4 Minor) · Código sonnet+high, con arreglos (0 Critical · 3 Important · 2 Minor) · Arquitectura no (plan), sobre juntada en el cierre
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: ninguna (sin módulo nuevo, package.json sin cambios, sin contrato entre módulos, el campo `reason` vive en memoria) → no sale
Final: fixed cancelar sin --motivo sin test (Spec Important 1) — cancelar sin --motivo lo rechaza RED→GREEN (mutación: motivo por defecto), unit 7/7
Final: fixed rama «sin reserva» sin test (Spec/Código Important) — cancelar una sala sin reserva con un motivo válido lo dice RED→GREEN (mutación), unit 7/7
Final: fixed test de canceladas dependiente del primero (Código Important, Spec Minor) — cada test importa su copia de la app; canceladas pasa sola, unit 7/7
Final: fixed 2 E2E fuera de «Flujos core» y presupuesto 0,5 min (Código Important) — borrados «rechaza un motivo fuera de la lista» y «la cancelada sale en canceladas con su motivo» (cubiertos en unit); E2E 5/5 en 30,1 s
Final: minor (deferred): canceladas sin canceladas imprime una línea vacía (Código/Spec Minor)
Final: minor (deferred): nada fija que un motivo inválido deje la reserva activa (Spec Minor)
Final: minor (deferred): literal '--motivo' inline en reasonOf (Código Minor)
Final: Ruling: la spec dice «MODIFIED» en la decisión 3 pero el delta solo tiene ADDED, y cancelar sin --motivo deja de cancelar (ruptura pedida por el AND del primer requisito) — el CHANGELOG lo recoge en «Changed» al archivar — coste si es erróneo: quien usaba cancelar sin motivo recibe un error sin aviso previo
Pasada de fix: juntada en el cierre, 4 hallazgos RED→GREEN
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, todo ADDRESSED, sin Critical/Important nuevos
Final: minor (deferred): la pasada de fix guardó test/cancel.test.js y e2e/cancel.e2e.mjs con LF y el resto del repo está en CRLF (Re-revisión Minor)
Final: minor (deferred): freshApp separa el estado solo mientras los nombres de test sean únicos (Re-revisión, fuera de alcance)
