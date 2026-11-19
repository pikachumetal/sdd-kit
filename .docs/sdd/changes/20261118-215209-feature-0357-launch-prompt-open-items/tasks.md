# Tasks — 0357

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Escenarios m8 y e4, y su RED | ✅ | d2f452c |
| 2 — La plantilla separa lo seguro de lo abierto, y su GREEN | ✅ | 89ff4e1 |


Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 89ff4e1
Pasada de fix: juntada en el cierre, 8 hallazgos y 5 minors (RED de e4 enmendado 0/2 con el kit viejo; control m8 1/1)
Re-revisión: 89ff4e1..juntada en el cierre, sdd-kit:effort-high + opus, con arreglos: 7 de 8 resueltos; las enmiendas de M8 y E4, aprobadas por el dev-lead

## Rulings

Task 1: Ruling: el RED de e4 sale rojo también en la puerta (e4-1 sin skill, e4-2 por sdd-roadmap) — la plantilla no cambia el enrutado; E4 se juzga en el GREEN solo si el sujeto llega al prompt — si la puerta sigue fallando, E4 no se puede observar y lo decide el GREEN
Baseline: Ruling: kit:test-headless rojo en la base (molds.test.ts, «el molde salas3-current de sdd-upgrade (r1) no queda por debajo de la última migración»); en origin/develop 3a482719a pasa 775/775: lo arregla el patch 0358 (ed7131e87), posterior a la base de la rama — no es de esta rama; se resuelve al integrar develop en el cierre — si me equivoco, el gate de cierre lo vuelve a dar rojo; cli:typecheck y cli:test no corrieron en la base (moon paró en el primer rojo)
Task 2: Ruling: M8 precisada — los dos sujetos GREEN nombran «avisos por correo» de la 0008 en Fuera de alcance y src/correo.js en lecturas; no es el canal de la 0013. La fila de M8 (battery.md y decisión 7 de la spec) excluye nombrar la 0008 — sin esa precisión la rúbrica, leída literal, daría falso rojo — si me equivoco, M8 deja pasar un canal colado vía la 0008
Task 2: Ruling: sin RED de la petición enmendada de e4 con el kit viejo — el RED de la original ya mostraba la conducta y relanzarlo pedía otra subida del techo de sujetos — si me equivoco, el GREEN de e4 podría pasar también con el kit viejo y no probar la plantilla (lo mitiga e2-1 GREEN, que aplica la forma nueva, y m8)
Task 2: Ruling: tope de sdd-templates 17460 → 18000 en word-budget.test.ts (enmienda aprobada); la retirada de los topes de palabras, pedida como fila a la sesión develop — si me equivoco, el tope queda 352 palabras holgado hasta esa fila
Final: Ruling: los ejes Spec y Código salen uno tras otro, no en paralelo — CLAUDE.md del dev-lead pide confirmar antes de paralelizar y la spec no lleva línea «Política de modelos» — cuesta ~10 min más de espera
Final: Ruling: m1-1 filtra el canal sin Abierto (Spec I3) — sin duda declarada por el usuario, la regla no salta; anotado en la evidencia y al ticket, sin medir m1 con el kit de develop (pedía subir otra vez el techo de sujetos) — si es regresión, llega a campo
Final: Ruling: tope 18000 y no 17700 (Código Minor 1) — es la opción que aprobó el dev-lead — deja 360 palabras de holgura
Final: Ruling: «lo que consta en el roadmap» sin acotar (Código Minor 4) — el dev-lead dijo que el roadmap ya lleva decisiones — una idea del agente escrita en un brief sale como segura (decisión 6 de la spec)
Final: Ruling: M8 deja pasar «(proposal 0010, §Reglas de negocio)» de m8-2 (Spec minor) — nombra la fuente sin ser ruta; la rúbrica pide origen, no ruta exacta — un origen vago pasa
