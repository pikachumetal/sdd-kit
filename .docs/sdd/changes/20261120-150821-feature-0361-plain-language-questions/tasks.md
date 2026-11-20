# Tasks — feature 0361

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Escenario `j1` y su RED en la base | hecha; afectada por enmienda 2026-11-20 → Task 3 | 21eeb0038 |
| 2 — Mudar la regla y topes | hecha; revertida por la tercera enmienda (Task 3) | 92313cce4 |
| 3 — enmiendas 2026-11-20: `j1` en `reservas`, RED, GREEN, tanda de corrección y cierre solo con la prueba | hecha | (este commit) |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, sí · Arquitectura no (plan), sobre 71c3ccc83
Re-revisión: 71c3ccc83..(commit de cierre, que junta la pasada de fix), sdd-kit:effort-high + opus, limpia (3 Minor del walkthrough, arreglados en el hilo)

## Rulings

Task 1: Ruling: coste del sujeto j1 0,50 $ frente a 0,23 $ previstos (j1-2 llegó hasta el gate de la spec) — la previsión total pasa de 4,30 $ a ~5,40 $ — si me equivoco, el GREEN cuesta ~1 $ más
Task 1: Ruling: J2 acepta «ese día, a esa hora» con coma — j1-1 lo repite así; la fila medía la literalidad de las palabras, no la puntuación — si me equivoco, J2 pasa una paráfrasis con coma, que sigue siendo sus palabras
Task 2: Ruling: brazo base del A/B y GREEN de j1 a la vez (hasta 5 sujetos por campaña, por encima de los 3 de maxParallelAgents) — ahorra ~15 min de espera; la previsión de sujetos no cambia — si me equivoco, la máquina del dev-lead va más cargada mientras corren
Task 2: Ruling: pregunto al dev-lead antes de escribir la enmienda y despachar su revisor — el mensaje choca con su «sí» de esta sesión sobre los casos añadidos, y una enmienda escrita sobre la regla equivocada gasta una revisión — si me equivoco, la parada dura un turno más
Task 2: Ruling: lo que toca la Task 1 cerrada (j1 a reservas, J1, RED nuevo) y la medida (GREEN, A/B nuevo) van a una Task 3 — la Task 2 cierra con el texto de las skills y los topes; evidencia de antes de la enmienda en green-salas/ y ab-new-salas/; ab-base/ sigue valiendo (la base no cambia) — si me equivoco, el A/B compara la base con un sujeto de otro día
Final: Ruling: (Spec, Minor) 5 sujetos en paralelo frente a maxParallelAgents 3 — el revisor lo acepta; no cambia ningún resultado — si está mal, una tanda cargó más la máquina
Final: Ruling: (Código, Minor) partir J1 en J1a/J1b/J1c — W2 tiene un tamaño parecido y el lector la puntuó sin ambigüedad en 12 sujetos — si está mal, dos lectores la puntúan distinto
Final: Ruling: (Código, Minor) TURN2 presupone la pregunta del turno 1 — es lo que mide J2 a propósito; sin cambio — si está mal, J2 mide menos
Final: Ruling: (Spec, declinado) `subject.mjs` guarda la spec del sujeto desde `.docs/sdd/specs/` y los sujetos escriben en `changes/` — fuera del diff, afecta a A1 de `ag` — si está mal, A1 se puntúa sin el fichero: va al ticket
Final: Ruling: (Spec, declinado) R11 de g9 falla en la base 1 de 2 (ab-base/g9-2 sin WebSearch) — conducta de develop, no de la rama — va al ticket
Final: Ruling: decisiones 1-4 del ✋ de la spec y checklist §3 del plan describen el texto probado — las notas de la tercera enmienda en las secciones y en «Enmiendas» lo cubren; el ✋ es el registro de lo aprobado — si está mal, alguien lee una decisión retirada como vigente
