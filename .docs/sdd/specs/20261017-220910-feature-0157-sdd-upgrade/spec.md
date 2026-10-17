---
id: 20261017-220910-feature-0157-sdd-upgrade
feature: 0157
parent: 0144
proposal: 0131
title: sdd-upgrade — el hook ofrece la migración y lo determinista va a la CLI
mode: full
profile: delegate
status: approved
created: 2026-10-18
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-18
---

# Spec — `sdd-upgrade`: el hook ofrece la migración y lo determinista va a la CLI

🦆 Hoy, cuando el kit trae una versión nueva, el arranque de la sesión te avisa y tienes que acordarte de pedir que te pongan el proyecto al día, y eso lo hace la skill de empezar proyectos. Pasa a haber una skill propia para actualizar, y el arranque te la ofrece él mismo: «el proyecto está en la 2.3.3 y el kit trae hasta la 2.3.4, ¿lo actualizo?»; si dices que no, atiende lo que le pediste y no insiste en esa sesión. Lo mecánico lo hace la herramienta de línea de comandos del kit: qué actualizaciones faltan y en qué orden (la 0.10.0 va después de la 0.9.0), si ya estás al día, y apuntar la versión aplicada al acabar cada una. Nada se actualiza sin tu «sí», y un paso que borra o mueve algo te pregunta antes aunque su migración no lo marque. La actualización a la 3.0.0 en sí llega en la feature siguiente.

## Capacidades

- Modificadas: `migration` — el aviso ofrece la migración, `sdd-upgrade` migra en vez de `sdd-init`, la ruta de las migraciones, el marcador con `sdd upgrade --mark` y el gate de un paso que borra o reestructura
- Modificadas: `cli` — el verbo `sdd upgrade`, la salida del hook y los límites de `--ignore`
- Modificadas: `routing` — la puerta de `sdd-upgrade`
- Modificadas: `archive` — la ruta de las migraciones en el cierre de un hotfix

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (`sdd upgrade` y la salida del hook, que leen las skills y Claude Code), MODIFIED (ocho requisitos), cuatro capacidades, dato persistente (el marcador de `sdd-kit.json`) · tamaño: ~400 líneas en ~30 ficheros
- Dominio: si la orden de ofrecer del hook choca con la puerta de `using-sdd` cuando la primera petición ya es «actualízame al kit», y si «reestructurar» de la decisión 9 deja hueco (señal: MODIFIED de «La sesión avisa…» + ADDED del gate)
- Técnica: si los literales y códigos de salida de `sdd upgrade` cuadran con las Reglas de `cli`, y si la lista de referencias de la decisión 13 está completa (señal: contrato público + datos)
- Mínimo razonable: un revisor Sonnet con los siete puntos — deja más superficial la lente de dominio sobre cuándo ofrece el agente
```

Elegido por el dev-lead: «Dos: dominio Opus, técnica Sonnet (Recomendada)», 2026-10-18. El delta pasó `sdd capability merge` y `sdd capability check` sobre una copia de `.docs/sdd` antes de la review (19 cambios en cuatro capacidades, `Capacidades válidas: 20`).

1. **Partición** (decisión del dev-lead, abajo): esta feature es la skill, el hook, la CLI y los menores de `sdd init`; `migrations/v3.0.0.md`, la retirada de `roadmap-template.md` y la restauración de los topes van a la 0197, y migrar este repo, a la 0198. Las decisiones del prompt de arranque sobre la migración v3.0.0 (el `estimation.md`, el gate de reglas B6, `sdd-end-*` → `sdd-archive`, las filas Descartada) están en la fila 0197.
2. **La skill `sdd-upgrade` se lleva `migrations/`** a `skills/sdd-upgrade/references/migrations/`, la misma forma que tenía en `sdd-init`. Su procedimiento, hoy en `migrations/README.md`, pasa al `SKILL.md` de `sdd-upgrade`, en inglés (Art. III), y el `README.md` sale. El contenido de los `vX.Y.Z.md` no cambia (describen versiones pasadas).
3. **`sdd-init` deja de migrar**: su predicado 3 («Initialized») pasa a «invoca `sdd-upgrade` con `Skill`; no migres desde aquí», y su `description` pierde «actualízame al kit» y «ponme el proyecto al día», que pasan a la de `sdd-upgrade`. **La pregunta de un proyecto sin marcador tiene una sola dueña, el predicado 4 de `sdd-init`** (documentos 2.x sin `sdd-kit.json`: ¿anterior a la v0.2.0 o init cortada?): con «anterior», invoca `sdd-upgrade`, que las aplica todas; con «init cortada», sigue la init. Si `sdd-upgrade` llega a un proyecto sin `sdd-kit.json` y la pregunta no está respondida en la sesión, invoca `sdd-init`; con ella respondida, aplica todas. Así no hay bucle ni pregunta repetida.
4. **El aviso al usuario** (`systemMessage`) pasa a decir «Para aplicarlas, pide «actualízame al kit».», sin nombrar una skill. **El agente recibe además la orden de ofrecerlo**, literal: «Antes de atender la primera petición, ofrece aplicarlas con una pregunta de sí o no; si la petición ya pide ponerse al día, invoca la skill `sdd-upgrade` sin preguntar. Con el «sí», invoca `sdd-upgrade` y, tras su informe, atiende la petición; con el «no», atiende la petición y no lo vuelvas a ofrecer en esta sesión. Sin ese «sí», no migres. Con `control.profile: unattended` en `.docs/sdd/sdd-kit.json`, no ofrezcas ni migres: atiende la petición y anótalo en tu mensaje final.» — va solo en `additionalContext`, tras el aviso y antes de `using-sdd`, y en castellano, como los demás mensajes del hook. La orden vive en el hook y no en `using-sdd` porque solo aplica cuando hay migraciones pendientes (Art. II, predicado observable); no contradice la puerta de `using-sdd`, que pide invocar la skill antes de preguntar: con «actualízame al kit», la orden manda invocar directamente.
5. **«Antes de la primera petición»**: la oferta va antes de atender lo pedido, no al final. Si fuera al final, el agente ya habría trabajado con skills de una versión cuyo proyecto no está migrado. **«En esta sesión»** dura hasta que el hook se vuelve a inyectar: tras `/clear` o una compactación, Claude Code vuelve a lanzar `SessionStart` y la oferta sale otra vez. Se acepta así: distinguir el origen del arranque añade código para un caso raro. Con los dos avisos a la vez (kit cargado menor que el marcador y migraciones pendientes), la orden es la misma: el primer aviso ya dice que hay que actualizar el plugin.
6. **El verbo `sdd upgrade`**, sin subverbo, como `sdd init`, con `--root` obligatorio. Sin acción, lista las migraciones pendientes, una ruta absoluta por línea, en orden SemVer: la ruta es la de la carpeta del kit cargado, que el agente lee tal cual (la caché del plugin). Con `--mark <versión>` escribe el marcador. Literales: `el proyecto ya está al día con el kit <versión>` (sale con 0), `sin sdd-kit.json: se aplican todas` (seguido de las rutas, sale con 0; un `sdd-kit.json` sin `version` ni `init` cuenta igual), `init en curso: sigue con sdd-init` (sale con 1, no escribe), `.docs/sdd/sdd-kit.json no es JSON válido: no se toca` (sale con 1, el literal de `sdd init`), `--mark <versión>: el kit no trae esa migración` (sale con 2, no escribe), `--mark <versión>: el proyecto ya está en <versión actual>` para una versión igual o menor (sale con 1, no escribe). Un `--mark` sin valor o que no es `X.Y.Z` numérico, una opción desconocida o un `--root` que no existe salen con 2 y el uso, como el resto de la CLI; el formato se valida antes de buscar el fichero, para que `--mark ../x` no forme una ruta. **El contrato es el texto**: una línea de estado nunca es una ruta absoluta, y el agente lee las dos cosas en la misma salida. **Sin `--json`**, como `sdd init`: la salida es una lista que se lee sin parsear, y el requisito «Los verbos de datos dan JSON» no obliga a todos (no lo cumple `init`). Un kit sin carpeta de migraciones no se contempla: el plugin siempre la trae, y la suite falla sin la de su versión.
7. **«Al día» se mide contra la mayor migración del kit cargado**, no contra `plugin.json`: es lo que hace el hook, y durante una release el manifest va por detrás de las migraciones. Salda el menor de la 0156 «"ya está al día" compara con `plugin.json` y el hook con la última migración».
8. **`--mark` escribe** `version`, `channel: plugin` y `updated` con la fecha **local** del día, fusionando: las demás claves se quedan. Rechaza una versión sin su `vX.Y.Z.md` en el kit, para que el marcador nunca diga una versión que no existe. `channel` es siempre `plugin` (decisión 13 de la 0156): el procedimiento pierde la opción `cli` y el canal `npx skills add`.
9. **Un paso sin marca que borra o reestructura es un gate**: es la regla del prompt («pregunta antes de borrar o reestructurar») escrita en `sdd-upgrade`, para que una migración mal marcada no la salte. Predicado observable leyendo el paso (Art. II): **borra un fichero, una sección entera o una clave de un JSON, o cambia la ruta de un fichero** (mover, partir o fundir incluidos). Reescribir sin borrar (sustituir un nombre, añadir una sección) no lo es. **Regla ante conflicto**: un paso que su migración marca «sin gate» manda sobre esta regla; ella cubre solo los pasos sin ninguna marca. Así siguen valiendo los requisitos vivos de la v2.0.0 que quitan el historial y añaden el propósito «sin gate», y los borrados de la v1.0.0, que ya llevan **gate**. «No mueve contenido en bloque» ya lo dice el punto «Qué NO es migrar» del procedimiento (las specs y walkthroughs históricos no se tocan), y se queda.
10. **Commit y marcador por versión**, como hoy: `chore(sdd): migrar al kit vX.Y.Z` cuando sus gates están resueltos; con un gate pendiente, ni commit ni marcador de esa versión ni de las siguientes.
11. **Los menores de `sdd init` de la 0156** (fila de deuda «Menores diferidos de la feature 0156»), salvo el último: `mergeNode` a 3 parámetros; un test con un `settings.json` cuya raíz no es objeto; fuera el cast sobrante de `cli/src/init/verbs.ts`; `updated` con la fecha local (la misma función que `--mark`); `--ignore` rechaza espacios al borde y saltos de línea (sale con 2, como los demás `--ignore` inválidos); `kitVersion` quita el BOM. El de `migrations/v2.0.0.md` («reinvocar `sdd-init-brownfield`») no se toca: describe una versión pasada. El de `--ignore` va en los Límites de `cli`; los demás (el BOM, el `settings.json` con raíz no objeto, que ya cubre el aviso «no se puede fusionar») se prueban solo con tests unitarios, sin requisito nuevo.
12. **Los tests del aviso que pedía la deuda** (fila «Los tests del aviso de migraciones no fijan el orden por SemVer…»): uno con `v0.9.0.md` y `v0.10.0.md` que exige «hasta la 0.10.0», y uno con los dos avisos a la vez. Van en `cli/test/hook/session-start.test.ts`; el `New-KitCopyWithoutMigrations` de Pester ya no existe.
13. **Las referencias a la ruta vieja y a «migra `sdd-init`»** se cambian en la misma task que mueve la carpeta (ticket de la 0156 §5). Hoy: `cli/bin/session-start.js`, `cli/test/fixtures/hook/pending-migration.json` (el aviso), `cli/test/capability/check.test.ts`, `skills/sdd-archive/SKILL.md`, `skills/sdd-end-release/SKILL.md`, `skills/sdd-init/SKILL.md`, los Pester que nombran la ruta (11 hoy, y `ReleaseFlow.Tests.ps1`, que lee el paso de `sdd-end-release`), `tests/MigrationInitParity.Tests.ps1` (lee las migraciones en la ruta nueva y sigue buscando las claves en `sdd-init`, sin contar `skills/sdd-upgrade/`: si contara la carpeta de las migraciones, cada clave se encontraría en su propia migración y la paridad pasaría siempre), `tests/headless/lib.sh`, la batería de `sdd-archive` (`subject.sh` y `battery.md`), `.docs/sdd/constitution.md` (Art. V), `.docs/sdd/mission.md` (glosario, «Migración»: «la ejecuta `sdd-init`…»), `.docs/sdd/architecture.md` (árbol), `.docs/sdd/tech-stack.md` (línea del aviso), `README.md` (la frase de actualizar) y las capacidades del delta. La task acaba con `git grep -n -I -e "sdd-init/references/migrations" -e "al día con sdd-init" -e "ponme el proyecto al día con" -- ':!.docs/sdd/specs' ':!.docs/sdd/field-reports' ':!.docs/sdd/releases' ':!.docs/sdd/changelog*.md' ':!.docs/sdd/roadmap.md' ':!.docs/sdd/decisions' ':!.docs/workflow' ':!tests/*.md' ':!skills/sdd-upgrade/references/migrations'` sin salida. No se tocan las specs, tickets, releases, el changelog, el roadmap ni las campañas `tests/*.md` (son historia), la ADR 0007 (inmutable), los `vX.Y.Z.md` (versiones pasadas) ni `.docs/workflow/usage-guide.md`, cuya frase del aviso es de la 0152, que relee las guías con la 3.0.0.
14. **El Propósito de `migration`** cambia de «El procedimiento vive en `skills/sdd-init/references/migrations/README.md`» a «El procedimiento vive en `skills/sdd-upgrade/SKILL.md`». `sdd capability merge` no fusiona el Propósito: se escribe a mano al cerrar, como en la 0156.
15. **Tope de palabras de la skill nueva**: `sdd-upgrade` con `SkillMd = 900` y `Total = 900` en `tests/WordBudget.Tests.ps1` (el procedimiento de hoy mide 407 palabras; con el gate nuevo, los red flags y la tabla, ~700). Es un tope nuevo, no una subida, pero los topes los fija el dev-lead: lo apruebas con la spec. `sdd-init` sigue con su tope (mide 2.399 de 2.400 y baja). `using-sdd` gana una fila de puerta (~30 palabras): mide 481 de 570.
16. **La puerta de `using-sdd`**: una fila nueva, «Un proyecto ya inicializado quiere ponerse al día con el kit («actualízame al kit», «ponme el proyecto al día»), o acepta la oferta del aviso de migraciones → `sdd-kit:sdd-upgrade`».
17. **Una pieza entra, otra sale** (Art. I): entra la skill `sdd-upgrade` y el verbo `sdd upgrade`; salen `migrations/README.md`, el cuerpo del predicado 3 y las frases de actualizar de `sdd-init`, la regla «orden por nombre de fichero (válido mientras…)», que pasa a la CLI, y el canal `cli` del procedimiento.
18. **Previsión de la prueba** (Art. I), con los dos puntos del ticket de la 0149: cada molde nuevo pasa por `DRY_RUN=1` antes del primer RED, y la previsión cuenta un REFACTOR de n = 2 por cada regla nueva con literal (dos: la orden de ofrecer y el gate de un paso sin marca). Sonnet, como las baterías.

    | Paso nuevo o cambiado | Escenario | RED | GREEN |
    | --- | --- | --- | --- |
    | Orden de ofrecer del hook, rama del «no» | `o1`: marcador `2.3.3`, kit con `v2.3.4.md`, «Mete un filtro por sala en el comando libres.»; `TURN2` «no» | 2 | 2 |
    | Orden de ofrecer, rama del «sí» | `o2`: el mismo molde y petición; `TURN2` «sí» → migra y atiende el filtro | — | 1 |
    | Orden de ofrecer con «actualízame», puerta de `using-sdd` y `description` de `sdd-upgrade` | `u1`: «Actualízame al kit.» con migraciones pendientes (batería de `using-sdd`) | 1 | 1 |
    | `sdd-upgrade`: lista, aplica, `--mark` y commit | `m1` humo: 2.3.3 → 2.3.4, solo marcador | — (no hay skill) | 1 |
    | `sdd-upgrade`: un paso sin marca que borra es gate | `m2`: migración de juguete `v9.9.9.md` con «borra `.docs/sdd/legacy.md`» sin marca, dev-lead ausente | 2 | 2 |
    | `sdd-init` predicado 3 y `description` | control: `i1`, `i2` de `using-sdd` y `n2` de `sdd-init` (R2 «sin migrar») | — | 4 |
    | REFACTOR (2 reglas con literal × n = 2) | `o1`, `m2` | — | 4 |

    Umbral: n de n en cada escenario. La rama `unattended` de la orden y el «no lo vuelvas a ofrecer» en una tercera petición no llevan sujeto: la primera no pregunta a nadie y su conducta es la de no hacer; la segunda pediría tres turnos por sujeto. **Total: 20 sujetos, ~4,5 $ y ~100 min de campaña** (a ~0,2 $ por sujeto, el coste de los 15 de la 0156). Si la prueba lo supera, paro y decides tú (Art. I).
19. **Regla retirada de `sdd-init` → dónde vive ahora** (Art. I: retirar una regla de una skill es editarla):

    | Regla de `sdd-init` | Dónde vive ahora |
    | --- | --- |
    | Predicado 3: «migrate, don't re-initialize» | `sdd-upgrade`, Overview; `sdd-init` predicado 3 la enruta |
    | Predicado 3: «follow `references/migrations/README.md` and nothing else — no inventory, no golden rules, no rewriting documents, no debt table» | `sdd-upgrade`, paso «What isn't migrating» |
    | Predicado 3: «with `version` equal to the loaded kit's, say «el proyecto ya está al día con el kit <versión>» and touch nothing» | `sdd upgrade` (salida literal), y `sdd-upgrade` paso 1; «del kit cargado» pasa a «la mayor migración» (decisión 7) |
    | Red flag: «You're about to migrate a project whose `sdd-kit.json` has `init`» | `sdd upgrade` sale con 1 (`init en curso: sigue con sdd-init`), y red flag de `sdd-upgrade` |
    | `description`: «or when an initialized project asks to update to the kit ("actualízame al kit", "ponme el proyecto al día")» | `description` de `sdd-upgrade` |
    | `README.md` pasos 1-5 y «Al escribir una migración nueva» | `sdd-upgrade/SKILL.md`, uno por uno; el paso 2 («orden por nombre de fichero») a `sdd upgrade` |

### Hallazgos de la review

Dominio (Opus):

- **Aceptado** — (Crítico) la orden de ofrecer pregunta aunque la petición ya sea «actualízame al kit», y `u1` no podría cumplirse → la orden invoca `sdd-upgrade` sin preguntar en ese caso (decisión 4, AND en «El agente ofrece…»), y `u1` corre con migraciones pendientes.
- **Aceptado** — (Crítico) el gate de un paso que borra choca con los «sin gate» vivos de la v2.0.0 → «Regla ante conflicto» de `migration`: un «sin gate» escrito manda; la regla cubre solo los pasos sin marca (decisión 9). Los borrados de la v1.0.0 ya llevan **gate**: ningún requisito vivo cambia.
- **Aceptado** — «reestructurar» no era observable → predicado: borra un fichero, una sección entera o una clave, o cambia una ruta; sustituir un nombre no (decisión 9 y AND del ADDED).
- **Aceptado** — `upgrade` falta en la lista de verbos de «La CLI se ejecuta con Node…» → MODIFIED de ese requisito.
- **Aceptado** — sin salida para `unattended` → la orden no ofrece ni migra y lo anota en el mensaje final (decisión 4, AND y Avisos). Sin sujeto: ver la previsión.
- **Aceptado** — dos dueñas de la pregunta sin marcador → la tiene solo el predicado 4 de `sdd-init`; `sdd-upgrade` la invoca si la sesión no la respondió (decisión 3 y MODIFIED «Un proyecto ya inicializado…»).
- **Aceptado** — `mission.md` (glosario) dice que migra `sdd-init` → a la decisión 13.
- **Aceptado** — con el «sí» no se decía si vuelve a la petición → AND: tras el informe atiende la petición; escenario `o2`.
- **Aceptado** — la paridad, siguiendo enlaces, encontraría cada clave en su propia migración → excluye `skills/sdd-upgrade/` (MODIFIED de la paridad y decisión 13).
- **Aceptado** — «en esta sesión» no sobrevive a `/clear` o una compactación → se acepta el re-ofrecimiento por escrito (decisión 5), y con los dos avisos la orden es la misma.

Técnica (Sonnet):

- **Aceptado** — la lista de referencias estaba incompleta (fixture del hook, `architecture.md`, el recuento de Pester) → decisión 13, con el `git grep` ampliado que la cierra. `.docs/workflow/usage-guide.md` queda fuera, con su motivo.
- **Aceptado** — sin escenario de uso mal formado → ADDED «`sdd upgrade` rechaza un uso mal formado sin tocar nada», con el formato validado antes de buscar el fichero.
- **Aceptado** — `--root` inexistente, `sdd-kit.json` roto o sin `version`, `--mark` hacia atrás → decisión 6 y AND de `--mark`. **Rechazado** el kit sin carpeta de migraciones: el plugin siempre la trae y la suite falla sin la de su versión.
- **Rechazado** — `--json` para `upgrade` → `sdd init` tampoco lo tiene; la salida es una lista que se lee sin parsear, y el contrato es el texto: una línea de estado nunca es una ruta absoluta (decisión 6).
- **Rechazado** — código de salida distinto o `--all` para el caso sin marcador → la pregunta la hace `sdd-init` antes de llegar aquí (decisión 3); el contrato es el texto.
- **Aceptado** — `o1` sin umbral y sin el turno del «no» → umbral n de n y `TURN2`; el «no vuelve a ofrecer» en una tercera petición queda sin sujeto, con su motivo.
- **Aceptado** — «mueve» y «reestructura» sin escenario → predicado observable y AND; el sujeto mide el borrado de un fichero y el REFACTOR reserva cubre el resto.
- **Aceptado** — la fecha local no se podía probar → `today` inyectado como en `sdd init` («Dónde se prueba»).
- **Aceptado** — BOM y `settings.json` sin requisito → se dice que van solo por test unitario (decisión 11).
- **Aceptado** — `MigrationInitParity` cambia de ruta de lectura, no de búsqueda → decisión 13.

### Decisiones tomadas con el dev-lead

- Partir la 0157 en dos: esta y la 0197 (migración v3.0.0, retirada de `roadmap-template.md` y topes) — «Partir en dos (Recomendada)», 2026-10-18
- La migración de este repo va a su fila, tras la migración — «Fila propia tras la migración (Recomendada)», 2026-10-18 → 0198
- Review de la spec con dos revisores, dominio en Opus y técnica en Sonnet — «Dos: dominio Opus, técnica Sonnet (Recomendada)», 2026-10-18
- Aprobación de la spec, con el tope nuevo de `sdd-upgrade` (decisión 15) y la previsión de la prueba (decisión 18) — «Apruebo (Recomendada)», 2026-10-18
- Del prompt de arranque (2026-10-18): carril feature con `sdd-propose`; el hook la ofrece y lo determinista va a la CLI; no migra sin preguntar, no mueve contenido en bloque y pregunta antes de borrar o reestructurar; salda la 0122; el delta va con REMOVED + ADDED para un requisito renombrado y `- REMOVED <línea>` para una cláusula, y se prueba con `sdd capability merge` sobre una copia de `.docs/sdd` antes del gate; la previsión cuenta un REFACTOR de n = 2 por regla nueva con literal y cada molde nuevo pasa por `DRY_RUN=1` antes del primer RED; perfil `delegate`; al fusionar, `sdd merge --push`

## Intent

Actualizar un proyecto al kit pasa en cada release y hoy entra por una skill de onboarding: el aviso del arranque manda a pedir «ponme el proyecto al día con sdd-init», y una sesión que solo migraba no tuvo carril ni id (0122). La migración tiene además reglas que el texto hace a mano y se equivocan: el orden por nombre de fichero se rompe con la `v0.10.0`, y «al día» se medía contra `plugin.json` en la init y contra la última migración en el hook. El éxito: con migraciones pendientes, el agente ofrece migrar antes de nada y no toca el proyecto sin el «sí»; «actualízame al kit» entra por `sdd-upgrade`; el orden, el «al día» y el marcador los da `sdd upgrade`; un paso que borra o reestructura pregunta antes aunque su migración no lo marque. Fracaso aunque funcione: que el agente migre solo porque vio el aviso, o que la oferta tape lo que el usuario pidió.

## Scope

- Entra: la skill `sdd-upgrade` con `references/migrations/` (traslado desde `sdd-init`) y el procedimiento en su `SKILL.md`; el verbo `sdd upgrade` (lista y `--mark`) con sus tests; el hook (`cli/bin/session-start.js`) con la ruta nueva, el aviso nuevo y la orden de ofrecer, y los tests de SemVer y de los dos avisos; `sdd-init` (predicado 3, predicado 4 y `description`); la puerta de `using-sdd`; las referencias de la decisión 13; los menores de `sdd init` de la decisión 11; el tope de la decisión 15; las baterías de `using-sdd` (`u1`) y una nueva de `sdd-upgrade` (`o1`, `o2`, `m1`, `m2`); el delta de cuatro capacidades.
- No entra: `migrations/v3.0.0.md`, la retirada de `roadmap-template.md` y la restauración de los topes (0197); migrar este repo (0198); el texto de los `vX.Y.Z.md` existentes; `.docs/workflow/` (0152); la skill puente de `sdd-project-template` (repo del template).

## Approach

Una skill corta que sigue el procedimiento de siempre, con lo mecánico delegado en `sdd upgrade`: el agente pide la lista de pendientes, lee cada migración y la aplica paso a paso con sus gates, y al acabar cada versión ejecuta su Verificación, escribe el marcador con `--mark` y hace el commit. El hook solo avisa y ordena ofrecer; quien migra es la skill, y solo tras el «sí». `sdd-init` enruta a `sdd-upgrade` en vez de migrar.

## Dónde se prueba

- `sdd upgrade` (lista, orden SemVer, «al día», init en curso, sin marcador, `--mark`, errores de uso): Vitest en `cli/test/upgrade/`, como los de `cli/test/init/`, con proyectos y un kit de juguete en un directorio temporal; la fecha se inyecta como `today`, igual que en `sdd init`.
- Salida del hook (ruta nueva, aviso, orden de ofrecer, SemVer, dos avisos): `cli/test/hook/session-start.test.ts` y sus fixtures `cli/test/fixtures/hook/`.
- Menores de `sdd init`: `cli/test/init/`.
- Que el agente ofrece y no migra sin «sí», y el gate de un paso sin marca: sujetos headless, batería nueva `tests/batteries/sdd-upgrade/` (`o1`, `o2`, `m1`, `m2`).
- La puerta: batería de `using-sdd` (`u1`, y `i1`, `i2` como control); `sdd-init` sin migrar: batería de `sdd-init` (`n2`).
- Tope, rutas y paridad: Pester existentes (`WordBudget`, `MigrationInitParity` y los que nombran la ruta).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna — mover la migración a su skill se deshace igual de fácil

## Delta de comportamiento

### Capacidad: `migration`

**MODIFIED — Cada release lleva su migración** (antes: «`skills/sdd-init/references/migrations/vX.Y.Z.md`»)
- GIVEN una release del kit, cambie o no la estructura de `.docs/sdd/`
- WHEN se cierra la release
- THEN existe `skills/sdd-upgrade/references/migrations/vX.Y.Z.md` con pasos verificables por predicado, o, si la release no cambia nada del proyecto, con la frase «sin cambios en el proyecto», su «Verificación» y su línea `**Escribe**:`
- AND la suite del kit falla si la `version` de `.claude-plugin/plugin.json` no tiene su fichero en esa carpeta

**MODIFIED — Una migración sin cambios solo avanza el marcador** (antes: «el usuario pide «ponme el proyecto al día con sdd-init»»)
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y el kit 2.1.0, cuyo `v2.1.0.md` dice «sin cambios en el proyecto»
- WHEN el usuario pide «actualízame al kit»
- THEN `sdd-kit.json` queda con `version` `2.1.0` y la fecha del día, escritos con `sdd upgrade --mark 2.1.0`, y ningún otro fichero del proyecto cambia
- AND hay un commit `chore(sdd): migrar al kit v2.1.0`

**MODIFIED — La sesión avisa cuando el proyecto tiene migraciones pendientes** (antes: «Para aplicarlas, pide «ponme el proyecto al día con sdd-init».»)
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y una sesión de Claude Code que carga el plugin `sdd-kit` con `v2.1.0.md` como mayor migración en `skills/sdd-upgrade/references/migrations/`
- WHEN arranca la sesión
- THEN el usuario ve «AVISO sdd-kit: el proyecto tiene aplicado el kit 2.0.0 (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la 2.1.0. Para aplicarlas, pide «actualízame al kit».»
- AND el agente recibe el mismo aviso al principio de su contexto, seguido de «Antes de atender la primera petición, ofrece aplicarlas con una pregunta de sí o no; si la petición ya pide ponerse al día, invoca la skill `sdd-upgrade` sin preguntar. Con el «sí», invoca `sdd-upgrade` y, tras su informe, atiende la petición; con el «no», atiende la petición y no lo vuelvas a ofrecer en esta sesión. Sin ese «sí», no migres. Con `control.profile: unattended` en `.docs/sdd/sdd-kit.json`, no ofrezcas ni migres: atiende la petición y anótalo en tu mensaje final.»
- AND con `v0.9.0.md` y `v0.10.0.md` como migraciones del kit y el marcador en `0.9.0`, el aviso dice «hasta la 0.10.0»
- AND con el kit cargado menor que el marcador y migraciones pendientes a la vez, salen los dos avisos, primero el de la versión
- AND con el marcador en `2.1.0`, sin `sdd-kit.json`, con un `sdd-kit.json` en curso (sin `version`) o sin carpeta de migraciones en el kit cargado, no hay aviso de migraciones, y el hook sigue inyectando `using-sdd`

**ADDED — El agente ofrece la migración antes de atender la petición**
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.3.3`, el kit cargado con `v2.3.4.md` como mayor migración, y la primera petición de la sesión «Mete un filtro por sala en el comando libres.»
- WHEN el agente responde
- THEN lo primero que hace es preguntar si aplica las migraciones hasta la 2.3.4, con «sí» y «no» como respuestas
- AND no cambia `sdd-kit.json` ni ningún otro fichero antes de la respuesta
- AND con el «no», atiende la petición por su puerta (`sdd-propose`) y no vuelve a ofrecer la migración en esa sesión
- AND con el «sí», invoca `sdd-upgrade`, que deja `version` en `2.3.4` y su commit, y después atiende «Mete un filtro por sala…» por `sdd-propose`
- AND si la primera petición es «Actualízame al kit.», invoca `sdd-upgrade` sin preguntar antes
- AND con `control.profile: unattended` no pregunta ni migra, atiende la petición y su mensaje final dice que quedan migraciones pendientes hasta la 2.3.4

**MODIFIED — Un proyecto ya inicializado se migra, no se re-inicializa** (antes: «el agente invoca `sdd-init`»)
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` sin la clave `init`, o con `.docs/sdd/mission.md` y sin `sdd-kit.json`, y la petición «actualízame al kit»
- WHEN el agente invoca `sdd-upgrade`
- THEN ejecuta `sdd upgrade --root <raíz>`, que lista las migraciones posteriores a la `version` de `sdd-kit.json` hasta la mayor del kit cargado, en orden SemVer
- AND sin `sdd-kit.json`, la pregunta de si es un proyecto anterior a la v0.2.0, la recomendada, o una init de la 2.x que se cortó la hace el predicado 4 de `sdd-init`: si la sesión aún no la respondió, `sdd-upgrade` invoca `sdd-init`; con «anterior a la v0.2.0», `sdd-upgrade` las aplica todas, y con «init cortada», sigue la init sin migrar
- AND las aplica en orden, con gate por fichero, y al acabar cada versión ejecuta su «Verificación», escribe el marcador con `sdd upgrade --mark <versión>` y hace su commit
- AND no regenera los documentos de anclaje ni vuelca `capabilities/`
- AND con la `version` igual a la mayor migración del kit cargado, `sdd upgrade` escribe «el proyecto ya está al día con el kit <versión>» y el agente no toca nada
- AND un `sdd-kit.json` con la clave `init` no se migra: `sdd upgrade` escribe «init en curso: sigue con sdd-init», y la init sigue por `sdd-init` ([`onboarding`](onboarding.md))
- AND pedida a `sdd-init`, la migración la hace `sdd-upgrade`: `sdd-init` no aplica ninguna migración

**ADDED — Un paso que borra o reestructura pregunta antes aunque su migración no lo marque**
- GIVEN un proyecto en `9.9.8`, un kit con `v9.9.9.md` cuyo paso 1, sin marca **gate**, dice «borra `.docs/sdd/legacy.md`», y la petición «actualízame al kit, el dev-lead no está»
- WHEN el agente llega a ese paso
- THEN `.docs/sdd/legacy.md` sigue en disco y el informe lista el paso como pendiente, con su comando
- AND no hay commit de la migración ni cambia el marcador de `sdd-kit.json`
- AND con el dev-lead presente, presenta el borrado y espera su «sí» antes de ejecutarlo
- AND lo mismo vale para un paso sin marca que borra una sección entera o una clave de un JSON, o cambia la ruta de un fichero; un paso que solo sustituye un nombre, o uno que su migración marca «sin gate», se ejecuta sin preguntar

**MODIFIED — Lo que escribe una migración lo reciben también las init** (antes: «`skills/sdd-init/references/migrations/`»; «sus `references/` salvo `migrations/`»)
- GIVEN una migración de `skills/sdd-upgrade/references/migrations/` que escribe en `sdd-kit.json` u otro fichero del proyecto
- WHEN corre la suite del kit
- THEN la migración declara en su línea `**Escribe**:` cada fichero y cada clave que escribe
- AND la suite falla si una clave declarada no aparece literal en `sdd-init`, contando su `SKILL.md`, sus `references/`, los documentos que estos enlazan salvo `skills/sdd-upgrade/`, `sdd-config` incluido, y los `.ts` de `cli/src/init/`
- AND la suite falla si el texto de una pregunta del catálogo de `sdd-config` aparece en la init o en una migración, o si una de ellas no nombra `sdd-config`

**Reglas de la capacidad**
- **Dónde viven los datos**: las migraciones viven en `skills/sdd-upgrade/references/migrations/vX.Y.Z.md`; la versión aplicada, en `.docs/sdd/sdd-kit.json` del proyecto, que escribe `sdd upgrade --mark`; lo que escribe cada migración, en su línea `**Escribe**:`. La memoria automática, en `~/.claude/projects/<project>/memory/` (o en `autoMemoryDirectory` si el proyecto la redefine), una por repositorio y compartida por sus worktrees; cada entrada es un fichero de memoria indexado en `MEMORY.md`. El roadmap anterior a la migración a v2.3.0, en el commit que nombran el informe y el commit de la migración.
- **Avisos**: la sesión avisa, al usuario y al agente, cuando el kit cargado es menor que el marcador del proyecto (actualizar el plugin) y cuando el marcador es menor que la mayor migración del kit cargado (migrar el proyecto); en el segundo caso el agente ofrece migrar antes de atender la primera petición y no migra sin el «sí», salvo con `control.profile: unattended`, que ni ofrece ni migra y lo anota en su mensaje final; un paso con gate que el dev-lead no responde queda como pendiente explícito en el informe, con cómo reanudarlo; no se ejecuta ni se deja preparado; un paso sin marca que borra un fichero, una sección entera o una clave, o que cambia la ruta de un fichero, es un gate.
- **Regla ante conflicto**: un paso que su migración marca «sin gate» se ejecuta sin preguntar aunque borre o reestructure; la regla del gate de un paso que borra o reestructura cubre solo los pasos sin marca.

### Capacidad: `cli`

**MODIFIED — La CLI se ejecuta con Node y sin dependencias** (antes: «`hook session-start`, `task start|done|brief`» sin `upgrade`)
- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish`, `id next`, `merge`, `estimation log`, `init`, `upgrade`, `session tokens`, `watch subagent|command`, `hook session-start`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`) con una línea de ayuda, y sale con 0
- AND `cli/package.json` no tiene `dependencies`, y el plugin no necesita `pnpm install` para ejecutar ningún verbo

**MODIFIED — El hook de sesión es un verbo de la CLI** (antes: «que es la salida del hook bash con esa entrada: `additionalContext` con `using-sdd`»)
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` en `2.2.0` y el kit cargado en `3.0.0`, con migraciones hasta la `2.3.0`
- WHEN Claude Code arranca la sesión y ejecuta `hooks/hooks.json`
- THEN escribe el JSON de la fixture `cli/test/fixtures/hook/pending-migration.json`: el `systemMessage` de las migraciones pendientes, y `additionalContext` con ese aviso, la orden de ofrecer la migración y `using-sdd`
- AND en una sesión headless con el plugin por `--plugin-dir`, el `hook_response` del stream trae ese `additionalContext`
- AND sin `.docs/sdd/` no escribe nada y sale con 0
- AND con Node 20.11.0 escribe el mismo JSON con `sdd-kit necesita Node 22.18 o posterior; tienes 20.11.0` añadido a `systemMessage`, y sale con 0

**ADDED — `sdd upgrade` lista las migraciones pendientes en orden SemVer**
- GIVEN un kit con `v0.9.0.md`, `v0.10.0.md`, `v2.3.1.md` y `v2.3.2.md` en `skills/sdd-upgrade/references/migrations/`, y un proyecto con `"version": "0.9.0"` en `.docs/sdd/sdd-kit.json`
- WHEN se ejecuta `sdd upgrade --root <raíz>`
- THEN escribe, una por línea, las rutas absolutas de `v0.10.0.md`, `v2.3.1.md` y `v2.3.2.md`, en ese orden, y sale con 0
- AND con el marcador en `2.3.2` escribe `el proyecto ya está al día con el kit 2.3.2` y sale con 0
- AND sin `sdd-kit.json` escribe `sin sdd-kit.json: se aplican todas` y después las rutas de las cuatro, y sale con 0
- AND con la clave `init` en `sdd-kit.json` escribe `init en curso: sigue con sdd-init` y sale con 1

**ADDED — `sdd upgrade --mark` escribe el marcador de una versión**
- GIVEN el mismo kit y un proyecto con `sdd-kit.json` = `{"version": "2.3.1", "channel": "plugin", "updated": "2026-10-01", "ids": {"mode": "sequence"}}`
- WHEN se ejecuta `sdd upgrade --root <raíz> --mark 2.3.2` el 2026-10-18
- THEN `sdd-kit.json` queda con `"version": "2.3.2"`, `"channel": "plugin"`, `"updated": "2026-10-18"` e `ids` como estaba, y escribe `.docs/sdd/sdd-kit.json: actualizado`
- AND con `--mark 2.9.9` escribe `--mark 2.9.9: el kit no trae esa migración`, sale con 2 y no escribe
- AND con `--mark 2.3.1` escribe `--mark 2.3.1: el proyecto ya está en 2.3.1`, sale con 1 y no escribe
- AND con la clave `init` en `sdd-kit.json` escribe `init en curso: sigue con sdd-init`, sale con 1 y no escribe
- AND con `sdd-kit.json` que no es JSON escribe `.docs/sdd/sdd-kit.json no es JSON válido: no se toca`, sale con 1 y no escribe

**ADDED — `sdd upgrade` rechaza un uso mal formado sin tocar nada**
- GIVEN el mismo kit y proyecto
- WHEN se ejecuta `sdd upgrade --root <raíz> --mark`, `sdd upgrade --root <raíz> --mark 2.x`, `sdd upgrade --root <raíz> --mark ../x`, `sdd upgrade --root <raíz> --foo` o `sdd upgrade --root <no existe>`
- THEN cada uno escribe en stderr qué no reconoce y el uso (`uso: sdd upgrade …`), sale con 2 y `sdd-kit.json` no cambia

**Reglas de la capacidad**
- **Dónde viven los datos**: `sdd init` escribe `.claude/settings.json`, `.gitignore` y `.docs/sdd/sdd-kit.json` del proyecto; la versión, de `.claude-plugin/plugin.json` del kit; el bloque de settings, de su constante en `cli/src/init/`. `sdd upgrade` lee las migraciones de `skills/sdd-upgrade/references/migrations/` del kit cargado y escribe solo `.docs/sdd/sdd-kit.json`.
- **Límites**: `--ignore` relativo a la raíz, sin vacío, absoluto, `..`, espacios al borde ni saltos de línea; una acción por llamada; `--mark`, solo una versión `X.Y.Z` numérica, con su `vX.Y.Z.md` en el kit y mayor que la del proyecto.
- **Avisos**: `<clave>: la fija sdd init, se ignora`; `<ruta con puntos>: se deja <valor JSON>`; `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`; `<ruta> no es JSON válido: no se toca`; `<ruta> no se puede fusionar: <ruta con puntos> no es un objeto`; `el proyecto ya está al día con el kit <versión>`; `sin sdd-kit.json: se aplican todas`; `init en curso: sigue con sdd-init`; `--mark <versión>: el kit no trae esa migración`; `--mark <versión>: el proyecto ya está en <versión>`.
- **Regla ante conflicto**: en `settings.json`, la hoja que ya existe manda sobre la de la init, salvo `autoMemoryEnabled` con `--memory-off`; en `sdd-kit.json`, `channel` y `updated` los fija la CLI, `version` la fija la CLI salvo que ya exista (la de un template), y en el resto gana el `--config`; con `sdd upgrade --mark`, `version` es la que se marca y el resto de claves se queda.

### Capacidad: `routing`

**MODIFIED — El router solo existe donde hay SDD** (antes: «nombra `sdd-propose`, `sdd-explore`, `sdd-roadmap`, `sdd-end-release`, `sdd-config` y `sdd-init`»)
- GIVEN una sesión que arranca con el plugin instalado
- WHEN el directorio de trabajo no contiene `.docs/sdd/`
- THEN el hook no inyecta ningún contexto
- AND cuando sí lo contiene, inyecta el texto de la skill `using-sdd`, que es la única fuente de las puertas del kit y nombra `sdd-propose`, `sdd-explore`, `sdd-roadmap`, `sdd-end-release`, `sdd-config`, `sdd-init` y `sdd-upgrade`

**ADDED — Ponerse al día con el kit entra por `sdd-upgrade`**
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.3.3`, sin la clave `init`, el kit cargado con `v2.3.4.md` y el hook de sesión activo
- WHEN el usuario escribe «Actualízame al kit.»
- THEN la primera skill que se invoca es `sdd-kit:sdd-upgrade`

### Capacidad: `archive`

**MODIFIED — Un hotfix se cierra en la rama estable solo con la frase del dev-lead** (antes: «con `skills/sdd-init/references/migrations/`»)
- GIVEN el repo del kit, con `skills/sdd-upgrade/references/migrations/`, la rama `hotfix/0200-fix-login` salida de `main`, y el dev-lead que dijo «fusiona el hotfix del login en main, etiquétalo v3.0.1 y publícalo»
- WHEN se cierra
- THEN ejecuta `sdd merge --check --into main` en las comprobaciones previas, y antes de fusionar pregunta «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?»
- AND con la respuesta «sí, la clave `auth.sameSite`», escribe el paso en `migrations/v3.0.1.md` antes de etiquetar
- AND hace `git fetch` y ejecuta `sdd merge --branch hotfix/0200-fix-login --into main --tag v3.0.1 --order "fusiona el hotfix del login en main, etiquétalo v3.0.1 y publícalo" --push`
- AND si la frase no pide publicar, va sin `--push`, aunque `merge.push` sea `true`; sin ninguna frase del dev-lead, no fusiona en `main`
- AND en un proyecto sin esa carpeta de migraciones, el paso que pide el patch va al mensaje final como pendiente del dev-lead
- AND con `vuelta: conflicto en <ficheros>`, el cierre queda «No terminado»: una persona porta el arreglo a `develop` y relanza el hotfix

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-18 | aprobada: «Apruebo (Recomendada)» |
