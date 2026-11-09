# Tasks — feature 0314

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — RED de `p1`, `p2` y `p3` con el kit de `HEAD` | hecha: entra la (2); (1), (3) y (4) limpias (enmienda 2026-11-08) | 451d5c91 |
| 2 — Las sustituciones que entran, las dos fuentes al día, GREEN y controles | hecha: la (2) con contraejemplo tras dos rondas (enmienda 2026-11-09); upstream al día | 23775f1d (fix de la revisión: en el cierre) |

Revisión final: Spec opus+high, con arreglos (2 Important, 6 Minor) · Código sonnet+high, lista (3 Minor) · Arquitectura no (plan), sobre 23775f1d
Pasada de fix: juntada en el cierre, 6 hallazgos arreglados (1 Minor de texto re-medido con p1, 5 de documentación), 4 adjudicados con ruling (Important 1 con g8 n = 2 y kit final; Important 2 aprobado por el dev-lead)
Re-revisión: 23775f1d..cierre (la pasada de fix, juntada en el cierre), sdd-kit:effort-high + opus, limpia (11 de 11 resueltos; 2 Minor del fix: la fila de g8 en green.md, arreglada en el cierre y revisada en el hilo, y el registro de tests, adjudicado)

## Rulings

- Task 1: Ruling: el roadmap del molde salas tiene CRLF en el checkout de Windows; salas-csv inserta la fila 2 con el fin de línea que encuentre y falla si no está la fila 1 — si es errónea, ninguno: el seco lo comprobó
- Task 1: Ruling: molds.test.ts no construye moldes de sdd-grilling; esa comprobación de la Verificación no aplica — si es errónea, salas-csv sin test automático (el seco lo cubre)
- Task 1: Ruling: enmienda 2026-11-08 aprobada («1») — re-medida la (4) con la fila 2 «por la salida estándar»: W4 0/2 → sale; delta queda con el GIVEN y «El porqué va primero»
- Task 2: Ruling: la verificación de vitest corre con pnpm exec vitest en vez de npx vitest (MODULE_NOT_FOUND con npx en worktrees, ledger de la 0297) — si es errónea, ninguno: mismo binario
- Task 2: Ruling: W5 1/6 en RED y en GREEN — mismo fallo y misma tasa con el kit de hoy, y la (1) que lo tocaba no entra: no es regresión — si es errónea, la frase del porqué empuja a rellenar el para qué en la nota
- Task 2: Ruling: REFACTOR de forma (Art. II): «ask that first, open, even if you can guess» → «ask that first, even if you can guess: open, with no options or example answers», en la misma frase; aplica el THEN aprobado («sin alternativas, recomendación, hipótesis ni ejemplos»), no lo cambia — si es errónea, la frase gana 4 palabras sin efecto
- Task 2: Ruling: control con N=1 no lanzó p1-p3 (sin tools.txt; el lanzador no los arrancó): los cubren GREEN y REFACTOR a n=2 — si es errónea, ninguno: miden lo mismo con más sujetos
- Task 2: Ruling: COST_CAP es acumulado de la campaña (SPEC_DIR), no por tanda — el control con COST_CAP=6 dejó sin lanzar p1-p3 y la primera tanda de REFACTOR/control-dev no lanzó nada; se relanza con COST_CAP=13, el techo de la spec — si es errónea, ninguno: el techo es el aprobado
- Task 2: Ruling: g3 (y g6) con TURN2 «sí, adelante: feature full con delegate» ya no llegan a una decisión de diseño: el turno 1 acaba ahora en el porqué y TURN2 no lo contesta (g3-1 del control escribe la spec sin pregunta de diseño; R6 sin medir). TURN2 pasa a llevar el porqué; g3 y g6 se repiten con el kit del REFACTOR — si es errónea, la batería cambia un turno de prueba que medía otra cosa
- Task 2: Ruling: enmienda 2026-11-09 aprobada («1»): previsión 47 sujetos; segunda ronda con contraejemplo literal en la frase del porqué (fallo de forma, Art. II)
- Final: Ruling: Spec Important 2 y Código Minor 2 — el contraejemplo de la (2) repite en Overview el «sin menú» de «Discovery» — se queda: el texto y su sitio los aprobó el dev-lead en la enmienda 2026-11-09 («un contraejemplo literal dentro de la misma frase»); moverlo a «Discovery» cambia el Approach aprobado y pide re-medir p1, g2, g5 y g8 fuera de la previsión — si es errónea, la regla del menú vive en dos sitios y quien edite uno puede olvidar el otro (va al ticket)
- Final: Ruling: Spec Minor 3 y Código Minor 3 — p2 y p3 sin medir con el texto final — la medición tras la revisión va a g8 ×2 (Important 1) y p1 ×1 (W1 con el texto final), los 3 sujetos que quedan de la previsión; la condición «If neither … says why» no cambia de sentido desde GREEN, donde p2 y p3 dieron W2 4/4 y en REFACTOR 1 4/4 — si es errónea, el AND «no lo pregunta si ya está» queda sin medir con el texto final
- Final: Ruling: Spec Minor 8 — p1-2 de REFACTOR 2 pasa W1 «en el límite» (facetas, no respuestas) — pasa tal como está escrita W1; p1 se mide otra vez con el texto final — si es errónea, W1 es 1/2 y no 2/2
- Final: Ruling: Código, declinado: la skill crece ~28 palabras — es una sincronización con la fuente (Art. IX), no un arreglo de ticket; 872 < 900 — ninguno
- Final: Ruling: Código, declinado: seguir brainstorming 7.0.2 literal, (1)(3)(4) fuera, coste y tamaño de muestra, W5 y p3 sin sdd-grilling, roadmap — del eje Spec, de la spec o del proceso, y la evidencia los registra — ninguno
- Final: Ruling: Spec, declinado: kit 2.3.4 frente a 3.0.0 del molde (g7, p1-2) — previo, falla igual con develop — si es errónea, ruido que tapa g7 en todas las campañas (va al ticket)
- Final: Ruling: Spec, declinado: R1 del turno 1 de g8 con REFACTOR 1 y R1 de g8 previo; calidad de subject.mjs; mensajes de commit — previos o de otro eje — ninguno
- Final: Ruling: Spec «no verificado»: palabras, kit:upstream, kit:own, kit:skill-size, kit:copies, notices/word-budget/dist — verificados en el hilo en esta sesión (ledger de la Task 2) y se repiten tras la pasada de fix — ninguno
- Final: Ruling: Spec Important 1 (g8 R5 rojo con la rama, verde con develop) — no es regresión: R5 falla en las 2 sesiones en que sdd-init no carga sdd-grilling (control g8-1 GREEN, post g8-1 final) y pasa en las 3 que la carga (develop, REFACTOR 1, post g8-2 final); el texto de la rama no llega a los sujetos que fallan — si es errónea, la frase empeora el descubrimiento en sdd-init (2 sujetos más con carga lo descartarían)
- Final: Ruling: Minor nuevo «Final: fixed Código Minor 1 sin salida de tests» — tras la pasada de fix corrieron pnpm exec vitest run test/kit/word-budget.test.ts test/kit/dist.test.ts → Test Files 2 passed (2), Tests 98 passed (98), y el pre-commit de la pasada de fix (juntada en el cierre) cli:test → 86 files, 2350 passed | 13 skipped; 873 palabras con wc del hilo, 872 con el split del test — si es errónea, ninguno: la salida está aquí
