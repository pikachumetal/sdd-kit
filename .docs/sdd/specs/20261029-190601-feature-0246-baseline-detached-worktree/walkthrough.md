---
id: 20261029-190601-feature-0246-baseline-detached-worktree
feature: 0246
title: Walkthrough — La línea base corre en un worktree desanclado, y la pasada de fix no adjudica lo que mete
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — La línea base corre en un worktree desanclado, y la pasada de fix no adjudica lo que mete

## 1. Cambios realizados

- **`sdd-worktrees`** (`c9384d6e`; pasada de fix juntada en el cierre): el paso 3 corre el gate de cierre en `git worktree add --detach ../baseline-<id> HEAD`, nunca en el árbol de la sesión, donde caen los RED (salvo el fallback de sandbox). Allí hace el paso 2 (dependencias y `env:setup`) y se quita al acabar, en rojo o en verde (`env:clean` antes, si hubo `env:setup`). Con un rojo, repite en un worktree desanclado en la rama de integración, que también se quita. «Quick Reference» pierde «Baseline command» y «Gate filters by a base», del kit; «Tests fail during baseline», de superpowers, se queda.
- **`sdd-implement`** (`c9384d6e`): el paso 1 del Setup dice «and the baseline in a detached worktree».
- **`sdd-verify`** (`3b1f1a80`; pasada de fix juntada en el cierre): en «What it leaves open», «**A Critical, or an Important the fix pass brought in (its lines, or the re-review says so), is never adjudicated.**»: el hilo lo arregla con su test y lo lleva a ✋ como `sin revisar`. «Any other Important or Minor» se sigue adjudicando.
- **Baterías**:
  - En `sdd-implement`: `w2` (la línea base con un RED a medio escribir en el árbol, fila `Wb`), `w3` (la línea base roja, fila `Wr`) y `t6` (control de «sin bash» por el `#!`). La fila `Wt` de `w1` acepta el worktree desanclado.
  - En `sdd-verify`: `c8` (el Important de la pasada, fila `C8`) y los controles `c7` y `c9`, con el helper `amendSpec`.
  - Evidencia en `tests/baseline-detached-*.md` y `tests/fix-pass-effect-*.md`.
- **Spec, dos enmiendas** (`97de6276`): salen «El test de la pasada de fix afirma el efecto del hallazgo» y «Un valor que elige la pasada de fix sale de la spec», porque su RED salió limpio (Art. I). `sdd-tdd` y `plan-writing.md` no cambian.
- **Capacidades**: `feature-flow` gana «La línea base corre en un worktree desanclado en el commit de apertura»; `verification` gana «Un Important que mete la pasada de fix no se adjudica» y sustituye «La revisión se cierra una vez».
- **Saldo de palabras**: `sdd-worktrees` pasa de 1435 a 1432, `sdd-implement` de 9583 a 9582 y `sdd-verify` se queda en 3567. Ninguna skill crece.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 1,86 h — reloj de la sesión 2,31 h desde 2026-10-29T19:03Z, sin 27 min de espera al dev-lead (3 esperas)
- Desviación: −1,14 h (−38 %)
- Causa de la desviación (obligatoria si |desviación| > 30%): dos de las tres reglas salieron por su RED limpio. La Task 2 se cerró sin cambio de skill y la Task 3 con una sola viñeta. Las campañas corrieron en segundo plano mientras el hilo preparaba los moldes siguientes.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 91.266.220 — claude-opus-5-5 91.266.220
- Tokens de subagentes: 5.442.242 en 3 despachos — Final review — Spec axis claude-opus-5-5 3.454.107 / 8 min; Re-review final 0246 claude-opus-5-5 1.289.128 / 4 min; Final review — Code axis claude-sonnet-5-5 699.007 / 2 min
- Coste de la sesión: 30,14 $ (hilo 26,34 $ + subagentes 3,80 $)
- Coste de sujetos: 8,30 $ en 19 sujetos sonnet — RED `w2` 0,73 $; GREEN `w2`, `w1` 1,07 $; RED `c7`, `c8`, `c9`, `t6` 3,79 $; RED `c7` endurecido 0,58 $; GREEN `c8`, `c6` 1,10 $; controles de la pasada de fix `c8`, `w3` 1,03 $ (techo de la spec: 15 $)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La Task 2 se quedó sin cambio de skill, y la Task 3 sin la regla del valor: el RED de las dos reglas salió limpio. El dev-lead eligió recortar la del valor y endurecer el molde de la del efecto. Con el molde endurecido salió limpio otra vez y se recortó también. Son las dos enmiendas de la spec del 2026-10-29.
- El RED de `c8` y `c9` corrió con el kit del commit de apertura, no con el texto de la Task 2 (ruling de la Task 2).
- La rúbrica `C8` se recalificó en la pasada de fix. Su RED pasa de 0/2 a 1/2: el primer veredicto puntuaba distinto la segunda parte en el RED y en el GREEN, y lo cazó el eje Spec.

### Decisiones tomadas sin el dev-lead

- sin revisar: juntado en el cierre — la rúbrica `C8` vuelve a fallar si un sujeto arregla en silencio el Important de `canceladas` (Important N1 de la re-revisión, que trajo la pasada de fix), con tres textos de evidencia.
- Task 2: el RED de `c8` y `c9` corrió con el kit del commit de apertura — la Task 2 no toca lo que deciden — coste si está mal: repetir el RED de `c8` y `c9` (~2 $).
- Task 3 y revisión final (S-M7): `c5` no corrió como control, aunque la decisión 9 de la spec lo nombraba — la frase del Critical solo gana sujeto y `c8` la ejerce — coste si está mal: un Critical residual mal tratado sin medir (~0,6 $ medirlo).
- C-M1: `<id>` sin definir en `../baseline-<id>` — misma convención que `review-<id>` de `sdd-verify`, y los sujetos la resuelven — coste si está mal: un nombre de carpeta raro.
- N4: `../baseline-<id>` depende del cwd — la línea base corre desde la raíz del worktree, y `w1`, `w2` y `w3` lo resolvieron bien — coste si está mal: el worktree nace en otra carpeta y se quita igual.
- N6: «removed likewise» no dice que el paso 2 se haga en el reintento en la integración. Es un hueco anterior a la feature, sin saldo de palabras para cubrirlo — coste si está mal: un reintento sin dependencias sale rojo y da «no es de esta rama» en falso. Va al ticket.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 246/247 · cli:test: corrió 1664/1676 (12 saltados) · cli:typecheck: saltada (sin cambios en sus inputs frente a develop) · ~1 min 10 s · configuración: la del gate · sobre el commit de cierre.
  - El rojo de `kit:test-headless` es `test/kit/headless/molds.test.ts` > «sdd-archive construye en seco el molde reservas-e2e-stale (e1)», con `AssertionError: [e1-1] no arrancó el servidor ajeno`.
  - Sin arreglo, porque es de la máquina: `listen EACCES: permission denied 0.0.0.0:4456`. Windows reserva los puertos 3998-4597, y el molde elige uno al azar entre 4300 y 4899.
  - Solo, el test dio 1 rojo y 2 verdes en la rama, y 2 rojos y 1 verde en un worktree desanclado de `develop`. Es «No se repite», con su fila de deuda.
- Línea base: `kit:test-headless` 247/247 · `cli:test` 1664/1676, en un worktree desanclado en `40c72058`.
- Pre-commit de cada commit de la rama: `cli:typecheck cli:test kit:roadmap`, en verde.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · gate de cierre sobre el commit de cierre con el rojo de la máquina contrastado · campaña RED/GREEN de sujetos Sonnet sobre el texto final, con controles tras la pasada de fix · revisión final Spec opus+high (With fixes) y Código sonnet+high (Yes) sobre `3b1f1a80`, una pasada de fix y la re-revisión: 1 sin revisar.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `feature-flow`: la línea base corre en `git worktree add --detach … HEAD`, con dependencias y `env:setup` allí, y su resultado es el del commit de apertura | ejecución real (`w2`, GREEN) | 2/2 (RED 0/2) |
| `feature-flow`: al acabar, en verde o en rojo, se quita ese worktree, con `env:clean` antes; la sesión sigue en el suyo | ejecución real (`w2` verde, `w3` rojo) | 2/2 y 1/1 |
| `feature-flow`: en rojo, repite en un worktree desanclado de la rama de integración | ejecución real (`w3`, pasada de fix) | 1/1 |
| `verification` MODIFIED: un Important en código que ya vio la revisión final se adjudica con `Final: Ruling:` | ejecución real (`c8`, segundo Important) | 2/2 GREEN, 2/2 tras la pasada |
| `verification` MODIFIED: el resto (una pasada, una re-revisión, el Minor según `review.minors`) | no probado en esta feature | texto sin cambiar de sentido; `c1`, `c1f` y `c5` no corrieron |
| `verification` ADDED: el Important que trajo la pasada se arregla en el hilo con su test y va a ✋ `sin revisar`, sin otra re-revisión | ejecución real (`c8`) | 2/2 (RED 1/2) |
| `verification` ADDED: lo mismo si lo dice la re-revisión, sin caer en sus líneas | no probado | texto (`or the re-review says so`) |
| Control: el Important de la pasada cuyo arreglo cambia la spec para como desvío | ejecución real (`c6`) | 2/2 |

### 4.3 Residuales / deuda generada

- Fila nueva: «Intermitente: el molde `reservas-e2e-stale` elige un puerto que Windows tiene reservado», con el rojo de 4.1.
- «Una verificación de ausencia mira el nombre de los ficheros y no la propiedad» queda parcial: la regla no se escribió porque su RED salió limpio.
- N6 (el reintento en la integración sin el paso 2) va al ticket del kit.

## 5. Aprendizajes

- Califiqué `C8` con criterio distinto en el RED y en el GREEN, y lo cazó el eje Spec. La regla ya está en `tech-stack.md` («Cada sujeto se califica con la rúbrica escrita, literal, y fila por fila»): la regla existía y no la apliqué.
- Dos reglas pedidas por el campo (el efecto, con dos casos, y el valor de la spec, con tres) salieron limpias en un sujeto recién arrancado, y la del efecto también con el molde endurecido. Lo explica `tech-stack.md` («Un baseline limpio no reproduce los fallos de sesiones largas»); no es aprendizaje nuevo.
- El rojo del gate venía de un rango de puertos reservado por Windows, no de la rama. Ver el error real exigió ejecutar el servidor del molde a mano, porque el test lanza `env-up.mjs` con `stdio: 'ignore'`. Se apunta en la fila de deuda nueva, no como regla.
