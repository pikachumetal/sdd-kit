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

## Task 4 — `sdd-debugging`

| Escenario | Qué mide | Resultado |
| --- | --- | --- |
| `d1`, ronda 0 (fork sin la regla del orden) | Un patch de fallo determinista desde `sdd-propose` hasta `sdd-debugging` | Invoca `sdd-kit:sdd-debugging` **3/3** (RED 0/2) y escribe el test en rojo antes del arreglo 3/3, pero §2 de `patch.md` llega **después** del arreglo 0/3 (RED 1/2). Salidas en `green-r0/out/d1-a`, `-b`, `-c` |
| `d1`, ronda 1 («In a patch, write the result of this phase in §2 of `patch.md` … before Phase 4», en la fase 1) | El orden | 1/2 (`green-r0/out/d1-d`, `-e`): igual que el RED |
| `d1`, ronda 2 (la comprobación a la entrada de la fase 4: «In a patch, Phase 4 starts with §2 of `patch.md` already written. If it isn't, stop and write it first.») | El orden | **2/2**: los dos escriben §2 con la causa (`findBooking` no compara `day`) antes de editar `src/app.js`, con el test en rojo antes del arreglo |
| `f1` (humo de `sdd-explore`) | «¿Por qué si cancelo la reserva de Norte del lunes, libres 10:00-12:00 sigue sin darme Norte?» | Limpio: explica la causa leyendo el código (`cancelar` no toca `bookings`), no edita nada ni invoca `superpowers:systematic-debugging`, y ofrece apuntar el arreglo como patch en el roadmap |

Coste de la Task 4: ~3,20 $ en 9 sujetos (RED incluido).

## Pasada de fix de la revisión final

| Escenario | Qué mide | Resultado |
| --- | --- | --- |
| `t1c` (encargo A con «If it already passes, stop: report DONE_WITH_CONCERNS with the green output; don't implement») | Un RED recibido que ya pasa sin código (revisión final, Important 1) | **2/2**: los dos ejecutan el RED, lo ven en verde (2/2), no tocan `src/` y devuelven `DONE_WITH_CONCERNS` diciendo que el fichero no prueba `informe` |
| `f1` con la `description` nueva («or fixing a failure (sdd-propose)») | Que la pregunta por un fallo siga entrando por `sdd-explore` y no arregle nada | Limpio: explica la causa, no edita nada y ofrece apuntar el arreglo con `sdd-roadmap`. La tanda anterior, en `green-r0/out/f1-a` |

Coste de la pasada: ~0,35 $ en 3 sujetos. Total de la feature: 7,38 $ en 27 sujetos, frente a ~35 $ previstos.

## A/B de presión del recorte (adenda del 2026-10-11)

El dev-lead no dio la feature por acabada sin medir lo quitado. A: los forks delgados. B: los forks con todo lo quitado devuelto (racionalizaciones, red flags, ejemplos, checklist, «When Stuck»; en depuración, «Use this ESPECIALLY when», señales del usuario, racionalizaciones y quick reference). n = 2 por versión, Sonnet; salidas en `ab-a/out/` y `ab-b/out/` de la carpeta de la spec.

| Escenario | A (delgado) | B (entero) |
| --- | --- | --- |
| `p1`: prisa en Native («urgente, ya lo probé a mano») | 2/2 escriben y ejecutan el RED antes de tocar `src/app.js` | 2/2, igual |
| `p2`: `horas` ya escrito sin test, «me costó dos horas» | 2/2 descartan el código (`git checkout -- src/app.js`) y empiezan por el test | 2/2, igual (uno guarda el diff aparte antes de descartarlo) |
| `p3`: patch urgente con la hipótesis «busca desde el final» | 2/2 rechazan la hipótesis y nombran la causa (`findBooking` no compara el día) | 2/2, igual |

Las dos versiones salen limpias: con n = 2 y este molde, el A/B no distingue. `p3` se resuelve ya en la clasificación de `sdd-propose`, antes de llegar a `sdd-debugging`, así que no mide la skill. La decisión no depende de este A/B: el dev-lead fijó que un fork conserva el texto de su fuente salvo prueba de que funciona sin él ([ADR 0013](../.docs/sdd/decisions/0013-fork-keeps-source-text.md)), y el texto vuelve. Coste: 2,97 $ en 12 sujetos.
