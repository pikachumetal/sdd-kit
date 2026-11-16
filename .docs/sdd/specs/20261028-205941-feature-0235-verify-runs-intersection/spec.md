---
id: 20261028-205941-feature-0235-verify-runs-intersection
feature: 0235
proposal: 0234
title: sdd merge --verify corre solo lo que se cruza y sin shell
mode: full
profile: delegate
status: approved
created: 2026-10-28
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-28
---

# Spec — `sdd merge --verify` corre solo lo que se cruza y sin shell

🦆 Hoy, al fusionar, `sdd merge --verify` vuelve a correr el gate entero: en el merge, en cada reintento de push y otra vez sobre la base si sale en rojo. Con esta feature, si el gate filtra por una base (`moon run :test --affected --base develop`), corre solo las tareas que tocan la rama y la base a la vez. Una rama que toca `apps/frontend/` sobre una base que trajo un cambio en `apps/backend/` no corre nada y escribe `verificación: frontend:test: saltada (la base no toca sus inputs)`. Además, el gate se lanza sin `pwsh` ni `sh`: un gate con `&&` se rechaza y se convierte en una tarea de moon o en un script de `package.json`. La migración a la 3.0.0 avisa a los proyectos que tengan un gate así.

## Capacidades

- Modificadas: `control-profiles` — la verificación del merge (lo que corre en el merge, en el reintento de push y en el contraste de un rojo, y cómo se lanza)
- Modificadas: `migration` — la migración a v3.0.0 avisa de un gate que encadena comandos

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (`--verify` cambia el valor que admite y su salida), MODIFIED (tres requisitos de `control-profiles`), dependencia externa (la CLI pasa a consultar `moon query`), área no explorada (`hotfix.ts` y las fixtures de `cli/test/merge/` solo leídas en parte) · tamaño: ~400 líneas en 8 ficheros
- Dominio: si el MODIFIED de «La suite no se repite si desde el commit verificado solo cambian docs» y el de «El push del cierre reintenta» siguen cubriendo la rama que nadie validó (sin `--verified-at`), y si «saltada (solo la toca la base)» es correcto según la regla de la propuesta 0234 (señal: MODIFIED)
- Técnica: si cruzar por tareas con dos `moon query` es fiable con `--include-relations` y con targets `:tarea`, y si lanzar sin shell rompe los gates `.cmd` de Windows (`npm`, `pnpm` sin proto) (señal: dependencia externa + contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja la lente técnica sin un revisor dedicado, justo donde está el riesgo de moon y de Windows

1. **El cruce lo calcula moon, y solo para un gate `moon run … --affected`** — la CLI busca en los argumentos del gate el par `moon run`, también dentro de un envoltorio como `sdd lock run -- moon run …`. Si lleva `--affected`, pide a moon dos listas con `moon query tasks --affected`, en el worktree del merge, con `MOON_BASE` y `MOON_HEAD` en el entorno. Son el mismo rastreador de lo afectado que usa `moon run`; comprobado con moon 2.6.0: `MOON_BASE=HEAD` da `"tasks": {}`. **La rama**: de `git merge-base <destino antes del merge> <rama>` a la punta de la rama. **La base**: del commit verificado al resultado del merge (`HEAD`), que también incluye los commits de la rama posteriores al verificado. Después corre el gate con los targets de la intersección en lugar de los declarados, con `--affected` y con `--base <commit verificado>`: moon sigue filtrando las dependencias (`deps`) como hoy. Un gate que filtra con otra herramienta (`nx affected --base`) corre como está declarado. Por qué: `--affected --base <ref>` es la sintaxis de moon, la que usan este repo y la propuesta; con nx no hay ningún proyecto ni ticket.
2. **Cómo se cruzan los targets** — de la salida de `moon query tasks` se leen las claves `tasks.<proyecto>.<tarea>` como `proyecto:tarea`. Un target `proyecto:tarea` del gate casa consigo mismo, y uno `:tarea`, con esa tarea en cualquier proyecto. La intersección es de targets, no de proyectos.
3. **Las opciones de moon del gate**: `--base`/`--base=<ref>` se sustituye por el commit verificado (o por el merge-base sin él), y la CLI manda sobre el `--base` declarado. `--head` se quita, porque el head es siempre el resultado del merge. `-g`/`--include-relations` se conserva y además pone `MOON_INCLUDE_RELATIONS=true` en las dos consultas. El resto se conserva tal cual. Con `--stdin`, `--status`, `--force` o un target que no es `proyecto:tarea` ni `:tarea` (`#tag:tarea`, `~:tarea`, `^:tarea`), no hay cruce: el gate corre con `--base <merge-base>` y la salida dice `verificación: sin cruce: '<opción o target>' no admitido; corre lo que toca la rama`. shortcut: lo amplía el primer proyecto que lo use.
4. **Sin `--verified-at`**: la primera pasada no cruza y corre los targets de la rama con `--base <merge-base>`. El commit que verifica es el resultado del merge, y en cada reintento de push la base se cruza desde él, como hoy (`publish` toma `HEAD` antes de integrar).
5. **En cada pasada se vuelve a calcular el cruce**, sin caché: el merge, cada reintento y el contraste. `onlyDocsSince` sigue delante: si solo cambiaron docs, no se consulta a moon. Con un fichero resuelto por Mergiraf, el cruce ya lo cubre, porque ese fichero lo tocaron los dos lados.
6. **Si `moon query` falla** (moon ausente, sin workspace, JSON que no se entiende), el gate corre con `--base <merge-base>` y la salida dice `verificación: sin cruce: moon query falló (<primera línea del error>); corre lo que toca la rama`. Así corre de más, nunca de menos.
7. **Literales de la salida**, uno por tarea del gate que selecciona alguna de las dos listas: `verificación: <tarea>: saltada (la base no toca sus inputs)` si solo la toca la rama, y `verificación: <tarea>: saltada (solo la toca la base)` si solo la toca la base. Son los dos motivos de `merge-recipe.md:11` («The suite again»). Antes de correr, `verificación: corre <tarea> <tarea> (las tocan la rama y la base)`. Una tarea que no toca ninguna de las dos no sale.
8. **El contraste de un rojo** corre sobre el commit de antes del merge los targets que corrió la pasada roja, como lista explícita y sin `--affected` (sobre la base, `--affected` elegiría otras tareas). Sin cruce (decisiones 3 y 6), corre el gate sin `--affected`.
9. **Hotfix**: la misma regla en la ida a la rama estable y en la vuelta a la de integración. El merge-base es el de cada destino antes del merge con la rama del hotfix; los dos merges fusionan esa rama (`hotfix.ts`, `mergeStable` y `mergeBack`).
10. **Sin shell**: el valor de `--verify` se parte en argumentos por espacios, y las comillas dobles o simples agrupan (sin escapes). El programa se resuelve con el `PATH` y el `PATHEXT` mediante el lanzador que ya usa `sdd lock run` (`cli/src/tasks/command.ts`). Un `.cmd` o un `.bat` de Windows (el `npm.cmd` de node) se lanza con el `cmd.exe` de `ComSpec`, no del `PATH`, como ya hace ese lanzador: es el único caso con intérprete, porque Node no lanza un `.cmd` sin él. shortcut: en un `.cmd`, `cmd.exe` sigue expandiendo `%VAR%` aunque vaya entre comillas; se cambia si un gate lo necesita literal. Las tareas de moon siguen con el shell que declare el proyecto (`windowsShell`): eso es de moon, no de `--verify`.
11. **Lo que se rechaza y lo que pasa literal**: `&&`, `||`, `;`, `|`, `>` y `<` fuera de comillas, también pegados a una palabra (`2>&1`), salen con 2, antes de coger el cerrojo, con `--verify: el gate encadena comandos con '<operador>'; hazlo una tarea de moon o un script de package.json`. `$VAR`, `%VAR%`, `~` y los globs llegan literales al programa: sin shell no hay expansión, y la migración avisa de ellos.
12. **Programa que no existe** → `verificación: no se encuentra '<programa>' en el PATH`, en lugar de `código de salida 127`.
13. **La migración avisa y no cambia nada**: un paso 9 de `v3.0.0.md`, sin gate. Lee en `.docs/sdd/steering/operations.md` §Testing la línea «Gate de merge», y «Gate de cierre» si no hay «Gate de merge» (con una sola suite, `--verify` es esa). Si el paso 2 quedó pendiente, lee la del `tech-stack.md` de la 2.x. Si la línea lleva un operador de la decisión 11, el informe dice `Gate que encadena comandos: «<línea>» — sdd merge --verify ya no lo admite; hazlo una tarea de moon o un script de package.json`. Si lleva `$`, `%…%` o `~`, el informe dice `Gate con variables: «<línea>» — sdd merge --verify no las expande; ponlas en la tarea de moon o en el script`. No reescribe el gate: elegir la tarea es del proyecto. «Lo afectado» no se lee, porque no se pasa a `--verify`.
14. **Las fixtures de `cli/test/merge/`** dejan los gates de PowerShell y de `sh` (`publishFromSeed`, `sleepCommand`, `failsIfExists`, `exit 1`) y pasan a `node -e "…"` o a un `.mjs` escrito en la carpeta de la fixture. Las tareas del workspace de moon de la fixture llevan `options.shell: false`, para que el escenario sin `pwsh` pruebe la CLI y no el shell de moon.
15. **Reglas de la capacidad**: ninguna cambia. «Avisos» de `control-profiles` y de `migration` recoge lo que se dice al usuario al terminar o al abrir la sesión; las líneas nuevas son salida de un comando y de un informe, y viven en sus requisitos. «Regla ante conflicto», el `--base` declarado frente al calculado, va en el requisito (manda la CLI). Datos, idioma y límites no cambian.
16. **Previsión de coste (Art. I)**, una línea por fichero que sigue el agente:
    - `skills/sdd-upgrade/references/migrations/v3.0.0.md`, paso 9: escenario nuevo `v3` en `tests/batteries/sdd-upgrade/` sobre `mold-v2x`, con un «Gate de merge» que lleva `&&`. RED 1 sujeto y GREEN 1 sujeto, Sonnet con la persona en Haiku, ~0,45 $ y ~8 min cada uno (medida de la 0199): ~0,9 $ en total, y ~1,8 $ con una tanda de REFACTOR.
    - `skills/sdd-archive/references/merge-recipe.md`, la viñeta de `--verify`: no se mide. Solo nombra la salida que escribe la CLI y la línea `Gate:` que ya pide `sdd-verify`; lo cubren los tests de la CLI. No tiene tope en `word-budget.test.ts`, y la viñeta no quita ninguna instrucción.
- Prueba del delta: `sdd capability merge` sobre una copia de `.docs/sdd` → `añadido` ×3, `sustituido` ×3, sin rechazos.
- Política de modelos: revisores de la spec, dominio opus y técnica sonnet (hechos) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería de `sdd-upgrade` en Sonnet, de uno en uno · en paralelo hasta `control.maxParallelAgents` (3)

### Hallazgos de la review

- **Aceptado** — técnica 1 (Crítico): sin `--affected`, moon corre toda la cadena de `deps` → el gate final conserva `--affected` con `--base <commit verificado>` y solo cambia los targets (decisión 1).
- **Aceptado** — técnica 2 (Crítico): las opciones de moon del gate no tienen regla → decisión 3.
- **Aceptado** — técnica 3: `-g` sin comprobar → las consultas usan el mismo rastreador que `moon run` con `MOON_INCLUDE_RELATIONS`, sin traducirlo a `--downstream`; comprobado con moon 2.6.0 (decisiones 1 y 3).
- **Aceptado** — técnica 4: el contrato del JSON → decisión 2 y un unitario con la salida real.
- **Aceptado** — técnica 5: `cmd.exe` con el `PATH` restringido y el shell de las tareas de moon → `ComSpec` y `options.shell: false` en la fixture; el límite de `%VAR%`, declarado (decisiones 10 y 14).
- **Aceptado** — técnica 6 y dominio 1: el reintento sin `--verified-at` → decisión 4 y un AND en el MODIFIED del push.
- **Aceptado** — técnica 7 y dominio 4: el hotfix sin requisito → decisión 9 y un AND en el ADDED. «Un hotfix cuya vuelta falla se deshace entero» no cambia: su línea `base:` sigue saliendo del contraste.
- **Aceptado** — técnica 8: decisiones del cuerpo fuera de ✋ → decisiones 5 y 6. El envoltorio (`sdd lock run --`) se conserva en el gate final: decisión 1.
- **Aceptado** — técnica 9: `moon query` que falla y tareas que no toca nadie → decisión 6 y dos AND.
- **Aceptado** — técnica 10: la previsión por fichero y el tope de palabras → decisión 16.
- **Aceptado** — dominio 2 (Crítico): tres versiones del contraste → una sola regla (decisión 8), con un AND para el caso sin cruce.
- **Aceptado** — dominio 3 (Crítico): el rango de «lo que tocó la base» → el AND dice el rango literal, y hay un escenario con un commit de la rama posterior al verificado.
- **Aceptado** — dominio 5: redirecciones y variables → se rechazan también `>` y `<`, las variables pasan literales y la migración avisa de ellas (decisiones 11 y 13).
- **Rechazado** — dominio 6: añadir el bloque de las cinco reglas → ninguna regla vigente cambia de valor; lo justifica la decisión 15.
- **Aceptado** — dominio 7: Mergiraf con `--verified-at` → decisión 5 y un AND.
- **Aceptado** — dominio 8: el origen de «solo la toca la base» → se cita `merge-recipe.md:11` (decisión 7).
- **Aceptado** — dominio 9: «Lo afectado» no va a `--verify` → sale del aviso, y «Gate de cierre» solo cuenta sin «Gate de merge» (decisión 13).

### Decisiones tomadas con el dev-lead

- El gate que filtra por una base recibe la base y corre solo lo que se cruza; sin cruce, `saltada (la base no toca sus inputs)` — petición de arranque, 2026-10-28: «Con un gate que filtra por una base (--affected --base <ref>), el script le pasa la base y corre solo lo que se cruza, como el paso de la base integrada de la 0221»
- `--verify` sin `WINDOWS_SHELLS` ni `shellCommand`; `execFile` sin shell; un gate con `&&` pasa a ser una tarea de moon o un script de `package.json` — petición de arranque, 2026-10-28: «--verify deja WINDOWS_SHELLS y shellCommand de cli/src/merge/verify.ts: lanza el gate como argumentos con execFile, sin shell»
- La migración de `sdd-upgrade` avisa a los proyectos cuyo gate lleve `&&`, `;` o una tubería — petición de arranque, 2026-10-28
- Perfil `delegate`; al fusionar, `sdd merge --push` — petición de arranque, 2026-10-28

## Intent

Hoy `cli/src/merge/run.ts` corre el `--verify` entero en el merge, en cada uno de los tres reintentos de push y otra vez sobre la base para el contraste (`baseVerdict`). Solo se lo salta si desde `--verified-at` únicamente cambió documentación. Lo que solo trajo la base ya pasó el cierre que lo trajo, y lo que solo toca la rama ya pasó su validación. Repetirlo alarga cada cierre y, si sale un rojo de carga, obliga a repetirlo todo (propuesta 0234). Además, el gate se lanza con `pwsh -Command` o `sh -c`: en una máquina con solo `powershell.exe` 5.1, `&&` no funciona, y un `pwsh` delante del valor expande las variables antes de tiempo (dos filas de deuda). El éxito es que una rama que no se cruza con la base fusione sin correr ninguna tarea, y que el gate corra en una máquina Windows sin `pwsh` ni `powershell.exe`. Sería un fracaso dejar sin correr una tarea que tocan la rama y la base a la vez.

## Scope

- Entra: el cruce en el merge, en cada reintento de push y en el contraste de un rojo, también en el hotfix (`hotfix.ts`); el lanzamiento sin shell y el rechazo de los encadenados; las fixtures de `cli/test/merge/` pasadas a Node; la viñeta de `--verify` de `merge-recipe.md`; el paso 9 de `v3.0.0.md` y su escenario en la batería de `sdd-upgrade`; las dos filas de deuda saldadas.
- Ficheros: `cli/src/merge/verify.ts`, `cli/src/merge/run.ts`, `cli/src/merge/hotfix.ts`, `cli/src/tasks/command.ts` (exportar el lanzador), `cli/test/merge/`, `skills/sdd-archive/references/merge-recipe.md`, `skills/sdd-upgrade/references/migrations/v3.0.0.md`, `tests/batteries/sdd-upgrade/`.
- No entra: el paso de la base integrada de `sdd-archive`, que sigue a mano (0221); la salvaguarda del build, los niveles de test y la regla tras un rojo (0236); los hooks de git a Node (0242); un gate de nx u otra herramienta.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `WINDOWS_SHELLS`, `shellCommand` y `runs` (la prueba de shells) | `cli/src/merge/verify.ts:18-34`; los cuatro tests de `merge --verify shell` en `cli/test/merge/verify.test.ts:4-21` | Salen; los sustituye el lanzador de `cli/src/tasks/command.ts` (decisión 10) |
| Gates de shell en las fixtures | `cli/test/merge/helpers.ts` (`sleepCommand`, `publishFromSeed`); `base-red.slow.test.ts`, `failures.slow.test.ts`, `verified-at.slow.test.ts`, `mergiraf.slow.test.ts`, `push-retry.slow.test.ts`, `hotfix.slow.test.ts`, `lock-and-base.slow.test.ts` | Pasan a Node (decisión 14) |
| `--verify` acepta un comando de shell | `.docs/sdd/capabilities/control-profiles.md` (requisitos de la verificación); `skills/sdd-archive/references/merge-recipe.md:42` | Delta `ADDED` «La verificación del merge lanza el gate sin shell»; la viñeta de la receta lo dice |
| «ejecuta `<gate>` como sin la opción» y «repite `--verify`» | `control-profiles.md:311` y `:318` | Delta `MODIFIED` de los dos requisitos |
| «el mismo comando corre sobre el commit de antes del merge» | `control-profiles.md:236` | Delta `MODIFIED` de «Un merge del cierre que falla deja la rama destino como estaba» |

- Filas que implementa: 0235 → `roadmap.md:23` (pasa a ✅ al cerrar), y las filas de deuda «La receta no dice cómo se ejecuta `-VerifyCommand`» (`roadmap.md:320`) y «`--verify` de `sdd merge` con `powershell.exe` 5.1 no admite `&&`» (`roadmap.md:491`), que se saldan al cerrar. Las nombran también la propuesta 0234 (su reparto, histórico, no se toca) y la fila 0242 («El `--verify` de `sdd merge` sin `pwsh` va en la 0235», sigue cierta). Comprobado con `git grep -n 0235 -- skills .docs/sdd/capabilities .docs/sdd/*.md cli tests`.

## Approach

La CLI sigue recibiendo el gate como un texto en `--verify`. Lo parte en argumentos y rechaza los encadenados antes del cerrojo. Si el gate es un `moon run … --affected`, cada pasada de la verificación (el merge, cada reintento y el contraste) calcula el cruce con dos consultas a moon (`moon query tasks --affected`) y lanza el gate con los targets que se cruzan y `--base <commit verificado>`, o no lanza nada. El resto del gate (`sdd lock run --` delante, otras opciones de moon) se conserva tal cual (decisiones 1 a 9). Sin `--affected`, corre como está declarado. `onlyDocsSince` sigue delante: si solo cambiaron docs, no se consulta a moon.

## Dónde se prueba

- Partir el gate y rechazar los encadenados; reescribir los targets; cruzar dos salidas reales de `moon query tasks --affected`: unitarios en `cli/test/merge/verify.test.ts`, como los de `failedTestLines`.
- El cruce de punta a punta (frontend/backend, y un commit de la rama posterior al verificado), sin `--verified-at`, el reintento, el contraste y el hotfix: `cli/test/merge/intersection.slow.test.ts`, con un workspace de moon de dos proyectos en la fixture de `mergeFixture`, como `push-retry.slow.test.ts`.
- El gate sin `pwsh` ni `powershell.exe`: en ese mismo fichero, con un `PATH` que solo lleva las carpetas de `git`, `node` y `moon`.
- El aviso de la migración: escenario `v3` de `tests/batteries/sdd-upgrade/`, RED y GREEN.

## Términos y ADR

- Términos resueltos: **lo que se cruza** — las tareas del gate que selecciona lo que toca la rama (desde el merge-base) y también lo que tocó la base (desde el commit verificado)
- ADR candidatas: ninguna (la regla es de la propuesta 0234, y lanzar sin shell lo pidió el dev-lead)

## Delta de comportamiento

### Capacidad: `control-profiles`

#### ADDED — La verificación del merge corre solo lo que se cruza

- GIVEN una rama que solo toca `apps/frontend/`, verificada en `a1b2c3d`, y una base que desde entonces trajo un cambio en `apps/backend/`
- WHEN el cierre ejecuta `sdd merge --verify "moon run :test --affected --base develop" --verified-at a1b2c3d`
- THEN no corre ninguna tarea, escribe `verificación: frontend:test: saltada (la base no toca sus inputs)` y `verificación: backend:test: saltada (solo la toca la base)`, y fusiona
- AND si la base también tocó `apps/frontend/`, escribe `verificación: corre frontend:test (las tocan la rama y la base)` y corre `moon run frontend:test --affected --base a1b2c3d`
- AND si la rama tiene un commit en `apps/frontend/` posterior a `a1b2c3d` y la base no tocó `apps/frontend/`, también corre `frontend:test`: lo que tocó la base se mide desde el commit verificado hasta el resultado del merge, que incluye esos commits de la rama
- AND lo que toca la rama se mide desde `git merge-base <destino antes del merge> <rama>` hasta la punta de la rama; el `--base` declarado en el gate no cuenta
- AND sin `--verified-at`, corre las tareas que toca la rama, con `--base <merge-base>`
- AND con `-g` o `--include-relations` en el gate, una tarea cuya dependencia cambió cuenta como tocada en los dos lados
- AND una tarea que no tocan ni la rama ni la base no sale en la salida
- AND un gate sin `--affected`, o que no es `moon run`, corre como está declarado
- AND con `--stdin`, `--status`, `--force` o un target que no es `proyecto:tarea` ni `:tarea`, escribe `verificación: sin cruce: '<opción o target>' no admitido; corre lo que toca la rama` y corre el gate con `--base <merge-base>`
- AND si `moon query` falla, escribe `verificación: sin cruce: moon query falló (<primera línea del error>); corre lo que toca la rama` y corre el gate con `--base <merge-base>`
- AND en un hotfix vale igual en la ida a la rama estable y en la vuelta a la de integración, con el merge-base de cada destino antes del merge

#### ADDED — La verificación del merge lanza el gate sin shell

- GIVEN una máquina Windows sin `pwsh` ni `powershell.exe` en el `PATH`
- WHEN el cierre ejecuta `sdd merge --verify "moon run app:test"`
- THEN el gate corre como `moon` con los argumentos `run app:test`, sin ningún intérprete de comandos
- AND las comillas dobles o simples agrupan un argumento: `node -e "process.exit(1)"` son dos argumentos tras `node`
- AND un `.cmd` o un `.bat` de Windows se lanza con el `cmd.exe` de `ComSpec`
- AND `--verify "pnpm lint && pnpm test"` sale con 2, sin coger el cerrojo, con `--verify: el gate encadena comandos con '&&'; hazlo una tarea de moon o un script de package.json`; igual con `||`, `;`, `|`, `>` y `<` fuera de comillas
- AND `$VAR`, `%VAR%` y `~` llegan literales al programa
- AND un programa que no está en el `PATH` falla con `verificación: no se encuentra '<programa>' en el PATH`

#### MODIFIED — La suite no se repite si desde el commit verificado solo cambian docs (antes: "ejecuta `<gate>` como sin la opción")

- GIVEN una feature cuyo gate de cierre pasó en el commit `a1b2c3d` y una rama destino que desde entonces solo avanzó en `.docs/sdd/roadmap.md`
- WHEN el cierre ejecuta `sdd merge --verify "<gate>" --verified-at a1b2c3d`
- THEN no ejecuta `<gate>` y escribe `verificación: omitida: desde a1b2c3d solo cambian docs`
- AND si desde `a1b2c3d` cambió cualquier fichero fuera de `.docs/` que no sea `*.md`, de la rama o de la base, ejecuta `<gate>`, y con un gate `moon run … --affected`, solo lo que se cruza; también si Mergiraf resolvió algún fichero, que tocaron los dos lados
- AND `--verified-at nada` sale con 2 y `--verified-at: 'nada' no es un commit`, sin coger el cerrojo

#### MODIFIED — El push del cierre reintenta si la rama destino avanzó (antes: "repite `--verify` salvo que desde el último commit verificado solo cambien docs")

- GIVEN `sdd merge --push` y un remoto en el que otra sesión publica `develop` mientras corre `--verify`
- WHEN el push se rechaza y, tras un fetch, la `develop` remota ya no es antecesora de la local
- THEN escribe `push: 'develop' avanzó en 'origin'; integro y reintento (2/3)`, integra la `develop` remota como al empezar, repite `--verify` salvo que desde el último commit verificado solo cambien docs, y vuelve a empujar
- AND en el reintento, con un gate `moon run … --affected`, corre solo lo que toca la rama y también tocó lo que llegó desde el último commit verificado; sin `--verified-at`, el último commit verificado es el resultado del merge que pasó la primera pasada
- AND tras el tercer push rechazado falla con `push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza el merge en un rato` y la rama destino como estaba
- AND un rechazo con la remota todavía antecesora (credenciales, hook del servidor) falla con `push: no se pudo publicar 'develop' en 'origin'.` y, en las líneas siguientes, lo que escribió `git push` (`remote: rama protegida`), sin reintentar; el push atómico de un hotfix, igual

#### MODIFIED — Un merge del cierre que falla deja la rama destino como estaba (antes: "el mismo comando corre sobre el commit de antes del merge")

- GIVEN un merge del cierre que falla: conflicto que no es el del log, verificación en rojo, push rechazado o error de git
- WHEN el script termina
- THEN la rama destino local vuelve al commit que tenía antes de fusionar la feature; no se empuja nada; el worktree temporal se ha retirado y el cerrojo está libre
- AND el script sale con error y nombra el paso que falló y el motivo
- AND si un hook rechaza el merge y no hay ficheros en conflicto, el motivo es `verificación: el hook rechazó el merge.` seguido de los tests fallidos y de las últimas 20 líneas de la salida del hook, no un conflicto
- AND con el hook o `--verify` en rojo, si la salida tiene líneas de un test fallido —`[-] se llama sdd-archive` de Pester, ` FAIL  test/a.test.ts > grupo > nombre` o `× nombre` de Vitest, también tras un prefijo de moon como `cli:test | `—, antes de la cola va `tests fallidos:` y esas líneas, en orden y hasta 20; sin ninguna, el mensaje no cambia
- AND si `git merge` falla sin conflictos y sin llegar a preparar el merge (un fichero sin seguimiento que sobrescribiría, una opción que su versión no admite), el motivo es `<paso>: git merge falló sin conflictos.` seguido de las últimas 20 líneas de su salida, no un rechazo del hook
- AND si la verificación falla porque un fichero lo tiene abierto otro proceso, el motivo es `bloqueado: '<fichero>' lo tiene abierto <proceso>` (el que nombre la salida del gate, u «otro proceso») y la ruta del log, no `verificación:`
- AND si `--verify` sale en rojo, corre otra vez sobre el commit de antes del merge: con un gate `moon run … --affected`, los targets que corrió la pasada roja, como lista y sin `--affected`, y sin cruce, el gate sin `--affected`; y el error acaba con `base: en rojo: el mismo comando también falla sin la rama (salida en <log>); mira la deuda del proyecto antes de investigar` o con `base: en verde: el rojo lo trae la rama`; tras un `bloqueado:` o un rechazo del hook no corre

### Capacidad: `migration`

#### ADDED — La migración a v3.0.0 avisa de un gate que encadena comandos

- GIVEN un proyecto 2.x cuyo §Testing declara `- **Gate de merge**: pnpm lint && pnpm test`
- WHEN acaba la migración a v3.0.0
- THEN el informe dice `Gate que encadena comandos: «pnpm lint && pnpm test» — sdd merge --verify ya no lo admite; hazlo una tarea de moon o un script de package.json`
- AND la línea del gate no cambia, el paso no tiene gate y no frena el marcador
- AND con `||`, `;`, `|`, `>` o `<` fuera de comillas, igual; con `$`, `%…%` o `~`, el informe dice `Gate con variables: «<línea>» — sdd merge --verify no las expande; ponlas en la tarea de moon o en el script`
- AND sin «Gate de merge» se lee «Gate de cierre»; «Lo afectado» no se lee; sin ningún gate que avisar, el paso se salta y lo dice

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-28 | aprobada (opción «Apruebo») |
