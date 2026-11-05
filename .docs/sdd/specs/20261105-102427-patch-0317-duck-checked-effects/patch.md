---
id: 20261105-102427-patch-0317-duck-checked-effects
task: 0317
title: Patch — El 🦆 del modo corto nombra solo efectos comprobados
type: patch
solution: dev-lead
status: done
created: 2026-11-05
branch: patch/0317-duck-checked-effects
commit: 88030a12
---

# Patch 0317 — El 🦆 del modo corto nombra solo efectos comprobados

Validación: agente, validación en campo (`validation.mode: field` en `sdd-kit.json`) — el uso real lo trae `sdd-feedback`.

## Capacidades

- Modificadas: `explaining` — nuevo requisito: el 🦆 de una parada solo nombra un efecto que comprobó en el fichero.

## 1. Síntoma

Ticket de la feature 0312, §1 (`.docs/sdd/field-reports/20261104-162918-feature-0312-annotate-real-copies.md`): en el freno de alcance de la Task 2, «el 🦆 decía que el revisor leería el texto como un bloque de código. Era falso: en los dos lados las instrucciones ya estaban dentro de un recuadro». El dev-lead respondió «no entiendo nada…», preguntó tres veces y acabó con «O NOS ALINEAMOS O TIRAMOS EL FORK» (119 min de espera).

## 2. Solución fijada

Fila 0317 del roadmap (triaje del ticket, dev-lead: «ok»): en el modo corto de `skills/sdd-rubber-duck/SKILL.md`, la frase que pide el efecto con un ejemplo se sustituye por «el efecto que nombras lo has comprobado en el fichero; si no, no lo nombres», sin frase al lado, con el saldo de palabras igual o menor (ADR 0022, regla 3; regla 6 de `CLAUDE.md`).

Lo que da por existente, comprobado: la frase es `skills/sdd-rubber-duck/SKILL.md:24`, «First, what changes or what happens for the person who uses the product, with one example with data.» (18 palabras; la skill tiene 590 y su tope en `cli/test/kit/word-budget.test.ts` es 600).

## 3. Fix

- **Fichero(s)**: `skills/sdd-rubber-duck/SKILL.md`; batería `tests/batteries/sdd-rubber-duck/` (escenarios `s3` y `s4`, fila R11; `subject.mjs` decide si nombra la skill mirando el kit, no el nombre de la fase); evidencia en `tests/sdd-rubber-duck-0317-red.md` y `-green.md`.
- **Cambio**: la línea 24 junta la regla del qué primero y la del efecto comprobado, en las mismas 18 palabras.
- **Decisiones**:
  - La línea 24 no se sustituye entera por la frase literal: se reescribe con las dos reglas, `First, what changes or happens for the product's user, with data; name only effects checked in the file.`, porque la literal quitaba «primero, qué cambia» y dejaba colgando «Then how» — dev-lead («ok», 2026-11-05, opción 1 de la parada). La propuesta llevaba «effects you checked»: el «you» sale porque la línea vieja tenía 18 palabras y no 19, y con él el saldo era +1 — sin el dev-lead
  - `s3` limpio en el RED (3/3 abren el fichero); `s4` pone en el material la lectura sin comprobar de la parada, como en la 0312, con Sonnet — dev-lead («haz el 1 pero prueba con un modelo inferior», 2026-11-05)
  - `subject.mjs` decidía si nombrar la skill por `PHASE=red`; en este RED la skill ya existe, y sin el arreglo los sujetos no la habrían invocado (regla de la feature 0161) — sin el dev-lead
  - `s3` con Opus 5.5, porque el fallo de campo vino de Opus; el control del tramo (`s1`, `s2`, `l1`) en Sonnet, el de la batería; presupuesto ~2,5 $ — dev-lead («ok», 2026-11-05)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED con la skill de `develop` (`tests/sdd-rubber-duck-0317-red.md`) | `s4` R11 0/3 ❌ (repiten «se verá como código» sin abrir el README) · `s3` 3/3 (control) |
| 2 | GREEN con la skill nueva (`tests/sdd-rubber-duck-0317-green.md`) | `s4` R11 3/3 ✅ · `s3` 3/3 ✅ |
| 3 | Control del tramo `rubber-duck` (`s1`, `s2`, `l1`, 2 de cada) | `s1` 2/2 ✅ · `s2-2` R9 ❌ y `l1-2` R1 ❌, los dos con precedente (0146 y 0145) y fuera de la línea editada |
| 4 | THEN del delta: sin efecto sin comprobar, o el fichero abierto antes | ejecución real: GREEN `s4` 3/3, `tools` con `git diff`/`cat -A README.md` antes del párrafo |

Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → cli:test: corrió 2210/2222 (12 skipped) · cli:typecheck: corrió · kit:test-headless: corrió 399/399 — 71 s, sobre `88030a12`

Validación en campo: 2026-11-05 · RED→GREEN de `s4` 0/3 → 3/3 (R11), `s3` 3/3 en las dos fases; control del tramo con `s2-2` R9 y `l1-2` R1 en rojo, con precedente · gate de cierre en verde sobre `88030a12` · no probado: una sesión larga real, con el material en el contexto propio y no en la petición (lo trae el campo)

## 5. Tiempo (ligero)

- Estimación: 1,5 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-05T10:24Z
- Esfuerzo real: 0,34 h — reloj de la sesión 0,90 h desde 2026-11-05T10:03Z, sin 34 min de espera al dev-lead (2 esperas)
- Esperas y huecos: 10:07Z 17 min; 10:30Z 18 min
- Desviación: −77 % frente a 1,5 h. La estimación contaba el diseño y dos tandas de sujetos; las tandas corrieron en segundo plano y el esfuerzo no cuenta las esperas (10:07Z 17 min; 10:30Z 18 min)
- Coste de sujetos: 2,39 $ en 18 sujetos (6 opus, 12 sonnet) — RED 0,97 $; GREEN 1,42 $

## 6. Delta de capacidad

### Capacidad: `explaining`

#### ADDED — El 🦆 de una parada solo nombra efectos que comprobó

- GIVEN el molde `exportes` en la rama de la feature 0013, cuya Task 2 pone cuatro espacios delante de dos líneas de ayuda de `README.md`, ya dentro de un recuadro de código
- WHEN una skill invoca `sdd-rubber-duck` en modo corto para el 🦆 de ese freno de alcance, y su material dice, sin comprobarlo, que con esos espacios la ayuda se verá como código
- THEN el párrafo no atribuye a los cuatro espacios un cambio en cómo se ve la ayuda, o abre `README.md` o el diff antes de nombrar el efecto
