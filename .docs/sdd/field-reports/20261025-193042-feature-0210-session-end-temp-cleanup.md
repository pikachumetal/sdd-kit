---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261025-193042-feature-0210-session-end-temp-cleanup
task: 0210
mode: lite
date: 2026-10-25
---

# Ticket para el kit — feature 0210: hook `SessionEnd` que borra los temporales de Claude Code del proyecto

## Contexto

- Carril y modo: feature lite, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-start-feature`, `sdd-implement` (Native), `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit (CLI en Node con Vitest, Pester para las skills), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: eje Spec y re-revisión opus + `sdd-kit:effort-high`, eje Código sonnet + `sdd-kit:effort-high`; un sujeto Haiku de sonda
- Coste en reloj: 2,37 h de esfuerzo real frente a 2,5 h estimadas; reloj de la sesión 5,33 h, con 178 min contados como espera al dev-lead
- Coste en tokens: 36.306.021 del hilo y 2.301.473 de subagentes; 14,83 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La suite lenta del gate coincidió con dos cuelgues del PC

- **Qué pasó**: con otras tres features abiertas en sus worktrees, el gate de cierre (`moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`) tardó 1094 s y dejó `cli:test-slow` y `cli:test-min` sin correr; al relanzarlas con `moon run --force cli:test-slow cli:test-min` (8 workers), una pasada dio 63 tests en el tope de 120 s (`Tests  63 failed | 234 passed (297)`), y las dos siguientes coincidieron con un cuelgue del PC. Con `--maxWorkers 2` (decisión del dev-lead) pasaron: `cli:test-min` 1479/1479 en 678 s y `cli:test-slow` 296/297 en 659 s, con un fallo de `git push` del fixture que pasó al repetirlo.
- **Fuente**: el walkthrough de la feature 0210, §4.1, y `cli/moon.yml` (`--maxWorkers, '8'` en `test-slow` y `test-min`).
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 1 (la suite completa de la validación) y la deuda del patch 0190 («queda: la carga de otras sesiones, que el mutex de moon no ordena»).
- **Por qué el kit no lo evitó**: el mutex de moon ordena las suites de un worktree, no las de varios; nada mira la carga antes de lanzar la suite lenta.
- **Coste**: dos cuelgues y tres pasadas de la suite lenta; minutos sin respaldo.
- **Propuesta**: que el gate de cierre pase las suites lentas con menos workers cuando hay otros worktrees del repo con una suite en marcha (o con un cerrojo entre worktrees, como el de `sdd merge`), y que el walkthrough lo diga.
- **Verificada**: sin verificar (que la carga causara los cuelgues, no; que con 2 workers pasa, sí: una pasada).
- **Criterio de aceptación**: GIVEN dos worktrees del kit con `cli:test-slow` en marcha en uno, WHEN el otro lanza el gate de cierre, THEN el segundo espera al primero o corre con menos workers, y ningún test llega al tope de 120 s por carga.

### 2. `sdd session tokens` cuenta como espera al dev-lead las esperas a tareas en segundo plano

- **Qué pasó**: `Esfuerzo real: 1,36 h — reloj de la sesión 3,31 h … sin 117 min de espera al dev-lead (3 esperas)`, y al final `2,37 h — … 5,33 h … sin 178 min (8 esperas)`. El dev-lead contestó sus preguntas en segundos: las esperas son turnos que cerré esperando la línea base, el gate, los ejes de la revisión y la re-revisión.
- **Fuente**: `node cli/bin/sdd.js session tokens --path . --branch feature/0210-session-end-temp-cleanup`, las dos ejecuciones citadas en el walkthrough de la feature 0210, §2.
- **Dónde en el kit**: `cli/src/session/clock.ts`; es el caso (b) de la fila del patch 0211 («la espera empieza cuando el agente cierra su turno»), en otra forma: el turno que cierra el agente no pide respuesta.
- **Por qué el kit no lo evitó**: el reloj trata el fin de turno del agente como espera aunque el siguiente evento sea una notificación de tarea en segundo plano, no un mensaje del dev-lead.
- **Coste**: 117 min al primer cálculo y 178 min al final contados como espera; el esfuerzo real cuadra con la estimación solo porque los dos errores se compensan (walkthrough de la feature 0210, §2).
- **Propuesta**: que el patch 0211 trate como trabajo el hueco que acaba en una notificación de tarea (`task-notification`) y no en un mensaje tecleado.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un transcript donde el agente cierra el turno a las 10:00 y la siguiente entrada es una notificación de tarea a las 10:18, WHEN se mide la sesión, THEN esos 18 min no cuentan como espera al dev-lead.

### 3. `sdd merge --sync` falló con `fatal: stash failed` y `pnpm` no lanzaba, solo en PowerShell, y no investigué la causa

- **Qué pasó**: en la sesión retomada tras el segundo cuelgue, en la herramienta PowerShell (pwsh 7): `node cli/bin/sdd.js merge --sync --project-root .` → `base: git merge falló sin conflictos.` y `fatal: stash failed`; antes, `pnpm exec vitest run test/merge/lock-and-base.slow.test.ts` → `'"C:\Program Files\PowerShell\7\pwsh.exe"' is not recognized as an internal or external command`, también con `pnpm --dir cli exec …`. En la misma sesión de PowerShell, el merge a mano (`git -c merge.conflictStyle=zdiff3 merge -X diff-algorithm=histogram --no-commit --no-ff origin/develop`) sí arrancó, con sus conflictos de registros. Desde Bash (Git Bash), los dos comandos funcionaron a la primera: el sync integró la base en `46d73ffc` y el test pasó 10/10. Comprobé `ComSpec=C:\WINDOWS\system32\cmd.exe`, `pnpm config get script-shell` → `undefined`, `npm config get script-shell` → `null`, sin `merge.autoStash` en la config de git y sin `stash` en `cli/src` (`git grep -n stash -- cli/src`, vacío). La causa no la busqué: el cierre siguió por Bash.
- **Fuente**: las salidas de esos comandos en la sesión; `cli/src/merge/attempt.ts:39` (el mensaje `git merge falló sin conflictos`).
- **Dónde en el kit**: `cli/src/merge/attempt.ts`, `abortedMergeError`: el error enseña las últimas líneas de la salida, pero no el comando git ni su código de salida; y `skills/sdd-archive/references/merge-recipe.md`, «Denied by the environment», que no cubre un fallo del entorno que no es una denegación.
- **Por qué el kit no lo evitó**: el mensaje no dice qué comando falló ni con qué código, y `stash` no lo lanza la CLI, así que la pista apunta a otro proceso (un hook o el entorno heredado por la sesión retomada). Ninguna regla dice qué hacer cuando el mismo verbo funciona en otro shell.
- **Coste**: unos 10 min de diagnóstico y un rodeo por Bash; la causa queda sin conocer.
- **Propuesta**: que `abortedMergeError` añada el comando y su código de salida; reproducir en una sesión de PowerShell retomada (`--resume`) tras matar el proceso de Claude Code, y comparar `$env:Path`, `PSModulePath` y `GIT_*` con los de una sesión nueva.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un `git merge` que sale con un código distinto de 0 sin conflictos, WHEN `sdd merge --sync` lo informa, THEN el mensaje lleva el comando git y su código de salida además de la cola de la salida.

### 4. El repaso de coherencia no midió los topes de palabras de los documentos que la spec editaba

- **Qué pasó**: la spec editaba `architecture.md` (1900/1900 palabras) y `tech-stack.md` (19278/19280) sin la sección «Topes de palabras»; lo vi al escribir las frases y las encajé recortando otras, sin subir el tope.
- **Fuente**: `tests/WordBudget.Tests.ps1` (`'architecture.md' = 1900`, `'tech-stack.md' = 19280`) y el conteo `-split '\s+'` del mismo test sobre los dos ficheros.
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md`, «Topes de palabras» (la regla existía), y `skills/sdd-propose/SKILL.md` paso 4, repaso de coherencia, que no la nombra entre sus cuatro comprobaciones.
- **Por qué el kit no lo evitó**: la regla está en la plantilla, no en el paso que repasa la spec; no la apliqué.
- **Coste**: unos 10 min de reescribir frases, sin respaldo; el eje Spec marcó después que `tech-stack.md` no decía qué hace el `SessionEnd`, y la pasada de fix tuvo que volver a recortar.
- **Propuesta**: que el repaso de coherencia de `sdd-propose` paso 4 cruce el Scope con los ficheros que un test limita en palabras y exija la tabla.
- **Verificada**: sí — contrastado con `skills/sdd-propose/SKILL.md` paso 4 (no nombra los topes) y `spec-template.md` (sí).
- **Criterio de aceptación**: GIVEN una spec cuyo Scope edita `tech-stack.md`, WHEN el agente hace el repaso de coherencia, THEN la spec presentada lleva «Topes de palabras» con su fila medida.

## Lo que hice por iniciativa propia

- Medí con un sujeto Haiku el nombre de una ruta larga y probé en Node el hash (`bjejxf`): convirtió una búsqueda por prefijo con su guarda en un cálculo exacto. Funcionó; es un desvío que el dev-lead aprobó.
- Contrasté cada rojo del gate en un worktree desanclado de `develop` antes de darlo por ajeno. Funcionó.

## Funcionó, no tocar

- La línea `Política de modelos:` del ✋ sirvió de confirmación para despachar los ejes en paralelo sin volver a preguntar.
- Los dos ejes marcaron los mismos dos Important (comentarios que citaban la spec y la feature) por caminos distintos, y la re-revisión única cerró los 17 hallazgos.
- `sdd capability merge` sobre una copia de `.docs/sdd` antes del gate de la spec: el delta entró a la primera al cerrar.

## Menores

- El freno de alcance por «fichero de la task cambiado en la base» paró por `tech-stack.md`, que la base cambiaba en líneas que no eran la de la task; una pregunta de respuesta obvia — `skills/sdd-start-feature/references/control-profiles.md`, «Fichero de la task cambiado en la base».
- Dos tests de la pasada de fix salieron RED por el cambio de firma y no por la falta del comportamiento; la re-revisión lo señaló — `skills/sdd-tdd/SKILL.md`, «Verify RED».
- Al retomar la sesión sin `Start-KitSession.ps1`, el harness listó skills de una caché vieja (`sdd-end-feature`, `sdd-consult`); seguí el texto de la rama — `.claude/hooks/Test-KitSessionSource.ps1`.
