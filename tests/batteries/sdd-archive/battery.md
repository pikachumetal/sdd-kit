# Batería de regresión — `sdd-archive`

El cierre de una feature o de un patch. Nace en la feature 0149, que funde `sdd-end-feature`, `sdd-end-patch` y `finishing-a-development-branch`; hereda de la batería de `sdd-end-patch` (feature 0161) el escenario de la fila «Patch:» de «Próximo».

Los escenarios de conducta piden `sdd-archive` por su nombre, como `c3` de `sdd-verify`: con las dos skills viejas en el kit, el router las elegía; el enrutado lo miden `r1` y `r2`. El RED de `a1` (kit de `develop`) usó la petición sin el nombre.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-archive`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). En el RED, con el kit de `develop`, la guarda de `subject.sh` mira `sdd-end-feature` o `sdd-end-patch`, porque `sdd-archive` aún no existe; la puerta de esos escenarios sale roja por eso y se puntúa la conducta.

Moldes:

- `reservas`: el de `tests/batteries/sdd-implement/mold-reservas` con la 0010 implementada en Native (dos tasks), `tasks.md` con la revisión final limpia y un ruling de workaround en `## Rulings`, `validation.mode: field`, perfil `delegate`, `merge` sin push y sin remoto.
- `reservas-base`: `reservas` con `develop` avanzada tras abrir la rama (la 0015: `src/rooms.js` y una fila nueva justo debajo de la 0010 en «Próximo»), otra feature abierta en su worktree (`feature/0011-others`) y un `notes.md` sin seguimiento. El segundo turno contesta: «notes.md era un apunte mío: bórralo y sigue con el cierre.»
- `reservas-red`: `reservas` con `test/export.e2e.test.js`, que falla con «TimeoutError: export no respondió en 5000 ms» en `develop` y en la rama, y su fila en «Deuda técnica».
- `reservas-plan`: `reservas-red` con la rama de la 0010 abierta solo con su spec y su plan.
- `reservas-family`: `reservas` con la 0010 como pieza de la 0009 (`parent: 0009` en su spec y en su fila) y la 0016 «Fotos de las salas», `⏳`, con `parent: 0009`, tras la 0010.
- `reservas-family-done`: `reservas-family` con la 0009 ya `✅`.
- `reservas-adr`: `reservas` con una ADR candidata en la spec de la 0010, `decisions/0001-bookings-in-memory.md` válida y `decisions/0002-node-test.md` sin `### Confirmación`.
- `reservas-sha`: `reservas` con un arreglo tras la última task y un borrador del walkthrough commiteado que cita su sha.
- `reservas-300`: `reservas` con `ROADMAP.md` (la 0010 en Now, `🔄`, con su brief) y `.docs/sdd/steering/debt.md` (dos filas de «Lista» con «Destino» `0010`: una saldada entera y otra solo en castellano) en lugar de `roadmap.md`.
- `salas-capability`: `salas-patch` con `capabilities/bookings.md`, cuyo requisito «Cancelar una reserva» dice «responde siempre «cancelada lun 10:00»» y cuyos «Avisos» lo repiten («siempre, exista o no la reserva»), y un `patch.md` con el `MODIFIED` de ese requisito.
- `salas-patch`: el de `tests/batteries/using-sdd/mold-salas` con la fila 0008 «Patch:» en «Próximo», la rama `feature/0008-cancel-missing` con el fix commiteado y su `patch.md` (`patch-0008.md`), `validation.mode: field` y `merge` sin push. «Deuda técnica» lleva la fila «Cancelar una reserva que no existe responde «cancelada» igual» con «Actuar → 0008».
- `salas-hotfix`: el mismo, con la rama `hotfix/0008-cancel-missing` salida de `main` y una carpeta `skills/sdd-init-brownfield/references/migrations/` con su `README.md`. El segundo turno (`TURN2`) contesta a la pregunta de la migración: «Sobre la migración: sí, este hotfix pide al proyecto la clave `cancel.strict: true` en `.docs/sdd/sdd-kit.json`.»

**Dos veredictos.** `battery.sh` da el de la puerta. El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt`, `state.txt` y los ficheros que deja cada sujeto con la rúbrica de abajo, fila por fila.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| a1 | trunk | Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala. | reservas | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | feature 0149: el tronco y la rama de feature, el workaround con su fila de deuda (ticket de la feature 0010b del template §3) y el 4.1 con su sha |
| a2 | patch | Invoca la skill sdd-kit:sdd-archive y sigue. Cierra el patch 0008. | salas-patch | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | revisión final de la 0161 (Important 2): nadie cierra la fila «Patch:» de «Próximo»; feature 0149: un patch no hereda pasos de feature, y su fila de deuda la cierra el cierre |
| a4 | hotfix | Invoca la skill sdd-kit:sdd-archive y sigue. Cierra el hotfix 0008: fusiona el hotfix 0008 en main, etiquétalo v0.3.1 y publícalo. | salas-hotfix | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | feature 0149: el hotfix con `--into`, la frase del dev-lead y la pregunta de la migración (ticket del patch 0057 de un proyecto del equipo §5) |
| a3 | base | Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala. | reservas-base | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | 0048 y fila de deuda «El kit no tiene modelo para tasks en paralelo» (P2.2, P2.3); ticket de la feature 0093 de document-manager §2 (la suite sobre la base integrada); fila «La suite completa corre tres veces…» |
| a3r | red | Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala. | reservas-red | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | filas de deuda «Un rojo del gate de cierre se contrasta con la base…», «Un rojo ajeno se investiga antes de mirar la deuda…» y «Sin forma de informe cuando la suite falla tras el merge…» |
| w1 | baseline | Invoca la skill sdd-kit:sdd-worktrees y sigue: prepara el worktree para implementar la 0010, con su spec y su plan aprobados; no implementes nada todavía. | reservas-plan | `sdd-kit:sdd-worktrees` | 2 | 2/2 | sonnet | fila de deuda «Un rojo ajeno se investiga antes de mirar la deuda…» (la línea base de `sdd-worktrees`) |
| a5 | family | Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala. | reservas-family | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | fila de deuda «Al cerrar una pieza de una feature partida, nada dice qué piezas de su familia quedan abiertas» (dev-lead, 2026-10-16) |
| a6 | adr | Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala. | reservas-adr | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | feature 0149: el cierre escribe las ADR candidatas y ejecuta `sdd decision check` (dev-lead, 2026-10-15) |
| a7 | literal | Invoca la skill sdd-kit:sdd-archive y sigue. Cierra el patch 0008. | salas-capability | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | ticket del patch 0078 §2: un `MODIFIED` no alcanza el literal repetido en «Reglas de la capacidad» |
| a8 | sha | Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala. | reservas-sha | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | RED de la feature 0096 (`tests/closing-off-critical-path-red.md`, c2) y ticket de la feature 0060 del template §2: juntar hitos borra los shas que cita la evidencia |
| a9 | v300 | Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala. | reservas-300 | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | feature 0149: los cierres escriben en Now y en `debt.md` con las plantillas de la 0150 (dev-lead, 2026-10-15) |
| a3n | nobase | Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala. | reservas | `sdd-kit:sdd-archive` | 1 | 1/1 | sonnet | Review Focus del plan de la 0149: sin avance de la base no hay merge de sincronización ni segunda suite |
| a5m | family-done | Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala. | reservas-family-done | `sdd-kit:sdd-archive` | 1 | 1/1 | sonnet | Review Focus del plan de la 0149: con la madre ya cerrada solo se nombran las hermanas abiertas |
| r1 | route | hemos acabado, cierra la tarea | reservas | `sdd-kit:sdd-archive` | 1 | 1/1 | sonnet | feature 0149: el cierre de una feature entra por `sdd-archive` |
| r2 | route | cierra el patch | salas-patch | `sdd-kit:sdd-archive` | 1 | 1/1 | sonnet | feature 0149: el cierre de un patch entra por `sdd-archive` |

## Rúbrica

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| A1 Walkthrough | a1 | no hay `walkthrough.md` de la 0010, o su «4.1 Builds» no da el comando de la suite, su resultado y el sha sobre el que corrió |
| A2 Fila ✅ | a1 | la fila 0010 de «Próximo» no queda ✅ en el roadmap de `develop` |
| A3 Workaround con deuda | a1 | la tabla «Deuda técnica» del roadmap no gana una fila con el workaround `--test-concurrency=1` (también si el cierre lo escribe en `tech-stack.md`) |
| A6 Fila propia | a1 | la fila 0010 de «Próximo» lleva un prefijo de cierre (`**[Feature 0010, …: saldada — …]**`) en lugar de cambiar solo su «Estado» |
| A4 Comprobaciones previas | a1 | `tools.txt` no tiene `git status` del worktree ni `sdd merge --check` antes del primer `Write` o `Edit` de un registro |
| A5 Fusionada | a1 | `develop` no tiene el merge de `feature/0010-cancel-reason` |
| P1 Fila «Patch:» | a2 | la fila 0008 de «Próximo» no queda ✅ en el roadmap que deja el cierre (en la rama o en `develop`), o desaparece, o «Patches» no tiene la fila del 0008 |
| P2 Deuda saldada | a2 | la fila de deuda «Cancelar una reserva que no existe…» no empieza por `**[Patch 0008, <fecha>: saldada — <enlace>]**` |
| P3 Sin pasos de feature | a2 | el cierre escribe `walkthrough.md` o `tasks.md`, o hace la revisión de skills |
| H1 Pregunta de la migración | a4 | antes del merge no pregunta si algún patch pide algo al proyecto |
| H2 Paso de migración | a4 | tras el «sí», no hay `v0.3.1.md` en `migrations/` con la clave `cancel.strict`, o se escribe después de etiquetar |
| H3 Merge a la rama estable | a4 | no ejecuta `sdd merge` con `--into main`, `--tag v0.3.1` y `--order` con la frase literal del dev-lead, o va sin `--push` aunque la frase pide publicar |
| H4 Resultado | a4 | `main` no tiene el merge del hotfix y la etiqueta `v0.3.1`, o `develop` no recibe la vuelta |
| B1 Borrador | a3 | escribe o edita un registro antes de preguntar por `notes.md`, o lo borra o lo commitea sin la respuesta |
| B2 Otra rama | a3 | no nombra `feature/0011-others` con su ruta antes de seguir |
| B3 Merge de sincronización | a3 | `develop` no queda integrada en la rama después del commit de cierre (el merge de sincronización es el último commit de la rama), o el roadmap de `develop` no tiene las filas 0010 ✅ y 0015 sin duplicar ninguna |
| B4 Suite sobre la base integrada | a3 | no corre la suite completa después del merge de sincronización, aunque la 0015 cambia `src/` |
| B5 `--verified-at` | a3 | `sdd merge` va sin `--verified-at`, o con un sha que no es el de la suite sobre el merge de sincronización |
| C1 Contraste con la base | a3r | no corre el mismo comando sin la rama (worktree desanclado de `develop`, o `develop`) antes de investigar el fallo |
| C2 Deuda del proyecto | a3r, w1 | no cita la fila de deuda de `export.e2e.test.js`, o abre una fila nueva duplicada, o abre el test para investigarlo antes de buscar en la deuda |
| C3 Informe y parada | a3r | fusiona sin preguntar, o el informe no lleva el comando, el código de salida, el veredicto de la base y el hash de `develop` sin tocar |
| W1 Línea base | w1 | da la línea base en rojo sin contrastarla con la rama de integración, o sigue sin preguntar |
| Q1 Qué sigue | a5 | el mensaje final no dice «Para acabar la 0009 falta: 0016 — Fotos de las salas.» con la recomendación, o no da el prompt de arranque de la 0016 con su rama en su bloque, o marca la fila de la 0009 |
| D1 ADR escrita | a6 | no hay `decisions/0003-*.md` con la forma de la plantilla, o el walkthrough no lleva `ADR: <candidata> → decisions/0003-…` |
| D2 `decision check` | a6 | no ejecuta `sdd decision check --path .docs/sdd`, o fusiona con el check en rojo por la `0002` sin arreglarla ni preguntar |
| M1 Literal de la capacidad | a7 | `bookings.md` tras el cierre aún dice «exista o no la reserva» o «responde siempre» |
| M2 Por el delta | a7 | la corrección de «Avisos» no está en el delta de `patch.md` (se editó `bookings.md` a mano) |
| S1 Shas alcanzables | a8 | algún sha que cite el `walkthrough.md` o el `tasks.md` de `develop` no es antecesor de `develop` |
| N1 Now | a9 | la fila 0010 de `ROADMAP.md` no queda `✅` en Now, o sale de Now |
| N2 `debt.md` | a9 | «El motivo de cancelar no se valida» sigue en «Lista», o «Los motivos no se traducen» sale de «Lista» o queda sin reescribir a lo que falta (el inglés) |
| N0 Sin avance de la base | a3n | crea un merge de sincronización, corre la suite completa más de una vez, o `sdd merge` va sin `--verified-at` con el sha de la suite de la validación |
| Q2 Madre cerrada | a5m | no nombra la 0016 como pieza abierta, o dice «La 0009 ya no tiene piezas abiertas: su fila se puede cerrar.», o toca la fila de la 0009 |
| R1 Entrada | r1, r2 | la primera skill invocada no es `sdd-kit:sdd-archive` (lo da la puerta) |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Comprobaciones previas: árbol limpio, `sdd merge --check`, otras ramas abiertas | fila de deuda «Menores de cierre de la feature 0060 del template» (borradores sin commitear) y la 0047; RED de la 0149, `a1`: 0/1 ejecutó `sdd merge --check` | a1 (A4) |
| Un workaround que el cierre escribe en el stack lleva su fila de deuda | ticket de la feature 0010b del template §3; en el RED de la 0149, `a1` abrió la fila sin la regla (1/1): control | a1 (A3) |
| El 4.1 del walkthrough lleva el sha de la suite | feature 0149, decisión 32; RED de la 0149, `a1`: 0/1 | a1 (A1) |
| La fila propia solo cambia su «Estado» | GREEN de la 0149, `a1`: 2/2 le pusieron el prefijo de cierre de deuda con «mark the row»; con la regla, 2/2 limpias (`refactor/`) | a1 (A6) |
| La fila «Patch:» de «Próximo» se marca ✅ y se queda | `tests/sdd-explore-0161-red.md`, x1: 2 de 2 la tratan sin regla, uno marcándola ✅ y otro quitándola; RED de la 0149, `a2`: la quitó (0/1) | a2 (P1) |
| La deuda saldada lleva el prefijo literal | RED de la 0149, `a2`: «✅» en la celda (0/1); GREEN con la regla por remisión a la plantilla, 1/2; con el literal, 2/2 (`refactor/`) | a2 (P2) |
| Un patch no hereda pasos de feature | propuesta 0131, §archive | a2 (P3) |
| El hotfix va a la rama estable con `--into`, `--tag` y la frase del dev-lead en `--order`; `--push` solo si la frase lo pide | feature 0187 (CLI) y spec de la 0149, decisión 13 | a4 (H3, H4) |
| La migración lleva el paso que un hotfix pide al proyecto | ticket del patch 0057 de un proyecto del equipo §5; RED de la 0149, `a4`: no pregunta (0/1); GREEN con la pregunta en el paso del merge, 0/2; como comprobación previa con parada, 2/2 (`refactor/`) | a4 (H1, H2) |
| La base se integra tras el commit de cierre y la suite se repite solo si trae código | 0048; fila de deuda de tasks en paralelo (P2.2, P2.3); ticket 0093 de document-manager §2; RED de la 0149, `a3`: sin suite tras el merge de sincronización ni `--verified-at` (0/1) | a3 (B3, B4, B5), a3n (N0: 1/1, sin merge de sincronización y una sola suite) |
| Árbol limpio y otras ramas abiertas antes que nada | RED de la 0149, `a3`: cerró y fusionó antes de preguntar por `notes.md` y no nombró la otra rama (0/1); GREEN con la línea «si hay otras ramas», B2 1/2; «en tu siguiente mensaje, antes de cualquier otro paso», 2/2 (`refactor/`) | a3 (B1, B2) |
| Un rojo se contrasta con la base y se busca en la deuda antes de investigarlo; forma del informe | filas de deuda del rojo del gate, del rojo ajeno y del informe tras el merge; RED de la 0149: `a3r` fusionó sobre el rojo sin contrastar (0/1) y `w1` abrió el test sin citar la deuda (0/1) | a3r (C1-C3), w1 (C2, W1) |
| Ante un rojo que también falla sin la rama, se para y pregunta en cualquier perfil | GREEN con la parada solo en la receta: `a3r` C3 1/2; con la parada en el paso 6 del `SKILL.md`, 2/2 (`refactor2/`) | a3r (C3) |
| «Qué sigue» al cerrar una pieza de una familia | dev-lead, 2026-10-16; sin paso de «qué sigue» en `sdd-end-feature` ni `sdd-end-patch` (contrastado ese día): RED por inspección | a5 (Q1), a5m (Q2): RED con el kit de `develop` 0/1 (sin línea de «qué sigue»); GREEN con el literal en `records.md`, 2/2 en contenido y 0/2 literal; con el literal en el mensaje final del `SKILL.md` (`fix/`), 1/2 exacto y 1/2 casi (minúscula, sin «:»); `a5m` 1/1 |
| Las ADR candidatas se escriben y `decision check` para el cierre, también por una ajena | dev-lead, 2026-10-15 | a6 (D1, D2): RED: ni la ADR ni el check (0/1); GREEN D2 2/2 y D1 1/2; con «record this line, literal» (`fix/`), 2/2 |
| El literal viejo de un `MODIFIED` se busca en toda la capacidad y se corrige por el delta | ticket del patch 0078 §2 | a7 (M1, M2): RED corrigió «Avisos» a mano (M2 0/1); GREEN 2/2 |
| Ningún sha citado se pierde al juntar | `tests/closing-off-critical-path-red.md`, c2 (RED de la regla) | a8 (S1): GREEN 2/2 |
| Con `ROADMAP.md`, lo hecho queda en Now y la deuda saldada sale de «Lista» | dev-lead, 2026-10-15 | a9 (N1, N2): RED dejó la fila parcial sin reescribir (N2 0/1); GREEN 2/2 |
| La `description` de `sdd-archive` recoge «cierra la feature», «cierra el patch», «hemos acabado», «haz el walkthrough» | feature 0149, decisión 3 | r1, r2 |

## Evidencia heredada de `sdd-end-feature` y `sdd-end-patch`

Las reglas que `sdd-archive` trae de las dos skills retiradas guardan aquí su evidencia, no en la skill:

| Regla | Evidencia |
| --- | --- |
| La re-revisión del tramo va antes de escribir nada | `tests/closing-review-edges-red.md`, e1: 2 de 2 la despacharon después del walkthrough, el roadmap y el changelog |
| Con `validation.mode: field`, la validación es en campo | `tests/field-validation-red.md`: 6 de 6 pararon con la clave |
| El delta se fusiona con `capability merge`, nunca a mano | `tests/capability-merge-red.md`: 3 de 3 copiaron `- Se valida en:` a la capacidad viva |
| Un ajuste de presentación va en `Changed`, no en `Fixed` | `tests/visual-patch-red.md`, f2: 2 de 2 lo registraron como `Fixed` |
| La fila «Patch:» de «Próximo» se marca y se queda | `tests/sdd-explore-0161-red.md`, x1: uno la marcó y otro la quitó |
| Las líneas de revisión de `tasks.md` se reescriben sin sha antes de juntar | `tests/closing-off-critical-path-red.md`, c3: 2 de 2 dejaron shas no alcanzables |
| El bloque `merge` autoriza el merge, no la validación | patch 0072: se fusionó y publicó sin validar, y hubo que reabrir |
| Un destino que falta se crea desde su plantilla | GREEN de la regla en `sdd-end-feature`: 2 de 2 dejaron el aprendizaje solo en el walkthrough con «sin `architecture.md` no hay doc vivo» |
