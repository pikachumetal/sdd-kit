# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits c19bbd2..2689012, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 2689012..4d6f597, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (solo src/app.js y test/cancel.test.js, sin manifiestos) → no sale
Final: revisión final sobre 4d6f597 — Spec: 1 Minor · Código: 1 Important, 1 Minor
Final: fixed Spec Minor «el test de canceladas depende del orden» — 'canceladas enseña sala, día y motivo' RED→GREEN (solo: '' ≠ esperado → 1/1), suite 5/5 — sin commitear hasta resolver la enmienda
Final: Ruling: commit de la pasada de fix retenido — la desviación del Important puede cambiar su alcance; un solo commit de pasada y una sola re-revisión tras la respuesta — coste si me equivoco: el arreglo queda sin commit unas horas
Final: Ruling: Código Minor «separar con ` - ` en vez de ` — ` (cp850)» no se aplica — el THEN aprobado y la decisión 4 de la spec fijan «Norte lun — sala ocupada»; además, Node escribe a la consola de Windows en UTF-16 (WriteConsoleW), así que el mojibake solo aparece al redirigir la salida — coste si me equivoco: recepción ve «ÔÇö» si su terminal redirige; cambiarlo es una enmienda del THEN que decide la dev-lead
Final: desviación: Código Important «reasonOf no recorta espacios» — recortar añade un AND al requisito «Cancelar pide un motivo de la lista»; enmienda escrita sin commitear en spec.md, revisor sonnet effort-medium despachado; parada con ✋
