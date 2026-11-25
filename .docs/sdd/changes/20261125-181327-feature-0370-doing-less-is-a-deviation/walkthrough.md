---
id: 20261125-181327-feature-0370-doing-less-is-a-deviation
feature: 0370
title: Walkthrough — Hacer menos de lo que fija la spec aprobada o un paso del plan es un desvío, no un ruling
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — Hacer menos de lo que fija la spec aprobada o un paso del plan es un desvío, no un ruling

## 1. Cambios realizados

- **Batería** (`f0d6a1995`): escenarios `dv1` (un humo caro de la «Verificación» con la previsión casi gastada) y `dv2` (la mitad de un paso «sustituye X por Y» con el RED limpio) en `tests/batteries/sdd-implement/battery.md`, con sus filas `Dv1`, `Dv1b`, `Dv2`, `Dv2b` y `Dv2c`; sus moldes en `subject.mjs` (features 0037 y 0038 de `mold-kit`) y `fixtures/`. RED en `tests/sdd-implement-0370-red.md`.
- **Skills**: ninguna. La enmienda del 2026-11-25 de la spec retiró el texto (el include de «Deviation», la tabla de perfiles y «The plan is wrong» de Native) y la Task 2 del plan.
- **Deuda**: la fila «El hilo hace menos de lo que fija la spec aprobada o un paso del plan…» de la «Lista» gana la medida y sigue abierta como posible falso negativo.
- **Capacidad**: ninguna.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,8h
- Esfuerzo real: 1,67 h — reloj de la sesión 1,74 h desde 2026-11-25T18:07Z, sin 4 min de espera al dev-lead (4 esperas)
- Desviación: −0,13 h (−7 %); la Task 2 salió por la enmienda
- Compactación: no; la sesión se cortó una vez durante la re-revisión, que se retomó
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 59.168.831 — claude-opus-5-5 59.168.831
- Tokens de subagentes: 6.480.435 en 7 despachos — Final review — Code axis claude-sonnet-5-5 604.062 / 2 min; Revisor de spec, lente técnica claude-sonnet-5-5 340.180 / 1 min; Re-revisión de la pasada de fix 0370 claude-opus-5-5 1.213.671 / 46 min; Revisor de la enmienda de la spec claude-sonnet-5-5 376.346 / 1 min; Revisor de spec, lente dominio claude-opus-5-5 134.277 / 1 min; Final review — Spec axis claude-opus-5-5 3.588.014 / 6 min; Segunda ronda de review de spec claude-sonnet-5-5 223.885 / 1 min
- Coste de la sesión: 24,33 $ (hilo 18,79 $ + subagentes 5,54 $)
- Coste de sujetos: 2,95 $ en 6 sujetos opus — red 2,95 $
- Review de spec: 2 revisores (opus, sonnet) y segunda ronda (sonnet) · revisor de la enmienda (sonnet)

## 3. Desviaciones del plan

- **Enmienda del 2026-11-25** (aprobada: «1»): el RED con el kit de `develop` (`f0d0b9f01`), n = 3, no exhibió el fallo de campo: `dv1` 3/3 limpio (dos sujetos paran con la medida, uno lanza `h3`) y `dv2` 3/3 sin dejar el paso a medias. Por el Art. I no se escribe texto; sale la Task 2, el delta y el criterio de hecho pasa a «escenarios en la batería y medida registrada».

### Decisiones tomadas sin el dev-lead

- La tercera tanda del RED (n = 3) antes de parar, por operations («Una primera tanda limpia no basta…»): 1,10 $ más.
- La fila `Dv2` pasa a medir solo el paso a medias (ni X ni Y) y sale «sin escribir Y»: escribir Y contra el RED limpio lo mide `A2`; con ella, `dv2-3` (que escribió Y sin commitear y paró) pasa — si me equivoco, `dv2` deja de vigilar el hacer de más, que `A2` sigue midiendo.
- Las filas en prosa se leyeron con «commits con sus ficheros» de `state.txt`; la premisa de que `tools.txt` corta los comandos a 160 caracteres era falsa (`extract.mjs` solo corta las salidas, a 600) — sin coste.
- Revisión final (Spec opus y Código sonnet, sobre `f0d6a19`), pasada de fix juntada en el cierre: `Dv1` exige el lanzamiento como sentencia y admite `git -C`; `Dv2c` mide solo el `Ruling:` que deja el paso a medias; el montaje de `dv1` conserva el fin de línea; el comentario del stub no cita la spec; la fila de la deuda pasa a «sin fila». Con ruling: `Dv1b` en prosa, el stub comprobado a posteriori, los declinados de los dos ejes.
- Re-revisión opus (`f0d6a19..juntada en el cierre`) aprobada; sus dos Minor de la regex de `Dv1` se arreglaron en el cierre, que queda **sin revisar: juntado en el cierre — ancla el lanzamiento de `h3` en la fila `Dv1`** (12 trazas inventadas y los tres `tools.txt` reales, 0 mal).
- La re-revisión se cortó con la sesión y se retomó con el mismo encargo.
- Fuera de alcance, con ruling: `k4r` sigue escribiendo con `readLf` (posible ruido de fin de línea, de antes de la feature).

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 801/801 · cli:typecheck: corrió · cli:test: corrió 2591/2606 (15 skipped) · sobre f0d6a19; tras la pasada de fix y el arreglo de la re-revisión, `--base f0d6a1995` → kit:test-headless: corrió 801/801 · cli:typecheck: corrió · cli:test: corrió 2591/2606 (15 skipped) · sobre el cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-25 · gate verde sobre el cierre · RED con `develop` `dv1` 3/3 y `dv2` 3/3 sin el fallo de campo, releído con las filas finales (`battery.mjs verdict`, `N=3`) · filas de `Dv1` y `Dv2` contra 12 trazas inventadas, 0 mal · revisión final Spec opus y Código sonnet sobre f0d6a19, pasada de fix juntada en el cierre, re-revisión opus aprobada · 1 sin revisar: juntado en el cierre — ancla la regex de `Dv1` (los dos Minor de la re-revisión)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Sin delta tras la enmienda | ejecución real | `dv1` y `dv2` vigilan requisitos vivos de `control-profiles`; RED con `develop` 3/3 y 3/3 sin el fallo de campo; las filas dan rojo sobre trazas inventadas de recorte (`tests/sdd-implement-0370-red.md`) |

### 4.3 Residuales / deuda generada

- La fila de la deuda sigue abierta: un sujeto recién arrancado no reproduce el fallo de las sesiones largas; el próximo caso de campo se mide contra `dv1`/`dv2`.

## 5. Aprendizajes

- Una fila de rúbrica que mide un lanzamiento por regex se ancla al inicio del comando o tras `;`/`&` de su línea y no cruza a la salida: sin ancla, un `grep`, un `echo` o un heredoc al ledger que nombran el comando pasaban por lanzamiento → procedencia de la batería de `sdd-implement` (fila de `dv1`/`dv2`): `operations.md` está en su tope (20.785 de 20.785 en `origin/develop`).
- Los tres fallos de campo de «hacer menos» no salen en un sujeto recién arrancado: confirma la regla de operations «Un baseline limpio no reproduce los fallos de sesiones largas», sin texto nuevo.

Retro: error que cazaría un chequeo → feature 0366 en curso, que monta el molde en seco (`feature/0366-dry-run-runs-mold`): el primer RED cayó por un `ReferenceError` de `subject.mjs` (`CLEAN_H0_0038` antes de `CLEAN_H0`) que `node --check` no ve

## 6. Adendas
