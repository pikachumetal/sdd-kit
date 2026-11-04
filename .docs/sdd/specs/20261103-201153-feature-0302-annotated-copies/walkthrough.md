---
id: 20261103-201153-feature-0302-annotated-copies
feature: 0302
title: Walkthrough — Las copias anotadas contra su fuente
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-04
---

# Walkthrough — Las copias anotadas contra su fuente: la marca, las comprobaciones, el registro fichero a fichero y la actualización

## 1. Cambios realizados

- **La marca y las comprobaciones** (Task 1, `568e9edd`). `tests/copies/annotated.ts` lee la fuente anotada de una copia: marcas de bloque con `sustituye`, `quita`, `de` y `arregla`, cerradas con `fin`. Da cada rojo de la copia frente a su original:
  - líneas que no casan;
  - texto quitado sin marca;
  - citas que no cuadran o viejas;
  - A+C;
  - añadido junto a una absoluta;
  - la gramática;
  - fragmentos de otra fuente;
  - CRLF;
  - conflictos;
  - lo que conserva del original.

  Comparte con `build/dist.ts` la lectura de vallas, frontmatter y marcas.
- **El registro fichero a fichero** (Task 2, `7163f5c8`).
  - `upstream.json` pasa a una entrada `copy` por fichero, con `from`, `pending`, `own` y `notCopied`.
  - Tests nuevos: cada fichero de `skills/` es copia o propia, y una skill que remite a su `NOTICE` lo tiene.
  - Pasan a concepto `sdd-rubber-duck`, `sdd-grilling`, `code-review` de mattpocock, OpenSpec en `sdd-verify` y los ports.
  - Los `NOTICE` se regeneran agrupados por fuente y versión, y `kit:upstream` vigila también los `from`.
  - `skills/` va en LF (`.gitattributes`), y el tope de palabras cuenta `dist/skills/`.
- **`kit:copies`** (Task 3, `e318a8ff`). `tests/copies/check.ts` lee los originales de los clones sin red. En el repo solo da líneas `… sin anotar → <fila>`.
- **`kit:copies-update`** (Task 4, `a7671ddf`). `tests/copies/update.ts` fusiona con `git merge-file` en una carpeta temporal y lista los bloques de cada conflicto. El experimento de la review va como fixture, en `cli/test/fixtures/copies/`, y da sus 2 conflictos: B4 y B5.
- **Enmienda del 2026-11-03: marcas dentro de una valla** (Task 5, `f77e05fb`). El build quita también una marca de línea entera dentro de una valla, y ahí un bloque acaba en `fin`, en la marca siguiente o en el cierre de la valla. La misma prueba real afinó dos reglas: el alineado ancla en las líneas con texto, y A+C mira si la cita vuelve en su sitio.
- **Prueba real con copias** (decisión 12): `real-copies/`, con el borrador de anotación y su resultado.
  - Las 15 copias `.md` de la 0312 salen idénticas a su texto de hoy.
  - Los únicos rojos son 6 de absoluta, uno en cada una de estas: `sdd-tdd`, `sdd-debugging`, `sdd-worktrees`, `sdd-parallel-agents`, `sdd-verify` y `sdd-agent-writing`. Es la cabecera «Write everything the user reads…» pegada al párrafo del Overview.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3 h
- Esfuerzo real: 2,05 h — reloj de la sesión 13,86 h desde 2026-11-03T19:56Z, sin 53 min de espera al dev-lead (7 esperas), sin 10,92 h sin actividad (1 hueco)
- Desviación: −0,95 h (−32 %)
- Causa de la desviación: la estimación no aplicó el ratio de la 0300 (0,33, del mismo tipo). Las esperas (20:27Z 25 min, 21:03Z 14 min, 21:48Z 9 min y otras 4 de 0-2 min) y el hueco nocturno (21:58Z, 655 min) ya están fuera del real.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución)
- Tokens del hilo: 141.473.677 — claude-opus-5-5 141.473.677
- Tokens de subagentes: 13.853.023 en 6 despachos — Revisor de spec, lente dominio claude-opus-5-5 363.633 / 3 min; Final review — Spec axis claude-opus-5-5 4.619.048 / 6 min; Final review — Architecture axis claude-opus-5-5 3.743.965 / 5 min; Revisor de spec, lente técnica claude-sonnet-5-5 125.685 / 2 min; Final review — Code axis claude-sonnet-5-5 2.329.196 / 4 min; Re-revisión de la revisión final claude-opus-5-5 2.671.496 / 6 min
- Coste de la sesión: 56,31 $ (hilo 47,39 $ + subagentes 8,93 $)
- Coste de sujetos: no aplica
- Review de spec: 2 revisores · hallazgos 20, aceptados 20 (17 con cambio y 3 como límite declarado)

## 3. Desviaciones del plan

- **Task 5 nueva, por enmienda aprobada** («1», 2026-11-03). La prueba real de la decisión 12 exhibió que los cambios del kit dentro de una valla de código no se podían marcar.
- **Cómo se aplican las decisiones 3 y 4**: ningún THEN cambia, pero sí el criterio de la spec, y lo dejo escrito porque la 0312 anotará con él.
  - **Decisión 3, «S cuadra con lo quitado».** Las S de un sitio casan, en orden, con tramos de lo que el sitio quita del original, con `…` dentro de cada tramo. Lo que queda fuera de esos tramos tiene que volver en el bloque, en orden. Una S que empieza o acaba con dos o más palabras que el bloque conserva cita de más. Con la regla literal, cualquier frase del kit que reutiliza palabras del original («Seven things stop you» frente a «Four things stop you») partía lo quitado en trozos y ninguna S cuadraba.
  - **A+C.** Es una cita cuyas palabras vuelven todas, en su sitio, dentro del bloque. Buscar el trozo en todo el bloque daba falsos A+C: «##» al pasar de `##` a `###`, o una palabra que el bloque usa en otro sitio. Hubo 26 en `skill-testing.md` en la prueba real.
  - **Decisión 4.** El alineado va en dos pasadas: primero las líneas con texto, que fijan los sitios, y después, dentro de cada hueco, las líneas en blanco. La «vecina anterior» del aviso de borrado es la última línea con texto que casa. Con una sola pasada, la línea en blanco tras un bloque partía lo que quita un bloque de varios párrafos.
  - **La línea en blanco que acaba un bloque es del bloque.** Sin eso, un añadido en su propio párrafo siempre sumaba una línea en blanco sin marca.
  - **Dentro de una valla** (enmienda), un bloque acaba también en el cierre de la valla.

### Decisiones tomadas sin el dev-lead

- Task 1: Ruling: el formato de las citas en los mensajes no lo fija la spec salvo por sus ejemplos — un texto citado de más de 6 palabras se abrevia a sus 6 primeras más «…» («Never start implementation on a main/master…»); en el aviso de A+C, la S se muestra como su primer trozo más «…» si tiene más («Four things stop you, and only these…»), que es lo que dan los dos ejemplos del delta — si es un error, cuesta cambiar una función de formato
- Task 1: Ruling: «S cuadra con lo quitado» de la decisión 3 no aguanta texto real: el diff por palabras parte lo quitado en trozos cada vez que la frase del kit reutiliza palabras del original («Seven things stop you» frente a «Four things stop you»), y entonces ninguna S de la spec cuadra — lo implemento así, con los mismos THEN: (1) las S de las marcas de un sitio casan, en orden, con tramos de lo que el sitio quita del original, con … dentro; (2) lo que queda fuera de esos tramos tiene que volver en el bloque, en orden; (3) A+C: un trozo literal de S que vuelve dentro del bloque; (4) una S que empieza o acaba con dos o más palabras que el bloque conserva cita de más («… to create»); el aviso de no cuadrar da lo quitado estricto — si es un error, cuesta reescribir checkSite, y la 0312 vería falsos rojos o verdes al anotar
- Task 1: Ruling: la línea en blanco que acaba un bloque es del bloque — sin eso, un añadido del kit en su propio párrafo siempre añade una línea en blanco sin marca; una línea en blanco que parte un párrafo del original sigue dando rojo — si es un error, cuesta una regla del lector de bloques
- Task 1: Ruling: una línea cambiada sin marca da dos rojos, la línea que no casa y lo que falta del original en la vecina anterior; los dos son ciertos — si es un error, cuesta filtrar uno
- Task 2: Ruling: la entrada de OpenSpec de sdd-verify pasa de copy a concept (0-1 % literal, la medida de la decisión 8), con su versión v1.14.1 sin tocar para la 0297; su kit de carpeta chocaba con las copias fichero a fichero de references/ — el NOTICE de sdd-verify pierde también OpenSpec, que la decisión 17 no nombraba — si es un error, cuesta devolverla a copy con pending 0297 y kit de fichero
- Task 2: Ruling: el test «rejects an entry with an unknown kind or source» del RED usaba la fuente «Otra», que el toy nuevo ya tiene; pasa a «Ninguna» — cambio de dato del propio test, no de comportamiento
- Task 2: Ruling: un fichero en una copia y en own a la vez da el mismo mensaje que uno sin clasificar, literal del requisito («falla igual») — si es un error, cuesta un mensaje
- Task 2: Ruling: kit:upstream da las mismas entradas en rojo que antes, fichero a fichero, más una línea nueva: skills/writing-skills/testing-skills-with-subagents.md no existe en superpowers v7.0.1 (el registro de antes no la nombraba) — es estado real, lo resuelve la 0312 al subir sdd-agent-writing — sin coste
- Task 2: Ruling: el pre-commit paró en cli/test/kit/skills.test.ts:118 («toda skill adaptada de otra fuente lleva NOTICE»), que el repaso de coherencia no encontró: las atribuciones de sdd-grilling y sdd-rubber-duck pasan de «Adapted from … (MIT, see `NOTICE`)» a «Inspired by … (MIT)», porque un concepto no es una adaptación — va más allá del literal de la decisión 15 («(MIT)»); el THEN y «Dónde se prueba» no cambian — si es un error, cuesta dos palabras; primer fix descubierto
- Task 3: Ruling: prueba real (decisión 12), con un borrador de anotación generado por un script del scratchpad: defense-in-depth.md y writing-good-tests.md dan 0 rojos y su salida es la de hoy; code-reviewer-prompt.md (todo el prompt va en una valla en superpowers) y sdd-parallel-agents (un cambio dentro de un ```text) fallan, porque una marca dentro de una valla no es marca (build de la 0300) y quitar la línea que abre una valla desplaza todas las vallas siguientes — es un desvío de la spec (requisito de la 0300 «un <!-- kit: dentro de un bloque de código se copia tal cual» y decisión 2), paro tras el commit de la Task 3 a pedir la enmienda
- Task 3: Ruling: en sdd-parallel-agents, la frase del kit «Write everything the user reads… Forked from…» pegada al párrafo del Overview, que tiene «never», da el rojo de añadido junto a una absoluta: es un falso positivo del filtro (no contradice nada) y lo verá cada copia con esa cabecera; la 0312 la anota en su propio párrafo — sin coste aquí
- Task 3: Ruling: enmienda 2026-11-03 aprobada («1»): marcas dentro de una valla, en la Task 5 al final
- Task 4: Ruling: kit:copies-update sale con 1 si queda algo que mirar (un conflicto o una copia saltada) y con 0 si todo fusiona limpio; la spec no fija el código — si es un error, cuesta una línea
- Task 4: Ruling: el fixture del experimento cita en B1 lo que el bloque quita de verdad («Four…first (a merge, a push to a shared branch, a publish); and…guess.»), no «Four…stop and ask.» de la review, porque el bloque del kit vuelve a decir «For those, stop and ask.»; la fusión da los 2 conflictos de la review (B4 y B5) — sin coste
- Task 5: Ruling: el alineado de la decisión 4 pasa a dos pasadas: LCS de las líneas con texto, que fija los sitios, y dentro de cada hueco las líneas en blanco en orden; una línea en blanco de más sigue siendo texto sin marca — con una sola pasada, la línea en blanco tras un bloque casaba con la primera libre del original y partía en dos lo que quita un bloque de varios párrafos (la prueba real de code-reviewer-prompt.md, y el hallazgo 3 de la revisión técnica); la «vecina anterior» del aviso de borrado pasa a ser la última línea con texto que casa, y el test de ficheros sin frontmatter cambia de :2 a :1 — si es un error, cuesta volver a una pasada
- Task 5: Ruling: un bloque abierto dentro de una valla acaba también en la línea que cierra la valla, sin incluirla; uno abierto fuera la atraviesa — sin eso, un bloque dentro de una valla sin fin se tragaba el resto del fichero
- Task 5: Ruling: cli/test/kit/dist.test.ts:42 («keeps a kit mark inside a fence nested in a list») era el segundo test de la regla vieja, que la tabla de la spec no nombraba; pasa a «strips a kit mark inside a fence nested in a list»
- Task 5: Ruling: A+C pasa a mirar el sitio: una cita cuyas palabras vuelven todas, en su sitio, dentro del bloque es A+C; con la búsqueda del trozo en todo el bloque, «##» de un ## que pasa a ### o una palabra que el bloque usa en otro sitio daban falsos A+C en la prueba real (26 en skill-testing.md) — los tests de A+C no cambian — si es un error, cuesta volver a la búsqueda en el bloque, con falsos rojos
- Task 5: Ruling: prueba real final, con el borrador de anotación (real-copies/ en la carpeta de la spec): las 15 copias .md de la 0312 dan su salida idéntica al texto de hoy, y los únicos rojos son 6 de absoluta, uno en sdd-tdd, sdd-debugging, sdd-worktrees, sdd-parallel-agents, sdd-verify y sdd-agent-writing (la cabecera «Write everything the user reads…» pegada al Overview); el A+C de sdd-tdd:125 y el de sdd-verify:243 de la auditoría no salen porque sus párrafos no tienen absoluta (límite de la decisión 6) — es la entrada de la 0312
- Final: Ruling: decisión del dev-lead del 2026-11-04 (superpowers v7.0.2, filas 0313 y 0314), traída por la sesión develop: en la 0302 solo cambian el «No entra» y la decisión 1 de la spec (enmienda sin aprobar, aplica literal la decisión) y la fila 0312; ninguna línea de código cambia — si es un error, cuesta revertir dos párrafos
- Final: Ruling: Código I1 (code-reviewer-prompt.md:210 «(both MIT, see NOTICE)» con mattpocock fuera del NOTICE) — se queda para la 0312, que reescribe esa línea con las versiones en el texto (§2 del ticket de la 0300), como dice la tabla «Lo que se retira» de la spec; un agente no sigue esa atribución — si es un error, cuesta una frase
- Final: Ruling: Spec M2 («antes de nada lista sus bloques») — lo cubre la línea por conflicto, que nombra cada bloque en riesgo; un bloque fuera de un conflicto fusiona solo y sigue ahí, así que listarlos todos solo añade ruido — si es un error, cuesta una línea por copia
- Final: Ruling: Código minor «classify dice no está clasificado también con dos coberturas» — es el literal del requisito («falla igual»), ruling de la Task 2 — sin coste
- Final: Ruling: Spec M7, segunda parte (la tabla de THIRD_PARTY_NOTICES sale con una fila por fuente y versión de cada entrada, no una por entrada) — cada fuente de un from necesita su fila con su licencia; la nota sí pasa a decir de dónde sale el texto — si es un error, cuesta una fila
- Final: Ruling: Arquitectura minor (la tabla LCS de n·m) — pasa a Uint32Array para no desbordar; la memoria queda en n·m, unos 1,4 MB con las copias de hoy (600 líneas o palabras) — si un día pasa de 10.000 líneas, cuesta una LCS lineal
- Final: Ruling: cli:test-slow dio un rojo en test/merge/registries.slow.test.ts («debt.md: dos filas distintas…», error de git push en su repo temporal, el fichero tardó 183 s); solo pasa 10/10 — intermitente por carga, sin relación con la rama — si es un error, cuesta mirarlo en el gate de cierre, que lo vuelve a correr
- Final: Ruling: re-revisión rotura 3 (withoutFrontmatter y splitFrontmatter, conflictProblems y conflictBlocks) — leen cosas distintas: líneas frente a texto con saltos, y rojos de kit:copies frente a bloques en conflicto de la fusión; juntarlos no ahorra una regla — si es un error, cuesta un refactor
- Final: Ruling: re-revisión rotura 4 (la nota habla de bloques de: que no existen) — es la nota del estado que deja la 0312, que es quien anota; hoy la copia es pending — sin coste
- Final: Ruling: Código I2, resto (git() de copies.slow.test.ts igual al de upstream-watch.slow.test.ts) — son cuatro líneas de un helper de test; sacarlas a un módulo de tests para dos usos no compensa — si es un error, cuesta mover cuatro líneas
- Final: Ruling: Arquitectura minor 5, resto (los avisos «sin clone de…» y «falta … en el clon…» en tres sitios) — son el mismo texto en las tres órdenes porque la spec fija que sea el mismo; sacarlos a clones.ts es la siguiente que toque las tres — si es un error, cuesta un cambio de texto en tres sitios
- Final: Ruling: Arquitectura minor 10, resto (una ruta de own fuera de skills/ no se valida) — own lista también los ports (cli/src/tasks/, tests/skill-size/check.ts) y classify solo mira skills/; validarlo es un test que nadie pide — sin coste
- ✋ sin revisar: los arreglos tras la re-revisión, juntados en el commit de cierre — `classify` solo deja ceder ante `own` a una copia `pending` de carpeta, y `kit:copies-update` no sube los `from` de una copia que se salta y dice «nada que subir»; son dos roturas Minor que vio la re-revisión, arregladas con su test RED→GREEN después de ella
- ✋ sin revisar: el commit de cierre — `.gitattributes` gana `dist/** text eol=lf`: con `skills/` en LF, el build escribía `dist/` en LF y un checkout con `core.autocrlf=true` lo marcaba modificado por stat, lo que paraba el `sdd merge --check` de `develop` (lo vio el cierre, el 2026-11-04)
- Enmienda 2026-11-04, sin aprobar (aplica literal la decisión del dev-lead traída por `develop`): la 0312 sube las copias a superpowers v7.0.2, `cli/src/tasks` pasa a la 0313 y `sdd-grilling` a la 0314

## 4. Verificación

### 4.1 Builds

- `node build/dist.ts` → `dist/: 232 ficheros desde .`, con `dist.test.ts` en verde en cada commit (pre-commit).
- Gate: lo corre el paso 6 del cierre una sola vez, sobre la base integrada (la base va 1 commit por delante, f76b56d8). Su línea `Gate:` va en el mensaje final, porque este walkthrough va en el commit de cierre.
- Pre-commit de cada task y de las dos pasadas: `cli:typecheck` y `cli:test` en verde. El último, sobre los arreglos tras la re-revisión: `Tests 2149 passed | 12 skipped (2161)`. `cli:test-slow` sobre la pasada de fix: 502 de 503. El rojo de `test/merge/registries.slow.test.ts` pasa 10/10 solo, y el gate lo vuelve a correr.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-04 · lo verificado por el agente es esto:
  - `moon run kit:copies` en el repo: solo 20 líneas `… sin anotar → <fila>`, salida 1;
  - el experimento con `git merge-file` sobre los fixtures: 2 conflictos;
  - los 15 THEN del delta, todos `ejecución real` o `suite` (tabla);
  - la prueba real de la decisión 12 en `real-copies/`: las 15 copias `.md` salen idénticas a su texto de hoy;
  - la revisión final en tres ejes sobre `f77e05fb`, con su pasada (juntada en el cierre); la re-revisión, sin Critical ni Important, y 2 commits sin revisar (✋).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Una copia es su original más bloques marcados (líneas en orden, tramos cubiertos, borrado sin `quita`, línea sin marca, frontmatter, `de:`) | suite (`copies.test.ts`) y `ejecución real` (`copies.slow.test.ts`, `checks a md copy against its original`) | verde |
| Lo que sustituye una marca es lo que el bloque quita | suite | verde |
| Una frase sustituida no queda al lado de la del kit (A+C, S repetida, marca vieja) | suite | verde |
| Un añadido junto a una absoluta da rojo | suite, y prueba real: 6 copias con la cabecera del kit junto a un «never» | verde |
| La marca se escribe con su gramática (cada error, `fin`, vallas) | suite | verde |
| Lo que dice `kit:copies` (`arregla`, `pending`, código de salida) | `ejecución real` (la orden contra un repo git temporal, y en el repo) | verde |
| Una copia que ya no lo es (50 %) | suite (50 % exacto y 45 %) y `ejecución real` (`reports a copy below 50 %`) | verde |
| La fuente de una copia va en LF | suite y `.gitattributes` | verde |
| Un fichero de la fuente sin mapear (y original que no existe, tag que falta) | `ejecución real` | verde |
| Actualizar con `git merge-file` (2 conflictos, bloques en riesgo, original movido o que falta, fallo sin escribir, `pending`, `from`, frontmatter) | `ejecución real` (la orden y `git merge-file` sobre los fixtures) | verde |
| Cada fichero de `skills/` es copia o propia | suite contra el `upstream.json` real | verde |
| Una skill que remite a su NOTICE lo tiene | suite contra `skills/` real | verde |
| MODIFIED: la skill sale limpia del build (marca dentro de una valla) | suite (`dist.test.ts`) | verde |
| MODIFIED: el corte compara cada entrada, con sus `from` | `ejecución real` (`upstream-watch.slow.test.ts`); en el repo, `kit:upstream` dio el 2026-11-03 los mismos rojos de antes, fichero a fichero | verde; hoy no se puede repetir: el `fetch` por SSH da «Permission denied (publickey)» |

### 4.3 Residuales / deuda generada

- Para la 0312: la cabecera del kit, «Write everything the user reads… Forked from…», pegada al párrafo del Overview, da el rojo de absoluta en 6 copias. Hay que anotarla en su propio párrafo.
- Para la 0312: con systematic-debugging en v7.0.0, `CREATION-LOG.md` y los `test-*.md` darían rojo de «sin mapear». La v7.0.2 los quita, y la 0312 sube a ella.
- Para la 0312: `testing-skills-with-subagents.md` no existe en superpowers v7.0.1, y `kit:upstream` lo dice.
- Límites declarados, que cubre la revisión con la ADR 0022:
  - el añadido en otro párrafo;
  - la sustitución que contradice una absoluta;
  - un «except» en un párrafo sin absoluta;
  - el A/B de un `quita`;
  - un fichero de `own` casi literal;
  - la unión de dos párrafos.

## 5. Aprendizajes

- **Un borrador de anotación generado a partir del original y del texto de hoy** se valida solo con `checkCopy` y con la igualdad de la salida. Le ahorra a la 0312 recortar a mano unos 150 KB: los scripts de `real-copies/` producen una anotación correcta de 9 de las 15 copias sin tocar, y de las otras 6 con un solo rojo cada una. → la fila 0312 (su prompt de arranque nombra `real-copies/`)
- **Con `core.autocrlf=true`, una carpeta que genera el build va con el mismo `eol` que su fuente.** Si no, el build reescribe en LF lo que el checkout dejó en CRLF, git lo marca modificado por stat, y el `sdd merge --check` de `develop` se para con un diff vacío (`dist/hooks/hooks.json`, que viene de la 0300). → `.gitattributes` (`dist/** text eol=lf`) y `tech-stack.md`, junto a la regla de los fixtures en `eol=lf`
- **El repaso de coherencia volvió a dejarse tests que fijan la regla retirada**: `skills.test.ts:118` (Adapted from ⇒ NOTICE) y `dist.test.ts:42`. Es el mismo fallo del ticket de la 0300, §1. → ticket del kit (segundo caso)

Retro: corrección repetida → ticket del kit: `review-spec.md` de `sdd-propose` da «ninguna» con 3 señales, y el dev-lead tuvo que preguntar dos veces («has auditado el spec?», «has hecho dom opu / tec sonnet?»). Los dos revisores encontraron 3 Critical en una spec cuya gramática consumen la 0312 y la 0296
Retro: documento o skill desmentido → ticket del kit: el paso 4 de `sdd-propose` («search each name … in `capabilities/`, the project's documents and, in a skills kit, `skills/`») no encontró `skills.test.ts:118` ni `dist.test.ts:42`, los tests que fijan la regla que se retiraba; segundo caso tras el ticket de la 0300, §1, y su fila es la 0306
Retro: error que cazaría un chequeo → `.gitattributes`, con `dist/** text eol=lf`, y la línea en `tech-stack.md` (`.gitattributes`, `.docs/sdd/tech-stack.md`)

## 6. Adendas

_Ninguna._
