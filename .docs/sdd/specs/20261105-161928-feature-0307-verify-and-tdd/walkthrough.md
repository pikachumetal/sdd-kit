---
id: 20261105-161928-feature-0307-verify-and-tdd
feature: 0307
title: Walkthrough — sdd-verify y sdd-tdd con las tres reglas
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — sdd-verify y sdd-tdd con las tres reglas

## 1. Cambios realizados

- **`sdd-tdd`, cuatro frases sustituidas** (`06b3653a`): «**MANDATORY. Never skip.**» y el RED recibido pasan a una sola frase; «Fix test.» distingue el test que escribiste del que recibiste (K34); «Fix error,» pasa a «Any other error» y la regla del error de compilación queda solo en «Confirm:» (K35); «All tests pass» pasa a «The task's «Verificación» passes». Las cuatro con marcas `kit: 0307 · sustituye`; las dos `arregla: 0307` salen. `kit:copies` ya no da líneas «→ 0307».
- **`sdd-verify`, el cierre de la revisión a su referencia** (`181e8d30`): el cuerpo de `## Closing the review` pasa a `skills/sdd-verify/references/closing-the-review.md`, propio y sin marcas (en `own` de `upstream.json`); `SKILL.md` conserva el título con una frase que lo manda leer al volver los ejes. `dist/skills/sdd-verify/SKILL.md` baja de 22.881 a 16.768 bytes. K31 se reescribe sin excepción y «Running a gate» deja el «instead of». La procedencia de la batería de `sdd-verify` nombra la referencia.
- **`encargo-revision.md` en inglés** (`81059456`): prosa y títulos traducidos frase a frase (`# Review brief — mandatory header`, `## Final reviewer («Revisor final»)`, `## Implementer brief`); los cinco bloques que recibe el revisor, sin cambios.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5 h
- Esfuerzo real: 0,87 h — reloj de la sesión 1,05 h desde 2026-11-05T16:09Z, sin 11 min de espera al dev-lead (4 esperas)
- Desviación: −0,63 h (−42 %)
- Causa de la desviación: sin medir — la estimación de implementación (1,5 h) quedó por encima de la sesión entera; las esperas fueron 11 min (16:22Z 1 min; 16:26Z 0 min; 16:37Z 5 min; 16:47Z 5 min)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución)
- Tokens del hilo: 58.642.517 — claude-opus-5-5 58.642.517
- Tokens de subagentes: 7.101.410 en 7 despachos — Final review — Spec axis claude-opus-5-5 3.870.683 / 5 min; Revisor del desvío: dominio claude-opus-5-5 407.125 / 1 min; Revisor de spec: técnica claude-sonnet-5-5 279.084 / 1 min; Revisor de spec: dominio claude-opus-5-5 232.832 / 1 min; Re-revisión única 0307 claude-opus-5-5 574.960 / 1 min; Final review — Code axis claude-sonnet-5-5 685.157 / 2 min; Revisor del desvío: técnica claude-sonnet-5-5 1.051.569 / 3 min
- Coste de la sesión: 23,12 $ (hilo 18,17 $ + subagentes 4,95 $)
- Coste de sujetos: 2,04 $ en 4 sujetos sonnet — humo t1b 0,25 $; humo c1, c1f y t2 1,79 $
- Review de spec: 2 revisores · hallazgos 17, aceptados 13 (rechazados los dos pares «own y pending a la vez» y «el título rompe un ancla», con la comprobación en el código); y 2 revisores de la enmienda de la Task 2, a petición del dev-lead · hallazgos 14 (8 + 6), aplicados 12, el técnico 4 en parte (no se parafrasea para esquivar el detector) y el dominio 8 sin cambio que pedir

## 3. Desviaciones del plan

- **Pasada de fix de la revisión final**: K31 pasa a sustituir la frase que abre la regla, «Each fix is verified by TDD…» (el eje Spec la vio como excepción pegada a la anterior), y la frase de Verify RED de `sdd-tdd` se reescribe para leerse de corrido; enmiendas de las decisiones 4 y 6, sin aprobar.
- **Enmienda de «Dónde se prueba»** (Task 2, aprobada: «1»): al pasar el cierre de copia a propio, `kit:own` empareja dos de sus frases con `sdd-archive` (0305) y `sdd-implement` (0296), porque `canPair` no empareja dos copias. El criterio pasa de «una línea residual» al de la petición, «ninguna salvo las repetidas con la skill de otra fila».

### Decisiones tomadas sin el dev-lead

- Task 1: el humo corre con n = 1 sobre una copia de las baterías en `.temp/t7` (n y umbral 1/1 en c1, c1f, t2 y t1b; junctions a `tests/headless` y `build`), y `KIT_DIR` es una copia de `dist/` — la tabla lleva n = 2 — coste si es erróneo: un sujeto más por escenario.
- Task 3: «out in the background as soon as the last task's», repetida con `sdd-implement/SKILL.md:314` (0296), no se parafrasea y va al ticket para la 0311 — coste si es erróneo: una inclusión más en la 0311.
- Revisión final: Review Focus 2 (un Minor que ningún test reproduce) queda sin observar; se corrige la línea del plan en vez de abrir un escenario fuera de «Dónde se prueba» — coste si es erróneo: un Minor de nombre se apunta como deferred sin que la batería lo vea.
- Revisión final: lo que el eje Spec dejó en «Declined to judge» (bloque del encargo en castellano, `c1-1` arregla el Minor de su re-revisión, `tasks.md` pendiente en `81059456`, la lectura de K34 para un test propio, citas traducidas) queda como está — coste si es erróneo: ninguno en conducta.
- Revisión final: lo «no verificado» de los ejes lo corrió el hilo tras la pasada (`kit:skill-size`, `kit:copies`, `kit:own`, `cli:test` 2231/2243); la Confirmación de la ADR 0015 no tiene test en `cli/test/kit` desde la retirada de los `.Tests.ps1`, fuera de esta fila — coste si es erróneo: un rojo que vería la CI.
- Re-revisión: la spec y el plan citaban la frase vieja de Verify RED; se corrigen en un commit solo de docs, revisado en el hilo (5 líneas) — coste si es erróneo: ninguno en conducta.
- Re-revisión: «Never skip it, also with a RED you received» se queda, aunque «even for» suena mejor: cambiar la skill tras la re-revisión la dejaría sin revisar — coste si es erróneo: una lectura algo torcida.
- Re-revisión: las enmiendas de las decisiones 4 y 6 quedan sin aprobar, porque aplican literal «la frase que falla se sustituye, sin añadir otra» y `review.minors: fix`; van a ✋ — coste si es erróneo: revertir dos frases.

Minor diferido: `closing-the-review.md:37` cuenta «<n> hallazgos RED→GREEN» en `Pasada de fix:` aunque «Native» admite Minors arreglados sin test (fuera del diff del fix; al ticket).

## 4. Verificación

### 4.1 Builds

- `moon run kit:build`: verde; `git status --porcelain dist` vacío tras el build, sobre el commit de cierre.
- Línea base, en un worktree desanclado en `8c3d29b6`: Gate: `moon run kit:test-headless cli:typecheck cli:test` (sin `--affected`: rama recién abierta) → kit:test-headless: corrió 399/399 · cli:typecheck: corrió (exit 0) · cli:test: corrió 2229/2241 (12 skipped).
- Gate de cierre: corre en el paso 6, sobre el merge de sincronización, porque hay otras tres ramas abiertas (0296, 0305, 0306); su línea `Gate:` va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · `kit:skill-size` sin FALLA de `sdd-verify` (16.807 bytes en `dist/`) · `kit:copies` sin líneas «→ 0307» ni de `sdd-tdd` o `sdd-verify/SKILL.md` · `kit:own` con 4 líneas de `sdd-verify|sdd-tdd`, las 4 repetidas con la skill de otra fila · `cli:test` 2231/2243 tras la pasada de fix · humo t1b, c1, c1f y t2 4/4 con ejecución real (2,04 $) · revisión final Spec y Código sobre `81059456`, re-revisión limpia de Critical e Important (6/6 ADDRESSED, 3 Minor adjudicados)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `kit:skill-size` no da FALLA en `sdd-verify` | ejecución real | 16.807 bytes, sin línea de `sdd-verify` |
| `kit:copies` no da ninguna línea «→ 0307» | ejecución real | solo los cuatro `sin anotar` de otras filas (0296, 0305, 0306, 0297) |
| `kit:own`: ninguna línea de `sdd-verify` ni `sdd-tdd` salvo las repetidas con la skill de otra fila | ejecución real | 4: el preámbulo (0311), `sdd-archive/SKILL.md:24` (0305), `re-review-prompt.md:3` y `sdd-implement/SKILL.md:314` (0296) |
| `cli:test` pasa | ejecución real | 2231/2243, 12 skipped (el gate del paso 6 lo repite sobre la base integrada) |
| El agente lee el cierre desde la referencia: una pasada de fix, una re-revisión opus | ejecución real | `c1` y `c1f` abren `references/closing-the-review.md` tras cargar `sdd-verify`; C1 y C1f verdes |
| Tras un rojo, el gate con `--base <rojo>` | ejecución real | `t2`: T2a y T2b verdes |
| El implementador ve fallar el RED recibido antes de tocar `src/` | ejecución real | `t1b`: R verde |
| K34, K35 y la checklist de `sdd-tdd` | no probado | riesgo aceptado (spec, decisión 7) |

### 4.3 Residuales / deuda generada

- Tres frases que `kit:own` da repetidas con la skill de otra fila, nuevas tras esta feature, para la 0311 (que pasa de 8 a 11): «if the line says juntada en el cierre the closing» (`sdd-archive/SKILL.md:24`, 0305), «the what to check of the axes that went out» (`sdd-implement/references/re-review-prompt.md:3`, 0296) y «out in the background as soon as the last task's» (`sdd-implement/SKILL.md:314`, 0296). Van al ticket.
- Minor diferido: la línea `Pasada de fix:` de `closing-the-review.md:37` cuenta «RED→GREEN» aunque admite Minors sin test. Al ticket.
- El bloque del encargo que recibe el revisor sigue en castellano, igual en seis encargos de `sdd-implement` y `sdd-verify`, y choca con «Idioma de los nombres» de `verification` (spec, decisión 8). Va al ticket.

## 5. Aprendizajes

- Mover texto del kit de una copia a un fichero propio lo expone a las frases repetidas de `kit:own`, porque `canPair` no empareja dos copias: la enmienda de la Task 2 salió de ahí → `tech-stack.md`, «Traducir una skill con `kit:own` delante».
- Un humo con n = 1 sobre una batería de n = 2 va en una copia de `tests/batteries/` entera con junctions a `tests/headless` y `build`, que se quitan antes de borrarla → `tech-stack.md`, «Baterías por skill».
- La marca `sustituye: «S»` lleva en S solo las palabras que el bloque quita (`kit:copies` las da en su aviso), no la frase entera: ya lo dice `kit-distribution`, «Lo que sustituye una marca es lo que el bloque quita» → sin destino nuevo.

Retro: búsqueda a ciegas → la copia de las baterías para un humo con n = 1, que la 0312 solo nombraba en un ruling, queda escrita en «Baterías por skill» (.docs/sdd/tech-stack.md)

## 6. Adendas
