---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261029-152256-feature-0244-merge-docs-conflicts
task: 0244
mode: lite
date: 2026-10-29
---

# Ticket para el kit — feature 0244: unión por celdas de los registros y de los THEN y AND de un requisito

## Contexto

- Carril y modo: feature lite
- Skills del kit usadas: sdd-propose, sdd-start-feature, sdd-implement, sdd-worktrees, sdd-tdd, sdd-verify, sdd-parallel-agents, sdd-archive, add-to-changelog, sdd-feedback
- Proyecto: el repo del kit (CLI en Node y TypeScript, Vitest, moon), un dev-lead, varias sesiones en worktrees del mismo clon
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: eje Spec y re-revisión en Opus 5.5 (effort high), eje Código en Sonnet 5.5 (effort high)
- Coste en reloj: 0,54 h de esfuerzo frente a 2,5 h estimadas, hasta el commit de cierre; la CI de la rama y su relanzamiento sumaron ~20 min más
- Coste en tokens: 26,8 M (hilo 23,6 M, subagentes 3,2 M), 11,35 $ hasta el cierre

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un AND del delta contradecía otro requisito vivo de la misma capacidad, y el repaso de coherencia no lo vio

- **Qué pasó**: el ADDED «Dentro de un requisito de una capacidad se unen los THEN y AND que cambia cada lado» decía «si los dos lados […] añaden líneas en el mismo hueco, sigue siendo conflicto». El requisito vivo «El merge del cierre une los registros que solo añaden líneas» ya unía esos trozos (base vacía) en cualquier fichero, `capabilities/` incluido. El eje Spec de la revisión final lo probó con un merge de git en diff3, y el cierre paró por un desvío: el dev-lead eligió «Corregir el AND».
- **Fuente**: `.docs/sdd/specs/20261029-153348-feature-0244-merge-docs-conflicts/spec.md` §Enmiendas (la entrada «aprobada (opción «Corregir el AND»)»); `.docs/sdd/capabilities/control-profiles.md`, requisito «El merge del cierre une los registros que solo añaden líneas»
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4, «Coherence pass»: las cuatro comprobaciones miran dentro de la spec, y la búsqueda fuera de ella es solo para los `MODIFIED`
- **Por qué el kit no lo evitó**: un `ADDED` no se contrasta con los requisitos vivos de la misma capacidad que gobiernan la misma entrada; `sdd capability merge` sobre la copia lo aceptó, porque no lee semántica
- **Coste**: una parada del dev-lead en `delegate` y ~5 min (la enmienda, la pregunta y el borrador de `capabilities/` rehechos), respaldado por la enmienda de la spec
- **Propuesta**: en el repaso de coherencia, para cada `ADDED` o `MODIFIED`, buscar en su capacidad los requisitos cuyo WHEN nombra el mismo comando o la misma entrada, y comprobar que ningún THEN o AND del delta dice lo contrario; si lo dice, el delta lleva el `MODIFIED` del otro o el AND se acota. Sin frase nueva: sustituye «For each `MODIFIED` in the delta» por «For each `ADDED` or `MODIFIED`»
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec cuyo ADDED dice «añaden en el mismo hueco → conflicto» y una capacidad con un requisito vivo que une los trozos que solo añaden WHEN el sujeto hace el repaso de coherencia de `sdd-propose` THEN la spec que presenta acota el AND o lleva el `MODIFIED` del otro requisito

### 2. La CI de la rama no se pudo relanzar por la cuenta activa de `gh`

- **Qué pasó**: el run de `ci.yml` de la rama falló al instalar proto (`curl: (35) Recv failure: Connection reset by peer` en `moonrepo/setup-toolchain@v0`), sin correr tests. `gh run rerun 40899450998 --failed` (PowerShell) → `run 40899450998 cannot be rerun; Must have admin rights to Repository.`, también desde el `!` del dev-lead. La cuenta activa no era la dueña del repo; tras `gh auth switch`, el rerun pasó y el run salió en verde.
- **Fuente**: `gh run view 40899450998 --log-failed`; `gh auth status` → dos cuentas, la activa sin admin; `gh run view 40899450998 --json conclusion` → `success` tras el rerun
- **Dónde en el kit**: `CLAUDE.md` del repo, regla 7 (la CI de la rama), y `.docs/sdd/tech-stack.md` §Testing, «CI de la base»: dicen cómo leer el resultado, no qué hacer con un rojo de infraestructura ni con qué cuenta
- **Por qué el kit no lo evitó**: la regla es de hoy (llegó con el merge de sincronización) y no nombra el rerun; con `failure` manda no fusionar, sin distinguir un rojo que no llegó a correr tests
- **Coste**: ~15 min y dos paradas del dev-lead (la opción de relanzar y la pregunta por la cuenta), sin respaldo en un commit
- **Propuesta**: «CI de la base» gana una frase: un run que falla antes de correr la suite (instalación de herramientas, red) se relanza con `gh run rerun <id> --failed`, con la cuenta dueña del repo (`gh auth status`), y no cuenta como rojo de la rama
- **Verificada**: sí — el rerun con la cuenta dueña pasó (`gh run rerun 40899450998 --failed`, PowerShell, salida 0) y el run acabó en `success`
- **Criterio de aceptación**: GIVEN un run de la rama en `failure` en el paso de instalar proto y `gh` con otra cuenta activa WHEN el cierre mira la CI de la rama THEN cambia o nombra la cuenta, relanza el job y fusiona con el run en verde, sin parar a preguntar si es rojo de la rama

## Lo que hice por iniciativa propia

- Smoke de la 0248 en ejecución real: un worktree en el commit de la rama de entonces, el `git merge` de su lado de `develop` y `resolveConflicts` de la rama llamado desde un script del scratchpad; quedó una fila con los dos cambios y `sdd roadmap check` en verde. Funcionó y dio la única fila `ejecución real` del smoke.
- Antes de la revisión, `repeatedIdentities` sobre el roadmap real con la clave vieja y la nueva, para ver que quitar el prefijo no creaba ids repetidos (0 en los dos).

## Funcionó, no tocar

- La línea `Política de modelos:` del ✋ aprobado sirvió de confirmación para despachar los ejes en paralelo sin preguntar otra vez.
- Los dos ejes cazaron Important distintos: Código, la expresión duplicada y estrechada del prefijo de cierre; Spec, el AND contradicho, con git real.
- Reproducir el `--sync` de la 0248 antes de la spec: su causa (la fila tratada como una pieza) salió en minutos y cambió la decisión 1.

## Menores

- Lancé por error un subagente vacío («placeholder», `noop`) mientras esperaba al eje Spec: 568.006 tokens según `sdd session tokens`, sin cambios — no localizado.
- Un RED de la spec probaba un caso imposible (cambiar el texto del ítem, que es la clave) y una decisión del ✋ lo describía; corregido con una enmienda sin aprobar — `skills/sdd-propose/SKILL.md` paso 4.
- El borrador de la entrada del changelog del paso 7 de `sdd-start-feature` salió en cuatro frases; `add-to-changelog`, cargado ya en el cierre, pide una — `skills/sdd-start-feature/SKILL.md` paso 7 (no nombra `add-to-changelog` para el borrador).
- El smoke de la 0248 se hizo en una rama temporal (`-b`), y el hook del dev-lead bloquea `git branch -D`: la rama queda para borrarla a mano; con `--detach` no habría quedado — no localizado.
- La estimación (2,5 h) se pasó un 78 %: di por incierta la unión línea a línea, que salió en una función corta — `.docs/sdd/estimation.md`.
