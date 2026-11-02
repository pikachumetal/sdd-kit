---
id: 20261102-125945-feature-0273-battery-honest-verdict
feature: 0273
title: Walkthrough — battery.mjs dice lo que de verdad comprobó
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-02
---

# Walkthrough — battery.mjs dice lo que de verdad comprobó

## 1. Cambios realizados

- `tests/headless/battery.mjs`: `puerta verde · sin leer: <filas>` con filas en prosa, fila `` `file: <fichero> /<regex>/` ``, salida 3 sin escenarios, cabecera con la forma de `KIT_DIR`, que `SUBJECT_CAP` acumula entre fases y que el id choca dentro de una fase (`9eb19f8e`, `94a0c4e9`, `13ea72fa`).
- `tests/headless/campaign.mjs` y `run.mjs`: salida 3 con `sin sujetos: <etiquetas>` o `sin RESULTADO: <etiquetas>`, mirando solo lo lanzado en esa ejecución (`94a0c4e9`).
- `.docs/sdd/tech-stack.md`: la regla del veredicto, la fila `file:`, el código de `run.mjs`, y `SPEC_DIR` donde decía `RUNS_DIR` (`13ea72fa`).
- Tests en `cli/test/kit/headless/`; `run.test.ts` lanza `run.mjs` y `battery.mjs verdict` de verdad (cierre).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 0,53h — reloj de la sesión 1,76 h desde 2026-11-02T11:57Z, sin 74 min de espera al dev-lead (2 esperas)
- Desviación: -0,97h (-65 %)
- Causa de la desviación: el encargo traía las decisiones y el código ya estaba leído al escribir el plan; la implementación fue casi transcripción, y la espera de la revisión en segundo plano apenas cuenta.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 11.782.734 — claude-opus-5-5 11.782.734
- Tokens de subagentes: 2.329.451 en 3 despachos — Re-review — fix pass 0273 claude-opus-5-5 715.046 / 2 min; Final review — Spec axis claude-opus-5-5 714.899 / 4 min; Final review — Code axis claude-sonnet-5-5 899.506 / 1 min
- Coste de la sesión: 9,35 $ (hilo 6,43 $ + subagentes 2,92 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La enmienda de la decisión 1: se nombran todos los ids de una celda «Fila», no solo el primero. Se commiteó en la pasada de fix marcada `sin aprobar` sin cumplir la excepción; lo cazó la re-revisión, paré, y el dev-lead la aprobó (opción 1, 2026-11-02).
- `run.test.ts` no estaba en la lista de ficheros del plan, aunque sí en el Scope de la spec; entró en la pasada de fix.

### Decisiones tomadas sin el dev-lead

- Test `puerta verde` con tools de k2, y `ws3` pasa a `puerta verde · sin leer: WS, L` — lo anticipa el riesgo del plan — un test.
- La tabla vacía en `battery.mjs run` rechaza con code 3 antes de `readConfig`, que daba `define SCENARIOS` — el THEN no cambia — una línea.
- Un rango en prosa («k1 a k3») cubre solo sus extremos, con marcador `ponytail:` — ninguna batería lo usa — un `verde` falso en los del medio si aparece.
- `verdict` sigue con 4 parámetros — API previa — ninguno.
- `file:` con nombre de carpeta o `..` lanza `EISDIR` — error de autor que grita — ninguno.
- El test de la cabecera lee frases — lo pide la spec — frágil al reformular.
- `launchIndex` ignora el código de cada campaña — decisión 10; el veredicto nombra lo mismo — ninguno.
- `SCENARIOS` en blanco imprime `sin sujetos: ` sin etiqueta y sale con 3 — texto feo.
- `failedChecksOf` con 4 parámetros, y `?? fila` en `rowIds` sin caso real — arreglarlos sería código sin revisar — ninguno.
- `parseCheck` sigue con el primer token en filas de máquina — ninguna rúbrica junta ids ahí — una nota con coma.

## 4. Verificación

### 4.1 Builds

- `pnpm --dir cli exec vitest run test/kit/headless` con `SDD_KIT_HEADLESS=1` → 359/359 sobre la pasada de fix; `moon run cli:typecheck` en verde. El gate de cierre corre tras integrar la base, porque esta avanzó: su línea `Gate:` va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-02 · headless 359/359 · humo con `battery.mjs run` y `run.mjs` reales en seco · revisión final Spec y Código sobre 13ea72fa, re-revisión con 12 abordados y la enmienda aprobada por el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Prosa → `puerta verde · sin leer: J1`, salida 0 | ejecución real (línea), suite (código) | `p1 · 1/1 · umbral 1/1 · puerta verde · sin leer: J1` |
| Solo `tools:` y `file:` → `verde` | ejecución real | `m1 · 1/1 · umbral 1/1 · verde` |
| Línea solo en el chat → rojo, salida 1 | ejecución real | `f1 · 0/1 · umbral 1/1 · rojo · F1 falla en f1-1`, exit 1 |
| `file:` con barras → mal escrita | suite | `K6: comprobación mal escrita` |
| `todos menos k2` y celda sin ids | suite | como pide la spec |
| `stop` → 3 y `sin sujetos: a-1` | ejecución real | `sin sujetos: a-1`, exit 3 |
| Sin RESULTADO o sin `tools.txt` → 3 | ejecución real (`run.test.ts`) | `sin RESULTADO: a-1`, status 3 |
| Todos con RESULTADO → 0 | ejecución real (`run.test.ts`) | status 0 |
| Tabla vacía → 3 y lo dice | ejecución real (`verdict`), suite (`run`) | `sin escenarios en <tabla>`, exit 3 |
| La cabecera nombra los tres tropiezos | suite | `la cabecera de battery.mjs` |

### 4.3 Residuales / deuda generada

- Ninguna fila nueva.

## 5. Aprendizajes

- El techo cuenta por `SPEC_DIR`, no por `RUNS_DIR` → `tech-stack.md`.
- Retro: documento o skill desmentido → corregido en el mismo documento (`.docs/sdd/tech-stack.md`, «del mismo `RUNS_DIR`»)

## 6. Adendas
