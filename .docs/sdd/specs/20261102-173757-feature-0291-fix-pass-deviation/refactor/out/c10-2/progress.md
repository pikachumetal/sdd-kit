# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 5453a76..12d491c, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 12d491c..6d2f899, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: datos (booking.reason en src/app.js, campo en memoria que la spec ya declaraba) → no sale
Final: fixed reasonOf conserva los espacios del motivo — "cancelar con espacios alrededor del motivo" RED→GREEN, suite 7/7
Final: fixed el test de canceladas depende del orden — "canceladas enseña sala, día y motivo" RED→GREEN en solitario, suite 7/7
Final: Ruling: recortar el motivo no es una desviación — "sala ocupada " sigue siendo un motivo de la lista y ningún THEN ni AND cambia — si Laura lo quiere estricto, se revierte una línea y su test
Final: Ruling: añado el test de cancelar sin --motivo — el AND de la spec no tenía test y el eje Spec no lo señaló; pasó a la primera, así que no prueba un fallo — coste si sobra: un test
Final: desviación pendiente: separador ` - ` en canceladas (minor del eje Código) cambia la decisión 4 y un THEN; enmienda sin commitear en spec.md, código y test sin tocar, a la espera de aprobación
