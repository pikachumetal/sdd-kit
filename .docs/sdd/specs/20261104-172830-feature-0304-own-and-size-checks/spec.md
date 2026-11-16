---
id: 20261104-172830-feature-0304-own-and-size-checks
feature: 0304
proposal: 0301
title: Las comprobaciones de las skills propias y del tamaño
mode: full
profile: delegate
status: approved
created: 2026-11-04
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-04
---

# Spec — Las comprobaciones de las skills propias y del tamaño

🦆 Hoy nada avisa cuando dos skills dicen la misma regla, cuando una regla absoluta lleva pegada su excepción, cuando una skill sigue en castellano o cuando las skills de una fase no caben tras compactar. Con esta feature, `moon run kit:own` da rojo con cada caso y nombra `fichero:línea`. Por ejemplo, «write everything the user reads in the language of their message» aparece en 5 skills, y «- **`pair`** — para en todos los gates de la tabla.» está en castellano en `control-profiles.md:7`. `kit:skill-size` suma la fase: la skill que manda más las que manda invocar. Para escribir una regla una sola vez, una marca `<!-- kit: incluye <nombre> -->` que el build sustituye por `includes/<nombre>.md`. Todo entra en rojo, y lo ponen en verde las filas 0296, 0305-0310, 0314 y 0316.

Validación: agente — son comprobaciones de herramientas del repo, que se observan enteras en sus tests y en su salida sobre el kit real; el repo valida en campo (`validation.mode: field`).

## Capacidades

- Modificadas: `kit-distribution` — la inclusión que el build expande, las comprobaciones de `kit:own` (frase repetida, absoluta con excepción, prosa en castellano) y el tamaño por skill y por fase de `kit:skill-size`

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (la marca `incluye` y la salida de `kit:own` y `kit:skill-size`, que usan la 0296, las 0305-0310, la 0314 y la 0311), MODIFIED (las reglas de `kit-distribution`), área no explorada (`Reader` de `tests/copies/annotated.ts`, del que sale el texto del kit de una copia) · tamaño: ~600 líneas en ~12 ficheros
- Dominio: si «texto del kit» (propias enteras, bloques de una copia, copias `pending` enteras) deja fuera algún caso de las filas que ponen esto en verde, y si las exclusiones del castellano (citas «…», código) dejan pasar prosa real (señal: contrato público)
- Técnica: si la fase por invocaciones directas y la racha de 10 palabras son deterministas sobre `dist/`, y si la inclusión rompe la comparación de `kit:copies` o `dist.test.ts` (señal: MODIFIED + área no explorada)
- Mínimo razonable: un revisor de siete puntos en Sonnet — deja sin mirar con Opus si las definiciones encajan con las reglas de la propuesta 0301, que es donde la 0302 y la 0312 tuvieron sus Críticos
```

La rúbrica da «ninguna» con 3 señales; la propuse igual porque es el remedio de la fila de deuda de la rúbrica («despachar ese revisor a mano antes del gate»), con tres casos en que la review pedida por el dev-lead encontró lo que faltaba (0302, 0312, 0237). El dev-lead eligió dos revisores.

1. **Las comprobaciones van en sus tareas, no en `kit:build`**: `kit:own` (nueva) y `kit:skill-size` (ampliada), las dos con `deps: ['~:build']` y `cache: false`; el build solo da rojo por un error de construcción. Lo eligió el dev-lead (abajo); el nombre `kit:own` es mío, por «las propias» de la fila.
2. **La inclusión**: la marca es `<!-- kit: incluye <nombre> -->`, sola en su línea, en el texto de un `.md` de `skills/`; `<nombre>` en inglés kebab-case (`[a-z0-9-]+`) y el fichero en `includes/<nombre>.md` en la raíz, que no está en la lista blanca y no viaja suelto. El build primero sustituye cada inclusión por el contenido del fichero, con su salto final, y después quita las demás marcas como hoy.
3. **Avisos de la inclusión**, que paran el build y dejan `dist/` como estaba: `<fichero>:<línea>: la inclusión <nombre> no existe: crea includes/<nombre>.md` · `<fichero>:<línea>: una inclusión va en el texto, fuera de un bloque de código` · `includes/<nombre>.md: una inclusión no lleva marcas del kit`, porque una marca dentro de lo incluido se quitaría sin aviso. En el frontmatter, la inclusión da el aviso de «marca mal puesta» que ya existe.
4. **La inclusión es solo de las propias**: el build la expande en cualquier fichero, y `kit:own` da `<fichero>:<línea>: una inclusión es solo de las propias, y <fichero> es una copia` en toda copia, `pending` incluida. En la fuente anotada de una copia, `kit:copies` da además el rojo que ya da a un campo desconocido, `<fichero>:<línea>: marca del kit sin tarea o con un campo desconocido: incluye <nombre>`; no toco su gramática.
5. **Texto del kit**: un fichero propio entero (`own` en `upstream.json`); de una copia anotada, el contenido de sus bloques `add` y `sustituye`; una copia con `pending` (hoy `sdd-implement`, `sdd-archive`, `spec-writing.md` y `plan-writing.md` de `sdd-propose` y las `references/` de `sdd-verify`), entera, porque sin anotar no se sabe qué es del original, y su fila la anota. Lo que entra por una inclusión no es texto del kit de la skill que lo incluye. Cada `includes/<nombre>.md` se comprueba una vez como texto del kit, con la absoluta con excepción y con el castellano, y sus avisos nombran `includes/<nombre>.md:<línea>`.
6. **De dónde se lee**: `kit:own` lee la fuente de `skills/`, porque solo sus marcas dicen qué es del kit, y saca la salida con las mismas funciones del build, inclusiones expandidas. Recuerda qué líneas de la salida vienen de una inclusión. Sus avisos nombran `dist/skills/…:<línea>`. No compara con `dist/`: con `deps: ['~:build']` y `dist.test.ts` en `cli:test`, ese rojo, que dije en la sección 1, no añadía nada. No ejecuta ni compara bloques de código de las skills, que es lo que rompió el test del ticket de la 0312 §2.
7. **Frase repetida**: una racha de 10 palabras seguidas en dos skills distintas (carpetas de `dist/skills/` distintas), con al menos un lado de texto del kit. El otro lado es cualquier texto de esa skill, también el original de una copia o lo incluido. Una palabra es `[\p{L}\p{N}'’-]+`, en minúsculas. Fuera el frontmatter, los bloques de código y el código en línea. La racha no cruza una línea en blanco, un elemento de lista, un título ni una celda de tabla, y sí las líneas partidas de un mismo párrafo. 10 por lo medido el 2026-11-04 sobre el texto propio: 8 palabras dan 24 grupos, 10 dan 15 y 15 dan 3; sin el código en línea, 10 dan 12; con frases exactas solo salen 2.
8. **Dos copias no se comparan entre sí**: una pareja con los dos lados en bloques del kit de dos copias no da rojo. Una copia no puede incluir, y sus bloques son sustituciones que fuerza su fuente: la 0296 parte `sdd-implement` en dos copias que necesitarán la misma sustitución, y sin esto no llegaría nunca a verde. Una copia contra una propia sí da rojo. `kit:copies` ya vigila cada copia contra su original.
9. **Una línea por frase repetida**: las rachas de 10 palabras que avanzan de una en una en todos sus sitios se juntan en una racha máxima. Las rachas máximas que empiezan por las mismas 10 palabras van en una línea, que cita esas 10 palabras y cada sitio con la primera línea de la racha, ordenados por ruta.
10. **Fuera de la repetición**: `sdd-templates/templates/`, porque una plantilla es lo que el agente calca y la regla de su uso vive en la skill; y `sdd-upgrade/references/migrations/`, porque una migración repite a propósito lo que cambió en su versión. Dentro de una misma skill (su `SKILL.md` y sus `references/`) no cuenta.
11. **Absoluta con excepción**: la frase de texto del kit con `only`, `never`, `always`, `must` o `every` (las de `kit:copies`) y con `except`, `unless` o `instead of`, como palabras enteras y sin distinguir mayúsculas. La frase acaba en `.`, `?` o `!` seguidos de espacio o fin de línea, o al final del párrafo, del elemento de lista o de la celda. No cortan `e.g.`, `i.e.`, `etc.` ni `vs.`, ni un punto dentro de una cita «…». Fuera el código en línea y los bloques de código; las citas cuentan. Hoy son 5.
12. **Prosa en castellano**: la unidad es la línea de `dist/skills/` y de `includes/`, texto del kit y original de las copias (el original está en inglés). Fuera: `sdd-templates/templates/`, el frontmatter salvo la `description`, los bloques de código, el código en línea y las citas «…». Las migraciones de `sdd-upgrade` entran: las traduce la 0316. La heurística la fija el RED (Dónde se prueba).
13. **Fase**: una skill más cada skill del kit que su `SKILL.md` manda invocar, solo las directas; cada una cuenta como mín(caracteres, 20.000) y la fase pasa si suma 100.000 o menos. «Manda invocar» es el nombre de una skill del kit entre comillas invertidas (con o sin `sdd-kit:`) en una de dos formas. La primera, precedido de «invoke», «load» o «**REQUIRED SUB-SKILL:**». La segunda, seguido en la misma frase (el corte de la decisión 11) y sin otro código en medio de «with `Skill`» o «with the `Skill` tool»; en una lista, solo cuenta el último nombre. Fuera los bloques de código. Una negación («never invoke `x`») cuenta igual: sobra antes que falte. Medido el 2026-11-04, la mayor es `sdd-implement` (`sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`), con 80.203.
14. **Límite de la fase**: solo las invocaciones directas, como define la propuesta 0301 («la skill que dirige más las que invoca»). Una sesión que encadena `sdd-propose`, `sdd-implement` y `sdd-archive` no se mide entera: encadenadas, desde `sdd-propose` se llega a casi todo el kit. Una fase de 5 skills topa en 100.000, así que la regla aprieta desde la quinta.
15. **Unidades**: por skill, bytes (como hoy, más estricto con las tildes); por fase, caracteres, como dice la fila.
16. **Textos de `kit:own`**: `<a>:<línea>, <b>:<línea> y <c>:<línea> repiten «<10 palabras>»: déjala en un solo sitio, en includes/ si la necesitan varias propias` (con dos sitios, `<a>:<línea> y <b>:<línea> repiten …`) · `<fichero>:<línea>: absoluta con excepción en la misma frase («<absoluta>» … «<excepción>»): sustituye la regla por una que ya diga su caso` · `<fichero>:<línea>: prosa en castellano; las skills van en inglés: «<línea abreviada>»` · el de la decisión 4 · sin rojos, `Skills al día: <n> ficheros.` y código 0; con alguno, una línea por rojo y código 1.
17. **Textos de `kit:skill-size`**: los de hoy, más `FALLA: la fase de <skill> (<invocadas>) suma <n> caracteres (límite: 100000)` y, sin rojos de fase, `OK: ninguna fase pasa de 100000 caracteres (la mayor, <skill>: <n>)`.
18. **Docs**: `kit:own` entra en la orden del corte de la regla 5 de `CLAUDE.md` y en la lista de tareas de `tech-stack.md` §Herramientas del repo; `includes/` entra en la estructura de `architecture.md`; `.gitattributes` gana `includes/** text eol=lf` y `cli/test/fixtures/own/** text eol=lf`, como `skills/**`.
19. **«Una pieza entra, otra sale» (Art. I)**: nada sale, porque no cambia el texto de ninguna skill; son herramientas del repo que vigilan las reglas que ya existen (Art. III, ADR 0022, el corte de 20.000).
20. **Pasada de coherencia**: `sdd capability merge` sobre una copia de `.docs/sdd` → exit 0, con 6 requisitos añadidos, 1 modificado y 5 reglas sustituidas (resultado tras la review, abajo). `capability check` avisa de que los requisitos nuevos pasan de 500 caracteres. Los dejo así: cada uno es un comportamiento con sus AND, como los 10 vigentes de `kit-distribution` que ya pasan.
- Política de modelos: revisores de la spec dominio opus + effort medium y técnica sonnet + effort medium (hechos) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin sujetos: ninguna skill cambia · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pide `CLAUDE.md`; lo que no nombra se confirma aparte

### Hallazgos de la review

Dominio (Opus):

- **Aceptado** — Crítico: la inclusión en un bloque de código y en el frontmatter cambia el requisito vigente «La skill que carga el agente sale limpia del build», un `MODIFIED` sin declarar → `MODIFIED` declarado. En un bloque de código, la inclusión para el build en vez de quitarse; en el frontmatter, da la «marca mal puesta» de hoy (decisiones 2 y 3, tabla de lo que cambia).
- **Aceptado** — Crítico: dos copias con la misma sustitución, como las dos de la 0296, darían un rojo sin remedio, porque una copia no puede incluir → la pareja copia-copia no cuenta (decisión 8), y el aviso dice «déjala en un solo sitio» (decisión 16).
- **Rechazado** — Crítico: las migraciones de `sdd-upgrade` en castellano serían un rojo permanente → no lo son: la sesión `develop` asigna su traducción a la 0316 («la 0316 (las migraciones al inglés, tras ti)»), que ahora está entre las filas que lo ponen en verde.
- **Aceptado** — `includes/` quedaba sin vigilar → cada inclusión se comprueba una vez con la absoluta con excepción y con el castellano (decisión 5).
- **Aceptado** — «with `Skill`» solo no ve `sdd-verify`, que `sdd-implement` declara como «**REQUIRED SUB-SKILL:**» → «manda invocar» suma «invoke», «load» y «**REQUIRED SUB-SKILL:**»; la fase de `sdd-implement` pasa de 60.203 a 80.203. El límite de la sesión encadenada queda escrito (decisiones 13 y 14).
- **Aceptado** — el código en línea contaba en la racha → fuera, como en las otras dos comprobaciones: los grupos bajan de 15 a 12 (decisión 7).
- **Aceptado** — faltaba la «Regla ante conflicto» → sustituida con `includes/` como fuente y qué manda entre una inclusión y el mismo texto escrito a mano.
- **Aceptado** — los GIVEN usaban ficheros reales que caducan con las filas que los arreglan, y una skill `lider` → fixtures inventadas (`example-a`, `example-b`, `lead`); los datos reales van al walkthrough.
- **Aceptado** — una inclusión en una copia `pending` pasaba sin rojo → `kit:own` la da en toda copia (decisión 4).
- **Aceptado** — la 0316 faltaba entre las filas que lo ponen en verde → añadida en el 🦆 y el Intent.

Técnica (Sonnet):

- **Aceptado** — Crítico: no se decía cómo ve `kit:own` lo incluido → expande con la función del build y recuerda qué líneas vienen de una inclusión (decisión 6), con un escenario de dos propias que incluyen y una tercera a mano.
- **Aceptado** — Crítico: orden entre la inclusión y quitar marcas → primero la inclusión (decisión 2), con el aviso exacto de `kit:copies` (decisión 4) y un escenario de una propia con una inclusión y otra marca.
- **Aceptado** — juntar rachas no era determinista → regla de la decisión 9, con un caso de 12 palabras y otro de dos rachas separadas.
- **Aceptado** — qué es palabra y si la racha cruza líneas o celdas → decisión 7.
- **Aceptado** — el corte de frase se rompía con `e.g.` y con un punto dentro de «…» → decisión 11, con un escenario de `e.g.`.
- **Aceptado** — la fase no definía su corte ni las listas ni las negaciones → decisión 13.
- **Aceptado** — «ninguna línea de las skills ya traducidas» no se podía verificar → la muestra etiquetada pasa a fixture de `cli/test/fixtures/own/` y el inventario de `develop` se versiona en `red/`. Sobre el kit real, la comprobación da como mínimo esos 21 ficheros, y cada uno de más se revisa a mano. El inventario es de mínimo y no exacto, porque la heurística de `develop` se deja las líneas cortas (Dónde se prueba).
- **Rechazado** — sin `includes/**` en los `inputs` de `kit:build` la caché de moon daría `dist/` viejo → `kit:build` no tiene `inputs` y va con `cache: false` (`moon.yml`), y `kit:own` irá igual: siempre corre.
- **Aceptado** — faltaban los tests existentes que cambian → `dist.test.ts` y `copies.test.ts` en la tabla de lo que cambia y en Dónde se prueba.
- **Rechazado** — el 10, el 100.000, el mín por skill y las unidades no estaban en ✋ → ya estaban, en las decisiones 7, 13 y 15 de la primera versión.

### Decisiones tomadas con el dev-lead

- Las comprobaciones entran en rojo — al revisar la solución de la propuesta 0301 (prompt de arranque).
- Cada comprobación en su tarea, como `kit:copies`, y el build da rojo solo por un error de construcción — «1» (2026-11-04).
- La comprobación del castellano de `skills/`, propuesta por la sesión `develop`, entra en esta feature y sale de la 0316 — «1» (2026-11-04).
- La inclusión, la frase repetida y las excepciones como en la sección 1 del diseño — «ok» (2026-11-04).
- El tamaño por skill y por fase como en la sección 2 — «ok» (2026-11-04).
- El castellano como en la sección 3 — «ok» (2026-11-04).
- Review con dos revisores, dominio en Opus y técnica en Sonnet, y la spec aprobada por delegación tras incorporar sus hallazgos — «1, y te pre apruebo la spec» (2026-11-04).

## Intent

La 0299 contó a mano 33 reglas repetidas entre skills, 5 ya divergentes, y nada impide que vuelva a pasar: un arreglo de un ticket añade la regla donde le duele, o la pega a la absoluta como excepción, contra las tres reglas de la ADR 0022. Además, según el inventario de la sesión `develop` del 2026-11-04 (en `3d326c3e`), 21 ficheros de `skills/` siguen en castellano sin que nadie lo viera, y el corte de 20.000 caracteres solo se mide por skill, no por lo que vuelve a cargar una fase tras compactar. El éxito es que las filas que reescriben o traducen skills (0296, 0305-0310, 0314 y 0316) tengan un rojo con `fichero:línea` para cada uno de estos casos y cierren con él en verde. Sería un fracaso que el rojo saliera en un sitio donde se aprende a ignorarlo (`kit:build`), o que diera falsos positivos en las skills ya traducidas, porque entonces nadie lo lee.

## Scope

- Entra: la marca de inclusión y su expansión en `build/dist.ts`, con sus avisos; `tests/own/check.ts` (`kit:own`) con la frase repetida, la absoluta con excepción, la prosa en castellano y la inclusión en una copia; la fase en `tests/skill-size/check.ts`; la tarea `kit:own` en `moon.yml`; los tests en `cli/test/kit/` (`own.test.ts`, la inclusión en `dist.test.ts`, la inclusión en una copia anotada en `copies.test.ts`, la fase en `skill-size.test.ts`) y la muestra del castellano en `cli/test/fixtures/own/`; `.gitattributes`; `CLAUDE.md` regla 5; `tech-stack.md` §Herramientas del repo; `architecture.md` (estructura); el delta de `kit-distribution`.
- Entra, si el RED lo exhibe: ajustar la heurística del castellano hasta que encuentre los ficheros del inventario de `develop` sin falsos positivos.
- No entra: reescribir o traducir skills, ni crear ninguna inclusión real (0296, 0305-0310, 0314, 0316); meter `kit:own` o `kit:skill-size` en el pre-commit o la CI (0311); cambiar la gramática ni los rojos de `kit:copies`; medir la sesión encadenada entera (decisión 14).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Una línea entera `<!-- kit: … -->` se quita; ahora `incluye` se sustituye en el texto y para el build en un bloque de código | `capabilities/kit-distribution.md`, «La skill que carga el agente sale limpia del build»; `build/dist.ts:37-54` (`isMarkToDrop`, `stripMarks`) | delta, `MODIFIED`, y `ADDED` «Una inclusión se escribe una vez y el build la expande» |
| Orden del corte de la release, gana `kit:own` | `CLAUDE.md:34` (regla 5) | Scope |
| Lista de tareas moon fuera del gate, gana `kit:own` y la fase en `kit:skill-size` | `.docs/sdd/tech-stack.md:6` | Scope |
| Salida de `kit:skill-size` sin rojos, gana la línea de la fase | `cli/test/kit/skill-size.test.ts:28` (espera la línea de hoy sola); `tests/skill-size/check.ts:27` | Scope |
| Tests de `stripMarks` y `buildDist`, ganan la inclusión | `cli/test/kit/dist.test.ts:15-73` | Scope |
| Tests de la gramática de la marca de `kit:copies`, ganan `incluye` en una copia | `cli/test/kit/copies.test.ts` | Scope |
| Comentario de `kit:skill-size`, «hoy cinco skills pasan del límite» | `moon.yml:51-52` | sin cambio: sigue siendo cierto, y la fase hoy no da rojo |

- Filas que implementa: 0304 → `.docs/sdd/roadmap.md:140`, la cierra `sdd-archive`; la línea del castellano de la 0316 la quita la sesión `develop`, ya avisada. En `capabilities/` y `skills/` no la nombra nadie: comprobado con `grep -rn "0304" .docs/sdd/capabilities skills`.

## Approach

El rojo sale en tareas propias, como `kit:copies` de la 0302 (decisión del dev-lead): `kit:build` sigue siendo verde mientras construya bien, para que su rojo signifique «`dist/` está mal». Se descartó meterlas en `build/dist.ts`, que daría rojo en cada reconstrucción durante semanas.

`kit:own` reutiliza tres piezas que ya existen: la clasificación `own`/copia de `build/sources.ts`, el lector de marcas de `tests/copies/annotated.ts` para el texto del kit de una copia, y la expansión y `stripMarks` del build para la salida. La frase repetida se mide por rachas de 10 palabras y no por frases exactas, que se dejan 10 de los 12 grupos medidos.

La fase se mide con invocaciones directas, no con la cadena entera. Encadenadas, desde `sdd-propose` se llega a casi todo el kit, y la propuesta 0301 la define como «la skill que dirige más las que invoca».

La heurística del castellano no se fija en la spec: la fija un RED sobre el texto real (abajo), porque la de `develop` se deja las líneas cortas.

## Dónde se prueba

- La inclusión: en `cli/test/kit/dist.test.ts`, con una fuente y un `includes/` en un directorio temporal, como los tests de `stripMarks` y `buildDist`. Cada aviso lleva su fixture, y hay una propia con una inclusión y otra marca.
- La inclusión en una copia anotada: en `cli/test/kit/copies.test.ts`, como los tests de la gramática de la marca.
- La frase repetida, la absoluta con excepción, el castellano y la inclusión en una copia: en `cli/test/kit/own.test.ts` (nuevo), con un `skills/`, un `includes/` y un `upstream.json` mínimos en un directorio temporal, como `skill-size.test.ts`. Hay un caso por THEN y AND, más los de la review: racha de 12 palabras, dos rachas separadas en la misma pareja, `e.g.` dentro de una frase y dos copias con el mismo bloque.
- La fase: en `cli/test/kit/skill-size.test.ts`, con skills de relleno que se invocan con «invoke `<x>` with `Skill`» y con «**REQUIRED SUB-SKILL:**»: 100.000 exactos pasa, 100.001 da rojo, y una skill nombrada sin ninguna de las dos formas no cuenta.
- La heurística del castellano, RED antes del GREEN: una muestra etiquetada a mano en `cli/test/fixtures/own/spanish-sample.md`, que lee `own.test.ts`. Lleva líneas cortas, títulos (`## Restricciones de código`), celdas de tabla y líneas en inglés con citas «…» o código en castellano. El inventario de `develop` (21 ficheros, medido en `3d326c3e` con una heurística que se deja las líneas cortas), con sus rutas, se versiona en `red/spanish-inventory.md` de esta carpeta como contrato de mínimo. Pasa si marca cada línea en castellano de la muestra y ninguna en inglés, y si sobre el kit real da como mínimo esos 21 ficheros. Cada fichero de más se revisa a mano: entra en el inventario si tiene castellano de verdad, y si es un falso positivo se arregla la heurística.
- El kit real: la salida de `moon run kit:own` y `moon run kit:skill-size` sobre la rama, guardada en el walkthrough como la lista de rojos con la que arrancan las filas que los ponen en verde.

## Términos y ADR

- Términos resueltos: **texto del kit** — lo que escribió el kit en una skill: un fichero propio entero, los bloques `add` y `sustituye` de una copia, una copia `pending` entera y cada `includes/<nombre>.md`; nunca el original de una copia ni lo que entra por una inclusión en la skill que lo incluye · **fase** — una skill más las que su `SKILL.md` manda invocar, solo las directas · **inclusión** — un fichero de `includes/` que el build pone en el sitio de su marca (se evita «partial» y «snippet»)
- ADR candidatas: ninguna — dónde corre cada comprobación se cambia moviendo una tarea de moon, y la regla de una regla en un solo sitio ya está en la ADR 0022

## Delta de comportamiento

### Capacidad: `kit-distribution`

#### MODIFIED — La skill que carga el agente sale limpia del build (antes: "una línea entera `<!-- kit: … -->` dentro de un bloque de código también se quita")

- GIVEN `skills/sdd-tdd/SKILL.md` con una línea `<!-- kit: 0186 · sustituye: «…» -->` encima de un bloque
- WHEN se ejecuta `moon run kit:build`
- THEN `dist/skills/sdd-tdd/SKILL.md` es esa fuente sin esa línea, y lo demás byte a byte
- AND una fuente sin marcas sale idéntica en `dist/`
- REMOVED AND una línea entera `<!-- kit: … -->` dentro de un bloque de código también se quita; un `<!-- kit:` con texto delante o detrás dentro de un bloque de código se copia tal cual
- AND una línea entera `<!-- kit: … -->` dentro de un bloque de código también se quita, salvo `<!-- kit: incluye <nombre> -->`, que para el build con `<fichero>:<línea>: una inclusión va en el texto, fuera de un bloque de código`; un `<!-- kit:` con texto delante o detrás dentro de un bloque de código se copia tal cual
- AND una `<!-- kit: incluye <nombre> -->` en el texto no se quita: el build la sustituye antes de quitar las demás marcas
- AND una línea con `<!-- kit:` y texto delante o detrás, sin cerrar, o en el frontmatter, para el build con `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código`, y `dist/` no cambia

#### ADDED — Una inclusión se escribe una vez y el build la expande

- GIVEN `includes/user-language.md` con «Write everything the user reads in the language of their message.» y `skills/example-a/SKILL.md` con la línea `<!-- kit: incluye user-language -->` en su texto y una `<!-- kit: 0186 -->` más abajo
- WHEN se ejecuta `moon run kit:build`
- THEN `dist/skills/example-a/SKILL.md` lleva el contenido de `includes/user-language.md` en el sitio de la inclusión, sin la otra marca, y lo demás byte a byte
- AND `dist/` no tiene `includes/`
- AND una inclusión cuyo fichero no existe para el build con `skills/example-a/SKILL.md:<línea>: la inclusión user-language no existe: crea includes/user-language.md`, y `dist/` no cambia
- AND un `includes/<nombre>.md` con una línea `<!-- kit: … -->` para el build con `includes/<nombre>.md: una inclusión no lleva marcas del kit`
- AND en la fuente anotada de una copia, `kit:copies` da `<fichero>:<línea>: marca del kit sin tarea o con un campo desconocido: incluye user-language`
- AND en cualquier copia, `pending` incluida, `kit:own` da `<fichero>:<línea>: una inclusión es solo de las propias, y <fichero> es una copia`

#### ADDED — Una frase del kit repetida en otra skill da rojo

- GIVEN `skills/example-a/SKILL.md` y `skills/example-b/SKILL.md`, propias, cada una con «Write everything the user reads in their language, skill announcements included.»
- WHEN corre `moon run kit:own`
- THEN da `dist/skills/example-a/SKILL.md:<línea> y dist/skills/example-b/SKILL.md:<línea> repiten «write everything the user reads in their language skill announcements»: déjala en un solo sitio, en includes/ si la necesitan varias propias`
- AND una palabra es `[\p{L}\p{N}'’-]+`, en minúsculas; repetida es una racha de 10 palabras seguidas en dos carpetas distintas de `dist/skills/`, fuera del frontmatter, de los bloques de código y del código en línea
- AND la racha no cruza una línea en blanco, un elemento de lista, un título ni una celda de tabla, y sí las líneas partidas de un mismo párrafo
- AND una racha de 12 palabras da una sola línea; dos rachas separadas en la misma pareja dan dos
- AND con la misma racha en tres skills, la línea nombra los tres sitios, ordenados por ruta
- AND dos copias anotadas que comparten una racha, en su original o en sus bloques del kit, no dan rojo; el bloque del kit de una copia que repite una propia sí lo da
- AND la racha que entra por `<!-- kit: incluye user-language -->` en dos propias no da rojo; la misma racha escrita a mano en una tercera sí
- AND una racha repetida entre el `SKILL.md` de una skill y sus `references/`, o dentro de `sdd-templates/templates/` o de `sdd-upgrade/references/migrations/`, no da rojo
- AND una copia con `pending` cuenta entera como texto del kit

#### ADDED — Una absoluta con su excepción en la misma frase da rojo

- GIVEN `skills/example-a/SKILL.md`, propia, con «The validation is never removed, except with `validation.mode: field`, which does it in the field.»
- WHEN corre `moon run kit:own`
- THEN da `dist/skills/example-a/SKILL.md:<línea>: absoluta con excepción en la misma frase («never» … «except»): sustituye la regla por una que ya diga su caso`
- AND las absolutas son `only`, `never`, `always`, `must` y `every`, y las excepciones `except`, `unless` e `instead of`, como palabras enteras y sin distinguir mayúsculas
- AND la frase acaba en `.`, `?` o `!` seguidos de espacio o de fin de línea, o al acabar el párrafo, el elemento de lista o la celda; no la cortan `e.g.`, `i.e.`, `etc.` ni `vs.`, ni un punto dentro de una cita «…»
- AND «Never skip the gate, e.g. for a typo, unless the user asks.» da rojo; la absoluta en una frase y la excepción en la siguiente, no
- AND el código en línea y los bloques de código no cuentan, y una frase del original de una copia, fuera de sus bloques del kit, tampoco
- AND en `includes/<nombre>.md` el aviso nombra `includes/<nombre>.md:<línea>`

#### ADDED — La prosa en castellano de una skill da rojo

- GIVEN `skills/example-a/references/profiles.md:7` con «- **`pair`** — para en todos los gates de la tabla.»
- WHEN corre `moon run kit:own`
- THEN da `dist/skills/example-a/references/profiles.md:7: prosa en castellano; las skills van en inglés: «- **`pair`** — para en todos los gates de la tabla.»`
- AND una línea corta como `## Restricciones de código` también da rojo
- AND «Open with `Ahora: <qué haces>` and a counter like «van 7 de 15».», con el castellano solo en código en línea y en una cita «…», no da rojo
- AND quedan fuera `sdd-templates/templates/`, el frontmatter salvo la `description`, los bloques de código, el código en línea y las citas «…»
- AND en `includes/<nombre>.md` el aviso nombra `includes/<nombre>.md:<línea>`

#### ADDED — Lo que dice kit:own

- GIVEN el kit con rojos de las cuatro clases (repetida, absoluta con excepción, castellano e inclusión en una copia)
- WHEN corre `moon run kit:own`
- THEN primero reconstruye `dist/` con `kit:build`, y escribe una línea por rojo y sale con código 1
- AND sin ningún rojo escribe `Skills al día: <n> ficheros.`, con `<n>` los `.md` de `dist/skills/` y de `includes/` que mira, y sale con 0
- AND no corre en el pre-commit ni en la CI

#### ADDED — Ninguna skill ni ninguna fase pasa de su tamaño

- GIVEN `dist/skills/example-a/SKILL.md` de 20.000 bytes
- WHEN corre `moon run kit:skill-size`
- THEN da `FALLA: dist/skills/example-a/SKILL.md ocupa 20000 bytes (límite: menos de 20000)` y sale con código 1
- AND con una skill `lead` de 20.000 caracteres que manda invocar cinco skills de 19.000 (`a`, `b`, `c`, `d`, `e`), da `FALLA: la fase de lead (a, b, c, d, e) suma 115000 caracteres (límite: 100000)`
- AND cada skill de la fase cuenta como mín(caracteres, 20.000), y una fase de 100.000 exactos pasa
- AND manda invocar una skill del kit entre comillas invertidas, con o sin `sdd-kit:`, precedida de «invoke», «load» o «**REQUIRED SUB-SKILL:**», o seguida en la misma frase y sin otro código en medio de «with `Skill`» o «with the `Skill` tool»; en «closing in `example-b`: invoke `example-c` with `Skill`» cuenta `example-c` y no `example-b`
- AND una skill nombrada sin ninguna de esas formas, o dentro de un bloque de código, no cuenta, y solo cuentan las invocaciones directas, no las de las skills invocadas
- AND sin rojos escribe `OK: todos los SKILL.md ocupan menos de 20000 bytes` y `OK: ninguna fase pasa de 100000 caracteres (la mayor, <skill>: <n>)`, y sale con 0

#### Reglas de la capacidad — kit-distribution

- **Dónde viven los datos**: la versión de cada fuente de terceros, solo en `upstream.json`, en la raíz del repo, que no viaja, y en los avisos que salen de él; nunca en el texto de una skill. También vive allí si cada fichero de `skills/` es copia o propia (`own`) y qué ficheros de la carpeta de una copia no se copian (`notCopied`). La versión del plugin, solo en `.claude-plugin/plugin.json` de la raíz; `dist/.claude-plugin/plugin.json` es su copia generada. Lo que viaja, en `dist/`, generado desde `skills/` y la lista blanca. Qué frase de una copia es del kit, solo en las marcas de su fuente anotada en `skills/`. Una regla que necesitan dos propias, solo en `includes/<nombre>.md`, en la raíz, que no viaja: el build la pone en cada skill que la incluye; una copia no incluye, y su texto del kit vive en sus bloques.
- **Idioma de los nombres**: rutas y claves en inglés (`upstream.json`, `kind`, `copy`, `concept`, `pending`, `from`, `own`, `notCopied`, `includes/`, `kit:own`); los campos de la marca y los mensajes, en castellano (`sustituye`, `quita`, `de`, `arregla`, `fin`, `incluye`); el `<nombre>` de una inclusión, en inglés kebab-case.
- **Límites**: una copia conserva al menos el 50 % de su original base, medido por frases de 6 palabras; si no, es propia. Las absolutas son `only`, `never`, `always`, `must` y `every`; las excepciones, `except`, `unless` e `instead of`. La cita S de una marca no lleva `«`, `»` ni `-->`. Una versión escrita en el texto es la clave o el `repo` de una fuente, entre comillas invertidas opcionales, espacios y `v?N.N[.N…]` (`` `?(<clave>|<repo>)`?\s+v?\d+(\.\d+)+ ``), en un `.md` de `skills/` fuera de `migrations/`. Una frase repetida es una racha de 10 palabras en dos skills. Un `SKILL.md` de `dist/` ocupa menos de 20.000 bytes, y una fase suma 100.000 caracteres o menos, con cada skill contada como mín(caracteres, 20.000).
- **Avisos**: `dist/ no es lo que sale del build: ejecuta moon run kit:build` · `<fichero> no es lo que sale de upstream.json: ejecuta moon run kit:notices` · `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código` · `<fichero>:<línea>: una inclusión va en el texto, fuera de un bloque de código` · los de la inclusión del requisito «Una inclusión se escribe una vez y el build la expande» · `<fuente>: licencia <licencia> sin plantilla en build/notices.ts` · los de `kit:upstream` del requisito «El corte compara cada entrada del registro con su fuente» · los de `kit:copies` y `kit:copies-update` de los requisitos «Una copia es su original más bloques del kit marcados», «Lo que sustituye una marca es lo que el bloque quita», «Una frase sustituida no queda al lado de la del kit», «Un añadido junto a una absoluta del original da rojo», «La marca del kit se escribe con su gramática», «Lo que dice kit:copies de cada copia», «Una copia que ya no lo es da rojo», «La fuente de una copia va en LF», «Un fichero de la fuente sin mapear da rojo» y «Actualizar una copia es fusionarla con git merge-file» · los de `kit:own` de los requisitos «Una frase del kit repetida en otra skill da rojo», «Una absoluta con su excepción en la misma frase da rojo», «La prosa en castellano de una skill da rojo» y «Lo que dice kit:own» · los de `kit:skill-size` del requisito «Ninguna skill ni ninguna fase pasa de su tamaño» · `<fichero> no está clasificado en upstream.json: ponlo en una entrada copy o en own` · `upstream.json: la entrada <n> es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero` · `<fichero> dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera` · `<fichero>:<línea>: la versión de una fuente vive en upstream.json, no en el texto: «<trozo>»`.
- **Regla ante conflicto**: manda la fuente (`skills/`, `includes/`, `upstream.json`), y `dist/` y los avisos se regeneran; nunca se edita `dist/` a mano. Entre una copia y su original manda el original en su tag: una diferencia sin marca es un rojo de la copia, nunca del original. Entre una inclusión y el mismo texto escrito a mano en otra propia manda la inclusión: el rojo es de la skill que lo escribe a mano.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/tech-stack.md` | 22.296 / 24.579 (19.663 × 1,25) | 2.283 | sin cambio (previsto +25) |
| `.docs/sdd/architecture.md` | 2.133 / 2.375 (1.900 × 1,25) | 242 | sin cambio (previsto +15) |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-04 | aprobada: «1, y te pre apruebo la spec» (por delegación, tras incorporar los hallazgos de la review) |
