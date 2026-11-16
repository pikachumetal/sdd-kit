---
id: 20261031-160141-patch-0265-battery-no-evidence-verdict
task: 0265
title: Patch — el veredicto de battery.mjs distingue «sin evidencia» de rojo y dice por qué no guardó
type: patch
solution: dev-lead
status: done
created: 2026-10-31
branch: patch/0265-battery-no-evidence-verdict
commit: e7a1f6df
---

# Patch 0265 — el veredicto de `battery.mjs` distingue «sin evidencia» de rojo y dice por qué no guardó

## Capacidades

- Ninguna, porque ninguna capacidad describe `tests/headless/battery.mjs` ni el método de baterías de `tech-stack.md`.

## 1. Síntoma

Ticket de la 0224 §2: «`ws3 · 2/2 · verde` en la primera ronda con `ws3-2` corriendo `node --test` antes de instalar (`ERR_MODULE_NOT_FOUND`). `co2 · 0/1 · rojo` y `co4 · 0/2 · rojo` con la conducta correcta, porque el lanzador imprimió `no se guarda co3-1.tools.txt: el stream sigue en …`».

## 2. Causa raíz

Son tres huecos del mismo veredicto:

- **Rojo sin medir**: `judge` trataba igual a quien falla y a quien no dejó salida (`missing > 0` da rojo).
- **Verde con un fallo de orden**: `ws3` no tenía comprobación de máquina, y la forma `tools: /<regex>/` de la 0260 mira cada llamada por separado, así que no puede expresar un orden.
- **Causa muda**: `saveExtract` descartaba el `stderr` de `extract.mjs`.

**Hipótesis del dev-lead, la marca LEAK: mecanismo reproducido, origen sin localizar.** Un stream con el nombre de git en un `tool_result` hace salir a `extract.mjs tools` con 3 y a `texts` con 0. Es el patrón de las salidas de la 0224: `green2/co2-1`, `red/co3-1`, `red/co4-1` y `final/co4-1` tienen `state.txt` y `texts.txt`, pero no `tools.txt`. Los streams de la 0224 ya no existen, así que no se puede saber qué llamada trajo el nombre. La copia del kit no lo lleva (`git grep` sobre `skills .claude-plugin agents cli hooks`: 0 resultados). El mensaje nuevo no nombra la llamada, pero sí distingue esta causa de un fallo de otro tipo.

## 3. Fix

- **Fichero(s)**: `tests/headless/battery.mjs`, `tests/headless/lib.mjs`, `tests/batteries/sdd-propose/battery.md`, `cli/test/kit/headless/battery.test.ts`, `cli/test/kit/headless/lib.test.ts`, `.docs/sdd/tech-stack.md`
- **Cambio**: un sujeto sin evidencia da `sin evidencia` en la línea del escenario, con sus etiquetas. `saveExtract` dice la causa que da `extract.mjs`. La nueva forma `` `tools: /A/ antes de /B/` `` declara el orden, y `ws3` la lleva en la fila `WS3`.
- **Decisiones**:
  - «Sin evidencia» no cuenta como verde ni como rojo; el que lee la tabla decide si relanza — dev-lead
  - La comprobación de identidad de `extract.mjs` se queda — dev-lead
  - Se mantiene como patch aunque lleve varios tests: son tres síntomas de un veredicto ya existente, con la solución en la petición — dev-lead
  - La forma `antes de`: la 0260 aplica la regex llamada a llamada, y la fila que pide el dev-lead necesita un orden. Compara posiciones sobre las llamadas juntas, así que `pnpm install; node --test` en una sola llamada pasa — sin el dev-lead (no cambia lo que ve un usuario del kit)
  - Con `/A/` y sin `/B/` falla; sin `/A/` no falla, porque no corrió el test — sin el dev-lead (ídem)
  - Un sujeto con `tools.txt` y sin RESULTADO (cortado) también sale «sin evidencia», con la nota `sin RESULTADO`: tampoco ha medido nada — sin el dev-lead (ídem)
  - Sigue siendo rojo si lo medido ya no alcanza el umbral aunque pasaran los que faltan, o si el kit no cargó: ahí el rojo es cierto — sin el dev-lead (ídem)
  - `run` y `verdict` salen con 3 si solo falta evidencia: con 0 dirían que todos pasan, y con 1, que hay un fallo — sin el dev-lead (ídem)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `extract.mjs` con el nombre de git en un `tool_result` | ✅ reproducido: `tools` sale con 3, `texts` con 0 |
| 2 | `battery.test.ts` y `lib.test.ts`: 10 tests en RED antes del fix | ✅ 99/99 tras el fix |
| 3 | `ws3` con `node --test` antes de `pnpm install`, con la batería real | ✅ test «da rojo a ws3…»: `WS3 falla en ws3-2` |
| 4 | Sujeto sin `tools.txt` | ✅ test «da sin evidencia…»: `r1 · 1/2 · umbral 2/2 · sin evidencia · sin tools.txt: r1-2` |
| 5 | Salidas reales de la 0224 con `battery.mjs verdict` | ✅ `green`: `ws3 · 1/2 · umbral 2/2 · rojo · WS3 falla en ws3-2`, salida 1. `green2`: `co2 · 0/1 · umbral 1/1 · sin evidencia · sin tools.txt: co2-1`, salida 3 |

Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 278/278 · cli:typecheck: corrió 1/1 (caché) · cli:test: corrió 1683/1695 (77 s, sobre e7a1f6df)

Validación en campo: 2026-10-31 · `battery.test.ts` y `lib.test.ts` 99/99 · `verdict` sobre las salidas reales de la 0224: `ws3` rojo en `green`, `co2` «sin evidencia» en `green2` · no probado: una campaña nueva con sujetos, ni el mensaje nuevo en un `no se guarda` real

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,01 h del gate de cierre (48 s, patch 0260)
- Inicio: 2026-10-31T16:01Z
- Esfuerzo real: 0,10 h — reloj de la sesión 0,10 h desde 2026-10-31T15:59Z, sin 0 min de espera al dev-lead (0 esperas). Por debajo de lo estimado (−80 %) porque la solución llegó fijada y el RED se midió con las salidas de la 0224
- Coste de sujetos: no aplica
