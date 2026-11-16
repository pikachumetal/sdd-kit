---
id: 20261019-122910-feature-0202-close-loose-ends
feature: 0202
title: Cierra lo que quedó abierto en la 0193 y la 0201
mode: full
profile: delegate
status: done
created: 2026-10-19
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-19
---

# Spec — Cierra lo que quedó abierto en la 0193 y la 0201

🦆 Todo lo que la 0193 y la 0201 dejaron abierto queda cerrado, sin nada diferido.
- Si dos ramas meten la misma fila en sitios distintos de un registro, `sdd merge` ya no la deja dos veces: quita la copia idéntica con un commit propio y avisa si son dos filas distintas con el mismo id. `sdd roadmap check` también avisa de un id repetido.
- `sdd session tokens` mide una feature aunque se arrancara desde la sesión de otra que ya estaba fusionada, sin sumar el trabajo de sesiones paralelas. Hoy la 0201 sale «no medido» y su tiempo se le apunta a la 0193.
- Mergiraf pasa a ser obligatorio para desarrollar el kit y solo toca código, para que la suite lo verifique siempre.
- El descarte del merge driver entra en `tech-stack.md`.
- Entran también los tests que faltaban y los 8 menores de la 0201.

## Capacidades

- Modificadas: `control-profiles` — tras fusionar, `sdd merge` limpia las filas repetidas de los registros; Mergiraf solo resuelve ficheros fuera de `.docs/` que no sean `*.md`, une cambios compatibles de los dos lados, y lo que resuelve se verifica aunque solo cambien docs; la cabecera de una tabla no cuenta como fila con id.
- Modificadas: `roadmap` — `sdd roadmap check` avisa, sin fallar, de un id repetido.
- Modificadas: `estimation` — una rama sin transcripts propios se mide por ventana de tiempo, y lo posterior al último merge de una rama no le cuenta.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec: dos revisores, dominio en Opus y técnica en Sonnet (lo elegiste tú) — 20 hallazgos: 18 aceptados, 2 rechazados con motivo (abajo)
```

1. **Una sola feature, sin partir.** Son 5 tasks y tres capacidades, y la regla propondría partir. Lo pediste así: «te dicia uno».
2. **Nada diferido.** Los Minor de la revisión final de esta feature entran en su pasada de fix, como los Important. Ninguno va a una fila de deuda.
3. **Ids repetidos en `roadmap check`: aviso, no fallo.**
   - Literal: `<fichero>: aviso: línea <n>: el id «<id>» ya está en la línea <m>`. Sale después de los fallos, como los demás avisos.
   - La columna de id es la que se llama `#`, `id` o `Id`, en cualquier tabla del fichero, también las `B<n>` de Later. Las filas de «Patches», que empiezan por la fecha, y la deuda no se miran.
   - No es fallo para que el hook `pre-merge-commit` de este repo no rechace el merge que la 0193 decidió mantener con aviso (dos filas distintas con el mismo id).
4. **Limpieza tras fusionar** (merge del cierre y `--sync`), en los cinco registros de la 0193:
   - Solo cuentan los ids que están repetidos en el resultado y no lo estaban en la rama destino antes del merge.
   - Dentro de la misma sección, las copias idénticas se quitan: queda la primera del fichero. Para cada id con filas distintas, avisa con el literal de la 0193.
   - En `roadmap.md` y `ROADMAP.md`, un id que queda en dos secciones distintas lleva además el aviso de `roadmap check` del punto 3.
   - La limpieza va en un commit propio, `docs(registros): quita las filas repetidas del merge`, con el cuerpo `Filas: <ids>.`. No se enmienda el commit de merge: en `--sync` la rama de la feature puede estar publicada.
   - Si ese commit falla (un hook), se deshace el merge y sale con 1: `registros: no se pudo commitear la limpieza de filas repetidas`.
5. **Mergiraf (lo decidiste tú): une cambios compatibles de los dos lados** (`{ a, b }` + `{ a, c }` → `{ a, b, c }`). Para que «la suite decide» se cumpla siempre:
   - Mergiraf solo se lanza sobre ficheros fuera de `.docs/` que no sean `*.md`. Los documentos que las reglas del kit no resuelven los resuelve una persona.
   - Si Mergiraf resolvió algún fichero, `--verified-at` no omite `--verify`.
   - Tras un `--sync` con un `mergiraf: resuelto`, la receta ya repite la suite completa, porque la base trae cambios fuera de `.docs/`.
6. **Mergiraf, obligatorio para desarrollar el kit (lo decidiste tú):**
   - `tech-stack.md`, «Herramientas del repo»: mergiraf 0.20.0, la versión probada en la fila 0200, con `cargo binstall mergiraf` o `cargo install --locked mergiraf`. Es dependencia de desarrollo del repo; los proyectos que usan el kit no la necesitan.
   - No hay CI remota (el «CI» es local), y proto no tiene plugin de mergiraf: no se toca `.prototools`.
   - Los tests lentos de Mergiraf dejan de saltarse. Sin `mergiraf` en el PATH, un test falla con `mergiraf no está en el PATH: instálalo (tech-stack.md, «Herramientas del repo»)`.
7. **Tope de `tech-stack.md`:** lo subes tú («todo lo que dices que se quedo abierto en 193 y 201 se ha de cerrar»). Entran dos líneas: el descarte del merge driver y Mergiraf como herramienta. El tope nuevo es lo medido después de escribirlas más un 2 %; se mide en la Task 1 y se apunta en «Enmiendas».
8. **Medición por ventana, solo cuando la carpeta del worktree no tiene respuestas de la rama:**
   - **Inicio:** la primera entrada del reflog de la rama. Sin reflog, `no medido (sin reflog de <rama>: no se sabe cuándo se creó)`.
   - **Fin:** el primero de estos momentos:
     - el último commit de merge de la rama en `merge.into` (un commit de primer padre de `merge.into` cuyo segundo padre está en la rama);
     - la creación (reflog) de otra rama local que tampoco tiene transcripts propios;
     - ahora. En los tests, «ahora» se inyecta como hoy se inyecta el reloj.
   - **Qué cuenta:** las respuestas de las carpetas de los demás worktrees del repo (`git worktree list`) dentro de la ventana, y de ellas solo las de una rama ya fusionada en `merge.into` antes de esa respuesta. El trabajo de una sesión en otra rama viva no se suma.
   - **Subagentes y esperas:** se calculan con esas mismas respuestas, y el reloj empieza en el inicio de la ventana.
   - **La salida:** las cuatro líneas de hoy no cambian de forma. La ventana se dice en una quinta línea, `- Medición: por ventana — transcripts de <ruta> desde <AAAA-MM-DDTHH:MMZ> (la rama no tiene transcripts propios)`, para no tocar lo que lee `sdd estimation log`. `--json` gana `window: { folder, from, to }`.
9. **Lo posterior al último merge no cuenta:** con la rama fusionada en `merge.into`, ninguna respuesta posterior a su último commit de merge cuenta para ella, en las cuatro líneas. El último merge, y no el primero, para que cuente el ticket del kit que se fusiona después del cierre.
10. **Test de `histogram`:** base con las funciones `a`, `b` y `c`; una rama mueve `c` antes de `b` y la otra cambia lo que devuelve `c`. Con `myers` da conflicto y con `histogram` no (comprobado en un repo temporal). El test lo fusiona con `sdd merge` y comprueba que el resultado lleva los dos cambios.
11. **Test de «vuelta: no se pudo consultar»:** unitario, con `vi.mock` del módulo `git` (como `usage.test.ts`), que devuelve código 128 a `ls-remote`. `publishedBack` se exporta para el test.
12. **Los 8 menores de la 0201:**
    - (a) Los tests viejos de `MERGE_HEAD` y de dos releases se quedan, porque prueban otros casos (merge con conflicto; varias releases conocidas). Es una decisión, no algo pendiente.
    - (b) El error de git sin conflictos solo se alcanza en `--sync`: en el merge del cierre, `assertClean` para antes por cualquier fichero sin seguimiento del destino. Un test lo fija: con un fichero sin seguimiento en el checkout de `develop`, sale `destino sacado:`.
    - (c) El test del HEAD desacoplado comprueba además que `HEAD` no cambia.
    - (d) `solveWithMergiraf` recibe dos callbacks, `onSolved` y `onUnsolved`, en vez de filtrar por el prefijo del texto.
    - (e) Fuera el `void lines.push`.
    - (f) `failedWithoutConflicts` pasa a llamarse `abortedMergeError`, con early return.
    - (g) Test de `mergeKeyedHunk` con la cabecera de una tabla en los dos lados.
    - (h) La cabecera de una tabla se reconoce también cuando el trozo la separa de su separador: `registries.ts` saca de la versión base del fichero (`:1:`) las líneas seguidas de un separador.
13. **La decisión 8 de la 0193** («no se buscan duplicados fuera de los trozos en conflicto») queda superada por el punto 4. La spec de la 0193 es un evento y no se reescribe: lo dice el walkthrough de la 0202.
14. **Ejemplos inventados:** las ramas, ids y horas de los escenarios (`0210`, `0211`, `10:00Z`) son ficticios.
15. **Repaso de coherencia:** `capability merge` sobre una copia de `.docs/sdd` da 3 requisitos añadidos, 4 sustituidos y 5 reglas sustituidas, y sale con 0; `capability check` da `Capacidades válidas: 20`.

### Hallazgos de la review

**Aceptados (18):**
- Dominio 1 y técnica 2: la ventana cambiaba dos requisitos de `estimation` → «Con `--branch`…» y «Sin transcripts…» pasan a MODIFIED.
- Dominio 2: el literal de la ventana vacía era ambiguo → literales de cada caso en el MODIFIED de «Sin transcripts».
- Dominio 3 y técnica 1: la ventana sumaba sesiones paralelas → solo cuentan respuestas de ramas ya fusionadas; AND con dos worktrees a la vez.
- Dominio 4: no decía en qué merge corta → corta en el último (punto 9).
- Dominio 5: faltaban las reglas de `estimation` → «Dónde viven los datos», «Límites» y «Avisos» completos.
- Técnica 3: el sufijo podía romper lo que lee `estimation log` → quinta línea `Medición:` y campo en `--json`.
- Técnica 4: faltaban el caso sin reflog, cómo se localiza el commit de merge y cómo se fija «ahora» → puntos 8 y 9.
- Técnica 5: el amend no vale si la rama de `--sync` está publicada → commit propio, y su fallo deshace el merge.
- Técnica 6 y dominio 8: faltaban la referencia, la copia que queda y los ficheros cubiertos → punto 4, los cinco registros.
- Técnica 7 y dominio 10 (h): la cabecera separada no tenía escenario → AND en «Los registros se unen por id».
- Técnica 8, dominio 6 y dominio 7: al aviso le faltaban `aviso:` y «» → literal corregido y regla «Avisos» de `roadmap` sustituida.
- Técnica 9: Mergiraf obligatorio sin decir que es de desarrollo ni qué pasa sin él → punto 6.
- Técnica 10: la excepción de Mergiraf no tenía escenario → AND con `{ a, b }` + `{ a, c }`.
- Dominio 9: «la suite decide» no se cumplía en dos casos → punto 5.
- Dominio 10: ejemplos con horas reales → ficticios.

**Rechazados (2):**
- Técnica 10: llevar la superación de la decisión 8 de la 0193 a ✋ ya está hecho en el punto 13; no hay nada más que cambiar.
- Técnica 9: tocar CI y moon. No hay CI remota y proto no tiene plugin de mergiraf, así que no hay superficie que tocar (punto 6).

- Política de modelos: revisores de la spec, dominio opus y técnica sonnet, ya hechos · ejes de la revisión final, Spec opus+high y Código sonnet+high, en paralelo · sin sujetos (no se edita ninguna skill) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar

### Decisiones tomadas con el dev-lead

- Cerrar todo lo abierto de la 0193 y la 0201 — «todo lo que dices que se quedo abierto en 193 y 201 se ha de cerrar» (2026-10-19)
- Una sola feature — «te dicia uno... pero a ver estoy hasto que dejes cabos sueltos» (2026-10-19)
- Mergiraf une cambios compatibles y la suite decide — opción «Sí, y la suite decide» (2026-10-19)
- Mergiraf obligatorio en el repo — opción «Mergiraf obligatorio en el repo» (2026-10-19)
- Review de la spec con dos revisores — «dom opus, tec sonnet» (2026-10-19)

## Intent

La 0193 y la 0201 cerraron con puntos abiertos:
- el descarte del merge driver fuera de su documento de anclaje;
- filas repetidas que git fusiona sin conflicto;
- `histogram` sin prueba de efecto;
- tests de Mergiraf que se saltan;
- un mensaje del hotfix sin test;
- una decisión de producto sin escribir;
- 8 menores;
- `session tokens`, que no mide una feature arrancada desde la sesión de otra.

Éxito: ninguno sigue abierto, y la feature cierra sin minors diferidos, sin filas de deuda nuevas y sin «no probado». Fracaso: cerrar alguno otra vez como «diferido».

## Scope

- Entra: los puntos 3 a 13 de ✋, más el texto de `tech-stack.md` y su tope.
- No entra: las filas de deuda anteriores sobre `sdd merge` (107 → 0184, 128 y 428), que no salen de la 0193 ni de la 0201.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `describe.skipIf(!mergirafRuns())` en los tests de Mergiraf | `cli/test/merge/mergiraf.slow.test.ts` | punto 6 |
| `MergirafOptions.report` | `cli/src/merge/mergiraf.ts`, `registries.ts` | punto 12 (d) |
| `failedWithoutConflicts` | `cli/src/merge/attempt.ts` | punto 12 (f) |
| Mergiraf sobre cualquier fichero | `capabilities/control-profiles.md`, «Mergiraf resuelve lo que queda…» | delta `MODIFIED` (punto 5) |
| «no medido (sin respuestas de `<rama>` en los transcripts)» como única salida con la carpeta presente | `capabilities/estimation.md`, «Sin transcripts…» | delta `MODIFIED` (punto 8) |
| Decisión 8 de la 0193 | spec de la 0193 (evento) | punto 13 |

- Filas que implementa: ninguna fila del roadmap nombra la 0202. Al cerrar, la feature abre su propia fila en «Próximo», con ✅. Comprobado con `grep -rn "0202" .docs/sdd/roadmap.md`.

## Approach

Cinco tasks:
1. `tech-stack.md`, su tope y Mergiraf obligatorio.
2. Mergiraf solo sobre código y su verificación, y los tests que faltaban (`histogram`, la vuelta que no se puede consultar).
3. Ids repetidos: aviso en `roadmap check` y limpieza en `sdd merge`.
4. `session tokens`: por ventana y con corte en el último merge.
5. Los menores de la 0201.

## Dónde se prueba

- Ids repetidos en `roadmap check`: `cli/test/roadmap/`, como los tests de cabeceras.
- Limpieza tras fusionar: `registries.slow.test.ts` y `sync.slow.test.ts`.
- `session tokens`: `cli/test/session/`, con transcripts de fixture, reflog y «ahora» inyectados, como los de `--branch`.
- `histogram`: `histogram.slow.test.ts`, nuevo.
- Mergiraf solo sobre código y `--verified-at`: `mergiraf.slow.test.ts`.
- Mergiraf obligatorio: el test que falla sin `mergiraf`.
- La vuelta que no se puede consultar: `hotfix.test.ts`, nuevo y unitario.
- Menores: en sus ficheros de test.
- Tope de palabras: `tests/WordBudget.Tests.ps1`.

## Términos y ADR

- Términos resueltos: **medición por ventana** — contar las respuestas de los transcripts por hora, entre la creación de una rama y su fin, cuando la rama no tiene transcripts propios.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `control-profiles`

**ADDED — Tras fusionar, las filas repetidas de los registros se limpian**
- GIVEN dos ramas que añaden la fila `| 0210 | x | ⏳ |` en sitios distintos de la misma tabla de `.docs/sdd/roadmap.md`, que git fusiona sin conflicto, y la primera ya fusionada en `develop`
- WHEN el cierre de la segunda ejecuta `sdd merge` (o `sdd merge --sync`)
- THEN tras el commit de merge, el script quita la segunda copia en un commit `docs(registros): quita las filas repetidas del merge` con el cuerpo `Filas: 0210.`, antes de verificar y publicar
- AND si las dos filas `0210` tienen texto distinto, se quedan las dos, no hay commit de limpieza, y la salida dice `registros: dos filas distintas con el id '0210' en .docs/sdd/roadmap.md; se quedan las dos, revísalas`
- AND vale igual en `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/changelog.md` y `.docs/sdd/steering/debt.md`, dentro de cada sección: `**Feature 0210**` en `### Added` y en `### Changed` no se toca
- AND un id que ya estaba repetido en la rama destino antes del merge no se toca ni se avisa
- AND si el commit de limpieza falla, el merge se deshace, la rama destino queda como estaba y el script sale con 1 con `registros: no se pudo commitear la limpieza de filas repetidas`

**MODIFIED — Mergiraf resuelve lo que queda si está instalado**
- GIVEN dos ramas que añaden cada una un método distinto en el mismo sitio de `src/rooms.ts` y `mergiraf` en el `PATH`
- WHEN el merge deja ese fichero en conflicto tras unir los registros y los trozos que solo añaden
- THEN el script ejecuta `mergiraf solve src/rooms.ts`, escribe `mergiraf: resuelto src/rooms.ts`, commitea el merge y corre `--verify` sobre el resultado
- AND si `mergiraf solve` sale con otro código, escribe `mergiraf: no resuelve src/rooms.ts`, aborta el merge y falla como hoy con el fichero en la lista de `conflicto en`
- AND sin `mergiraf` en el `PATH` no escribe nada de Mergiraf y falla como hoy
- AND el script no escribe `git config` ni `.gitattributes`
- AND si resuelve `src/rooms.ts` pero otro fichero queda en conflicto, aborta y no escribe `mergiraf: resuelto src/rooms.ts`
- AND si las dos ramas cambian el mismo import de forma compatible (`import { a, b }` y `import { a, c }`), Mergiraf los une en `import { a, b, c }` y `--verify` decide: en rojo, el merge se deshace como cualquier verificación en rojo
- AND no se lanza sobre ficheros de `.docs/` ni sobre `*.md`: un conflicto ahí que las reglas del kit no resuelven sale en `conflicto en` sin línea de Mergiraf
- AND si resolvió algún fichero, `--verified-at` no omite `--verify`

**MODIFIED — Los registros se unen por id**
- GIVEN `develop` y la rama que se fusiona, que en el mismo trozo de `.docs/sdd/roadmap.md` (o de `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/changelog.md` o `.docs/sdd/steering/debt.md`) marcan una la fila `0190` como `✅` y añaden la otra la fila `0201` debajo
- WHEN el cierre ejecuta `sdd merge`
- THEN el trozo queda con la `0190` en `✅` y la `0201`, sin conflicto
- AND si las dos ramas añaden la misma fila `0201` con el mismo texto, queda una sola
- AND si añaden dos filas `0201` con texto distinto, se quedan las dos, la de la rama destino primero, y la salida dice `registros: dos filas distintas con el id '0201' en .docs/sdd/roadmap.md; se quedan las dos, revísalas`
- AND una entrada `- **Feature 0185** — …` en `### Added` y otra en `### Changed` son ids distintos
- AND si las dos ramas cambian de forma distinta la misma fila que ya estaba en la base, es conflicto y lo resuelve una persona
- AND si el merge se aborta después por otro fichero en conflicto, la salida no dice `registros: …`
- AND la cabecera de una tabla no es una fila con id, aunque el trozo la separe de su separador: si las dos ramas añaden la misma tabla (`| Id | Tarea | Estado |`) con filas distintas, queda una tabla con la cabecera una vez y las dos filas seguidas, sin aviso

**Reglas de la capacidad**
- **Regla ante conflicto**: el perfil sigue feature → persona (`sdd-kit.local.json`) → release → proyecto; `execution` sigue método nombrado para la feature → persona → proyecto, sin nivel de release, y un valor fijado manda sobre la recomendación del handoff; ninguna regla del perfil cubre el merge a `main`, el tag ni las acciones hacia fuera distintas del push de la rama de integración que autoriza `merge.push`, y no deroga la ruta «Merge y tag sin segunda ronda cuando la decisión ya está tomada» de `release-flow`, donde la decisión ya la tomó una persona. Un merge o un push que el entorno o el remoto deniegan no se reintenta: lo desbloquea una persona. Un conflicto de merge en el que los dos lados cambian lo mismo lo resuelve una persona: `sdd merge` solo resuelve, en este orden, el `estimation-log.md` (regenerado), los registros por id, los trozos que solo añaden y lo que Mergiraf resuelva con código 0. La excepción es Mergiraf, solo fuera de `.docs/` y de `*.md`: une cambios compatibles de los dos lados en la misma construcción (`{ a, b }` + `{ a, c }` → `{ a, b, c }`), y la verificación que corre sobre el resultado decide (dev-lead, 2026-10-19).

### Capacidad: `roadmap`

**ADDED — Un id repetido se avisa sin fallar**
- GIVEN un `roadmap.md` con la fila `| 0210 | x | ⏳ |` en la línea 12 y otra fila con el id `0210` en la línea 30, en tablas cuya columna de id se llama `#`, `id` o `Id`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe, después de los fallos, `roadmap.md: aviso: línea 30: el id «0210» ya está en la línea 12`, y sin otros fallos sale con 0
- AND las tablas sin esa columna (las de «Patches», que empiezan por la fecha, y la deuda) no se miran
- AND en `ROADMAP.md` de la 3.0.0, un id repetido entre Now, Next o Later, incluidos los `B<n>` de Later, se avisa igual, con el prefijo `ROADMAP.md: `

**Reglas de la capacidad**
- **Avisos**: una línea por fallo del validador, con la regla incumplida. Son avisos, sin fallo: el prefijo de cierre fuera de forma (2.x), la fila de «En espera» que caduca, la descartada que sale en el corte, el roadmap que no se lee cuando están los dos y el id repetido en la columna de id de dos filas. Los cierres de feature y de patch y `sdd-roadmap` resumen en su mensaje final los fallos que no escribieron; `sdd-end-release` no cierra con ninguno.

### Capacidad: `estimation`

**MODIFIED — Con `--branch` solo cuenta la rama de la feature**
- GIVEN la sesión del primer requisito, con todas sus líneas en la rama `feature/0068`, y una segunda sesión con la respuesta `msg_C` de `claude-sonnet-5` (lectura 900.000) en la rama `develop`
- WHEN se ejecuta el script con `--branch feature/0068`
- THEN el hilo suma 2.605.005 tokens: `msg_C` queda fuera
- AND sin `--branch`, el hilo suma 3.505.005
- AND con `feature/0068` fusionada en `merge.into` (su último commit de merge, a las 10:00Z), las respuestas de la rama posteriores a las 10:00Z no cuentan, en ninguna de las cuatro líneas

**MODIFIED — Sin transcripts, «no medido»**
- GIVEN un worktree sin carpeta en `<proyectos>/`
- WHEN se ejecuta el script
- THEN la rama se mide por ventana («Una rama sin transcripts propios se mide por ventana de tiempo»); si la ventana tampoco tiene respuestas, las cuatro líneas dicen `no medido (sin transcripts de Claude Code para <ruta>)` y el script sale con código 0
- AND con la carpeta pero sin ninguna respuesta de la rama pedida, la rama se mide igual por ventana; si la ventana tampoco tiene respuestas, las cuatro dicen `no medido (sin respuestas de <rama> en los transcripts)`
- REMOVED THEN las cuatro líneas dicen `no medido (sin transcripts de Claude Code para <ruta>)` y el script sale con código 0
- AND con respuestas del hilo y ningún subagente, la línea de subagentes dice `no aplica` y la del coste lleva solo el hilo: `Coste de la sesión: 0,95 $ (hilo 0,95 $)`
- REMOVED AND con la carpeta pero sin ninguna respuesta de la rama pedida, las cuatro dicen `no medido (sin respuestas de <rama> en los transcripts)`

**ADDED — Una rama sin transcripts propios se mide por ventana de tiempo**
- GIVEN la rama `feature/0211-y`, sin respuestas suyas en los transcripts de su worktree, creada (reflog) a las 10:05Z desde una sesión abierta en el worktree de `feature/0210-x`, que se fusionó en `develop` a las 10:00Z y sigue respondiendo con `gitBranch` `feature/0210-x` hasta las 10:40Z
- WHEN se ejecuta `sdd session tokens --path <worktree de la 0211> --branch feature/0211-y` con «ahora» a las 10:45Z
- THEN cuenta las respuestas de esa sesión entre las 10:05Z y las 10:45Z, con sus subagentes y sus esperas, y el reloj empieza a las 10:05Z
- AND imprime las cuatro líneas de siempre y una quinta: `- Medición: por ventana — transcripts de <ruta del worktree de la 0210> desde 2026-10-19T10:05Z (la rama no tiene transcripts propios)`; `--json` lleva `window: { folder, from, to }`
- AND con otro worktree en `feature/0212-z`, sin fusionar, que responde en la misma ventana, sus respuestas no cuentan
- AND si otra rama local sin transcripts propios se creó a las 10:30Z, la ventana de la 0211 acaba a las 10:30Z
- AND sin reflog de la rama, las cuatro dicen `no medido (sin reflog de feature/0211-y: no se sabe cuándo se creó)`

**Reglas de la capacidad**
- **Dónde viven los datos**: los bloques de tiempo de `walkthrough.md` (§2) y de `patch.md` (§5) de cada carpeta de artefactos, con la estimación previa del patch y su hora de inicio en §5, escritas antes del fix, y la marca `post hoc` si la estimación llega en el commit de cierre; el esfuerzo real y las esperas, de los transcripts de Claude Code; para una rama sin transcripts propios, de los transcripts de los demás worktrees del repo, entre la creación de la rama (su reflog) y su último merge en `merge.into`; el log, generado, en la carpeta de `estimation.md`.
- **Límites**: la ventana de una rama sin transcripts propios va de la primera entrada de su reflog hasta su último merge en `merge.into`, la creación de otra rama local sin transcripts propios o ahora, lo que llegue antes.
- **Avisos**: por stderr y sin cambiar el código de salida: un bloque de tiempo sin esfuerzo real legible (la fila se excluye), un log mantenido a mano que se sobrescribe y un documento presente en sus dos rutas. La línea `- Medición: por ventana …` no es un aviso: es parte de la salida, por stdout.

## Topes de palabras

Se mide con `tests/WordBudget.Tests.ps1` en la Task 1. El tope nuevo es lo medido tras escribir más un 2 % (punto 7), y la medida se apunta en «Enmiendas».

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/tech-stack.md` | 18797 / 18800 | 3 | medido tras escribir + 2 % (~19 300) |

## Enmiendas

- 2026-10-19 — Punto 8, «qué cuenta»: en la ventana solo cuenta la sesión que creó la rama, no cualquier sesión de una rama ya fusionada. Al medir la propia 0202 se coló la sesión del worktree 0157, que trabajaba en la 0197 ya fusionada y solo nombraba la rama en un `git worktree list`. Reconoce `-b`, `-B`, `-c`, `-C`, `--branch` y `git [-C <ruta>] branch`. Límite, anotado en el código: una sesión que sigue tras un /clear sin volver a crear la rama no cuenta. No cambia ningún THEN: el GIVEN ya habla de la sesión desde la que se creó la rama — fix descubierto 2, al cerrar — aprobada: opción «Sí, solo la que la creó»

- 2026-10-19 — Punto 8, aclaración sin cambio de THEN: «una rama ya fusionada antes de esa respuesta» se mide con su último merge en `merge.into`. Con el primero, lo que pasa entre el primer merge y el del ticket contaría para la rama (punto 9) y para la ventana a la vez. Y «Dónde se prueba»: la limpieza tras fusionar se prueba en `cleanup.slow.test.ts`, un fichero por requisito — revisión final, eje Spec, hallazgos 4 y Minor 7

- 2026-10-19 — «Los registros se unen por id», AND de la cabecera: queda una tabla con las dos filas, no dos cabeceras. El test destapó además un fix: una fila nueva de la rama se insertaba tras las líneas en blanco del trozo y partía la tabla (fix descubierto 1) — aprobada: opción «Sí: una tabla con las dos filas» — Task 5

- 2026-10-19 — «Sin transcripts, "no medido"»: la ventana también se aplica a un worktree sin carpeta de transcripts, que es el caso de la 0201; el `no medido (sin transcripts…)` queda para cuando la ventana tampoco tiene respuestas — sin ese cambio, la spec no arreglaba el caso que la motiva — aprobada: opción «Sí, enmienda» — Task 4

- 2026-10-19 — Punto 3: la columna de id cuenta solo si es la primera de la tabla (`#`, `id` o `Id`), y un hueco `<…>` de plantilla no es un id. La tabla «Patches» lleva `Id` en segunda posición, y un patch está a la vez en ella y en su fila «Patch:» de «Próximo», que es el flujo previsto; las plantillas repiten `<id>`. Precisa la exclusión que la spec ya hacía de «Patches», sin cambiar ningún THEN — Task 3

- 2026-10-19 — Tope de `tech-stack.md`: medido 18900 tras las dos líneas (antes 18797); tope nuevo 19280 (18900 + 2 %, a la decena) — punto 7, decisión del dev-lead («todo lo que dices que se quedo abierto en 193 y 201 se ha de cerrar») — Task 1

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-19 | aprobada (opción «Apruebo») |
