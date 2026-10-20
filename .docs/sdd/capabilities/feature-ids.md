# Capacidad — feature-ids

## Propósito

La numeración del trabajo: cómo un proyecto decide sus ids de feature y de patch, quién los asigna y qué garantiza que no se repitan. Cubre los dos carriles porque comparten secuencia.

## Requisitos

### El proyecto declara cómo numera su trabajo

- GIVEN un proyecto inicializado o migrado con el kit v2.0.0 o posterior
- WHEN se lee `.docs/sdd/sdd-kit.json`
- THEN el fichero lleva `"ids": { "mode": "tracker" | "sequence" }`

### Un proyecto sin campo `ids` numera como hasta ahora

- GIVEN un proyecto cuyo `sdd-kit.json` no tiene campo `ids`
- WHEN una skill del kit necesita el modo de ids
- THEN el modo efectivo es `tracker` y ninguna conducta cambia respecto a la versión anterior del kit

### La entrevista de init decide el modo de ids

- GIVEN una init en su entrevista, en el turno de las claves del kit
- WHEN el agente pregunta por el gestor de tickets
- THEN pregunta a continuación cómo se numeran las features: ids del gestor (`tracker`) o secuencia propia del proyecto (`sequence`)
- AND escribe la respuesta en `sdd-kit.json`; «no sé» deja `tracker`

### Features y patches comparten una sola secuencia

- GIVEN un proyecto en modo `sequence`
- WHEN se asigna el id de una feature, de un patch o de una propuesta
- THEN sale de la misma secuencia correlativa: un id nunca se repite entre carriles
- AND `sdd id next` cuenta como usado el id de una carpeta `-proposal-<id>-`: con `specs/20260915-090000-proposal-0020-billing/` y ninguna fila 0020, no propone `0020`

### En modo secuencia el id lo reserva el hilo principal al planificar

- GIVEN un proyecto en modo `sequence`
- WHEN `sdd-roadmap` escribe N filas nuevas en el roadmap, en Now, Next o Later (o en «Próximo» y «Backlog» en 2.x), o una propuesta y sus N features
- THEN sus ids salen de una sola reserva `sdd id next --reserve --count N` (N + 1 con propuesta), y cada fila lleva el suyo
- AND ese id es provisional: vale en el clon hasta que su tarea arranca y `sdd id claim` lo reclama contra la integración del remoto

### Una feature no planificada obtiene su id con un script determinista

- GIVEN un proyecto en modo `sequence` y una feature o patch sin fila en el roadmap
- WHEN se invoca `sdd id next --reserve` desde la raíz del proyecto
- THEN devuelve por salida estándar el siguiente id en cuatro dígitos: el mayor valor entre el contador del proyecto y el mayor id encontrado en las carpetas de `.docs/sdd/changes/` y `.docs/sdd/specs/` y en los dos roadmaps (`ROADMAP.md` de la raíz y `.docs/sdd/roadmap.md`) del working tree; en esos mismos roadmaps y carpetas de cada rama local y remota, y en su nombre salvo el de la rama actual; en esos roadmaps y carpetas del disco de cada worktree de `git worktree list`; y en las etiquetas `sdd-id/<id>` del repositorio, más uno
- AND cada rama y cada worktree se leen con lo que tengan: una rama con solo `ROADMAP.md` y `changes/` cuenta igual que una con solo `.docs/sdd/roadmap.md` y `specs/`
- AND con `.docs/sdd/specs/20260920-100000-feature-0079-b/`, `.docs/sdd/changes/20261010-090000-feature-0081-c/`, la fila `0083` en `ROADMAP.md` y la fila `0085` en `.docs/sdd/roadmap.md`, sin contador ni ramas con un id mayor, propone `0086`
- AND con la etiqueta `sdd-id/0090` y ningún otro id mayor, propone `0091`
- AND lo que otro worktree tiene reservado sin fusionar cuenta aunque no esté en ninguna rama: una fila de un roadmap en *staged* o una carpeta de `changes/` o `specs/` sin commitear
- AND deja ese id consumido en el contador
- AND no hace `git fetch`: lee las referencias tal como están en el repositorio
- AND `0000` no cuenta como id ocupado: un proyecto cuyo histórico es todo `0000` recibe `0001`
- AND un id heredado con sufijo alfabético (`…-task-0006a-slug`) sí cuenta

### El script avisa de un id duplicado y no devuelve ninguno

- GIVEN un proyecto en modo `sequence` donde dos carpetas de artefactos distintas llevan el mismo id, en `specs/`, en `changes/` o una en cada una
- WHEN se invoca `sdd id next`, con `--reserve` o sin él
- THEN escribe el id duplicado y las rutas implicadas por salida de error, y no devuelve ningún id por salida estándar
- AND el contador no cambia
- AND las carpetas con sufijo alfabético heredadas (`…-task-0006a-…`, `…-task-0006b-…`) no cuentan como duplicado: el script las nombra en un aviso por salida de error, cuenta su número como ocupado y devuelve el siguiente id libre

### El script avisa si el proyecto no está en modo secuencia

- GIVEN un proyecto en modo `tracker` (declarado o por ausencia del campo `ids`)
- WHEN se invoca `sdd id next`, con `--reserve` o sin él, o `sdd id claim`
- THEN avisa de que el proyecto numera con el gestor y no devuelve ningún id
- AND no crea ni toca el contador
- AND sale con 1

### El script avisa cuando omite las ramas

- GIVEN un proyecto en modo `sequence` cuya raíz no es la raíz de su repositorio (un proyecto dentro de un monorepo)
- WHEN se invoca `sdd id next`
- THEN devuelve el id calculado con las carpetas de `changes/` y `specs/` y los dos roadmaps del working tree, sin leer ramas ni el disco de otros worktrees, y avisa por salida de error de que omite las ramas, nombrando el repositorio que encontró
- AND no lee las ramas del repositorio padre: sus ids no son ids de este proyecto

### Una feature partida toma el siguiente id, no un sufijo

- GIVEN una feature que se parte en dos durante la planificación o la ejecución
- WHEN se nombra la segunda mitad
- THEN recibe un id reservado con `sdd id next --reserve`, nunca un sufijo tipo `0006a`
- AND su `spec.md` (o `patch.md`) lleva `parent: <id>` en el frontmatter y el roadmap le da su fila propia

### En modo gestor el id es el del ticket

- GIVEN un proyecto en modo `tracker` y una skill que necesita un id (`sdd-start-feature`, `sdd-start-patch`, `sdd-roadmap`, `sdd-explore`)
- WHEN el trabajo tiene ticket en el gestor
- THEN el id es el del ticket, y `0000` cuando el trabajo no tiene ticket

### En modo secuencia el id sale de la reserva o del script

- GIVEN un proyecto en modo `sequence` y una skill que necesita un id
- WHEN el trabajo tiene fila en el roadmap
- THEN el id es el que reserva esa fila; sin fila, el de la rama si ya lo lleva, y si no, el que reserva `sdd id next --reserve`
- AND al arrancar, `sdd id claim` lo reclama antes de crear la carpeta, y puede cambiarlo por el siguiente libre
- AND en ningún modo se elige un número a ojo. `sdd-explore` puede proponer el siguiente id con el script sin `--reserve`, pero no lo reserva ni lo escribe en ningún artefacto, y el prompt de un config va sin id

### Sin reserva, el script solo propone

- GIVEN un proyecto en modo `sequence`
- WHEN se invoca `sdd id next` sin `--reserve`
- THEN devuelve el mismo cálculo, con el contador incluido, y no escribe nada: ni el contador ni ningún fichero del proyecto

### Dos reservas simultáneas no comparten id

- GIVEN dos procesos en el mismo worktree o en dos worktrees del mismo repositorio
- WHEN los dos invocan `sdd id next --reserve` a la vez
- THEN cada uno recibe un id distinto, y el contador queda en el mayor de los dos

### Un id reservado queda consumido aunque el trabajo se abandone

- GIVEN un id reservado del que no queda rama, carpeta ni fila
- WHEN se reserva otra vez
- THEN el id nuevo es mayor que el reservado: nunca se reutiliza

### Una reserva de varios ids devuelve ids consecutivos

- GIVEN un proyecto en modo `sequence`
- WHEN se invoca `sdd id next --reserve --count 3`
- THEN devuelve tres ids consecutivos, uno por línea, y el contador queda en el último

### El escaneo inicializa o corrige el contador

- GIVEN un repositorio sin contador, o con un contador menor que el mayor id que ve el escaneo
- WHEN se reserva
- THEN la base es el mayor id del escaneo, y el contador queda en el id reservado
- AND si el contador no se puede leer, el script avisa por la salida de error y lo reinicializa con el escaneo

### Cada proyecto de un repositorio reserva en su propio contador

- GIVEN un proyecto en modo `sequence` cuya raíz es una subcarpeta de su repositorio
- WHEN se invoca `sdd id next --reserve`
- THEN el id se consume en `sdd-ids-<ruta relativa>` del directorio común, y el contador `sdd-ids` de la raíz no se lee ni se toca

### Sin repositorio git no se reserva

- GIVEN un proyecto en modo `sequence` que no está dentro de un repositorio git
- WHEN se invoca `sdd id next --reserve`
- THEN falla con un mensaje que dice que no hay dónde reservar, y no devuelve ningún id

### La reserva precede a la rama y a la carpeta

- GIVEN un proyecto en modo `sequence` y un arranque de feature o de patch sin fila de roadmap
- WHEN el agente necesita el id
- THEN lo reserva con `sdd id next --reserve` antes de crear la rama y la carpeta, y usa ese id en las dos
- AND si la rama ya lleva un id (`patch/0176-fast-suite-budget`, la que abrió el prompt de arranque), no reserva otro: `sdd id claim` comprueba ese id y la carpeta usa el que dé
- AND si ya está en una rama sin id y sin commits propios frente a la rama de integración (`feature/fix-sala`, con la reserva en 0014), la renombra a `feature/<id>-<slug>` con `git branch -m` antes del primer commit y lo dice: el commit del fix sale en `feature/0014-<slug>`, y `feature/fix-sala` ya no existe

### El escaneo cuenta las carpetas `-feature-` y las `-task-`

- GIVEN un proyecto en modo `sequence` con `specs/20260920-100000-task-0063-a/`, `specs/20261001-091500-feature-0079-b/` y `specs/20261002-100000-patch-0080-c/`, sin ninguna fila del roadmap, rama, worktree ni contador con un id mayor
- WHEN se ejecuta `sdd id next --project-root <raíz>` sin `--reserve`
- THEN propone `0081`
- AND si solo existiera `…-feature-0079-b/`, propondría `0080`
- AND si `specs/` tiene a la vez `…-task-0063-a/` y `…-feature-0063-b/`, es un id duplicado: se aplica «El script avisa de un id duplicado y no devuelve ninguno», sin distinguir carril

### Al arrancar, el push a la integración decide de quién es el id

- GIVEN un proyecto en modo `sequence` con el remoto `origin` y la integración `develop`; en `develop` local, la fila `0203` commiteada por `sdd roadmap publish` y sin publicar; `origin/develop` sin ningún `0203`; y la rama `feature/0203-single-id-sequence` sin commits propios
- WHEN se ejecuta `sdd id claim` desde el worktree de esa rama
- THEN hace fetch, publica `develop` en `origin`, escribe `id: 0203 es tuya; publicada en origin/develop` y sale con 0
- AND `origin/develop` tiene la fila `0203`, y la rama `feature/0203-single-id-sequence` apunta a la `develop` publicada
- AND si `develop` local tenía también la fila `0204` sin publicar y libre en `origin`, escribe antes `push: también publica 1 commit de 'develop' que no es de la 0203:` y `- <hash> <asunto>`
- AND relanzado, escribe `id: 0203 ya estaba en origin/develop; nada que publicar`, no hace push y sale con 0
- AND si el worktree donde está `develop` tiene cambios sin commitear, escribe `destino con cambios: <ruta>; límpialo y relanza sdd id claim`, no toca nada y sale con 1

### Si otro publicó antes el mismo id, la tarea pasa al siguiente libre

- GIVEN el proyecto anterior, con `origin/develop` que trae la fila `0203` de otro clon; en `develop` local, sin publicar, las filas `0203` y `| 0204 | **Otra** … tras 0203 … `parent: 0203` … | ⏳ | 0203 | M |` y, en la deuda, `Actuar → 0203`; la `0204` libre en `origin`; el mayor id visible tras el fetch, `0204`
- WHEN se ejecuta `sdd id claim` desde `feature/0203-single-id-sequence`, sin commits propios ni cambios sin commitear
- THEN escribe `id: la 0203 ya la tiene otro en origin/develop; la 0203 pasa a 0205`, `rama: feature/0203-single-id-sequence → feature/0205-single-id-sequence` y `worktree: la carpeta sigue en <ruta>`, y sale con 0
- AND `develop` lleva el commit `chore(roadmap): la 0203 pasa a 0205`, en el que tu fila es `0205`, la `0204` dice `tras 0205`, `parent: 0205` y «Tras» `0205`, y la deuda dice `Actuar → 0205`; un `0203` en prosa fuera de esas formas no cambia
- AND `origin/develop` tiene la fila `0203` del otro clon, intacta, y la `0205`; el contador queda en `0205` y la rama `feature/0203-single-id-sequence` ya no existe
- AND si `develop` local ya había integrado `origin/develop` antes del claim (con la `0203` del otro dentro), el resultado es el mismo: la fila del otro y las líneas que vienen tal cual de `origin` no cambian
- AND si la reserva tomada es también una carpeta tuya `specs/20261020-090000-proposal-0203-ids/`, el mismo commit la mueve a `…-proposal-0205-ids/` con `git mv`, y la ruta `-proposal-0203-` de las filas pasa a `-proposal-0205-`
- AND si la `0204` también estaba en `origin/develop` como fila de otro, escribe además `id: la 0204 ya la tiene otro en origin/develop; la 0204 pasa a 0206`, y el commit es `chore(roadmap): la 0203 pasa a 0205, la 0204 pasa a 0206`
- AND si la rama tiene commits propios, no se renombra ni avanza: `rama: tiene commits propios; no se renombra: hazlo tú a feature/0205-single-id-sequence`; si ya existe `feature/0205-single-id-sequence`: `rama: ya existe feature/0205-single-id-sequence; no se renombra`; con cambios sin commitear, se renombra y escribe `rama: cambios sin commitear; no avanza a develop`

### Si el push se rechaza porque el remoto avanzó, el id se vuelve a comprobar

- GIVEN el proyecto del primer escenario, y entre el fetch y el push otro clon publica en `origin/develop` una fila `0203`
- WHEN `sdd id claim` intenta el push y falla
- THEN hace fetch otra vez, ve que `origin/develop` cambió, vuelve a partir del `develop` de antes del claim, renumera la suya al siguiente libre y vuelve a empujar, con un solo commit de renumeración
- AND tras 3 intentos rechazados escribe `push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza sdd id claim en un rato`, `develop` local vuelve al commit de antes del claim y sale con 1
- AND si el merge de `origin/develop` da conflicto o el push falla por otra causa, `develop` local vuelve al commit de antes del claim y sale con 1 con el error de git
- AND en los dos casos los ids reservados durante el claim quedan consumidos: el contador no baja

### Con la integración protegida, una etiqueta fija el id

- GIVEN el proyecto del primer escenario con un remoto que rechaza el push a `develop`, y `origin/develop` igual tras el rechazo
- WHEN se ejecuta `sdd id claim`
- THEN empuja la etiqueta `sdd-id/0203`, que apunta a `develop` local, escribe `push: 'develop' no admite push directo; id fijado con la etiqueta sdd-id/0203` y sale con 0
- AND relanzado, con la etiqueta en un commit ancestro de `develop` local, escribe `id: 0203 ya fijada con la etiqueta sdd-id/0203` y sale con 0
- AND si el remoto ya tiene `sdd-id/0203` en un commit que no está en `develop` local, el id es de otro: renumera como en «Si otro publicó antes el mismo id…» y empuja `sdd-id/0205`
- AND si el remoto rechaza el push y además `origin/develop` cambió, sigue el camino de «Si el push se rechaza porque el remoto avanzó…», no el de la etiqueta
- AND sin `merge.push: true` en `sdd-kit.json` (con `false`, y también sin la clave, con `(sin merge.push)` en el literal), no intenta publicar `develop`: empuja la etiqueta, escribe `push: 'develop' no se publica (merge.push: false); id fijado con la etiqueta sdd-id/0203`, y `origin/develop` no cambia

### Sin remoto, vale el contador local

- GIVEN un proyecto en modo `sequence` cuyo repositorio no tiene remoto, o cuya integración no tiene remoto, en la rama `feature/0203-x`
- WHEN se ejecuta `sdd id claim`
- THEN escribe `sin remoto: la 0203 vale (contador local)`, no toca ninguna rama ni el contador y sale con 0
- AND en un proyecto en una subcarpeta de su repositorio escribe `sin comprobar en el remoto: la raíz del proyecto no es la del repositorio; la 0203 vale (contador local)` y sale con 0

### Sin fila, el claim comprueba el id de la rama

- GIVEN un proyecto en modo `sequence` en la rama `patch/0176-fast-suite-budget`, sin fila `0176` en `develop` local, sin `0176` en ninguna fila, carpeta, otra rama ni etiqueta del escaneo, y `origin/develop` sin `0176`, con el contador en `0179`
- WHEN se ejecuta `sdd id claim`
- THEN escribe `id: 0176 libre en origin/develop`, no hace push ni etiqueta, no reserva otro id y sale con 0
- AND si otra rama, una carpeta de otro worktree o una carpeta de `origin/develop` tiene `0176`, toma el siguiente libre (`0180`), renombra la rama a `patch/0180-fast-suite-budget` como en «Si otro publicó antes el mismo id…» y escribe `id: la 0176 ya la tiene otro en origin/develop; la 0176 pasa a 0180`, sin commit en `develop`
- AND si `origin/develop` tiene una fila `| 0176 | Validar la franja horaria | ⏳ |` que tu `develop` no tiene, escribe `id: 0176 ya estaba en origin/develop («Validar la franja horaria»); nada que publicar` y no renumera
- AND relanzado con la carpeta `patch-0176-fast-suite-budget` ya creada en el worktree de la tarea, vuelve a escribir `id: 0176 libre en origin/develop`

## Reglas de la capacidad

- **Dónde viven los datos**: el modo, en `.docs/sdd/sdd-kit.json` (`ids.mode`). El último id consumido, en `<git-common-dir>/sdd-ids` (`sdd-ids-<ruta relativa>` si el proyecto está en una subcarpeta), compartido por todos los worktrees del repositorio y fuera del árbol versionado. La fila del roadmap y la rama siguen siendo donde se ve cada reserva. Con la integración protegida, el id reclamado queda en la etiqueta `sdd-id/<id>` del remoto, que no se borra.
- **Idioma de los nombres**: claves y valores de `sdd-kit.json` en inglés (`ids.mode`, `tracker`, `sequence`), como el resto del fichero; también en inglés el verbo `claim` y el prefijo de etiqueta `sdd-id/`. El texto de las skills, los mensajes de los verbos y el asunto del commit de renumeración (`chore(roadmap): la 0203 pasa a 0205`, tipo y scope en inglés como en el Art. VI) van en castellano.
- **Límites**: cuatro dígitos con ceros a la izquierda (`0001`–`9999`); `0000` reservado como comodín de «sin ticket» en modo `tracker`, también en Later. Una reserva que pasaría de `9999` falla sin reservar. `--count` va de 1 a 99. Con remoto, el id reservado es provisional y lo decide `sdd id claim` al arrancar; sin remoto, o en un proyecto en una subcarpeta, solo vale el contador local de una máquina. `sdd id claim` intenta el push 3 veces. Sin fila, el claim no publica nada: dos arranques sin fila a la vez en dos máquinas pueden coger el mismo id. Hay un contador por proyecto: `sdd-ids` en la raíz del repositorio y `sdd-ids-<ruta relativa>` en una subcarpeta.
- **Avisos**: ids duplicados entre artefactos, proyecto en modo `tracker` y ramas omitidas por no ser raíz del repositorio se avisan por salida de error; en los dos primeros casos el script no devuelve id ni toca el contador. El script avisa además por salida de error si el contador no se puede leer (y lo reinicializa) y si no hay repositorio git donde reservar (sin reservar). También avisa si el cerrojo no se libera en el plazo, nombrando al dueño y sin reservar. `sdd id claim` dice por la salida estándar si el id es tuyo, si ya estaba publicado, si pasa a otro, si se fijó con una etiqueta, si no hay remoto o no se comprueba en él, cuándo la rama no se renombra o no avanza, y si el destino tiene cambios.
- **Regla ante conflicto**: la fila del roadmap manda. El contador nunca baja: si el escaneo ve un id mayor, gana el escaneo, y un claim que falla deja consumidos sus ids. Si dos clones reservan el mismo id, gana el primero que lo publica en la integración del remoto (o que empuja su etiqueta `sdd-id/<id>`), y el otro pasa al siguiente libre con `sdd id claim`. Sin remoto, o con dos arranques sin fila a la vez, si aun así dos trabajos acaban con el mismo id, el segundo en darse cuenta renumera su carpeta y su rama y lo anota en el roadmap.
- **Contrato de lectura del roadmap**: el script lee `ROADMAP.md` de la raíz del proyecto y `.docs/sdd/roadmap.md`, los dos si existen, y reconoce un id en la primera columna de una fila de tabla (`| 0001 |`), en la segunda si la primera es una fecha (`| 2026-10-01 | 0001 |`, la forma de la tabla de Patches), en los nombres de artefacto (`feature-<id>-`, `task-<id>-`, `patch-<id>-`, `proposal-<id>-`) de `changes/` y `specs/`, y en un segmento del nombre de rama (`feature/0001`, `hotfix/0001-slug`). Cualquier otra aparición de cuatro dígitos (fechas, versiones) no cuenta.
