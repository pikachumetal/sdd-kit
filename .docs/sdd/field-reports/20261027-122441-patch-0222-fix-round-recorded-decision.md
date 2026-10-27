---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: patch
id: 20261027-122441-patch-0222-fix-round-recorded-decision
task: 0222
mode:
date: 2026-10-27
---

# Ticket para el kit — patch 0222: una ronda que aplica una decisión registrada sigue con la enmienda marcada

## Contexto

- Carril y modo: patch (petición cerrada por el dev-lead)
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-start-patch`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, tests Pester y Vitest), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica (12 sujetos headless Sonnet en las baterías)
- Coste en reloj: 2,16 h frente a 1,98 h estimadas hasta el commit de cierre; después, ~16 h de reloj de pared en el paso 6 de `sdd-archive` (base integrada, rojo, contraste), con un cuelgue de la máquina por medio
- Coste en tokens: 17.484.243 del hilo, 8,91 $ hasta el cierre; sujetos 2,57 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El contraste de un rojo de la receta no corre tal cual en un worktree recién creado ni con un gate `--affected`

- **Qué pasó**: tras `sdd merge --sync`, la suite sobre la base integrada dio 1 rojo en `cli:test-min` (`test/merge/cleanup.slow.test.ts`, push a un remoto *bare* del test: `error: unable to migrate temporary objects`). Seguí la receta: `git worktree add --detach … base-0222 origin/develop` y «the same command, as is». Tres intentos sin veredicto: (a) el gate es `moon run … --affected --base develop`, y en un worktree de la propia base no hay nada afectado, así que corrí `moon run cli:test-min`; (b) falló con `Error: Cannot find module '…\base-0222\cli\node_modules\vitest\vitest.mjs'` porque el worktree nuevo no tiene dependencias; (c) tras `pnpm --dir cli install --frozen-lockfile`, la tanda quedó esperando el cerrojo de suites de otra rama abierta («Esperando el cerrojo de suites: lo tiene feature/0221-affected-closing-gate … PID 300»). El dev-lead: «estas tereminado ya?» y «pues arreglalo!?!?». Lo resolvió correr solo el fichero rojo, con la rama y sin ella a la vez, con `pnpm --dir cli exec vitest run test/merge/cleanup.slow.test.ts`: 15/15 y 15/15 en ~10 min.
- **Fuente**: salidas guardadas en el scratchpad de la sesión (`gate-3.txt`, `base-1.txt`, `base-3.txt`, `one-base.txt`, `one-branch.txt`); `skills/sdd-archive/references/merge-recipe.md:17`; `.docs/sdd/tech-stack.md:32` (gate con `--affected --base develop`)
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md`, «A red suite»; `skills/sdd-archive/SKILL.md` paso 6
- **Por qué el kit no lo evitó**: la receta da el worktree desacoplado y «el mismo comando tal cual», pero no dice qué hacer cuando el comando es `--affected` contra la propia base, ni que el worktree nuevo necesita el entorno (dependencias), ni que el contraste puede quedarse en cola tras el cerrojo de otra rama. Tampoco ofrece contrastar solo el fichero que falla.
- **Coste**: dos tandas fallidas (~10 min y ~16 min de máquina) y una espera al cerrojo sin final a la vista; el merge esperó hasta que el dev-lead preguntó. Causa: las salidas citadas arriba.
- **Propuesta**: en «A red suite», el contraste corre primero el **fichero que falla**, con el runner del proyecto, en la rama y sin ella a la vez; la suite entera, solo si el fichero pasa en los dos y el rojo no se explica. El worktree del contraste prepara su entorno como `sdd-worktrees` (dependencias) antes de correr nada. Con un gate `--affected`, el contraste nombra la tarea roja sin `--affected`.
- **Verificada**: sí — reproducido en esta sesión con los comandos de arriba en Git Bash
- **Criterio de aceptación**: GIVEN un gate `moon run … --affected --base develop` con 1 rojo en `test/x.slow.test.ts` y un worktree de la base recién creado WHEN el agente contrasta THEN corre `test/x.slow.test.ts` sin la rama y en la rama antes que la suite, con las dependencias instaladas, y llega a un veredicto sin esperar el cerrojo de otra rama.

### 2. Con `KIT_DIR` relativo, `battery.sh` da verde a sujetos que no cargaron el kit

- **Qué pasó**: el RED de `k3` y `c6` con `KIT_DIR=.temp/kit-red-0222` imprimió `k3 · 2/2 · umbral 2/2 · verde` y `c6 · 2/2 · umbral 2/2 · verde`, pero los 4 sujetos recibieron `Unknown skill: sdd-kit:sdd-implement. 1 plugin did not load in this session (path not found)` y siguieron sin el kit. Lo vi al leer `texts.txt`.
- **Fuente**: `tools.txt` de los sujetos de la tanda descartada (borrada; cita en `tests/sdd-deviations-0222-red.md`, «Ensayo descartado»); `tests/headless/lib.sh:48` (`cygpath -m` de una ruta relativa sigue relativa)
- **Dónde en el kit**: `tests/headless/battery.sh` (veredicto de la puerta) y `tests/headless/lib.sh` (`subject_init`)
- **Por qué el kit no lo evitó**: el veredicto de la puerta no comprueba que la primera llamada a `Skill` resolvió, y `KIT_DIR` no se valida como absoluto, a diferencia de `RUNS_DIR`.
- **Coste**: 0,45 $ y una tanda. Fila de deuda abierta por triar en el roadmap («Con `KIT_DIR` relativo…»).
- **Propuesta**: `lib.sh` resuelve `KIT_DIR` a ruta absoluta (o aborta si es relativa), y `battery.sh` da rojo a un sujeto cuyo `tools.txt` lleva `Unknown skill` en la primera llamada.
- **Verificada**: sí — reproducido con la tanda descartada en Git Bash
- **Criterio de aceptación**: GIVEN `KIT_DIR=.temp/kit` relativo WHEN corre `battery.sh` THEN aborta con la ruta, o el veredicto del escenario sale rojo con «el kit no cargó».

### 3. La mitad de una solución fijada por el dev-lead cae por un RED limpio y el carril patch no lo prevé

- **Qué pasó**: la fila 0222 fijaba dos reglas (`sdd-implement` y `sdd-verify`). El RED de la segunda (`c6`) salió 2/2 limpio: con el texto de hoy los sujetos ya paran. El Art. I prohíbe escribir esa guía, y `tech-stack.md` manda no descartar sin el dev-lead; paré con una pregunta («Recortar») en un patch `delegate` que por lo demás no paraba.
- **Fuente**: `tests/sdd-deviations-0222-red.md`, `c6`; `.docs/sdd/constitution.md`, Art. I; `.docs/sdd/tech-stack.md`, «Un baseline limpio no reproduce los fallos de sesiones largas»
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 1 (variante de la petición cerrada), que no menciona el RED limpio
- **Por qué el kit no lo evitó**: la regla del recorte vive en `tech-stack.md` de este repo, no en el carril patch; lo apliqué por haberlo leído en el paso 1 de `sdd-propose`.
- **Coste**: una parada (pocos minutos). Sin respaldo de más coste.
- **Propuesta**: en la variante de la petición cerrada, una línea: si el RED de una parte sale limpio, esa parte se recorta con la pregunta al dev-lead (quien fijó la solución) y el escenario queda como regresión.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un patch de petición cerrada con dos reglas y el RED de una limpio WHEN el agente sigue `sdd-start-patch` THEN pregunta el recorte al dev-lead antes de escribir esa regla, y no la escribe ni la descarta solo.

## Lo que hice por iniciativa propia

- Contrasté el rojo corriendo solo el fichero que fallaba, con la rama y sin ella a la vez: veredicto en 10 min en vez de una suite de ~30 en cola. Funcionó (hallazgo 1).
- Ensayo en seco (`DRY_RUN=1`) de los moldes nuevos antes del RED: cazó que el commit del fix de `c6` reescribía el fichero entero por CRLF. Funcionó.

## Funcionó, no tocar

- La pregunta del carril que no se repite cuando la petición dice «carril patch» y la investigación lo confirma.
- `sdd capability merge` sobre una copia en el scratchpad antes del cierre.
- El contraejemplo `k2` en el mismo punto de la skill: con la excepción nueva, el control siguió 2/2 sin leerla como licencia.

## Menores

- La 1.ª pasada del gate de cierre la cortó un cuelgue de la máquina; el `task-notification` de la sesión nueva no dijo en qué tarea iba. — no localizado
- `--affected` saltó `cli:typecheck` y lo esperaba en la lista; la línea de `patch.md` lo explica. — `.docs/sdd/tech-stack.md:32`
- La suite repetida tras `sdd merge --sync` (57 min) ya tiene sus filas de deuda («La suite completa se repite tras el merge de sincronización…» y «Con otra rama abierta, la base se integra después de la primera suite…»): este patch es otro caso. — `skills/sdd-archive/SKILL.md` paso 6
