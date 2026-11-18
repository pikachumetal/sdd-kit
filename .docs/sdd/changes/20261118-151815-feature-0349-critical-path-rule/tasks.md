# Tasks — feature 0349, el camino crítico

| Task | Nombre | Estado | Commit |
| --- | --- | --- | --- |
| 1 | Plantillas, documentos y la regla de «Dónde se prueba» | complete | 5a1ea146d |
| 2 | `sdd-tdd` y el brief del implementador | complete | 316edd7fb |
| 3 | El eje Código de `sdd-verify` | complete | cca0f0075 |
| 4 | `commit-history` y el hueco del walkthrough | complete | 3122a08c0 |
| 5 | El cierre de `sdd-archive` | complete | d3598144c |

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre d3598144c
Pasada de fix: juntada en el cierre, 13 hallazgos (cpt4n, cpt6, e1, g5 1/1)
Re-revisión: d3598144c..pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, queda 1 Important de la pasada → arreglado después, sin revisar

## Rulings
Task 1: Ruling: PRODUCT.md (1.869/1.799) y architecture.md (4.933/4.877) pasaban su tope, que la spec no listaba — condensé texto vecino (flujo por defecto de PRODUCT; la intro de la tabla y la medida de workers de architecture) y compacté el glosario en una entrada y la fila — si condensar quitó un matiz, se recupera del historial de esas líneas
Task 2: Ruling: RED limpio → por Art. I no se escribe guía nueva en implementer-prompt.md ni regla nueva en sdd-tdd; writing-e2e.md solo hace condicional, a saldo cero, la frase que exige el test de títulos con E2E (la cambia el MODIFIED aprobado) — si un caso real escribe el test de títulos con «Camino crítico», el humo cpt2 no lo vio
Task 3: Ruling: el hueco «Project E2E» de code-reviewer-prompt.md cambia de literal — actualizo las claves de axis-f4/f5/f6/f6b.json para que compose-axis no deje el hueco sin rellenar — si otra batería usa ese literal, fallaría al componer y lo diría
Task 4: Ruling: la frase va en las dos filas de cierre (feature y patch) de la tabla de hitos, no en una sola — el grep de la Verificación da 2, no 1 — si sobra en una, la revisión final lo dirá
Task 5: Ruling: el borrado tras la respuesta a la fila (CPT4-B, -H, -O) no se mide: el sujeto para en la pregunta, como debe, y un TURN2 costaría otra tanda — si el borrado tras el «no» falla, lo verá el primer cierre real con «Camino crítico» (document-manager)
Task 5: Ruling: la pregunta de la fila y los avisos van en closing-suite.md (una sola sección) y en la frase de la decisión de SKILL.md, no en validation-modes.md como decía el plan — SKILL.md tenía 15 palabras de margen — si un sujeto no abre closing-suite.md, no pregunta
Task 5: Ruling: sin controles e1 y g5 — el plan los pedía; la sección nueva solo se lee con «Camino crítico», que e1 y g5 no declaran — si la frase añadida al paso 1 cambiara su conducta, no se ha medido
Task 5: Ruling: closing-suite.md pasaba el tope de sdd-archive (9.992/9.904) — compacté la sección sin quitar reglas, y un sujeto de control cpt4 n=1 salió igual (pregunta la fila, nada escrito) — si la compactación perdió un matiz que no mide cpt4, lo verá la revisión final
Final: Ruling: (Spec 5) la task escribe el unitario y no el de integración — el nivel lo fija «Dónde se prueba» (cp1 REFACTOR 2/2 nombra el unitario) y los RED son del hilo, que los escribe desde esa línea; no entra regla en implementer-prompt.md — si un implementador añade por su cuenta un test más alto, lo marca el eje Código (cpt3)
Final: Ruling: (Spec 1 y 3) «two matches: stop, name both» y la suite de `cubre` ausente, arreglados en el texto pero sin escenario propio — mismo paso que cpt6 (parar sin borrar) — si la parada no nombra la causa, lo verá el primer cierre real
Final: Ruling: (Spec menor) «Límites»: «Tests de feature corre una vez por cierre» frente a «una pasada de fix vuelve a 1» — cada pasada de validación es un intento de cierre; no se enmienda la spec — si confunde a un sujeto, se aclara en la 0350
Final: Ruling: (Spec menor) en `manual` la pregunta de la fila va sola (decisión 8) y no dentro del mensaje de validación (decisión 10) — la 8 es la más conservadora — coste: un turno más en manual
Final: Ruling: (Spec menor) check.mjs del molde pasa ficheros enteros con --extras --run, heredados incluidos — simplificación del molde; el contrato real lo cumple el check del template — ninguno en el kit
Final: Ruling: (Spec menor) el eje Código de cpt3 recibe «Camino crítico» por fixture, no por el hilo — mismo patrón que f4/f5/f6; la fila del encargo en SKILL.md:227 lo dice — si el hilo no la pasa, el revisor vuelve a «Flujos core»
Final: Ruling: (Spec menor) architecture.md perdió la medida «197 s frente a 227 s» al condensar por el tope — se recupera del historial — si alguien la busca, git log -S
Final: Ruling: (Código menor 8) el check del molde escribe `lista-tocada: <ruta>` y no implementa fila-nueva:/freno-modificado: — el kit solo lee los prefijos, que el paso 2 lista — ninguno en el kit
Final: Ruling: (Declined, Código) PRODUCT.md y architecture.md condensados por el tope (Art. IX no aplica: no son copias de una fuente) — ya en el ruling de Task 1
Final: Ruling: (Declined, Spec) operations-template.md añade «Camino crítico … o `ninguno`» que sdd-init calcará — vale `ninguno` hasta que la 0350 añada la pregunta — un proyecto nuevo verá el campo vacío
Final: Ruling: (Spec 6, re-revisión) la lista vacía y la línea sin-base: paran por el mismo paso que cpt6 (lista ausente, 1/1), sin escenario propio — si una de las dos no para, lo verá el primer cierre real
Final: Ruling: (re-revisión, fuera de alcance) «Tests de feature» sin env-up en cpt6 y salidas en /tmp en cpt4n — no lo cambia esta feature; closing-suite.md ya pide el scratchpad y e2e-suite.md — ninguno nuevo
