# Tasks — 0182

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — El verbo `sdd review comments` | hecha | a0ac81de |
| 2 — El eje Código recibe la salida y la juzga | hecha | d64a49bd |

Revisión final: Spec opus+high, 5 Important · Código sonnet+high, 10 Minor · Arquitectura opus+high, 2 Important, sobre d64a49bd
Pasada de fix: juntada en el cierre, 3 hallazgos Important RED→GREEN, más los Minor
Re-revisión: d64a49bd..cierre, sdd-kit:effort-high + opus, 1 Important abierto, adjudicado

## Rulings

- Task 1: Ruling: git diff sin --no-renames — un renombrado no cuenta sus comentarios viejos como añadidos — coste si me equivoco: un comentario nuevo en un renombrado sigue saliendo por su hunk
- Task 1: Ruling: test añadido tras el RED, «una línea añadida que parece una cabecera de diff», con mutante visto en rojo — cubre el parseo por cabeceras — coste si me equivoco: un test de más
- Task 2: Ruling: el RED limpio de f6 no sacó la frase de juicio de la decisión 11: el GREEN sin ella marcó el falso positivo (0/1) — se mantiene el texto aprobado, con contraejemplo — coste si me equivoco: 14 palabras de más, saldo −4 en vez de −74
- Task 2: Ruling: f6 va en el paso propio `comments`, para lanzarlo solo con STEPS — coste si me equivoco: ninguno
- Final: Ruling: Arquitectura 5, no reutilizo BRANCH_CHANGE_FOLDERS de ids/scan.ts — acopla comments con ids por dos rutas — coste si me equivoco: una carpeta nueva se añade en dos sitios
- Final: Ruling: Código 10, los nombres en inglés de lexer.test.ts se quedan — el plan y el Review Focus los nombran así — coste si me equivoco: ninguno funcional
- Final: Ruling: Spec declinado, un binario no sale en sin leer — no tiene comentarios y solo añadiría ruido — coste si me equivoco: ninguno
- Final: Ruling: Spec declinado, fuera de un repo el verbo dice base: no se encuentra — el mensaje basta para un uso que no ocurre — coste si me equivoco: un mensaje impreciso
- Final: Ruling: 6 sujetos frente a 4 previstos, dentro del techo de 4 $ (0,71 $) — Q7 lo exige la ADR 0003 — coste si me equivoco: 0,22 $
- Final: Ruling: Código 3, Art. Civil sigue saliendo como constitution — deshago mi enmienda porque contradecía la decisión 5 aprobada, «sin distinguir mayúsculas» — coste si me equivoco: un falso candidato que el revisor descarta
- Final: Ruling: Arquitectura Important 2, sin tope en la línea impresa — el tope cambia la decisión 4, y la premisa anterior era falsa: un JS empaquetado de una línea con /^https?:\/\// y la palabra spec imprime 312 KB, aunque no tenga comentarios — coste si me equivoco: esos KB entran en el encargo del eje Código; pide fila de deuda si sale en campo
- Final: Ruling: diff.submodule=log o diff.ignoreSubmodules=all esconden un submódulo de sin leer — un submódulo no tiene comentarios que juzgar — coste si me equivoco: una línea menos en sin leer
- Final: Ruling: fixture app-f6b.js con Math.trunc(iban) se queda — no afecta a Q7, y cambiarla pide medir otra vez — coste si me equivoco: un Important ajeno en f6b
