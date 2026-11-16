# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan
| Fila | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (única) | Tests RED (h0, h1) contra los dos cambios que produce; fichero que crea/toca: solo skills/guardar-nota/SKILL.md | Coherente. Sin pares de tasks. Review Focus: ninguna. |

Task 1: Ruling: copia de los RED fuera del repo en /tmp/tmp.XeHUqGFnmt/red-0026 — es la prueba de que no se ajustaron al código — si falta, no hay contraste RED/GREEN.
Task 1: Ruling: la frase del paso 2 («el nombre no lleva la fecha») sale del alcance — su Scope es «si el RED lo exhibe» y h0 da 3 de 3 limpios (n = 3); la constitución (Art. I, 2.º) dice que sin fallo en el baseline no se escribe — si fuera mal, un sujeto añadiría la fecha al nombre y haría falta una feature nueva con un RED que lo exhiba.
Task 1: Ruling: h1 corrió con n = 2, no 3 — 0 de 2 ya exhibe el fallo; el GREEN corre con n = 3 — si fuera mal, el RED subestimaría la tasa de fallo, no la invertiría.
Task 1: Ruling: el aviso del paso 1 va en la misma línea del paso, sin AND nuevo — solo concreta el THEN «el agente pide el título» con los dos nombres inventados que exhibió h1 — si fuera mal, el revisor final lo lee como guidance de más.
Task 1: BLOQUEO: el humo GREEN de h1 no corre en esta sesión — el `claude` del PATH es un stub que bloquea sujetos anidados; sin GREEN la task no cumple el contrato ni la constitución (Art. I) — cambio sin commit, task sin `complete`.
