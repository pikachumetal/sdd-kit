---
id: 20261101-175259-feature-0182-doc-citing-comments
feature: 0182
parent: 0148
proposal: 0131
title: Comentarios que citan documentos, detectados por la CLI
mode: full
profile: delegate
status: approved
created: 2026-11-01
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-01
---

# Spec — Comentarios que citan documentos, detectados por la CLI

🦆 Hoy, si un agente deja `// Task 4: validar antes de guardar` en el código, solo se detecta si el revisor se fija; al archivar la spec, ese comentario ya no lleva a ningún sitio. Con esta feature, `sdd review comments --base develop` lista cada comentario añadido en la rama que cita un documento: `src/save.ts:12 · task · // Task 4: validar antes de guardar`. La misma frase dentro de una cadena no sale, y un comentario que explica un porqué tampoco. El verbo solo informa y sale siempre con 0; el revisor del eje Código recibe la lista y decide caso por caso, porque los patrones dan falsos positivos.

Validación: agente — `validation.mode: field`: la cierra la verificación propia y el uso en proyectos, a través de los tickets.

## Capacidades

- Modificadas: `cli` — verbo nuevo `sdd review comments`
- Modificadas: `verification` — lo que recibe el eje Código y cómo juzga esa lista

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (un requisito de `verification`), contrato público (la salida del verbo la consume el encargo del eje Código) · tamaño: ~350 líneas en 8 ficheros
- Técnica: si el formato de salida basta al encargo y si el lexer resuelve el caso de la cadena (señal: contrato público)
- Mínimo razonable: ninguna — el repaso de coherencia lo hace el hilo; queda sin mirada ajena la tabla de patrones, que la revisión final sí lee

1. **Las tres filas de deuda con «Actuar → 0182» no entran, y su destino pasa a la 0152.** Son los menores de la revisión final de la 0148, el paquete con líneas muy largas y `git worktree remove` en Windows (`roadmap.md:215`, `:432`, `:437`). Tu Alcance no las lista, añaden texto a `sdd-verify` contra el saldo que pides y no tienen que ver con comentarios. Sin este cambio, al cerrar la 0182 quedarían apuntando a una fila cerrada. La 0152 es la pasada de coherencia antes de cortar la release. **Es la decisión que más necesito que mires: si las quieres dentro, di «Cambios»**.
2. Nombre del verbo: `sdd review comments`, bajo el sustantivo `review` de `sdd review package`.
3. `--base <ref>` es obligatorio; el verbo calcula `git merge-base HEAD <ref>`, así que vale `develop` o el `$MERGE_BASE` de la receta del paquete. Sin `--base`, sale con 2. Lee los ficheros en `HEAD`.
4. Formato de salida, una línea por comentario: `<fichero>:<línea> · <tipos separados por coma> · <texto de esa línea, sin sangría>`. Cierra con `<n> comentarios citan documentos` (`1 comentario cita documentos`) o `ningún comentario cita documentos`. Con ficheros no leídos, antes del cierre: `sin leer: <ficheros separados por coma>`. Con `--json`: `{"comments":[{"file","line","cites","text"}],"unread":[…]}`, porque la `cli` pide `--json` en los verbos de datos.
5. Patrones, sin distinguir mayúsculas, sacados de los casos de abajo:
   - `spec`: `spec` o `specs` como palabra suelta (`spec §3`, `spec.md`, `specs/`; no `foo.spec.ts`), y `§` seguido de un número.
   - `task`: `task` o `tarea` más un número (`Task 4`); `feature` o `patch` más dos o más dígitos (`patch 0258`). Lo de `feature` y `patch` no estaba en tu lista: lo añado porque son los casos reales que más hay en este repo.
   - `constitution`: `constitution`, `constitución` o `constitucion`; `Art.` o `artículo` más un número romano.
   - `requisito`: `requisito(s)`, `requirement(s)`, `REQ-<número>`.
   - `capabilities/`: la ruta literal.
   - Una ADR, `plan.md` o un walkthrough no tienen patrón: tu lista no los nombra.
6. Lenguajes, por extensión:
   - `//` y `/* */`: ts, tsx, js, jsx, mjs, cjs, cs, java, kt, go, rs, swift, c, h, cpp, hpp, php, scss, less.
   - `/* */`: css.
   - `#`, precedido de espacio o al inicio de línea: py, rb, sh, bash, yml, yaml, toml, ps1 (y `<# #>`), `Dockerfile`, `Makefile`.
   - `--` y `/* */`: sql.
   - `<!-- -->`: html, xml, csproj; también `@* *@` en cshtml y razor.
7. Qué no se lee: Markdown (`.md`, `.mdx`) y `.json`, en silencio, y `.docs/sdd/specs/**` y `.docs/sdd/changes/**`, que son evidencia con moldes de código. Cualquier otra extensión sale en `sin leer:`, para que el revisor sepa que no se miró.
8. Límites del lexer, que quedan en el código como `shortcut:`: no entiende los literales regex de JS (una comilla dentro abre una cadena hasta el fin de línea, y un comentario detrás se pierde); un docstring de Python es una cadena y no se lista; el `<script>` de un `.html` no se lee. El revisor sigue pudiendo marcarlos. Se lee el fichero entero y se cruza con las líneas añadidas, porque un `/* */` o una cadena de varias líneas pueden abrirse fuera del hunk.
9. El texto nuevo del eje Código, literal, en «Approach». Con un bloque «De código» que prohíbe citar documentos, como el Art. X de este repo, manda ese bloque: el encargo ya dice que incumplirlo es Important, así que aquí un motivo propio no salva la cita a `capabilities/`.
10. Pago del saldo: frases de evidencia de `encargo-revision.md` que se quedan en su `tests/*.md` o en su ticket; no quitan ninguna instrucción, así que no llevan RED propio. Cuentas en «Topes de palabras».
11. La prueba del eje: escenario `f6` de la batería de `sdd-verify`, Sonnet, n = 1, con un diff que lleva `// Task 4: validar antes de guardar` y el falso positivo `// requisito del proveedor: el IBAN va sin espacios`. Si el RED ya marca la cita y calla el falso positivo, sale la frase de juicio de `code-reviewer-prompt.md` (56 palabras), se queda solo la sección con la salida, y `f6` sigue como control en el GREEN. La salida en el encargo no sale en ningún caso: la pide tu «hecho cuando».
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan (`cli/src/comments/` es un módulo nuevo, la señal se comprueba al despachar) · otros despachos: sujetos de `f6` de uno en uno, sonnet · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

Repaso de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` acepta el delta (5 añadidos en `cli`; 1 sustituido y 1 añadido en `verification`). Ningún literal corregido.

**Rebato una premisa, con datos.** «Depende de que el revisor se fije» es cierto a medias: los revisores ya los marcan cuando el comentario está en su diff (tres tickets, abajo), y puede que el RED de `f6` salga limpio. El valor del verbo está en lo que sí se escapa: en este repo sobreviven al menos seis comentarios `(patch NNNN)` o `(feature NNNN)` ya fusionados. Por eso el verbo sigue teniendo sentido aunque `f6` salga limpio, y por eso propongo `feature` y `patch` como patrón.

### Decisiones tomadas con el dev-lead

- El verbo detecta, el revisor juzga; informa y no falla por encontrar algo — «Lo detecta la CLI y lo juzga el revisor, porque los patrones dan falsos positivos y un comentario puede tener un motivo válido para citar una ADR o un documento vivo. El verbo informa y no falla por encontrar algo.»
- Forma de la prueba — «Un frente limpio sale de lo que se arregla y sigue como control en el GREEN. El verbo se prueba con Vitest; un sujeto solo para ver que el eje Código usa la salida.»
- Saldo de palabras — «El saldo de palabras de `sdd-verify` queda igual o baja. Cuenta el texto nuevo antes de presentar la spec y lista lo que lo paga.»
- Al fusionar — «Perfil delegate. Al fusionar, `sdd merge --push`.»

## Intent

Los agentes dejan comentarios que citan la spec, una task o la constitution, y caducan al archivarse la spec: quien lee el código no sabe adónde ir. El Art. X los prohíbe, pero nada los detecta de forma determinista. El éxito: sobre una rama de prueba, el verbo lista un comentario con «spec §3» y otro con «Task 4», no lista uno que explica un porqué ni el mismo texto en una cadena, sale con 0 encuentre o no, y el encargo del eje Código lleva su salida. Fracasaría, aunque funcione, si bloquease algo, o si el saldo de palabras de `sdd-verify` subiera.

**Casos de campo.** Ningún ticket trae el texto literal del comentario, así que los patrones salen de estos casos y del código del repo:

- Revisor que lo marcó: dos comentarios que citaban tasks en el molde (ticket de la feature 0086, l. 95); un comentario de configuración que citaba un artículo de la constitution (ticket de la feature 0000, l. 135); comentarios que citaban la spec y la feature (ticket de la feature 0210, l. 81); un comentario que citaba un fichero (ticket de la feature 0224, l. 103), que este verbo no cubre, porque un fichero cualquiera no es un patrón.
- Fusionados sin que nadie los marcara: `cli/src/merge/affected.ts:44` y `cli/test/merge/intersection.slow.test.ts:83` (`patch 0258`), `cli/test/kit/privacy.ts:16` y `cli/test/roadmap/publish-failures.slow.test.ts:25` (`patch 0245`), `cli/test/kit/worktrees-setup.slow.test.ts:8` (`patch 0253`), `tests/headless/extract.mjs:11` (`feature 0168`).
- Falsos positivos reales, que el verbo listará y el revisor descartará: `cli/src/merge/requirement-lines.ts:48` («un requisito» es el dominio de ese fichero) y `tests/headless/campaign.mjs:58` («la carpeta de la spec»).

## Scope

- Entra:
  - `cli/src/comments/` (lexer, patrones, verbo) y su registro en `cli/src/cli/verbs.ts`, con tests Vitest en `cli/test/comments/`: los del lexer en el conjunto rápido; los del verbo, que crean un repo git, en `*.slow.test.ts`.
  - `skills/sdd-verify/SKILL.md`: la fila del eje Código de la tabla de ejes.
  - `skills/sdd-verify/references/code-reviewer-prompt.md`: sección con la salida y la regla de juicio.
  - `skills/sdd-verify/references/encargo-revision.md`: lo que paga el saldo.
  - `tests/batteries/sdd-verify/`: escenario `f6`, su fixture y su fila de procedencia.
  - `.docs/sdd/roadmap.md`: las tres filas de deuda de la decisión 1.
  - El delta de `cli` y `verification`.
- No entra:
  - Los comentarios que repiten el código: ya son Important del eje Código desde la 0148.
  - Comentarios ya existentes fuera del diff: no se limpia el repo, tampoco los seis de arriba.
  - Bloquear el merge o el pre-commit desde el verbo.
  - Los ficheros Markdown.
  - Los encargos del revisor de task y de la re-revisión de `sdd-implement`.
  - La batería completa de `sdd-verify`, que corre al cortar la release.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Frase de evidencia «con la instrucción en prosa… 3 de 3 runs» → `Medido: tests/gates-reviews-green.md, E3.` | `skills/sdd-verify/references/encargo-revision.md:19` | Scope, decisión 10 |
| Frase «en un proyecto del equipo, 27 minutos…» | `encargo-revision.md:64` | Scope, decisión 10 |
| Frase «Con el cuerpo de los borrados… 235.524 bytes…» → versión corta | `encargo-revision.md:54` | Scope, decisión 10; el THEN de `verification` con el error literal se queda |
| Frase «Sin esta frase, 2 de 2 sujetos en Native…» → `Medido: tests/native-adapt-red.md.` | `encargo-revision.md:25` | Scope, decisión 10 |
| Destino «Actuar → 0182» de tres filas de deuda | `.docs/sdd/roadmap.md:215`, `:432`, `:437` | Scope, decisión 1: pasa a «Actuar → 0152» |

- Filas que implementa: 0182 → `.docs/sdd/roadmap.md:101` (su fila, la marca el cierre), `:100` (dice que la 0148 se partió, historia, se queda), `:127` y `:128` (dependencias de 0198 y 0152, las lee el roadmap sin cambio), `:207` (nota «vuelven a mirarse si la 0182 toca `sdd-verify`», un menor con dos candidatos: la toca, y no trae (c), se queda como «Esperar 2.º ticket») y las tres de la decisión 1; ningún hit en `capabilities/` ni en `skills/`: comprobado con `grep -n '\b0182\b'` en `roadmap.md`, y sobre `.docs/sdd/capabilities` y `skills`.

## Approach

**Verbo.** Toma el merge-base, lee `git diff -U0 --diff-filter=d` para saber las líneas añadidas por fichero, y para cada fichero con lenguaje conocido lee su contenido en `HEAD`, separa sus comentarios con el lexer de su familia y cruza cada línea de comentario añadida con los patrones. Sin dependencias, con `cli/src/git/git.ts`, que aísla el entorno de los hooks. `cli/src/merge/affected.ts` no sirve para leer el diff: pregunta a moon qué tareas afecta, no qué líneas cambian.

**`skills/sdd-verify/SKILL.md`.** La fila Code de la tabla, tras «`sin E2E declarados`»:

```text
; the output of `sdd review comments --base "$MERGE_BASE"`, run in `$REVIEW_DIR`
```

**`code-reviewer-prompt.md`.** Tras la sección «E2E del proyecto»:

```text
## Comentarios que citan documentos

<la salida de `sdd review comments`, literal>
```

Y a continuación de la línea «**Comments:**» de «What to Check»:

```text
Each line of «Comentarios que citan documentos» is a candidate, not a finding: a citation that goes stale with its document is Important; a false positive (the word without a document of this project: «requisito del proveedor»), or a citation with its own reason (an ADR, a living document), goes to «Declined to judge», never to Issues. The list doesn't limit you: a citation it missed is a finding too.
```

## Dónde se prueba

- Lexer y patrones (comentario, cadena, bloque de varias líneas, una familia por lenguaje): Vitest en proceso, como `cli/test/merge/requirement-lines.test.ts`.
- El verbo sobre una rama de prueba, con salida y código de salida: Vitest con repo git, como `cli/test/merge/*.slow.test.ts`.
- Que la skill nombra un verbo y opción existentes: `cli/test/docs-claims.test.ts`, sin cambios.
- Que el eje Código usa la salida: escenario `f6` de `tests/batteries/sdd-verify/`, con `battery.mjs`.
- Saldo de palabras: `cli/test/kit/word-budget.test.ts`, más la cuenta en el walkthrough.

## Términos y ADR

- Términos resueltos: comentario que cita un documento — el que nombra spec, task, constitution, requisito o `capabilities/`; se evita «comentario de trazabilidad».
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `cli`

#### ADDED — `sdd review comments` lista los comentarios añadidos que citan documentos

- GIVEN una rama sobre `develop` que añade a `src/save.ts`, en sus líneas 3, 4, 5 y 6, `// según la spec §3`, `// Task 4: validar antes de guardar`, `// moon hereda el entorno: sin limpiarlo usa otro workspace` y `const note = "// según la spec §3";`
- WHEN se ejecuta `node sdd.js review comments --base develop`
- THEN escribe `src/save.ts:3 · spec · // según la spec §3` y `src/save.ts:4 · task · // Task 4: validar antes de guardar`
- AND no escribe las líneas 5 y 6
- AND cierra con `2 comentarios citan documentos` y sale con 0

#### ADDED — `sdd review comments` sale con 0 sin encontrar nada

- GIVEN una rama cuyo diff no añade comentarios que citen documentos
- WHEN se ejecuta `node sdd.js review comments --base develop`
- THEN escribe `ningún comentario cita documentos` y sale con 0
- AND sin `--base` escribe el uso en stderr y sale con 2
- AND con una `--base` que no existe escribe en stderr `base: no se encuentra <ref>` y sale con 1

#### ADDED — `sdd review comments` mira solo las líneas añadidas

- GIVEN `src/old.ts` con `// Task 2: viejo` en `develop`, y una rama que añade otra línea de código a ese fichero y un fichero `docs/a.md` con `<!-- según la spec §3 -->`
- WHEN se ejecuta `node sdd.js review comments --base develop`
- THEN no escribe `src/old.ts` ni `docs/a.md`
- AND si la rama integró `develop` con un merge que trae `src/otra.ts` con `// Task 9`, tampoco lo escribe

#### ADDED — `sdd review comments` reconoce los comentarios de cada lenguaje

- GIVEN una rama que añade `# según la spec §3` a `a.py`, `-- Task 4` a `b.sql`, `<!-- constitution -->` a `c.html`, una línea interior de un `/* */` con `capabilities/booking.md` a `d.cs`, y `x = "# según la spec §3"` a `e.py`
- WHEN se ejecuta `node sdd.js review comments --base develop --json`
- THEN `comments` trae `a.py`, `b.sql`, `c.html` y `d.cs`, con `cites` `["spec"]`, `["task"]`, `["constitution"]` y `["capabilities/"]`, y no trae `e.py`
- AND un comentario `// requisito de la spec` lleva `cites` `["spec","requisito"]`, y `foo.spec.ts` dentro de un comentario no cuenta como `spec`

#### ADDED — `sdd review comments` dice qué no ha leído

- GIVEN una rama que añade `a.vue`, `b.json`, `c.md` y `.docs/sdd/specs/x/red/m.ts` con `// Task 4`
- WHEN se ejecuta `node sdd.js review comments --base develop`
- THEN escribe `sin leer: a.vue` antes de la línea de cierre, y no lista los otros tres
- AND con `--json`, `unread` es `["a.vue"]`

### Capacidad: `verification`

#### MODIFIED — La revisión final sale en ejes, en paralelo

- GIVEN un plan con `Ejecución: native`, todas sus tasks completas en el ledger, `Eje Arquitectura: no — solo texto de skills` y el commit `a1b2c3d` de su última task
- WHEN el hilo despacha la revisión final
- THEN con `sdd-parallel-agents` y en segundo plano salen dos revisores sobre `a1b2c3d`: el eje Spec con `sdd-kit:effort-high` + `opus` y el eje Código con `sdd-kit:effort-high` + `sonnet`, cada uno con su vigía de silencio
- AND el encargo de cada eje lleva la cabecera de `encargo-revision.md` («Restricciones de código»), su sección «Cómo revisar» y el encargo de su eje de `sdd-verify`
- AND el eje Spec recibe además las rutas de `spec.md` y `plan.md`, la sección `## Review Focus` del plan literal, la lista de ADR `accepted` de `sdd decision index --files <ficheros del diff>`, la salida de `sdd capability index` y el puntero a las líneas `Ruling:` y `minor (deferred)` del ledger; el eje Código, el paquete, «Flujos core», «Retries» y «Timeouts» de `operations.md` §Testing, literales, o `sin E2E declarados`, y la salida de `sdd review comments` en el worktree del revisor; el eje Arquitectura, el paquete y `architecture.md`
- AND con `Eje Arquitectura: sí — <frontera>` sale además el eje Arquitectura, con `sdd-kit:effort-high` + `opus`
- AND con `control.maxParallelAgents: 2` y tres ejes, salen dos y el tercero cuando vuelve uno
- AND los ejes trabajan en el mismo worktree desanclado `review-<id>-a1b2c3d`
- AND un eje colgado se relanza solo, una vez, como dice «Vigía de silencio», y los demás siguen
- AND el hilo recibe los informes por eje y no fusiona ni reordena hallazgos de un eje con los de otro
- AND en `delegate`, si la spec aprobada lleva la línea `Política de modelos:` con esos ejes y las instrucciones del usuario piden confirmar antes de paralelizar, los despacha sin preguntar; un eje que la línea no nombra (el Arquitectura que sube el hilo) se confirma

#### ADDED — El eje Código juzga cada comentario que lista `sdd review comments`

- GIVEN un encargo del eje Código con la salida `src/save.ts:4 · task · // Task 4: validar antes de guardar` y `src/iban.ts:9 · requisito · // requisito del proveedor: el IBAN va sin espacios`, y un bloque «De código» que no habla de comentarios
- WHEN revisa el eje Código
- THEN marca Important `src/save.ts:4`
- AND no marca `src/iban.ts:9` como hallazgo, y lo escribe en «Declined to judge»
- AND una cita del diff que la lista no trae también es hallazgo
- AND con un bloque «De código» que prohíbe citar documentos, una cita a `capabilities/` es Important aunque traiga un motivo

## Topes de palabras

Medido con el conteo de `word-budget.test.ts`, sin el margen del 25 %, que el test aplica aparte (topes efectivos: `SKILL.md` 3.825, total 11.400).

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-verify` `SKILL.md` | 3.567 / 3.825 | 258 | sin cambio (+12 → 3.579) |
| `sdd-verify` total | 9.635 / 11.400 | 1.765 | sin cambio (−4 → 9.631) |

**Saldo: −4 palabras en la skill** (9.635 → 9.631).

| Sube | Palabras | Baja, en `encargo-revision.md` | Palabras |
| --- | --- | --- | --- |
| Fila Code de `SKILL.md` | +12 | «Medido en… 3 de 3 runs» (29 → 3) | −26 |
| Sección con la salida en `code-reviewer-prompt.md` | +12 | «en un proyecto del equipo, 27 minutos…» | −21 |
| Regla de juicio en `code-reviewer-prompt.md` | +70 | «Con el cuerpo de los borrados…» (45 → 15) | −30 |
| | | «Sin esta frase, 2 de 2 sujetos…» (23 → 2) | −21 |
| **Total** | **+94** | **Total** | **−98** |

## Previsión de coste

Cifras con el precio de `tech-stack.md` (~0,4 $ por turno y sujeto), redondeado a 1 $ por sujeto porque un eje Código lee el paquete en varios turnos. El techo de la campaña es la suma.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 1, `f6` de `sdd-verify`, sonnet | 1 |
| GREEN | 1, `f6` | 1 |
| Una tanda de REFACTOR | 1, `f6`, solo si el GREEN falla | 1 |
| Controles | 0: `f6` hace de control si el RED sale limpio, y `f4` no se relanza porque la línea de `// incrementa` no cambia | 0 |
| Medición tras la revisión final | 1, `f6`, solo si la pasada de fix cambia el texto del eje | 1 |
| Suma | hasta 4 sujetos | 4 |

Cada paso cambiado de lo que sigue el agente: la fila Code y las dos piezas de `code-reviewer-prompt.md`, medidas por `f6`; las frases de `encargo-revision.md`, sin medir, porque son evidencia y no instrucción.

## Enmiendas

- 2026-11-01 — La regla de juicio de «Approach» gana un contraejemplo y «never to Issues» (14 palabras); el saldo pasa de −18 a −4 — con la lista y sin ese contraejemplo, `f6` marcó el falso positivo como Minor dos veces (`tests/sdd-verify-0182-comments.md`) — sin aprobar (no cambia ningún THEN; el RED limpio no sacó la frase, porque el GREEN la pidió)


## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-01 | aprobada (opción «Apruebo») |
