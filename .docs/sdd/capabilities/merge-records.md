# Capacidad — merge-records

## Propósito

Cómo une `sdd merge` los registros que solo añaden líneas (roadmap, deuda, estimation-log, capacidades) y qué conflicto queda para una persona.

## Requisitos

### Un conflicto en el estimation-log se regenera con el script

- GIVEN un merge del cierre con conflicto en `estimation-log.md`
- WHEN el agente resuelve los conflictos
- THEN regenera `estimation-log.md` con `sdd estimation log`, y no lo edita a mano

### El merge del cierre une los registros que solo añaden líneas

- GIVEN dos ramas desde la misma rama destino que añaden cada una una fila a `roadmap.md`, una línea a `changelog.md`, una sección al final de otro documento o una palabra a `.cspell/custom-words.txt` en el mismo sitio, y la primera ya se ha fusionado
- WHEN el cierre de la segunda ejecuta `sdd merge`
- THEN el script resuelve el conflicto en su worktree —con `--verify`, al integrar la base en la rama del cambio, fuera del cerrojo; sin él, dentro del cerrojo—: deja las líneas de la rama destino y después las de la rama, regenera `estimation-log.md` y fusiona sin intervención
- AND si en algún trozo los dos lados cambian una línea que ya existía y ni la unión por id de los registros, ni la de los `THEN` y `AND` de un requisito de una capacidad, ni Mergiraf lo resuelven, o los dos crean el mismo fichero, aborta y falla con `merge: conflicto en` y la lista de ficheros, sin tocar la rama destino; si el conflicto sale al integrar la base en la rama, falla con `base: conflicto en` y la rama del cambio vuelve a su commit, sin `MERGE_HEAD`

### Un conflicto solo en los registros se resuelve con un merge de sincronización

- GIVEN un cierre de feature o de patch con su commit de cierre hecho y `origin/develop` por delante
- WHEN el agente sigue la receta del merge
- THEN ejecuta `sdd merge --sync --project-root <worktree>`, que integra `origin/develop` en la rama y resuelve los registros, los trozos que solo añaden y, si está instalado, lo que Mergiraf resuelva; con `base: integrada`, sigue con `sdd merge`, sin parar a preguntar
- AND la rama destino acaba con las entradas de las dos features en cada registro y el log regenerado

### Un conflicto que no se puede conservar entero es de una persona

- GIVEN un cierre cuyo `sdd merge --sync` o cuyo `sdd merge` deja conflicto (`base: conflicto en` o `merge: conflicto en`), o el relanzamiento vuelve a fallar
- WHEN el agente sigue la receta del merge
- THEN no resuelve: cita el mensaje del script y los ficheros, y el cierre queda «No terminado», como hoy; `sdd merge` ya ha abortado el merge, y `--sync` lo deja a medias en el worktree, con los registros ya unidos, para que una persona resuelva los ficheros que lista y lo commitee
- AND con `vuelta: conflicto en <ficheros>` de un hotfix, el script ya lo ha deshecho todo: una persona porta el arreglo a la rama de integración y relanza el hotfix

### Los trozos del merge se calculan con histogram y se escriben con zdiff3

- GIVEN cualquier merge que hace `sdd merge`: la base, la rama, la vuelta de un hotfix o `--sync`
- WHEN el script ejecuta `git merge`
- THEN lo ejecuta con `-c merge.conflictStyle=zdiff3` y `-X diff-algorithm=histogram`
- AND un conflicto que llega a una persona lleva las marcas de `zdiff3`, con la base entre `|||||||` y `=======`

### Los registros se unen por id

- GIVEN `develop` y la rama que se fusiona, que en el mismo trozo de `.docs/sdd/roadmap.md` (o de `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/changelog.md` o `.docs/sdd/steering/debt.md`) marcan una la fila `0190` como `✅` y añaden la otra la fila `0201` debajo
- WHEN el cierre ejecuta `sdd merge`
- THEN el trozo queda con la `0190` en `✅` y la `0201`, sin conflicto
- AND si las dos ramas añaden la misma fila `0201` con el mismo texto, queda una sola
- AND si añaden dos filas `0201` con texto distinto, se quedan las dos, la de la rama destino primero, y la salida dice `registros: dos filas distintas con el id '0201' en .docs/sdd/roadmap.md; se quedan las dos, revísalas`
- AND una entrada `- **Feature 0185** — …` en `### Added` y otra en `### Changed` son ids distintos
- AND si las dos ramas cambian celdas distintas de la misma fila que ya estaba en la base, la fila queda con los cambios de las dos: la `0248` con el `✅` de la rama y el caso que `develop` añadió a la descripción; si cambian la misma celda de forma distinta, o la fila no tiene las mismas celdas en los dos lados, es conflicto y lo resuelve una persona
- AND la clave de una fila de deuda no cuenta los prefijos de cierre del principio de su primera celda (`**[Feature 0216, 2026-10-28: saldada — …]**`, o con `Patch` y `parcial`): si la rama salda la fila «Tres tests del lanzador en Vitest…» y `develop` le cambia la celda «Destino», queda una sola fila, con el prefijo de la rama y el «Destino» de `develop`, sin conflicto y sin aviso de `registros:`
- AND si los dos lados añaden prefijos de cierre distintos a la misma fila, es conflicto
- AND si el merge se aborta después por otro fichero en conflicto, la salida no dice `registros: …`
- AND la cabecera de una tabla no es una fila con id, aunque el trozo la separe de su separador: si las dos ramas añaden la misma tabla (`| Id | Tarea | Estado |`) con filas distintas, queda una tabla con la cabecera una vez y las dos filas seguidas, sin aviso

### Mergiraf resuelve lo que queda si está instalado

- GIVEN dos ramas que añaden cada una un método distinto en el mismo sitio de `src/rooms.ts` y `mergiraf` en el `PATH`
- WHEN el merge deja ese fichero en conflicto tras unir los registros y los trozos que solo añaden
- THEN el script ejecuta `mergiraf solve src/rooms.ts`, escribe `mergiraf: resuelto src/rooms.ts`, commitea el merge y corre `--verify` sobre el resultado
- AND si `mergiraf solve` sale con otro código, escribe `mergiraf: no resuelve src/rooms.ts`, aborta el merge y falla como hoy con el fichero en la lista de `conflicto en`
- AND sin `mergiraf` en el `PATH` no escribe nada de Mergiraf y falla como hoy
- AND el script no escribe `git config` ni `.gitattributes`
- AND si resuelve `src/rooms.ts` pero otro fichero queda en conflicto, aborta y no escribe `mergiraf: resuelto src/rooms.ts`
- AND si las dos ramas cambian el mismo import de forma compatible (`import { a, b }` y `import { a, c }`), Mergiraf los une en un solo import con `b` y `c`, en el orden que da Mergiraf según qué lado entra, y `--verify` decide: en rojo, el merge se deshace como cualquier verificación en rojo
- AND no se lanza sobre ficheros de `.docs/` ni sobre `*.md`: un conflicto ahí que las reglas del kit no resuelven sale en `conflicto en` sin línea de Mergiraf
- AND si resolvió algún fichero, `--verified-at` no omite `--verify`

### Tras fusionar, las filas repetidas de los registros se limpian

- GIVEN dos ramas que añaden la fila `| 0210 | x | ⏳ |` en sitios distintos de la misma tabla de `.docs/sdd/roadmap.md`, que git fusiona sin conflicto, y la primera ya fusionada en `develop`
- WHEN el cierre de la segunda ejecuta `sdd merge` (o `sdd merge --sync`)
- THEN tras el commit de merge, el script quita la segunda copia en un commit `docs(registros): quita las filas repetidas del merge` con el cuerpo `Filas: 0210.`, antes de verificar y publicar
- AND si las dos filas `0210` tienen texto distinto, se quedan las dos, no hay commit de limpieza, y la salida dice `registros: dos filas distintas con el id '0210' en .docs/sdd/roadmap.md; se quedan las dos, revísalas`
- AND vale igual en `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/changelog.md` y `.docs/sdd/steering/debt.md`, dentro de cada sección: `**Feature 0210**` en `### Added` y en `### Changed` no se toca
- AND un id que ya estaba repetido en la rama destino antes del merge no se toca ni se avisa
- AND si el commit de limpieza falla, el merge se deshace, la rama destino queda como estaba y el script sale con 1 con `registros: no se pudo commitear la limpieza de filas repetidas`

### Dentro de un requisito de una capacidad se unen los THEN y AND que cambia cada lado

- GIVEN un requisito de `.docs/sdd/capabilities/control-profiles.md` cuyo `- THEN` cambia `develop` y cuyos `- AND` cambia la rama, en líneas seguidas que git deja en el mismo trozo en conflicto
- WHEN se ejecuta `sdd merge --sync` (o el cierre ejecuta `sdd merge`)
- THEN el requisito queda con el `THEN` de `develop` y los `AND` de la rama, sin conflicto, y la integración sigue como con cualquier conflicto resuelto
- AND vale igual si un lado añade o quita un `- AND` y el otro cambia otra línea del trozo; las líneas añadidas quedan en el sitio donde las puso su lado
- AND si los dos lados cambian la misma línea de forma distinta, o añaden líneas en el mismo hueco de un trozo que conserva líneas de la base, sigue siendo conflicto: `base: conflicto en .docs/sdd/capabilities/control-profiles.md.`
- AND un trozo en el que los dos lados solo añaden líneas, sin ninguna de la base, se une como en «El merge del cierre une los registros que solo añaden líneas»: primero las de la rama destino
- AND si alguna línea del trozo, en cualquiera de los tres lados, no empieza por `- THEN ` ni por `- AND ` (un `- GIVEN`, un `- WHEN`, un título `###`, prosa o una línea en blanco), sigue siendo conflicto
- AND fuera de `.docs/sdd/capabilities/` esta unión no se aplica
