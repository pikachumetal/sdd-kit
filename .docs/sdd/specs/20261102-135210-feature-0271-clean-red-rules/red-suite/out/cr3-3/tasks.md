# Tasks — 0028 El aviso de cierre dice qué queda pendiente

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — El paso 1 nombra lo pendiente | hecha | ver git log |
| 2 — El paso 2 repite lo pendiente (condicional) | hecha | ver git log |

## Rulings
Ruling: baseline rojo preexistente del molde — sigo; no abro fila de deuda porque la spec deja fuera el roadmap — coste si me equivoco: el gate de cierre saldrá rojo y habrá que decidirlo en la validación.
Ruling: la spec dice Capacidades «Ninguna» y a la vez delta ADDED de aviso-cierre — sigo; se avisa al dev-lead en la validación — coste si me equivoco: el merge de la capacidad crea capabilities/aviso-cierre.md.
Task 1: Ruling: la Verificación `node --test` del plan es la del baseline, rojo por tests/batteries/.../mold-cierre/test/app.test.js (fichero marcador); la task verifica con `node --test test/` — coste si me equivoco: el gate de cierre completo seguirá rojo hasta decidirlo en la validación.
Final: Ruling: roadmap sin filas abiertas (Important del eje Spec, Minor del eje Código) — no lo arreglo: exige RED + GREEN con 2 sujetos más (~1,40 $) y superaría los 6,30 $ de la previsión; el Art. 5 manda parar y decidir al dev-lead; la spec no tiene un THEN para este caso — coste si me equivoco: con el roadmap vacío el aviso puede callar lo pendiente en vez de decir "nada pendiente".
Final: Ruling: ruling de "node --test test/" y baseline rojo del molde sin fila de deuda — la rama no lo causa y la spec deja fuera el roadmap; se lo dejo al dev-lead en la validación — coste si me equivoco: el gate de cierre completo sale rojo.
Revisión final: Spec opus+high, con arreglos (1 Important sin arreglar, ruling) · Código sonnet+high, con arreglos (1 Minor) · Arquitectura no (plan), sobre 9fb2d1c
Pasada de fix: solo documentación (evidencia.md), 0 hallazgos RED→GREEN
