---
id: 20261029-153348-feature-0244-merge-docs-conflicts
feature: 0244
title: Al unir los registros y las capacidades, dos cambios que no se tocan no son conflicto
mode: lite
profile: delegate
status: approved
created: 2026-10-29
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-29
---

# Spec — Al unir los registros y las capacidades, dos cambios que no se tocan no son conflicto

🦆 Hoy, cuando una rama salda una fila de deuda del roadmap (le antepone «**[Feature 0216, …: saldada — …]**») y `develop` le cambia otra celda, `sdd merge --sync` no reconoce la fila como la misma y para con un conflicto; lo mismo pasa si una rama marca la fila `0248` como `✅` y `develop` le añade un caso a la descripción. Y en una capacidad, si `develop` cambia el `THEN` de un requisito y la rama sus `AND`, git los junta en un solo trozo y el merge también para. Con el cambio, en los tres casos queda una sola versión con los cambios de los dos lados, sin parar al dev-lead; si los dos cambian la misma celda o la misma línea, sigue siendo conflicto, como hoy.

## Capacidades

- Modificadas: `control-profiles` — la unión por id de los registros (clave sin el prefijo de cierre y unión por celdas) y la resolución de conflictos del merge, que une los `THEN` y `AND` de un requisito de `capabilities/`

## ✋ Decisiones que he tomado yo — valida estas

1. **El conflicto de la 0248 se arregla aquí, no se queda en el ticket.** Reproducido el 2026-10-29 (worktree en `d797f13d`, `git merge a7c10780^2`): su causa no es la clave. La fila `0248` la cambian los dos lados en celdas distintas —la rama, el estado `⏳` → `✅`; `develop`, la descripción, con «Cuarto caso, el patch 0239…» y «tres» → «cuatro»— y la unión trata la fila entera como una pieza. El otro trozo (filas de la 0239 en «Patches») ya lo resuelve la unión de líneas añadidas. Tu decisión decía que, con otra causa, la fila lo dice y se queda en el ticket; pero el THEN de la fila 0244 («una sola fila, con el prefijo y el cambio de la base») solo se cumple uniendo la fila por celdas, que es justo lo que arregla la 0248: dejarlo fuera costaría código para impedirlo. Si prefieres que la unión por celdas valga solo para el prefijo, dilo en «Cambios».
2. **Unión por celdas**: dos versiones de una fila con la misma clave se unen celda a celda, como hoy se unen filas enteras (gana el lado que cambia; si los dos cambian la misma celda de forma distinta, conflicto). Si las tres versiones no tienen el mismo número de celdas, conflicto.
3. **La primera celda de una fila de deuda se une en dos partes**: los prefijos de cierre y el texto que sigue, cada parte por su lado. Así «la fila que lo lleva gana a la que no»: si la rama añade el prefijo y `develop` no lo toca, queda el prefijo de la rama; si los dos añaden prefijos distintos, conflicto. El texto del ítem es la clave: si un lado lo cambia, ya es otra fila, como hoy.
4. **Qué es un prefijo de cierre**: al principio de la primera celda, uno o más `**[<Feature|Patch> NNNN, AAAA-MM-DD: <saldada|parcial> — …]**` seguidos de un espacio. Medido en el roadmap: 184 filas empiezan por `**[`, y las 184 tienen esta forma (120 Feature saldada, 20 Feature parcial, 35 Patch saldada, 9 Patch parcial).
5. **El aviso de dos filas distintas con el mismo id** ya no sale por una fila que solo difiere en el prefijo, porque ahora son la misma fila; el texto del aviso no cambia.
6. **Cuándo se unen las líneas de un requisito**: en un fichero de `.docs/sdd/capabilities/`, un trozo en conflicto se une si cada lado cambia, añade o quita líneas distintas de la base y todas las líneas del trozo, en los tres lados, empiezan por `- THEN ` o `- AND `. Un trozo con un `- GIVEN`, un `- WHEN`, un título `###` o prosa sigue siendo conflicto; y también si los dos lados cambian la misma línea de la base o añaden líneas en el mismo hueco de un trozo que conserva líneas de la base (un trozo que solo añade se une como hasta ahora, enmienda del 2026-10-29). Las líneas añadidas por un lado van en el hueco de la base donde las puso ese lado.
7. **Pruebas**: una prueba de la función pura por cada regla en `cli/test/merge/keyed.test.ts` (rápida) y en un fichero nuevo `cli/test/merge/requirement-lines.test.ts` (rápida); y dos de punta a punta con `sdd merge --sync` en `cli/test/merge/registries.slow.test.ts`, una por cada GIVEN de la fila (prefijo + «Destino» y THEN + AND).
- Delta probado con `sdd capability merge` sobre una copia de `.docs/sdd` (2026-10-29): sustituidos «Los registros se unen por id», «El merge del cierre une los registros que solo añaden líneas» y «El merge del cierre parte de la rama destino publicada»; añadido «Dentro de un requisito de una capacidad se unen los THEN y AND que cambia cada lado».
- Política de modelos: sin revisores de la spec (modo lite) · ejes de la revisión final: Spec opus+high, Código sonnet+high · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Carril lite, perfil `delegate`, y al fusionar `sdd merge --push` — «Arranca la 0244 con sdd-propose, carril lite … Perfil delegate. Al fusionar, `sdd merge --push`.»
- La clave de una fila de deuda descarta el prefijo de cierre antes de comparar, y la fila que lo lleva gana a la que no — literal de la petición.
- Antes de nada, reproducir el «base: conflicto en .docs/sdd/roadmap.md» del `--sync` de la 0248 — literal; hecho, ver decisión 1.
- En `capabilities/`, si los dos lados cambian la misma línea, sigue siendo conflicto — literal.
- Tests en `cli/test/merge/` — literal.
- Saldar las filas de deuda que nombra la fila 0244, la de la 0259 incluida — literal.

## Intent

Hoy, cada `sdd merge --sync` que cruza un cierre de deuda o un cambio de estado con un cambio de texto de `develop` en la misma fila para con `base: conflicto en .docs/sdd/roadmap.md`, y cada requisito de una capacidad con el `THEN` cambiado en un lado y los `AND` en el otro para con `conflicto en .docs/sdd/capabilities/<capacidad>.md`. En `delegate` cada uno es una parada del dev-lead y ~3-10 min de resolución a mano (0216, 0235, 0236, 0248), y resolverlo a mano dejó filas duplicadas en la 0216. El éxito: esos tres casos salen de `--sync` sin conflicto y con los cambios de los dos lados; el fracaso, aunque funcione, sería unir en silencio dos cambios a la misma celda o a la misma línea.

## Scope

- Entra: la clave de una fila de los registros sin el prefijo de cierre; la unión de una fila por celdas, con la primera celda en dos partes; la unión de las líneas `- THEN`/`- AND` de un trozo de `.docs/sdd/capabilities/`; sus pruebas; saldar las filas de deuda.
- No entra: unir otras líneas de una capacidad (`GIVEN`, `WHEN`, títulos, reglas); la limpieza de filas repetidas tras un merge sin conflicto (`dedupeNewRows`), que ya compara con la misma clave; `debt.md` de la 3.0.0, que mueve la fila en vez de anteponerle un prefijo; reordenar filas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «si las dos ramas cambian de forma distinta la misma fila que ya estaba en la base, es conflicto» → la misma **celda** | `capabilities/control-profiles.md:370` | delta, `MODIFIED` «Los registros se unen por id» |
| «ni la unión por id de los registros ni Mergiraf lo resuelven» | `capabilities/control-profiles.md:216` | delta, `MODIFIED` «El merge del cierre une los registros que solo añaden líneas» |
| la lista de lo que resuelve la integración de la base | `capabilities/control-profiles.md:209` | delta, `MODIFIED` «El merge del cierre parte de la rama destino publicada» |
| la prueba `keyed: los dos cambian distinto la misma fila de la base es conflicto` | `cli/test/merge/keyed.test.ts:41` | se queda: cambia la misma celda (el estado), sigue siendo conflicto |

- Filas que implementa: 0244 y 0259 (absorbida) → solo `roadmap.md` (buscado `0244|0259` en `skills/`, `capabilities/`, `.docs/sdd/*.md` y `cli/src/`); la 0244 pasa a `✅` y la 0259 se queda aparcada por absorción, como está. Deuda que salda: «Un conflicto dentro de un requisito de `capabilities/` para el merge por dos cambios que no se tocan» (`roadmap.md:629`) y la (b) de «Menores del ticket del patch 0248» (`roadmap.md:611`), con el prefijo de cierre. Ninguna skill describe la unión por id (buscado `une los registros|unión por id|por id` en `skills/`).

## Approach

La clave de una fila descarta sus prefijos de cierre; dos versiones con la misma clave se unen celda a celda, con la primera celda partida en prefijos y texto (decisiones 2-4). Para `capabilities/`, `resolveConflicts` prueba, antes de dar el fichero por no resuelto, una unión línea a línea del trozo contra la base, solo con líneas `- THEN`/`- AND` (decisión 6). Lo que no se une sigue saliendo en `conflicto en`, como hoy.

## Dónde se prueba

- Clave sin prefijo y unión por celdas: `mergeKeyedHunk` en `cli/test/merge/keyed.test.ts`, como las pruebas `keyed:` actuales; de punta a punta, `sdd merge --sync` en `cli/test/merge/registries.slow.test.ts`.
- Líneas `THEN`/`AND` de un requisito: la función pura en `cli/test/merge/requirement-lines.test.ts`; de punta a punta, `sdd merge --sync` en `cli/test/merge/registries.slow.test.ts`.

## Términos y ADR

- Términos resueltos: prefijo de cierre — el `**[Feature|Patch NNNN, fecha: saldada|parcial — …]**` que el cierre antepone a una fila de deuda.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `control-profiles`

#### MODIFIED — Los registros se unen por id

- GIVEN `develop` y la rama que se fusiona, que en el mismo trozo de `.docs/sdd/roadmap.md` (o de `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/changelog.md` o `.docs/sdd/steering/debt.md`) marcan una la fila `0190` como `✅` y añaden la otra la fila `0201` debajo
- WHEN el cierre ejecuta `sdd merge`
- THEN el trozo queda con la `0190` en `✅` y la `0201`, sin conflicto
- AND si las dos ramas añaden la misma fila `0201` con el mismo texto, queda una sola
- AND si añaden dos filas `0201` con texto distinto, se quedan las dos, la de la rama destino primero, y la salida dice `registros: dos filas distintas con el id '0201' en .docs/sdd/roadmap.md; se quedan las dos, revísalas`
- AND una entrada `- **Feature 0185** — …` en `### Added` y otra en `### Changed` son ids distintos
- REMOVED AND si las dos ramas cambian de forma distinta la misma fila que ya estaba en la base, es conflicto y lo resuelve una persona
- AND si las dos ramas cambian celdas distintas de la misma fila que ya estaba en la base, la fila queda con los cambios de las dos: la `0248` con el `✅` de la rama y el caso que `develop` añadió a la descripción; si cambian la misma celda de forma distinta, o la fila no tiene las mismas celdas en los dos lados, es conflicto y lo resuelve una persona
- AND la clave de una fila de deuda no cuenta los prefijos de cierre del principio de su primera celda (`**[Feature 0216, 2026-10-28: saldada — …]**`, o con `Patch` y `parcial`): si la rama salda la fila «Tres tests del lanzador en Vitest…» y `develop` le cambia la celda «Destino», queda una sola fila, con el prefijo de la rama y el «Destino» de `develop`, sin conflicto y sin aviso de `registros:`
- AND si los dos lados añaden prefijos de cierre distintos a la misma fila, es conflicto
- AND si el merge se aborta después por otro fichero en conflicto, la salida no dice `registros: …`
- AND la cabecera de una tabla no es una fila con id, aunque el trozo la separe de su separador: si las dos ramas añaden la misma tabla (`| Id | Tarea | Estado |`) con filas distintas, queda una tabla con la cabecera una vez y las dos filas seguidas, sin aviso

#### ADDED — Dentro de un requisito de una capacidad se unen los THEN y AND que cambia cada lado

- GIVEN un requisito de `.docs/sdd/capabilities/control-profiles.md` cuyo `- THEN` cambia `develop` y cuyos `- AND` cambia la rama, en líneas seguidas que git deja en el mismo trozo en conflicto
- WHEN se ejecuta `sdd merge --sync` (o el cierre ejecuta `sdd merge`)
- THEN el requisito queda con el `THEN` de `develop` y los `AND` de la rama, sin conflicto, y la integración sigue como con cualquier conflicto resuelto
- AND vale igual si un lado añade o quita un `- AND` y el otro cambia otra línea del trozo; las líneas añadidas quedan en el sitio donde las puso su lado
- AND si los dos lados cambian la misma línea de forma distinta, o añaden líneas en el mismo hueco de un trozo que conserva líneas de la base, sigue siendo conflicto: `base: conflicto en .docs/sdd/capabilities/control-profiles.md.`
- AND un trozo en el que los dos lados solo añaden líneas, sin ninguna de la base, se une como en «El merge del cierre une los registros que solo añaden líneas»: primero las de la rama destino
- AND si alguna línea del trozo, en cualquiera de los tres lados, no empieza por `- THEN ` ni por `- AND ` (un `- GIVEN`, un `- WHEN`, un título `###`, prosa o una línea en blanco), sigue siendo conflicto
- AND fuera de `.docs/sdd/capabilities/` esta unión no se aplica

#### MODIFIED — El merge del cierre une los registros que solo añaden líneas

- GIVEN dos ramas desde la misma rama destino que añaden cada una una fila a `roadmap.md`, una línea a `changelog.md`, una sección al final de otro documento o una palabra a `.cspell/custom-words.txt` en el mismo sitio, y la primera ya se ha fusionado
- WHEN el cierre de la segunda ejecuta `sdd merge`
- THEN el script resuelve el conflicto en su worktree —con `--verify`, al integrar la base en la rama del cambio, fuera del cerrojo; sin él, dentro del cerrojo—: deja las líneas de la rama destino y después las de la rama, regenera `estimation-log.md` y fusiona sin intervención
- REMOVED AND si en algún trozo los dos lados cambian una línea que ya existía y ni la unión por id de los registros ni Mergiraf lo resuelven, o los dos crean el mismo fichero, aborta y falla con `merge: conflicto en` y la lista de ficheros, sin tocar la rama destino; si el conflicto sale al integrar la base en la rama, falla con `base: conflicto en` y la rama del cambio vuelve a su commit, sin `MERGE_HEAD`
- AND si en algún trozo los dos lados cambian una línea que ya existía y ni la unión por id de los registros, ni la de los `THEN` y `AND` de un requisito de una capacidad, ni Mergiraf lo resuelven, o los dos crean el mismo fichero, aborta y falla con `merge: conflicto en` y la lista de ficheros, sin tocar la rama destino; si el conflicto sale al integrar la base en la rama, falla con `base: conflicto en` y la rama del cambio vuelve a su commit, sin `MERGE_HEAD`

#### MODIFIED — El merge del cierre parte de la rama destino publicada

- GIVEN una rama destino con remoto que avanzó después de abrir la feature
- WHEN el cierre fusiona
- THEN antes de fusionar la feature, integra en la rama destino local los commits del remoto
- REMOVED AND resuelve sus conflictos como el merge de la feature: regenera `estimation-log.md` con `sdd estimation log`, une los registros por id, une los trozos que solo añaden líneas por los dos lados (primero la rama destino) y prueba Mergiraf si está instalado; con cualquier otro conflicto, falla con `base: conflicto en` y la lista de ficheros
- AND resuelve sus conflictos como el merge de la feature: regenera `estimation-log.md` con `sdd estimation log`, une los registros por id, une los trozos que solo añaden líneas por los dos lados (primero la rama destino), une los `THEN` y `AND` de un requisito de una capacidad y prueba Mergiraf si está instalado; con cualquier otro conflicto, falla con `base: conflicto en` y la lista de ficheros

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0,6 h
- Estimación de implementación: 2,5 h, más el gate de cierre (`moon run kit:test-headless cli:typecheck cli:test --affected --base develop`, ~2 min con `kit:test-headless`, que corre porque cambia `cli/src/`)
- Base de la estimación: dos funciones puras pequeñas en un módulo que ya tiene sus pruebas y su patrón (`keyed.ts`, `registries.ts`), más dos pruebas de punta a punta copiadas de `registries.slow.test.ts`; la incertidumbre es la unión línea a línea, que no tiene utilidad de diff en el repo
- Confianza: media

## Enmiendas

- 2026-10-29 — el AND «añaden líneas en el mismo hueco → conflicto» del ADDED se limita a los trozos que conservan líneas de la base, y un AND nuevo dice que un trozo en el que los dos solo añaden se une como hasta ahora — la revisión final (eje Spec) lo probó con git real: dos `- AND` añadidos tras la misma línea dan un trozo con la base vacía, que ya unía `mergeAddedLines` antes de esta rama y que regula el requisito «El merge del cierre une los registros que solo añaden líneas»; el AND tal cual contradecía ese requisito — aprobada (opción «Corregir el AND»)

- 2026-10-29 — la decisión 3 deja de decir que un cambio del texto del ítem en `develop` queda detrás del prefijo — ese texto es la clave de la fila, así que un cambio suyo ya es otra fila, como hoy; ningún THEN ni AND cambia — sin aprobar (corrige una decisión mía, no un escenario)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-29 | aprobada (opción «Apruebo») |
