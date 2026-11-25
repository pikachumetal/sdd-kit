# SDD ledger — plan: .docs/sdd/changes/20261020-100000-feature-0037-note-tags-smoke/plan.md
Pre-flight scan: 1 task, 1 fichero (`skills/guardar-nota/SKILL.md`); sin pares de tasks; el texto de la Task 1 concuerda consigo mismo (paso 4 ↔ humos h1-h3).
Task 1: Ruling: retomada sin ledger — el paso 4 ya estaba escrito sin commitear y h1, h2 en verde (green/h1.txt, green/h2.txt, coste.md); sigo desde el Step 2 con h3.
Task 1: Ruling: base sin cambios — `git diff --name-only $(git merge-base HEAD develop) develop` vacío; sin remoto.
Task 1: Ruling: fin de línea — la copia de trabajo de SKILL.md había pasado a LF y el fichero versionado es CRLF; restaurado a CRLF para que el commit solo añada la línea del paso 4.
Task 1: Ruling: h1 y h2 no se relanzan — ya en verde en esta task con su green/<id>.txt; la Verificación lanza solo h3 para no gastar dos tandas más. h3 corrido completo, sin recortar las diez notas.
Task 1: complete (commits a75cafa..5f98b91, tests: env SCENARIOS=h3 node scripts/humo.mjs → h3: verde)
