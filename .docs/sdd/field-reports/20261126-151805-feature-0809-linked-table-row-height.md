---
kit_version: 3.0.5
lane: feature
id: 20261126-151805-feature-0809-linked-table-row-height
task: 0809
mode: spike
date: 2026-11-26
---

# Ticket para el kit — feature 0809: un spike se cerró y fusionó sin escribir las filas que proponía

## Contexto

- Carril y modo: feature, `mode: spike`; lo detecta la sesión que corta la release siguiente
- Skills del kit usadas: `sdd-archive` (en la sesión que cerró el spike), `sdd-end-release`, `sdd-roadmap`, `add-to-changelog`
- Proyecto: aplicación web interna con backend .NET y frontend React, un dev-lead y cuatro personas más
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: no medido
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un spike cierra y se fusiona con sus filas «para después del cierre», y nadie las escribe

- **Qué pasó**: la spec del spike decidió (decisión 21) que las tres filas que su `research.md` §5 propone (A, B y C)
  «entran en el roadmap con `sdd-roadmap` tras el cierre». El cierre marcó la fila del spike `✅`, fusionó en la rama de
  integración y no escribió ninguna. La fila del spike lleva la tarea del tracker de prioridad máxima que el spike
  investigaba; con el `✅` y sin filas hijas, la tarea se dio por arreglada (hallazgo 2). Lo descubrió, una hora después,
  la sesión que cortaba la release al leer el walkthrough para escribir la línea del changelog. Las filas se
  escribieron entonces con ids nuevos.
- **Fuente**: el walkthrough del spike, §5 → «Las filas A, B y C entran en el roadmap con `sdd-roadmap` tras el cierre
  (decisión 21 de la spec)»; `git log -1 --format='%h %ad'` del commit de cierre del spike → 15:01; commit `934ca764d`
  del roadmap con las tres filas; `git grep 'tras el cierre (decisión'` en los cierres del proyecto → solo este.
- **Dónde en el kit**: `skills/sdd-archive/references/records.md` §Roadmap (solo cambia la fila del propio cambio y
  añade la suya si no tiene); `skills/sdd-templates/templates/research-template.md:44` («Un arreglo que la medida deja a
  la vista va aquí, con su fila»), que pide la fila pero nadie comprueba que exista; `skills/sdd-spec-writing/SKILL.md`,
  que deja aprobar una decisión que aplaza un paso del cierre.
- **Por qué el kit no lo evitó**: ningún paso del cierre lee el `research.md` de un spike ni compara las filas que nombra
  con el roadmap. `roadmap check` valida la forma, no que un `✅` de spike tenga hijas.
- **Coste**: una tarea de prioridad máxima del tracker dada por arreglada y anunciada como «sale con la release» sin
  código; una hora hasta detectarlo, más la corrección en el tracker. Cifra de la hora sin respaldo más allá del sha del
  cierre y del de las filas.
- **Propuesta**: en `sdd-archive`, para `mode: spike`, un paso antes del merge: cada fila que `research.md` §«Lo que sale»
  nombra con `→ fila …` tiene que existir en el roadmap con su id (escrita con `sdd-roadmap` en el mismo cierre), o el
  cierre para. Y en `sdd-spec-writing`, una decisión que aplaza al «tras el cierre» un paso que el cierre hace no se
  aprueba.
- **Verificada**: sí — contrastado con `skills/sdd-archive/references/records.md` §Roadmap, que no nombra el
  `research.md` ni las filas de un spike.
- **Criterio de aceptación**: GIVEN un spike cuyo `research.md` §5 dice «→ fila A por abrir» y el roadmap no tiene esa
  fila, WHEN `sdd-archive` llega al merge, THEN para con «research.md propone la fila A y el roadmap no la tiene:
  hay que escribirla con sdd-roadmap antes de fusionar», y no fusiona.

### 2. La fila `✅` de un spike no se distingue de la de un arreglo, y la sesión de la release la dio por arreglo

- **Qué pasó**: al alinear el tracker con el roadmap, la sesión de la release vio la fila del spike en `✅` con su
  tarea del tracker y comentó en ella «Corregido en dev; sale con la release», y la movió a revisión, sin abrir el
  walkthrough. Era falso: el spike solo mide. Hubo que poner un comentario de corrección y devolverla a «en curso».
- **Fuente**: la fila del spike en el roadmap, `| ✅ |` con la tarea del tracker en «Externo»; el título del artefacto
  («Walkthrough — Spike: …»), que la sesión no leyó hasta escribir el changelog.
- **Dónde en el kit**: `skills/sdd-archive/references/records.md` §Roadmap («The change's row stays in Now with `✅`»),
  igual para un spike que para una feature; `skills/sdd-roadmap/SKILL.md`, entrada «Tracker items», que no dice qué
  estado tiene en el tracker una tarea cuyo spike cerró.
- **Por qué el kit no lo evitó**: el estado de la fila no dice si el cambio arregló o solo midió. El error de no leer el
  artefacto antes de mover la tarea es de la sesión; ninguna regla del kit pide leerlo antes de tocar el tracker.
- **Coste**: un comentario falso visible para el equipo en una tarea de prioridad máxima, y su corrección.
- **Propuesta**: que el cierre de un spike deje su fila en `✅ → <ids de las filas que propone>`, y que la tarea del
  tracker pase a esas filas («Externo») en el mismo cierre, no se quede en la del spike.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un spike con una tarea del tracker en «Externo» que propone dos filas, WHEN cierra,
  THEN su fila dice `✅ → 0827, 0828` y las dos filas nuevas llevan la tarea en «Externo».

### 3. `roadmap publish` hace el commit en la rama de integración y no lo sube

- **Qué pasó**: dos publicaciones seguidas del roadmap (una fila nueva y un reordenado) quedaron solo en el clon local
  («ahead 2») hasta que la sesión lo vio al ir a fusionar otra cosa. Entretanto, un id reservado en esas filas no existía
  para otro clon que reservara desde el remoto.
- **Fuente**: `git status -sb` en la rama de integración tras las dos publicaciones → `## dev...origin/dev [ahead 2]`;
  `skills/sdd-roadmap/SKILL.md` paso 6 → «for another clone, until its start runs `sdd id claim`».
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md` paso 6 y `cli/src` de `roadmap publish`.
- **Por qué el kit no lo evitó**: el paso cuenta con `sdd id claim` para los otros clones, y `id claim` sin fila no publica
  nada (ticket de colisiones de ids, hallazgos 5 y 6, en esta misma carpeta).
- **Coste**: sin colisión esta vez; riesgo de la misma colisión de ids que ya costó una tarde.
- **Propuesta**: `roadmap publish` sube el commit con `merge.push: true`, como `sdd merge --push`.
- **Verificada**: sí — observado con `git status -sb` en PowerShell tras dos publicaciones.
- **Criterio de aceptación**: GIVEN `merge.push: true`, WHEN `roadmap publish` acaba, THEN `git status -sb` de la rama de
  integración no dice «ahead».

## Lo que hice por iniciativa propia

- Busqué en todos los cierres del proyecto la misma frase de aplazamiento para ver si había otros spikes con filas sin
  escribir: solo este. Funcionó como comprobación barata; candidata a ser el paso del hallazgo 1.

## Funcionó, no tocar

- El changelog de la release obliga a leer el artefacto de cada fila para elegir su categoría: es lo que destapó el
  hallazgo 1.
