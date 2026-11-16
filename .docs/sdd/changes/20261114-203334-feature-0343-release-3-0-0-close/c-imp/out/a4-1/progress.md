# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan

| Fila | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares que compartan fichero) | Tests RED (h0, h1) contra los cambios que pide (frase del paso 2, aviso del paso 1) y el fichero que toca (`skills/guardar-nota/SKILL.md`) | h1: RED 0 de 2, exhibe el fallo. h0: RED 1 de 1 limpio: el baseline no exhibe el fallo, n = 1 < 3. |
| Task 1 vs constitución Art. I | «si el baseline no exhibe el fallo, no se escribe» | La frase del paso 2 no se puede escribir con h0 limpio. Sacarla del Scope por ruling exige h0 limpio a n = 3 (`sdd-implement`). |
| Task 1 «Verificación» | `node --test` vs Art. I (humo con sujeto headless) | El GREEN de la task es un humo; en esta sesión el `claude` del PATH bloquea sujetos anidados («claude anidado bloqueado en un sujeto»): no puedo lanzar h0-2, h0-3 ni el GREEN de h1. |

Base: `develop` sin cambios desde la merge base 1ad3ff9 (ROADMAP.md ni ficheros de la task); sin remoto.
Copia RED fuera del repo: ../red-copy-0026/h0.txt, h1.txt.
Task 1: Ruling: parada — h0 limpio a n = 1 y sin sujetos headless en esta sesión: ni se escribe la frase del paso 2 (Art. I) ni sale del Scope por ruling (exige n = 3); parada ✋ para que se lancen h0-2 y h0-3 en baseline y el GREEN de h1 — si me equivoco, la task se retrasa una sesión.
Task 1: Ruling: aviso del paso 1 escrito sin commit (h1 RED 0 de 2 lo exhibe), a la espera de su GREEN — si me equivoco, se descarta con git restore
