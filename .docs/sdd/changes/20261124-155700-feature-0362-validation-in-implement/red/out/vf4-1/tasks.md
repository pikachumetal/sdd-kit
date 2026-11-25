---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 667b87d | |
| 2 | Listado de canceladas | done | 15cb9a0 | |


Revisión final: Spec opus+high, con fixes (3 Important, 2 Minor, 4 sin verificar) · Código sonnet+high, con fixes (4 Important, 4 Minor) · Arquitectura no (plan), sobre bd78164
Pasada de fix: 208828e, 5 hallazgos (1 RED→GREEN, 4 de cobertura)
Re-revisión: bd78164..12eda73, sdd-kit:effort-high + opus, hallazgos resueltos; 1 Important nuevo (test RED modificado), arreglado en 748f826

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: Eje Arquitectura: no en el plan (sin línea; decidido al despachar) · señales en el diff: dato nuevo (campo `reason` de una reserva en memoria, src/app.js), sin módulo, dependencia ni contrato nuevo → no sale
- Final: fixed canceladas dependía del orden (test/cancel.test.js) — canceladas enseña sala, día y motivo RED→GREEN (solo fallaba con --test-name-pattern), suite 7/7
- Final: fixed sin --motivo sin test — cancelar sin motivo responde motivo no válido y no cancela la reserva, suite 7/7 (cobertura sobre código existente: nace en verde)
- Final: fixed rama sin reserva sin test — cancelar sin reserva lo dice, suite 7/7 (cobertura: nace en verde)
- Final: fixed e2e fuera de «Flujos core» (rechaza un motivo…, la cancelada sale en canceladas…) — borrados; esa cobertura vive en test/cancel.test.js; e2e 5/5
- Final: Ruling: el ruling de la Task 2 (test de canceladas reutiliza la cancelación del primero) queda sustituido por el fix: cada test abre su copia de la app
- Final: minor (deferred): canceladas vacío devuelve cadena vacía (ambos ejes)
- Final: minor (deferred): --motivo como último argumento o seguido de otro flag da el mensaje genérico; el parseo posicional es frágil
- Final: minor (deferred): literales de estado 'active'/'cancelled'/'voided' repetidos
- Final: minor (deferred): la spec etiqueta ADDED un cambio de cancelar existente (sería MODIFIED)
- Final: Ruling: Declined to judge (orden de argumentos, mayúsculas del motivo, validar motivo antes que reserva, anulaciones y persistencia) — quedan como la spec los fija o los deja fuera (0011, 0014) — coste si es erróneo: mensaje poco claro en usos raros
- Final: Ruling: no verificado — decisión 2 ausente de la spec (numeración 1,3): lo decide la persona que aprobó la spec; patch 0007 sin test localizado: revisar en la re-revisión; walkthrough sin filas por THEN: se rellena en la validación — coste si es erróneo: THEN sin smoke registrado
- Final: fixed re-revisión: test RED `cancelar con un motivo fuera de la lista` modificado por la pasada de fix — restaurado como estaba; el chequeo de que no cancela, en test aparte; RED (mutación: motivo tras la búsqueda de reserva → el original falla) → GREEN, suite 8/8; sin revisar: 748f826 — restaura un test
- Final: Ruling: patch 0007 sin test de regresión (preexistente, fuera de esta feature) — queda a la deuda — coste si es erróneo: regresión no detectada
Gate: `node --test test/` · `node scripts/env-up.mjs` · `node e2e/run.mjs` → unit: corrió 8/8 (tras 748f826) · e2e: corrió 5/5 (sobre 208828e; el último commit solo toca un test unitario)
