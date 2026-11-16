# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 0e1ee78..bd9dea1, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits bd9dea1..5b3008b, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo nuevo, sin manifiesto tocado, sin contrato entre módulos, sin datos persistentes) → no sale
Final: review returned — Spec opus+high: Ready (1 Minor) · Código sonnet+high: With fixes (1 Important, 1 Minor) · sobre 5b3008b
Final: fixed Spec Minor «canceladas depende del orden de las pruebas» — `canceladas enseña sala, día y motivo` aislada RED→GREEN, suite 5/5 (sin commit: la pasada de fix espera a la enmienda)
Final: desviación — Código Important «reasonOf no recorta el motivo» (reproducido: `--motivo "sala ocupada "` → «motivo no válido…»): recortarlo cambia la salida de un AND aprobado → enmienda escrita en spec.md, pendiente de aprobar; parada ✋
Final: Ruling: Código Minor «la raya ` — ` de canceladas se rompe en consola cp850» — no se cambia: el separador es la Decisión 4 y el THEN aprobado («Norte lun — sala ocupada»); además, si la salida UTF-8 se leyera como cp850 se romperían igual las tildes de toda la interfaz («válido»), así que ` - ` no arreglaría la consola de recepción — si recepción ve caracteres rotos, toda la interfaz sale mal y cambiar la Decisión 4 sería una enmienda del dev-lead
Final: revisor de la enmienda (sonnet + effort-medium, 7 puntos) devuelto: 2 Críticos, 6 Importantes, 2 Menores — presentados en el ✋; parada a la espera de la aprobación del dev-lead
