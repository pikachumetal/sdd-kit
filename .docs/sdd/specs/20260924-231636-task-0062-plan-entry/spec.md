---
id: 20260924-231636-task-0062-plan-entry
task: 0062
title: sdd-plan, una sola puerta de entrada al roadmap, con el carril proposal
mode: full
status: approved
created: 2026-09-25
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-25
---

# Spec — `sdd-plan`, una sola puerta de entrada al roadmap, con el carril `proposal`

## Decisiones que he tomado yo — valida estas

Review de spec: dos revisores Sonnet, una lente cada uno (el dev-lead eligió «Dos revisores Sonnet (Recomendada)», 2026-09-25). Señales: capacidad nueva (`planning`), contrato público (la carpeta `-proposal-` que lee `Get-NextSddId.ps1` y el campo `proposal:`), MODIFIED (nueve requisitos en `release-flow`, `roadmap` y `task-ids`) y tres o más capacidades (cinco). Los tipos `sdd-kit:effort-*` no están en esta sesión: despacho `general-purpose` con `model: sonnet` y la frase «effort: no disponible en este harness, hereda el de la sesión» (ruling).
- Dominio: si la sección de release de `sdd-plan` (decisión 13) recoge lo que `sdd-start-release` hacía y aún sirve, y si el reparto sin estado (decisión 6) deja la propuesta legible con varias features cerradas (señal: capacidad nueva + MODIFIED)
- Técnica: si el MODIFIED de «La reserva precede a la rama y a la carpeta» casa con cómo `Get-NextSddId.ps1` trata la rama actual, y si el contrato de lectura con `proposal-<id>-` y los tres tests que hoy leen `sdd-start-release` quedan cubiertos (señal: contrato público + MODIFIED)
- Mínimo razonable: un revisor con las dos lentes — deja sin mirada independiente las cinco entradas, que son lo nuevo de verdad

### Hallazgos de la review

- **Aceptado** — (dominio, Crítico) la sección de release perdía las fuentes del inventario de `sdd-start-release` (acta anterior, deuda técnica, action items de la retro) → decisión 13 las lista, con el criterio de la deuda y el orden por riesgo.
- **Aceptado** — (dominio, Crítico) el reparto sin estado deja de listar las features que crean las enmiendas → decisión 6: el reparto es la lista completa, cada enmienda le añade o aparca filas, y el estado se cruza con el roadmap.
- **Aceptado en parte** — (dominio, Importante) el ADDED de `routing` choca con «Una petición de trabajo entra por el kit» para peticiones pequeñas → decisión 3 fija el criterio por el verbo (hacerlo ya → `sdd-start-task`; dejarlo en el roadmap → `sdd-plan`). No es MODIFIED: los ejemplos del requisito vigente («añade…», «hazme…») siguen yendo a `sdd-start-task`.
- **Aceptado** — (dominio, Importante) el escenario de la reunión no decía qué pasa con «email al cancelar» → nuevo AND: fila nueva con id reservado y `proposal:`, igual que la franja mínima.
- **Aceptado** — (dominio, Importante) las racionalizaciones probadas de `sdd-start-release` se perdían → decisión 13 las porta a `sdd-plan` y dice dónde se miden.
- **Aceptado** — (dominio, Menor) el Intent cita «`sdd-start-task` partiendo» y el Scope no dice qué pasa con él → decisión 3: `sdd-start-task` no cambia y sigue proponiendo partir.
- **Aceptado** — (técnica, Crítico) la regla del renombrado generalizaba a «otro id», que el RED no midió como fallo (p8 salió limpio 2/2) → decisión 15 y el MODIFIED de `task-ids` se acotan a la rama sin id; p8 queda como control en el GREEN.
- **Aceptado** — (técnica, Importante) el patrón citado perdía el sufijo alfabético `[a-z]*-` del vigente → decisión 16 cita el patrón completo; el test Pester nuevo incluye un `proposal-0020a-` heredado.
- **Rechazado** — (técnica, Importante) `nombrado.md` no documentaba `proposal` → ya estaba en el Scope («el carril `proposal` en `nombrado.md`»); la decisión 5 lo dice ahora explícito.
- **Aceptado** — (técnica, Menor) el contrato de lectura de `task-ids` no se nombraba fuera del delta → el Approach dice que cambia a la vez que el script.

1. **Lo que decide el RED** ([`tests/sdd-plan-red.md`](../../../../tests/sdd-plan-red.md), 22 sujetos, 5,92 $). Seis frentes fallan y llevan guía: la propuesta (2/2 dejan las reglas del cliente en un bloque suelto del roadmap), los items del gestor (2/2 sustituyen la fila 0013 por la 4514 sin preguntar y 2/2 no proponen partir la épica), el acta de la reunión (2/2 no la guardan), «prepara la release» sin `sdd-start-release` (2/2 acaban en `sdd-end-release`), la rama sin id (2/2 commitean el fix en `feature/fix-sala`) y el cambio de definición (2/2 reescriben la propuesta y 2/2 arrancan una spec que nadie pidió). **Se recortan dos guías** que salieron limpias 2/2 de una fuente no incidental: la comprobación de «tras NNNN» al arrancar (el paso 1 de `sdd-start-task` ya lee el roadmap y la fila lo dice) y la reproducción con una entrada mínima en el paso 1 de `sdd-start-patch` (los dos sujetos ejecutaron `toHours('90 min')` antes de tocar nada). Las dos se repiten en el GREEN como control de no regresión (Art. I).
2. **La skill se llama `sdd-plan`** y su `description` recoge los disparadores de las cinco entradas y de «prepara la release», «qué entra en la siguiente entrega», «tengo las notas de la reunión». `hooks/router.md` gana la línea «Planificar, meter algo en el roadmap o preparar una release → `sdd-kit:sdd-plan`», porque el RED de p6 muestra que la palabra «release» arrastra a `sdd-end-release`.
3. **Cómo distingue la entrada**, por lo que trae la petición y sin preguntarlo:
   - Un **id de gestor** (`ids.mode: tracker` e ids en la petición): items del gestor.
   - **Notas o acta de una reunión**: reunión.
   - Solo **filas que ya existen** («reordena», «mueve», «la X va tras la Y», «quita»): reordenar o cambiar.
   - **«Prepara la release», «qué entra»**: el scope de una release.
   - Lo demás, según el tamaño: si cabe en una feature, es **algo concreto**; si prevé más de una, es **algo grande**.
   El umbral de «más de una feature» es el mismo que ya usa `sdd-start-task` para proponer partir (más de 3 tasks internas).
   Frente a `sdd-start-task`, el criterio es el verbo: hacerlo ya («añade», «hazme», «arréglalo») sigue siendo `sdd-start-task`; dejarlo en el roadmap («apunta», «organízalo», «planifica», «no lo arranques») es `sdd-plan`. `sdd-start-task` no cambia: si alguien lo invoca con algo grande, su primera pregunta sigue proponiendo partir, como hoy.
4. **Algo grande**: entrevista con la técnica de `superpowers:brainstorming` (una pregunta por turno, con la recomendada primero) y un override escrito en la skill: la entrevista nunca acaba en spec ni en `writing-plans`, acaba en `proposal.md` y en filas del roadmap. Si el usuario da los detalles o delega («decide tú»), no se pregunta lo que ya está dicho.
5. **Carril `proposal`**: carpeta `specs/<yyyyMMdd-HHmmss>-proposal-<id>-<slug>/proposal.md`, documentada en el patrón de `nombrado.md` (`(task|patch|proposal)`) y calcada de una plantilla nueva, `proposal-template.md`, en `sdd-templates` (Art. VIII). Nace en dos casos: algo grande y una reunión con el cliente. El `<id>` sale de la misma secuencia que tasks y patches (`Get-NextSddId.ps1 -Reserve`) o, en `tracker`, es el id de la épica en el gestor. La propuesta no tiene walkthrough ni cierre.
6. **Qué lleva `proposal.md`**:
   - **Por qué**.
   - **Reglas de negocio**, cada una con un ejemplo con datos de entrada y de salida.
   - **Capacidades que toca**.
   - **Reparto**: orden, id, título y «tras NNNN» de cada feature. Es la lista completa de features de la propuesta: una enmienda que crea una feature le añade su fila, y una que aparca una la marca «aparcada por la enmienda del <fecha>» sin borrarla.
   - **Acta**, solo si viene de una reunión: las notas literales, con fecha y asistentes.
   - **Enmiendas**, fechadas y la más reciente arriba.
   Sin deltas formales. El reparto **no lleva estado** (⏳, ✅), porque el estado vive solo en el roadmap: así el cierre de una task no tiene que tocar la propuesta, y `sdd-end-task`, que es de la 0068, no cambia. Para ver qué queda, se cruzan los ids del reparto con sus filas del roadmap.
7. **Las features apuntan a su propuesta** con `proposal: <id>` en el frontmatter de `spec.md` (campo opcional nuevo en `spec-template.md`) y con «`proposal: <id>`» en la celda «Ítem» de su fila.
8. **La definición cambia a mitad**: `sdd-plan` añade una enmienda fechada (qué regla cambia, el valor anterior y el nuevo, con su ejemplo con datos, y quién lo pidió) y no reescribe «Reglas de negocio» ni el acta. Re-parte **solo lo pendiente**: una feature cerrada (✅ o 🧪) no se reabre, y lo que el cambio le pida va a una fila nueva. Una feature en marcha (rama abierta o 🔄) tampoco se toca: el trabajo va a una fila nueva «tras» ella, como ya hacía replanificar.
9. **`sdd-plan` no arranca nada**: ni rama, ni carpeta de task, ni spec, ni código. Termina en el roadmap, y en `proposal.md` si toca. Arrancar es `sdd-start-task` o `sdd-start-patch`, y el mensaje final dice con cuál y qué fila va primero.
10. **Reglas del roadmap que fija `sdd-plan`**:
    - Una fila existente no se borra, no se sustituye y no se fusiona con otra sin preguntar. Un duplicado se señala en la pregunta.
    - Un descarte es `⏸️ aparcada: descartada por <quién>, <fecha>`, con el estado que ya existe en `roadmap-template.md`.
    - La dependencia va en la celda «Ítem» como «tras NNNN», sin columna nueva ni columna de responsable.
    - Los ids salen de una sola reserva `-Reserve -Count N` en `sequence`, y del gestor en `tracker`: nunca inventados.
11. **Items del gestor grandes**: `sdd-plan` propone la partición **ahora**, en la misma respuesta, como hijos que el PM crea en el gestor. En el roadmap no pone ids inventados: la fila de la épica lleva la partición propuesta hasta que existan los hijos.
12. **Proponer no es decidir**, como en `sdd-start-release`. En `pair` y `delegate`, `sdd-plan` presenta los cambios (filas, propuesta, partición) y espera la decisión del usuario antes de escribirlos. Un «decide tú» o «no hay nadie a quien preguntar» cuenta como decisión delegada: escribe y deja las decisiones que tomó en la propuesta o en el cuerpo del commit. En `unattended`, la opción más conservadora, registrada. La publicación de la reserva sigue la regla vigente de replanificar: un commit que solo toca `roadmap.md` (y `proposal.md` si la hay) en la rama de integración, antes de arrancar nada.
13. **«Prepara la release»** hereda lo que `sdd-start-release` hacía y aún sirve:
    - Las fuentes del inventario: el Backlog, la deuda técnica (entra solo si es prerrequisito de un item del scope o por decisión explícita), y el acta y los action items de la retro de la release anterior si existe `releases/<última>/feedback.md`.
    - El orden: riesgo primero, después coste-beneficio, contando dependencias.
    - El inventario ordenado, con los bloqueos marcados.
    - El scope, que decide el usuario.
    - La sección `## Release <N>` con la tabla de `roadmap-template.md`.
    - La pregunta de `release.hasRecipient`.
    - El estado comprometida / en preparación.
    - La lectura del estado real antes de replanificar (rama de integración y ramas `feature/*`).
    Se quedan fuera, porque ya lo hacen otros: refinar la primera task (lo hace su arranque) y abrir `[Unreleased]` (lo hace `add-to-changelog`).
    Las red flags y racionalizaciones de `sdd-start-release` que siguen aplicando pasan a `sdd-plan`, aunque este RED no las mida: comprometer sin que lo diga el usuario, obedecer el énfasis de un stakeholder, arrastrar la deuda entera, un documento de scope aparte del roadmap, replanificar con el roadmap del worktree, tocar una task en marcha y un id inventado. «Specs en batch» se sustituye por la regla más estricta de la decisión 9. Las mide el A/B vigente de `tests/sdd-start-release-ab.md`; en el GREEN las vigila p6, con la release 1.3 y `hasRecipient: true`.
14. **Retirada de `sdd-start-release`**:
    - Se borra la carpeta de la skill, con sus dos `references/`.
    - Se cambian las menciones en el README, `sdd-consult` (el handoff), `feedback-template.md`, `roadmap-template.md`, `architecture.md`, `mission.md` y `.docs/workflow/`.
    - Se actualizan los tests que la leen (`TaskIds`, `ReleaseFlow`, `MigrationInitParity`) para que lean `sdd-plan`.
    - `WorkflowDocs.Tests.ps1` gana `sdd-start-release` en su lista de artefactos retirados.
    - `tests/sdd-start-release-ab.md` se queda como histórico.
    - `migrations/v1.2.0.md` gana un paso sin gate que solo avisa: «`sdd-start-release` ya no existe: "prepara la release" y replanificar son `sdd-plan`».
15. **Renombrar la rama tras reservar el id**, en `nombrado.md` (lo leen task y patch) y en el paso 2 de `sdd-start-patch`, que es donde falló. La regla, acotada a lo que midió el RED: si la rama actual no lleva ningún id y no tiene commits propios frente a la rama de integración, se renombra con `git branch -m feature/<id>-<slug>` antes del primer commit, y se dice. Con commits propios, no se renombra: se avisa y se sigue. La rama con el id de otra fila (p8, el caso del ticket 0066 §2) salió limpia 2/2 —los sujetos abren una rama nueva con el id reservado—, así que no lleva guía y se repite en el GREEN como control.
16. **`Get-NextSddId.ps1` reconoce el carril `proposal`**: el patrón de carpetas pasa de `-(?:task|patch)-(\d{4})[a-z]*-` a `-(?:task|patch|proposal)-(\d{4})[a-z]*-`, conservando el sufijo alfabético heredado, con un test Pester nuevo (hoy propone `0020` con `proposal-0020` en disco) y otro para un `proposal-0020a-` heredado. `Build-EstimationLog.ps1` ya ignora las carpetas `-proposal-`, porque solo lee `task|patch|hotfix` con su walkthrough o su `patch.md`. Lo compruebo con una fixture en el plan y, si es así, no hay nada que anotar para la 0068.
17. **Capacidad nueva `planning`** para las entradas, la propuesta y las reglas del roadmap de `sdd-plan`. Reciben MODIFIED `release-flow` (los tres requisitos que nombran `sdd-start-release`, y «La reserva se publica antes de arrancar», que ahora admite `proposal.md` en el commit), `task-ids` (la secuencia compartida con las propuestas, la reserva al planificar, el modo gestor, la reserva que precede a la rama y el contrato de lectura del script) y `roadmap` (la sección de release). `routing` recibe el ADDED de la entrada por `sdd-plan`. Los otros tres requisitos de replanificar de `release-flow` no nombran la skill y no cambian. Al fusionar, la entradilla de `release-flow`, que cita `sdd-start-release`, se actualiza.
18. **No toco lo que es de otras tasks, y lo anoto**:
    - **0063**: la línea 11 de `sdd-end-release/SKILL.md` nombra `sdd-start-release`.
    - **0058**: el Art. IV de `constitution.md` fija el naming `(task|patch)` y tendrá que decir `(task|patch|proposal)`. Lo propongo al integrar develop en el cierre, si la 0058 ya se fusionó; si no, queda como pendiente.
    - **0064**: el renombrado task → feature. Aquí la unidad sigue llamándose task en todo el texto nuevo.
19. **GREEN**: los mismos 11 escenarios con 2 sujetos cada uno, 22 sujetos, dentro de la previsión común (~40 sujetos, ~15 $; techo 50 y 25 $). Van con los guiones del RED, salvo p6, que corre ya sin `sdd-start-release` en los dos brazos.

### Decisiones tomadas con el dev-lead

- Tres verbos (planificar → hacer → entregar), las cinco entradas, la entrevista con override, el carril `proposal` con enmiendas fechadas y sin deltas, «tras NNNN» sin columna de responsable, la retirada de `sdd-start-release`, los ids (`tracker` en empresa, secuencia en personal), el renombrado de la rama y la reproducción mínima, y que la unidad sigue llamándose task: consulta del 2026-09-24/25, en la petición de arranque.
- Seguir entera, sin partirla: primera pregunta de la task, 2026-09-25, opción «Seguir entera».
- Previsión y techo comunes de la campaña: «Adelante (Recomendada)», 2026-09-25.

## Intent

Hoy, meter trabajo en el roadmap tiene tres puertas a medias (`sdd-start-release`, `sdd-start-task` partiendo y `sdd-consult`), y el dev que no piensa en niveles no sabe cuál usar. En el RED, lo grande acabó con las reglas del cliente sueltas en el roadmap, las notas de una reunión se perdieron, un item de Azure borró una fila y «prepara la release» acabó en el cierre de release. Se quiere una sola puerta, `sdd-plan`, que reconozca qué le traen y deje el roadmap listo para `sdd-start-task`, con la definición de lo grande en un artefacto histórico que no se reescribe.

## Scope

- Entra: la skill `sdd-plan` (las cinco entradas y el scope de release), `proposal-template.md` y el campo `proposal:` de `spec-template.md`, el carril `proposal` en `nombrado.md` y en `Get-NextSddId.ps1` con su test, «tras NNNN» y la sección de release en `roadmap-template.md`, la línea del router, la retirada de `sdd-start-release` con sus menciones y tests, el aviso en `migrations/v1.2.0.md`, el renombrado de la rama en `nombrado.md` y en el paso 2 de `sdd-start-patch`, y la campaña GREEN.
- No entra: el renombrado task → feature (0064); `sdd-end-release` y el acta de su paso de demo (0063); `constitution.md` y `tech-stack.md` (0058); `sdd-end-patch`, `patch-template.md` y `capabilities/` (0067, la fusión de este delta va al cierre); `Build-EstimationLog.ps1` y el cierre de `sdd-end-task` (0068); `control-profiles.md` (patch del cruce de ficheros). Tampoco un texto nuevo en `sdd-start-task` para «tras NNNN» ni en el paso 1 de `sdd-start-patch` (recortados por el RED).

## Approach

Una skill de proceso nueva, con la forma que pide cada fallo (Art. II): contrato de salida para la propuesta y el roadmap (fallos de forma: reglas sin datos, acta perdida, enmienda reescrita) y prohibición con racionalizaciones para lo que es disciplina (borrar o sustituir filas, arrancar una spec, inventar ids). La tabla de racionalizaciones se construye con las frases del RED. Lo que `sdd-start-release` aportaba se traslada a `sdd-plan` en su sección de release, no a una referencia aparte. Lo común con replanificar (estado real, task en marcha, reserva publicada) pasa tal cual. El contrato de lectura de `task-ids` (la regla que lista qué nombres cuenta el script) cambia a la vez que el patrón de `Get-NextSddId.ps1`, para que no se desincronicen tras el merge.

## Delta de comportamiento

### Capacidad: `planning` (nueva)

**ADDED — Algo grande acaba en una propuesta y en filas, no en una spec**
- GIVEN «queremos cobrar a los clientes externos: tarifa por sala, factura mensual y bloqueo por impago a los 30 días», en `ids.mode: sequence`, con la última fila en 0013
- WHEN `sdd-plan` termina, con los detalles dados o delegados
- THEN existe `specs/<ts>-proposal-0014-<slug>/proposal.md` con el porqué, las reglas, las capacidades y el reparto, y las features ocupan las filas 0015 en adelante, cada una con «`proposal: 0014`» y su «tras NNNN»
- AND cada regla lleva un ejemplo con datos: «Acme, 3 h en Norte (40 €/h) y 2 h en Sur (25 €/h) en agosto → factura del 1 de septiembre por 170 €»
- AND no hay rama nueva, ni carpeta de task, ni `spec.md`

**ADDED — Algo concreto es una fila, sin propuesta**
- GIVEN «apunta en el roadmap: exportar las reservas a CSV. No la arranques»
- WHEN `sdd-plan` termina
- THEN el roadmap tiene una fila más con ese ítem, y no hay carpeta `-proposal-` ni `spec.md`

**ADDED — Los items del gestor entran con su id y no pisan filas**
- GIVEN `ids.mode: tracker`, un roadmap con la fila 0013 «Aforo de cada sala en `salas libres`» y los items 4512 (CSV), 4513 (facturación: tarifas, factura, avisos, bloqueo y portal) y 4514 (aforo en `salas libres`)
- WHEN `sdd-plan` los mete en el roadmap
- THEN 4512, 4513 y 4514 van con esos ids, sin reservar ninguno con el script
- AND la fila 0013 sigue ahí: el posible duplicado con 4514 se pregunta, no se resuelve borrando
- AND la respuesta propone ya la partición de 4513 en hijos para que el PM los cree en el gestor, y el roadmap no lleva ids inventados para ellos

**ADDED — Una reunión deja su acta en una propuesta y sus cambios en el roadmap**
- GIVEN las notas «1) la 0012 ya no la quieren; 2) exportar a CSV, lo primero; 3) email al cancelar; 4) franja mínima de 30 minutos»
- WHEN `sdd-plan` las refleja
- THEN existe `specs/<ts>-proposal-<id>-<slug>/proposal.md` con las notas literales en «Acta» y la regla «franja mínima de 30 min» con su ejemplo con datos
- AND la fila 0012 queda `⏸️ aparcada: descartada por el cliente, <fecha>`, no borrada
- AND la fila del CSV queda primera entre las pendientes, y el email al cancelar y la franja mínima tienen cada uno su fila nueva con id reservado y «`proposal: <id>`»
- AND no se abre ninguna sección de release que nadie pidió

**ADDED — Reordenar escribe la dependencia en la fila**
- GIVEN las filas pendientes 0012, 0013, 0014 y 0015
- WHEN el usuario pide «la 0014 primero, y la 0015 no empieza hasta que esté la 0012»
- THEN el orden es 0014, 0012, 0013, 0015 y la celda «Ítem» de la 0015 lleva «tras 0012»
- AND ninguna otra fila cambia

**ADDED — Un cambio de definición es una enmienda y re-parte solo lo pendiente**
- GIVEN la propuesta 0020 con el reparto 0021 (✅), 0022 (⏳, «Factura mensual») y 0023 (⏳)
- WHEN el cliente pide «factura quincenal, el 1 y el 16, y de 8 a 14 h un 20 % más cara»
- THEN `proposal.md` gana en «Enmiendas» una entrada con la fecha que dice «Factura mensual → quincenal (días 1 y 16)» y «recargo del 20 % de 8 a 14 h: Norte 13-15 → 48 + 40 = 88 €», y «Reglas de negocio» no cambia
- AND la fila 0021 no cambia; la 0022 cambia su ítem; el recargo va a una fila nueva con «`proposal: 0020`»
- AND no hay rama nueva, ni carpeta de task, ni `spec.md`

**ADDED — Preparar una release fija el scope en el roadmap**
- GIVEN un roadmap con las filas pendientes 0012 y 0013, un Backlog y `release.hasRecipient: true`
- WHEN el usuario pide «prepara la release 1.3: qué entra de lo que tenemos»
- THEN `sdd-plan` presenta el inventario ordenado con los bloqueos y espera a que el usuario decida el scope
- AND, decidido, escribe `## Release 1.3` con la cabecera `| id | Task | Origen | Ficheros que toca | Estado |` y el estado «en preparación», salvo que el usuario diga que está comprometida

**Reglas de la capacidad**
- **Dónde viven los datos**: el índice, en `.docs/sdd/roadmap.md`. La definición de lo grande y el acta de una reunión, en `.docs/sdd/specs/<ts>-proposal-<id>-<slug>/proposal.md`. El estado de cada feature, solo en el roadmap.
- **Idioma de los nombres**: el carril es `proposal` y el campo del frontmatter, `proposal:`, en inglés, como `task` y `patch`. El texto va en castellano.
- **Límites**: `sdd-plan` no crea ramas, carpetas de task ni specs. Una propuesta no tiene walkthrough ni cierre.
- **Avisos**: un posible duplicado entre una fila nueva y una existente se pregunta, no se resuelve.
- **Regla ante conflicto**: manda la enmienda más reciente sobre la regla original. Una feature cerrada o en marcha no se reabre: el cambio va a una fila nueva.

### Capacidad: `release-flow`

**MODIFIED — El proyecto declara si sus releases tienen destinatario** (antes: «se ejecuta `sdd-start-release` o `sdd-end-release`»)
- GIVEN un `.docs/sdd/sdd-kit.json` sin `release.hasRecipient`
- WHEN se ejecuta `sdd-plan` para preparar una release, o `sdd-end-release`
- THEN el agente pregunta una sola vez si la release se entrega a alguien distinto de quien la hace, y escribe la respuesta en `release.hasRecipient` sin tocar los demás campos
- AND con el campo ya presente no se pregunta
- AND el agente no escribe ni cambia el campo sin una respuesta o petición explícita del usuario

**MODIFIED — La reserva se publica antes de arrancar** (antes: «un commit que solo toca `roadmap.md`»)
- GIVEN un scope replanificado que el usuario ha decidido
- WHEN el agente escribe las filas en el roadmap
- THEN las publica en la rama de integración con un commit que solo toca `roadmap.md`, y el `proposal.md` de la propuesta si la hay, en el worktree donde está sacada (o en uno temporal, en la carpeta de los demás worktrees y con nombre corto, si no está en ninguno)
- AND lo hace antes de arrancar ninguna de las tasks nuevas

**MODIFIED — El valor vigente del campo es el que se aplica** (antes: «se ejecuta `sdd-start-release` o `sdd-end-release`»)
- GIVEN un proyecto que cambia `release.hasRecipient` de `true` a `false`, o al revés, aunque sea con una release abierta
- WHEN se ejecuta `sdd-plan` para preparar una release, o `sdd-end-release`
- THEN la skill aplica el valor que tiene el campo en ese momento, sin migración y sin reescribir releases pasadas

**MODIFIED — Sin destinatario no se pregunta si la release está comprometida** (antes: «`sdd-start-release` llega al estado de la release»)
- GIVEN `release.hasRecipient: false`
- WHEN `sdd-plan` llega al estado de la release que prepara
- THEN el estado es «en preparación» y no se pregunta
- AND con `true`, la pregunta usa las definiciones: comprometida = scope prometido al destinatario, normalmente con fecha; en preparación = cualquier otro caso

### Capacidad: `roadmap`

**MODIFIED — Cada task de una release declara los ficheros que toca** (antes: «un `sdd-start-release` que escribe la sección»)
- GIVEN un `sdd-plan` que escribe la sección «Release N» del roadmap
- WHEN añade la fila de una task
- THEN la tabla sigue la cabecera de `roadmap-template.md`, `| id | Task | Origen | Ficheros que toca | Estado |`, y la celda «Ficheros que toca» nombra los ficheros o módulos previstos
- AND el freno de alcance de una enmienda (`control-profiles.md`) encuentra esa columna

### Capacidad: `task-ids`

**MODIFIED — Tasks y patches comparten una sola secuencia** (antes: sin propuestas)
- GIVEN un proyecto en modo `sequence`
- WHEN se asigna el id de una task, de un patch o de una propuesta
- THEN sale de la misma secuencia correlativa: un id nunca se repite entre carriles
- AND `Get-NextSddId.ps1` cuenta como usado el id de una carpeta `-proposal-<id>-`: con `specs/20260915-090000-proposal-0020-billing/` y ninguna fila 0020, no propone `0020`

**MODIFIED — En modo secuencia el id lo reserva el hilo principal al planificar** (antes: «`sdd-start-release` escribe N tasks nuevas»)
- GIVEN un proyecto en modo `sequence`
- WHEN `sdd-plan` escribe N filas nuevas en el roadmap, o una propuesta y sus N features
- THEN sus ids salen de una sola reserva `Get-NextSddId.ps1 -Reserve -Count N` (N + 1 con propuesta), y cada fila lleva el suyo
- AND el agente que abre el worktree de una task toma el id de su fila, sin reservar ni recalcular

**MODIFIED — En modo gestor el id es el del ticket** (antes: la lista nombraba `sdd-start-release`)
- GIVEN un proyecto en modo `tracker` y una skill que necesita un id (`sdd-start-task`, `sdd-start-patch`, `sdd-plan`, `sdd-consult`)
- WHEN el trabajo tiene ticket en el gestor
- THEN el id es el del ticket, y `0000` cuando el trabajo no tiene ticket

**MODIFIED — La reserva precede a la rama y a la carpeta** (antes: sin la rama ya creada)
- GIVEN un proyecto en modo `sequence` y un arranque de task o de patch sin fila de roadmap
- WHEN el agente necesita el id
- THEN lo reserva con `Get-NextSddId.ps1 -Reserve` antes de crear la rama y la carpeta, y usa ese id en las dos
- AND si ya está en una rama sin id y sin commits propios frente a la rama de integración (`feature/fix-sala`, con la reserva en 0014), la renombra a `feature/<id>-<slug>` con `git branch -m` antes del primer commit y lo dice: el commit del fix sale en `feature/0014-<slug>`, y `feature/fix-sala` ya no existe

**Reglas de la capacidad**
- **Dónde viven los datos**: el modo, en `.docs/sdd/sdd-kit.json` (`ids.mode`). El último id consumido, en `<git-common-dir>/sdd-ids` (`sdd-ids-<ruta relativa>` si el proyecto está en una subcarpeta), compartido por todos los worktrees del repositorio y fuera del árbol versionado. La fila del roadmap y la rama siguen siendo donde se ve cada reserva.
- **Idioma de los nombres**: claves y valores de `sdd-kit.json` en inglés (`ids.mode`, `tracker`, `sequence`), como el resto del fichero; el texto de las skills sigue en castellano.
- **Límites**: cuatro dígitos con ceros a la izquierda (`0001`–`9999`); `0000` reservado como comodín de «sin ticket» en modo `tracker`. Una reserva que pasaría de `9999` falla sin reservar. `-Count` va de 1 a 99. Una sola máquina: con varias máquinas en `sequence` haría falta un cerrojo en el remoto o el modo `tracker`. Hay un contador por proyecto: `sdd-ids` en la raíz del repositorio y `sdd-ids-<ruta relativa>` en una subcarpeta.
- **Avisos**: ids duplicados entre artefactos, proyecto en modo `tracker` y ramas omitidas por no ser raíz del repositorio se avisan por salida de error; en los dos primeros casos el script no devuelve id ni toca el contador. El script avisa además por salida de error si el contador no se puede leer (y lo reinicializa) y si no hay repositorio git donde reservar (sin reservar). También avisa si el cerrojo no se libera en el plazo, nombrando al dueño y sin reservar.
- **Regla ante conflicto**: la fila del roadmap manda. El contador nunca baja: si el escaneo ve un id mayor, gana el escaneo. Si aun así dos trabajos acaban con el mismo id, el segundo en darse cuenta renumera su carpeta y su rama y lo anota en el roadmap.
- **Contrato de lectura del roadmap**: el script reconoce un id en la primera columna de una fila de tabla (`| 0001 |`), en los nombres de artefacto (`task-<id>-`, `patch-<id>-`, `proposal-<id>-`) y en un segmento del nombre de rama (`feature/0001`, `hotfix/0001-slug`). Cualquier otra aparición de cuatro dígitos (fechas, versiones) no cuenta.

### Capacidad: `routing`

**ADDED — Una petición de planificar entra por `sdd-plan`**
- GIVEN un proyecto con `.docs/sdd/` y el hook de sesión activo
- WHEN el usuario trae algo para el roadmap sin nombrar ninguna skill: «organízalo para el equipo», «apunta en el roadmap», items del gestor, notas de una reunión, «reordena», «prepara la release 1.3»
- THEN la primera skill que se invoca es `sdd-kit:sdd-plan`
- AND con «prepara la release 1.3», no `sdd-end-release`; con «organízalo para el equipo», no `sdd-start-task`

## Enmiendas

- 2026-09-25 — Freno de alcance antes de la Task 4: `README.md` y `tests/ReleaseFlow.Tests.ps1` cambiaron en `develop` (`ed9647c`, `8ae9997`, task 0063). Se integra `develop` en la rama antes de la Task 4; la spec no cambia — aprobada: «Integrar develop ahora (Recomendada)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-25 | aprobada: «Apruebo la spec» |
