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
