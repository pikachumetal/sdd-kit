# Tasks — 0355

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Barrido e inventario de piezas | hecha | f10a241 |
| 2 — Sumas por skill, enganche y corte por versiones | hecha | c38a194 |

Revisión final: Spec opus+high, con arreglos (7 Important, 7 Minor), sobre c38a194
Pasada de fix: juntada en el cierre, 14 hallazgos (7 Important, 7 Minor)
Re-revisión: c38a194..juntada en el cierre, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin rotura Critical ni Important

## Rulings

- Task 1: Ruling: enmienda aprobada (decisiones 8, 10 ter y lo del cliente); Step 2 lee lo que dice out/reading.tsv (12 enteros, 41 sección, 25 contexto, 22 índice; 55.674 de 102.745 palabras) — el manifiesto sustituye la lista a mano del plan — si falla, un acierto fuerte sin leer, cosa que el script hace imposible por construcción
- Task 1: Ruling: en un fichero leído por sección cuyos aciertos fuertes son todos falsos positivos (la palabra genérica validation o validación del paso de cierre), se lee la línea del acierto, no la sección; se apunta en out/hit-lines-only.txt y research.md descuenta esas palabras de las leídas — si falla, una regla de proyecto en esa sección sin marcador queda fuera, el mismo límite de la decisión 11
- Final: Ruling: m7 out/tables.md en LF reescrito sobre CRLF — git normaliza con core.autocrlf y el contenido es idéntico; no se toca el script — coste: un `git status` con el fichero modificado tras regenerar sin cambios
- Final: Ruling: implementer-prompt.md 39 (esperas E2E dentro del contrato de los RED) cuenta como queda — la línea es sobre todo el contrato de los RED, que se queda; research.md declara las ~45 palabras que salen con C — coste: −45 palabras en la cifra de C
- Final: Ruling: declinado «corte A menor con hasRecipient: true» — research.md ya lo marca sin comprobar; lo decide el dev-lead al abrir la fila — coste: un corte mayor tratado como menor
- Final: Ruling: declinado «Elegida: A» en la forma del enganche — es la recomendación que pide la plantilla de research, no una decisión — coste: ninguno
- Final: Ruling: declinado e2e-suite 1-8 (levantar el entorno) — es procedimiento de la suite E2E de cada proyecto; se queda la gate tal como se declara (9-12) — coste: un proyecto sin skill E2E deja de levantar su entorno antes de la pasada
- Final: Ruling: declinado topes de CLAUDE.md/AGENTS.md — no hay topes numéricos en dist/skills; la fila de sdd-agent-writing lo cubre — coste: ninguno
- Final: Ruling: declinado coordinación con la 0350 — research.md la pone como corte 0; el resto es roadmap — coste: ninguno
