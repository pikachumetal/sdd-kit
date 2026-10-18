---
id: 20261017-220801-feature-0185-propose-fixes
title: Tasks — propose-fixes
---

# Tasks — propose-fixes (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Plantilla de spec y repaso de coherencia | done | 97fbc1f | sp1 2/2 tras dos REFACTOR |
| 2 | La aprobación de la spec como confirmación de paralelizar | done | 0a7d1df | enmienda: también en «The axes» de sdd-verify; mp1 3/3 |
| 3 | Plantilla de plan: cláusulas, regla retirada y «Verificación» | done | 088435e | enmienda: la línea de resumen literal; pl2 2/2 |
| 4 | Un patch es lo que un solo test reproduce | done | b99cc4a | pl1 2/2; l1 rojo también en la base |
| 5 | Secciones del diseño en llano | done | 7305859 | pb 2/2 |

Revisión final: Spec opus+high, 5 Important, 4 Minor · Código sonnet+high, 1 Important, 5 Minor · Arquitectura no (plan), sobre 7305859
Pasada de fix: juntada en el cierre, 4 hallazgos RED→GREEN (Código I1, Spec I1, I3 e I5; I2 e I4 por enmienda)
Re-revisión: 7305859..juntada en el cierre, sdd-kit:effort-high + opus, 5 ADDRESSED, 1 a medias (Spec I5, ruling), 4 Minor

## Rulings

Pre-flight: Ruling: T4 lanza la tanda con SCENARIOS explícitos (`pl1` n=2; `a2`, `a3`, `a4`, `l1` n=1) por run.sh, no STEPS=ceremony, que traería d1, p3 y k* fuera de la previsión — coste si es incorrecto: un control menos en el tramo, que cubre §3.
Task 1: Ruling: recuperación tras caída — texto de la Task 1 hecho y Pester en verde sin commitear; retomo en su GREEN (sp1). La baseline del gate de cierre se cortó: el conjunto rápido pasó en el pre-commit de 112888ba y el gate completo corre en la validación final — coste si es incorrecto: un rojo previo de los lentos aparece al final
Task 1: Ruling: GREEN sp1 0/2 en la tabla de topes; REFACTOR 1 (frase del paso 4) 0/2 y se quita; REFACTOR 2 lleva la regla a la ayuda de la sección (obligatoria si un test limita lo que edita, también si lo acorta) y sp1 sale 2/2; el AND «sin topes no se escribe» no cambia — coste si es incorrecto: el tramo de control lo vuelve a medir
Task 2: Ruling: tests/headless/lib.sh gana APPEND_SYSTEM (--append-system-prompt) para mp1 — con --setting-sources "" no llega un CLAUDE.md del molde, y la instrucción de campo era del usuario; fichero fuera de «Modificar» — coste si es incorrecto: una línea del lanzador
Task 2: Ruling: enmienda 2026-10-18 aprobada (opción «Apruebo la enmienda»): la regla va también en «The axes» de sdd-verify, tope 2990 / 9020 — GREEN mp1 0/2 con la regla solo en sdd-parallel-agents
Task 3: Ruling: enmienda 2026-10-18 aprobada (opción «Apruebo la enmienda»): la «Verificación» dice su línea de resumen literal; node --test acaba en ℹ duration_ms; el test RED de la Verificación cambia con la spec — GREEN pl2 0/2 en esa fila; cláusulas y anexo 2/2
Task 4: Ruling: la base avanzó (feature 0157 en develop): fila 0185 sin cambios; develop toca tests/WordBudget.Tests.ps1 y tests/headless/lib.sh, que editaron las Tasks 1 y 2, no los de la Task 4 — sigo; se resuelve en el merge de sincronización del cierre
Task 4: Ruling: el control l1 sale rojo (no cita las condiciones de lite: pregunta antes qué hace libres con la planta) también con el kit de la base (red/out/l1-1) — rojo previo, no de esta rama; va al ticket del cierre, no se arregla aquí — coste si es incorrecto: la batería sigue con un control rojo
Final: Ruling: el delta citaba el hueco de la plantilla («nada: comprobado con <búsqueda>») y capability merge lo rechaza como placeholder; pasa a un ejemplo («… con `grep -rn 0009 capabilities/ skills/`»), mismo significado — coste si es incorrecto: una palabra del AND
Final: Ruling: Spec I2, I3 e I4 cambian la spec — enmienda 2026-10-18 aprobada (opción «Apruebo la enmienda»): fuera el AND de los revisores de spec, la búsqueda también en los documentos, MODIFIED de verification
Final: Ruling: Spec I5 (la excepción «lo que la línea no nombra se confirma» sin contraejemplo ni GREEN) — se añade el contraejemplo («an Architecture axis you raise isn't in the line: confirm it»); el GREEN de la excepción es mp1-3, que paró por una línea fuera de lo aprobado — coste si es incorrecto: la excepción queda medida por un caso cercano, no por el suyo
Final: minor (deferred): la procedencia de la batería de sdd-propose sin filas para pl1, pl2, PB-L y pt1 (Spec M1, Código m4)
Final: minor (deferred): «Dónde se prueba» de mp1 nombra un CLAUDE.md del molde y la prueba usa APPEND_SYSTEM (Spec M2)
Final: minor (deferred): el nodo closed del árbol dot de «Is it really a patch?» no nombra la regla del test; la lleva «Fixed solution» (Spec M3)
Final: minor (deferred): la plantilla escribe «Política de modelos (solo en `delegate`):» y las reglas buscan «Política de modelos:» (Spec M4)
Final: minor (deferred): Get-Section con el centinela '@@none@@' y lecturas duplicadas en ProposeFixes.Tests.ps1 (Código m2)
Final: minor (deferred): solo 3 de ~20 tests llevan el prefijo «ProposeFixes:» (Código m3)
Final: minor (deferred): el envoltorio eval/declare -f de mp1 en subject.sh es frágil (Código m5)
Final: Ruling: dos citas mías del «Coherence pass» y del paso 2 se acortan para caber en 6.700 (la pasada de fix las dejó en 6.704); sin quitar ninguna instrucción — coste si es incorrecto: el lector abre la evidencia citada
Final: Ruling: Spec I5 sigue a medias tras la re-revisión — la excepción tiene su contraejemplo («an Architecture axis you raise isn't in the line: confirm it») pero ningún GREEN mide un eje subido; va al ticket como deuda — coste si es incorrecto: un eje Arquitectura subido sale sin la confirmación que pide el usuario
Final: minor (deferred): spec.md, decisión 3, sigue diciendo «capabilities/ y skills/» frente al AND enmendado (re-revisión)
Final: minor (deferred): spec.md, el ejemplo «grep -rn 0009 capabilities/ skills/» no busca en los documentos (re-revisión)
Final: minor (deferred): spec.md, la línea del merge sobre la copia dice «3 sustituidos» y ahora son 4 (re-revisión)
Final: minor (deferred): spec.md, sin línea en blanco antes de «## Previsión de la prueba» (re-revisión)
Final: minor (deferred): plan.md §4 traza el AND retirado de los revisores de spec; la plantilla y sdd-parallel-agents nombran los revisores de spec en la línea de la política (re-revisión)
Final: minor (deferred): el THEN de routing «ningún test de hoy los reproduce» es ambiguo frente a «tres tests» (re-revisión)
