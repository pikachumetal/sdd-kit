# Batería de regresión — `sdd-archive`

El cierre de una feature o de un patch. Nace en la feature 0149, que funde `sdd-end-feature`, `sdd-end-patch` y `finishing-a-development-branch`; hereda de la batería de `sdd-end-patch` (feature 0161) el escenario de la fila «Patch:» de «Próximo».

Mientras `sdd-end-feature` y `sdd-end-patch` sigan en el kit (hasta la Task 5 de la 0149), el router las elige: los escenarios de conducta piden `sdd-archive` por su nombre, como `c3` de `sdd-verify`, y el enrutado (`r1`, `r2`) solo se mide con ellas retiradas. El RED de `a1` (kit de `develop`) usó la petición sin el nombre.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-archive`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). En el RED, con el kit de `develop`, la guarda de `subject.sh` mira `sdd-end-feature` o `sdd-end-patch`, porque `sdd-archive` aún no existe; la puerta de esos escenarios sale roja por eso y se puntúa la conducta.

Moldes:

- `reservas`: el de `tests/batteries/sdd-implement/mold-reservas` con la 0010 implementada en Native (dos tasks), `tasks.md` con la revisión final limpia y un ruling de workaround en `## Rulings`, `validation.mode: field`, perfil `delegate`, `merge` sin push y sin remoto.
- `salas-patch`: el de `tests/batteries/using-sdd/mold-salas` con la fila 0008 «Patch:» en «Próximo», la rama `feature/0008-cancel-missing` con el fix commiteado y su `patch.md` (`patch-0008.md`), `validation.mode: field` y `merge` sin push.

**Dos veredictos.** `battery.sh` da el de la puerta. El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt`, `state.txt` y los ficheros que deja cada sujeto con la rúbrica de abajo, fila por fila.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| a1 | trunk | Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala. | reservas | `sdd-kit:sdd-archive` | 2 | 2/2 | sonnet | feature 0149: el tronco y la rama de feature, el workaround con su fila de deuda (ticket de la feature 0010b del template §3) y el 4.1 con su sha |
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
| R1 Entrada | r1, r2 | la primera skill invocada no es `sdd-kit:sdd-archive` (lo da la puerta) |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Comprobaciones previas: árbol limpio, `sdd merge --check`, otras ramas abiertas | fila de deuda «Menores de cierre de la feature 0060 del template» (borradores sin commitear) y la 0047; RED de la 0149, `a1`: 0/1 ejecutó `sdd merge --check` | a1 (A4) |
| Un workaround que el cierre escribe en el stack lleva su fila de deuda | ticket de la feature 0010b del template §3; en el RED de la 0149, `a1` abrió la fila sin la regla (1/1): control | a1 (A3) |
| El 4.1 del walkthrough lleva el sha de la suite | feature 0149, decisión 32; RED de la 0149, `a1`: 0/1 | a1 (A1) |
| La fila propia solo cambia su «Estado» | GREEN de la 0149, `a1`: 2/2 le pusieron el prefijo de cierre de deuda con «mark the row»; con la regla, 2/2 limpias (`refactor/`) | a1 (A6) |
| La `description` de `sdd-archive` recoge «cierra la feature», «cierra el patch», «hemos acabado», «haz el walkthrough» | feature 0149, decisión 3 | r1, r2 |
