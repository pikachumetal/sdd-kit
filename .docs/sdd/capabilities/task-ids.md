# Capacidad — task-ids

Verdad viva del comportamiento observable de la numeración del trabajo: cómo un proyecto decide sus ids de task y de patch, quién los asigna y qué garantiza que no se repitan. Cubre los dos carriles porque comparten secuencia. Cada requisito tiene un título estable: las specs lo citan literal en `MODIFIED (antes: …)`. La declaró la spec de la task `task-ids` en sus «Decisiones a validar» (decisión 2).

## Requisitos

### El proyecto declara cómo numera su trabajo
- GIVEN un proyecto inicializado o migrado con el kit v1.2.0 o posterior
- WHEN se lee `.docs/sdd/sdd-kit.json`
- THEN el fichero lleva `"ids": { "mode": "tracker" | "sequence" }`

### Un proyecto sin campo `ids` numera como hasta ahora
- GIVEN un proyecto cuyo `sdd-kit.json` no tiene campo `ids`
- WHEN una skill del kit necesita el modo de ids
- THEN el modo efectivo es `tracker` y ninguna conducta cambia respecto a la versión anterior del kit

### La entrevista de init decide el modo de ids
- GIVEN una init greenfield o brownfield en el bloque (d) de proceso
- WHEN el agente pregunta por el gestor de tickets
- THEN pregunta a continuación cómo se numeran las tasks: ids del gestor (`tracker`) o secuencia propia del proyecto (`sequence`)
- AND escribe la respuesta en `sdd-kit.json`; «no sé» deja `tracker`

### Tasks y patches comparten una sola secuencia
- GIVEN un proyecto en modo `sequence`
- WHEN se asigna el id de una task o de un patch
- THEN sale de la misma secuencia correlativa: un id nunca se repite entre carriles

### En modo secuencia el id lo reserva el hilo principal al planificar
- GIVEN un proyecto en modo `sequence` con una release en planificación
- WHEN `sdd-start-release` escribe las tasks en el roadmap
- THEN cada fila lleva su id reservado, correlativo y explícito
- AND el agente que abre el worktree de una task toma el id de su fila y no lo recalcula

### Una task no planificada obtiene su id con un script determinista
- GIVEN un proyecto en modo `sequence` y una task o patch sin fila en el roadmap
- WHEN se invoca `Get-NextSddId.ps1` desde la raíz del proyecto
- THEN devuelve por salida estándar el siguiente id libre en cuatro dígitos: el mayor id encontrado en `.docs/sdd/specs/`, en `.docs/sdd/roadmap.md` y en los nombres de rama locales y remotos, más uno
- AND el script no escribe nada y no hace `git fetch`: lee las referencias tal como están en el repositorio
- AND `0000` no cuenta como id ocupado: un proyecto cuyo histórico es todo `0000` recibe `0001`
- AND un id heredado con sufijo alfabético (`…-task-0006a-slug`) sí cuenta

### El script avisa de un id duplicado y no devuelve ninguno
- GIVEN un proyecto en modo `sequence` donde dos carpetas de `specs/` distintas llevan el mismo id
- WHEN se invoca `Get-NextSddId.ps1`
- THEN escribe el id duplicado y las rutas implicadas por salida de error, y no devuelve ningún id por salida estándar

### El script avisa si el proyecto no está en modo secuencia
- GIVEN un proyecto en modo `tracker` (declarado o por ausencia del campo `ids`)
- WHEN se invoca `Get-NextSddId.ps1`
- THEN avisa de que el proyecto numera con el gestor y no devuelve ningún id

### El script avisa cuando omite las ramas
- GIVEN un proyecto en modo `sequence` cuya raíz no es la raíz de su repositorio (un proyecto dentro de un monorepo)
- WHEN se invoca `Get-NextSddId.ps1`
- THEN devuelve el id calculado con las demás fuentes y avisa por salida de error de que omite las ramas, nombrando el repositorio que encontró
- AND no lee las ramas del repositorio padre: sus ids no son ids de este proyecto

### La rama reserva el id del trabajo no planificado
- GIVEN un proyecto en modo `sequence` y un arranque sin fila de roadmap
- WHEN el agente ya tiene el id que le dio el script
- THEN crea la rama con ese id **antes** de crear la carpeta de artefactos, y esa rama es lo que el siguiente cálculo ve como id ocupado

### Una task partida toma el siguiente id, no un sufijo
- GIVEN una task que se parte en dos durante la planificación o la ejecución
- WHEN se nombra la segunda mitad
- THEN recibe el siguiente id libre de la secuencia, nunca un sufijo tipo `0006a`
- AND su `spec.md` (o `patch.md`) lleva `parent: <id>` en el frontmatter y el roadmap le da su fila propia

### En modo gestor el id es el del ticket
- GIVEN un proyecto en modo `tracker` y una skill que necesita un id (`sdd-start-task`, `sdd-start-patch`, `sdd-start-release`, `sdd-consult`)
- WHEN el trabajo tiene ticket en el gestor
- THEN el id es el del ticket, y `0000` cuando el trabajo no tiene ticket

### En modo secuencia el id sale de la reserva o del script
- GIVEN un proyecto en modo `sequence` y una skill que necesita un id
- WHEN el trabajo tiene fila en el roadmap
- THEN el id es el reservado en esa fila; sin fila, el que devuelve `Get-NextSddId.ps1`
- AND en ningún modo se elige un número a ojo, y `sdd-consult` puede calcular y proponer el siguiente id pero no lo reserva ni lo escribe en ningún artefacto

**Reglas de la capacidad**
- **Dónde viven los datos**: el modo vive en `.docs/sdd/sdd-kit.json` (campo `ids.mode`); la reserva de cada id vive en la fila del roadmap o en el nombre de la rama; ninguna skill guarda un contador aparte.
- **Idioma de los nombres**: claves y valores de `sdd-kit.json` en inglés (`ids.mode`, `tracker`, `sequence`), como el resto del fichero; el texto de las skills sigue en castellano.
- **Límites**: cuatro dígitos con ceros a la izquierda (`0001`–`9999`); `0000` reservado como comodín de «sin ticket» en modo `tracker`.
- **Avisos**: ids duplicados entre artefactos, proyecto en modo `tracker` y ramas omitidas por no ser raíz del repositorio se avisan por salida de error; en los dos primeros casos el script no devuelve id.
- **Regla ante conflicto**: manda la fila del roadmap sobre el cálculo del script — es la reserva humana. Si dos arranques simultáneos toman el mismo id, el segundo en darse cuenta renumera su carpeta y su rama (su trabajo aún no está mergeado) y lo anota en el roadmap.
- **Contrato de lectura del roadmap**: el script reconoce un id en la primera columna de una fila de tabla (`| 0001 |`), en los nombres de artefacto (`task-<id>-`, `patch-<id>-`) y en un segmento del nombre de rama (`feature/0001`, `hotfix/0001-slug`). Cualquier otra aparición de cuatro dígitos (fechas, versiones) no cuenta.

## Historial

- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED El proyecto declara cómo numera su trabajo
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED Un proyecto sin campo `ids` numera como hasta ahora
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED La entrevista de init decide el modo de ids
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED Tasks y patches comparten una sola secuencia
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED En modo secuencia el id lo reserva el hilo principal al planificar
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED Una task no planificada obtiene su id con un script determinista
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED El script avisa de un id duplicado y no devuelve ninguno
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED El script avisa si el proyecto no está en modo secuencia
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED El script avisa cuando omite las ramas (hallazgo de la revisión final, no estaba en el delta de la spec)
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED La rama reserva el id del trabajo no planificado
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED Una task partida toma el siguiente id, no un sufijo
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED En modo gestor el id es el del ticket
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED En modo secuencia el id sale de la reserva o del script
