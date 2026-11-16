---
id: 20261109-102437-feature-0322-deviations-and-amendments
feature: 0322
title: Walkthrough — Desvíos y enmiendas en sdd-implement, y el paquete de la revisión final con -C
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-09
---

# Walkthrough — Desvíos y enmiendas en sdd-implement, y el paquete de la revisión final con -C

## 1. Cambios realizados

- **`skills/sdd-implement/SKILL.md`, «Deviations and rulings»** (`120b4eb`). La frase de la parada se sustituye entera: en `pair` y `delegate`, una enmienda que cambia el delta pasa antes por un revisor `sonnet` (`sdd-kit:effort-medium`) con los siete puntos de `review-spec.md`, y sus hallazgos van en el ✋. La frase del REFACTOR también se sustituye entera, con la misma regla, el mismo ejemplo y el «not a ruling», para que el saldo de palabras quede en 0 (2.607). `dist/` reconstruido.
- **`skills/sdd-verify/references/encargo-revision.md`** (`cea28b0`): la receta del paquete pasa a `sdd workspace -C "<worktree de la feature>" "<plan>"`, con un saldo de −1 palabra.
- **Batería de `sdd-verify`**:
  - Filas nuevas C6r y C10r (el revisor de la enmienda) y Xw y Xw2 (`f1`, el `-C` y el destino del paquete).
  - C5, C6 y C8 ya no cuentan al revisor de la enmienda como «otra re-revisión».
- **Batería de `sdd-implement`** (`120b4eb`, `8d9ca07`):
  - Fila U1r en `u1`.
  - Escenario nuevo `k4` (la 0028 sobre `mold-kit`: dos red flags que la spec deja y un paso que solo cabe quitándolas), con fixtures y montaje en `subject.mjs`.
- **Evidencia**:
  - `tests/sdd-implement-0322-amendment.md`, `tests/sdd-implement-0322-ruling.md`, `tests/sdd-verify-0322-workspace.md` y `tests/sdd-implement-0322-tramo.md`.
  - Las salidas de los sujetos, en `red/`, `green/`, `tramo/` y `control/` de la carpeta de la spec.
- **No se escribió**: la red flag del ruling, porque `k4` salió limpio 3 de 3 (enmienda del 2026-11-09), y también `k4r`, que mide el mismo caso con la ronda de REFACTOR ya empezada.
- **Pasada de fix de la revisión final** (juntada en el cierre):
  - Escenarios `k4r` (el WHEN del caso de la 0306) y `g1a` (`g1` con `Agent`: una enmienda que no toca el delta no despacha revisor).
  - C2 ya no cuenta al revisor de la enmienda, y el comentario del molde de `k4` deja de citar la spec.
  - La evidencia corrige la lectura de `c8` y de Xw, guarda los encargos de los despachos `Agent` (`agent-prompts.md`) y la salida de las comprobaciones del kit.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 2,20 h — reloj de la sesión 2,61 h desde 2026-11-09T10:15Z, sin 25 min de espera al dev-lead (3 esperas)
- Desviación: −0,8 h (−27 %)
- Causa de la desviación (obligatoria si |desviación| > 30%): no aplica
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 99.845.675 — claude-opus-5-5 99.845.675
- Tokens de subagentes: 10.015.198 en 7 despachos — Final review — Spec axis claude-opus-5-5 4.496.950 / 6 min; Re-revisión final 0322 claude-opus-5-5 2.260.017 / 4 min; Revisor de spec 0322, segunda ronda claude-sonnet-5-5 497.736 / 1 min; Revisor de spec 0322, lente técnica claude-sonnet-5-5 979.582 / 2 min; Revisor de spec 0322, lente dominio claude-opus-5-5 555.901 / 2 min; Revisor de spec 0322 claude-opus-5-5 202.824 / 1 min; Final review — Code axis claude-sonnet-5-5 1.022.188 / 2 min
- Coste de la sesión: 36,86 $ (hilo 29,98 $ + subagentes 6,88 $)
- Coste de sujetos: 28,21 $ en 59 sujetos Sonnet y Opus — red 3,61 $; green 6,81 $; tramo 12,04 $; control 3,94 $; fix 1,81 $ (previsión de la spec: ~45,37 $ en ~59)
- Review de spec: 3 rondas (1 revisor; 2 revisores, dominio y técnica, pedidos por el dev-lead; 1 revisor por el Crítico) · hallazgos 39, aceptados 31 (y 1 en parte)

## 3. Desviaciones del plan

- El frente del ruling sale con un `Ruling:`, como punto «si el RED lo exhibe» limpio 3 de 3. Su AND sale del delta con su línea en «Enmiendas». La fila de deuda «Un freno que fija la spec se esquiva con un ruling» no se salda.
- Las salidas de los sujetos de la Task 1 se commitearon en la Task 2.
- `c8` entró en el GREEN de la Task 1 (estaba en el tramo de la spec, decisión 14), y `f1` llevó un control con `develop` que no estaba previsto.

### Decisiones tomadas sin el dev-lead

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

## 4. Verificación

### 4.1 Builds

- La suite corre una sola vez, sobre el merge de sincronización con `develop` (otra rama abierta, `patch/0294`, y la base por delante): su línea `Gate:` y su sha van en el mensaje final.
- Comprobaciones del kit sobre `cea28b0`: `kit:build`, `kit:copies` y `kit:skill-size` en verde; `kit:own` rojo, igual que `develop` (23 repeticiones frente a 24, ninguna nueva). `kit:test-headless` 452/452 tras la pasada de fix.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-09 · sujetos headless RED/GREEN (`c6` y `c10`: 0/5 → 5/5; `u1` 2/2), tramo de 30 sujetos sin rojos nuevos contra `develop`, `k4` y `k4r` limpios 3/3, `g1a` 2/2, receta del paquete ejecutada antes y después · revisión final Spec y Código sobre `cea28b0`, re-revisión de `cea28b0` a la pasada de fix 14/15 con 1 Minor adjudicado · sin verificar: Xw GREEN 0/1 y el relleno de `<worktree de la feature>` por un hilo real

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `control-profiles`, AND nuevo: en `pair` y `delegate`, la enmienda que cambia el delta pasa por un revisor de spec en `sonnet` con los siete puntos, y su ✋ trae sus hallazgos | ejecución real: sujetos headless, `c6` y `c10` (RED con el kit de `develop` 0/5, GREEN 5/5) y `u1` del tramo (2/2) | verificado |
| `control-profiles`, el resto del requisito (acción update, Task 3 de enmienda, excepción de la línea registrada, punto «si el RED lo exhibe») | ejecución real: tramo de 30 sujetos con el kit de la rama, sin rojos nuevos contra `develop` (`k1` y `a3` relanzados en control) | verificado |
| `verification`, AND nuevo: el paquete en el workspace de la feature, y sigue tras `git worktree remove` | ejecución real: la receta ejecutada en un worktree de revisión, antes (se borra) y después (sigue); y el paquete de esta revisión final, hecho con la receta nueva | verificado |

### 4.3 Residuales / deuda generada

- La fila «Un freno que fija la spec se esquiva con un ruling» sigue abierta: cinco REDs limpios con sujetos recién arrancados (`fr1`, `c10`, `d1`, `a1`, `k4`) frente a cinco casos de campo de sesiones largas.
- `skills/sdd-propose/references/control-profiles.md` §Deviation describe la acción update sin el revisor de la enmienda: para la 0311 (decisión 15 de la spec).
- `a3` sale 1/3 con el kit de la rama y 2/3 con `develop`. Por la regla de la decisión 13 no es un rojo nuevo, pero la diferencia es de un sujeto: va al ticket.
- `f1` no reproduce el fallo de campo del `-C` (el sujeto ejecuta la receta desde el worktree de la feature), y Xw da 0/1 en el GREEN. Nadie ha medido con sujetos si un hilo rellena bien `<worktree de la feature>`: va al ticket.
- `c8` para en un freno de alcance con un THEN propuesto y sin revisor. El revisor sale cuando la respuesta del dev-lead cambia la spec, pero si el dev-lead aprueba el THEN propuesto tal cual, nadie más lo lee: va al ticket.
- `skills/sdd-propose/references/control-profiles.md` (acción update) y la falta de una frase que explique `<worktree de la feature>` en `encargo-revision.md` quedan fuera por el saldo de palabras: van al ticket.

## 5. Aprendizajes

- Un rojo con un umbral n/n en un escenario que el control con `develop` tampoco pasa no es un rojo nuevo, pero puede salir un sujeto peor. Con n = 2 o 3 no se puede atribuir: se dice en el ✋ en vez de esconderlo → procedencia de la batería de `sdd-implement` (fila `g1a`): `tech-stack.md` está en su tope exacto (0284).
- Una fila de máquina que mide la forma de una llamada (`-C` en el comando) da rojo con los dos kits cuando el sujeto llega al mismo destino por otro camino. Si lo que importa es el destino, la fila mide el destino → procedencia de la batería de `sdd-verify` (fila de Xw y Xw2), por el mismo tope.

Retro: error que cazaría un chequeo → ticket del kit: la fila «Suma» de «Previsión de coste» que pide `spec-template.md` («~57 sujetos») no la lee `tests/headless/battery.mjs`, que solo lo avisa al lanzar la primera tanda, con la spec ya aprobada; el primer RED salió sin sujetos por falta de `SUBJECT_CAP`
Retro: búsqueda a ciegas → ticket del kit: `battery.mjs verdict` no filtra por `SCENARIOS` (pide los pasos como argumentos) y `tech-stack.md`, «Baterías por skill», solo dice que `verdict` lee `N`; tres intentos para dar el veredicto de una tanda filtrada en `sdd task done`
