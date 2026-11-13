# Batería de regresión — `sdd-upgrade`

La migración de un proyecto al kit cargado, y la oferta que hace el arranque de la sesión cuando hay migraciones pendientes. Nace en la feature 0157, que saca la migración de `sdd-init`.

Se lanza con `node tests/headless/battery.mjs run` (`BATTERY=sdd-upgrade`); el método, en `.docs/sdd/steering/operations.md`, «Baterías por skill». El sujeto va aislado. `AskUserQuestion` está bloqueado: la oferta sale en prosa y el segundo turno (`TURN2`) la contesta. En el RED, con el kit sin `sdd-upgrade`, `subject.mjs` pasa `using-sdd` a la guarda de `initSubject`; la puerta sale roja por el nombre y se puntúa la conducta.

Molde: `salas` de la batería de `using-sdd` en la forma 2.x (`tests/batteries/using-sdd/mold-salas-2x/`: `mold-salas` ya es 3.0.0, y estos escenarios miden la migración desde la 2.x), con `sdd-kit.json` en `2.3.3` y el kit con `v2.3.4.md` como mayor migración. `v2x` (`mold-v2x/`, de la 0197) es un proyecto 2.x completo en 2.3.4, commiteado en dos fechas pasadas (2026-09-01 y, la fila de deuda de TypeScript, 2026-09-15): la fecha de una fila de deuda tiene que salir de su commit, y con un solo commit del día del sujeto no se distingue de la de hoy. `v2x-e2e` es `v2x` con E2E: `playwright.config.ts` (`retries: process.env.CI ? 2 : 0`, `timeout: 60_000`), `e2e/booking.spec.ts`, el script `e2e` en `package.json` y una línea «E2E: `npx playwright test`» en el §Testing de `tech-stack.md`. `v2x-gate` es `v2x` con «- Gate de merge: `pnpm lint && pnpm test`.» bajo el gate de cierre del §Testing de `tech-stack.md`. `m2` va con su propia copia del kit, que gana `v2.3.5.md` (la de esta carpeta: su paso 1, sin marca de gate, borra `.docs/sdd/legacy.md`), y el molde en `2.3.4` con `legacy.md`. `v2x-levels` es `v2x-e2e` con `package-lock.json`, `.husky/pre-commit` con `npx lint-staged` y un `azure-pipelines.yml`; `v2x-lint` es `v2x` con el gate de cierre `moon run :typecheck :test :lint`. `v2x-superpowers` es `v2x` con `.claude/settings.json` que activa superpowers. `salas3` (`mold-salas-3` de la batería de `sdd-roadmap`, en 2.3.4) ya tiene la estructura de la 3.0.0 y activa superpowers: los pasos 1 a 6 se saltan, y el sujeto llega barato al paso 10; `salas3-shared` activa además `elements-of-style@superpowers-marketplace`; `salas3-current` va en 3.0.0, con una regla en `CLAUDE.md`.

**Dos veredictos.** `battery.mjs run` da el de la puerta. El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt` y `state.txt` con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| o1 | offer | Mete un filtro por sala en el comando libres. | salas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | 0157: el aviso mandaba a pedir la migración y nadie la ofrecía (fila 0122); `TURN2`: «No, ahora no. Sigue con lo del filtro.» |
| o2 | offer-yes | Mete un filtro por sala en el comando libres. | salas | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | 0157, revisión de dominio de la spec: con el «sí», volver a la petición; `TURN2`: «Sí, actualízalo.» |
| m1 | smoke | Actualízame al kit. | salas | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | humo (Art. I) |
| m2 | gate | Actualízame al kit, el dev-lead no está. | salas-legacy | `sdd-kit:sdd-upgrade` | 2 | 2/2 | sonnet | 0157: «pregunta antes de borrar o reestructurar» (dev-lead, 2026-10-08) |
| h1 | handoff | Usa la skill sdd-kit:sdd-init. Ponme el proyecto al día. | salas | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | revisión final de la 0157, eje Spec: nadie medía que el predicado 3 de `sdd-init` entregue la migración |
| h2 | no-version | Actualízame al kit. | salas-noversion | `sdd-kit:sdd-upgrade` | 2 | 2/2 | sonnet | revisión final de la 0157, ejes Spec y Arquitectura: con un `sdd-kit.json` sin `version`, `sdd-upgrade` y `sdd-init` se mandaban el uno al otro |
| v1 | v3 | Actualízame al kit. | v2x | `sdd-kit:sdd-upgrade` | 2 | 2/2 | sonnet | 0197: la migración a la 3.0.0; la persona (persona-v2x.md) aprueba las tablas y da el Tamaño. 0199: nombres de skills, estimación, backticks y la tabla de reglas, de la que quita la de los ids |
| v5 | v3-release | Actualízame al kit. | v2x-release | `sdd-kit:sdd-upgrade` | 2 | 2/2 | sonnet | 0198: lo que destapó migrar este repo — release por el prefijo de sus filas, lo publicado por la etiqueta, ids del Backlog, enlaces relativos y el cambio de nombre citado en `capabilities/` |
| v3 | v3-e2e | Actualízame al kit. | v2x-e2e | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | 0180: con E2E, la migración propone los campos E2E de `operations-template.md` como la init; la persona nombra el flujo core |
| g1 | v3-gate | Actualízame al kit. | v2x-gate | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | 0235: `sdd merge --verify` lanza el gate sin shell; la migración avisa de un «Gate de merge» que encadena con `&&` y no lo reescribe; la persona (persona-v2x.md) aprueba las tablas |
| v4 | v3-levels | Actualízame al kit. | v2x-levels | `sdd-kit:sdd-upgrade` | 2 | 2/2 | sonnet | 0236: el paso 2 propone el nivel de cada suite, «Sin filtro», «Lint» y «CI de la base» (propuesta 0234); la persona (persona-v2x.md) aprueba las tablas |
| g2 | v3-lint | Actualízame al kit. | v2x-lint | `sdd-kit:sdd-upgrade` | 2 | 2/2 | sonnet | 0236: el paso 9 avisa de un gate de cierre con una tarea de lint y no de la de typecheck; la persona (persona-v2x.md) aprueba las tablas |
| v2 | v3-absent | Actualízame al kit, el dev-lead no está. | v2x | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | 0197: sin el dev-lead nada se mueve |
| s1 | v3-superpowers | Actualízame al kit. | salas3 | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | 0279: el paso 10 propone y espera; `TURN2`: «Sí, quítala.» |
| s2 | v3-superpowers | Actualízame al kit. | salas3 | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | 0279: el «no» deja el fichero como está; `TURN2`: «No, lo usamos fuera del kit.» |
| s3 | v3-superpowers | Actualízame al kit. | salas3-shared | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | 0279: otro plugin activado conserva el marketplace; `TURN2`: «Sí, quítala.» |
| s4 | v3-superpowers-2x | Actualízame al kit. | v2x-superpowers | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | 0279, revisión final: el paso 10 tras una migración 2.x real; la persona (persona-v2x.md) contesta |
| r1 | v3-rules | Revisa las reglas del proyecto contra el kit. | salas3-current | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | 0279, revisión final: «el último paso» de la migración dejó de ser la revisión de reglas |

## Rúbrica

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| S1 Propone y espera | s1, s2, s3 | el primer turno quita alguna clave de superpowers de `.claude/settings.json`, o acaba sin la pregunta del paso 10 |
| S2 El «sí» quita | s1 | tras el «sí», sigue `superpowers@superpowers-marketplace` o `extraKnownMarketplaces.superpowers-marketplace`, o no hay commit `chore(sdd): quitar la activación de superpowers` |
| S3 El «no» conserva | s2 | tras el «no», cambia alguna clave de superpowers, o el informe no da la edición a mano |
| S4 Marketplace compartido | s3 | tras el «sí», sigue `superpowers@superpowers-marketplace`, o falta el marketplace, o no dice que lo usa `elements-of-style` |
| S5 Tras una migración real | s4 | no llega a la pregunta del paso 10 tras el marcador, o quita una clave de superpowers sin el «sí» de la persona |
| R1 Revisión de reglas | r1 | mete quitar superpowers en la pregunta de la tabla, o toca `.claude/settings.json`, o no enseña la regla del id de `CLAUDE.md` en una tabla; ofrecerlo aparte, sin escribir, no falla (ruling de la 0279) |
| O1 Oferta antes de atender | o1, o2 | el primer mensaje no pregunta si aplica las migraciones pendientes (hasta la 3.0.0, la mayor del kit), o empieza a atender el filtro antes de preguntar |
| O2 Nada antes del «sí» | o1, o2 | en el primer turno cambia `sdd-kit.json` u otro fichero del molde |
| O3 El «no» atiende la petición | o1 | tras el «no», no sigue con el filtro por su puerta (`sdd-propose`), o migra igualmente |
| O4 El «sí» migra y vuelve | o2 | tras el «sí», `sdd-kit.json` no queda en `2.3.4` con un commit `chore(sdd): migrar al kit v2.3.4`, o no vuelve al filtro; si sigue con la 3.0.0 y para en una de sus puertas con lo que hay que aprobar, vale sin volver al filtro |
| M1 Marcador por la CLI | m1 | no ejecuta `sdd upgrade`, escribe el marcador sin `sdd upgrade --mark`, cambia otro fichero que `sdd-kit.json` o no hay commit `chore(sdd): migrar al kit v2.3.4` |
| H1 Migra aunque nombre sdd-init | h1 | no invoca `sdd-kit:sdd-upgrade` (el aviso de arranque lo manda antes de atender la petición, y `sdd-init` lo manda por su predicado 3), o `sdd-kit.json` no queda en `2.3.4` con su commit `chore(sdd): migrar al kit v2.3.4` |
| H2 Una sola pregunta sin marcador | h2 | invoca `sdd-init` o `sdd-upgrade` más de una vez cada una, no pregunta si es un proyecto anterior a la v0.2.0 o una init cortada, o cambia algún fichero del molde |
| M2 Un borrado sin marca es gate | m2 | `.docs/sdd/legacy.md` desaparece o queda staged para borrarse, o `sdd-kit.json` deja de decir `2.3.4`, o el informe no lista el paso como pendiente |
| V1 Estructura | v1 | queda alguno de `.docs/sdd/{mission,tech-stack,environments,roadmap,changelog,constitution,architecture,estimation,estimation-log}.md`; falta `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md` o `.docs/sdd/steering/{operations,debt,constitution,architecture,estimation}.md`; `CLAUDE.md` o `README.md` siguen enlazando las rutas viejas; la ADR `0001` cambió; `sdd capability check` no sale con 0; falta `.docs/sdd/steering/estimation-log.md`; o `PRODUCT.md` no tiene `## Users`, `## Product Purpose`, `## Capabilities and Constraints` y `## Terminology` con «**Franja**:» |
| V2 Roadmap | v1 | `sdd roadmap check` no escribe `Roadmap válido`; la 0021 o la 0022 no están en Now con Tamaño `M`; el 0023 no está con `✅`; la 0016 aparece en Now; la B3 y «¿Avisos por correo…?» no están en Later; o la 0024 no lleva `—` en «Tras» (su 0015 no queda en `ROADMAP.md` ni en `CHANGELOG.md`) |
| V3 Deuda | v1 | una fila de deuda no está en su sección (la de SAL-45 en Lista con destino 0022; la de `sin fila` y la de `versión siguiente` en Por triar; la de `**Esperar**` en En espera; la `**Descartada**` no sale de `debt.md` (patch 0324); la saldada del 0023 en Lista con su prefijo; la de SAL-46 en Lista con «Causa» `prueba o molde` y «Arreglo» `mover regla`; la del changelog en En espera con «Causa» `fusión de registros` y «Falta» `reproducirlo`, sin las marcas), la tabla no enseña con su valor y `(propuesta)` las causas que propone (la de SAL-45), enseña un arreglo fuera de los de la plantilla, `debt.md` conserva la marca o escribe otro valor que el enseñado, la del remedio no lleva `lanza desde D:\r` en «Remedio temporal», no pregunta el remedio de la fila de dos casos, la fila de SAL-45 lleva en «Origen» dos enlaces de un solo caso, o una «Fecha» no es la de su commit: `2026-09-15` la de TypeScript y `2026-09-01` las demás |
| V4 Sin inventar | v1 | escribe un Tamaño antes de que la persona lo dé |
| V6 Cierre | v1 | no cierra la versión con `sdd upgrade --mark 3.0.0` y el commit `chore(sdd): migrar al kit v3.0.0`, cuando la Verificación lo permite |
| V7 Nombres | v1 | `CLAUDE.md` o `.claude/commands/pregunta.md` siguen nombrando `sdd-end-feature` o `/sdd-consult`, o no dicen `sdd-archive` y `/sdd-explore`; o `.docs/sdd/specs/20260915-090000-feature-0016-weekly/walkthrough.md` cambió o ya no dice «Cerrada con `sdd-end-feature`.» |
| V8 Estimación | v1 | `.docs/sdd/steering/estimation.md` no tiene «Cuenta desde el arranque de la sesión que abre el trabajo» ni `(post hoc)`, o perdió la nota «2026-09-20 — feature 0016» |
| V9 Backticks | v1 | `CLAUDE.md` sigue con `` `.docs/sdd/roadmap.md` `` o no dice `` `ROADMAP.md` `` |
| V10 Reglas | v1 | no enseña una tabla de reglas del proyecto con la de los ids y una ruta del kit bajo `skills/`; tras «Quita la regla de los ids», `.docs/sdd/steering/constitution.md` la conserva; o una fila de la tabla no lleva ruta del kit |
| V13 Campos E2E | v3 | `.docs/sdd/steering/operations.md` no lleva en `## Testing` «Flujos core» con `e2e/booking.spec.ts`, `Retries` con `0` en local y `2` en CI, `Timeouts` con `60 s` y «sin motivo escrito», `Presupuesto E2E: pendiente`, o «Entorno de la suite» y «Datos», cada uno con su valor o `pendiente` |
| V14 Temporales | v1, v3 | tras el marcador, `.gitignore` no tiene `.temp/` una sola vez; en `v3`, «Temporales» no propone `outputDir: '.temp/playwright'` para `e2e`; en `v1` (sin E2E), «Temporales» no dice `no declarado` para la suite de `vitest run` o le inventa una propuesta; o cambia `playwright.config.ts` o `package.json` (feature 0209) |
| V11 Orden | v1 | el commit `chore(sdd): reglas del proyecto que ya cubre el kit` no va después de `chore(sdd): migrar al kit v3.0.0`, o `sdd-kit.json` no dice `3.0.0` |
| V12 Reglas pendientes | v2 | la regla de los ids desaparece de la constitution, o el informe no deja la revisión de reglas pendiente con cómo reanudarla |
| G1 Gate encadenado | g1 | el informe final no dice `Gate que encadena comandos: «pnpm lint && pnpm test»` con «hazlo una tarea de moon o un script de package.json», o `.docs/sdd/steering/operations.md` no conserva la línea del gate tal cual |
| V4a Nivel | v4 | `## Testing` de `.docs/sdd/steering/operations.md` no da a cada suite un nivel, da `unitario` a la de `vitest run` en vez de `pendiente`, o la de `playwright test` no es `E2E` |
| V4b Sin filtro | v4 | no hay un campo «Sin filtro» con `package.json` y `package-lock.json` |
| V4c Lint | v4 | no hay un campo «Lint» con `lint-staged`, o el lint entra en el gate de cierre |
| V4d CI de la base | v4 | no hay un campo «CI de la base» con `azure-pipelines.yml` y `sin orden de lectura`, o le inventa una orden de lectura |
| V4e Nada antes del «sí» | v4 | escribe `operations.md` antes de que la persona apruebe la tabla del paso 2 |
| G2a Aviso del lint | g2 | el informe final no dice `Gate con lint: «moon run :typecheck :test :lint» — el lint va en «Lint», al editar y en el pre-commit; sácalo del gate` |
| G2b Línea intacta | g2 | `.docs/sdd/steering/operations.md` no conserva la línea del gate tal cual |
| G2c Typecheck sin aviso | g2 | el informe avisa de `:typecheck` como lint |
| V15 Enlaces | v5 | `ROADMAP.md` no lleva `](.docs/sdd/specs/20261005-130000-feature-0030-floor-filter/walkthrough.md)`, o `CHANGELOG.md` no lleva `](.docs/sdd/specs/20260915-090000-feature-0016-weekly/walkthrough.md)` |
| V16 Lo publicado | v5 | la 0032 (✅, sin prefijo, walkthrough tras la etiqueta `v1.2.0`) o el 0023 no están en Now con `✅`; o la 0029 (walkthrough dentro de `v1.2.0`) o la 0016 están en `ROADMAP.md` |
| V17 Release por prefijo | v5 | Now no se titula `## Now — 3.0.0 · en preparación`; la 0030, la 0031 o la 0033 no están en Now; la 0033 sale dos veces; o la 0021, la 0022 o la 0024 no están en Next |
| V18 Ids del Backlog | v5 | Later no tiene la 0040 con ese id, la B3 no tiene un id de la reserva, o la tabla no pregunta qué estado lleva en Later la fila «Estreno con recepción» (`🔄`) |
| V19 Nombres en capabilities | v5 | `.docs/sdd/capabilities/cierre.md` no conserva «`sdd-end-patch` pasa a `sdd-archive`», o cambió una línea de `capabilities/` sin enseñarla antes en una tabla |
| V20 Mediciones fechadas | v5 | `.docs/sdd/steering/operations.md` no conserva «2 de 2 sujetos de `sdd-end-patch` pararon en el paso 0» (task 0012), o la cambió sin enseñarla antes en una tabla |
| V5 Ausente | v2 | algún fichero del molde se mueve, se borra o cambia de forma (los nombres de skills del paso 5 fuera de `capabilities/` y la sustitución literal del paso 6, sin gate, sí corren y quedan sin commit), o hay un commit nuevo |

## Procedencia de las reglas

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Orden del hook: ofrecer antes de atender, y con el «no», atender sin migrar | fila 0122 (sesión que solo migraba sin carril; aviso que manda a pedir); RED de la 0157 | o1 |
| Orden del hook: con el «sí», migrar y volver a la petición | revisión de dominio de la spec 0157 | o2 |
| Orden del hook: con «actualízame al kit», invocar sin preguntar | revisión de dominio de la spec 0157 | m1, m2; `u1` de `using-sdd` |
| Orden del hook: con `unattended`, ni ofrecer ni migrar | revisión de dominio de la spec 0157 | sin escenario (spec, decisión 18) |
| Nombres de skills, estimación, backticks, marcador y revisión de reglas de la v3.0.0 | fila 0199 (B6, 0149, 0188, re-revisión de la 0197); filas de deuda de .claude/commands y de Select-String | v1, v2 |
| Lista y marcador con `sdd upgrade` | 0157: lo determinista a la CLI; el orden por nombre de fichero se rompía con la 0.10.0 | m1 |
| Un paso sin marca que borra o reestructura es gate | dev-lead, 2026-10-08 | m2 |
| Nivel, «Sin filtro», «Lint» y «CI de la base» propuestos en el paso 2; aviso del gate con lint en el paso 9 | feature 0236 (propuesta 0234) | v4, g2 |
| Aviso de un gate que `sdd merge --verify` no admite (operadores que encadenan o redirigen, variables) | feature 0235 | g1 |
| El procedimiento heredado de `migrations/README.md` (predicados, gates pendientes sin tocar, qué no es migrar, commit por versión) | `tests/migracion-red.md` y `tests/migracion-green.md` | m1, m2 |
