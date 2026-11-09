---
id: 20261109-134853-patch-0324-debt-keeps-only-live
task: 0324
title: Patch — La deuda guarda solo lo vivo
type: patch
solution: dev-lead
status: done
created: 2026-11-09
branch: patch/0324-debt-keeps-only-live
commit: <hash>
---

# Patch 0324 — La deuda guarda solo lo vivo

Validación: agente, «Perfil delegate» con `validation.mode: field` en `sdd-kit.json` — cambia skills, una plantilla y la CLI que cubren sus tests y sus baterías; el uso real lo validan los tickets de `sdd-feedback`.

## Capacidades

- Modificadas: `release-flow` — el corte saca de `debt.md` lo caducado, sin «Descartadas»
- Modificadas: `roadmap` — `debt.md` con tres secciones; «Descartadas» fuera de la plantilla y sin aviso «sale en el corte»; reglas «Límites» y «Avisos»
- Modificadas: `planning` — el triaje propone descartar, y lo descartado sale de `debt.md`
- Modificadas: `migration` — la v3.0.0 no pasa una `**Descartada**` a `debt.md`
- Modificadas: `cli` — `sdd roadmap causes` sin la columna «Descartadas»

## 1. Síntoma

Fila 0324 del roadmap (revisión del roadmap, 2026-11-09): «Hoy `debt-template.md` tiene «Descartadas», `sdd-end-release` paso 5 mueve allí lo caducado y lo saca tras dos releases `X.Y.0`, y la migración v3.0.0 copia todas las descartadas a esa sección: el fichero arrastra historia». En este repo la deuda llegó a 535 filas, de las que solo 53 estaban vivas.

## 2. Solución fijada

Dev-lead, 2026-11-09: «uff… dentro de 2 años tendremos 1000 entradas y 990 serán caducada descartada… dame una solución», y «ok» a la de la fila: «`debt.md` solo con «Por triar», «En espera» y «Lista»; descartar o caducar una fila la borra, con el motivo en el cuerpo del commit, y el segundo caso de algo descartado se busca en los tickets, como ya pide el triaje». La historia vive en git, en los tickets y en los walkthroughs (dev-lead, 2026-11-09: «… eso no aporta nada»).

Lo que da por existente, comprobado en la base (`ce4a45f7`):

- `skills/sdd-templates/templates/debt-template.md:9` («La cota»: «una fila de «Descartadas» sale tras dos releases») y `:52-57` (la sección).
- `skills/sdd-end-release/SKILL.md:30`, paso 5: «a row of «En espera» that warns `caduca` moves to «Descartadas» with «Motivo» `caducada` and the cut's date; a row of «Descartadas» that warns `sale en el corte` leaves».
- `skills/sdd-roadmap/SKILL.md:30` (equivalencia «Descartada»), `:104` (el tercer estado), `:115` (caducada a «Descartadas») y `:117` (2.º caso de una descartada).
- `cli/src/roadmap/debt.ts:14,19,43,100`: cabecera, columna de fecha, aviso `descartada el <fecha>, dos releases después: sale en el corte` y causa de «Descartadas».
- `cli/src/roadmap/causes.ts:118,133`: la columna «Descartadas» del «Repaso por causa» que lee `sdd-retro`; la fila no la nombra, pero sin la sección la columna siempre vale 0.
- `skills/sdd-upgrade/references/migrations/v3.0.0.md:84,90,93,94`: la fila `**Descartada**` → «Descartadas» y sus celdas.

Ningún proyecto tiene aún un `debt.md`: la 3.0.0 no está publicada (`plugin.json` 2.3.4), así que no hace falta migrar «Descartadas».

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/templates/debt-template.md`, `skills/sdd-templates/SKILL.md`, `skills/sdd-end-release/SKILL.md`, `skills/sdd-roadmap/SKILL.md`, `skills/sdd-upgrade/references/migrations/v3.0.0.md`, `cli/src/roadmap/debt.ts`, `cli/src/roadmap/causes.ts`; `.docs/workflow/usage-guide.md` (paso 5 del corte, hallazgo del revisor); tests en `cli/test/roadmap/` (`project.ts`, `debt.test.ts`, `causes.test.ts`, `overlap.test.ts`); las rúbricas M3 y V3 de `tests/batteries/sdd-roadmap/` y `tests/batteries/sdd-upgrade/`; los moldes de deuda de las baterías `sdd-roadmap`, `sdd-debugging`, `sdd-archive` y `sdd-retro`, sin la sección vacía; y `tests/debt-keeps-only-live-0324.md`.
- **Cambio**: `debt.md` queda con tres secciones; una fila descartada o caducada sale del fichero, con su motivo en el cuerpo del commit (`sdd-roadmap` al triar, `sdd-end-release` en el corte), y la migración v3.0.0 no pasa las `**Descartada**`. `sdd roadmap check` da «Descartadas» por sección fuera de la plantilla y pierde su aviso «sale en el corte»; `sdd roadmap causes` pierde la columna.
- **Retirado**: la sección «Descartadas» de `debt-template.md`, su cota, su cabecera, su columna de fecha, su aviso `descartada el <fecha>, dos releases después: sale en el corte` y su columna en el «Repaso por causa». Nada más los usaba: `git grep -n "Descartadas"` en `skills/` y `cli/src/` solo da las líneas cambiadas. Lo que el usuario deja de poder hacer: consultar lo descartado en `debt.md`; queda en git y en los tickets.
- **Decisiones**:
  - `debt.md` sin «Descartadas»; descartar o caducar una fila la borra, con el motivo en el cuerpo del commit — dev-lead
  - La migración v3.0.0 no pasa una fila `**Descartada**` a `debt.md` — dev-lead
  - La forma 2.x no cambia (`roadmap-template.md`, `**Descartada**` en «Destino», la fila 2.x de la tabla de equivalencias): la migración a la 3.0.0 ya saca esas filas, y el roadmap 2.x de este repo queda fuera de alcance (lo migra la 0198) — sin el dev-lead (no cambia lo que ve un usuario del kit en 3.0.0)
  - Sin la sección, la columna «Descartadas» de `sdd roadmap causes` sale de la tabla — sin el dev-lead (consecuencia mecánica: siempre valdría 0)

## 4. Verificación

**Previsión de coste** (Art. I), antes del primer sujeto. `node tests/headless/battery.mjs plan` con `N=1`: `m3` de `sdd-roadmap` 0,16 $ y `v1` de `sdd-upgrade` 0,57 $; el humo de `sdd-end-release` (frente `b` de la 0177, sin batería), ~0,23 $ por sujeto, la media de los 32 sujetos de la 0177 (7,34 $).

| Tanda | Sujetos | $ |
| --- | --- | --- |
| RED: `m3`, `v1`, `b` | 3 | 0,96 |
| GREEN: los mismos | 3 | 0,96 |
| REFACTOR, una ronda | 3 | 0,96 |
| Controles (~20 %) | 1 | 0,25 |
| Suma | 10 | 3,13 |

Pasos que cambian y su escenario: `sdd-end-release` paso 5, `b`; `sdd-roadmap` triaje (estados, caducada, 2.º caso de una descartada y la celda 3.0.0 de la tabla), `m3`; `sdd-upgrade` migración v3.0.0, tabla de `debt.md` y sus celdas, `v1`. `debt-template.md` lo leen los tres.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | GIVEN un `debt.md` con una fila de «En espera» que caduca en el corte WHEN `sdd-end-release` corta THEN la fila sale del fichero y el resumen la nombra: humo `b` | RED ❌: crea «Descartadas» y mueve allí las dos caducadas · GREEN ✅: salen de `debt.md`, la del 2026-08-15 se queda, el resumen y el commit dicen «Deuda caducada: «Caché vieja en el listado», «Log duplicado al reservar»» (`tests/debt-keeps-only-live-0324.md`) |
| 2 | GIVEN un `roadmap.md` 2.x con una fila `**Descartada**` WHEN corre la migración v3.0.0 THEN `debt.md` no la lleva: `v1` de `sdd-upgrade`, fila V3 | RED ❌: «Validar el formato de la franja en la API · duplica la 0018» en «Descartadas» · GREEN ✅: «Sale · Estaba `Descartada`», y el resto de V3 en su sitio |
| 3 | Triaje de una fila que caduca: `m3` de `sdd-roadmap`, fila M3 | RED ❌: «**Descartada**, con Motivo `caducada`» · GREEN ✅: «Propongo **descartarla** con motivo `caducada`, y que salga de `debt.md`» |
| 4 | `sdd roadmap check` y `sdd roadmap causes`: `npx vitest run test/roadmap/` desde `cli/`, sin los lentos | RED: 15 fallos por la sección que aún se exigía (copia en el scratchpad de la sesión) · GREEN: 7 ficheros, 186/186; tras el Minor 3, `debt.test.ts` 47/47 con `workflow-docs.test.ts` |
| 5 | `moon run kit:build kit:copies kit:skill-size` | ✅ `dist/: 254 ficheros` · `Copias al día: 31 ficheros.` · `OK: todos los SKILL.md ocupan menos de 20000 bytes` |
| 6 | Saldo de palabras de lo que se toca (`git show HEAD:<f>` frente al árbol, separando por espacios) | 11.278 → 11.228 con la plantilla; las cuatro skills, 10.575 → 10.564 (`sdd-roadmap` +17, `sdd-end-release` −10, `v3.0.0.md` −17, `sdd-templates` −1) |

Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → cli:typecheck: corrió · cli:test: corrió 2375/2387 (12 saltados) · kit:test-headless: corrió 467/467 — 118 s.

Revisor (Sonnet, `effort-medium`):

- Important 1, `.docs/workflow/usage-guide.md:193` seguía diciendo que lo caducado «pasa a «Descartadas»»: corregido; `workflow-docs.test.ts` en verde.
- Minor 2, la fila de la tabla de equivalencias sin el fichero: corregido, «Discarded: the row leaves `debt.md`».
- Minor 3, el test de «Descartadas» no comprobaba que su fila fechada deja de avisar: corregido, con changelog y `not.toContain('sale en el corte')`.
- Minor 4, derivar `WAITING_ROW_START` de `recentRow`: rechazado; el prefijo busca la fila de `validDebt` (`project.ts`), no la de `agingDebt`, y derivarlo de otra fixture las acopla.

## 5. Tiempo (ligero)

- Estimación: 2 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-09T13:48Z
- Esfuerzo real: <al cerrar>
- Coste de sujetos: <al cerrar>

## 6. Delta de capacidad

### Capacidad: `release-flow`

#### MODIFIED — El corte caduca la deuda en espera

- GIVEN un `CHANGELOG.md` con `## [1.3.0] - 2026-08-01` y `## [1.2.0] - 2026-06-01`; en «En espera», filas del 2026-05-01, 2026-07-01 y 2026-08-15
- WHEN el corte sella la 1.4.0
- THEN las dos primeras de «En espera» salen de `debt.md`, con `caducada` en el cuerpo del commit del corte, y la del 2026-08-15 se queda: solo tiene una release después
- AND `debt.md` no gana una sección «Descartadas»
- AND un `## [1.3.1]` no cuenta, y el resumen de cierre nombra lo caducado
- AND el agente no pregunta

### Capacidad: `roadmap`

#### MODIFIED — `debt.md` tiene una sección por estado, y «Lista» exige evidencia

- GIVEN un `.docs/sdd/steering/debt.md` con `## Por triar` en la línea 3 y el párrafo «Revisar cada lunes» en la línea 4; `## Lista` en la línea 9, con la fila «`libres --planta 2` lista salas de la planta 1», «Causa» `defecto del producto` y «Evidencia» `—` en la línea 12; y `## En espera` en la línea 15, con una fila con «Fecha» `ayer` en la línea 18
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `debt.md: línea 4: prosa en «Por triar»; debt.md solo lleva tablas`, `debt.md: línea 12: fila de «Lista» sin «Evidencia»`, `debt.md: línea 15: «En espera» va antes que «Lista»` y `debt.md: línea 18: «Fecha» «ayer» no es AAAA-MM-DD`, y sale con 1
- AND el orden de las secciones es «Por triar», «En espera» y «Lista»
- AND una cabecera que no es la de su sección da `debt.md: línea <n>: la cabecera de «<sección>» debe ser «<cabecera>»`, con `| Ítem | Origen | Fecha |` en «Por triar», `| Ítem | Causa | Origen | Impacto | Falta | Fecha |` en «En espera» y `| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |` en «Lista»
- AND una sección que falta da `debt.md: falta la sección «<sección>»`, y una «Evidencia» vacía da el mismo fallo que `—`
- AND una sección `## Descartadas` da `debt.md: línea <n>: sección «Descartadas» fuera de la plantilla`: lo descartado sale del fichero
- AND una fila de «Lista» con «Destino» vacío o `—` da `debt.md: línea <n>: fila de «Lista» sin «Destino»`
- AND sin `debt.md` no hay ninguna línea `debt.md:`, y `debt-template.md` calcada sin sus bloques de ayuda escribe `Roadmap válido`

#### MODIFIED — Una fila en espera caduca tras dos releases sin 2.º caso

- GIVEN un `debt.md` con dos filas en «En espera», una con «Fecha» `2026-07-01` en la línea 8 y otra con `2026-08-01` en la línea 9, y un `CHANGELOG.md` con `## [1.4.1] - 2026-10-05`, `## [1.4.0] - 2026-09-01` y `## [1.3.0] - 2026-07-20`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `debt.md: aviso: línea 8: en espera desde 2026-07-01, dos releases sin 2.º caso: caduca`, tras los fallos si los hay, y por los avisos solos sale con 0
- AND la fila del 2026-08-01 no avisa: después solo hay una release, la 1.4.0, porque la 1.4.1 es un patch y no cuenta
- AND una release es una versión `X.Y.0`; sin changelog ninguna fila avisa, y `## [Unreleased]` no cuenta
- AND sin fallos, la última línea es `Roadmap válido`; las líneas salen en este orden: fallos del roadmap, fallos de `debt.md`, avisos del roadmap y avisos de `debt.md`

#### MODIFIED — Cada fila triada de `debt.md` lleva una causa de la lista, y «Lista» un tipo de arreglo

- GIVEN un `debt.md` con una fila de «En espera» con «Causa» `mala suerte` en la línea 8, y en «Lista» una con «Causa» `prueba o molde` y «Arreglo» `más cuidado` en la línea 14, otra con «Causa» `sin determinar` en la línea 15 y otra con «Causa» `prueba o molde` y «Arreglo» `—` en la línea 16
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe, entre otras, `debt.md: línea 8: causa «mala suerte» no admitida: entorno de la máquina, carga o paralelismo, herramienta del kit, regla lejos de su paso, decisión que no era del agente, fusión de registros, prueba o molde, defecto del producto, sin determinar`, `debt.md: línea 14: arreglo «más cuidado» no admitido: comprobación automática, conectar comprobación, mover regla, línea nueva`, `debt.md: línea 15: una fila de «Lista» no admite la causa «sin determinar»` y la misma de arreglo para la 16 con `arreglo «—»`, y sale con 1
- AND una fila de «Lista» con «Causa» `defecto del producto` y «Arreglo» `—` no da fallo de arreglo; una con «Causa» `defecto del producto` y «Arreglo» `más cuidado` da el fallo de arreglo
- AND una celda vacía da el mismo fallo que `—`
- AND una fila de «Lista» cuyo «Ítem» empieza por `**[Feature 0009, 2026-07-20: saldada — …]**` no exige causa ni arreglo
- AND una fila de «Por triar» no lleva causa y no da fallo
- AND `debt-template.md` nombra cada causa y cada arreglo que el check admite

#### Reglas de la capacidad — roadmap

- **Límites**: cada roadmap solo lleva las secciones de su plantilla y solo tablas, salvo «Releases cerradas» en la 2.x; `debt.md`, sus tres secciones y solo tablas. Una fila saldada y una fila de «Patches» del roadmap 2.x duran hasta el corte de la release siguiente. Una fila de «En espera» caduca con dos releases (versiones `X.Y.0` del changelog) posteriores a su fecha, y lo descartado o caducado sale de `debt.md`. Later solo lleva filas `⏳` o `⏸️`. La única línea de texto de `ROADMAP.md` es `Perfil de control: <perfil>`, bajo `## Now`.
- **Avisos**: una línea por fallo del validador, con la regla incumplida. Son avisos, sin fallo: el prefijo de cierre fuera de forma (2.x), la fila de «En espera» que caduca, el roadmap que no se lee cuando están los dos, el id repetido en la columna de id de dos filas, la fila 2.x que apunta a una tarea ya ✅ y dos filas abiertas (`⏳` o `🔄`) que tocan la misma ruta, o una dentro de la carpeta de la otra, sin que una llegue a la otra por una cadena de «tras» (o «antes de», en la 2.x). Los cierres de feature y de patch y `sdd-roadmap` resumen en su mensaje final los fallos que no escribieron; `sdd-end-release` no cierra con ninguno.

### Capacidad: `planning`

#### MODIFIED — El triaje propone el estado de cada ítem de la deuda

- GIVEN el molde `salas-3`, con `ROADMAP.md`; un `CHANGELOG.md` con `## [1.4.1] - 2026-10-05` y `## [1.4.0] - 2026-09-01`; en «Por triar» de `debt.md`, dos filas del informe de QA `docs/qa/2026-10-12-informe.md`: «La exportación a CSV pierde las tildes desde la 1.4.2» y «`salas libres --planta 2` lista también salas de la planta 1»; y en «En espera», «Las reservas de más de 8 h no avisan al responsable», del 2026-07-01, con «Falta» `2.º caso`, con `## [1.3.0] - 2026-07-20` también en el changelog. En el molde, la exportación conserva las tildes y `node src/app.js libres --planta 2` devuelve `Norte (planta 1)`
- WHEN el usuario pide «Tria lo que hay por triar en la deuda.»
- THEN `sdd-roadmap` no propone la fila del CSV en «Lista»: como no se reproduce, la propone en «En espera» con «Falta» `reproducirlo` y «Causa» `sin determinar`
- AND propone la fila de la planta en «Lista», con «Causa» `defecto del producto`, «Evidencia» `node src/app.js libres --planta 2` → `Norte (planta 1)` y un «Destino» no vacío: el id de una fila de Now o Next, nueva o existente, o `sin fila`
- AND propone descartar la fila de las 8 h, que `roadmap check` avisa que caduca, con el motivo `caducada`: una fila descartada sale de `debt.md`, con su motivo en el cuerpo del commit
- AND en `pair` y `delegate` no escribe en `debt.md` ni en `ROADMAP.md` hasta que el usuario decide, como en el resto de entradas; con la decisión, o con «decide tú», mueve cada fila que cambia de estado a la tabla de ese estado, con la «Fecha» del día, y deja lo decidido en el cuerpo del commit; una fila que sigue en su estado conserva su «Fecha»
- AND en `unattended`, lo que no puede decidir se queda en «Por triar»
- AND el 2.º caso de una fila descartada, cuyo primer caso solo está en su ticket, entra en «Por triar» como fila nueva, con los dos orígenes; y el `**Salda:**` de un brief solo nombra filas de «Lista»
- AND con `ROADMAP.md` y sin `debt.md`, el triaje crea `debt.md` calcando `debt-template.md`

#### MODIFIED — El segundo caso se busca por causa

- GIVEN el molde `salas-3-cause`: en «En espera», «Las salidas de `DRY_RUN=1` no aparecen en `out/`», con «Falta» `2.º caso`, cuyo ticket mide una ruta de 152 caracteres descartada en silencio por `out_path` y se resuelve con un `RUNS_DIR` en `D:\r`; en «Por triar», «Copiar el molde de una campaña falla con `ENOENT` en una carpeta que existe», cuyo ticket mide una ruta de más de 260 y se resuelve igual; «`/tmp` no existe en la sesión de Git Bash…», que se resuelve con `mkdir -p /tmp`; y dos filas que se resuelven con `relanza`: un `pnpm install` con la red caída y un test que agota su tiempo con la máquina cargada
- WHEN el usuario pide «Tria lo que hay por triar en la deuda.»
- THEN `sdd-roadmap` propone una sola fila en «Lista» que junta las dos primeras, con «Causa» `entorno de la máquina`, los dos tickets en «Origen» y en «Evidencia», el `RUNS_DIR` corto en «Remedio temporal» (no `ninguno`) y «Arreglo» `comprobación automática`, porque el lanzador puede medir la ruta al arrancar; no `línea nueva`
- AND la fila del `/tmp` no cuenta como 2.º caso, aunque comparte la causa: otro cambio y otro remedio son otro problema; se propone aparte, en «En espera» con «Causa» `entorno de la máquina`, o para descartar
- AND las dos filas de `relanza` no se juntan: un remedio de reintento no es criterio
- AND el 2.º caso se busca en toda la deuda, también entre las filas de la tanda que se tría, y un hallazgo con el mismo mecanismo y otra categoría se reclasifica y cuenta

### Capacidad: `migration`

#### MODIFIED — La migración a v3.0.0 lleva la deuda a `debt.md` sin inventar celdas

- GIVEN una «Deuda técnica» 2.x con una fila `**Actuar** → 0022` cuyo «Ítem» enlaza su ticket, una `**Actuar** → sin fila` sin evidencia, una `**Esperar 2.º ticket**`, una `**Descartada**: duplica la 0018`, una con destino `versión siguiente`, una saldada posterior a la última release cerrada, una `**Actuar** → 0030 · causa: prueba o molde · arreglo: mover regla`, y una `**Esperar 2.º ticket** · causa: fusión de registros — falta reproducirlo`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN `.docs/sdd/steering/debt.md` tiene la primera en «Lista» con destino 0022 y el ticket como evidencia, y la saldada en «Lista» con su prefijo `**[… saldada …]**` intacto
- AND la de `sin fila` y la de `versión siguiente` están en «Por triar», la de `**Esperar**` en «En espera», y la `**Descartada**` no está en `debt.md`: sigue en el `roadmap.md` 2.x que guarda git
- AND cada «Fecha» es la del commit que añadió su fila al roadmap, y la tabla dice de dónde salió
- AND `sdd roadmap check --path .docs/sdd` escribe `Roadmap válido`
- AND la de la 0030 tiene «Causa» `prueba o molde` y «Arreglo» `mover regla`, y la de `fusión de registros` tiene esa «Causa» y «Falta» `reproducirlo`, sin las marcas
- AND las que no traen causa o arreglo los llevan propuestos en la tabla, marcados como propuesta, leyendo su «Ítem»; si el dev-lead rechaza la causa de una, esa fila va a «Por triar»
- AND el «Remedio temporal» sale de `· remedio:`; sin él, es `—` en una fila de un caso, y la tabla lo pregunta en una con dos o más enlaces

### Capacidad: `cli`

#### MODIFIED — `sdd roadmap causes` agrupa la deuda por causa y dice qué sigue abierto

- GIVEN el `debt.md` y la `releases/v1.3.0/retro.md` del requisito «Cada corte deja un repaso de la deuda por causa» de `project-retro`, más una fila de «En espera» con `regla lejos de su paso` y, en la retro anterior, «La fila cerrada» abierta desde `1.3.0`, que ya no está en «Lista»
- WHEN se ejecuta `node sdd.js roadmap causes --path .docs/sdd --version 1.4.0`
- THEN escribe `## Repaso por causa` y la tabla `| Causa | En espera | Lista |`, con `| regla lejos de su paso | 1 | 2 |` antes que `| defecto del producto | 0 | 1 |`, ordenada por «Lista» de mayor a menor y, a igualdad, por el nombre de la causa, y sale con 0
- AND después escribe `## Abiertas en «Lista»` y la tabla `| Ítem | Causa | Casos | Destino | Abierta desde |`, por `Abierta desde` ascendente y, a igualdad, en el orden de `debt.md`, con `| El anuncio sale 4 de 6 | regla lejos de su paso | 2 | sin fila | 1.2.0 |` primero y `1.4.0` en las otras dos
- AND la última línea es `Cerradas desde la 1.3.0: 1`
- AND una fila con prefijo `**[… saldada …]**` no cuenta como abierta ni en las causas
- AND un «Ítem» `a \| b [x](y)` en `debt.md` y en la tabla de la retro anterior sale igual y hereda su `Abierta desde`
- AND con `releases/v1.1.0/retro.md`, `releases/v1.10.0/retro.md`, una `releases/v1.3.0/retro.md` sin la sección `## Abiertas en «Lista»`, `releases/draft/retro.md` y `releases/v1.4.0/retro.md`, y `--version 1.11.0`, la retro anterior es la `v1.10.0`, y con `--version 1.4.0`, la `v1.1.0`, y la última línea nombra esa versión
- AND sin retro anterior válida, no hay esa línea y todas salen abiertas desde la versión dada
- AND una retro calcada de `retro-template.md` con esta salida se lee como retro anterior
- AND con `--json` escribe `{"causes":[…],"open":[…],"closedSinceLast":1}`; sin retro anterior válida, `"closedSinceLast":null`
- AND sin filas en «En espera» ni en «Lista» escribe `Sin deuda triada` y sale con 0
- AND sin `.docs/sdd/steering/debt.md` escribe en stderr `roadmap causes: no existe steering/debt.md` y sale con 2; sin `--version`, o con `--version 1.x`, escribe `--version debe ser X.Y.Z` y el uso, y sale con 2
- AND `--project-root D:\code\reservas` hace lo mismo que `--path D:\code\reservas\.docs\sdd`, y con las dos a la vez escribe `--path y --project-root no van juntas` y el uso, y sale con 2
