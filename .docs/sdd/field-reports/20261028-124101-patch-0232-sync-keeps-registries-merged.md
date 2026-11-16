---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261028-124101-patch-0232-sync-keeps-registries-merged
task: 0232
mode:
date: 2026-10-28
---

# Ticket para el kit — patch 0232: `sdd merge --sync` deja unidos los registros cuando choca otro fichero

## Contexto

- Carril y modo: patch (petición cerrada)
- Skills del kit usadas: `sdd-propose`, `sdd-start-patch`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (CLI en TypeScript con Vitest, skills en Markdown), una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica
- Coste en reloj: 0,40 h frente a 2,17 h estimadas (1 h + 1,17 h del gate de cierre)
- Coste en tokens: 6.430.325 en el hilo, 2,85 $, medido antes del gate

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `kit:test` sale en verde sin correr ningún test

- **Qué pasó**: en el gate de cierre, `kit:test` corrió y salió con 0, pero Pester escribió `System.Management.Automation.RuntimeException: No test files were found and no scriptblocks were provided.` En `origin/develop` ya no queda ningún `tests/*.Tests.ps1`: el único `.ps1` de `tests/` es el propio lanzador. El script termina con `exit ($result.FailedCount + $result.FailedContainersCount)`, y con la excepción `$result` no tiene valor, así que el exit es 0.
- **Fuente**: `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop` en Git Bash, con la salida guardada en el scratchpad. `git ls-tree -r --name-only origin/develop tests | grep 'Tests.ps1$'` → solo `tests/Invoke-KitTests.ps1`. `tests/Invoke-KitTests.ps1:12-14`.
- **Dónde en el kit**: `tests/Invoke-KitTests.ps1` y las tareas `kit:test` y `kit:test-fast` de `moon.yml`; la línea `Gate:` de `sdd-verify` la registra como corrida
- **Por qué el kit no lo evitó**: el lanzador solo cuenta los fallos, no los tests que corrieron; desde la 0227 la carpeta está vacía de Pester y nadie lo vio, porque el gate sigue en verde
- **Coste**: ~3 min en esta sesión para ver que el verde estaba vacío; el riesgo es mayor: un gate que se da por verde con una tarea que no prueba nada. Causa sin respaldo en un walkthrough: lo deduzco del `ls-tree`
- **Propuesta**: que `Invoke-KitTests.ps1` salga con 1 si `$result` es nulo o si `TotalCount` es 0. Otra opción: retirar `kit:test` del gate en la 0228, que quita PowerShell del repo.
- **Verificada**: sí — reproducido con el gate de cierre en Git Bash sobre `bcf324b8`
- **Criterio de aceptación**: GIVEN `tests/` sin ningún `*.Tests.ps1` WHEN `moon run kit:test` THEN sale con un código distinto de 0 y lo dice, o la tarea ya no está en el gate de `tech-stack.md` §Testing

## Lo que hice por iniciativa propia

- Para tener un RED limpio, guardé el arreglo en el scratchpad, devolví `cli/src/merge/` a `HEAD` y corrí solo el test nuevo. La primera pasada había corrido con el arreglo a medio escribir, y su salida no decía la causa del fallo. Funcionó: el RED falló por `MERGE_HEAD`, que es la razón esperada.

## Funcionó, no tocar

- La fila 0232 del roadmap traía GIVEN/WHEN/THEN, ficheros y decisiones. El carril se confirmó sin preguntar y el patch se abrió en un turno.
- `sdd capability merge` sobre una copia de `.docs/sdd` en el scratchpad mostró con el diff que el delta solo cambiaba las dos líneas previstas.

## Menores

- La estimación del gate tomó los 70 min del patch 0222, una pasada que se alargó por un cuelgue de la máquina. El gate tardó 5 min 43 s, y la estimación se pasó un −80 %. «La última medida» debería saltarse una pasada marcada como anómala. — `skills/sdd-propose/SKILL.md` paso 2 (estimación de un patch)
- El worktree no tenía `node_modules`, y `vitest` no se encontró hasta correr `pnpm install`. El carril patch no pasa por `sdd-worktrees`, que prepara el entorno. — `skills/sdd-start-patch/SKILL.md` paso 4
- El primer RED corrió con el arreglo a medio escribir: lancé la suite en segundo plano y edité `src` mientras corría (~6 min perdidos). — `skills/sdd-start-patch/SKILL.md` paso 1 (el RED de la petición cerrada)
