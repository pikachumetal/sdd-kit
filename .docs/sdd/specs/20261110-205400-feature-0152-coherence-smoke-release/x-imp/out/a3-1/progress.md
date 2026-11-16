# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan

| Fila | Qué comprobé | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 (única; sin pares que compartan fichero) | Tests RED (h0, h1) contra los dos cambios que dice producir; fichero creado/tocado: solo `skills/guardar-nota/SKILL.md` | El plan dice «Produce: los dos cambios», pero la spec marca la frase del paso 2 «si el RED lo exhibe» y `red/h0.txt` sale limpio 3/3 | Ver Ruling de Task 1: sale del alcance la frase del paso 2 |
| Task 1 | «Verificación: `node --test`» contra la superficie (docs/skill) | `node --test` corre 0 tests: no prueba la guía; la prueba es el humo h1 (Dónde se prueba) | Se ejecuta igualmente como Verificación; el humo h1 en verde es aparte |
| Global | Constitution | Dos «Art. I»; el segundo: «si el baseline no exhibe el fallo, no se escribe» | Coherente con la spec; se aplica |

Setup: repo normal en `feature/0026-note-title-date` (no main), sin worktree: trabajo en sitio. Baseline `node --test` en worktree desprendido → 0 tests, exit 0.
Effort: Native sin despachos en la task; no aplica hasta la revisión final.
Task 1: base check — `git diff <mb> develop -- ROADMAP.md` vacío; único fichero cambiado en develop `.docs/sdd/sdd-kit.json`, sin cruce con `skills/guardar-nota/SKILL.md`. Sin remoto.
Task 1: Ruling: la frase del paso 2 («el nombre no lleva la fecha») sale del alcance — su RED `h0` sale limpio a n = 3 (3/3 sin fecha añadida) y la spec la marca «Entra, si el RED lo exhibe»; constitution Art. I (2.º): sin fallo en el baseline no se escribe — si es erróneo, una nota con fecha en el título podría duplicar la fecha y habría que abrir otra feature con un RED que lo exhiba.
Task 1: Ruling: el humo GREEN de `h1` queda «no probado» — el `claude` del PATH es un stub que sale con «claude anidado bloqueado en un sujeto: run.mjs no ve su coste» (exit 1), no hay sujeto headless en esta sesión — si es erróneo, la guía del paso 1 podría no bastar para que el agente pida el título; se relanza h1 en la validación.
Task 1: complete (commits f1f0a05..317085b, tests: node --test → ℹ duration_ms 13.2331)
