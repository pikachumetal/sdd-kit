---
id: 20261102-163940-feature-0280-campaign-subject-cap
feature: 0280
title: Walkthrough — El techo de sujetos sale de la spec y battery.mjs lanza un solo escenario
spec: ./spec.md
status: done
created: 2026-11-02
---

# Walkthrough — El techo de sujetos sale de la spec y battery.mjs lanza un solo escenario

## 1. Cambios realizados

- `tests/headless/campaign.mjs`: `forecastSubjects` lee el número de la fila `Suma` de «Previsión de coste» en `SPEC_DIR/spec.md`; `resolveSubjectCap` decide el techo y el aviso; la parada nombra la previsión. `SUBJECT_CAP` deja de ser obligatorio con previsión legible (53b0c61a).
- `tests/headless/battery.mjs`: `SCENARIOS` en `run`, cruzado con `STEPS`; el veredicto y el código de salida son solo de lo filtrado (53b0c61a).
- Cabeceras de `run.mjs` y `battery.mjs`, y `.docs/sdd/tech-stack.md`.
- Tests en `cli/test/kit/headless/campaign.test.ts` y `battery.test.ts`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,2 h (spec, sin plan: modo lite)
- Esfuerzo real: 0,36 h — reloj de la sesión 0,37 h desde 2026-11-02T16:37Z, sin 0 min de espera al dev-lead (1 espera)
- Desviación: −0,84 h (−70 %)
- Causa de la desviación: los dobles de `campaign.test.ts` y `battery.test.ts` ya cubrían todo lo que hacía falta montar, y no hubo ningún rojo inesperado.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort de la sesión
- Tokens del hilo: 6.174.279 — claude-opus-5-5 6.174.279
- Tokens de subagentes: 1.591.365 en 3 despachos — Final review — Code axis claude-sonnet-5-5 480.211 / 1 min; Final review — Spec axis claude-opus-5-5 918.927 / 3 min; Re-review fix range 0280 claude-opus-5-5 192.227 / 0 min
- Coste de la sesión: 6,32 $ (hilo 4,30 $ + subagentes 2,01 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

Revisión final: Spec opus+high, listo con fixes · Código sonnet+high, listo · Arquitectura no (lite, sin señales en el diff), sobre 53b0c61a. Pasada de fix: juntada en el cierre, 1 test nuevo, verde al escribirlo, y 3 retoques sin test posible. Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin roturas nuevas.

## 3. Desviaciones del plan

- _Ninguna_ respecto a la spec.

### Decisiones tomadas sin el dev-lead

- Aviso `capNotice` repetido por lanzamiento (Código, Minor) — lo aceptó la decisión 11 de la spec — coste: ruido en el log.
- Orden de errores de `readConfig` cambiado al salir `SUBJECT_CAP` de `REQUIRED` (Código, Minor) — inocuo, ningún test ni script depende de él — coste: otro mensaje primero si faltan dos variables.
- `resolveSubjectCap` lee, decide y redacta (Código, Minor) — 12 líneas y una sola razón de cambio — coste: un refactor.
- Comentarios de `run.mjs:5-6` y `battery.mjs:13` que nombran la spec (Código, declinado) — nombran el fichero que el código lee en ejecución, no trazabilidad — coste: reescribir tres líneas.
- `DRY_RUN` también limitado por la previsión (Spec, declinado) — la decisión 4 no hace excepciones — coste: un ensayo en seco parcial.
- `forecastSubjects` toma la celda tras `Suma` sin mirar la cabecera (Spec, declinado) — la plantilla fija el orden y ninguna de las 16 specs lo cambia — coste: un techo falso con columnas reordenadas.
- Un encabezado citado en un bloque de código desvía la lectura; `1 sujeto` y la negrita caen a `SUBJECT_CAP` (Spec, declinado) — no se da en specs reales y lo segundo avisa — coste: un aviso de más.
- Cambiar `SPEC_DIR` esquiva el techo (Spec, declinado) — el lanzador no puede saber la spec correcta; fuera de alcance — coste: una parada esquivable a propósito.

## 4. Verificación

### 4.1 Builds

- Baseline sobre 1538af66: `moon run kit:test-headless` → 364/364.
- Pasada de fix: `moon run kit:test-headless cli:typecheck` → kit:test-headless: corrió 381/381 · cli:typecheck: en verde (caché).
- Gate de cierre: corre en el paso de base integrada, sobre el commit de cierre; va en el mensaje final.

### 4.2 Smoke / tests

Validación en campo: 2026-11-02 · suite 381/381 · smoke 4 de 4 salidas con ejecución real de `run.mjs` y `battery.mjs run` sobre un sujeto de juguete, sin coste · revisión final Spec y Código sobre 53b0c61a, re-revisión limpia.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `Suma` 1 con `SUBJECT_CAP=9`, se lanzan `a b`: corre 1, aviso de que no sube y parada que nombra la previsión | ejecución real | ok |
| `Suma` vacía y `SUBJECT_CAP=1`: aviso `sin previsión legible` y parada de siempre | ejecución real | ok |
| `s1-1` guardado y `SCENARIOS=s3`: corre un sujeto, no aborta, veredicto solo de `s3`, salida 0 | ejecución real | ok |
| `SCENARIOS=nope`: `escenario desconocido: nope`, salida 2 | ejecución real | ok |
| Sin previsión ni `SUBJECT_CAP`: `define SUBJECT_CAP` | suite | ok |
| Sin `spec.md`, celda en prosa o `Suma` fuera de la sección: `SUBJECT_CAP` y aviso | suite | ok |
| `33 sujetos`, `SUBJECT_CAP` menor, previsión de 0 sin `NaN` | suite | ok |
| `STEPS` y `SCENARIOS` con cruce y sin él; `s3-1` guardado da `ya existe` | suite | ok |

### 4.3 Residuales / deuda generada

- La fila `Suma` lleva número en 10 de 16 specs: las otras 6 siguen con `SUBJECT_CAP` y aviso. Aclararlo en `spec-template.md` es editar lo que sigue un agente y lleva sujetos (Art. I); va en el ticket de esta feature para su triaje.

## 5. Aprendizajes

- El techo sale de la spec, y `SCENARIOS` lanza un escenario → `tech-stack.md`, «Baterías por skill» y «El techo de coste y el de sujetos».

Retro: sin señales

## 6. Adendas
