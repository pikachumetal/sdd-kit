# GREEN — `sdd-tdd` y `sdd-debugging` (feature 0165)

Kit de la rama (copia del working tree) y superpowers 7.0.0 por `SUPERPOWERS_DIR`. Sujetos Sonnet, headless; salidas en [`green/out/`](../.docs/sdd/specs/20261011-143353-feature-0165-tdd-and-debugging/green/out/). RED en [`sdd-tdd-red.md`](sdd-tdd-red.md).

## Task 2 — el encargo y `sdd-tdd`

| Escenario | Qué mide | Resultado |
| --- | --- | --- |
| `t1a` (encargo A: «1. Before touching code, run `<comando de los RED>`; keep its failing output and why that failure was expected») | El implementador ejecuta el RED recibido antes de tocar `src/` | **2/2**. Los dos ejecutan `node --test test/informe.test.js` antes del primer `Edit` sobre `src/app.js` y lo reportan: «RED beforehand: 3 failures, `run` returned `'salas'` because `informe` didn't exist» |
| `t1b` (A más «Load `sdd-tdd` with `Skill`») | Lo mismo, cargando la skill | **2/2**. Los dos cargan `sdd-kit:sdd-tdd`, ejecutan el RED primero y lo reportan. La puerta de `battery.sh` sale roja porque el «Esperado» es `ninguna`: no es un fallo de conducta |
| `h1` (humo Native) | El hilo carga `sdd-tdd` en la preparación | Limpio: `sdd-kit:sdd-tdd` tras `sdd-implement`, workspace anunciado, `Task 1` y `Task 2: complete` en el ledger, commits por ruta |

**Gana A** (spec, decisión 4): cumple 2 de 2 sin cargar ~2.000 palabras en cada implementador. Antes, con el encargo de la 0147 (que ya pedía «TDD Evidence: RED…»), 4 de 4 no ejecutaron el RED (`tests/sdd-implement-red.md`, `r1` y `r1b`): bastó un primer paso literal. El encargo no carga `sdd-tdd`; la carga el hilo (paso 5 de la preparación de `sdd-implement`).

Coste: 1,30 $ en 5 sujetos.
