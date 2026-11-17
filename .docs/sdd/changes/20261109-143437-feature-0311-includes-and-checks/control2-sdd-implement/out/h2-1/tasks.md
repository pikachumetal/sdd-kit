# Tasks — feature 0010

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha, revisión limpia | 4fafd24 |
| 2 — Listado de canceladas | hecha, revisión limpia | d9b5f39 |

Revisión final: Spec opus+high, With fixes (0 Critical, 0 Important, 3 Minor diferidos) · Código sonnet+high, Yes (0 Critical, 0 Important, 5 Minor diferidos) · Arquitectura no (plan sin línea; sin señales), sobre 3d57f19

## Rulings

Ruling: los tests viejos de cancelar se actualizan para pasar --motivo — la spec manda que sin motivo responda «motivo no válido…» — coste si es erróneo: rehacer 2 tests
Ruling: con motivo inválido o ausente la validación va antes de buscar la reserva — la spec no distingue y el test «sin reserva» ya pasa motivo tras actualizarse — coste: cambiar el orden
Ruling: plan sin Review Focus ni «Se prueba en la aplicación» — delegate no se detiene tras cada task
Task 1: Ruling: copia RED == test commiteado (solo difiere EOL por autocrlf) — sin cambios de aserción
Task 1: Ruling: Minor del revisor (EOL del test, `cancelar Norte --motivo otro`, booking.reason sin test directo) no se arreglan — fuera de spec; reason lo cubre el test de Task 2 — coste: ninguno
Task 2: Ruling: copia RED == test commiteado; el implementador hizo un amend por un SyntaxError propio antes de reportar (no pusheado), el commit final está sano — coste: ninguno
Task 2: Ruling: Minor del revisor (test comparte estado de módulo pero su cancelar es idempotente; casos límite de listado sin test: la spec calla) no se arreglan — coste: ninguno
Final: Ruling: Spec «Declined to judge» (persistencia entre invocaciones de la CLI → 0014; motivo en anular → 0011; regla de 24 h; mayúsculas del motivo; flag delante de sala y día; varias canceladas; redacción de la spec; nombres en inglés) — todo fuera del Scope/delta de 0010 o ya previsto en el roadmap — coste: ninguno en 0010; hasta 0014 `canceladas` desde la terminal sale vacío porque el estado es en memoria
Final: Ruling: Código «Declined to judge» (estados como constantes, RED por commit, reparto parser/dominio) — preexistente o de otro eje — coste: ninguno
Final: Ruling: la lista vacía de `canceladas` no recibe mensaje nuevo — añadirlo cambia la salida observable y es un THEN que la spec no tiene (freno de alcance/desvío), no un arreglo — coste: línea en blanco al listar sin canceladas
Final: minor (deferred): Spec 1 — `canceladas` sin canceladas devuelve '' (línea en blanco); el revisor recomienda arreglarlo antes del merge, pero exige un THEN nuevo
Final: minor (deferred): Spec 2 — el filtro status==='cancelled' de `canceladas` no lo fija ningún test (hay una sola reserva)
Final: minor (deferred): Spec 3 — `--motivo sala ocupada` sin comillas se rechaza (readReason coge un solo token)
Final: minor (deferred): Código 1 — el test de canceladas depende del estado compartido del módulo (su cancelar es idempotente)
Final: minor (deferred): Código 2 — test/cancel.test.js cambió de finales de línea y el diff lo reescribe entero
Final: minor (deferred): Código 3 — sin `--motivo` el mensaje no dice que falta el flag
Final: minor (deferred): Código 4 — `readReason` acepta el flag en cualquier posición pero sala y día van por posición
Final: minor (deferred): Código 5 — `canceladas` vacío imprime una línea en blanco
