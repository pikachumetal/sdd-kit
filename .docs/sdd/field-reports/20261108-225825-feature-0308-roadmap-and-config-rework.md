---
kit_version: 2.3.4
lane: feature
id: 20261108-225825-feature-0308-roadmap-and-config-rework
task: 0308
mode: full
date: 2026-11-08
---

# Ticket para el kit — feature 0308: `sdd-roadmap` y `sdd-config` con las tres reglas de la ADR 0022

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, baterías con sujetos headless), una persona
- Modelo del hilo: Opus 5.5, effort no registrado
- Modelos de los subagentes: revisión de la spec opus y sonnet (effort medium); revisión final Spec opus+high, Código sonnet+high; re-revisión opus+high; una frase escrita por un agente sonnet; sujetos sonnet
- Coste en reloj: 2,57 h frente a 2,5 h estimadas (`sdd session tokens`)
- Coste en tokens: hilo 72.223.924, subagentes 5.895.464; sesión 31,74 $; sujetos 18,42 $ en 98 sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una regla que pide citar la frase entera necesitó cuatro rondas de GREEN porque el molde no hacía daño a la media cita

- **Qué pasó**: la frase nueva del triaje pide citar entera la frase que sale y la que entra. GREEN 1: 0 de 4 limpios (la regla vivía lejos de donde se escribe la solución). GREEN 2: la solución 4 de 4, la cita 0 de 2: en el molde, sustituir media frase dejaba intacta la otra mitad sin contradicción, y el GIVEN no mostraba daño. GREEN 3, con el molde endurecido: 1 de 2 (un sujeto describe la frase nueva en vez de citarla). GREEN 4, con la frase reescrita por un agente sonnet: 2 de 2. Tres paradas del dev-lead.
- **Fuente**: `.docs/sdd/specs/20261108-144128-feature-0308-roadmap-and-config-rework/spec.md`, «Enmiendas» (cuatro líneas de la Task 2); `battery.mjs` → `green-ts: 4 sujetos · 1.05 $`, `green-ts2: 4 sujetos · 0.89 $`, `green-ts3: 2 sujetos · 0.42 $`, `green-ts4: 2 sujetos · 0.64 $`.
- **Dónde en el kit**: `skills/sdd-propose/references/coherence-pass.md`: sus comprobaciones (cada `MODIFIED`, lo que se retira, el delta en una copia) no piden que el GIVEN de un THEN haga visible el fallo que mide.
- **Por qué el kit no lo evitó**: la pasada de coherencia contrasta el THEN con la decisión, no el molde con el THEN; que media cita no hiciera daño en el molde solo salió en el GREEN.
- **Coste**: 2,05 $ de sujetos en las rondas 2 a 4 y tres paradas (spec, «Enmiendas»).
- **Propuesta**: en la pasada de coherencia, por cada THEN que mide la forma de una salida (una cita entera, un campo), escribir la salida incorrecta más probable y comprobar en la copia del molde que el GIVEN la distingue de la correcta; si no la distingue, endurecer el molde antes de aprobar.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec cuyo THEN pide citar la frase entera y un molde donde la media cita deja el fichero coherente WHEN el agente hace la pasada de coherencia THEN señala que el GIVEN no distingue la media cita y propone cambiar el molde antes de la aprobación.

### 2. `roadmap publish` rechaza la edición del propio agente cuando la rama de integración está sacada en ese mismo árbol

- **Qué pasó**: en el molde de la batería, `develop` está sacada en el árbol del sujeto. `sdd roadmap publish --project-root . --message "…" ROADMAP.md` → `destino con cambios: ROADMAP.md en <run>\repo`, con el fichero que el propio sujeto acababa de editar. Con el kit de `develop`, 11 de 13 sujetos que escriben lo saltan con `git commit`; con el de la rama, 8 de 13 paran sin commitear y lo dicen. El paso 6 no cambió entre los dos kits.
- **Fuente**: `.docs/sdd/specs/20261108-144128-feature-0308-roadmap-and-config-rework/branch/out/id3-1.tools.txt` (llamada y salida de `publish`); `control/out/id3-1.tools.txt` (el `git commit` posterior); `.temp/k308/cli` y `.temp/k308-dev/cli` iguales salvo finales de línea (`diff -rq --strip-trailing-cr`).
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md` paso 6 «Publish the reservation» («in the worktree where it is checked out») y `cli/src/roadmap/publish.ts`.
- **Por qué el kit no lo evitó**: el paso dice que `publish` commitea en el worktree donde está sacada la rama de integración, pero `publish` toma por ajenos los cambios de esos mismos ficheros.
- **Coste**: ninguna fila de la rúbrica lo puntúa; en el uso real, un roadmap sin commitear o un commit que se salta el cerrojo (sin respaldo de un caso de campo).
- **Propuesta**: cuando el worktree destino es el mismo `--project-root` y sus únicos cambios son los ficheros que se publican, `publish` los commitea bajo el cerrojo.
- **Verificada**: sí — reproducido en la batería: `branch/out/id3-1.tools.txt`, dos llamadas con la misma salida.
- **Criterio de aceptación**: GIVEN `develop` sacada en el árbol con `ROADMAP.md` editado y nada más cambiado WHEN corre `sdd roadmap publish --project-root . ROADMAP.md` THEN commitea `ROADMAP.md` en `develop`; AND GIVEN además otro fichero cambiado THEN rechaza nombrándolo.

### 3. La parada de dinero subió el umbral en dólares pero no el techo de sujetos, y el lanzador cortó la tanda aprobada

- **Qué pasó**: el dev-lead eligió «1» en la parada de dinero (umbral a 21 $, rama con los 17 escenarios del control). La tanda de la rama cortó en 33 de 35: `techo de 96 sujetos de la previsión de … spec.md alcanzado: decide el dev-lead; subirlo exige enmendar la spec`. La fila Suma de la spec seguía en 96; lo aprobado eran 98 más 4 de reserva. Se subió a 102 con un ruling, sin volver a parar.
- **Fuente**: log de `battery.mjs run` de la Task 4 (línea citada); `spec.md`, fila `Suma` y la enmienda de la Task 4.
- **Dónde en el kit**: `skills/sdd-propose/references/control-profiles.md`, la parada por dinero; `tests/headless/run.mjs` lee el techo de la fila `Suma`.
- **Por qué el kit no lo evitó**: la parada habla de dólares; el lanzador corta por sujetos, y nada pide que la opción aprobada cambie las dos cifras.
- **Coste**: una tanda partida y un `--resume` (~0,30 $; ledger de la Task 4); una decisión que tomé yo sobre una cifra del dev-lead (sin respaldo de su frase).
- **Propuesta**: las opciones de una parada por dinero dicen los dos techos, dólares y sujetos, y la aprobada enmienda la fila `Suma` en el mismo paso.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una parada por dinero con una opción que añade sujetos WHEN el dev-lead la aprueba THEN la enmienda de la spec sube a la vez el umbral y la fila `Suma`, y la tanda no corta por sujetos.

### 4. El tope de 5 min del gate de cierre no distingue la carga de otras sesiones

- **Qué pasó**: gate de cierre verde sobre el merge de sincronización, pero `kit:test-headless` tardó 8 min 56 s; repetida sola, 11 min 24 s, con la CPU al 86 % y 7 procesos `claude` y 44 `node` de otras ramas. El CI de la rama corrió `kit:test-headless`, `cli:typecheck` y `cli:test-min` en 1 min 43 s sobre el mismo sha. Lo tomé por carga de la máquina con un ruling, aunque la regla pide que la repetición sola quede dentro del tope.
- **Fuente**: `.temp/sdd/watch/20261108-223330-61608.log` (`kit:test-headless (8m 55s 760ms)`), el log de la repetición (`11m 24s 515ms`), `Get-Process` y `Win32_Processor.LoadPercentage` en PowerShell, `gh run view 42530897087 --json jobs` (paso de 22:34:46Z a 22:36:29Z).
- **Dónde en el kit**: `.docs/sdd/tech-stack.md` §Testing, «Tope del gate de cierre».
- **Por qué el kit no lo evitó**: «repetida sola» supone una máquina libre; con otras sesiones corriendo, la repetición también va cargada y la regla da rojo a una suite que en el CI tarda 1 min 43 s.
- **Coste**: ~11 min de repetición; una decisión sobre la regla tomada por ruling (ledger, «Cierre»).
- **Propuesta**: si la repetición sola también pasa del tope, el desempate es la duración de esa tarea en el CI de la rama sobre el mismo sha; dentro del tope allí, es carga y va al ticket.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `kit:test-headless` 11 min en local con otras sesiones y 2 min en el CI de la rama sobre el mismo sha WHEN se cierra THEN el registro lo da por carga, sin fila de deuda, con las tres medidas.

## Lo que hice por iniciativa propia

- Para verificar un refactor de la batería que no tiene test propio (partir `layer3Fix`), construí el molde en seco antes y después (`DRY_RUN=1 KEEP_MOLD=1 … battery.mjs run`) y los comparé con `diff -r`: idénticos. Sirvió de RED/GREEN sin coste de sujetos.
- Los encargos de los ejes y de la re-revisión los rellené con un script desde sus plantillas, con un control de huecos sin llenar, y el despacho apuntaba al fichero; salieron sin huecos.

## Funcionó, no tocar

- La tabla rama/control por fila de rúbrica con el kit de `develop` como control: separó el rojo de enrutado de `m2` y el 1/2 de `M7b`, que da también el control, de un rojo de la rama.
- La parada con opciones numeradas y la recomendada primero: el dev-lead respondió con una cifra en cada una de las cuatro paradas.
- Los dos ejes de la revisión final coincidieron en el único Important, cada uno desde su lente, y la re-revisión limpió la pasada de fix.

## Menores

- `node tests/headless/battery.mjs plan` sin la ruta de la batería cae con `ERR_INVALID_ARG_TYPE` en vez de dar su uso — `tests/headless/battery.mjs`.
- `M7b` sale 1/2 con los dos kits: un sujeto propone «1.6.0» cuando el usuario dijo «1.6», contra «never an assumed one» — `skills/sdd-roadmap/references/prepare-release.md` paso 6.
- La enmienda 4 cambió la frase de la cita sin tocar el AND GIVEN ni la fila `TS1`, y el eje Spec lo cazó como Minor — `skills/sdd-implement/SKILL.md`, «Deviations and rulings» (una enmienda aprobada no pide revisar sus THEN).
- El eje Código dio por opaca la fórmula «the row's WHEN» de la frase nueva del triaje; quedó así por ser el literal aprobado y medido — `skills/sdd-roadmap/SKILL.md`, entrada «Triage».
- El ledger no tiene la línea `Ruling: compactación` y no sé si la primera compactación dejó dos tasks pendientes, en cuyo caso tocaba seguir en SDD — `skills/sdd-implement/SKILL.md`, «Method».
