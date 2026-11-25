---
id: 20261125-181147-feature-0363-merge-rejects-shared-ids
feature: 0363
title: sdd merge para con un id o un número de ADR que ya tiene el destino
mode: lite
status: approved
created: 2026-11-25
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-25
---

# Spec — `sdd merge` para con un id o un número de ADR que ya tiene el destino

🦆 Hoy dos ramas paralelas pueden traer el mismo número, por ejemplo una feature y un patch los dos con el 0756, y el kit las fusiona sin decir nada. Después nadie del proyecto puede pedir un número nuevo hasta que alguien renumera a mano. Con este cambio, la comprobación previa al cierre, la puesta al día de la rama y el propio cierre paran antes de fusionar y nombran las dos carpetas, o las dos decisiones de arquitectura con el mismo número. Solo cuenta lo que trae la rama, así un choque antiguo que ya está en la integración no bloquea a las demás ramas. Y si un número repetido llega igualmente a la integración, pedir un número nuevo avisa del choque y da el siguiente libre en vez de bloquear a todos.

Validación: agente — es salida de la CLI que los tests ya miden (código de salida y mensaje); el proyecto valida en campo (`validation.mode: field`).

## Capacidades

- Modificadas: `closing-merge` — `--check`, `--sync`, la integración de la base con `--verify` y el merge del cierre paran si la rama trae una carpeta de cambio con un id, o una ADR con un número, que el destino ya usa en otro fichero
- Modificadas: `feature-ids` — `sdd id next` con un id duplicado ya en el disco avisa y sigue, en vez de parar

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos (lite, sonnet) — señales: `MODIFIED` / `REMOVED` (dos requisitos de `feature-ids`), contrato público (salida y código de salida de `sdd merge --check`/`--sync` y de `sdd id next`, que leen las skills) · tamaño: ~150 líneas en 7 ficheros
- Dominio y técnica (sonnet): si el `REMOVED` de «El script avisa de un id duplicado y no devuelve ninguno» deja sin dueño algún caso que hoy para, si la decisión 1 (solo cuenta lo que trae la rama) deja pasar un choque real, y si el THEN de `--check` respeta «La comprobación del destino no toca nada» (señal: `MODIFIED` + contrato público)
- Mínimo razonable: sin review — deja sin mirar si la decisión 1 abre un hueco que el criterio del prompt no prueba

Delta probado en una copia: `sdd capability merge` → `closing-merge.md: añadido «El merge para si la rama trae un id o un número de ADR que el destino ya usa»`, `feature-ids.md: quitado …`, `añadido «El script avisa de un id duplicado y sigue»`, `sustituido «El escaneo cuenta…»`, `regla «Avisos» sustituida`, salida 0.

1. Enfoque: comparar listados de `git ls-tree` de las refs, frente a reutilizar `idScan` o `checkDecisions` (ver Approach).
2. Solo cuenta lo que **trae la rama**: las carpetas de cambio y las ADR de la rama que no están, por nombre, en el merge-base de la rama y el destino. Se comparan con todo lo del destino salvo el mismo nombre. Un duplicado ya fusionado (el 0756 de document-manager) no bloquea los merges de otras ramas, y una carpeta o ADR que el destino renombró después del merge-base tampoco choca con la vieja de la rama — si se compararan los dos árboles enteros, o la rama contra el destino, saldrían los dos falsos positivos.
3. Qué se compara: carpetas de `changes/` y de `specs/` (`BRANCH_CHANGE_FOLDERS`) con el patrón de id de `scan.ts`, y ficheros de `decisions/` que cumplen `NNNN-<slug>.md`. Un `README.md` u otro nombre sin número no cuenta, y una ADR `superseded` cuenta igual — sigue ocupando su número.
4. Las carpetas de cambio se comprueban solo en modo `sequence` (leído del `sdd-kit.json` de la raíz del proyecto) — en `tracker` un mismo ticket puede tener una feature y un patch; es el mismo criterio que `assertNoSharedIds`. Las ADR, en cualquier modo — su número nunca viene de un gestor externo.
5. No cuentan el id y el número `0000`, ni las carpetas de sufijo heredado (`…-task-0006a-…`) — igual que en `cli/src/ids/scan.ts`. Dos carpetas o ADR nuevas de la misma rama con el mismo número, sin choque con el destino, quedan fuera: las ven `sdd id next` y `sdd decision check`.
6. Destino de `--check`: la rama `merge.into` local y, si existe, su seguimiento remoto (`origin/develop`), sin fetch — «La comprobación del destino no toca nada» prohíbe el fetch. Va después de `checkDestination`, así un checkout del destino con cambios sigue dando su mensaje de siempre. Con `--branch`, compara esa rama; si no, `HEAD`.
7. Cuatro puntos de comprobación, todos antes de su `git merge`:
   - `--check`.
   - `integrateRef`, que hacen `--sync` y la integración de la base del merge con `--verify`.
   - `mergeFeature`, dentro del cerrojo y en el checkout del destino, después de que `syncBaseBranch` traiga `origin/develop`: compara la rama con lo que va a recibirla. Cubre el merge sin `--verify`, el de `--verify` tras sus reintentos (un choque es un cambio solo de docs, que hoy publica sin reverificar) y la vuelta del hotfix a `develop`.
   - En el hotfix, un choque en la vuelta deshace la vuelta entera, como ya manda la capacidad `stable-branch` («una vuelta que falla se deshace entera»).
8. `--check` con `--into` a la rama estable (`checkHotfix`) no lleva la comprobación — el merge real del hotfix la lleva por `mergeFeature`, y un hotfix solo trae su carpeta; no hay caso de campo.
9. Mensajes, por salida de error y con salida 1: todos los choques de la primera ref que choca, uno por línea (con `develop` y `origin/develop`, se mira primero `develop`):
   - `numeración: la rama trae <carpeta de la rama> y '<ref>' ya tiene <carpeta del destino> con el id <id>; renumera la de la rama a mano`
   - `numeración: la rama trae decisions/<fichero de la rama> y '<ref>' ya tiene decisions/<fichero del destino> con el número <número>; renumera la de la rama a mano`
10. Las cinco reglas de lo nuevo:
    - **Regla ante conflicto**: la vigente de `feature-ids` (el segundo en darse cuenta renumera su carpeta y su rama y lo anota en el roadmap); para una ADR, la de la rama toma el número siguiente al más alto del destino. «a mano» porque no hay herramienta que renumere una rama con commits ni una ADR.
    - **Avisos**: las dos líneas `numeración: …` de la decisión 9.
    - **Idioma de los nombres**: el texto en castellano, como el resto de mensajes de `sdd merge`, con los nombres de carpeta y fichero literales.
    - **Dónde viven los datos** y **Límites**: no aplican, no hay dato nuevo.
    - `closing-merge` no tiene sección de reglas y no se le crea: esto queda en el requisito y en esta spec.
11. Aviso de `sdd id next` con un duplicado: `aviso: dos artefactos distintos comparten el id <id>: <carpeta a>, <carpeta b>; renumera uno.` por salida de error, y reserva o propone el siguiente libre por encima de todos — el texto sale del error de hoy (`scan.ts:101`), con «renumera uno» para que diga qué hacer.
- Política de modelos (solo en `delegate`): revisores de la spec según `sdd-spec-review` · revisión final en ejes: Spec opus+high, Código sonnet+high · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

1. **Aceptado** — Crítico: la comprobación solo en `integrateRef` queda fuera del cerrojo, y un choque que llega a `develop` durante la verificación es un cambio solo de docs que se publica sin reverificar → tercer punto de comprobación en `mergeFeature`, dentro del cerrojo (decisión 7, Approach, `AND` del delta y test en `failures.slow.test.ts`).
2. **Aceptado** — el merge sin `--verify` no comprobaba nada → lo cubre el mismo `mergeFeature`; la decisión 7 vieja sale.
3. **Rechazado** — `MODIFIED` no declarado en `--sync`, «fuera del cerrojo» y «deja la rama destino como estaba» → el requisito nuevo añade una condición de parada sin cambiar ninguno de esos THEN: `--sync` sigue integrando o diciendo «al día» cuando no hay choque, y el merge fallido sigue dejando el destino como estaba; el `ADDED` nombra `--sync` en su `AND`.
4. **Aceptado** — el destino con `--into` y la deduplicación entre `develop` y `origin/develop` → decisión 9 (para en la primera ref que choca) y decisión 8 (`--check` del hotfix fuera; su merge real comprueba por `mergeFeature`).
5. **Aceptado** — faltaban pruebas de `--verify`, del choque solo en `origin/develop` y del merge sin `--verify` → tres filas nuevas en «Dónde se prueba» y su `AND` en el delta.
6. **Rechazado** — `sdd id claim` y las skills dependerían de «no devuelve id» → `claim.ts` no llama a `idScan` (solo `next.ts` lo usa) y ninguna skill nombra ese paro (`grep -i duplic skills/`); queda dicho en el «No entra».
7. **Aceptado** — `specs/` y el patrón de nombre de ADR → decisión 3 y su `AND`.
8. **Aceptado** — la regla ante conflicto sin fuente → la decisión 10 cita la «Regla ante conflicto» vigente de `feature-ids` y dice cómo se renumera una ADR.
9. **Aceptado** — el siguiente libre con un id mayor que el duplicado → `AND` con la fila `0760` y el contador.
10. **Rechazado** — nombrar document-manager → es un proyecto del propio equipo y la fuente de la evidencia, ya nombrado en la fila 0363 del roadmap, en la deuda y en el ticket de campo; los nombres de carpeta de los ejemplos (`…-0756-a`, `…-0756-b`) son inventados.

Segunda ronda (un revisor sonnet, por el Crítico aceptado; sin tercera):

11. **Aceptado** — «trae la rama» frente al destino daba falso positivo si el destino renombró la carpeta o la ADR → se mide desde el merge-base (decisión 2, su `AND` y su caso en el unitario).
12. **Aceptado** — el hotfix sin prueba y sin estado final → decisión 7 (la vuelta se deshace entera, por `stable-branch`), `AND` y fila en `hotfix.slow.test.ts`.
13. **Aceptado** — orden de `mergeFeature` frente a la integración de `origin/develop` → decisión 7 y Approach: compara después de `syncBaseBranch`, contra el destino ya al día.
14. **Aceptado** — roles de `HEAD` y ref invertidos entre `integrateRef` y `mergeFeature` → firma con `branch`, `destination` y `destinationName` explícitos (Approach).
15. **Aceptado** — `--check` con `--branch`, su orden frente a `checkDestination` y la prueba de «sin fetch» → decisión 6, `AND` del checkout con cambios y dos filas en `destination.slow.test.ts`.
16. **Aceptado** — un choque por vez → decisión 9: todos los choques de la primera ref, con su `AND` y su caso en el unitario.
17. **Aceptado** — el `0000` de las ADR y dos números iguales dentro de la rama → decisión 5.
18. **Aceptado** — `specs/` y `superseded` sin caso propio → casos nombrados en el unitario.
19. **Aceptado** — las cinco reglas y cómo renumerar → decisión 10 y «a mano» en los mensajes.
20. **Aceptado** — orden de las decisiones y cuenta de tests → decisiones renumeradas del 1 al 11 y estimación con diez slow.

### Decisiones tomadas con el dev-lead

- `sdd id next` con un duplicado ya fusionado avisa y sigue, en esta misma feature — «1» (2026-11-25, a la opción «Avisa y sigue»)

## Intent

En document-manager, una feature y un patch con el id 0756, y dos ADR 0004 de ramas paralelas, se fusionaron sin aviso. El choque solo saltó después, en `sdd id next` y `sdd decision check`, y paró las reservas y los cierres de todo el proyecto hasta renumerar a mano (16 ficheros). Éxito: el choque se ve en la rama, antes de fusionar, con los dos ficheros nombrados; y si aun así llega un duplicado a la integración, `sdd id next` no bloquea a todos los worktrees. Anti-objetivo: que un duplicado ya fusionado impida fusionar a ramas que no lo traen.

## Scope

- Entra: la comprobación en `sdd merge --check`, en `sdd merge --sync`, antes de integrar la base en el merge con `--verify` y dentro del cerrojo antes del merge del cierre; `sdd id next` avisa y sigue con un duplicado; los tests de los dos casos del criterio y del aviso; los requisitos de `closing-merge` y `feature-ids`.
- No entra: que una rama sin fila publique su id al reservarlo (`claimWithoutRow` solo sube el contador local) — con la comprobación del merge, el choque ya no llega a la integración; una reserva con cerrojo para los números de ADR (`sdd decision next`); la comprobación en `--check` con `--into` a la rama estable (decisión 8); `sdd id claim`, que no usa `idScan` y no cambia.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `sdd id next` para con un id duplicado y no devuelve ninguno | `.docs/sdd/capabilities/feature-ids.md:56` (requisito) | delta `feature-ids`: `REMOVED` del título viejo y `ADDED` «El script avisa de un id duplicado y sigue» |
| la referencia a ese requisito | `.docs/sdd/capabilities/feature-ids.md:157` | delta `feature-ids`: `MODIFIED` de «El escaneo cuenta las carpetas `-feature-` y las `-task-`» |
| «en los dos primeros casos el script no devuelve id ni toca el contador» | `.docs/sdd/capabilities/feature-ids.md`, «Reglas de la capacidad», **Avisos** | delta `feature-ids`: entrada **Avisos** reescrita |
| el `throw` del duplicado y el nombre `assertNoSharedIds` | `cli/src/ids/scan.ts:90`, `:101` y `:165` | Approach: pasa a `warnSharedIds`, que avisa |
| el test «consumes no id when there are duplicate ids» | `cli/test/ids/reserve.slow.test.ts:202` | Dónde se prueba: pasa a reservar el siguiente libre con el aviso |
| el test «fails naming the id when two folders share it across lanes» | `cli/test/ids/next.slow.test.ts:31` | Dónde se prueba: pasa a proponer el siguiente libre con el aviso |
| el test «fails when a task folder and a feature folder share an id» (fixture `mixed-duplicate`), el escenario del `MODIFIED` de la línea 157 | `cli/test/ids/next.slow.test.ts:59` | pasa a «warns when…», con el aviso y salida 0 (se vio en el GREEN; ruling de la Task 1) |
| «Dos carpetas con el mismo id sin sufijo siguen siendo error» | `CHANGELOG.md:373` | decisión: se queda; es la entrada de una release pasada |

- Filas que implementa: 0363 → `ROADMAP.md` (fila 0363) y `.docs/sdd/steering/debt.md` (fila «Dos ramas paralelas toman el mismo id o el mismo número de ADR», «Lista», destino 0363): las marca el cierre.

## Approach

- **A. Listados de `git ls-tree` de las dos refs** — una función pura que, con los nombres de la rama y del destino, devuelve los choques; más un lector de refs con `git ls-tree`. Mira lo que cada rama tiene commiteado, sin depender de qué está sacado en disco. Cuesta un módulo nuevo de unas 60 líneas en `cli/src/merge/`.
- **B. Reutilizar `idScan` y `checkDecisions`** sobre un worktree con la rama ya integrada — detecta lo mismo después de mezclar. Obliga a integrar antes de comprobar (lo que `--check` no puede: no toca nada), y `idScan` lee también ramas, etiquetas y worktrees, que aquí no cuentan.
- **C. Comprobar tras el merge y deshacerlo si choca** — reutiliza `sdd decision check` tal cual, pero no sirve para `--check` y deja en el historial un merge que luego se deshace.
- Elegido: **A** — es la única que vale igual para `--check` (sin tocar nada) y para `--sync` (antes de integrar), y su núcleo es una función pura que se prueba sola. Reutiliza `SPEC_FOLDER_ID`, `BRANCH_CHANGE_FOLDERS` e `idsMode` de `cli/src/ids/scan.ts`.

Partes del cómo:

- Nuevo `cli/src/merge/numbering.ts`: `numberingClashes({ base, branch, destination })` (pura, sobre listas de nombres de carpetas de cambio y de ADR de cada lado) y `assertNoNumberingClash(root, { branch, destination, destinationName })`, con las dos refs explícitas: lee la rama, el destino y su merge-base con `git ls-tree` y lanza `DomainError` con una línea por choque. Las refs explícitas evitan que el mensaje salga al revés donde `HEAD` es el destino.
- `--check` (`mergeIntoIntegration`, `cli/src/merge/run.ts`): después de `checkDestination`, con la rama (`--branch` o `HEAD`) contra `merge.into` y, si existe, su seguimiento remoto.
- `--sync` y `--verify`: dentro de `integrateRef` (`cli/src/merge/steps.ts`), antes del `git merge`: rama `HEAD`, destino la ref que integra.
- El merge del cierre: dentro de `mergeFeature` (`cli/src/merge/steps.ts`), antes del `git merge`: rama `branch`, destino `HEAD` del checkout del destino (ya con `origin/develop` integrada por `syncBaseBranch`), nombre `into`.
- `sdd id next`: `assertNoSharedIds` pasa a `warnSharedIds` y su `throw` a `io.err` con el aviso de la decisión 11; el máximo ya cuenta los dos ids.

## Dónde se prueba

- Función pura de choques: unitario nuevo `cli/test/merge/numbering.test.ts`, como `keyed.test.ts`. Lo que cuenta: id de carpeta en `changes/`, en `specs/`, número de ADR, ADR `superseded`, dos choques en la misma ref (salen los dos). Lo que no: mismo nombre, nombre ya en el merge-base (renombrado en el destino), `0000` de carpeta y de ADR, sufijo heredado, modo `tracker` para carpetas, `README.md` en `decisions/`.
- `sdd merge --check` con `…-feature-0756-a` en el destino y `…-patch-0756-b` en la rama → salida 1 y las dos carpetas; y con `decisions/0004-a.md` y `decisions/0004-b.md` → salida 1 y los dos ficheros: slow, en `cli/test/merge/destination.slow.test.ts`, como sus casos de `--check`.
- `sdd merge --check` con el choque solo en `origin/develop` (la `develop` local sin él) → salida 1 nombrando `'origin/develop'`; con el remoto real adelantado con otro choque que el `origin/develop` local no tiene, ese no sale (no hay fetch), y las refs quedan iguales antes y después: slow, en `cli/test/merge/destination.slow.test.ts`.
- `sdd merge --check` con `develop` sacada con cambios y además un choque → sale el mensaje de destino sacado de siempre: slow, en `cli/test/merge/destination.slow.test.ts`.
- `sdd merge --sync` con el mismo choque → salida 1 y la rama sin tocar: slow, en `cli/test/merge/sync.slow.test.ts`.
- El merge del cierre sin `--verify`, con el choque en `develop` → salida 1 y `develop` como estaba: slow, en `cli/test/merge/failures.slow.test.ts`, como sus merges que fallan. Cubre `mergeFeature`, el punto por el que pasan también `--verify` y el hotfix.
- `sdd merge --verify` con el choque en la base → para al integrar la base, antes del gate: slow, en `cli/test/merge/verified-at.slow.test.ts`, como sus casos de `--verify`.
- El hotfix con el choque solo en `develop` → la vuelta para con el mensaje y se deshace entera, como sus vueltas que fallan: slow, en `cli/test/merge/hotfix.slow.test.ts`.
- `sdd id next --reserve` con el duplicado en disco → reserva el siguiente libre y escribe el aviso: `cli/test/ids/reserve.slow.test.ts`, cambiando el caso «consumes no id when there are duplicate ids»; sin `--reserve`, propone el siguiente libre con el aviso: `cli/test/ids/next.slow.test.ts`, cambiando «fails naming the id when two folders share it across lanes».

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing-merge`

#### ADDED — El merge para si la rama trae un id o un número de ADR que el destino ya usa

- GIVEN un proyecto en modo `sequence`, `develop` con `.docs/sdd/changes/20261123-141327-feature-0756-a/`, y la rama `feature/0757-x` con `.docs/sdd/changes/20261123-162919-patch-0756-b/`
- WHEN se ejecuta `sdd merge --check --project-root <worktree de la rama>`
- THEN sale con 1 sin tocar nada y escribe `numeración: la rama trae 20261123-162919-patch-0756-b y 'develop' ya tiene 20261123-141327-feature-0756-a con el id 0756; renumera la de la rama a mano`
- AND con `develop` con `.docs/sdd/decisions/0004-a.md` y la rama con `.docs/sdd/decisions/0004-b.md`, en cualquier modo de ids, sale con 1 y escribe `numeración: la rama trae decisions/0004-b.md y 'develop' ya tiene decisions/0004-a.md con el número 0004; renumera la de la rama a mano`
- AND `--check` compara con `develop` y, si existe, con `origin/develop`, sin fetch
- AND con el choque solo en `origin/develop`, `--check` sale con 1 y nombra `'origin/develop'`; con el choque en las dos, solo nombra `'develop'`; con dos choques en la misma ref, escribe las dos líneas
- AND con `develop` sacada con cambios sin commitear, `--check` da primero el mensaje de destino sacado de «La comprobación del destino no toca nada»
- AND `sdd merge --sync`, y el merge con `--verify` al integrar la base, paran igual antes de integrar, con la ref que integran (`origin/develop`) en el mensaje y la rama sin tocar
- AND el merge del cierre, con o sin `--verify`, y la vuelta del hotfix a `develop` vuelven a comprobar dentro del cerrojo, justo antes de fusionar: si `develop` recibió entretanto `…-feature-0756-a`, sale con 1 con el mismo mensaje y `develop` queda como estaba; en el hotfix, la vuelta se deshace entera, como manda `stable-branch`
- AND cuentan las carpetas de `changes/` y de `specs/`, y los ficheros `NNNN-<slug>.md` de `decisions/`, también los `superseded`
- AND solo cuenta lo que la rama trae desde su merge-base con el destino: con `develop` que ya tiene `…-feature-0756-a` y `…-patch-0756-b`, una rama que no trae ninguna carpeta con el id 0756 fusiona; y si `develop` renombró `…-feature-0756-a` a `…-feature-0756-a2` después del merge-base, la rama que aún lleva `…-feature-0756-a` fusiona
- AND no cuentan el id y el número `0000`, las carpetas las de sufijo heredado (`…-task-0006a-…`) ni, en modo `tracker`, las carpetas de cambio

### Capacidad: `feature-ids`

#### REMOVED — El script avisa de un id duplicado y no devuelve ninguno

- motivo: con un duplicado ya en la integración paraba las reservas de todos los worktrees; el siguiente id libre está bien definido igual, y el choque se para antes, en `sdd merge` (requisito «El merge para si la rama trae un id o un número de ADR que el destino ya usa» de `closing-merge`)

#### ADDED — El script avisa de un id duplicado y sigue

- GIVEN un proyecto en modo `sequence` donde dos carpetas de artefactos distintas llevan el mismo id, `20261123-141327-feature-0756-a` y `20261123-162919-patch-0756-b`, en `specs/`, en `changes/` o una en cada una, y ningún id mayor que 0756
- WHEN se invoca `sdd id next --reserve`
- THEN escribe por salida de error `aviso: dos artefactos distintos comparten el id 0756: 20261123-141327-feature-0756-a, 20261123-162919-patch-0756-b; renumera uno.` y devuelve `0757` por salida estándar
- AND sin `--reserve`, escribe el mismo aviso y propone `0757`
- AND con además una fila `0760` en el roadmap, devuelve `0761`: el duplicado no cambia cómo se calcula el siguiente libre, y `--reserve` deja el contador en el id devuelto
- AND las carpetas con sufijo alfabético heredadas (`…-task-0006a-…`, `…-task-0006b-…`) no cuentan como duplicado: el script las nombra en un aviso por salida de error, cuenta su número como ocupado y devuelve el siguiente id libre

#### MODIFIED — El escaneo cuenta las carpetas `-feature-` y las `-task-` (antes: "se aplica «El script avisa de un id duplicado y no devuelve ninguno»")

- GIVEN un proyecto en modo `sequence` con `specs/20260920-100000-task-0063-a/`, `specs/20261001-091500-feature-0079-b/` y `specs/20261002-100000-patch-0080-c/`, sin ninguna fila del roadmap, rama, worktree ni contador con un id mayor
- WHEN se ejecuta `sdd id next --project-root <raíz>` sin `--reserve`
- THEN propone `0081`
- AND si solo existiera `…-feature-0079-b/`, propondría `0080`
- AND si `specs/` tiene a la vez `…-task-0063-a/` y `…-feature-0063-b/`, es un id duplicado: se aplica «El script avisa de un id duplicado y sigue», sin distinguir carril

#### Reglas de la capacidad — feature-ids

- **Avisos**: ids duplicados entre artefactos, proyecto en modo `tracker` y ramas omitidas por no ser raíz del repositorio se avisan por salida de error; con ids duplicados el script sigue y devuelve el siguiente libre, y en modo `tracker` no devuelve id ni toca el contador. El script avisa además por salida de error si el contador no se puede leer (y lo reinicializa) y si no hay repositorio git donde reservar (sin reservar). También avisa si el cerrojo no se libera en el plazo, nombrando al dueño y sin reservar. `sdd id claim` dice por la salida estándar si el id es tuyo, si ya estaba publicado, si pasa a otro, si se fijó con una etiqueta, si no hay remoto o no se comprueba en él, cuándo la rama no se renombra o no avanza, y si el destino tiene cambios.

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0,5h
- Estimación de implementación: 3,5h
- Base de la estimación: un módulo puro nuevo con su unitario, cuatro puntos de llamada, un cambio de una línea en `scan.ts` y diez tests slow (cuatro de `--check`, y uno de `--sync`, del cierre, de `--verify`, del hotfix, de `reserve` y de `next`) sobre helpers de repo que ya existen; incertidumbre en montar destino y rama en los tests slow de `--sync` y `--verify`
- Confianza: media

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-25 | aprobada (opción «Apruebo») |
