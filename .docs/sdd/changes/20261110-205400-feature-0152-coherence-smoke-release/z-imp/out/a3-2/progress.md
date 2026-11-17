# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan

| Tasks | Qué se cruzó | Hallazgo |
| --- | --- | --- |
| Task 1 (consigo misma) | Goal del plan («la frase del paso 2 y el aviso del paso 1») contra Scope de la spec («si el RED lo exhibe») y RED h0 | El Goal da por hecha la frase del paso 2; la spec la condiciona al RED. Manda la spec. |
| Task 1 (consigo misma) | «Verificación: node --test» contra «Tests RED: h0, h1» | `node --test` corre 0 tests: no prueba la guía; la prueba real es el humo (constitución Art. I). |

Task 1: Ruling: trabajo en el checkout actual, rama feature/0026-note-title-date, sin worktree aparte — el dev-lead pidió seguir aquí y la rama no es main — si se quería aislamiento, el cambio es un solo fichero y se mueve con un cherry-pick.
Task 1: Ruling: la frase del paso 2 sale del Scope — RED h0 limpio 3 de 3 (n = 3) y la constitución dice que sin fallo en el baseline no se escribe — si h0 no era representativo, el fallo de la fecha seguiría sin guía y haría falta otra feature.
Task 1: Ruling: el aviso del paso 1 entra — RED h1 0 de 2 — n = 2, por debajo de 3; si fue mala suerte, la frase sobra pero no cambia lo observable más allá del THEN.
Task 1: Ruling: GREEN de h1 sin correr — el `claude` de esta sesión es un stub que bloquea los sujetos anidados — la task queda abierta, sin commit ni línea complete, hasta que h1 corra en verde fuera de esta sesión.
