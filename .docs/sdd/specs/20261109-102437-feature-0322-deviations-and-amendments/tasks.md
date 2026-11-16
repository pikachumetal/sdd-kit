---
id: 20261109-102437-feature-0322-deviations-and-amendments
title: Tasks — Desvíos y enmiendas en sdd-implement, y el paquete de la revisión final con -C
spec: ./spec.md
plan: ./plan.md
created: 2026-11-09
---

# Tasks — Desvíos y enmiendas en sdd-implement, y el paquete de la revisión final con -C (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0322-deviations-and-amendments`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | El revisor de spec antes de la parada por una enmienda | done | 120b4eb | |
| 2 | Un `Ruling:` no quita lo que la spec fija (si el RED lo exhibe) | done | 8d9ca07 | k4 limpio 3/3: la red flag no se escribe (enmienda del 2026-11-09) |
| 3 | El paquete en el workspace de la feature, y el tramo sin rojos nuevos | done | cea28b0 | |

## Verificación por task

- [x] Task 1 — los comandos de su campo «Verificación» del plan
- [x] Task 2 — los comandos de su campo «Verificación» del plan
- [x] Task 3 — los comandos de su campo «Verificación» del plan

Revisión final: Spec opus+high, con arreglos (4 Important, 6 Minor), 4 sin verificar · Código sonnet+high, con arreglos (2 Important, 3 Minor) · Arquitectura no (plan), sobre cea28b0
Pasada de fix: juntada en el cierre, 11 hallazgos (k4r y g1a medidos RED/GREEN; resto evidencia y rúbrica), 7 con Final: Ruling
Re-revisión: cea28b0..juntada en el cierre, sdd-kit:effort-high + opus, 14/15 resueltos, 1 Minor adjudicado (ruling), 3 Minor nuevos (2 arreglados en la evidencia, revisado en el hilo; 1 ruling)

## Rulings

- Task 1: Ruling: la base avanzó 9d8f5143..3b179f84 (0309, 0321) sin cambiar la fila 0322 ni ficheros de la Task 1 — sigo sin sincronizar — si una tanda falla por el lanzador de develop, se sincroniza antes de la siguiente
- Task 1: Ruling: preparo el molde de k4 (Task 2) mientras corre el RED de c6/c10 — no comparten ficheros ni lo recorta ese RED — si el RED de la Task 1 cambia el plan, el molde espera
- Task 2: Ruling: k4 limpio 3/3 con el kit de develop (los tres paran con ✋ y proponen subir el tope; ninguno quita las red flags) — la red flag del ruling no se escribe y su AND sale del delta, como dice la decisión 7 — si el fallo de campo vuelve, la fila de deuda sigue abierta con esta evidencia
- Task 2: Ruling: las salidas de los sujetos de la Task 1 (red/out y green/out de c6, c8, c10, c10e) entran en el commit de la Task 2 — se quedaron fuera del de la Task 1 — sin coste: es evidencia, no cambia la regla
- Task 3: Ruling: la base avanzó a 9bf26d72 (0284: topes de palabras sin margen) y la fila 0311 cita la 0322; la fila 0322 no cambia ni ningún fichero de la Task 3 — sigo; el saldo de palabras se comprobará contra develop antes del merge — si sube una palabra, el gate de la sincronización da rojo
- Task 3: Ruling: f1-1 rojo en Xw (sin -C) y verde en Xw2: ejecutó la receta desde el worktree de la feature y no desde $REVIEW_DIR, así que quitó el -C y el paquete quedó en el workspace de la feature — no regradúo la fila (es la decisión 10 aprobada): relanzo f1 con el kit de develop como control (decisión 13) — si allí también falla, no es rojo nuevo y va al ✋ del cierre
- Final: Ruling: Código I2 (el regex de Xw fallaría con -C entre comillas) — no se arregla: la última / es el delimitador y el patrón acaba en espacio; casa con `workspace -C "/d/…"` y `-C "$FEATURE_DIR"` (comprobado con node) — si un sujeto escribe `-C"…"` sin espacio, Xw daría rojo falso
- Final: Ruling: Código m1 (capturar FEATURE_DIR en el primer bloque) — no se cambia: son dos llamadas de shell y la variable no llega a la receta (decisión 16 de la spec); el hueco se explica en una frase (Spec m3) — si un hilo rellena el hueco con el worktree de revisión, el paquete vuelve a perderse
- Final: Ruling: Código m2 (C6r y C10r duplicadas) — se quedan: la rúbrica lleva una fila por escenario y la evidencia las cita por id — si cambia la regla, hay que editar tres filas
- Final: Ruling: Código m3 (el script estructural como test) — no se convierte: un test de Vitest sobre el texto de la receta prueba una frase (ADR 0019); la comprobación queda en la evidencia con su salida — si la receta se rompe, solo lo ve una ejecución a mano o la revisión
- Final: Ruling: Spec I2 (c8 para con un THEN propuesto sin escribirlo ni revisor) — no es la regla incumplida: c8 para a preguntar qué texto usar (una decisión que cambia la salida observable, un freno de alcance), y el AND vigente aplica la acción update cuando la respuesta cambia la spec; con la respuesta, la corrección escrita pasa por el revisor — se corrige la lectura de la evidencia — si el dev-lead aprueba el THEN propuesto sin otra lectura, es el caso de la 0297 por otra puerta
- Final: Ruling: Spec I4 (Xw 0/1 dado por «no es rojo nuevo») — se corrige la evidencia: la regla de la decisión 13 no aplica a una fila que mide el texto nuevo; Xw GREEN 0/1, el relleno del hueco sin medir con sujetos, el destino lo cubre la comprobación estructural; el molde de f1 va al ticket — si un hilo real rellena mal el hueco, nada lo mide
- Final: Ruling: Spec m3 (el hueco <worktree de la feature> sin frase que lo explique) — no se escribe: la explicación más corta suma +7 palabras sobre un saldo de −1, con los topes exactos de la 0284, y el nombre del hueco dice qué va en él — si un hilo lo rellena con el worktree de revisión, el paquete vuelve a perderse (f1 no lo mide: va al ticket)
- Final: Ruling: re-revisión, hallazgo 14 (C6r y C10r duplicadas; el motivo anterior, «una fila por escenario», era falso: la rúbrica admite `R | s1, s1b`) — se quedan separadas porque las dos evidencias (amendment y tramo) las citan por id, y unirlas renombraría una tras medir — tres copias de la misma regla en dos baterías: si cambia, se editan las tres
- Final: Ruling: re-revisión, roturas Minor de battery.md (la procedencia de G1a dice 2/2 con una sola parada; la de C5, C6 y C8 no nombra C2) — sin commit en battery.md tras la re-revisión, que quedaría sin revisar: la lectura exacta está en tests/sdd-implement-0322-tramo.md, enlazado desde la fila — quien lea solo la fila de procedencia sobreestima la medida de g1a
- Final: Ruling: re-revisión, fuera de alcance (K4r no exige la corrección escrita en spec.md) — se queda: K4r mide no quitar las red flags; dejar o no la corrección con tres opciones abiertas es la acción update de siempre, que miden u1 y a1 — si un sujeto para sin dejar nada escrito, K4r pasa igual
