# Tasks — feature 0276

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — La forma nueva de `debt.md`, en la plantilla y en el check | hecha | en la historia de la rama |
| 2 — El triaje por causa y la búsqueda en la deuda al depurar | hecha | en la historia de la rama |
| 3 — La migración lleva las celdas nuevas | hecha | en la historia de la rama |

Revisión final: Spec opus+high, con fixes · Código sonnet+high, con fixes · Arquitectura no (plan), sobre c466954a
Pasada de fix: juntada en el cierre, 14 hallazgos; los de texto de skill, medidos con sujetos en `green-fix/out/`, con rojos adjudicados en el walkthrough

## Rulings

Task 1: Ruling: warnings.ts entra en la Task 1 — ACTING solo reconocía **Actuar → X**, y la spec pide reconocer **Actuar** → X · causa — coste si mal: un aviso de más en filas 2.x con esa forma
Task 2: Ruling: GIVEN de feature-flow reescrito tras el RED (fila con otras palabras; THEN por significado) — con el literal en la fila el RED no medía la regla — coste si mal: una enmienda que deshacer
Task 3: Ruling: la fila con marcas del molde apunta a 0022, no a 0030 — 0030 no existe en mold-v2x — coste si mal: ninguno
Final: Ruling: la skill sdd-roadmap pagaba menos de lo que añadía (detectado por los ejes) — recorto hasta el tope — coste si mal: otra tanda de sujetos
Final: Ruling: d1-2 da otra causa que la rúbrica C (GIT_INDEX_FILE) — el molde hook falla antes por CommonJS con type module, previo a esta rama; la conducta de la Fase 1 sin fila se cumple — coste si mal: un control de d1 que no mide su causa
Final: Ruling: el rechazo de una causa propuesta en la migración no se mide con sujetos — la persona de v1 aprueba siempre; el texto es una frase — coste si mal: una fila rechazada mal colocada, a la vista en el gate
Final: Ruling: m5-2 propone Later y m3-2 no cita el changelog — control con el kit de la apertura: m5 Next 2/2, y m3-2 tampoco propone la fila caducada; la regla de Next y Later no cambió y el GREEN previo dio Next 2/2: lo trato como ruido de muestra, sin atribuirlo a la rama — coste si mal: una regresión de M5 que sale en campo
Final: Ruling: d1 C 0/2 por el molde hook (CommonJS con type module, e16c6a1f), previo a la rama — fuera del alcance, va a una fila de deuda — coste si mal: d1 sigue sin medir su causa
Final: Ruling: test de vocabulario de la skill en cli/test/roadmap/ y no en cli/test/kit/ — vive junto a su lista — coste si mal: mover un test
Final: Ruling: una fila de En espera o Descartadas con la causa rechazada pierde «Falta» o «Motivo» al ir a Por triar, y un Salda a una fila rechazada no se vigila — caso raro, a la vista del dev-lead en el gate — coste si mal: un dato a reponer a mano

Re-revisión: c466954a..juntada en el cierre, sdd-kit:effort-high + opus, hallazgos abiertos adjudicados en el walkthrough
