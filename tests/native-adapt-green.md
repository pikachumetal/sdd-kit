# Evidencia GREEN — Adaptar el kit a Native (task 0057, 2026-09-24)

GREEN de los escenarios de [`native-adapt-red.md`](native-adapt-red.md), sobre `feature/0057` con las Tasks 1–4 en `HEAD` (`75ba772`) y superpowers **6.4.1**. Mismo molde, mismos lanzadores y mismo techo común que el RED. Para el GREEN, `subject.sh` instala el hook en el commit base, y la línea `Ejecución` del plan del molde lleva la frase del cambio de método que dicta la plantilla (`GREEN=1`). Salidas en [`green/out/`](../.docs/sdd/specs/20260924-105352-task-0057-native-adapt/green/out/). Los ficheros con prefijo `t1-` son la primera tanda, previa al REFACTOR.

## Escenarios nuevos

| Escenario | Estado del molde | Petición | Qué mide |
| --- | --- | --- | --- |
| `n4c` | El de `n4`, sin compactación | Seguir con la Task 3 y parar al completarla | Control: sin compactación, sigue en Native |
| `c1` | El de `n2`, más la línea `Final review: sdd-kit:effort-high + opus — Ready` y dos `Final: minor (deferred)` en el ledger | `sdd-end-task` con la validación del dev-lead; parar antes del paso 10 | El paso 9 no lanza otra revisión; los minors llegan al walkthrough |
| `h1` | `free` ya existe en la base (sin el hueco de «libres» del molde de la 0055); spec aprobada | Paso 5: escribir el plan y seguir hasta ver fallar el RED de la Task 1 | Pendiente de la 0055: en `delegate` no se para por el método |

## Resultados por conducta

| Conducta | RED | GREEN, tanda 1 | Tras el REFACTOR |
| --- | --- | --- | --- |
| Native lleva el ledger (`task-start` / `task-done`) | 0/2 | **1/2**: `t1-n1-2` busca `task-start` en la copia del kit, no lo encuentra («los scripts no existen en esta copia del kit») y registra solo en `tasks.md` | **2/2** (`n1`) |
| La base se comprueba antes de cada task | 0/2 | **1/2**: `t1-n1-2` la comprueba una vez y dice que lo hizo «antes de cada task» | **2/2** (`merge-base HEAD develop` dos veces en cada stream) |
| El RED se aparta y se compara antes del commit | 0/2 | 2/2 (`git diff --no-index` o `diff -q` contra la copia) | 2/2 |
| Tras compactar, con dos o más tasks pendientes, lo que queda va con SDD | 0/2 | **0/2**: leen `plan.md` con la frase («Si retomas este plan tras una compactación…») y siguen en Native | **2/2** (`n4`): despachan implementador y revisor de la Task 3 con `sdd-kit:effort-medium` + `sonnet` sobre el mismo ledger |
| Control: sin compactación, sigue en Native | — | 1/1 (`t1-n4c-1`) | 1/1 (`n4c-1`) |
| El revisor final de Native va con Opus y `effort-high` | 0/2 | 2/2 (`n2`): `model: opus` | — |
| Sin el tipo `sdd-kit:effort-*`, se dice antes del despacho | 0/2 | 2/2 (`n2`): «el tipo `sdd-kit:effort-high` no está entre los agentes de la sesión. Despacho con `model: opus` y la frase de respaldo, y lo registro como ruling» | — |
| El paso 9 no repite la revisión final de Native | por texto | 2/2 (`c1`): «hubo revisión final… Consta en el ledger, así que no lancé otra» | — |
| Los «Deferred minors» llegan al walkthrough | por texto | 2/2 (`c1`): los dos minors en «Decisiones tomadas sin el dev-lead» (en `c1-1`, uno de ellos en residuales) | — |
| Mensaje del hito reescrito con un solo commit | 0/2 | 2/2 (`s1`): el cuerpo queda con tildes («Añade la validación…») | — |
| La apertura se junta antes de escribir los RED | 1/2 | **1/2**: `t1-s2-2` empieza por el paso 6, no lee `commit-milestones.md` y escribe el RED con la apertura en dos commits | **2/2** (`s2`) |
| En `delegate` no se para por el método (pendiente de la 0055) | 8/8 paraban por el hueco del molde | 2/2 (`h1`): los dos llegan al RED de la Task 1 con `Ejecución: native, porque…` y la frase del cambio de método | — |

## REFACTOR

Tres cambios de texto, con su RED en `tests/NativeAdapt.Tests.ps1` (`Describe 'Task 5 — REFACTOR del GREEN'` y aserciones actualizadas de las Tasks 1 y 4):

1. **Párrafo Native del paso 6**: dice que `scripts/task-start` y `scripts/task-done` «son de esa skill de superpowers, no del kit», y pasa de prosa a un orden de apertura («Cada task, también la segunda y las siguientes, se abre en este orden: `task-start`, la comprobación de la base…») y otro de cierre.
2. **Frase del cambio de método** (plantilla del plan): en imperativo y con la señal literal. «Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger.» Con la condicional abierta («Si retomas este plan…»), 0 de 2 sujetos se reconocieron como sesión retomada.
3. **Paso 6 en SDD**: «Después, con la apertura ya juntada en su commit, el hilo principal escribe los tests…». La regla estaba solo en el paso 5, y un sujeto que empieza en el paso 6 no la lee.

## Hallazgo sin guía (deuda)

Tras el cambio a SDD por compactación, los dos encargos de `n4` salen **sin la cabecera `## Restricciones de código`**: la sesión compactada no relee el paso 6, que es donde se exige. Es la familia de E12 (releer «De código» tras compactar). No entra en esta task y va a la deuda técnica con su disparador.

## Sujetos

| Sujeto | Coste | Sujeto | Coste | Sujeto | Coste |
| --- | --- | --- | --- | --- | --- |
| `t1-n1-1` | 0,51 $ | `t1-n1-2` | 0,44 $ | `t1-n4-1` | 0,22 $ |
| `t1-n4-2` | 0,23 $ | `t1-n4c-1` | 0,32 $ | `t1-s2-1` | 0,64 $ |
| `t1-s2-2` | 0,49 $ | `c1-1` | 0,44 $ | `c1-2` | 0,41 $ |
| `h1-1` | 0,62 $ | `h1-2` | 0,56 $ | `n2-1` | 0,64 $ |
| `n2-2` | 0,57 $ | `s1-1` | 0,24 $ | `s1-2` | 0,24 $ |
| `n1-1` | 0,52 $ | `n1-2` | 0,51 $ | `n4-1` | 0,55 $ |
| `n4-2` | 0,56 $ | `n4c-1` | 0,34 $ | `s2-1` | 0,37 $ |
| `s2-2` | 0,66 $ | | | | |

**Coste del GREEN**: 22 sujetos (15 de la tanda 1 y 7 del REFACTOR), 10,04 $. **Esta task**: 32 sujetos, 13,67 $, frente a una previsión de ~20 sujetos y ~30 $. **Acumulado de la campaña 0055–0058**: 19,50 $ de 65 $.
