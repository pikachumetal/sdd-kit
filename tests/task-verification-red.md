# RED — verificación por task (task 0006)

Baseline previo a la spec, con el kit de `develop` en `5bdc35c` (`sdd-start-task`, `plan-template.md` y `encargo-revision.md` sin cambios de esta task). Molde, lanzador y salidas en [`.docs/sdd/specs/20260923-102746-task-0006-task-verification/red/`](../.docs/sdd/specs/20260923-102746-task-0006-task-verification/red/).

## Escenario

Proyecto fullstack (Angular + .NET + SQL Server con moon) en `feature/0012` con una spec full aprobada: estado de la reserva en BD con migración, filtro en la API, selector en la lista (estados normal, con foco y deshabilitado, en tema claro y oscuro) y documentación de la API. La constitution dice «Todo verde al cerrar cada task: `moon run :test` y `moon run frontend:check`», que es la regla del caso de campo (ticket 0006a §4). `tech-stack.md` da las duraciones: `backend:test` con Testcontainers sobre SQL Server tarda entre 17 y 21 min; `frontend:test`, ~40 s. Petición de un turno: «Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec está aprobada. Escribe el plan.md y para ahí, sin implementar nada.»

## Sujetos

| Sujeto | Carga de skills | Coste | Válido |
| --- | --- | --- | --- |
| r1, r2 | `Unknown skill: sdd-kit:sdd-start-task`: el plugin del kit no cargó (`dependency-unsatisfied`, superpowers «no instalado») | 1,77 $ | no |
| r3, r4 | `sdd-kit:sdd-start-task`, `sdd-templates` y `superpowers:writing-plans` cargadas | 2,03 $ | sí |

r1 y r2 arrancaron en el mismo segundo. Con los mismos flags y en el mismo directorio, cuatro sondas lanzadas una a una cargaron superpowers y el kit; r3 y r4, lanzados con 30 s de separación, también. La causa probable es el arranque simultáneo, y el lanzador de esta campaña separa los sujetos. Sus planes no cuentan.

## Veredicto (r3, r4)

| Frente | r3 | r4 | Resultado |
| --- | --- | --- | --- |
| El gate completo no viaja como obligación de cada task | `plan.md:41`, «De código»: «Comandos que deben quedar en verde: `moon run :test`, `moon run frontend:check`»; `plan.md:56`: «en cada task» | `plan.md:37`, «De código»: `backend:test`, `frontend:test`, `frontend:check` y `:test` | falla 2/2 |
| La task de UI se mira en un navegador | Task 2 verifica con `frontend:check` y `frontend:test` (`plan.md:475-479`); el THEN de temas y estados queda a jsdom | Task 2 verifica con `frontend:test` y `frontend:check` (`plan.md:305`) | falla 2/2 |
| La suite de más de 10 min no la ejecuta el implementador | Task 1, Step de verificación: `moon run backend:test` (`plan.md:280`) | Task 1: `moon run backend:test` (`plan.md:192`) | falla 2/2 |

Ningún plan declara las superficies de cada task. La plantilla no tiene el campo y su ayuda de «De código» pide copiar «los comandos que el cambio tiene que dejar en verde»; como ese bloque viaja a cada implementador, el gate de cierre acaba ejecutándose en cada task. Superpowers suma lo mismo por su lado: `subagent-driven-development/implementer-prompt.md:48` (6.4.1) dice «run the full suite once before committing».

Los tres frentes entran en la spec. Ninguno va a deuda.

## RED del paso 6

Mismo baseline (`develop` en `5bdc35c`, sin las Tasks 2 y 3 de esta task). Molde `m6` = `red/m` + la spec aprobada de `red/f1` + un `plan.md`/`tasks.md` que ya usan los campos nuevos (`Superficies`, `Verificación`, `Verificación visual`, `Verificación lenta`, gate de cierre en §3 — ver Task 1 Step 1 del plan). Petición de un turno: «Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: […] Estás en el paso 6: ejecuta el plan» (E2) / «[…] la Task 1 está hecha y revisada; sigue con la Task 2 hasta cerrarla» (E3). Lanzador: `red/subject6.sh`.

### Sujetos

| Sujeto | Escenario | Resultado | Coste | Válido |
| --- | --- | --- | --- | --- |
| e2-1 | E2 | Despachó Task 1, la revisó, corrigió un Important (JSON del enum), despachó Task 2, la revisó (Approved) y llegó a la revisión final de rama (Critical: migración EF sin `[DbContext]`) antes de cortarse — el stream no cierra con un nodo `result`. | no capturado (corte a mitad) | sí, para las medidas de despacho — ambas ocurren mucho antes del corte |
| e2-2 | E2 | Bloqueado en el pre-flight scan: `Write` sobre `.superpowers/sdd/plan/progress.md` con la ruta POSIX que imprime `sdd-workspace` (`\tmp\claude\...`) deniega el permiso en modo headless (sin usuario que apruebe) y el sujeto no reintenta con ruta Windows. Nunca llega a despachar. | 1,82 $ | no — no hay encargo que medir |
| e3-1 | E3 | Despachó Task 2, la revisó (Approved) y cerró `tasks.md` como `done` | 1,65 $ | sí |
| e3-2 | E3 | Despachó Task 2, la revisó (Approved), y en la revisión final de rama corrigió el mismo Critical que e2-1 encontró (migración EF sin atributos), con su propio commit de fix | 3,42 $ | sí |

e2-2 es un fallo de infraestructura (ruta POSIX vs. Windows en escritura headless), no de la guidance del paso 6: no cuenta para las medidas de abajo, pero es un riesgo real fuera del scope de esta task — merece su propia fila en el roadmap, no un recorte aquí.

### Veredicto

| Medida | E2 (e2-1) | E3 (e3-1, e3-2) | Resultado |
| --- | --- | --- | --- |
| El encargo no lleva `:test` ni `backend:test` | — (no aplica a la medida E3, ver fila siguiente) | e3-1: solo `moon run frontend:test`/`frontend:check`; e3-2: solo `moon run frontend:check` (`frontend:test` como opcional) — ninguno menciona backend ni el gate completo | pasa 2/2 |
| El encargo dice que no ejecute `backend:test` ni la suite completa | `e2-1-task1-prompt.txt:45`: «la suite completa una vez antes de commitear» (texto por defecto de `implementer-prompt.md`, sin excepción para `backend:test`) | n/a (medida de E2) | falla 1/1 |
| El hilo lanza `moon run backend:test` con `run_in_background` mientras revisa | `e2-1.shim.log`: nunca se invoca `moon run backend:test`, ni en el shim ni en el stream — la Task 1 se cierra sin correr la verificación lenta | n/a | falla 1/1 |
| Tras la revisión, la task de UI se mira en un navegador o queda «no probado» en vez de «hecho» solo por la suite | n/a | Cero llamadas a herramientas de navegador (`chrome-devtools`, `playwright`) en `e3-1.jsonl`/`e3-2.jsonl`; cero menciones de «no probado»; ambos `tasks.md` cierran la Task 2 como `done` citando solo `frontend:test`/`frontend:check` | falla 2/2 |

El primer frente («el encargo no lleva `:test` ni `backend:test`») ya pasa sin cambios: el encargo actual del implementador ya nombra solo los comandos que el propio `plan.md` declara para esa task, aunque el paso 6 no tenga guidance explícita para ello — coincide con el riesgo «buena noticia» del plan (§1.7). La Task 3 recorta esa pieza del texto que iba a añadir a `encargo-revision.md`/`SKILL.md`; la Task 4 la repite como control.

Los otros tres frentes fallan y entran en la Task 3 tal como los describe el plan: la suite completa por defecto de `implementer-prompt.md` sigue sin excepción para `backend:test`, la verificación lenta no se lanza (ni en primer plano ni en segundo), y la Task 2 se cierra como hecha solo por la suite, sin navegador ni «no probado».

E2 solo tiene un sujeto válido (e2-2 bloqueado antes de despachar). Con e2-1 fallando limpio en las dos medidas que sí mide, no hace falta un segundo sujeto para decidir: ninguna de las dos pasa 2/2, así que ninguna se recorta. Repetir e2-2 no cambiaría esa decisión y consumiría presupuesto de la campaña (techo 18 $ para RED + GREEN); se deja así, con la incidencia anotada arriba.
