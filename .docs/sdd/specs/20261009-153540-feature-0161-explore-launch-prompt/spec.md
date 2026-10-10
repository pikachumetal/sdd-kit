---
id: 20261009-153540-feature-0161-explore-launch-prompt
feature: 0161
parent: 0146
proposal: 0131
title: explore, el paso por el roadmap y el prompt de arranque
mode: full
profile: delegate
status: approved
created: 2026-10-09
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-10
---

# Spec — explore, el paso por el roadmap y el prompt de arranque

🦆 Cuando le preguntes algo al kit y la conversación acabe en trabajo, como «¿se podría filtrar las salas libres por planta? Si se puede, lo quiero», el kit lo apuntará primero en el roadmap, con su número, y ya partido si da para más de una feature. Al apuntarlo te dará un texto listo para pegar en otra sesión, con siempre la misma forma: el nombre del cambio, de qué rama sale, la rama nueva, qué tipo de cambio es y las instrucciones, con lo ya decidido; si prefieres seguir en la misma sesión, basta con decir «arráncalo». También podrás pedirlo para cualquier fila pendiente («dame el prompt de la 0013»), y un arreglo pequeño será una fila más, para que conste todo lo que se hace. La sesión que recibe el texto no vuelve a preguntarte lo que ya trae decidido, salvo que al mirar el proyecto encuentre algo que lo contradiga. Solo un cambio de configuración, como subir la versión de una herramienta, sale con su texto sin pasar por el roadmap.

## Capacidades

- Modificadas: `routing` — la puerta de las preguntas pasa a `sdd-explore`; una conversación de explore que acaba en una feature o un patch pasa por el roadmap, y un config da su prompt directo; «¿cómo funciona la exportación?» entra por explore, no por `sdd-rubber-duck`.
- Modificadas: `planning` — el cierre de `sdd-roadmap` da el prompt de arranque de la fila que va primero; «dame el prompt de la <id>» lo da sin escribir nada; un patch pendiente es una fila de «Próximo».
- Modificadas: `capabilities` — explore lee la capacidad por el índice, como la consulta.
- Modificadas: `feature-ids` — explore propone un id sin reservarlo, como la consulta.
- Modificadas: `interviewing` — invocada desde explore, la entrevista confirma con una pregunta, como desde la consulta.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (el nombre de la skill que se teclea y la forma del prompt que lee `sdd-propose`), MODIFIED (nueve requisitos), tres o más capacidades (cinco) · tamaño: ~550 líneas en ~32 ficheros
- Mínimo razonable: ninguna — sin revisor nadie más relee si la tabla «Reglas que se mueven» deja una regla de `sdd-consult` sin destino; lo cubren la pasada de coherencia y el control e1
```

1. **`sdd-consult` se renombra a `sdd-explore` y se reescribe en inglés** (Art. III: se traduce al reescribirla). Cuerpo: los tres modos (entender, sondear con prueba desechable, pensar con `sdd-grilling`), cero artefactos propios, salida durable con aprobación y las mismas red flags y racionalizaciones, traducidas. La `description` pierde «planificar» (es de `sdd-roadmap`). Se conserva `argument-hint`.
2. **Cómo pasa explore al roadmap**: con el trabajo dimensionado, explore invoca `sdd-roadmap` en la misma sesión y le pasa lo hablado (qué, por qué, decisiones tomadas con su literal, carril visto). `sdd-roadmap` hace lo de siempre: propone las filas y espera (`pair` y `delegate`), reserva, publica y cierra con el prompt. Explore no escribe la fila ni reserva: lo hace el roadmap. Un spike (investigación que deja medidas) también es una fila.
3. **Config sale de explore con su prompt directo**, sin id ni fila (como decidió la 0160): título solo con el nombre, rama `feature/<slug>`, `Carril: config`.
4. **«Hazlo ya, aquí» ya no salta el roadmap**: con feature o patch, explore pasa igual por el roadmap, y el «arráncalo» del cierre lo arranca en la sesión con `sdd-propose`. Con config, «arráncalo» invoca `sdd-propose` directo. Un fallo que el usuario pide investigar sigue yendo a `superpowers:systematic-debugging`, como hoy.
5. **El cierre de `sdd-roadmap` da siempre el prompt de la fila que va primero** (paso 7, que hoy solo la nombra), también con «apunta, no lo arranques»: el prompt no arranca nada. Las demás filas, con «dame el prompt de la <id>». Termina con «si prefieres hacerlo en esta sesión, di "arráncalo"».
6. **Forma de `launch-prompt-template.md`** (los campos los fijaste tú; los literales son míos):

   ````text
   **<id> — <nombre>**        (sin id reservado: **<nombre>**)
   Base: `develop`             (`main` para un hotfix; o la que fije el git-flow de la constitution)
   ```text
   <tipo>/<id>-<slug>          (sin id: <tipo>/<slug>)
   ```
   Carril: <config | patch | lite | feature | spike>
   ```text
   Arranca <la 0144 | este cambio> con sdd-propose: <enunciado en una o dos frases>.
   Requisitos en <ruta>, <sección>[, y en la fila <id> del roadmap].
   Decisiones ya tomadas:
   - <decisión con su literal>
   Salda <fila y qué parte> | Nada que saldar.
   Perfil <perfil>. Al fusionar, <`sdd merge --push` | lo que diga merge.* de sdd-kit.json>.
   ```
   ````

   El tipo de rama: `feature` para todo lo que sale de `develop` (también patch y config), `hotfix` para lo que sale de `main`. El perfil sale de lo que dijo el dev-lead para el cambio o, si no, de `sdd-kit.json`; «al fusionar», de `merge.*` de `sdd-kit.json` (`push: true` → `sdd merge --push`). La plantilla lleva su ejemplo relleno con tu caso de la 0144.
7. **Cómo se redacta, mientras no exista `sdd-agent-writing` (0151)**: la plantilla lleva cuatro reglas sacadas de `writing-for-agents`, porque esa skill vive solo en `.agents/skills` de este repo y no viaja a los proyectos: en imperativo y en positivo; cada decisión con su literal; rutas y secciones de los requisitos en vez de copiarlos; nada que el agente lea solo del proyecto. La 0151 las sustituye por invocar su skill (ya lo dice la propuesta: «la invocan… el prompt de arranque»), sin tocar su fila.
8. **Sale por el RED** (enmienda del 2026-10-10): `sdd-roadmap` dimensionaba cada fila que escribe. En m2 y m3, 0 de 4 sujetos escribieron una fila que pasara el umbral; queda como fila de deuda «Esperar 2.º ticket», con la 0131 como primer caso.
9. **Un patch pendiente es una fila de «Próximo»** con «Patch:» al inicio del ítem; la sección «Patches» de la plantilla sigue siendo el registro de los cerrados. El carril de la fila llega al prompt y `sdd-propose` lo respeta si concuerda (0160).
10. **«Dame el prompt de la <id>»** es una entrada nueva de `sdd-roadmap`, la primera de «Qué entrada es»: lee la fila, su propuesta con sus enmiendas y `sdd-kit.json`, y da el prompt. No escribe, no reserva, no publica ni commitea. Si la fila está cerrada (✅, 🧪) o en marcha (🔄 o rama `feature/<id>-*` abierta), lo dice en vez de dar el prompt.
11. **`using-sdd`**: la fila de la pregunta nombra `sdd-kit:sdd-explore`; la de planificar suma «dame el prompt de la <id>».
12. **Sale por el RED** (enmienda del 2026-10-10): `sdd-propose` ya deja las decisiones del prompt en «Decisiones tomadas con el dev-lead» sin preguntarlas (a5, 2 de 2 limpios).
13. **El escenario c2 de `sdd-rubber-duck`** (fila de deuda de la 0145, parte pendiente): control de enrutado «¿cómo funciona la exportación?» en el molde `exportes`, esperado `sdd-kit:sdd-explore`; c1 cambia su esperado a `sdd-kit:sdd-explore`. Si c2 entra por `sdd-rubber-duck`, se ajusta la `description` que solape.
14. **Baterías**: nace `tests/batteries/sdd-explore/` (humo, Art. I: renombrar es editar y se vuelve a medir su entrada) con e1, e2 y e3 sobre el molde `salas` de `using-sdd`; nace `tests/batteries/sdd-roadmap/` con m1 y m2 (humo; `sdd-roadmap` no tenía batería); `sdd-propose` gana a5; `sdd-rubber-duck` gana c2; las de `using-sdd` y `sdd-grilling` cambian `sdd-consult` por `sdd-explore`. La de `using-sdd` se lanza entera, más r6, porque cambian dos `description` de entrada (lección de la 0117).
15. **Topes de palabras** (Art. I, decisión tuya): `sdd-explore` estrena el suyo, medido al terminar y redondeado a la centena de arriba; sale el de `sdd-consult` (900). `sdd-roadmap` (2.600) sube a la centena de arriba de lo medido (dos reglas y una entrada nuevas). `sdd-propose` (4.900), solo si lo pasa. `using-sdd` (570) y `mission.md` (1.700) no suben.
16. **Lo que entra y lo que sale** (Art. I): entran la plantilla, la entrada «dame el prompt» y el prompt en el cierre del roadmap; salen la regla 4 de `CLAUDE.md` de este repo, que pasa a una línea que apunta a la plantilla, «planificar» de la `description` de explore y el traspaso directo de explore a `sdd-propose`.
17. **Referencias que cambian de nombre**: `sdd-propose` (description, paso 2 y una racionalización), `sdd-grilling`, `sdd-templates` (índice de la CLI y fila nueva de la plantilla), `overrides-superpowers.md`, el README (dos líneas), la `description` de `plugin.json`, `mission.md` (glosario: «Carril consult» pasa a «Explore» y nace «Prompt de arranque»; el texto sustituye, no se añade), `architecture.md` (árbol y tabla de documentos) y los Pester `CapabilityRules`, `PlanEntry`, `SingleEntry`, `Skills`, `TaskIds`, `UsingSdd` y `WordBudget`. No se tocan `.docs/workflow/` (0152), las evidencias `tests/sdd-consult-*.md` (artefactos de evento) ni la migración: la v3.0.0 es de la 0157, y el cambio de nombre queda en la entrada del changelog para que la lea.
18. **Un Pester de forma** (principio 4): la plantilla existe con sus partes (título, base, rama, carril, prompt, decisiones) y la nombran `sdd-explore` y `sdd-roadmap`.
19. **Previsión de coste** (Art. I), todo con Sonnet:

    | Paso nuevo o cambiado | Escenario | RED | GREEN |
    | --- | --- | --- | --- |
    | explore: una feature pasa por el roadmap, no se arranca ni da un prompt sin fila | `e3` («¿Se podría filtrar `libres` por planta? Si se puede, lo quiero.») | 2 | 2 |
    | explore: un config da su prompt directo, en la forma de la plantilla | `e2` («¿Podemos subir `node` a 22.18 en los `engines`? Si se puede, lo quiero.») | 2 | 2 |
    | explore: control de lo traducido (entender sin artefactos ni interrogatorio) | `e1` («¿Dónde se cancelan las reservas?») | — | 2 |
    | explore: control de pensar con `sdd-grilling` | `g1`, `g9`, `k1` de la batería de `sdd-grilling` | — | 5 |
    | roadmap: «dame el prompt de la 0013» en la forma de la plantilla | `m1` | 2 | 2 |
    | roadmap: el cierre da el prompt de la primera fila (el dimensionado sale por el RED) | `m2`, `m3` (algo grande con los detalles delegados) | 4 | 4 |
    | propose: decisiones del prompt sin volver a preguntarlas (sale por el RED) | `a5` | 2 | — |
    | rubber-duck: c1 y c2 con el nombre nuevo | `c1`, `c2` | — | 2 |
    | `using-sdd`: batería entera + `r6` («dame el prompt de la 0013») | 21 escenarios | — | 30 |
    | Plantilla y nombres | Pester | — | — |

    Sin escenario, con su motivo: el patch como fila de «Próximo» es la forma de fila vigente con un prefijo, y lo lee `sdd-propose` como ya lee el carril de la petición (0160); «arráncalo» invoca `sdd-propose`, cuya entrada mide su batería; la fila cerrada o en marcha de «dame el prompt» la cubre la red flag vigente de `sdd-roadmap` «vas a reabrir una feature cerrada o en marcha»; el tipo `hotfix` de la rama no tiene molde con `main` de base.

    10 sujetos de RED y 49 de GREEN: ~32 $ (Sonnet ~0,8 $ por sujeto con conversación o spec, ~0,3 $ en la batería de `using-sdd`) y ~4 h de campaña. Techo: 39 $, con ~20 % de reserva. Si un RED no exhibe el fallo, la regla y su THEN salen y te vuelvo a pedir la aprobación; si la prueba pasa del techo, paro y decides tú.
20. **Repaso de coherencia**: el tipo de rama de un patch es `feature` (sale de `develop`, como fija `tech-stack.md` §Git), no `patch/`; el título del prompt sin id no lleva «—»; el prompt sin id solo lo da explore, y solo para config; una petición de cambio directa sigue entrando por `sdd-propose` (0160): solo el trabajo que sale de explore pasa por el roadmap; los MODIFIED de `capabilities`, `feature-ids` e `interviewing` solo cambian el nombre de la skill, y sus Pester (`CapabilityRules`, `TaskIds`) entran en el Scope.

### Decisiones tomadas con el dev-lead

- `sdd-consult` evoluciona a `sdd-explore`, con su puerta en `using-sdd`, sin artefactos — «sdd-consult evoluciona a sdd-explore (renombrado, con su puerta en using-sdd). No deja artefactos» (prompt de arranque, 2026-10-09)
- El prompt de arranque tiene forma fija en `launch-prompt-template.md`: título, base, rama y worktree en su bloque, carril y el prompt en otro bloque — «El prompt de arranque tiene forma fija en launch-prompt-template.md de sdd-templates» (prompt de arranque, 2026-10-09; enmienda de la propuesta 0131 del 2026-10-08)
- Lo dan explore y `sdd-roadmap` con «dame el prompt de la <id>»; `sdd-propose` respeta las decisiones y el carril del prompt si al investigar concuerdan — «propose respeta las decisiones y el carril que trae el prompt si al investigar concuerdan» (2026-10-09)
- Se redacta con el estilo de `writing-for-agents` mientras no exista `sdd-agent-writing` — «de momento, sigue writing-for-agents, que está en .agents/skills» (2026-10-09)
- Salda el escenario c2 de `sdd-rubber-duck`; perfil `delegate`; al fusionar, `sdd merge --push` — «Salda el escenario c2 de sdd-rubber-duck que dejó pendiente la 0146 (fila parcial de la deuda). Perfil delegate. Al fusionar, `sdd merge --push`.» (2026-10-09)
- Lo que acaba en trabajo pasa por el roadmap antes de arrancar, también un patch; config no — «en principio todo va al roadmap antes no? que sino no sabemos que estamos haciendo» y «vale qu econfig no va, pero patch … imputamos horas en el AzureDevOps asi que si necesito TODO» (2026-10-10)
- Siempre el prompt, con una frase para arrancarlo en la sesión, sin clave de configuración — «1» a la pregunta «¿Cómo elige el kit entre arrancar aquí o darte el prompt?» (2026-10-10)
- El dimensionado de cada fila del roadmap entra en la 0161 — «1» a la pregunta «¿Entra en la 0161 que `sdd-roadmap` dimensione cada fila que escribe?» (2026-10-10)
- La sincronización del roadmap con Azure DevOps, GitHub o Jira queda fuera: propuesta propia — «esto que hablamos es otra feature o un proposal… ¿te aprece que lo separamos de esta conversacion y seguimos con lo del prompt?» (2026-10-10)

## Intent

Hoy una conversación de `sdd-consult` que acaba en trabajo lo arranca en la misma sesión, sin fila en el roadmap, y quien abre un worktree en Orca redacta a mano el prompt, cada vez distinto: la sesión nueva no sabe qué está decidido y repite la entrevista. La 3.0.0 llama explore a la consulta: el trabajo que sale de ella pasa por el roadmap, que lo deja en filas y da el prompt de arranque con la forma fija. Pegarlo en un worktree arranca el cambio con el carril y las decisiones que ya traía.

## Scope

- Entra: renombrar y reescribir `sdd-consult` como `sdd-explore`, con su salida al roadmap (feature, patch, spike) o a su prompt (config).
- Entra: `launch-prompt-template.md` en `sdd-templates`, con su fila en el índice.
- Entra: en `sdd-roadmap`, la entrada «dame el prompt de la <id>», el patch como fila de «Próximo» y el prompt en el cierre; la frase nueva de su `description`.
- Entra: `using-sdd` (dos filas), `sdd-propose` (el nombre nuevo), `sdd-grilling`, `sdd-templates`, `overrides-superpowers.md`.
- Entra: `mission.md`, `architecture.md`, README, `plugin.json`, la regla 4 de `CLAUDE.md`.
- Entra: los Pester que nombran `sdd-consult` y uno nuevo de la plantilla; los topes de `WordBudget.Tests.ps1`.
- Entra: baterías nuevas de `sdd-explore` y `sdd-roadmap`; escenarios nuevos en `sdd-propose` (a5), `sdd-rubber-duck` (c2) y `using-sdd` (r6); esperados de `using-sdd`, `sdd-grilling` y `sdd-rubber-duck`.
- No entra: el dimensionado de cada fila del roadmap y la regla de decisiones de `sdd-propose` (salen por el RED, enmienda del 2026-10-10); sincronizar el roadmap con Azure DevOps, GitHub o Jira (propuesta propia); el carril spike y su `research.md` (0163); `sdd-agent-writing` (0151); la migración v3.0.0 (0157); `.docs/workflow/` (0152); una clave de configuración para elegir sesión o worktree.

## Approach

Renombrar con `git mv` para conservar la historia y reescribir el texto en inglés sobre la estructura que ya tiene, cambiando solo el paso del traspaso. La plantilla es la única fuente de la forma (Art. VIII): `sdd-explore` y `sdd-roadmap` la enlazan en el paso que la usa, con la frase operativa en el paso y el detalle en la plantilla (lección de la 0146: una regla que vive solo en una referencia no se aplica). El dimensionado reutiliza el umbral de `sdd-propose`, que `sdd-roadmap` ya cita. Cada regla nueva entra solo si su RED muestra el fallo.

## Dónde se prueba

- Explore pasa una feature al roadmap y da el prompt de un config: sujetos headless de la batería `sdd-explore` (e2, e3), como las baterías de `sdd-propose`.
- Explore conserva lo traducido: e1 y los controles de la batería de `sdd-grilling`.
- «Dame el prompt de la <id>» y el prompt del cierre: sujetos headless de la batería `sdd-roadmap` (m1, m2).
- Enrutado: batería entera de `using-sdd` y c1, c2 de `sdd-rubber-duck`.
- La plantilla y los nombres: Pester, como `PlanEntry.Tests.ps1`.

## Términos y ADR

- Términos resueltos: explore — pensar con el contexto cargado sin dejar artefactos propios (se evita «consulta» como nombre de la skill) · prompt de arranque — el texto que arranca un cambio en otro worktree, con forma fija (se evita «launch prompt» en texto humano)
- ADR candidatas: ninguna

## Reglas que se mueven

Renombrar es editar (Art. I): cada paso, red flag y racionalización de `sdd-consult`, y dónde vive en `sdd-explore`.

| Regla de `sdd-consult` | Dónde vive ahora | Escenario o motivo |
| --- | --- | --- |
| Overview: anti-carril, respuestas ancladas, no sobre-disparar; la pregunta es el enunciado y se puede explorar código desde el inicio | Overview, traducido | e1 |
| Paso 1: contexto proporcional, índice de capacidades, distinguir doc de inferencia | Paso 1, traducido | e1 |
| Paso 2: entender sin interrogatorio | Paso 2, traducido | e1, k1 |
| Paso 2: sondear con prueba desechable etiquetada; si «sí, lo queremos», petición nueva | Paso 2, traducido; «petición nueva» pasa al paso 5 | e3 |
| Paso 2: pensar con `sdd-grilling`, nunca `brainstorming` | Paso 2, traducido | g1, g9 |
| Paso 3: cero artefactos | Paso 3, traducido: la fila la escribe `sdd-roadmap`, no explore | e1, e3 |
| Paso 4: salida durable propuesta y aprobada | Paso 4, traducido | sin escenario: regla vigente traducida, sin cambio |
| Paso 5: traspaso al carril (`sdd-propose`, `sdd-roadmap`, `systematic-debugging`) | Paso 5, **cambia**: feature, patch y spike pasan por `sdd-roadmap`; config da su prompt; un fallo a investigar sigue a `systematic-debugging` | e2, e3 |
| Red flag: carpeta, `patch.md` o rama desde la consulta | Red flags, traducida | e3 |
| Red flag: reproducir un carril a mano | Red flags, traducida | e3 |
| Red flag: id inventado | Red flags, traducida; el prompt de config va sin id | e2 |
| Red flag: editar roadmap o docs sin aprobación | Red flags, traducida: la fila la escribe `sdd-roadmap` con su propia parada | e3 |
| Red flag: interrogatorio a una pregunta puntual | Red flags, traducida | k1 |
| Red flag: `brainstorming` para pensar | Red flags, traducida | g1 |
| Racionalización: «arréglalo, creo yo el `patch.md`» | Tabla, traducida: «arréglalo» pasa por el roadmap como patch | e3 |
| Racionalización: «elijo el siguiente id libre» | Tabla, traducida: el id lo reserva `sdd-roadmap` | e2, e3 |
| Racionalización: «reproduzco el naming a mano» | Se funde con la red flag de reproducir un carril | e3 |
| Racionalización: «actualizo el roadmap de paso» | Tabla, traducida | sin escenario: sin cambio |
| Racionalización: «para estructurar uso `brainstorming`» | Tabla, traducida | g1 |
| Racionalización: «un spike ya es implementar» | Tabla, traducida, con «sondeo» en vez de «spike» (spike es el carril) | e3 |

## Delta de comportamiento

### Capacidad: `routing`

**MODIFIED — Una pregunta entra por explore** (antes: «Una pregunta entra por consult»)
- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pregunta cómo funciona algo, o si algo es posible
- THEN la primera skill que se invoca es `sdd-kit:sdd-explore`

**MODIFIED — El router solo existe donde hay SDD**
- GIVEN una sesión que arranca con el plugin instalado
- WHEN el directorio de trabajo no contiene `.docs/sdd/`
- THEN el hook no inyecta ningún contexto
- AND cuando sí lo contiene, inyecta el texto de la skill `using-sdd`, que es la única fuente de las puertas del kit y nombra `sdd-propose`, `sdd-explore`, `sdd-roadmap`, `sdd-end-release`, `sdd-config`, `sdd-init-greenfield` y `sdd-init-brownfield`

**MODIFIED — Una petición de explicar en llano entra por `sdd-rubber-duck`**
- GIVEN un proyecto con `.docs/sdd/` y el kit instalado
- WHEN el dev-lead escribe «Explícame cómo viaja una exportación de punta a punta, desde que la pido hasta que tengo el fichero»
- THEN la primera skill que se invoca es `sdd-kit:sdd-rubber-duck`
- AND «Oye, ¿cómo está montado lo de cancelar reservas? No lo pillo.» y «¿Cómo funciona la exportación?» entran por `sdd-kit:sdd-explore`

**MODIFIED — Una investigación con evidencia entra por el carril spike**
- GIVEN el molde `reservas`
- WHEN el usuario escribe «¿aguanta `libres` con 1.000 reservas? quiero la tabla de medidas»
- THEN `sdd-propose` lo clasifica como spike y lo anuncia como un full, sin pregunta de confirmación, y sigue como feature full hasta que la 0163 le dé su forma
- AND «¿se puede filtrar `libres` por planta?», sin pedir evidencia, entra por `sdd-explore`

**ADDED — El trabajo que sale de explore pasa por el roadmap**
- GIVEN el molde `salas`, sin fila en el roadmap para filtrar por planta, en `ids.mode: sequence`
- WHEN el usuario escribe «¿Se podría filtrar `libres` por planta? Si se puede, lo quiero.»
- THEN `sdd-explore` responde si se puede y dónde tocaría, y después invoca `sdd-roadmap` con lo hablado: qué, por qué, las decisiones tomadas con su literal y el carril que ve
- AND explore no crea rama, carpeta ni fila, no reserva id ni invoca `sdd-propose`
- AND en la misma conversación, con «y si cancelo una reserva que no existe me dice "cancelada" igual: ¿por qué pasa? Si es un fallo, lo quiero arreglado», tras ver la causa también invoca `sdd-roadmap`, con carril patch

**ADDED — Un config que sale de explore da su prompt directo**
- GIVEN el molde `salas`, con `control.profile: delegate` y `merge.push: true` en `sdd-kit.json`
- WHEN el usuario escribe «¿Podemos subir `node` a 22.18 en los `engines`? Si se puede, lo quiero.»
- THEN `sdd-explore` responde y termina con el prompt de arranque en la forma de `launch-prompt-template.md`: el título «Subir `node` a 22.18», sin id; `Base: develop`; la rama `feature/bump-node-22-18` sola en su bloque; `Carril: config`; y en otro bloque el prompt, que arranca con `sdd-propose`, con «Nada que saldar», `Perfil delegate` y «Al fusionar, `sdd merge --push`»
- AND no escribe fila en el roadmap ni reserva id
- AND termina con «si prefieres hacerlo en esta sesión, di "arráncalo"», y con «arráncalo» invoca `sdd-propose`

### Capacidad: `planning`

**ADDED — Un patch pendiente es una fila de «Próximo»**
- GIVEN un patch que llega a `sdd-roadmap` (desde explore o pedido: «apunta el arreglo de "cancelada" en reservas que no existen»)
- WHEN `sdd-roadmap` lo escribe
- THEN es una fila de «Próximo» con su id reservado y «Patch:» al inicio del ítem, no una fila de «Patches», que registra los cerrados

**ADDED — El cierre del roadmap da el prompt de la fila que va primero**
- GIVEN `sdd-roadmap` que acaba de escribir y publicar filas, en el molde `salas` con `control.profile: delegate` y `merge.push: true`
- WHEN cierra
- THEN su mensaje final da el prompt de arranque de la fila que va primero, en la forma de `launch-prompt-template.md`, también con «apunta, no lo arranques»
- AND termina con «si prefieres hacerlo en esta sesión, di "arráncalo"», y con «arráncalo» invoca `sdd-propose` con esa fila

**ADDED — «Dame el prompt de la <id>» da el prompt de arranque de esa fila**
- GIVEN el molde `salas` con la fila pendiente 0013 «Aviso semanal a los responsables», `proposal: 0010`, `control.profile: delegate` y `merge.push: true` en `sdd-kit.json`
- WHEN el usuario escribe «dame el prompt de la 0013»
- THEN `sdd-roadmap` da el prompt de arranque en la forma de `launch-prompt-template.md`: el título «0013 — Aviso semanal a los responsables»; `Base: develop`; la rama `feature/0013-<slug en inglés>` sola en su bloque; el carril; y el prompt, que arranca la 0013 con `sdd-propose`, con los requisitos en la propuesta 0010 y la fila, las decisiones de la propuesta y sus enmiendas que tocan a la 0013, las filas que salda o «Nada que saldar», `Perfil delegate` y «Al fusionar, `sdd merge --push`»
- AND no escribe en el roadmap ni en la propuesta, no reserva id, no publica ni commitea, y no arranca la feature
- AND si la fila está cerrada (✅, 🧪) o en marcha (🔄 o rama `feature/0013-*` abierta), lo dice en vez de dar el prompt

### Capacidad: `capabilities`

**MODIFIED — Explore lee la capacidad, no las specs** (antes: «La consulta lee la capacidad, no las specs»)
- GIVEN una pregunta de comportamiento ("¿qué hace hoy X?") en `sdd-explore`
- WHEN existe `capabilities/`
- THEN explore ejecuta `sdd capability index`, elige por su propósito la capacidad que cubre X y ancla la respuesta en ese fichero, no en la reconstrucción a partir de specs históricas

**MODIFIED — El índice de capacidades se genera al vuelo**
- GIVEN `.docs/sdd/capabilities/` con `bookings.md`, cuyo propósito es «Reservar, consultar y cancelar salas por franja horaria.», y `rooms.md`, sin `## Propósito`
- WHEN se ejecuta `sdd capability index --path .docs/sdd`
- THEN escribe, en orden de nombre, `` - `bookings` — Reservar, consultar y cancelar salas por franja horaria. `` y `` - `rooms` — (sin propósito) ``, y sale con 0
- AND un propósito escrito en varias líneas sale en una sola, y las líneas de ayuda `>` no salen
- AND un propósito de más de 300 caracteres sale entero: el índice no valida
- AND sin carpeta `capabilities/`, o con la carpeta vacía, escribe `Sin capacidades` y sale con 0
- AND el índice no se guarda en ningún fichero
- AND `sdd-propose`, `sdd-roadmap` y `sdd-explore` lo ejecutan en su paso de contexto, antes de decidir qué capacidades leer o tocar, y abren solo las que eligen con él

### Capacidad: `feature-ids`

**MODIFIED — En modo gestor el id es el del ticket**
- GIVEN un proyecto en modo `tracker` y una skill que necesita un id (`sdd-start-feature`, `sdd-start-patch`, `sdd-roadmap`, `sdd-explore`)
- WHEN el trabajo tiene ticket en el gestor
- THEN el id es el del ticket, y `0000` cuando el trabajo no tiene ticket

**MODIFIED — En modo secuencia el id sale de la reserva o del script**
- GIVEN un proyecto en modo `sequence` y una skill que necesita un id
- WHEN el trabajo tiene fila en el roadmap
- THEN el id es el que reserva esa fila; sin fila, el que reserva `sdd id next --reserve`
- AND en ningún modo se elige un número a ojo. `sdd-explore` puede proponer el siguiente id con el script sin `--reserve`, pero no lo reserva ni lo escribe en ningún artefacto, y el prompt de un config va sin id

### Capacidad: `interviewing`

**MODIFIED — Cuándo para la entrevista**
- GIVEN una entrevista en la que no queda ninguna decisión por preguntar
- WHEN el agente termina
- THEN devuelve a la skill que la invocó dos listas: lo que decidió el usuario y lo que decidió el agente (con su motivo), más lo pendiente
- AND si la skill que invoca tiene gate (spec, documento de la init, propuesta), la confirmación es ese gate: no pide una confirmación propia antes
- AND invocada desde `sdd-explore`, que no tiene gate, confirma con una sola pregunta
- AND no pregunta lo que la petición ya dice o delega, ni lo que puede averiguar leyendo el proyecto

## Enmiendas

- 2026-10-10 — Salen dos reglas y sus THEN: el dimensionado de cada fila en `sdd-roadmap` (ADDED «Cada fila que escribe el roadmap es del tamaño de una feature») y las decisiones del prompt en `sdd-propose` (ADDED «Las decisiones que trae la petición no se vuelven a preguntar») — sus RED salieron limpios: m2 y m3, 0 de 4 filas grandes; a5, 2 de 2 sin repreguntar (Art. I; `tests/sdd-explore-0161-red.md`). Se añade m3 a la batería de `sdd-roadmap` y e2 pasa a pregunta explícita («dame el prompt»): «si se puede, lo quiero» entra con razón por `sdd-propose` — Task 1 — aprobada: «Sácalas»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-10 | aprobada: «Apruebo» |
