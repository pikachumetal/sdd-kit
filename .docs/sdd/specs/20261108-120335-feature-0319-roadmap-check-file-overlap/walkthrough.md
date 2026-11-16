---
id: 20261108-120335-feature-0319-roadmap-check-file-overlap
feature: 0319
title: Walkthrough — sdd roadmap check avisa de dos filas abiertas que tocan los mismos ficheros sin «tras» entre ellas
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-08
---

# Walkthrough — sdd roadmap check avisa de dos filas abiertas que tocan los mismos ficheros sin «tras» entre ellas

## 1. Cambios realizados

- **CLI** (`43e2d920`, `ce20f804`): `cli/src/roadmap/overlap.ts`, nuevo, con `overlapWarnings` (pares de filas abiertas, salto del mismo id salvo `0000`, cadena de «tras» con visitados, solape por ruta o carpeta, orden por línea) y dos lectores, `twoPointOverlapRows` (Próximo y `## Release <N>` de la 2.x) y `nowNextOverlapRows` (Now y Next de `ROADMAP.md`). `cli/src/roadmap/check.ts` añade sus avisos tras los del id repetido en las dos formas; en la 3.0.0, con la función nueva `nowNextLaterWarnings`.
- **Pasada de fix de la revisión final** (juntada en el cierre): el lector de `ROADMAP.md` solo lee Now y Next con la cabecera de la plantilla, por `kindOf` (exportado de `now-next-later.ts` con `HEADER`); dos filas `0000` ya no comparten nodo en la cadena; la columna de la release se filtra por su índice en `cells`; las rutas se miran antes de recorrer el grafo; `sharedPaths` se parte en `innerOverlap`.
- **Tests**: `cli/test/roadmap/overlap.test.ts`, nuevo (43 tests); `now-next-later.test.ts`, dos tests con 0013 en el «Tras» de la 0014 para no ganar un aviso.
- **`dist/cli/src/roadmap/`** regenerado con `moon run kit:build`.
- **Capacidad `roadmap`**: el requisito «Dos filas abiertas que tocan lo mismo sin «tras» entre ellas se avisan» y la regla **Avisos** reescrita.
- **Changelog**: entrada de la Feature 0319 en `[Unreleased]`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,5 h
- Esfuerzo real: 0,86 h — reloj de la sesión 1,00 h desde 2026-11-08T11:59Z, sin 8 min de espera al dev-lead (3 esperas)
- Desviación: −0,64 h (−43 %)
- Causa de la desviación: la lógica del aviso ya estaba escrita y medida en el borrador del scratchpad antes del plan (decisiones 9 y 10 de la spec), y las dos tasks fueron transcripción con TDD; esperas 12:06Z 4 min, 12:15Z 4 min, 12:19Z 0 min
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 34.495.980 — claude-opus-5-5 34.495.980
- Tokens de subagentes: 3.002.792 en 5 despachos — Re-review final fix pass claude-opus-5-5 421.254 / 2 min; Final review — Code axis claude-sonnet-5-5 801.909 / 2 min; Revisión de spec: técnica claude-sonnet-5-5 376.443 / 2 min; Final review — Spec axis claude-opus-5-5 1.265.145 / 3 min; Revisión de spec: dominio claude-sonnet-5-5 138.041 / 1 min
- Coste de la sesión: 15,53 $ (hilo 12,71 $ + subagentes 2,83 $)
- Coste de sujetos: no aplica
- Review de spec: 2 revisores · hallazgos 19, aceptados 18

## 3. Desviaciones del plan

- _Ninguna_ en lo que hace el código. Dos ajustes de verificación y de fixtures, como rulings (abajo).

### Decisiones tomadas sin el dev-lead

- Task 1: el fixture del test por `checkRoadmap` no tenía Backlog, Deuda técnica ni Releases cerradas y fallaba por forma — le añadí las secciones, sin tocar los asserts — si fuera un hueco del test, el aviso por `checkRoadmap` seguiría probado por las mismas líneas esperadas.
- Task 1: la «Verificación» del plan omitía `--test-timeout 120000`, que `tech-stack.md` §Testing pide si entran `*.slow.test.ts`; `test/roadmap/` incluye `publish*.slow` y `cut.slow`, que dieron timeouts de 5 s bajo carga — la corrí con ese tope, también en la Task 2 — si fuera un rojo real de esos tests, saldría igual con 120 s.
- Task 2: dos tests de `now-next-later.test.ts` cambiaban el «Tras» de la 0014 sin la 0013, con la que comparte `src/avisos.js`, y ganaban un aviso en una salida comparada entera — añadí 0013 a su «Tras», sin tocar lo que prueban — los dos siguen probando el id del changelog y el pipe escapado igual.
- Final: los números de línea de dos tests nuevos de la pasada («dos releases…», «…antes que los de debt.md») estaban mal contados antes del GREEN; los corregí con la salida real — es dato del test, no del código — si estuviera mal, los asserts fallarían contra el código ya verde.
- Final: el test del ciclo fuera del par pasa con el código actual y su RED por mutación no se ejecutó: sin `seen` el bucle es síncrono e infinito y el timeout de Vitest no lo corta — una regresión colgaría la suite en vez de fallar.
- Final: declinado por los ejes — los límites conocidos de las decisiones 3, 4 y 6 (`ids.mode` cuenta como ruta; «después de» no ordena; una negación en prosa sí ordena; `skills/` sin profundidad mínima), la cadena de la 3.0.0 que no pasa por Later, y el orden de las rutas dentro de un aviso (el de la fila de arriba) — los aprobó la spec — un aviso de más o de menos en filas raras.
- Final: tres Minor de la re-revisión se quedan — el `describe` «pasada de fix de la revisión final» nombra el proceso; un `const header` local sombrea el importado en su `it`; `NEXT_SECTION = 'Próximo'` repite el literal de `openRows` — cosméticos, sin segunda pasada de fix — confunden al leer, no rompen nada.

## 4. Verificación

### 4.1 Builds

- Línea base (`sdd-worktrees`, worktree separado en `f5cb72c2`): `moon run kit:test-headless cli:typecheck cli:test` → 3 tareas en verde, 4 min 18 s.
- Pasada de fix, sobre el commit de cierre: `moon run kit:build cli:typecheck cli:test` → `cli:test`: corrió 2350/2363 (13 skipped), 86 ficheros; `cli:typecheck` en verde.
- ADR 0011 y 0023, con Node 22.18.0: `test/roadmap/overlap.test.ts` y `test/kit/dist.test.ts` → 63/63.
- Gate de cierre: corre una vez en el merge de sincronización del paso 6, porque `feature/0297-verify-removed-by-requirement` está abierta a la vez; su línea `Gate:` va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-08 · smoke 5/5 THEN con ejecución real de `dist/cli/bin/sdd.js roadmap check` sobre roadmaps de prueba en el scratchpad; `roadmap check` sobre `.docs/sdd` de la rama da los 6 avisos de la decisión 9 y `Roadmap válido`; moldes de `tests/batteries/`: 14 (`mold-salas-3-family`), 9 (`mold-salas-3-nofamily`) y 0 los demás; suite `cli:test` 2350/2363; revisión final Spec (opus) y Código (sonnet) sobre `ce20f804`, re-revisión limpia, con 3 Minor adjudicados.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| 2.x: 0040 y 0041 con `skills/sdd-verify/` y `…/spec-reviewer-prompt.md` → `roadmap.md: aviso: línea 8: la 0041 y la 0040 (línea 7) tocan …spec-reviewer-prompt.md…`, `Roadmap válido`, exit 0 | ejecución real | ✅ |
| «tras 0040» en la 0041 → no avisa | ejecución real | ✅ |
| «antes de 0041» en la 0040 → no avisa; demás variantes de «tras» y lista | ejecución real · suite | ✅ |
| Cadena 0041 tras 0030 tras 0040 → no avisa | suite | ✅ |
| Orden de tres filas, tras el id repetido y antes de `debt.md` | suite | ✅ |
| Carpeta hasta su barra, normalización, varias rutas en un aviso | suite | ✅ |
| Texto sin `/` ni `.` no es ruta | suite | ✅ |
| Filas ⏸️, ✅, 🧪 y sin «Ficheros:» no avisan; cuenta el último «Ficheros:» | suite | ✅ |
| Mismo id no se compara; `0000` sí | suite | ✅ |
| Próximo contra `## Release 3.1` | suite | ✅ |
| `ROADMAP.md`: 0015 frente a 0013 y 0014 → dos avisos; con «Tras» `0014`, ninguno | ejecución real | ✅ |
| `ROADMAP.md`: filas cerradas, aparcadas, sin `**Toca:**` y Later no avisan | suite | ✅ |
| Con los dos ficheros solo se compara `ROADMAP.md` | suite | ✅ |

### 4.3 Residuales / deuda generada

- Los 6 pares que avisa hoy el roadmap de `develop` los ordena el dev-lead con `sdd-roadmap` (fuera de alcance, spec §Scope).
- `sdd capability check` avisa de que el requisito nuevo de `roadmap` tiene 2.804 caracteres (aconseja 500 y uno por comportamiento): es el delta aprobado, con un AND por rama que pidió la review de spec; partirlo sería una enmienda. Un solo caso: se queda en este walkthrough.
- Los moldes de la batería de `sdd-roadmap` que avisan (`mold-salas-3-family`: 14, `mold-salas-3-nofamily`: 9), para la 0308, que reescribe el texto de solapes de `sdd-roadmap`.

## 5. Aprendizajes

- El aviso de solape es comportamiento observable → delta de la spec, fusionado en `capabilities/roadmap.md` (requisito nuevo y regla **Avisos**).
- La verificación de una task que corre `test/roadmap/` necesita `--test-timeout 120000`, porque incluye `*.slow.test.ts` → ya lo dice `tech-stack.md` §Testing («Verificación de una task»); el plan no lo copió. Sin aprendizaje nuevo, un solo caso.

Retro: error que cazaría un chequeo → ticket del kit: `sdd task done` acepta un comando que corre `*.slow.test.ts` sin el `--test-timeout 120000` que pide `tech-stack.md` §Testing, y dos pasadas de la Task 1 dieron rojo por timeouts de 5 s en tests que la feature no toca

## 6. Adendas
