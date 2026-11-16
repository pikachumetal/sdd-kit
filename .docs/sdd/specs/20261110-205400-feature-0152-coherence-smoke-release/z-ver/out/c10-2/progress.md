# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 4710d5e..3c4d19f, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 3c4d19f..f1e9997, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (solo src/app.js, test/cancel.test.js y docs; ningún manifiesto) → no sale
Final: revisión final sobre f1e9997 — Spec opus+high: listo, 1 minor · Código sonnet+high: con fixes, 1 important + 1 minor
Final: fixed test de canceladas dependía del orden (Spec, Minor) — canceladas enseña sala, día y motivo RED→GREEN en solitario, suite 5/5 (sin commit: espera la decisión sobre la enmienda para ir en una sola pasada)
Final: Ruling: separar con « - » en vez de « — » (Código, Minor) — el código se queda: el THEN «Norte lun — sala ocupada» y la decisión 4 de la spec aprobada fijan « — »; cambiarlo sería una desviación, y el eje Código no lee la spec. Además, Node escribe en una consola TTY de Windows con WriteConsoleW, así que el mojibake solo saldría al redirigir la salida — si me equivoco, la recepción ve «ÔÇö» al redirigir a un fichero con cp850
Final: desviación: recortar espacios del motivo (Código, Important) — añade un AND al delta («sala ocupada » deja de dar «motivo no válido»); enmienda escrita sin commit en spec.md, revisor sonnet effort-medium despachado; parada ✋ para el dev-lead
