---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: patch
id: 20261013-100027-patch-0176-fast-suite-budget
task: 0176
mode:
date: 2026-10-13
---

# Ticket para el kit — patch 0176: el conjunto rápido del pre-commit vuelve por debajo de 30 s

## Contexto

- Carril y modo: patch, fallo determinista, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-rubber-duck` (🦆 corto), `sdd-start-patch`, `sdd-debugging`, `sdd-tdd`, `sdd-end-patch`, `sdd-feedback`
- Proyecto: el propio repo del kit (Markdown, Pester y una CLI en TypeScript), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: 0,75 h frente a 1 h estimada
- Coste en tokens: 12.763.414 del hilo, 5,50 $ (`sdd session tokens --path .`)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `sdd id next --reserve` consume un id nuevo cuando la rama ya lleva el reservado

- **Qué pasó**: el prompt de arranque abrió el worktree en `patch/0176-fast-suite-budget` para una fila de «Deuda técnica», que no tiene columna de id. Seguí el paso 2 de `sdd-start-patch` («el id reservado en la fila del roadmap, o el que reserva `sdd id next --reserve` si no tiene fila») y ejecuté `node cli/bin/sdd.js id next --reserve` en PowerShell: devolvió `0179`. Sin `--reserve`, el mismo verbo había devuelto `0176`, porque `proposeId` devuelve el id de la rama si nadie lo usa (`cli/src/ids/next.ts:22`). Usé el 0176, y el 0179 queda como hueco en la secuencia.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 2 y `skills/sdd-start-feature/references/nombrado.md` línea 7 (de dónde sale el id en `sequence`)
- **Por qué el kit no lo evitó**: las dos fuentes de id que nombran son la fila del roadmap y una reserva nueva. No contemplan que el prompt de arranque ya reservó el id y lo dejó solo en el nombre de la rama, que es lo que pasa con una fila de deuda o de backlog sin id.
- **Coste**: un id consumido sin uso (`0179`) y unos 4 min leyendo `next.ts` y el contador para entender el salto; la causa está en `cli/src/ids/next.ts:22` y `:27-35`
- **Propuesta**: en `nombrado.md` línea 7, y en el resumen del paso 2 de `sdd-start-patch`, añadir una tercera fuente antes de la reserva: «o el id de la rama, si ya lo lleva (`<tipo>/<id>-<slug>`, la creó un prompt de arranque): `sdd id next` sin `--reserve` lo devuelve». Otra opción: que `--reserve` devuelva el id de la rama, sin consumir otro, cuando nadie lo usa, igual que hace `proposeId`.
- **Verificada**: sí, reproducido con `node cli/bin/sdd.js id next` (→ `0176`) y `node cli/bin/sdd.js id next --reserve` (→ `0179`) en PowerShell, en la rama `patch/0176-fast-suite-budget` sin carpeta todavía
- **Criterio de aceptación**: GIVEN un worktree en `patch/0176-<slug>` que abrió un prompt de arranque para una fila de deuda sin id, y el contador en 0178, WHEN el agente abre la carpeta del patch, THEN la carpeta lleva `patch-0176` y el contador sigue en 0178.

### 2. La causa raíz desmiente la solución que trae la petición, y ningún paso dice qué hacer

- **Qué pasó**: la petición fijaba la solución: «marca con `-Tag 'Slow'` los bloques que crean repos o lanzan procesos», la misma que proponía la fila de deuda. Medí cada bloque con `sdd-debugging` (fase 1): lo que lanza procesos costaba 1,7 s de 13,3 s, y el peso estaba en leer toda la evidencia (8,3 s más 3,1 s de regex), sin procesos de por medio. La solución pedida dejaba el conjunto rápido por encima de 30 s con carga. Paré con una pregunta cerrada: la medida, la solución pedida como opción y la que arregla la causa como recomendada. El dev-lead eligió la recomendada.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md`, «Is it really a patch?» («A proposed solution for a failure doesn't turn it into a closed request: it's still a failure, and the root cause confirms the proposal fixes it») y `skills/sdd-start-patch/SKILL.md` paso 1
- **Por qué el kit no lo evitó**: la regla dice que la causa raíz confirma la propuesta, pero no qué hacer si la desmiente: subir a feature, preguntar o arreglar la causa sin decir nada. Además, la regla de «Fixed solution» («proponer una opción que nadie escribió no es patch») choca con este caso: la opción que arreglaba la causa la escribí yo, aunque el «control rápido que cubra lo mismo» venía de la petición.
- **Coste**: una parada del dev-lead, de unos 2 min; sin vuelta, porque la medida llegó antes del fix (`patch.md` §2 y §3 del patch 0176)
- **Propuesta**: una línea en el paso 1 de `sdd-start-patch`: «Si la causa raíz muestra que la solución que trae la petición no arregla el fallo, para antes del fix: pregunta con la medida, la solución pedida como una opción y la que arregla la causa como recomendada. Si lo que eliges cambia lo que el usuario ve o puede hacer, sube a feature».
- **Verificada**: sí, contrastado con `skills/sdd-propose/SKILL.md` («Is it really a patch?», párrafo «Fixed solution») y con el paso 1 de `skills/sdd-start-patch/SKILL.md`, que no tratan el caso
- **Criterio de aceptación**: GIVEN un patch cuya petición fija «marca X como lento» y una medida que muestra que X pesa el 13 % del exceso, WHEN el agente termina la fase 1 de `sdd-debugging`, THEN para antes de tocar código con una pregunta que trae la medida y las dos soluciones, y no aplica en silencio ni la pedida ni la suya.

## Lo que hice por iniciativa propia

- Probé el control nuevo de punta a punta: preparé en el índice una fuga falsa (`red/out/leak.txt` con `C:\Users\alice\…`) e intenté un `git commit` real. El pre-commit lo bloqueó, lo que demuestra que el control lee el índice que se commitea desde dentro del hook. Después deshice la prueba. Funcionó: un test unitario del filtro no habría visto el entorno del hook.
- Cambié el mensaje de `FastSuiteBudget` y la regla de `tech-stack.md` («Conjunto rápido y tests lentos»): nombraban solo «crear repos, lanzar procesos o esperar», y de ahí salieron la propuesta de dos tickets (patches 0103 y 0168), la fila de deuda y la decisión inicial, que ahorraba 1,7 s. Ahora incluyen «leer toda la evidencia del repo» y el control de lo que lleva el commit.
- Conté el «Real» desde la creación del transcript de la sesión (09:01Z), no desde la carpeta (09:24Z): la investigación de `sdd-propose` y `sdd-debugging` va antes de la carpeta y es la mitad del trabajo de un patch.

## Funcionó, no tocar

- La regla de `sdd-propose` de que la causa raíz confirma la propuesta, junto con la medida por bloque de la fase 1 de `sdd-debugging`: sin ellas habría aplicado la solución pedida y el umbral seguiría en rojo.
- `sdd merge --push` fusionó y publicó a la primera; `sdd roadmap check`, `sdd capability check` y `sdd estimation log` cerraron sin tocar nada a mano.

## Menores

- `patch-template.md` §5 define «Inicio» como la apertura del patch, pero no dice si «Real» cuenta desde ahí o desde el arranque de la sesión. En este patch, 23 de los 45 min fueron antes de la carpeta — `skills/sdd-templates/templates/patch-template.md` §5
