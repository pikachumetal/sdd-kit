---
id: 20261105-125409-feature-0315-copies-reader-and-guards
feature: 0315
title: Walkthrough — kit:copies no deja pasar un bloque que se come el original, y los lectores de skills/ y los own con texto de terceros dan rojo
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — kit:copies no deja pasar un bloque que se come el original, y los lectores de skills/ y los own con texto de terceros dan rojo

## 1. Cambios realizados

- **kit:copies** (`tests/copies/annotated.ts`, `7b5698e8`): el `Reader` sigue un bloque del texto hasta `<!-- kit: fin -->` si es la siguiente marca, aunque cruce líneas en blanco (decisión 2 de la 0302). Un bloque `add` o `sustituye` que repite 2 líneas seguidas o más del original en su sitio da rojo en su marca; una marca que ya tiene el rojo de su cita no recibe además el de la racha. El fixture del experimento de la 0302 (`cli/test/fixtures/copies/sdd-annotated-v7.0.0.md`) tenía el mismo fallo y se cierra con `fin`.
- **kit:dist-compare** (`tests/copies/dist-compare.ts`, tarea en `moon.yml`, `7b5698e8`): compara ficheros con una referencia de git por párrafos, como el `compare-dist.mjs` de la 0312, y por forma: sangría, marcadores de lista, tabla y título, vallas y líneas en blanco, con las líneas de un párrafo con la misma sangría contadas como una. `architecture.md` la nombra.
- **Lectores de `skills/`** (`cli/test/kit/skills-readers.test.ts`, `f8ae0774`): da rojo si un test de `cli/test/` lee el `skills/` del repo y nombra una valla.
- **`skills.test.ts`** (`f8ae0774`): frontmatter, `@`, enlaces, `references/` huérfanos y el índice de `sdd-templates` se comprueban en `dist/skills/`.
- **kit:upstream** (`tests/upstream/check.ts`, `2a948b9a`): busca con `git grep -F` cada línea de 70 caracteres o más de los `own` en el último tag de cada fuente y en la versión de cada entrada suya.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2 h
- Esfuerzo real: 1,21 h — reloj de la sesión 1,99 h desde 2026-11-05T11:47Z, sin 47 min de espera al dev-lead (4 esperas)
- Desviación: −0,79 h (−40 %)
- Causa de la desviación: Esperas y huecos: 12:00Z 32 min; 12:32Z 0 min; 12:37Z 9 min; 12:54Z 6 min. La estimación contaba la implementación sola; las tres tasks salieron con sus tests fijados en el plan y sin fix rounds.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 63.137.757 — claude-opus-5-5 63.137.757
- Tokens de subagentes: 5.900.942 en 5 despachos — Final review — Spec axis 0315 claude-opus-5-5 2.492.489 / 7 min; Final review — Code axis 0315 claude-sonnet-5-5 569.411 / 2 min; Re-revisión final 0315 claude-opus-5-5 1.270.278 / 4 min; Revisor adversarial spec 0315 claude-sonnet-5-5 131.490 / 1 min; Final review — Architecture axis 0315 claude-opus-5-5 1.437.274 / 4 min
- Coste de la sesión: 25,21 $ (hilo 20,28 $ + subagentes 4,93 $)
- Coste de sujetos: no aplica
- Review de spec: 1 revisor (dominio, Sonnet, pedido por el dev-lead aunque la rúbrica daba ninguna) · hallazgos 10, aceptados 8 (uno en parte)

## 3. Desviaciones del plan

- La racha vale para `add` y `sustituye`, no solo `add`: el caso real de `sdd-worktrees` era un `sustituye: «Node.js»`. Enmienda de la spec del 2026-11-05, aprobada por el dev-lead («ok»).

### Decisiones tomadas sin el dev-lead

- Task 1: Ruling: el Review Focus «fin dentro de una valla posterior» es el mismo caso que «la marca siguiente no es fin»: va en ese test — si es incorrecto: un caso sin test propio
- Task 1: Ruling: enmienda aprobada («ok», 2026-11-05): la racha vale para add y sustituye — va en el commit de la Task 1
- Task 1: Ruling: el fixture sdd-annotated-v7.0.0.md de la 0302 tenía un sustituye sin fin a mitad de lista que se comía 9 líneas del original (línea 148): se cierra con fin antes de «ledger at the old flat path»; el experimento lento sigue con sus 2 conflictos — si es incorrecto: el fixture deja de ser el de la 0302 byte a byte
- Task 1: Ruling: una marca con un rojo de su cita (A+C, cita que no cuadra) no recibe además el de la racha: un rojo por marca, y manda el de la cita — si es incorrecto: una racha queda tapada hasta arreglar la cita
- Task 2: Ruling: la copia RED de skills-readers.test.ts difiere en el cuerpo de skillsReaders (6+/1-), que vive en el propio test por el plan; los asserts y los nombres no cambian — si es incorrecto: nada, el contrato es el mismo
- Task 3: Ruling: kit:upstream ya sale en rojo en develop con 6 líneas «cambian sus rutas» (fuentes subidas: 0296, 0306, 0313, 0314, 0297); la rama da las mismas 6 y ninguna de línea literal — «lo mismo que hoy» del Intent; el «pasan» del prompt de arranque no se cumple ni en develop — si es incorrecto: ninguno, la herramienta no cambia esas líneas
- Final: Ruling: el bloque «De código» del plan llevaba el mensaje de antes de la enmienda («el bloque add lleva»); se corrige a «el bloque lleva», el de la spec enmendada, y así viaja a los ejes — si es incorrecto: ninguno, la spec manda
- Final: Ruling: el Review Focus 1 del plan decía que un fin dentro de una valla posterior sin otra marca antes no alarga el bloque; la spec dice que el bloque acaba en fin si es la marca siguiente, y manda la spec: el test fija el caso en que la marca siguiente es la que abre el bloque de la valla — si es incorrecto: un bloque del texto que cruza una valla hasta un fin interior sale con otro rojo, no en verde
- Final: Ruling: una ruta que no está ni en la base ni en el árbol sale «igual», y sin rutas o con --base sin valor la orden no avisa (Código m-3, Spec m-6, Arquitectura m-7 y m-8): la spec fija que un fichero que no está en la base cuenta como vacío, y un aviso nuevo sería un THEN que no tiene; va a residuales — si es incorrecto: una ruta mal escrita da un «igual» falso
- Final: Ruling: la rama de fallo de git grep queda sin test (Código m-2): provocarla pide un clon roto; la versión ausente, su causa probable, ya no llega a git grep — si es incorrecto: un mensaje mal formado sin test
- Final: Ruling: skills-readers no ve una lectura por una variable que no se llama repoRoot (Código m-9): la línea que define skillsRoot con join(repoRoot, 'skills') sí casa, y basta una lectura por fichero, porque el arreglo es de fichero entero — si es incorrecto: un lector con otro nombre de raíz pasa
- Final: Ruling: en un empate, paragraphDiff saca antes el «-», y compare-dist.mjs sacaba antes el «+» (Spec m-2): mismo diff, otro orden, como git diff — si es incorrecto: nada, cambia solo el orden de dos líneas

## 4. Verificación

### 4.1 Builds

- `moon run cli:typecheck cli:test` en cada commit, por el pre-commit, y tras la pasada de fix: `Tests  2229 passed | 12 skipped (2241)`. Los lentos tocados, con `npx vitest run` desde `cli/`: `upstream-watch`, `copies`, `dist-compare` y `worktrees-setup`, 46/46.
- Gate de cierre: `develop` va por delante de la rama (la 0316 y la 0318), así que corre una vez en la base integrada, tras `sdd merge --sync`; su línea `Gate:` va en el mensaje final del cierre.

### 4.2 Smoke / tests

Validación en campo: 2026-11-05 · suite 2229/2229 tras la pasada de fix y de nuevo tras el arreglo de la re-revisión · lentos tocados 46/46 · 13 filas de THEN abajo, 6 con ejecución real · kit:copies, kit:upstream y kit:dist-compare sobre las copias de la base como hoy · revisión final Spec, Código y Arquitectura sobre 2a948b9a, con arreglos; re-revisión 19/19 resueltos y 1 Important nuevo, arreglado; 1 sin revisar

**✋ sin revisar**: el commit que mueve abbreviate a tests/upstream/clones.ts y baja recordHits a 3 parámetros, posterior a la re-revisión (juntado en el cierre).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Bloque `add` en una valla que se come 2 líneas → rojo en la marca | suite (`copies.test.ts`, `reports a block that eats original lines inside a fence`), rojo antes del arreglo | ✓ |
| Con `fin` antes de la línea en blanco, sin rojo | suite (`accepts the same block closed with fin before the original lines`) | ✓ |
| `sustituye` sin `fin` que se queda las líneas del original → rojo | suite y ejecución real: la fuente de `sdd-worktrees` de antes de `57be1a76` da `skills/sdd-worktrees/SKILL.md:115: el bloque lleva 7 líneas seguidas del original en su sitio, desde «# Rust»…` con el código nuevo y nada con el de `develop` | ✓ |
| Bloque del texto cuyo `fin` se come un párrafo → rojo | suite (`reports a text block whose fin eats an original paragraph`), antes daba `fin sin bloque abierto` | ✓ |
| Una sola línea igual no da rojo | suite (`ignores blank lines and a lone equal line`) | ✓ |
| Bloque con `fin` cruza líneas en blanco; sin `fin` antes de la marca siguiente acaba en la línea en blanco | suite (`ends a text block at fin across a blank line`, rojo antes; `…when the next mark is not fin`) | ✓ |
| `kit:dist-compare`: sangría, listas juntadas, línea en blanco doble, valla; saltos de línea de un párrafo no cuentan | suite (`dist-compare.test.ts`, 9 tests, rojo antes por el módulo que faltaba) | ✓ |
| `kit:dist-compare`: `igual` y 0; referencia que no existe y 1; solo la forma cambiada y 1 | suite (`dist-compare.slow.test.ts`, con un repo de juguete: `writes igual…`, `rejects a base that does not exist`, `names the shape of a file that only changes its indent`) | ✓ |
| `kit:dist-compare`: las dos secciones y un fichero que no está en la base | ejecución real: `tests/copies/dist-compare.ts` con `--base develop` → `15 párrafos distintos` y después `63 líneas con otra forma`, salida 1 | ✓ |
| `own` con una línea literal de 80 caracteres → rojo con la línea y la fuente; sangrada, igual; solo en la `version` de una entrada, con esa versión; menos de 70, nada; 70 justos, rojo; una versión que falta en el clon, solo su «falta» | suite (`upstream-watch.slow.test.ts`, 7 tests nuevos; 4 en rojo antes de la Task 3 y el de la versión ausente en rojo antes de la pasada de fix) | ✓ |
| `skills.test.ts` da rojo con un enlace roto que solo existe en una inclusión | ejecución real: `includes/x.md` incluido en `sdd-rubber-duck`; antes `114 passed`, después rojo con `references/no-existe.md`; experimento deshecho | ✓ |
| Un test que lee `skills/` y nombra una valla → rojo | suite (`skills-readers.test.ts`, con el texto de `worktrees-setup.slow.test.ts` de antes de `35e08439`) | ✓ |
| Copias de `develop` sin cambios | ejecución real: `kit:copies` da las 6 líneas de hoy, todas con ` → <fila>`; `kit:dist-compare` sobre las 95 `.md` de `dist/skills/` → `igual`; `kit:upstream` da las mismas 6 líneas que `develop` (fuentes nuevas de 0296, 0306, 0313, 0314 y 0297) y ninguna línea literal | ✓ |

### 4.3 Residuales / deuda generada

- `kit:dist-compare` con una ruta que no está ni en la base ni en el árbol dice `igual`, y sin rutas no dice nada y sale con 0: la spec cuenta como vacío un fichero que falta, y un aviso sería un THEN nuevo (ruling de la revisión final). Menor, sin fila: un solo caso, en este ticket.
- La rama de fallo de `git grep` en `kit:upstream` no tiene test: provocarla pide un clon roto.
- `kit:upstream` ya sale en rojo en `develop`, con 6 líneas «cambian sus rutas» que tienen dueño en el roadmap; esta feature no las cambia.

## 5. Aprendizajes

- **La racha de un bloque que se come el original vale para `add` y `sustituye`** → `capabilities/kit-distribution.md`, por el delta: la fila decía `add`, y el caso real que la motivó era un `sustituye`. Medir el caso real antes de escribir el RED lo cazó.
- **`kit:dist-compare` contra `develop` da lo que trajo la base si avanzó** → `tech-stack.md`: con la rama atrasada, la comparación va con `--base $(git merge-base HEAD develop)`.
Retro: documento o skill desmentido → la fila 0315 del roadmap pedía la racha solo para bloques `add`, y el caso real que la motivó era un `sustituye`: corregido en su sitio por la enmienda de la spec y el delta (`capabilities/kit-distribution.md`)
Retro: documento o skill desmentido → ticket del kit: la rúbrica de `sdd-propose/references/review-spec.md` dio «ninguna» con tres señales, y el revisor que pidió el dev-lead encontró 7 Important (otro caso tras los de la 0312 §6 y la 0304 §1)
