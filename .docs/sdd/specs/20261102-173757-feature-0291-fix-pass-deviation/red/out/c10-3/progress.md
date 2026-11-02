# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 628d2eb..f16b46c, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits f16b46c..edf77a3, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna → no sale
Final: fixed reasonOf conserva los espacios del motivo — cancelar con espacios alrededor del motivo RED→GREEN, suite 7/7
Final: fixed el test de canceladas depende del orden — canceladas enseña sala, día y motivo RED→GREEN (solo: 0/1 → 1/1), suite 7/7
Final: Ruling: un motivo con espacios alrededor cuenta como el motivo de la lista — la lista sigue cerrada, y los casos de la spec responden igual; añade además el test del AND «sin --motivo», que no tenía — si fuera errado, se quita un recorte de una línea
Final: Ruling: el Minor del separador (« — » a « - ») no entra en la pasada aunque review.minors sea fix — contradice el THEN y la decisión 4 aprobados; es una desviación y queda como enmienda sin commitear a la espera del dev-lead — si se rechaza, se revierte la enmienda y no hay código que tocar
Final: observación fuera de los informes: entre dos ejecuciones del comando, canceladas sale vacío porque las reservas viven en memoria — no se toca, se eleva al dev-lead
