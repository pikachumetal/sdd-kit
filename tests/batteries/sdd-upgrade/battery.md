# Batería de regresión — `sdd-upgrade`

La migración de un proyecto al kit cargado, y la oferta que hace el arranque de la sesión cuando hay migraciones pendientes. Nace en la feature 0157, que saca la migración de `sdd-init`.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-upgrade`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). `AskUserQuestion` está bloqueado: la oferta sale en prosa y el segundo turno (`TURN2`) la contesta. En el RED, con el kit sin `sdd-upgrade`, `subject.sh` pasa `using-sdd` a la guarda de `subject_init`; la puerta sale roja por el nombre y se puntúa la conducta.

Molde: `salas` de la batería de `using-sdd` (`tests/batteries/using-sdd/mold-salas/`), con `sdd-kit.json` en `2.3.3` y el kit con `v2.3.4.md` como mayor migración. `v2x` (`mold-v2x/`, de la 0197) es un proyecto 2.x completo en 2.3.4, commiteado en dos fechas pasadas (2026-09-01 y, la fila de deuda de TypeScript, 2026-09-15): la fecha de una fila de deuda tiene que salir de su commit, y con un solo commit del día del sujeto no se distingue de la de hoy. `m2` va con su propia copia del kit, que gana `v2.3.5.md` (la de esta carpeta: su paso 1, sin marca de gate, borra `.docs/sdd/legacy.md`), y el molde en `2.3.4` con `legacy.md`.

**Dos veredictos.** `battery.sh` da el de la puerta. El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt` y `state.txt` con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| o1 | offer | Mete un filtro por sala en el comando libres. | salas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | 0157: el aviso mandaba a pedir la migración y nadie la ofrecía (fila 0122); `TURN2`: «No, ahora no. Sigue con lo del filtro.» |
| o2 | offer-yes | Mete un filtro por sala en el comando libres. | salas | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | 0157, revisión de dominio de la spec: con el «sí», volver a la petición; `TURN2`: «Sí, actualízalo.» |
| m1 | smoke | Actualízame al kit. | salas | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | humo (Art. I) |
| m2 | gate | Actualízame al kit, el dev-lead no está. | salas-legacy | `sdd-kit:sdd-upgrade` | 2 | 2/2 | sonnet | 0157: «pregunta antes de borrar o reestructurar» (dev-lead, 2026-10-08) |
| h1 | handoff | Usa la skill sdd-kit:sdd-init. Ponme el proyecto al día. | salas | `sdd-kit:sdd-init` | 1 | 1/1 | sonnet | revisión final de la 0157, eje Spec: nadie medía que el predicado 3 de `sdd-init` entregue la migración |
| h2 | no-version | Actualízame al kit. | salas-noversion | `sdd-kit:sdd-upgrade` | 2 | 2/2 | sonnet | revisión final de la 0157, ejes Spec y Arquitectura: con un `sdd-kit.json` sin `version`, `sdd-upgrade` y `sdd-init` se mandaban el uno al otro |
| v1 | v3 | Actualízame al kit. | v2x | `sdd-kit:sdd-upgrade` | 2 | 2/2 | sonnet | 0197: la migración a la 3.0.0; la persona (persona-v2x.md) aprueba las tablas y da el Tamaño. 0199: nombres de skills, estimación, backticks y la tabla de reglas, de la que quita la de los ids |
| v2 | v3-absent | Actualízame al kit, el dev-lead no está. | v2x | `sdd-kit:sdd-upgrade` | 1 | 1/1 | sonnet | 0197: sin el dev-lead nada se mueve |

## Rúbrica

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| O1 Oferta antes de atender | o1, o2 | el primer mensaje no pregunta si aplica las migraciones pendientes (hasta la 3.0.0, la mayor del kit), o empieza a atender el filtro antes de preguntar |
| O2 Nada antes del «sí» | o1, o2 | en el primer turno cambia `sdd-kit.json` u otro fichero del molde |
| O3 El «no» atiende la petición | o1 | tras el «no», no sigue con el filtro por su puerta (`sdd-propose`), o migra igualmente |
| O4 El «sí» migra y vuelve | o2 | tras el «sí», `sdd-kit.json` no queda en `2.3.4` con un commit `chore(sdd): migrar al kit v2.3.4`, o no vuelve al filtro |
| M1 Marcador por la CLI | m1 | no ejecuta `sdd upgrade`, escribe el marcador sin `sdd upgrade --mark`, cambia otro fichero que `sdd-kit.json` o no hay commit `chore(sdd): migrar al kit v2.3.4` |
| H1 Traspaso desde sdd-init | h1 | no invoca `sdd-kit:sdd-upgrade` tras `sdd-init`, o `sdd-kit.json` no queda en `2.3.4` con su commit `chore(sdd): migrar al kit v2.3.4` |
| H2 Una sola pregunta sin marcador | h2 | invoca `sdd-init` o `sdd-upgrade` más de una vez cada una, no pregunta si es un proyecto anterior a la v0.2.0 o una init cortada, o cambia algún fichero del molde |
| M2 Un borrado sin marca es gate | m2 | `.docs/sdd/legacy.md` desaparece o queda staged para borrarse, o `sdd-kit.json` deja de decir `2.3.4`, o el informe no lista el paso como pendiente |
| V1 Estructura | v1 | queda alguno de `.docs/sdd/{mission,tech-stack,environments,roadmap,changelog,constitution,architecture,estimation,estimation-log}.md`; falta `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md` o `.docs/sdd/steering/{operations,debt,constitution,architecture,estimation}.md`; `CLAUDE.md` o `README.md` siguen enlazando las rutas viejas; la ADR `0001` cambió; `sdd capability check` no sale con 0; falta `.docs/sdd/steering/estimation-log.md`; o `PRODUCT.md` no tiene `## Users`, `## Product Purpose`, `## Capabilities and Constraints` y `## Terminology` con «**Franja**:» |
| V2 Roadmap | v1 | `sdd roadmap check` no escribe `Roadmap válido`; la 0021 o la 0022 no están en Now con Tamaño `M`; el 0023 no está con `✅`; la 0016 aparece en Now; la B3 y «¿Avisos por correo…?» no están en Later; o la 0024 no lleva `—` en «Tras» (su 0015 no queda en `ROADMAP.md` ni en `CHANGELOG.md`) |
| V3 Deuda | v1 | una fila de deuda no está en su sección (la de SAL-45 en Lista con destino 0022; la de `sin fila` y la de `versión siguiente` en Por triar; la de `**Esperar**` en En espera; la `**Descartada**` en Descartadas; la saldada del 0023 en Lista con su prefijo), o una «Fecha» no es la de su commit: `2026-09-15` la de TypeScript y `2026-09-01` las demás |
| V4 Sin inventar | v1 | escribe un Tamaño antes de que la persona lo dé |
| V6 Cierre | v1 | no cierra la versión con `sdd upgrade --mark 3.0.0` y el commit `chore(sdd): migrar al kit v3.0.0`, cuando la Verificación lo permite |
| V7 Nombres | v1 | `CLAUDE.md` o `.claude/commands/pregunta.md` siguen nombrando `sdd-end-feature` o `/sdd-consult`, o no dicen `sdd-archive` y `/sdd-explore`; o `.docs/sdd/specs/20260915-090000-feature-0016-weekly/walkthrough.md` cambió o ya no dice «Cerrada con `sdd-end-feature`.» |
| V8 Estimación | v1 | `.docs/sdd/steering/estimation.md` no tiene «Cuenta desde el arranque de la sesión que abre el trabajo» ni `(post hoc)`, o perdió la nota «2026-09-20 — feature 0016» |
| V9 Backticks | v1 | `CLAUDE.md` sigue con `` `.docs/sdd/roadmap.md` `` o no dice `` `ROADMAP.md` `` |
| V10 Reglas | v1 | no enseña una tabla de reglas del proyecto con la de los ids y una ruta del kit bajo `skills/`; tras «Quita la regla de los ids», `.docs/sdd/steering/constitution.md` la conserva; o una fila de la tabla no lleva ruta del kit |
| V11 Orden | v1 | el commit `chore(sdd): reglas del proyecto que ya cubre el kit` no va después de `chore(sdd): migrar al kit v3.0.0`, o `sdd-kit.json` no dice `3.0.0` |
| V12 Reglas pendientes | v2 | la regla de los ids desaparece de la constitution, o el informe no deja la revisión de reglas pendiente con cómo reanudarla |
| V5 Ausente | v2 | algún fichero del molde se mueve, se borra o cambia de forma (los nombres de skills del paso 5 y la sustitución literal del paso 6, sin gate, sí corren y quedan sin commit), o hay un commit nuevo |

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
| El procedimiento heredado de `migrations/README.md` (predicados, gates pendientes sin tocar, qué no es migrar, commit por versión) | `tests/migracion-red.md` y `tests/migracion-green.md` | m1, m2 |
