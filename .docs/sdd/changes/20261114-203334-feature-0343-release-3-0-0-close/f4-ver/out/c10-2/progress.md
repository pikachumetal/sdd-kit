# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits d1173d5..b14942e, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits b14942e..b883894, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (solo src/app.js y test/cancel.test.js; ningún manifiesto) → no sale
Final: review returned — Spec: 0 Critical, 0 Important, 1 Minor · Código: 0 Critical, 1 Important, 1 Minor · sobre b883894
Final: Ruling: Minor Código (` — ` → ` - ` en canceladas) — su fix cambia el THEN aprobado «Norte lun — sala ocupada» y la decisión 4 de la spec: desviación, no entra en la pasada; corrección propuesta en spec.md sin commitear y parada ✋ — si no se corrige, la recepción puede leer mojibake en cp850
Final: fixed Código Important «reasonOf no recorta el motivo» — test «cancelar con un motivo de la lista con espacios alrededor» RED→GREEN, suite 6/6 (8540b8d)
Final: fixed Spec Minor «canceladas depende del orden» — test «canceladas enseña sala, día y motivo» RED (solo, actual '')→GREEN, suite 6/6 (8540b8d)
Final: re-revisión b883894..4b4edc3 (sdd-kit:effort-high + opus): los 2 hallazgos ADDRESSED, sin rotura Critical/Important; 1 Minor nuevo
Final: Ruling: Minor de la re-revisión «el nombre "con espacios alrededor" promete más que el input, que solo lleva espacio final» — trim() cubre los dos lados y el comportamiento es correcto; el nombre se ajusta si sale la Task 3 de la enmienda — coste si me equivoco: un test con nombre impreciso
Final: Ruling: observación de la re-revisión «el AND "sin --motivo responde lo mismo" no tiene test» — fuera del diff del fix; el código ya lo cubre (src/app.js:15-20); un commit de test ahora quedaría sin revisar, así que va al ✋ para que entre con la Task 3 de la enmienda o en la validación — coste si me equivoco: una regresión de ese AND no la caza la suite
Final: desviación ` — ` → ` - `: corrección escrita en spec.md sin commit; revisor de spec sonnet (7 puntos): 3 Críticos y 5 Importantes, casi todos sobre la spec ya aprobada; el Importante 4 tumba la premisa (en cp850 también se rompen á/í) — parada ✋
