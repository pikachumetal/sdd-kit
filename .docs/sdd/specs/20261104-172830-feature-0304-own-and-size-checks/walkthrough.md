---
id: 20261104-172830-feature-0304-own-and-size-checks
feature: 0304
title: Walkthrough — Las comprobaciones de las skills propias y del tamaño
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-04
---

# Walkthrough — Las comprobaciones de las skills propias y del tamaño

## 1. Cambios realizados

- **La inclusión en el build** (`22153f12`): `build/dist.ts` gana `renderLines`, que sustituye cada `<!-- kit: incluye <nombre> -->` del texto por `includes/<nombre>.md` antes de quitar las demás marcas y recuerda de qué línea de la fuente sale cada línea de la salida. También gana `includesFrom`, con los avisos de inclusión que no existe, inclusión en un bloque de código e inclusión con marcas. `stripMarks` pasa a ser `renderLines` sin inclusiones. `includes/` no está en la lista blanca, y `.gitattributes` fija LF en `includes/` y en las fixtures de `kit:own`.
- **`kit:own`** (`7ceeef88`, `5eacc8d4`): `tests/own/` (`kit-text.ts`, `repeated.ts`, `exceptions.ts`, `sentences.ts`, `spanish.ts`, `check.ts`), la tarea `own` en `moon.yml` (tras `kit:build`, sin caché, fuera del pre-commit y de la CI) y `cli/test/kit/own.test.ts`, con la muestra `cli/test/fixtures/own/spanish-sample.md`. Qué es texto del kit lo dicen `kindOf` (`build/sources.ts`) y `kitBlockLines` (`tests/copies/annotated.ts`, sobre el `Reader` de `kit:copies`).
- **La fase en `kit:skill-size`** (`1dc1a583`): `invokedSkills` y la suma por fase en `tests/skill-size/check.ts`; la orden del corte de la regla 5 de `CLAUDE.md` gana `kit:own`, y `tech-stack.md` lo nombra.
- **La capacidad** `kit-distribution`: fusionado el delta (1 requisito modificado, 6 añadidos y 5 reglas sustituidas).

### Lo que dan sobre el kit de la rama

Es la lista de rojos con la que arrancan las filas que los ponen en verde (0296, 0305-0310, 0314 y 0316):

- `kit:skill-size`: los 5 `SKILL.md` de siempre (`sdd-implement` 61.636 bytes, `sdd-propose` 33.332, `sdd-archive` 31.070, `sdd-verify` 22.881, `sdd-roadmap` 21.680). Ninguna fase pasa de 100.000: la mayor es la de `sdd-implement` (`sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`), con 80.203.
- `kit:own`: 9 frases repetidas, 10 absolutas con excepción y 550 líneas en castellano en 22 ficheros. Los 22 son los 21 del inventario de `develop` más `sdd-roadmap/SKILL.md:29`; el contraste está en [`red/spanish-inventory.md`](red/spanish-inventory.md). Las repetidas:
  - «write everything the user reads in the language of their message», en 11 skills;
  - «el kit no define ese valor, no voy a suponer», en `sdd-archive` y `control-profiles.md`;
  - dos rachas entre `sdd-archive/references/records.md:7` y `sdd-roadmap/SKILL.md:54`;
  - «the literals of the project's documents stay as written here», en `sdd-end-release` y `sdd-retro`;
  - «write everything the user reads in their language, skill announcements», en `sdd-explore` y `sdd-roadmap`;
  - «end with «si prefieres hacerlo en esta sesión…»», en `sdd-explore` y `sdd-roadmap`;
  - «you're about to edit code and the plan isn't approved», en `sdd-implement` y `sdd-propose`;
  - «light spec: decisions to validate · Intent/Scope/Approach · delta per…», en `sdd-propose` y `sdd-templates`.
- Las 10 absolutas con excepción: `sdd-archive:39`, `:51` y `:56`; `sdd-config:11`; `sdd-implement:31` y `:306`; `sdd-implement/references/patch-flow.md:11`; `sdd-propose:21` y `:64`; `sdd-verify:61`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3 h
- Esfuerzo real: 0,98 h — reloj de la sesión 1,69 h desde 2026-11-04T16:39Z, sin 42 min de espera al dev-lead (6 esperas)
- Desviación: −2,02 h (−67 %)
- Causa de la desviación: Esperas y huecos: 16:44Z 27 min; 17:11Z 8 min; 17:20Z 2 min; 17:22Z 3 min; 17:26Z 1 min; 17:32Z 1 min (ya descontados). El resto es sobreestimación: las 4 tasks salieron sin fix rounds, y la heurística del castellano, la incertidumbre del plan, se fijó en una vuelta. Pasa lo mismo que en la 0312 (1,59 h frente a 4 h).
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (todas las fases)
- Tokens del hilo: 64.849.165 — claude-opus-5-5 64.849.165
- Tokens de subagentes: 7.737.436 en 5 despachos — Re-review final 0304 claude-opus-5-5 2.147.200 / 5 min; Revisor dominio spec 0304 claude-opus-5-5 296.737 / 2 min; Revisor técnica spec 0304 claude-sonnet-5-5 191.031 / 0 min; Final review — Spec axis claude-opus-5-5 3.189.597 / 7 min; Final review — Code axis claude-sonnet-5-5 1.912.871 / 4 min
- Coste de la sesión: 27,13 $ (hilo 21,42 $ + subagentes 5,71 $)
- Coste de sujetos: no aplica
- Review de spec: 2 revisores · hallazgos 20, aceptados 17

## 3. Desviaciones del plan

- La salida de `sdd capability merge` en la spec (decisión 20) y el inventario de `develop` (21 ficheros, no 23) se corrigieron antes de aprobar la spec.
- Fuera de eso, ninguna desviación del plan: las salidas de él están en los rulings de abajo.

### Decisiones tomadas sin el dev-lead

- Task 1: el test «rejects an include in an annotated copy» pasa antes de implementar. Fija el rojo que ya da `parseMark` a un campo desconocido, como pide el AND de la spec, y no es código nuevo. Si es un error: ninguno, el test sigue guardando la gramática.
- Task 1: `stripMarks` pasa a ser `renderLines` con un lector que da vacío, para no duplicar el recorrido. Una inclusión dentro de una valla de una copia lanza en vez de quitarse, y `shareProblems` de `kit:copies` ya captura `BuildError`. Si es un error: `kit:copies` calla la medida del 50 % de esa copia.
- Task 1: `dist/` sale «M» en `git status` por `core.autocrlf=true` (CRLF en el working copy, LF en el índice). `git diff -- dist` está vacío y no se commitea. Si es un error: ninguno.
- Task 2: `skillLines(repoRoot, files, registry)` lleva 3 parámetros, no 2, porque `ownReport` ya lee `upstream.json` para la inclusión en una copia y se lo pasa. Si es un error: un parámetro de más.
- Task 2: las rachas se agrupan por componente: dos rachas que comparten alguna racha de 10 palabras van en una línea. Con las mismas 10 primeras es lo que dice la decisión 9, y así una racha más corta en una tercera skill no sale en una línea con un solo sitio. Si es un error: una línea agrupa dos frases distintas que se solapan.
- Task 2: dos copias no se comparan aunque una sea `pending`, como pide el AND «dos copias anotadas que comparten una racha… no dan rojo». `sdd-implement` y `sdd-archive`, las dos `pending`, no se comparan entre sí hasta que sus filas las anoten. Si es un error: una regla repetida entre esas dos se ve solo al anotarlas.
- Task 3: la muestra perdió «- Timestamp: `Get-Date …` (PowerShell).», mal etiquetada como castellano porque sin el código no tiene ni una palabra suya. Ganó «## Checklist (one todo per step)», el falso positivo del contraste. El test no cambió desde la copia RED. Si es un error: la muestra pierde un caso.
- Task 3: la heurística no detecta un título en castellano de una sola palabra sin tilde, sin palabra gramatical ni terminación propia, y fuera de la lista (p. ej. «## Detalle»): sin un diccionario no se ve. Esos títulos viven en ficheros que ya dan rojo por sus otras líneas. Si es un error: un título suelto en castellano pasa.
- Task 3: `sdd-roadmap/SKILL.md:29` («| En espera |») entra en el inventario como el fichero 22: es castellano real sin citar, y lo arregla la 0308. Si es un error: un rojo de más en `sdd-roadmap`.
- Task 4: el test «passes a phase of exactly 100.000» usa skills de 20.000 caracteres, que dan rojo por bytes, y solo mira la línea de la fase: con menos de 20.000 bytes cada una, 5 skills no suman 100.000 exactos. Si es un error: ninguno.
- Task 4: el corte de frase de la fase es `splitSentences` de `tests/own/sentences.ts`, el mismo de la absoluta con excepción (decisión 13). Si es un error: ninguno.
- Revisión final: `checkOwn` sigue siendo `async` porque `listSources` de git lo es, y `ownReport` es la versión síncrona que usan los tests. Si es un error: ninguno.
- Revisión final: el aviso de una inclusión en una copia nombra `skills/…` y no `dist/skills/…`, porque esa línea no existe en `dist/`: el build ya la expandió. Si es un error: un aviso que apunta a la fuente.
- Revisión final: la spec decía «hoy son 5» absolutas y 12 grupos, y el kit real da 10 y 9. La medida de la spec no contaba las copias `pending` ni el agrupado, y las cifras reales están en §1. Si es un error: ninguno.
- Revisión final: `skills.test.ts` lee `skills/` y no `dist/`, así que el texto de `includes/*.md` quedará sin validar (enlaces, `references/`) cuando exista la primera inclusión. En esta rama no hay ninguna (§4.3). Si es un error: un enlace roto en una inclusión pasa `cli:test`.
- Re-revisión: `regionsOf` se queda como tercer recorrido del estado `Block`, junto a `renderLines` y `Reader.read`. Cada uno saca otra cosa sobre `nextBlock`, que ya es la pieza común, y un recorrido genérico sería una abstracción para tres usos distintos. Si es un error: un cambio en cómo se abre un bloque toca tres sitios, cubiertos por sus tests.
- Re-revisión: `regionsOf` sigue exportada aunque solo se usa en su fichero: `textLines` la usa, y quitar el export no cambia nada. Si es un error: un export de más.
- Re-revisión: «*e.g.» y «_e.g.» siguen cortando la frase. El kit no tiene ningún caso, y ampliar la clase de caracteres es una línea si aparece. Si es un error: una absoluta con excepción tras «*e.g.*» sale sin rojo.
- Re-revisión: el test «fails on a phase of 100.001 characters» mide 115.000. Es un test RED de la Task 4 y su nombre es contrato; el de 100.001 exactos está al lado. Si es un error: un nombre que confunde.

## 4. Verificación

### 4.1 Builds

- Gate: lo corre el paso 6 del cierre sobre la base integrada (la base va 2 commits por delante); su línea va en el mensaje final.
- En la rama, sobre la pasada de fix (juntada en el cierre): `moon run cli:test` → `Tests 2210 passed | 12 skipped (2222)`; `node cli/bin/sdd.js lock run -- moon run cli:test-min` → `Tests 2717 passed | 12 skipped (2729)`, 130/130 ficheros; `moon run cli:typecheck` verde. Tras el arreglo de la re-revisión, solo comentarios: `own.test.ts` y `skill-size.test.ts` 46/46.
- Línea base, sobre la apertura `564cff0b`: `moon run kit:test-headless cli:typecheck cli:test` sin el filtro → cli:test 2158/2170 (12 saltados), kit:test-headless 399/399.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-04 · smoke de 8 THEN, 6 con ejecución real en un worktree desechable con entradas que fallan y 2 por suite · suite de la rama 2210/2222 y `cli:test-min` 2717/2729 · revisión final Spec y Código sobre `1dc1a583`, pasada de fix y re-revisión desde `1dc1a583` (juntadas en el cierre) con 20/21 hallazgos resueltos; el Important nuevo, arreglado en el cierre (revisado en el hilo: 3 líneas de comentario)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| MODIFIED «La skill que carga el agente sale limpia del build»: una inclusión en un bloque de código para el build | ejecución real | `skills/sdd-explore/SKILL.md:8: una inclusión va en el texto, fuera de un bloque de código`, exit 1 |
| ADDED «Una inclusión…»: `dist/` lleva el texto incluido y no tiene `includes/` | ejecución real | `dist lleva el texto: true · dist/includes existe: false · marca en dist: false`, exit 0 |
| ADDED «Una inclusión…»: inclusión que no existe; inclusión con marcas | ejecución real | `skills/sdd-explore/SKILL.md:7: la inclusión user-language no existe: crea includes/user-language.md` · `includes/user-language.md: una inclusión no lleva marcas del kit`, exit 1 |
| ADDED «Una inclusión…»: `kit:own` en una copia; `kit:copies` en una copia anotada | ejecución real · suite | `skills/sdd-tdd/SKILL.md:6: una inclusión es solo de las propias, y skills/sdd-tdd/SKILL.md es una copia` · `copies.test.ts`, `rejects an include in an annotated copy` |
| ADDED «Una frase del kit repetida…», «Una absoluta con su excepción…», «La prosa en castellano…» | ejecución real | `kit:own` sobre el kit: 9 repetidas, 10 absolutas con excepción y 550 líneas en castellano en 22 ficheros (§1); los casos de cada AND, en `own.test.ts` |
| ADDED «Lo que dice kit:own»: una línea por rojo y código 1; `Skills al día` sin rojos | ejecución real · suite | exit 1 con una línea por rojo · `prints Skills al día with no problems` |
| ADDED «Ninguna skill ni ninguna fase…»: fase de más de 100.000 | ejecución real | `FALLA: la fase de sdd-propose (sdd-archive, sdd-verify, sdd-roadmap, sdd-grilling, sdd-implement) suma 104980 caracteres (límite: 100000)`, con tres invocaciones añadidas a mano |
| ADDED «Ninguna skill ni ninguna fase…»: el kit de hoy | ejecución real | `OK: ninguna fase pasa de 100000 caracteres (la mayor, sdd-implement: 80203)` y los 5 `FALLA` de bytes |

### 4.3 Residuales / deuda generada

- `cli/test/kit/skills.test.ts` lee `skills/` y no `dist/`, así que el texto de `includes/*.md` queda sin validar (enlaces, `references/` huérfanos) cuando exista la primera inclusión real (nota del eje Código). Va en el ticket.
- Con `core.autocrlf=true`, `dist/` sale «M» en `git status` sin diff de contenido: `dist/** eol=lf`, y el build copia en CRLF los `cli/src/` del working copy, que no tienen regla de EOL. Va en el ticket.

## 5. Aprendizajes

- El texto del kit de una skill lo dan las marcas de la fuente, y lo que viaja, el build: una comprobación de las propias lee `skills/` con `renderLines` y nombra las líneas de `dist/` → `capabilities/kit-distribution.md` (fusionado), «Dónde viven los datos».
- La heurística del castellano se fijó con una muestra etiquetada, y su límite (títulos de una palabra sin señal) queda escrito → `red/spanish-inventory.md` de esta carpeta, que lee la 0316.

Retro: error que cazaría un chequeo → ticket del kit: `dist/` sale modificado en `git status` en un clon con `core.autocrlf=true`, porque el build copia en CRLF los `cli/src/` del working copy, y el paso 0 de `sdd-archive` («si algo sale, para y pregunta») no distingue ese ruido
Retro: documento o skill desmentido → ticket del kit: `review-spec.md` («Por defecto, ninguna. 0–3 señales no proponen review»), con 3 señales; los dos revisores, pedidos por el remedio de la fila de deuda, dieron 20 hallazgos y 5 Críticos (fila → 0306)

## 6. Adendas
