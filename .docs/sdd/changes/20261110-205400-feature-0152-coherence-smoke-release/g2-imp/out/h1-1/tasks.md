# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | (ver git log) |
| 2 — Listado de canceladas | hecha | (ver git log) |

## Rulings


Revisión final: autorrevisión (sin herramienta de subagentes) sobre b090ff0 — Spec: THEN/AND cubiertos; Código: sin Critical ni Important; Arquitectura no (plan)
Ruling: actualizo los dos tests existentes de cancel.test.js para pasar `--motivo` válido — la spec manda (sin --motivo es error) — si me equivoco, se pierde la cobertura sin motivo, que la spec cubre con un test nuevo.
Ruling: valido el motivo antes de buscar la reserva — la spec dice que sin --motivo responde «motivo no válido» sin condicionar a la reserva — si me equivoco, `cancelar Sur mar` sin motivo diría «sin reserva» en vez de motivo no válido.
Task 2: Ruling: el test de `canceladas` depende del orden del fichero (la cancelación de Norte lun del primer test) — el estado es de módulo y no hay reset, y añadirlo sería código de producción solo para tests — si me equivoco, un test aislado (--test-name-pattern) de canceladas falla.
Final: minor (deferred): `--motivo` se lee por posición tras la opción; `cancelar --motivo otro Norte lun` (opciones antes de los posicionales) no está soportado y responde distinto — la spec no lo pide.
