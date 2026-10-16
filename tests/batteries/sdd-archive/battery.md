# Batería de regresión — `sdd-archive`

El cierre de una feature o de un patch. Nace en la feature 0149, que funde `sdd-end-feature`, `sdd-end-patch` y `finishing-a-development-branch`; hereda de la batería de `sdd-end-patch` (feature 0161) el escenario de la fila «Patch:» de «Próximo».

Mientras `sdd-end-feature` y `sdd-end-patch` sigan en el kit (hasta la Task 5 de la 0149), el router las elige: los escenarios de conducta piden `sdd-archive` por su nombre, como `c3` de `sdd-verify`, y el enrutado (`r1`, `r2`) solo se mide con ellas retiradas. El RED de `a1` (kit de `develop`) usó la petición sin el nombre.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-archive`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). En el RED, con el kit de `develop`, la guarda de `subject.sh` mira `sdd-end-feature` o `sdd-end-patch`, porque `sdd-archive` aún no existe; la puerta de esos escenarios sale roja por eso y se puntúa la conducta.

Moldes:

- `reservas`: el de `tests/batteries/sdd-implement/mold-reservas` con la 0010 implementada en Native (dos tasks), `tasks.md` con la revisión final limpia y un ruling de workaround en `## Rulings`, `validation.mode: field`, perfil `delegate`, `merge` sin push y sin remoto.
- `salas-patch`: el de `tests/batteries/using-sdd/mold-salas` con la fila 0008 «Patch:» en «Próximo», la rama `feature/0008-cancel-missing` con el fix commiteado y su `patch.md` (`patch-0008.md`), `validation.mode: field` y `merge` sin push. «Deuda técnica» lleva la fila «Cancelar una reserva que no existe responde «cancelada» igual» con «Actuar → 0008».
- `salas-hotfix`: el mismo, con la rama `hotfix/0008-cancel-missing` salida de `main` y una carpeta `skills/sdd-init-brownfield/references/migrations/` con su `README.md`. El segundo turno (`TURN2`) contesta a la pregunta de la migración: «Sobre la migración: sí, este hotfix pide al proyecto la clave `cancel.strict: true` en `.docs/sdd/sdd-kit.json`.»

**Dos veredictos.** `battery.sh` da el de la puerta. El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt`, `state.txt` y los ficheros que deja cada sujeto con la rúbrica de abajo, fila por fila.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| a1 | trunk | Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala. | reservas | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | feature 0149: el tronco y la rama de feature, el workaround con su fila de deuda (ticket de la feature 0010b del template §3) y el 4.1 con su sha |
| a2 | patch | Invoca la skill sdd-kit:sdd-archive y sigue. Cierra el patch 0008. | salas-patch | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | revisión final de la 0161 (Important 2): nadie cierra la fila «Patch:» de «Próximo»; feature 0149: un patch no hereda pasos de feature, y su fila de deuda la cierra el cierre |
| a4 | hotfix | Invoca la skill sdd-kit:sdd-archive y sigue. Cierra el hotfix 0008: fusiona el hotfix 0008 en main, etiquétalo v0.3.1 y publícalo. | salas-hotfix | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | feature 0149: el hotfix con `--into`, la frase del dev-lead y la pregunta de la migración (ticket del patch 0057 de un proyecto del equipo §5) |
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
| La `description` de `sdd-archive` recoge «cierra la feature», «cierra el patch», «hemos acabado», «haz el walkthrough» | feature 0149, decisión 3 | r1, r2 |
