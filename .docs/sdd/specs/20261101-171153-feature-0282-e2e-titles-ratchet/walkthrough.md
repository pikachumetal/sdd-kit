---
id: 20261101-171153-feature-0282-e2e-titles-ratchet
feature: 0282
title: Walkthrough — El test de títulos E2E se adopta con ratchet y lee playwright test --list
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — El test de títulos E2E se adopta con ratchet

## 1. Cambios realizados

- `skills/sdd-tdd/references/writing-e2e.md`, regla 1: el test se escribe con el primer E2E, nace en verde con «Títulos heredados», lee `playwright test --list --reporter=json` de cada `playwright*.config.*` con los filtros apagados, y una salida distinta de 0 es rojo con los `errors` del JSON. 1002 → 1002 palabras: lo pagan tres filas de la tabla final y frases que repetían otras reglas.
- `skills/sdd-templates/templates/operations-template.md`: el bloque «Títulos heredados» dentro de «Flujos core», y dónde va el título. 1143 → 1134.
- `skills/sdd-init/SKILL.md` (2662 → 2660) y `skills/sdd-upgrade/references/migrations/v3.0.0.md` (3558 → 3557): ofrecen el test a un proyecto con E2E.
- Evidencia: `tests/e2e-titles-ratchet-red.md` y `-green.md`; `red/subject.mjs` y `red/probes.mjs`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5 h
- Esfuerzo real: 1,53 h — reloj de la sesión 2,02 h desde 2026-11-01T17:06Z, sin 29 min de espera al dev-lead (1 espera)
- Desviación: +0,03 h (+2 %)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 23.552.647 — claude-opus-5-5 23.552.647
- Tokens de subagentes: 1.458.131 en 3 despachos — Re-revisión 0282 claude-opus-5-5 348.249 / 6 min; Eje Spec revisión final 0282 claude-opus-5-5 492.602 / 4 min; Eje Código revisión final 0282 claude-sonnet-5-5 617.280 / 2 min
- Coste de la sesión: 12,53 $ (hilo 9,96 $ + subagentes 2,56 $)
- Coste de sujetos: 6,66 $ en 18 sujetos Sonnet — RED 0,71 $; GREEN 5,95 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Se añadieron `a3` y sondas que el plan daba por hechas y no existían: lo cazó el eje Spec.
- El orden de la regla 1 cambió tras `a1-1`, que dejó el bloque sin el test: primero «cómo nace». El Approach de la spec se corrigió.

### Decisiones tomadas sin el dev-lead

- `subject.mjs` y `probes.mjs` solo en `red/`, también para green — el lanzador es el mismo — coste si mal: ninguno
- La tabla final de `writing-e2e.md` pierde también la fila del timeout, además de las dos que nombra la spec — pagaba el saldo, y las reglas 4, 6 y 7 lo dicen — coste si mal: menos presión ante esa excusa
- La plantilla pierde «Un test que solo pasa con el entorno recién vaciado depende de otro» y «Lo leen el plan…»; la guía, «Playwright facts: its 1.65 docs» y la cita de por qué Playwright desaconseja `waitForTimeout` — no eran instrucción, o la repite la regla 5 — coste si mal: mínimo
- «Sin filtro» cortado de `v3.0.0.md` se queda por remisión a la init — `m1-1` y `m1-4` lo proponen — coste si mal: un proyecto sin ese campo, que la verificación del paso sigue exigiendo
- La plantilla nombra Playwright; con otro runner el campo no tiene mecanismo — el kit solo declara Playwright — coste si mal: el proyecto adapta
- El eje Código recibe los heredados en el literal de «Flujos core» — decisión 7 de la spec — coste si mal: unos tokens
- El glob `playwright*.config.*` deja fuera una config con otro nombre — las cinco reales casan — coste si mal: un título sin ver en ese proyecto
- Quedan sin arreglar dos menores de la re-revisión: los «seis campos» de la plantilla (decisión 7) y la construcción de `m1`/`n2` en `subject.mjs` — no cambian lo que se mide — coste si mal: ninguno

## 4. Verificación

### 4.1 Builds

- Gate: la línea final va en el mensaje de cierre, sobre la base integrada: la rama iba 9 commits por detrás.
- Primera pasada, antes del commit de cierre: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → `cli:test`: 8 rojos de 1754, los que se vieron vencidos a 5 s con `kit:test-headless` a la vez. Solos, 73/73 en la rama y 74/74 en `origin/develop`: no se repiten; es la fila «Intermitente: dos tests de `cli:test` vencen a 5 s con la máquina cargada» de la deuda.

### 4.2 Smoke / tests

Validación en campo: 2026-11-01 · 18 sujetos sobre copias de document-manager y OdySIF · sondas a mano sobre el test de cada uno · revisión final Spec y Código, re-revisión con hallazgos, 1 sin revisar · no probado: `--list` en Linux, la rama del «sí» de la init y la init sin E2E. Sin revisar: el último retoque de la regla 1 y de `probes.mjs`, en el commit de cierre — dice cómo leer «Flujos core» y que una salida distinta de 0 no lance antes de leer `errors`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Título fuera de la lista en rojo, y lo nombra | ejecución real (`a1-7`, `a2-1`) | ✅ |
| Con el título en la lista, verde | ejecución real (`a1-7`) | ✅ |
| Sin E2E no se pide | ejecución real (`n1-3`) | ✅ |
| Nace en verde con todos los títulos en heredados | ejecución real (`a1-7`, 85; `a2-1`, 18) | ✅ |
| `test(...)` nuevo y título en bucle, en rojo con su nombre | ejecución real (sondas) | ✅ |
| Heredado borrado, en rojo con su título | ejecución real (sondas) | ✅ |
| Hasta que se quita su línea | ejecución real: sin la línea es el estado de «sin cambios», salida 0 | ✅ |
| La task no añade su línea | ejecución real (`a3-5`) | ✅ |
| Lee con los filtros apagados y todas las configs | ejecución real (`a1-7`: `@slow` y config secundaria) | ✅ |
| Sin servidor, `globalSetup` ni navegador | ejecución real (spec, medidas; copias sin entorno) | ✅ |
| Salida distinta de 0, rojo con el error | ejecución real (`a1-7`, spec que lanza) | ✅ en `a1-7`; antes del último retoque, `a1-4`, `a1-6` y `m1-1` daban rojo sin el mensaje |
| Migración: ofrece; con «sí», verde; sin E2E no lo nombra | ejecución real (`m1-1`, `m1-4`, `n2-3`) | ✅ `n2-3` responde «nada» a la pregunta de la prueba |
| Init: ofrece | ejecución real (`i1-1`) | ✅ |
| Init: con «sí» deja el test en verde | no probado | Misma regla 1 que la migración; ningún sujeto recorrió esa rama |
| Init: sin E2E no lo nombra | no probado | La fila lleva el predicado |

### 4.3 Residuales / deuda generada

- Nada nuevo. Los timeouts están en la fila de deuda citada en 4.1.

## 5. Aprendizajes

- Un sujeto sobre una suite real no versiona sus salidas, y lo que dice se comprueba en su copia → `tech-stack.md`, §Testing.
- Una regla que describe un test y deja «añádelo» al final da el bloque sin el test (`a1-1`): lo que se pide va en la primera frase → `writing-e2e.md`, regla 1.

## 6. Adendas
