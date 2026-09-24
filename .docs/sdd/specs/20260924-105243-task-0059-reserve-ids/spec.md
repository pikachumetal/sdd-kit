---
id: 20260924-105243-task-0059-reserve-ids
task: 0059
title: Reservar ids en vez de calcularlos
mode: lite
status: approved
created: 2026-09-24
author: Claude (Opus 5.5), dev-lead Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-24
---

# Spec — Reservar ids en vez de calcularlos

## Decisiones que he tomado yo — valida estas

1. **El mismo cerrojo, en un fichero propio**: `sdd-ids.lock` en el directorio común, no `sdd-merge.lock`. Un merge con `-VerifyCommand` tiene el cerrojo varios minutos y dejaría esperando a quien arranca una task. Las funciones del cerrojo salen de `Invoke-SddMerge.ps1` a `scripts/SddLock.ps1`, y los dos scripts lo cargan. Esto toca `Invoke-SddMerge.ps1`, que no está en la fila: la otra opción era copiar unas 60 líneas, y el Art. X prohíbe la duplicación. Los mensajes del merge («Esperando el cerrojo de merge…») no cambian.
2. **El contador es el fichero `sdd-ids`**, en `git rev-parse --git-common-dir`, y guarda el último id consumido en cuatro dígitos.
3. **Cómo reserva `-Reserve [-Count N]`**: toma el cerrojo y hace el escaneo actual dentro de él. La base es el mayor de dos números, el contador y el mayor id del escaneo. Reserva de `base+1` a `base+N`, escribe `base+N` en el contador y suelta el cerrojo. Devuelve los N ids, uno por línea.
4. **Sin `-Reserve`, el script sigue sin escribir nada**, pero ahora lee el contador y propone el mayor de los dos, más uno. Así `sdd-consult` no propone un id que otro worktree ya reservó. El atajo de la rama actual del patch 0027 se mantiene solo en este modo.
5. **Con `-Reserve` no hay atajo por la rama actual.** El flujo no reserva dos veces: quien tiene fila o ya reservó no vuelve a llamar al script.
6. **Casos de error**. Si el contador no se puede leer, el script avisa por la salida de error y lo reinicializa con el escaneo. Sin repositorio git, `-Reserve` falla sin reservar nada. Si la reserva pasaría de `9999`, también falla sin reservar. `-Count` va de 1 a 99. El cerrojo espera 2 minutos como máximo (`-LockTimeoutMinutes`), porque una reserva dura segundos.
7. **Un contador por proyecto** *(enmienda del 2026-09-24; antes, uno por repositorio)*. En la raíz del repositorio el fichero es `sdd-ids`. Si el proyecto está en una subcarpeta (un monorepo, o dentro de un repositorio padre ajeno), el fichero es `sdd-ids-<ruta relativa>`, en el mismo directorio común. El cerrojo sigue siendo uno por repositorio.
8. **Qué guidance cambia en el hito 2**: `nombrado.md`, el paso 2 de `sdd-start-patch` y el paso 3 de `sdd-start-release`. También cambian `roadmap-fuente.md` de release y el índice de scripts de `sdd-templates`. `sdd-consult` no cambia: calcula y propone sin reservar, y eso sigue siendo correcto.
9. **El hito 3 de `sdd-start-task` abarca más que el paso 2.** La fila nombra el paso 2 (el id de las tasks partidas). Pero el paso 3 dice «la rama con el id del script se crea ANTES de la carpeta — es el acto de reserva», y lo mismo repiten un red flag y una racionalización. Con el contador, ese texto contradice la regla nueva. Entran los cuatro sitios, siempre después de integrar la 0057 desde `develop`. Si la 0057 tarda, la task cierra sin el hito y la fila anota qué queda pendiente.
10. **Campaña del Art. I para el hito 2**, con previsión y techo comunes al RED y al GREEN:
    - Escenarios (un sujeto Sonnet por escenario y fase): un patch sin fila, una release que escribe 3 filas nuevas y una task partida (lee `nombrado.md` desde `sdd-start-task`).
    - **Previsión**: 6 sujetos, ~5 $ y ~1 h de reloj. El GREEN de la task partida puede esperar al hito 3.
    - **Techo**: 9 sujetos, 10 $ y 1,5 h. Si se supera, paro y decides tú.
    - El script y su test Pester (hito 1) no llevan campaña: primero el test en RED y después el código.
11. **Sin migración**: el contador se inicializa solo la primera vez que alguien reserva. Al cerrar, el changelog lleva su entrada. El bump de versión va en la release.
12. **Un commit por hito**: la apertura (esta spec), el script con su test, la guidance con su evidencia, `sdd-start-task` si da tiempo, y el cierre.
13. **Corregido en el repaso de coherencia**: el requisito «La rama reserva el id…» tenía un título que contradecía su contenido nuevo. El título es la clave de fusión en `capabilities/`, así que no bastaba con cambiarle el texto: pasa a REMOVED y lo sustituye un ADDED, «La reserva precede a la rama y a la carpeta».

### Decisiones tomadas con el dev-lead

- Carril task, modo lite, perfil `delegate`, la fila 0059 como enunciado. Es una excepción al corte de la 2.0.0 porque rompe algo en uso: «Task lite, delegate (Recomendada)» (2026-09-24).
- El orden de los hitos, el límite de una sola máquina y que el hito 3 dependa de la 0057 salen de la petición de arranque del 2026-09-24.

## Intent

`Get-NextSddId.ps1` calcula el siguiente id leyendo el repositorio y no reserva nada. Entre calcularlo y commitearlo siempre queda una ventana. Cuatro parches le enseñaron a mirar en un sitio más cada vez, y aun así hubo dos colisiones reales en dos días (ticket 0055 §2: seis ficheros renumerados). Esta task cambia el cálculo por una reserva: un contador que comparten todos los worktrees de la máquina, protegido por un cerrojo. Un id reservado no vuelve a salir.

## Scope

- Entra:
  - `Get-NextSddId.ps1 -Reserve [-Count N]` y el contador en el directorio común de git.
  - `SddLock.ps1`, extraído de `Invoke-SddMerge.ps1`.
  - El test Pester, con dos procesos que reservan a la vez.
  - `nombrado.md`, `sdd-start-patch`, `sdd-start-release` (con `roadmap-fuente.md`) y el índice de `sdd-templates`.
  - Los pasos 2 y 3 de `sdd-start-task`, con su red flag y su racionalización, después de la 0057.
  - La capacidad `task-ids`.
- No entra:
  - Un cerrojo en el remoto, para varias máquinas.
  - El modo `tracker`.
  - Renumerar ids existentes.
  - Cambios en `sdd-consult`.
  - Una migración.

## Approach

El escaneo se queda tal cual y pasa a ser la corrección del contador. El contador vive fuera del árbol versionado, así que ni se commitea ni provoca conflictos de merge. La exclusión mutua la da el cerrojo de fichero que `Invoke-SddMerge.ps1` ya usa en producción: `CreateNew` atómico, con el dueño escrito dentro y detección de huérfanos por PID. La guidance cambia la llamada: donde decía «el que devuelve `Get-NextSddId.ps1`», dirá «el que reserva `Get-NextSddId.ps1 -Reserve`».

## Delta de comportamiento

### Capacidad: `task-ids`

**MODIFIED — Una task no planificada obtiene su id con un script determinista** (antes: «devuelve … el mayor id encontrado … más uno» y «el script no escribe nada»)
- GIVEN un proyecto en modo `sequence` y una task o patch sin fila en el roadmap
- WHEN se invoca `Get-NextSddId.ps1 -Reserve` desde la raíz del proyecto
- THEN devuelve por salida estándar el siguiente id en cuatro dígitos: el mayor valor entre el contador del proyecto y el mayor id encontrado en `.docs/sdd/specs/`, en `.docs/sdd/roadmap.md` y en los nombres de rama locales y remotos, más uno
- AND deja ese id consumido en el contador
- AND no hace `git fetch`: lee las referencias tal como están en el repositorio
- AND `0000` no cuenta como id ocupado: un proyecto cuyo histórico es todo `0000` recibe `0001`
- AND un id heredado con sufijo alfabético (`…-task-0006a-slug`) sí cuenta

**ADDED — Sin reserva, el script solo propone**
- GIVEN un proyecto en modo `sequence`
- WHEN se invoca `Get-NextSddId.ps1` sin `-Reserve`
- THEN devuelve el mismo cálculo, con el contador incluido, y no escribe nada: ni el contador ni ningún fichero del proyecto

**ADDED — Dos reservas simultáneas no comparten id**
- GIVEN dos procesos en el mismo worktree o en dos worktrees del mismo repositorio
- WHEN los dos invocan `Get-NextSddId.ps1 -Reserve` a la vez
- THEN cada uno recibe un id distinto, y el contador queda en el mayor de los dos

**ADDED — Un id reservado queda consumido aunque el trabajo se abandone**
- GIVEN un id reservado del que no queda rama, carpeta ni fila
- WHEN se reserva otra vez
- THEN el id nuevo es mayor que el reservado: nunca se reutiliza

**ADDED — Una reserva de varios ids devuelve ids consecutivos**
- GIVEN un proyecto en modo `sequence`
- WHEN se invoca `Get-NextSddId.ps1 -Reserve -Count 3`
- THEN devuelve tres ids consecutivos, uno por línea, y el contador queda en el último

**ADDED — El escaneo inicializa o corrige el contador**
- GIVEN un repositorio sin contador, o con un contador menor que el mayor id que ve el escaneo
- WHEN se reserva
- THEN la base es el mayor id del escaneo, y el contador queda en el id reservado
- AND si el contador no se puede leer, el script avisa por la salida de error y lo reinicializa con el escaneo

**ADDED — Cada proyecto de un repositorio reserva en su propio contador**
- GIVEN un proyecto en modo `sequence` cuya raíz es una subcarpeta de su repositorio
- WHEN se invoca `Get-NextSddId.ps1 -Reserve`
- THEN el id se consume en `sdd-ids-<ruta relativa>` del directorio común, y el contador `sdd-ids` de la raíz no se lee ni se toca

**ADDED — Sin repositorio git no se reserva**
- GIVEN un proyecto en modo `sequence` que no está dentro de un repositorio git
- WHEN se invoca `Get-NextSddId.ps1 -Reserve`
- THEN falla con un mensaje que dice que no hay dónde reservar, y no devuelve ningún id

**MODIFIED — El script avisa de un id duplicado y no devuelve ninguno** (añade: la reserva no consume)
- GIVEN un proyecto en modo `sequence` donde dos carpetas de `specs/` distintas llevan el mismo id
- WHEN se invoca `Get-NextSddId.ps1`, con `-Reserve` o sin él
- THEN escribe el id duplicado y las rutas implicadas por salida de error, y no devuelve ningún id por salida estándar
- AND el contador no cambia

**MODIFIED — El script avisa si el proyecto no está en modo secuencia** (añade: sin contador)
- GIVEN un proyecto en modo `tracker` (declarado o por ausencia del campo `ids`)
- WHEN se invoca `Get-NextSddId.ps1`, con `-Reserve` o sin él
- THEN avisa de que el proyecto numera con el gestor y no devuelve ningún id
- AND no crea ni toca el contador

**REMOVED — La rama reserva el id del trabajo no planificado**
- motivo: la reserva la hace el contador. La rama ya no es el acto de reserva, y crearla antes que la carpeta deja de ser necesario. El requisito siguiente lo sustituye.

**ADDED — La reserva precede a la rama y a la carpeta**
- GIVEN un proyecto en modo `sequence` y un arranque de task o de patch sin fila de roadmap
- WHEN el agente necesita el id
- THEN lo reserva con `Get-NextSddId.ps1 -Reserve` antes de crear la rama y la carpeta, y usa ese id en las dos

**MODIFIED — En modo secuencia el id lo reserva el hilo principal al planificar** (antes: sin decir con qué)
- GIVEN un proyecto en modo `sequence` con una release en planificación
- WHEN `sdd-start-release` escribe N tasks nuevas en el roadmap
- THEN sus ids salen de una sola reserva `Get-NextSddId.ps1 -Reserve -Count N`, y cada fila lleva el suyo
- AND el agente que abre el worktree de una task toma el id de su fila, sin reservar ni recalcular

**MODIFIED — Una task partida toma el siguiente id, no un sufijo** (antes: «el siguiente id libre»)
- GIVEN una task que se parte en dos durante la planificación o la ejecución
- WHEN se nombra la segunda mitad
- THEN recibe un id reservado con `Get-NextSddId.ps1 -Reserve`, nunca un sufijo tipo `0006a`
- AND su `spec.md` (o `patch.md`) lleva `parent: <id>` en el frontmatter y el roadmap le da su fila propia

**MODIFIED — En modo secuencia el id sale de la reserva o del script** (antes: «sin fila, el que devuelve `Get-NextSddId.ps1`»)
- GIVEN un proyecto en modo `sequence` y una skill que necesita un id
- WHEN el trabajo tiene fila en el roadmap
- THEN el id es el que reserva esa fila; sin fila, el que reserva `Get-NextSddId.ps1 -Reserve`
- AND en ningún modo se elige un número a ojo. `sdd-consult` puede proponer el siguiente id con el script sin `-Reserve`, pero no lo reserva ni lo escribe en ningún artefacto

**Reglas de la capacidad**
- **Dónde viven los datos**: el modo, en `.docs/sdd/sdd-kit.json` (`ids.mode`). El último id consumido, en `<git-common-dir>/sdd-ids` (`sdd-ids-<ruta relativa>` si el proyecto está en una subcarpeta), compartido por todos los worktrees del repositorio y fuera del árbol versionado. La fila del roadmap y la rama siguen siendo donde se ve cada reserva.
- **Límites**: cuatro dígitos (`0001`–`9999`); una reserva que pasaría de `9999` falla sin reservar. `-Count` va de 1 a 99. Una sola máquina: con varias máquinas en `sequence` haría falta un cerrojo en el remoto o el modo `tracker`. Hay un contador por proyecto: `sdd-ids` en la raíz del repositorio y `sdd-ids-<ruta relativa>` en una subcarpeta.
- **Avisos**: además de los vigentes, el script avisa por salida de error si el contador no se puede leer (y lo reinicializa) y si no hay repositorio git donde reservar (sin reservar). También avisa si el cerrojo no se libera en el plazo, nombrando al dueño y sin reservar.
- **Regla ante conflicto**: la fila del roadmap manda. El contador nunca baja: si el escaneo ve un id mayor, gana el escaneo. Si aun así dos trabajos acaban con el mismo id, el segundo en darse cuenta renumera su carpeta y su rama y lo anota en el roadmap.

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0,5 h
- Estimación de implementación: 2,5–3,5 h. Hito 1 ~1,5 h; hito 2 ~1 h (la guidance, condicionada al RED); hito 3 ~0,5 h.
- Base de la estimación: el script tiene 167 líneas y un test Pester existente que se amplía. El cerrojo ya está probado en `Invoke-SddMerge.ps1`. La campaña es de 6 sujetos de un turno (ver `estimation.md`: el reloj es de redacción).
- Confianza: media. La extracción del cerrojo obliga a correr los ~200 s de `Invoke-SddMerge.Tests.ps1`, y el hito 3 depende de cuándo cierre la 0057.

## Enmiendas

- 2026-09-24 — La decisión 7 y la regla de Límites pasan de «un contador por repositorio» a «uno por proyecto», y se añade el requisito «Cada proyecto de un repositorio reserva en su propio contador». Motivo: el test «sin repositorio git» reservó en el `.git` de la carpeta Temp del dev-lead, que es un repositorio. Con un contador por repositorio, un proyecto en una subcarpeta escribiría en un `.git` ajeno, y las fixtures del kit leerían el contador real del kit. — aprobada: «Uno por proyecto (Recomendada)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-24 | aprobada: «Apruebo» |
