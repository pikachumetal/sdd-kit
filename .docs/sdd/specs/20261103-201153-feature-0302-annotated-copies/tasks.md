---
id: 20261103-201153-feature-0302-annotated-copies
title: Tasks — Las copias anotadas contra su fuente
spec: ./spec.md
plan: ./plan.md
created: 2026-11-03
---

# Tasks — Las copias anotadas contra su fuente (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0302-annotated-copies`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | La marca y las comprobaciones puras | done | `568e9edd` | |
| 2 | El registro fichero a fichero | done | `7163f5c8` | |
| 3 | `kit:copies` contra los clones | done | `e318a8ff` | afectada por enmienda 2026-11-03 → Task 5 |
| 4 | `kit:copies-update` y el experimento de 7.0.0 a 7.0.1 | done | `a7671ddf` | |
| 5 | Enmienda 2026-11-03: marcas dentro de una valla | done | `f77e05fb` | |

## Verificación por task

- [x] Task 1 — `pnpm --dir cli exec vitest run test/kit/copies.test.ts test/kit/dist.test.ts`
- [x] Task 2 — `pnpm --dir cli exec vitest run test/kit/notices.test.ts test/kit/dist.test.ts test/kit/word-budget.test.ts` y `test/kit/upstream-watch.slow.test.ts`
- [x] Task 3 — `pnpm --dir cli exec vitest run test/kit/copies.slow.test.ts` y `moon run kit:copies`
- [x] Task 4 — `pnpm --dir cli exec vitest run test/kit/copies.test.ts test/kit/copies.slow.test.ts`
- [x] Task 5 — `pnpm --dir cli exec vitest run test/kit/dist.test.ts test/kit/copies.test.ts`

Revisión final: Spec opus+high, with fixes · Código sonnet+high, with fixes · Arquitectura opus+high, with fixes, sobre f77e05fb
Re-revisión: f77e05fb..la pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, sin Critical ni Important; 2 roturas Minor arregladas después, juntadas en el cierre (sin revisar)
Pasada de fix: juntada en el cierre, 21 hallazgos (14 con test RED→GREEN o fijado, 7 de docs o sin test que los reproduzca; 5 con ruling)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| El pre-commit de la Task 2 paró en `cli/test/kit/skills.test.ts:118` («toda skill adaptada de otra fuente lleva NOTICE») | el repaso de coherencia de la spec no buscó los tests que fijan «Adapted from» ⇒ `NOTICE` | las atribuciones de `sdd-grilling` y `sdd-rubber-duck` pasan a «Inspired by … (MIT)», en la misma task | `7163f5c8` |

## Rulings

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
