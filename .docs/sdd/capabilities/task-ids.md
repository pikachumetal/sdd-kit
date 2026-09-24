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
- WHEN `sdd-start-release` escribe N tasks nuevas en el roadmap
- THEN sus ids salen de una sola reserva `Get-NextSddId.ps1 -Reserve -Count N`, y cada fila lleva el suyo
- AND el agente que abre el worktree de una task toma el id de su fila, sin reservar ni recalcular

### Una task no planificada obtiene su id con un script determinista
- GIVEN un proyecto en modo `sequence` y una task o patch sin fila en el roadmap
- WHEN se invoca `Get-NextSddId.ps1 -Reserve` desde la raíz del proyecto
- THEN devuelve por salida estándar el siguiente id en cuatro dígitos: el mayor valor entre el contador del proyecto y el mayor id encontrado en `.docs/sdd/specs/` y `.docs/sdd/roadmap.md` del working tree; en el roadmap y las carpetas de `specs/` de cada rama local y remota, y en su nombre salvo el de la rama actual; y en el roadmap y las carpetas de `specs/` del disco de cada worktree de `git worktree list`, más uno
- AND lo que otro worktree tiene reservado sin fusionar cuenta aunque no esté en ninguna rama: una fila del roadmap en *staged* o una carpeta de `specs/` sin commitear
- AND deja ese id consumido en el contador
- AND no hace `git fetch`: lee las referencias tal como están en el repositorio
- AND `0000` no cuenta como id ocupado: un proyecto cuyo histórico es todo `0000` recibe `0001`
- AND un id heredado con sufijo alfabético (`…-task-0006a-slug`) sí cuenta

### El script avisa de un id duplicado y no devuelve ninguno
- GIVEN un proyecto en modo `sequence` donde dos carpetas de `specs/` distintas llevan el mismo id
- WHEN se invoca `Get-NextSddId.ps1`, con `-Reserve` o sin él
- THEN escribe el id duplicado y las rutas implicadas por salida de error, y no devuelve ningún id por salida estándar
- AND el contador no cambia

### El script avisa si el proyecto no está en modo secuencia
- GIVEN un proyecto en modo `tracker` (declarado o por ausencia del campo `ids`)
- WHEN se invoca `Get-NextSddId.ps1`, con `-Reserve` o sin él
- THEN avisa de que el proyecto numera con el gestor y no devuelve ningún id
- AND no crea ni toca el contador

### El script avisa cuando omite las ramas
- GIVEN un proyecto en modo `sequence` cuya raíz no es la raíz de su repositorio (un proyecto dentro de un monorepo)
- WHEN se invoca `Get-NextSddId.ps1`
- THEN devuelve el id calculado con `specs/` y el roadmap del working tree, sin leer ramas ni el disco de otros worktrees, y avisa por salida de error de que omite las ramas, nombrando el repositorio que encontró
- AND no lee las ramas del repositorio padre: sus ids no son ids de este proyecto

### Una task partida toma el siguiente id, no un sufijo
- GIVEN una task que se parte en dos durante la planificación o la ejecución
- WHEN se nombra la segunda mitad
- THEN recibe un id reservado con `Get-NextSddId.ps1 -Reserve`, nunca un sufijo tipo `0006a`
- AND su `spec.md` (o `patch.md`) lleva `parent: <id>` en el frontmatter y el roadmap le da su fila propia

### En modo gestor el id es el del ticket
- GIVEN un proyecto en modo `tracker` y una skill que necesita un id (`sdd-start-task`, `sdd-start-patch`, `sdd-start-release`, `sdd-consult`)
- WHEN el trabajo tiene ticket en el gestor
- THEN el id es el del ticket, y `0000` cuando el trabajo no tiene ticket

### En modo secuencia el id sale de la reserva o del script
- GIVEN un proyecto en modo `sequence` y una skill que necesita un id
- WHEN el trabajo tiene fila en el roadmap
- THEN el id es el que reserva esa fila; sin fila, el que reserva `Get-NextSddId.ps1 -Reserve`
- AND en ningún modo se elige un número a ojo. `sdd-consult` puede proponer el siguiente id con el script sin `-Reserve`, pero no lo reserva ni lo escribe en ningún artefacto

### Sin reserva, el script solo propone
- GIVEN un proyecto en modo `sequence`
- WHEN se invoca `Get-NextSddId.ps1` sin `-Reserve`
- THEN devuelve el mismo cálculo, con el contador incluido, y no escribe nada: ni el contador ni ningún fichero del proyecto

### Dos reservas simultáneas no comparten id
- GIVEN dos procesos en el mismo worktree o en dos worktrees del mismo repositorio
- WHEN los dos invocan `Get-NextSddId.ps1 -Reserve` a la vez
- THEN cada uno recibe un id distinto, y el contador queda en el mayor de los dos

### Un id reservado queda consumido aunque el trabajo se abandone
- GIVEN un id reservado del que no queda rama, carpeta ni fila
- WHEN se reserva otra vez
- THEN el id nuevo es mayor que el reservado: nunca se reutiliza

### Una reserva de varios ids devuelve ids consecutivos
- GIVEN un proyecto en modo `sequence`
- WHEN se invoca `Get-NextSddId.ps1 -Reserve -Count 3`
- THEN devuelve tres ids consecutivos, uno por línea, y el contador queda en el último

### El escaneo inicializa o corrige el contador
- GIVEN un repositorio sin contador, o con un contador menor que el mayor id que ve el escaneo
- WHEN se reserva
- THEN la base es el mayor id del escaneo, y el contador queda en el id reservado
- AND si el contador no se puede leer, el script avisa por la salida de error y lo reinicializa con el escaneo

### Cada proyecto de un repositorio reserva en su propio contador
- GIVEN un proyecto en modo `sequence` cuya raíz es una subcarpeta de su repositorio
- WHEN se invoca `Get-NextSddId.ps1 -Reserve`
- THEN el id se consume en `sdd-ids-<ruta relativa>` del directorio común, y el contador `sdd-ids` de la raíz no se lee ni se toca

### Sin repositorio git no se reserva
- GIVEN un proyecto en modo `sequence` que no está dentro de un repositorio git
- WHEN se invoca `Get-NextSddId.ps1 -Reserve`
- THEN falla con un mensaje que dice que no hay dónde reservar, y no devuelve ningún id

### La reserva precede a la rama y a la carpeta
- GIVEN un proyecto en modo `sequence` y un arranque de task o de patch sin fila de roadmap
- WHEN el agente necesita el id
- THEN lo reserva con `Get-NextSddId.ps1 -Reserve` antes de crear la rama y la carpeta, y usa ese id en las dos

**Reglas de la capacidad**
- **Dónde viven los datos**: el modo, en `.docs/sdd/sdd-kit.json` (`ids.mode`). El último id consumido, en `<git-common-dir>/sdd-ids` (`sdd-ids-<ruta relativa>` si el proyecto está en una subcarpeta), compartido por todos los worktrees del repositorio y fuera del árbol versionado. La fila del roadmap y la rama siguen siendo donde se ve cada reserva.
- **Idioma de los nombres**: claves y valores de `sdd-kit.json` en inglés (`ids.mode`, `tracker`, `sequence`), como el resto del fichero; el texto de las skills sigue en castellano.
- **Límites**: cuatro dígitos con ceros a la izquierda (`0001`–`9999`); `0000` reservado como comodín de «sin ticket» en modo `tracker`. Una reserva que pasaría de `9999` falla sin reservar. `-Count` va de 1 a 99. Una sola máquina: con varias máquinas en `sequence` haría falta un cerrojo en el remoto o el modo `tracker`. Hay un contador por proyecto: `sdd-ids` en la raíz del repositorio y `sdd-ids-<ruta relativa>` en una subcarpeta.
- **Avisos**: ids duplicados entre artefactos, proyecto en modo `tracker` y ramas omitidas por no ser raíz del repositorio se avisan por salida de error; en los dos primeros casos el script no devuelve id ni toca el contador. El script avisa además por salida de error si el contador no se puede leer (y lo reinicializa) y si no hay repositorio git donde reservar (sin reservar). También avisa si el cerrojo no se libera en el plazo, nombrando al dueño y sin reservar.
- **Regla ante conflicto**: la fila del roadmap manda. El contador nunca baja: si el escaneo ve un id mayor, gana el escaneo. Si aun así dos trabajos acaban con el mismo id, el segundo en darse cuenta renumera su carpeta y su rama y lo anota en el roadmap.
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
- 2026-09-23 — 20260922-220001-patch-0035-ids-de-otras-ramas — MODIFIED Una task no planificada obtiene su id con un script determinista (roadmap y `specs/` de todas las ramas y roadmap del disco de cada worktree; fusionado por la task 0067) · MODIFIED El script avisa cuando omite las ramas (tampoco lee el disco de los worktrees; fusionado por la task 0067)
- 2026-09-23 — 20260923-103947-patch-0038-specs-de-otros-worktrees — MODIFIED Una task no planificada obtiene su id con un script determinista (carpetas de `specs/` del disco de cada worktree; fusionado por la task 0067)
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — MODIFIED Una task no planificada obtiene su id con un script determinista
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — ADDED Sin reserva, el script solo propone
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — ADDED Dos reservas simultáneas no comparten id
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — ADDED Un id reservado queda consumido aunque el trabajo se abandone
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — ADDED Una reserva de varios ids devuelve ids consecutivos
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — ADDED El escaneo inicializa o corrige el contador
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — ADDED Cada proyecto de un repositorio reserva en su propio contador
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — ADDED Sin repositorio git no se reserva
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — MODIFIED El script avisa de un id duplicado y no devuelve ninguno
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — MODIFIED El script avisa si el proyecto no está en modo secuencia
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — REMOVED La rama reserva el id del trabajo no planificado
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — ADDED La reserva precede a la rama y a la carpeta
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — MODIFIED En modo secuencia el id lo reserva el hilo principal al planificar
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — MODIFIED Una task partida toma el siguiente id, no un sufijo
- 2026-09-24 — 20260924-105243-task-0059-reserve-ids — MODIFIED En modo secuencia el id sale de la reserva o del script
