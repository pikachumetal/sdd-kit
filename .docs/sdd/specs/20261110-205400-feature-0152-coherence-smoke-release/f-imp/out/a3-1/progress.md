# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan

| Ámbito | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares) | Tests RED (h0, h1) contra los dos cambios que produce, sobre un solo fichero | Coherente con el plan; h0 está condicionado en la spec («si el RED lo exhibe») y su RED salió limpio: ver Ruling 2 |
| Task 1 vs restricciones globales | Skill en inglés, interfaz en castellano | Sin conflicto |

Setup: ya en la rama feature/0026-note-title-date (no main), worktree único; baseline `node --test` → fail 0.
Base: `develop` sin cambios desde la merge-base a27bcb3; ni ROADMAP.md ni ficheros de la task.

Task 1: Ruling: la frase del paso 2 (h0) no se escribe — h0 salió 3 de 3 limpios a n = 3, y la spec la marca «Entra, si el RED lo exhibe»; la constitución (Art. I, 2.º) dice lo mismo — si fuera un falso limpio, los nombres seguirían sin fecha añadida igual que hoy y se reabriría con un RED que lo exhiba.
Task 1: Ruling: el aviso del paso 1 se escribe como condición explícita (título ausente o vacío = falta; preguntar, no inventar un nombre) — h1 falló 0 de 2: los sujetos inventaron `nota` y `sin-titulo` en vez de preguntar; la regla ya decía «ask… if the request lacks them» y no trataba «sin título» como falta — si la forma es floja, el humo GREEN lo mostrará.
Task 1: Ruling: el humo GREEN de h1 no se lanza en esta sesión — el `claude` del PATH es un stub que bloquea el claude anidado y no hay herramienta de subagentes; queda «no probado» hasta lanzarlo — si la guía no basta, la Task 1 necesita una ronda de REFACTOR tras el commit.
Task 1: Ruling: la Verificación `node --test` no cubre una skill de texto (0 tests) — se corre porque es la del plan; la prueba real es el humo — coste: un `pass` que no prueba la guía.
Task 1: complete (commits af1f4bd..c2e49cf, tests: node --test → ℹ duration_ms 11.5404)
Ruling: la revisión final por ejes no se despacha en esta sesión — no hay herramienta de subagentes ni claude headless; la rama queda sin revisión fresca hasta lanzarla — coste: sdd-archive no puede validar sin ella.
