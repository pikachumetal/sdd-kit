# Tasks — feature 0319

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — El aviso de solape en el roadmap 2.x | hecha | 43e2d920 |
| 2 — El aviso de solape en `ROADMAP.md` (3.0.0) | hecha | ce20f804 |

Revisión final: Spec opus+high, con arreglos (1 Important, 4 Minor) · Código sonnet+high, sí (8 Minor) · Arquitectura no (plan), sobre ce20f804
Pasada de fix: juntada en el cierre, 12 hallazgos (3 RED→GREEN, 5 tests de huecos sobre código que ya cumplía, 4 refactors con la suite)
Re-revisión: ce20f804..cierre (juntada en el cierre), sdd-kit:effort-high + opus, 13/13 resueltos, 3 Minor nuevos adjudicados

## Rulings

- Task 1: Ruling: el fixture del test por checkRoadmap no tenía Backlog, Deuda técnica ni Releases cerradas y fallaba por forma — le añado las secciones, sin tocar los asserts — si fuera un hueco del test, el aviso por checkRoadmap seguiría probado por las mismas líneas esperadas
- Task 1: Ruling: la «Verificación» del plan omitía --test-timeout 120000, que tech-stack.md §Testing pide si entran *.slow.test.ts; test/roadmap/ incluye publish*.slow y cut.slow, que dieron timeouts de 5 s bajo carga — la corro con ese tope, también en la Task 2 — si fuera un rojo real de esos tests, saldría igual con 120 s
- Task 2: Ruling: dos tests de now-next-later.test.ts («accepts Tras ids named by the changelog…» y «keeps escaped pipes…») cambiaban el «Tras» de la 0014 sin la 0013, con la que comparte `src/avisos.js`, y ganaban un aviso en una salida comparada entera — añado 0013 a su «Tras», sin tocar lo que prueban (decisión 5 del plan) — si fuera un hueco, los dos siguen probando el id del changelog y el pipe escapado igual
- Final: Ruling: los números de línea de dos tests nuevos de la pasada («dos releases…», «…antes que los de debt.md») estaban mal contados por mí antes del GREEN; los corregí con la salida real (y el aviso de «Descartadas» que da validDebt) — es dato del test, no del código — si estuviera mal, los asserts fallarían contra el código ya verde
- Final: Ruling: declinado por Código y Spec — los 6 avisos de develop y los moldes 14/9/0 — los corrí yo sobre la rama: 6 avisos y Roadmap válido; moldes 14, 9 y 0 — si cambiaran, el cierre los vuelve a correr
- Final: Ruling: declinado — límites conocidos de las decisiones 3, 4 y 6 (ids.mode cuenta como ruta; «después de» no ordena; una negación en prosa sí ordena; skills/ sin profundidad mínima) — los aprobó el dev-lead en la spec — un aviso de más o de menos en filas raras
- Final: Ruling: declinado por Spec — la cadena de la 3.0.0 no pasa por Later — coherente con la decisión 5 («las tablas que se leen»); una fila de Later no se lanza — un par Now/Next ordenado solo a través de Later avisaría de más
- Final: Ruling: declinado por Spec — las rutas de un aviso salen en el orden de la fila de arriba — es «en orden de aparición» de la restricción — solo cambia el orden dentro de la línea
- Final: Ruling: declinado por Código — el texto de sdd-roadmap y ordenar los 6 pares — fuera de alcance (0308 y el dev-lead) — ninguno
- Final: Ruling: Minor de la re-revisión — el describe «pasada de fix de la revisión final» nombra el proceso — se queda: los nombres de cada test dicen el comportamiento — solo afecta a cómo se agrupan en la salida de Vitest
- Final: Ruling: Minor de la re-revisión — el `const header` local del test de dos releases sombrea el `header` importado — se queda: está en su propio it y no se usa el importado dentro — confunde al leerlo, no rompe nada
- Final: Ruling: Minor de la re-revisión — NEXT_SECTION = 'Próximo' repite el literal de openRows en tables.ts — se queda: compartirlo es tocar tables.ts por un literal de una palabra — si la sección cambia de nombre, hay que cambiarlo en dos sitios
