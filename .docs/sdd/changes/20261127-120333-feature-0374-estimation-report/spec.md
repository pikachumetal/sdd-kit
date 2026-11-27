---
id: 20261127-120333-feature-0374-estimation-report
feature: 0374
title: sdd estimation report — el tiempo de un proyecto por persona, carril, fase y versión del kit
mode: full
status: approved
created: 2026-11-27
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-27
---

# Spec — sdd estimation report

🦆 Hoy, para ver en la retro de una release quién se desvía y en qué fase, alguien escribe un script contra `estimation-log.md` y los `timing.json`, y uno de esos scripts dio a quien migró todos los cierres de la 2.x. Con esta feature, `sdd estimation report --release 3.1.0` saca tablas listas: «Ana · 12 cierres · real 1,4 h · ratio 1,3 · 8 por encima de lo estimado», y por fase «implementación · Ana · 5 · 0,8 h · ratio 1,6». Cada cierre cuenta para quien lo escribió de verdad (el primer commit que lo añadió, nunca una migración), y cada fila lleva la versión del kit que marcaba el proyecto. La retro de la release pega esa salida en lugar de hacer cuentas a mano.

Validación: agente — es un verbo de la CLI con tests sobre un repo git de prueba y una edición de skill con su batería; validación en campo (`validation.mode: field`).

## Capacidades

- Modificadas: `estimation` — requisitos nuevos del informe (atribución, versión del kit, agregados, fases, filtro por release) y sus reglas
- Modificadas: `cli` — la ayuda lista `estimation log|report`, y `--project-root` vale en `estimation report`
- Modificadas: `project-retro` — la estimación de la retro pega la salida del informe

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (verbo `sdd estimation report` y su salida, que pega `retro.md`), MODIFIED (`cli`), tres capacidades (`estimation`, `cli`, `project-retro`) · tamaño: ~300 líneas en 8 ficheros
- Dominio (sonnet): si «El informe atribuye cada cierre…» y «…la versión del kit…» responden a «quién se desvía y en qué fase» sin atribuir a quien migró, y si «Con `--release`…» cuadra con el momento del corte (changelog sellado, sin tag) en que corre `sdd-retro` (señal: contrato público + tres capacidades)
- Técnica (sonnet): si un `git log --no-renames --diff-filter=AM` con el commit más antiguo no migratorio da el autor correcto con `git mv`, carpetas renumeradas y merges, y si las medianas de «El informe da las fases por persona» filtran los mismos `timing.json` que «Tiempos por fase» del log (señal: MODIFIED + contrato público)
- Mínimo razonable: solo técnica — deja sin mirar el encaje del filtro con el corte de `sdd-end-release` y si las tablas responden a la pregunta de la retro
```

1. Enfoque: módulo nuevo `cli/src/estimation/report.ts` que reutiliza `readRows`, el recorrido de `addedCommits` y la lectura de `timing.json`, frente a añadir secciones a `estimation log` y a un script del proyecto (ver Approach).
2. Filtro `--release <X.Y.Z>` con la regla de release de `releases.ts` (tag y, sin tag, fecha del encabezado sellado); sin él, todo el proyecto — el dev-lead lo dejó en mis manos: «ni idea macho estas cosas son tecnicas tuyas tu tienes qu essaber responderlas».
3. Errores del verbo (código 1, no son avisos): `--release` con una versión que no tiene encabezado con fecha en el changelog → `La versión <X.Y.Z> no está con fecha en el changelog (<ruta>): nada que informar.`; `--release` sin changelog → `Sin changelog en <ruta>: --release necesita las versiones del changelog.` Una tabla vacía se leería como «release sin cierres».
4. Commit de migración = asunto que empieza por `chore(sdd): migrar al kit` — es el literal del paso 6 de `sdd-upgrade`, fijo desde el 2026-10-18 (`2aeab4d00`). Una migración anterior con otro asunto no atribuye mal: solo la 3.0.1 movió cierres de sitio, y un commit que no añade el fichero nunca es el más antiguo. Un commit que mezcla migración y trabajo propio cuenta como migración: decide el asunto.
5. La clave de cada cierre es `<carpeta>/<fichero>` sin el padre `specs/` o `changes/`, como en `addedCommits`: el `git mv` de la migración no crea un cierre nuevo. Una carpeta renumerada cuenta desde el commit que la renombró (el mismo límite que ya tiene la tabla de releases). Los merge commits no cuentan: `git log` sin `-m` no lista sus ficheros, y el fichero sale en el commit de la rama que lo añadió.
6. Autor con `%aN`, que respeta `.mailmap` — la misma persona con dos correos cuenta una vez si el proyecto lo declara.
7. Literales `sin atribuir` (el commit más antiguo es de migración, o sin git) y `sin marcador` (sin `sdd-kit.json` en ese commit, sin `version`, cierre `sin atribuir`, o sin git); van los últimos en su tabla — una celda vacía no dice por qué.
8. El marcador se lee en `.docs/sdd/sdd-kit.json`, su sitio desde la v0.2.0 (`migrations/v0.2.0.md`); la 2.x ya vivía en `.docs/sdd/`. Es la versión **marcada**, no la cargada: con el plugin actualizado y el proyecto sin migrar, la columna dice la del proyecto. La cabecera lo dice: `Versión marcada del kit`.
9. El carril de la fila es su `Tipo`, el mismo de la tabla del log (`feature`, `patch`, `hotfix`, `docs`…).
10. Columnas con los nombres del log: «Real (h)» es la mediana del real, «Ratio» la mediana de real/estimado y «Real > est» cuántas filas tienen ratio > 1 (la propuesta del prompt: «cuántas pasan de lo estimado»; el ±30 % de `sdd-archive` mide otra cosa, la causa de un cierre). Una fila sin estimado o `post hoc` cuenta en n y en el real, no en las otras dos — igual que el log.
11. Números con `formatNumber` del log: hasta dos decimales, sin ceros finales, punto decimal.
12. Con n < 5 la celda n lleva `*` y la tabla acaba en `* n < 5: mediana orientativa.` — el log ya trata como orientativo lo que tiene pocas muestras, y una mediana de un cierre junto a un nombre se lee como juicio.
13. Fases: las de los `timing.json` de las carpetas que tienen fila (la fila da la persona y la release), leídos con la misma función que «Tiempos por fase» del log: versión 1, `measured` y `withinMargin`, y solo fases con `measured: true`. «Real (h)» es la mediana de `agentSeconds + execSeconds`; «Ratio», la mediana de ese real entre `estimateHours`, solo en las fases con estimado. `waitSeconds` y `gateSeconds` no entran.
14. Orden: tablas de persona, carril, versión marcada y fase × persona; filas por nombre, salvo las versiones, por SemVer (`3.9.0` antes de `3.10.0`); las fases en el orden `apertura`, `implementación`, `revisión`, `cierre`.
15. Sin cierres: cada tabla se sustituye por `Sin cierres.` (con `--release`, `Sin cierres en la <X.Y.Z>.`), y sale con 0.
16. Con `--release`, si hay cierres en `sin publicar` o `sin fecha`, aviso por stderr: `Fuera de toda release: <n> cierres sin publicar o sin fecha; no cuentan en la <X.Y.Z>.` — en el corte, un cierre fusionado tras sellar no debe desaparecer sin decirlo.
17. `--project-root` vale como `--root`, con el error de exclusión de la capacidad `cli` — así lo exige su requisito para todo verbo que sitúa el proyecto.
18. La salida va por stdout, en Markdown, sin escribir ningún fichero.
19. Sin git (la carpeta no está en un repositorio, o no hay binario `git`), el verbo no falla: avisa una vez por stderr (`Sin historial de git en <ruta>: persona y versión salen sin atribuir y sin marcador.`) y saca las tablas.
20. `retro-template.md` cambia la línea «Agregado de la release» por `<salida de sdd estimation report --release X.Y.Z, sin tocar>`, como ya hace con `sdd roadmap causes` — la forma de un output va en la plantilla (ADR 0014). La retro lleva nombres de personas a `releases/vX.Y.Z/retro.md`, que se commitea: es lo que pide la fila («que la retro vea quién se desvía»), y el lector es el equipo que hace el corte. Si el verbo sale con error, el bloque de ayuda de la plantilla manda escribir `Sin informe: <su mensaje>`; ese camino no tiene escenario de sujetos (lo cubre solo el literal de la plantilla, sin medir): medirlo costaría otro molde por un caso que el corte no produce con changelog sellado.
21. `sdd-templates/SKILL.md` no gana fila para el verbo: `sdd-retro` lo nombra con sus argumentos y la tabla de verbos de `sdd-templates` no tiene margen; si un test exige la fila, la pongo y lo digo como desvío.
22. Batería de `sdd-retro`: escenario nuevo `r7` (corte con la estimación pedida) y fila de rúbrica `R10`: `retro.md` no lleva literal la salida de `sdd estimation report --release 1.4.0`, o hace cuentas a mano sobre `estimation-log.md`.
- Repaso de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` → 5 requisitos añadidos en `estimation` y sus reglas, 2 sustituidos en `cli`, 1 añadido en `project-retro`, sin rechazos. Los «Agregado de la release» de `releases/v0.2.0` a `v1.1.0/feedback.md` son artefactos de evento: no se tocan.
- Descuadre que no toco: «Reglas» de `project-retro` dice «tope de 700 palabras» y `word-budget.test.ts` fija 622; lo manda el test, y la regla queda como deuda fuera de esta feature.
- Política de modelos (solo en `delegate`): revisores de la spec, dominio y técnica en Sonnet, effort medium (la spec no toca roles ni reglas de negocio) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de `sdd-retro` en Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` (3)

### Hallazgos de la review

- **Aceptado** — (dominio 1, técnica 8; Crítico) `--project-root` sin declarar en `report` → decisión 17 y `MODIFIED` de «`--project-root` vale en todo verbo que sitúa el proyecto».
- **Aceptado** — (técnica 1; Crítico) la clave con `--no-renames` tras `git mv` → decisión 5 y GIVEN con la migración. Cambia tu decisión de atribución en un caso: si el commit más antiguo del fichero es de migración (historia aplastada), el cierre sale `sin atribuir` y no se toma la primera `M` posterior, que sería de quien corrigió un typo. Ver «Decisiones tomadas con el dev-lead».
- **Aceptado** — (técnica 2) marcador 2.x en `docs/sdd/` → decisión 8.
- **Aceptado** — (técnica 3) `--release` sin cifras → GIVEN con tres cierres y n esperado.
- **Aceptado** — (técnica 4 y 6) qué `timing.json` entran → decisión 13 y GIVEN con las cuatro fases, `measured: false` y `withinMargin: false`.
- **Aceptado** — (técnica 5) formato y orden → decisiones 7, 11 y 14.
- **Aceptado** — (técnica 7) sin filas y sin changelog → decisiones 3 y 15; el commit mixto, decisión 4.
- **Aceptado** — (técnica 10) API interna que cambia → Approach: la salida del log no cambia y sus tests siguen en verde; `.mailmap` sale del THEN y queda en la decisión 6.
- **Rechazado** — (técnica 9) THEN de la ayuda propia de `report` → la ayuda por verbo la genera la CLI desde `summary` y `options` para todos; no es comportamiento nuevo.
- **Aceptado** — (dominio 2) «Reglas de la capacidad» → bloque con los valores completos de «Dónde viven los datos» y «Avisos»; los errores del verbo, aparte (decisión 3).
- **Rechazado** — (dominio 3) nombres de personas en `retro.md` → es el propósito de la fila; corregida la razón de descartar B en el Approach, que era incoherente, y anotado en la decisión 20.
- **Aceptado** — (dominio 4) la fase sin desviación → columna «Ratio» por fase y persona (decisión 13).
- **Aceptado** — (dominio 5) «Pasan» → «Real > est», con el porqué en la decisión 10.
- **Aceptado** — (dominio 6) versión marcada frente a cargada → decisión 8 y cabecera `Versión marcada del kit`.
- **Aceptado** — (dominio 7) cierres fuera de la release en el corte → decisiones 3, 15 y 16.
- **Aceptado** — (dominio 8) la retro cuando el verbo falla → THEN en `project-retro` y fila R10.
- **Aceptado** — (dominio 9) `sin atribuir` sin versión y n pequeño → decisiones 7 y 12.
- **Aceptado** — (dominio 10) R10 en Scope, nombres de columna del log; el 700 frente a 622, nombrado arriba y fuera.

Dos Críticos aceptados: segunda ronda, un revisor Sonnet con los siete puntos sobre la spec corregida.

- **Rechazado** — (2.ª ronda 1; Crítico) la 2.x en `docs/sdd/` quedaría `sin atribuir` → la 2.x vive en `.docs/sdd/` desde la v0.2.0 (`migrations/v0.2.0.md`); solo la 3.0.1 movió `specs/` a `changes/` dentro de esa raíz. Retirado además el respaldo `docs/sdd/sdd-kit.json` de la decisión 8, que aceptó la técnica 2 sin base.
- **Aceptado** — (2.ª ronda 2) reglas que faltaban → «Idioma de los nombres», «Límites» y «Regla ante conflicto» con su valor completo; un `--release` mal formado no se valida aparte: no está en el changelog y sale con 1.
- **Rechazado** — (2.ª ronda 3) migraciones anteriores con otro asunto → no añadían cierres, así que nunca son el commit más antiguo (decisión 4).
- **Rechazado** — (2.ª ronda 4) un cierre creado antes del sellado y fusionado después → es la regla de la tabla de releases del log, y en el corte sellar y escribir la retro van en el mismo commit, sin merges entre medias.
- **Aceptado** — (2.ª ronda 5) la rama de error de la retro → la regla va en el bloque de ayuda de `retro-template.md`, no en la skill; sin escenario, dicho en la decisión 20.
- **Aceptado** — (2.ª ronda 6, 7, 8, 9) orden SemVer (decisión 14), criterio de «sin git» (decisión 19) con su GIVEN, caso de cinco cierres, y el cierre fuera del margen que cuenta en las demás tablas, con el literal del aviso.
- **Aceptado** — (2.ª ronda 10) `sdd-templates` medido.

### Decisiones tomadas con el dev-lead

- Es un verbo de la CLI, no un script del proyecto — «si ok» (2026-11-27, a la propuesta de la sesión de coordinación)
- Atribución: primer autor de `walkthrough.md`/`patch.md` con `git log --no-renames --diff-filter=AM`, sin commits de migración; si solo hay commits de migración, `sin atribuir` — «1». Precisión tras la review, aprobada en el gate («1», 2026-11-27): si el commit más antiguo es de migración, `sin atribuir`, aunque haya `M` posteriores de otra persona.
- Versión del kit: la de `sdd-kit.json` en el commit que atribuye el cierre, no la de la fecha de la fila — «1»
- Medidas: tablas por persona, carril y versión con n, mediana del real, mediana de real/estimado y cuántas pasan de lo estimado; y una tabla fase × persona — «1»

## Intent

Hoy el tiempo de un proyecto solo se ve agregado en `estimation-log.md` (global, por tipo, por release y por fase), sin persona ni versión del kit. Para saber quién se desvía y en qué fase, la sesión de coordinación escribió scripts sueltos, y uno atribuyó a quien migró todos los cierres de la 2.x porque usaba el último autor de cada walkthrough. El éxito: `sdd estimation report`, corrido sobre un repo migrado de la 2.x con cierres de dos personas, atribuye cada cierre de la 2.x a quien lo escribió y da por fase medianas que coinciden con sus `timing.json`; y la retro de una release pega su salida. Anti-objetivo: un informe que atribuye a la persona equivocada o que mezcla cierres de otra release, aunque saque tablas.

## Scope

- Entra: el verbo `sdd estimation report [--root|--project-root <proyecto>] [--release <X.Y.Z>]` en `cli/src/estimation/`, con salida en tablas Markdown por stdout; sus tests Vitest, con un repo git de prueba migrado de la 2.x; la ayuda de la CLI; el paso 4 de `sdd-retro` y la sección «Estimación y action items» de `retro-template.md`; el escenario `r7` y la fila `R10` de la batería de `sdd-retro`.
- No entra: el ticket automático en un cierre desviado (0375); cambiar `estimation-log.md` o su generador; `gateSeconds`; persona en `estimation-log.md`; tiempos de fase para cierres sin `timing.json` (toda la 2.x); el tope de 700 de «Reglas» de `project-retro`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La estimación de la retro con «the release's numbers from `estimation-log.md`» | `skills/sdd-retro/SKILL.md:42` | Scope: el paso pega la salida de `sdd estimation report --release <version>`; saldo de palabras ≤ 0 |
| «los números salen de `estimation-log.md`» y «**Agregado de la release**: estimado <X> h · real <Y> h (ratio <Z>)» | `skills/sdd-templates/templates/retro-template.md:21,23` | decisión 20: `<salida de sdd estimation report --release X.Y.Z, sin tocar>` |
| La lista de verbos de `--help` | `capabilities/cli.md`, «La CLI se ejecuta con Node y sin dependencias» | delta, `MODIFIED` |
| La lista de verbos con `--project-root` | `capabilities/cli.md`, «`--project-root` vale en todo verbo que sitúa el proyecto» | delta, `MODIFIED` |

- Se mantienen y no cambian: la oferta de la estimación de `sdd-end-release:34` (predicado `estimation-log.md`, sigue valiendo) y su racionalización de `:59`.
- Filas que implementa: 0374 → `ROADMAP.md:12`, que marca el cierre; nada más la nombra: comprobado con `grep -rln 0374 --include=*.md` (solo `ROADMAP.md` y artefactos viejos de otras features).

**Una pieza entra, otra sale**: entra el verbo; sale la cuenta a mano de la retro (la línea «Agregado de la release» de la plantilla y la lectura del log en `sdd-retro`).

## Approach

- **A. Módulo nuevo `report.ts` junto a `log.ts`** — un verbo más en `estimation/verbs.ts`; reutiliza `readRows` (filas y ratio), el `git log --no-renames` de `addedCommits` ampliado con autor y asunto, `releaseLabel` para el filtro y la lectura validada de `timing.json` de `phases.ts`. Cuesta exportar esas piezas sin cambiar la salida del log.
- **B. Secciones nuevas en `estimation log`** — sin verbo nuevo, pero el log es la serie entera y se regenera en cada merge con conflicto: el filtro por release no cabe, y una tabla por persona cambiaría con cada cierre de cualquiera, ensuciando cada merge.
- **C. Script del proyecto** — descartado por el dev-lead: «si ok» a la propuesta de verbo de la CLI.
- Elegido: A — un verbo determinista y probado, sin tocar lo que ya calibra el log.

Lo que fija A:
- Un solo `git log --no-renames --diff-filter=AM --format=<sha, autor, asunto> --name-only -- changes specs` sobre la carpeta de documentos, que da para cada `<carpeta>/<walkthrough.md|patch.md|hotfix.md>` su commit más antiguo; si es de migración, `sin atribuir`.
- La versión del kit de cada commit, con un solo proceso `git cat-file --batch`.
- `--release` filtra las filas con la misma etiqueta que la tabla de releases del log; las fases, por la carpeta de las filas filtradas.
- Las funciones que se exportan o amplían (`addedCommits`, `releaseLabel`, la lectura de `timing.json`) no cambian la salida de `estimation log`: `cli/test/estimation/*` y `releases.slow.test.ts` siguen en verde sin tocarlos.

## Dónde se prueba

- Atribución, migración, versión del kit y filtro por release: `cli/test/estimation/report.slow.test.ts`, con un repo git temporal como `releases.slow.test.ts`.
- Agregados, n < 5, formato, sin cierres y medianas de fase: `cli/test/estimation/report.test.ts`, sobre `project()` de `helpers.ts` sin git (persona `sin atribuir`).
- Ayuda y `--project-root`: `cli/test/cli.test.ts`, como la lista de verbos y los alias actuales.
- `sdd-retro` pega la salida: batería de `sdd-retro`, escenario `r7` (RED con la skill vigente, GREEN con la editada).

## Términos y ADR

- Términos resueltos: **commit de migración** — el de asunto `chore(sdd): migrar al kit vX.Y.Z`, que no atribuye un cierre. **Versión marcada del kit** — la `version` de `sdd-kit.json`, no la del plugin cargado.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `estimation`

#### ADDED — El informe atribuye cada cierre a quien lo escribió

- GIVEN un repo git donde Ana commitea `.docs/sdd/specs/20260910-100000-feature-0010-a/walkthrough.md` y Luis commitea `.docs/sdd/specs/20260912-100000-patch-0011-b/patch.md`, los dos con bloque de tiempo; después Pepe mueve `specs/` a `changes/` con `git mv` en el commit `chore(sdd): migrar al kit v3.0.1`, y Luis corrige un typo de `changes/20260910-100000-feature-0010-a/walkthrough.md`
- AND un cierre `changes/20260915-100000-feature-0012-c/walkthrough.md` que entra por primera vez en ese mismo commit de migración
- WHEN se ejecuta `sdd estimation report --root <proyecto>`
- THEN la tabla por persona tiene `Ana` con n `1 *` y `Luis` con n `1 *`, y `sin atribuir` con n `1 *`, la última; `Pepe` no aparece
- AND el autor es el del commit más antiguo que añade o modifica `<carpeta>/<fichero>`, sea en `specs/` o en `changes/`; si ese commit es de migración (asunto que empieza por `chore(sdd): migrar al kit`), el cierre es `sin atribuir`

#### ADDED — El informe da la versión del kit de cada cierre

- GIVEN el repo anterior, con `.docs/sdd/sdd-kit.json` a `version` `2.3.4` en los commits de Ana y Luis y a `3.0.1` tras la migración, y un cuarto cierre `changes/20261110-100000-feature-0020-d/walkthrough.md` de Ana commiteado con el marcador a `3.0.1`
- WHEN se ejecuta `sdd estimation report --root <proyecto>`
- THEN la tabla `| Versión marcada del kit | …` tiene `2.3.4` con n `2 *`, `3.0.1` con n `1 *` y `sin marcador` con n `1 *` (el cierre `sin atribuir`), en ese orden
- AND la versión es la de `.docs/sdd/sdd-kit.json` en el commit que atribuye el cierre; sin el fichero, o sin `version`, `sin marcador`
- AND la tabla de versiones va por SemVer: `3.9.0` antes de `3.10.0`, y `sin marcador` al final

#### ADDED — El informe agrega por persona, carril y versión del kit

- GIVEN un proyecto fuera de todo repositorio git con dos cierres `feature` con estimado 1 h y real 1 h, y estimado 2 h y real 3 h, y un `patch` con estimado `0,5 h (post hoc)` y real 1 h
- WHEN se ejecuta `sdd estimation report --root <proyecto>`
- THEN avisa una vez por stderr `Sin historial de git en <ruta>: persona y versión salen sin atribuir y sin marcador.` y sale con 0
- AND la tabla por carril es `| Carril | n | Real (h) | Ratio | Real > est |`, con `| feature | 2 * | 2 | 1.25 | 1 |` y `| patch | 1 * | 1 | — | 0 |`, y acaba en `* n < 5: mediana orientativa.`
- AND «Real (h)» es la mediana del real, «Ratio» la mediana de real/estimado y «Real > est» cuántas filas tienen ratio > 1; una fila sin estimado o `post hoc` cuenta en n y en el real, no en las otras dos
- AND hay una tabla igual por persona (`| Persona | …`) y otra por versión (`| Versión marcada del kit | …`); aquí las dos tienen una sola fila, `sin atribuir` y `sin marcador`, con n `3 *`
- AND con tres cierres `feature` más (real 1 h, estimado 1 h), la fila es `| feature | 5 | 1 | 1 | 1 |`, sin `*`; si ninguna fila de la tabla tiene `*`, no hay nota
- AND sin ningún cierre, cada tabla se sustituye por `Sin cierres.` y el verbo sale con 0

#### ADDED — El informe da las fases por persona

- GIVEN, sin git, dos cierres con `timing.json` versión 1, `measured` y `withinMargin`: en el primero `implementacion` mide `agentSeconds` 1800 + `execSeconds` 1800 con `estimateHours` 0,5, y `revision` tiene `measured: false`; en el segundo `implementacion` mide 3600 + 1800 con `estimateHours` 1, y `apertura` mide 600 + 0 sin estimado
- AND un tercer cierre con un `timing.json` `withinMargin: false`, y un cuarto sin `timing.json`
- WHEN se ejecuta `sdd estimation report --root <proyecto>`
- THEN la tabla `| Fase | Persona | n | Real (h) | Ratio |` tiene, en este orden, `| apertura | sin atribuir | 1 * | 0.17 | — |` y `| implementación | sin atribuir | 2 * | 1.25 | 1.75 |`, y ninguna fila de `revisión`
- AND «Real (h)» es la mediana de agente + ejecución de cada cierre (1 h y 1,5 h → 1,25); «Ratio», la mediana de ese real entre `estimateHours` en las fases con estimado (2 y 1,5 → 1,75); `waitSeconds` y `gateSeconds` no cuentan
- AND el `timing.json` fuera del margen no entra, con el aviso `timing.json fuera del margen, fuera de la tabla de fases: <carpeta>.`, y su cierre sigue contando en las tablas de persona, carril y versión (n `4 *` en cada una)
- AND las fases van en el orden `apertura`, `implementación`, `revisión`, `cierre`, y dentro de cada una las personas por nombre
- AND sin ningún `timing.json` válido, la tabla se sustituye por `Sin datos: ninguna tarea tiene timing.json.`

#### ADDED — Con `--release` solo cuentan los cierres de esa release

- GIVEN un repo git con `CHANGELOG.md` que tiene `## [3.1.0] - 2026-11-20` y `## [3.0.5] - 2026-11-18`; el cierre `0030` (`created: 2026-11-17`) commiteado antes del tag `v3.0.5`; el `0031` (`created: 2026-11-19`) después del tag; y el `0032` (`created: 2026-11-22`) después
- WHEN se ejecuta `sdd estimation report --root <proyecto> --release 3.1.0`
- THEN las tablas cuentan solo `0031`: la tabla por carril tiene n `1 *`
- AND escribe por stderr `Fuera de toda release: 1 cierres sin publicar o sin fecha; no cuentan en la 3.1.0.` y sale con 0
- AND con `--release 3.0.5` cuenta solo `0030`, y sin `--release` los tres
- AND con `--release 9.9.9` sale con 1 y escribe `La versión 9.9.9 no está con fecha en el changelog (<ruta>): nada que informar.`; sin changelog, sale con 1 y escribe `Sin changelog en <ruta>: --release necesita las versiones del changelog.`
- AND una release sin cierres saca `Sin cierres en la <X.Y.Z>.` en cada tabla y sale con 0

#### Reglas de la capacidad — estimation

- **Idioma de los nombres**: columnas, etiquetas y avisos del log y del informe en castellano, como las plantillas que lee; las claves de `timing.json` en inglés y sus nombres de fase sin tilde, como contrato que leen otros verbos; en las tablas, la fase con tilde (`implementación`, `revisión`).
- **Límites**: la ventana de una rama sin transcripts propios va de la primera entrada de su reflog hasta su último merge en `merge.into`, la creación de otra rama local sin transcripts propios o ahora, lo que llegue antes. Un hueco sin actividad pasa de 60 min. Las fases suman el reloj con un margen de 60 s o del 1 % del reloj, lo que sea mayor. En el informe, un grupo con menos de 5 cierres lleva su mediana como orientativa.
- **Regla ante conflicto**: con un documento en su ruta 3.0.0 y en la 2.x a la vez (`steering/estimation.md` y `estimation.md`, `CHANGELOG.md` y `<docs>/changelog.md`), manda la 3.0.0 y el verbo avisa por stderr del otro, también `estimation report` con `--release`. Las carpetas de artefactos (`changes/` y `specs/`) se leen las dos. Con el mismo `<carpeta>/<fichero>` en las dos, el autor es el del commit más antiguo de cualquiera de ellas.
- **Dónde viven los datos**: los bloques de tiempo de `walkthrough.md` (§2) y de `patch.md` (§5) de cada carpeta de artefactos, con la estimación previa del patch y su hora de inicio en §5, escritas antes del fix, y la marca `post hoc` si la estimación llega en el commit de cierre; el desglose por fase, en `timing.json` de cada carpeta de artefactos, y el estimado de cada fase, en su `plan.md`; el esfuerzo real y las esperas, de los transcripts de Claude Code; para una rama sin transcripts propios, de los transcripts de los demás worktrees del repo, entre la creación de la rama (su reflog) y su último merge en `merge.into`; el log, generado, en la carpeta de `estimation.md`; la persona y la versión marcada del kit de cada cierre, del historial de git (autor del commit más antiguo de su artefacto y `sdd-kit.json` en ese commit); el informe, solo por stdout.
- **Avisos**: por stderr y sin cambiar el código de salida: un bloque de tiempo sin esfuerzo real legible (la fila se excluye), un log mantenido a mano que se sobrescribe, un documento presente en sus dos rutas, un `timing.json` fuera del margen (al escribirlo y, con la tarea fuera de la tabla, al generar el log o el informe), un informe sin historial de git y, con `--release`, los cierres que no caen en ninguna release. La línea `- Medición: por ventana …` no es un aviso: es parte de la salida, por stdout. Los errores de `--release` (versión sin fecha en el changelog, o sin changelog) no son avisos: salen con 1.

### Capacidad: `cli`

#### MODIFIED — La CLI se ejecuta con Node y sin dependencias

- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish|causes`, `id next|claim`, `merge`, `estimation log|report`, `init`, `upgrade`, `session tokens`, `watch subagent|command`, `hook session-start|session-end`, `task start|done|brief`, `review package|comments`, `workspace`, `ledger rulings`, `lock run`) con una línea de ayuda, y sale con 0
- AND `cli/package.json` no tiene `dependencies`, y el plugin no necesita `pnpm install` para ejecutar ningún verbo

#### MODIFIED — `--project-root` vale en todo verbo que sitúa el proyecto

- GIVEN un proyecto en `D:\code\reservas` con `.docs/sdd/`
- WHEN se ejecuta `node sdd.js roadmap check --project-root D:\code\reservas`, `capability index --project-root …`, `decision check --project-root …`, `estimation log --project-root …`, `estimation report --project-root …`, `upgrade --project-root …` o `session tokens --project-root …`
- THEN cada uno hace lo mismo que con `--path D:\code\reservas\.docs\sdd` (en `roadmap`, `capability` y `decision`), con `--root D:\code\reservas` (en `estimation`, `init` y `upgrade`) o con `--path D:\code\reservas` (en `session tokens`)
- AND con `--project-root` y el nombre de hoy a la vez, escribe `--path y --project-root no van juntas` (o `--root y --project-root no van juntas`) y el uso, y sale con 2
- AND `node sdd.js merge --path .` escribe `opción desconocida: «--path»; la raíz del proyecto va en --project-root` y el uso, y sale con 2; lo mismo con `--root` en `merge`, `id next`, `id claim` y `roadmap publish`

### Capacidad: `project-retro`

#### ADDED — La estimación de la retro pega el informe de la release

- GIVEN un corte de la 1.4.0 en un proyecto con `estimation-log.md`, y el usuario que pide la estimación y los action items
- WHEN `sdd-retro` escribe `.docs/sdd/releases/v1.4.0/retro.md`
- THEN «Estimación y action items» lleva literal la salida de `sdd estimation report --release 1.4.0`, sin cuentas a mano sobre `estimation-log.md`
- AND si el verbo sale con error, la sección lleva `Sin informe: <su mensaje>`, sin cuentas a mano
- AND el estado de los action items de la retro anterior sigue en la sección

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `dist/skills/sdd-retro/SKILL.md` | 622 / 622 | 0 | sin cambio: el paso 4 se reescribe con saldo ≤ 0 (`words()` de `word-budget.test.ts` sobre `dist/`) |
| `sdd-templates` (total, con `retro-template.md`) | 17713 / 18000 (suma de `words()` sobre `dist/skills/sdd-templates/`) | 287 | sin cambio: la plantilla pierde ~25 palabras y gana ~25 (literal de la salida y la línea `Sin informe:`); saldo ≈ 0 |

## Previsión de coste

`r7` no existe todavía: su precio es la media de la batería, `node tests/headless/battery.mjs plan tests/batteries/sdd-retro/battery.md` → `suma: 10 sujetos · coste previsto: 1.92 $` (0,19 $ por sujeto).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="r7" N=1` → sin medir: 1 sujeto × 0,19 $ | 0,19 |
| GREEN | `SCENARIOS="r7" N=2` → sin medir: 2 sujetos × 0,19 $ | 0,38 |
| Una tanda de REFACTOR | `SCENARIOS="r7" N=1` → sin medir: 1 sujeto × 0,19 $ | 0,19 |
| Controles | `SCENARIOS="r4 r6" N=1` → `suma: 2 sujetos · coste previsto: 0.37 $` | 0,37 |
| Medición tras la revisión final | `SCENARIOS="r7" N=1` → sin medir: 1 sujeto × 0,19 $ | 0,19 |
| Suma | 7 sujetos | 1,32 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-27 | aprobada (opción «Apruebo») |
