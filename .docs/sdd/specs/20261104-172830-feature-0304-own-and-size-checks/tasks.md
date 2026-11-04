# Tasks — feature 0304

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — La inclusión en el build | hecha | `22153f12` |
| 2 — `kit:own`: texto del kit, frase repetida, absoluta con excepción, inclusión en una copia | hecha | `7ceeef88` |
| 3 — La prosa en castellano, con su RED | hecha | `5eacc8d4` |
| 4 — El tamaño por fase y los docs | hecha | `1dc1a583` |

Revisión final: Spec opus+high, with fixes (1 Important, 7 Minor) · Código sonnet+high, listo (13 Minor) · Arquitectura no (plan), sobre 1dc1a583
Pasada de fix: juntada en el cierre, 3 hallazgos RED→GREEN y 14 sin test que los reproduzca (nombres, estructura, docs, cobertura)
Re-revisión: 1dc1a583..juntada en el cierre, sdd-kit:effort-high + opus, 20/21 addressed y 1 Important nuevo, arreglado en el cierre (revisado en el hilo: 2 ficheros · 3 líneas de comentario)

## Rulings

Task 1: Ruling: el test «rejects an include in an annotated copy» pasa antes de implementar — fija el rojo que ya da parseMark a un campo desconocido, como pide el AND de la spec; no es código nuevo — si es un error: ninguno, el test sigue guardando la gramática
Task 1: Ruling: stripMarks pasa a renderLines con un lector que da vacío, para no duplicar el recorrido; una inclusión dentro de una valla en una copia lanza en vez de quitarse, y shareProblems de kit:copies ya captura BuildError — si es un error: kit:copies calla la medida del 50 % de esa copia
Task 1: Ruling: dist/ sale «M» en git status por core.autocrlf=true (CRLF en el working copy, LF en el índice); git diff -- dist vacío, no se commitea — si es un error: ninguno
Task 2: Ruling: skillLines(repoRoot, files, registry) con 3 parámetros, no 2 — ownReport ya lee upstream.json para la inclusión en una copia y se lo pasa; no se lee dos veces — si es un error: un parámetro de más
Task 2: Ruling: las rachas se agrupan por componente (dos rachas que comparten alguna racha de 10 palabras van en una línea), no solo por sus 10 primeras palabras — con las mismas 10 primeras es lo que dice la decisión 9 de la spec, y así una racha más corta en una tercera skill no sale en una línea con un solo sitio; la línea cita las 10 primeras de la racha del primer sitio por ruta — si es un error: una línea agrupa dos frases distintas que se solapan
Task 2: Ruling: dos copias no se comparan aunque una sea pending (copy en los dos lados) — lo pide el AND «dos copias anotadas que comparten una racha… no dan rojo»; sdd-implement y sdd-archive pending no se comparan entre sí hasta que sus filas las anoten o partan — si es un error: una regla repetida entre esas dos se ve solo al anotarlas
Task 3: Ruling: la muestra perdió «- Timestamp: `Get-Date …` (PowerShell).», mal etiquetada como castellano (sin el código no tiene ni una palabra), y ganó «## Checklist (one todo per step)» en `## en`, el falso positivo del contraste — el test no cambió desde la copia RED — si es un error: la muestra pierde un caso
Task 3: Ruling: la heurística no detecta un título en castellano de una palabra sin tilde, sin palabra gramatical ni terminación propia y fuera de la lista (p. ej. «## Detalle») — sin un diccionario no se ve; el rojo es por línea, y esos títulos viven en ficheros que ya dan rojo por sus otras líneas — si es un error: un título suelto en castellano pasa
Task 3: Ruling: sdd-roadmap/SKILL.md:29 («| En espera |») entra en el inventario como el fichero 22: es castellano real sin citar, y lo arregla la 0308 — si es un error: un rojo de más en sdd-roadmap
Task 4: Ruling: el test «passes a phase of exactly 100.000» usa skills de 20.000 caracteres, que dan rojo por bytes; el test mira solo la línea de la fase — con menos de 20.000 bytes cada una, 5 skills no suman 100.000 exactos — si es un error: ninguno
Task 4: Ruling: el corte de frase de la fase lo da splitSentences de tests/own/sentences.ts, el de la absoluta con excepción (decisión 13 de la spec) — si es un error: ninguno
Final: Ruling: checkOwn sigue async (Código, Minor) — listSources de git es async; ownReport es la versión síncrona que usan los tests — si es un error: ninguno
Final: Ruling: el aviso de una inclusión en una copia nombra skills/… y no dist/skills/… (Spec, Minor) — esa línea no existe en dist/, porque el build ya la expandió — si es un error: un aviso que apunta a la fuente
Final: Ruling: la spec dice «hoy son 5» absolutas y 12 grupos, y el kit real da 10 y 9 (Spec, Minor) — la medida de la spec no contaba las copias pending ni el agrupado; las cifras reales van al walkthrough — si es un error: ninguno
Final: Ruling: skills.test.ts lee skills/ y no dist/, así que el texto de includes/*.md quedará sin validar cuando exista la primera inclusión (nota del eje Código) — no hay inclusiones reales en esta rama; va a 4.3 del walkthrough — si es un error: un enlace roto en una inclusión pasa cli:test
Final: Ruling: regionsOf queda como tercer recorrido del estado Block, junto a renderLines y Reader.read (re-revisión, Minor no arreglado) — cada uno saca otra cosa (salida con su fuente, bloques del kit, región por línea) sobre nextBlock, que ya es la pieza común; un recorrido genérico sería una abstracción para tres usos distintos — si es un error: un cambio en cómo se abre un bloque toca tres sitios, y lo cubren los tests de los tres
Final: Ruling: regionsOf exportada y usada solo en su fichero (re-revisión, Minor) — se queda: textLines la usa, y quitar el export no cambia nada — si es un error: un export de más
Final: Ruling: «*e.g.» y «_e.g.» siguen cortando la frase (re-revisión, Minor) — el kit no tiene ningún caso; ampliar la clase de caracteres a la puntuación de Markdown es una línea si aparece — si es un error: una absoluta con excepción tras «*e.g.*» sale sin rojo
Final: Ruling: el test «fails on a phase of 100.001 characters» mide 115.000 (re-revisión, Minor) — es un test RED de la Task 4 y su nombre es contrato; el de 100.001 exactos está al lado — si es un error: un nombre que confunde
