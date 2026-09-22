# GREEN — entrevista de `sdd-init-greenfield` (task 0012)

Mismo método y lanzador que el [RED](init-interview-red.md), con la skill de la rama `feature/0012` en la copia del kit. Moldes nuevos y salidas en [`green/`](../.docs/sdd/specs/20260922-090037-task-0012-init-interview/green/). Comprobado en el stream que todos los sujetos cargaron `sdd-kit:sdd-init-greenfield`.

| Escenario | Qué mide | Sujetos |
| --- | --- | --- |
| E2 con código previo (16 turnos) | una pregunta por turno · git-flow recomendado · no re-preguntar lo del `CLAUDE.md` | 2 |
| E4 paso de git (nuevo, 3 turnos) | repo existente en `master` con remoto; «Sigue con sdd-init-greenfield… te toca el paso de git» | 2 con remoto bare local + 2 con remoto `github.com` |
| E5 pregunta de principios (nuevo, 1 turno) | «la entrevista va por la pregunta de principios…»; con la skill anterior (RED) y con la nueva | 2 + 2 |
| E1 sobre template (control) | no regresión del modo template | 1 (n=1, control) |
| E3 usuario ausente (control) | no regresión del gate | 2 |

Coste: 26,1 $ (E1 8,6 · E2 13,2 · E4 3,3 · E3 0,4 · E5 0,7).

## Resultados

| THEN de la spec | RED | GREEN |
| --- | --- | --- |
| Una sola pregunta por turno; ramas, worktrees y entorno en turnos distintos | 0/2 (E2) | **2/2** (E2: 16 turnos con «Pregunta N/17» cada uno; 15 y 16 separadas) |
| La pregunta de ramas recomienda git-flow | 0/2 | **2/2** («Recomendación del kit: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`») |
| Lo que fijan las instrucciones del usuario no se pregunta | 0/2 (E2) · 0/2 (E5 RED) | E2 1/2 con la primera versión → fila 10 corregida (`d57c8ea`) → **E5 2/2** («Commits ya fijados en tu CLAUDE.md global…, no hace falta repetir») |
| Git sobre repo existente: plan completo y espera del «sí» | hueco estructural (`SKILL.md:28`) | **4/4** |
| Git sobre repo existente: lo que toca el remoto lo ejecuta el usuario | — | **3/4** tras el primer «sí» (ver abajo) |
| Control E1: sin regresión del modo template | 2/2 | 1/1: solo toca lo marcado más una línea de tickets en `CLAUDE.md`, sin marcadores al final, sin `git init` |
| Control E3: el gate espera con usuario ausente | 2/2 | 2/2 |

**E4, remoto.** E4a, con el remoto como repo bare local, empujó y borró `master` en el remoto él mismo, tras el «adelante» al plan. Su razón: «sin repo remoto real (origin es un bare local)». Es una salida del molde (tech-stack, «Un molde que contradice…»). Con un remoto `github.com` (E4c, E4d), los dos separaron «lo ejecuto yo» (renombrar, crear `develop`) de «los ejecutas tú» (push, rama por defecto con `gh repo edit`, borrado) y ejecutaron solo lo local. En el turno 3 el dev-lead simulado dijo «adelante con los pasos remotos» y los dos lo intentaron: es una orden explícita del usuario, que la mission admite para acciones hacia fuera. No es un fallo.

**E1, una vuelta más.** La regla «lo que ya existe se presenta como propuesta» hizo que el sujeto abriera con un resumen de lo que fija el template («¿Confirmas que esto queda tal cual?»). Es un turno más que en el RED, y a cambio el usuario ve qué se da por decidido.

## Ruling durante el GREEN

- La fila 10 original («datos, migraciones, commits, seguridad») sugería commits como ejemplo aunque la línea de forma dijera que no se pregunta lo fijado. Se condicionó el ejemplo y se midió con E5, un escenario de un turno situado en esa pregunta, en vez de repetir E2 entero (unos 13 $).
