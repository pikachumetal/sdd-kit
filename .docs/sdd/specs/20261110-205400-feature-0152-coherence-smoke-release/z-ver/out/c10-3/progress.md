# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits fc2fcf1..4944ad9, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 4944ad9..57d8fed, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (src/app.js, test/cancel.test.js, docs de la spec; ningún manifiesto) → no sale (registrado al volver los ejes, no antes del despacho)
Final: Spec — Minor reproducido: `node --test --test-name-pattern=canceladas` → fail 1 (actual '') — entra en la pasada de fix (review.minors: fix)
Final: Código — Important reproducido: `cancelar Norte lun --motivo "sala ocupada "` → «motivo no válido…» — aceptarlo añade un AND a la spec: desviación, parada ✋
Final: Código — Minor (` — ` en cp850): cambiarlo cambia el THEN «Norte lun — sala ocupada» y la decisión 4 de la spec: desviación, parada ✋
Final: pasada de fix aplazada hasta la respuesta del dev-lead, para que sea UNA sola pasada con los tres hallazgos
Final: Ruling: Código Minor «el ` — ` de canceladas se rompe en consola cp850 de recepción» — no se cambia: PRODUCT.md dice un solo usuario en su propio servidor (no hay recepción), Node escribe Unicode en la consola de Windows, y el ` — ` es la decisión 4 y el THEN aprobados; cambiarlo sería desviación sin causa — coste si me equivoco: el listado se lee `ÔÇö` al redirigirlo a algo que lee cp850, arreglo de una línea
Final: revisor de la enmienda (sonnet+medium): 8 hallazgos; aceptado el 4 (regla de recorte: ambos lados, solo espacios inválido, forma guardada); el 2 y el 8 retiran la parte del separador; 1 y 3 son de forma (la enmienda va marcada sin aprobar a propósito); 5, 6 y 7 tocan la spec ya aprobada, no la enmienda: se le cuentan al dev-lead
