---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261025-213831-feature-0214-mold-and-launcher-safety
task: 0214
mode: full
date: 2026-10-25
---

# Ticket para el kit — feature 0214: el repaso de coherencia no midió el tope de palabras ni contrastó las decisiones con las reglas vivas

## Contexto

- Carril y modo: feature full, partida por umbral al arrancar (0214, 0215, 0216)
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-start-feature`, `sdd-implement` (Native), `sdd-tdd`, `sdd-verify`, `sdd-archive`; `sdd-implement`, `sdd-verify`, `sdd-archive` y `sdd-tdd` leídas con `Read` desde la rama (la sesión arrancó dos veces tras un cuelgue del PC con las skills de la caché)
- Proyecto: el propio kit; tooling de pruebas en bash, Node y Pester; un dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec y re-revisión), Sonnet 5.5 (eje Código)
- Coste en reloj: 2,72 h de esfuerzo real frente a 3 h estimadas (−9 %)
- Coste en tokens: hilo 72.073.655 · subagentes 8.273.465 · 26,57 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una decisión de la spec copió por defecto el criterio de una campaña cerrada sin contrastarlo con la regla viva del mismo tema

- **Qué pasó**: la decisión 3 de la spec puso por defecto en `lib.sh` la parada por puerto del `web.sh` de una campaña cerrada (parar todo lo que escucha en un puerto que nombre el stream). `tech-stack.md` ya tenía una regla viva sobre lo mismo («lo que quede escuchando desde el scratchpad de la campaña se para por su PID», feature 0180). Los dos ejes de la revisión final lo marcaron Important; con lo implementado, el test que abre un puerto desde Pester mató al propio Pester. Hizo falta una pasada de fix, una enmienda de la spec y una parada al dev-lead para aprobarla.
- **Fuente**: `.docs/sdd/specs/20261025-181756-feature-0214-mold-and-launcher-safety/spec.md`, «Enmiendas» (decisión 3); `walkthrough.md` §3 y «Decisiones tomadas sin el dev-lead» (Final: fixed «parada por puerto de procesos ajenos»).
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4, «Coherence pass» (línea 62): busca dónde se implementa cada `MODIFIED` y cada literal retirado, pero no pide contrastar una decisión de «✋» que fija un comportamiento por defecto con las reglas vivas de los documentos de anclaje.
- **Por qué el kit no lo evitó**: la spec no tenía delta (capacidades: ninguna), así que el repaso no encontró `MODIFIED` que buscar; las decisiones de «✋» no pasan por ninguna búsqueda.
- **Coste**: una pasada de fix con 3 tests RED de esta causa, una enmienda y una parada del dev-lead (walkthrough §3); el tiempo exacto, sin respaldo.
- **Propuesta**: en el repaso de coherencia, para cada decisión de «✋» que fija un comportamiento por defecto o mueve una pieza de una campaña o un módulo a uno compartido, buscar su tema en los documentos de anclaje (`tech-stack.md`, `architecture.md`, `constitution.md`) y citar la regla que encaja o la que contradice.
- **Verificada**: sí — contrastado con `skills/sdd-propose/SKILL.md:62` (el repaso nombra `MODIFIED`, literales retirados e ids de filas, no decisiones).
- **Criterio de aceptación**: GIVEN una spec sin delta cuya decisión hace por defecto «parar todo lo que escucha en los puertos del stream» y un `tech-stack.md` con la regla «se para solo lo de la campaña», WHEN el agente hace el repaso de coherencia, THEN «✋» cita esa regla y la decisión la respeta, o la spec la marca como cambio de la regla.

### 2. El repaso de coherencia no midió el tope de palabras de un documento que la spec editaba

- **Qué pasó**: la spec editaba `tech-stack.md`, que `tests/WordBudget.Tests.ps1` limita a 19280 palabras, y partía de 19277. La spec salió sin la sección «Topes de palabras». El pre-commit de la Task 1 lo paró dos veces (19333 y luego 19281), y la spec ganó la tabla con una enmienda.
- **Fuente**: salida del pre-commit, `Topes de palabras.tech-stack.md cabe en su tope` → `mide 19333 y el tope es 19280`; `spec.md`, «Topes de palabras» y «Enmiendas»; `git show 37deadd4:.docs/sdd/tech-stack.md`, medido con el conteo del test → 19277.
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md:131` (la sección es obligatoria si un test pone tope) y `skills/sdd-propose/SKILL.md` paso 4, «Coherence pass», que no la nombra.
- **Por qué el kit no lo evitó**: la regla existía en la plantilla y no la apliqué: el repaso de coherencia, que es el paso que recorro antes del gate, no la incluye entre sus comprobaciones, y la plantilla la deja en un bloque de ayuda condicional.
- **Coste**: dos commits bloqueados y una enmienda; unos 15 min, sin respaldo de la cifra.
- **Propuesta**: que el repaso de coherencia incluya «para cada fichero de la spec, ¿lo limita un test de tope? mide y rellena «Topes de palabras»».
- **Verificada**: sí — contrastado con `skills/sdd-templates/templates/spec-template.md:131` y `skills/sdd-propose/SKILL.md:62`.
- **Criterio de aceptación**: GIVEN una spec que edita un documento con tope en `tests/WordBudget.Tests.ps1` y margen menor que lo que añade, WHEN el agente presenta la spec, THEN la sección «Topes de palabras» tiene su fila con lo medido.

### 3. Dos features hermanas de una misma partición editan la misma línea, y el cierre de la segunda para por conflicto de base

- **Qué pasó**: la 0170 se partió en 0213 y 0214, y las dos editaban la misma línea de `tech-stack.md` («Usa el lanzador de referencia»). La 0213 fusionó antes; `sdd merge --sync` de la 0214 devolvió `base: conflicto en .docs/sdd/tech-stack.md.` y el cierre paró para que una persona decidiera. El dev-lead delegó la resolución; hubo que repetir la suite completa (16,5 min).
- **Fuente**: salida de `node cli/bin/sdd.js merge --sync` → `base: conflicto en .docs/sdd/tech-stack.md.`; filas 0213 y 0214 del roadmap, columna «Ficheros» (las dos nombran `.docs/sdd/tech-stack.md`); commit `merge: integra origin/develop en feature/0214-mold-and-launcher-safety`.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 2, «Splitting stays a question» (línea 55), y `skills/sdd-start-feature/references/nombrado.md` (filas de una partición): no piden ordenar las piezas que comparten fichero.
- **Por qué el kit no lo evitó**: las filas de una partición se escriben con «tras», pero nada mira si dos hermanas en paralelo comparten fichero; el ticket del patch 0170 ya avisó del orden respecto a la fila madre.
- **Coste**: una parada al dev-lead en el cierre y una segunda suite completa (16,5 min, salida de `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` en la sesión, de 21:33 a 21:49).
- **Propuesta**: al partir, si dos piezas comparten un fichero de su columna «Ficheros», la fila de la segunda lleva `tras <primera>`, o el arranque de la segunda integra la primera ya fusionada.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una partición en A y B cuyas filas nombran el mismo fichero, WHEN se escriben sus filas, THEN la de B dice «tras A».

### 4. El comando de verificación de Pester de `tech-stack.md` da rojo con un test que en la suite pasa

- **Qué pasó**: con `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/SubjectOutputPrivacy.Tests.ps1 -CI"` el test «extract.mjs tools escribe bajo >>> Agent las cabeceras ## del prompt» falla por el carácter «·»; dentro de `moon run kit:test` pasa, porque `tests/Invoke-KitTests.ps1` fija la consola en UTF-8.
- **Fuente**: `tests/Invoke-KitTests.ps1:6` → `[Console]::OutputEncoding = [Text.Encoding]::UTF8`; `.docs/sdd/tech-stack.md:215`, el comando de verificación de una task Native, sin esa línea; ejecución en Git Bash → `Expected regular expression '>>> Agent: subagent_type=general-purpose model=sonnet · implementa…' … but it did not match`.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md:215` («La verificación de una task Native en este repo»).
- **Por qué el kit no lo evitó**: el comando documentado no reproduce el entorno del runner de la suite.
- **Coste**: unos 10 min diagnosticando un rojo falso.
- **Propuesta**: que el comando documentado sea `pwsh -NoProfile -Command "[Console]::OutputEncoding = [Text.Encoding]::UTF8; Invoke-Pester -Path <…> -CI"`.
- **Verificada**: sí — reproducido en Git Bash con el comando de arriba; con la línea de UTF-8, la verificación de la Task 4 (`SubjectOutputPrivacy` y `Battery`) dio 29/29.
- **Criterio de aceptación**: GIVEN `tests/SubjectOutputPrivacy.Tests.ps1`, WHEN se ejecuta el comando de verificación de `tech-stack.md`, THEN sale con 0.

## Lo que hice por iniciativa propia

- Escribí los encargos de los ejes de la revisión final y de la re-revisión en ficheros del workspace, rellenados por un script desde las plantillas de `sdd-verify`, y despaché cada subagente con «lee primero tu encargo en <ruta>» en vez de pegar el texto: el hilo no cargó los encargos (cientos de líneas) y un script comprobó que no quedaban huecos `<…>`. Candidata a regla en `skills/sdd-verify/SKILL.md`, «Final review».
- Resolví los conflictos de registros del merge de sincronización (roadmap y changelog) con un script que elige por fila y falla si un bloque no tiene la forma esperada, en vez de editarlos a mano.

## Funcionó, no tocar

- La regla del `CLAUDE.md` del repo de leer las skills de la rama cuando la sesión no sale del script: tras dos cuelgues del PC la sesión cargó la caché (sin `sdd-implement`), y con `Read` se siguió el texto de la rama.
- El ledger de `sdd-implement`: tras cada cuelgue se retomó la task exacta sin rehacer nada.
- La pregunta de partir por umbral antes de la spec, con la partición concreta.
- La revisión final en ejes: los dos ejes encontraron un Important real (la parada por puerto de procesos ajenos) que ningún test de las tasks cubría.

## Menores

- La receta del paquete de revisión excluye `green/**`, y el barrido de dos salidas guardadas bajo `green/out/` no le llegó al eje Spec, que tuvo que contrastarlo con git — `skills/sdd-verify/references/encargo-revision.md:42`.
- En un merge de sincronización con conflicto, `skills/sdd-archive/references/merge-recipe.md:10` solo dice «a person resolves»; no dice cómo seguir si la persona delega la resolución (repetir `--sync` o integrar a mano).
