# Tasks — feature 0206

| Task | Estado | Commit |
| --- | --- | --- |
| 1. Trasladar las referencias y actualizar los enlaces | done | 01be8f1d |
| 2. El camino de la feature: propose → implement → archive | done | 64a86577 |
| 3. El camino del patch en `sdd-implement` | done | 33d0d0b7 |
| 4. Retirada, migración, documentos y baterías | done | 420db4d8 |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 420db4d8

Pasada de fix: 144a9b2f, 3 hallazgos con medición
Re-revisión: 420db4d8..144a9b2f, sdd-kit:effort-high + opus, 2 abiertos: migración arreglada en el commit siguiente; Review Focus adjudicado

## Rulings

Final: Ruling: citas a `tests/sdd-start-feature-0146-red.md` en sdd-propose, review-spec y control-profiles se quedan — son historia de la evidencia, el fichero existe — coste si es malo: `git grep` del criterio las devuelve
Final: Ruling: §4 de `patch.md` con comando y resumen (`node --test` → 6/6), no la salida entera — la línea `Gate:` de sdd-verify pide eso — coste: ninguno, salvo que se quiera la salida literal
Final: Ruling: P7j va al paso 1 de sdd-archive y no a validation-template — la spec deja fuera el resto de las plantillas — coste: la regla vive en un paso largo
Final: Ruling: líneas de procedencia de batería de sdd-propose que citan sdd-start-patch se quedan — son historia de las reglas — coste: ninguno
Final: Ruling: `sr1` cuenta como verde con los dos `Agent` en segundo plano — el tools.txt no separa respuestas — coste: paralelo real sin confirmar
Final: Ruling: el Review Focus «patch con tasks.md en su carpeta» queda sin test — en una entrada nueva el sujeto crea su carpeta; un patch abierto con artefactos de más es retomar, de la 0116 — coste si es malo: lo destapa la 0116
Final: minor (deferred): el mensaje en campo sale tras el merge en v1b, no antes; se quita «before step 2» y V1 no mide el momento
