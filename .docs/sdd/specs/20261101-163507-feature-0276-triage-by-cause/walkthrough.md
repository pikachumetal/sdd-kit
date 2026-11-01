---
id: 20261101-163507-feature-0276-triage-by-cause
feature: 0276
title: Walkthrough — Triaje de la deuda por causa
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Triaje de la deuda por causa

🦆 Dos tickets que cuentan con palabras distintas un `RUNS_DIR` demasiado largo ya acaban en una sola fila de «Lista», con su causa, el remedio «lanza desde `D:\r`» y el arreglo `comprobación automática`. Un `/tmp` borrado, de la misma categoría, queda aparte. `sdd roadmap check` rechaza `causa «mala suerte»`, y quien depura lee la deuda antes de investigar.

## 1. Cambios realizados

- **Forma**: `debt-template.md` lleva «Causa» en En espera, Lista y Descartadas; «Remedio temporal» y «Arreglo» en Lista; las definiciones y el desempate en la ayuda. `cli/src/roadmap/debt.ts` valida causa, arreglo y remedio, y `warnings.ts` reconoce `**Actuar** → <id> · causa:`.
- **Conducta**: `skills/sdd-roadmap/SKILL.md`, sección Triage y equivalencias 2.x; `skills/sdd-debugging/SKILL.md`, Fase 1.
- **Migración**: `v3.0.0.md`, paso 3, de dónde sale cada celda.
- **Pruebas**: escenarios `c1`, `c2` y `d2`, molde `mold-v2x` ampliado y rúbricas M3, M6 y V3.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2,5 h
- Esfuerzo real: 1,23 h — reloj de la sesión 1,47 h desde 2026-11-01T16:33Z, sin 15 min de espera al dev-lead (4 esperas)
- Desviación: −1,27 h (−51 %)
- Causa de la desviación: los sujetos del RED y del GREEN costaron minutos, no las horas previstas por la campaña; el código era un módulo ya existente.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 23.222.741 — claude-opus-5-5 23.222.741
- Tokens de subagentes: 4.181.790 en 5 despachos — revisores de la spec, ejes Spec y Código y re-revisión
- Coste de la sesión: 16,35 $ (hilo 11,46 $ + subagentes 4,90 $)
- Coste de sujetos: 7,61 $ en 39 sujetos Sonnet — `red` 0,32 $; `red-d2` y `red-d2b` 0,47 $; `green` 2,12 $; `green-ctl` 0,85 $; `green-v1` 0,48 $; `green-fix` 2,78 $; `base-ctl` 0,59 $
- Review de spec: 2 revisores · hallazgos 20, aceptados 19

## 3. Desviaciones del plan

- `warnings.ts` entra en la Task 1: el plan solo lo preveía si hacía falta, y hacía falta.
- El molde de `d2` se reescribe tras un RED limpio, y el THEN compara por significado (Enmiendas de la spec; aprobada: «1»).
- `sdd-roadmap` retira cuatro racionalizaciones más, y el tope de `sdd-debugging` sube a 1.700 (Enmiendas; aprobada: «1»).

### Decisiones tomadas sin el dev-lead

- `warnings.ts` reconoce `**Actuar** → X · causa` — la spec lo pide y el patrón no lo admitía — coste si mal: un aviso de más en filas 2.x con esa forma.
- La fila con marcas del molde de `v1` apunta a la 0022, no a la 0030 — la 0030 no existe en el molde — coste si mal: ninguno.
- `m5-2` propuso Later y `m3-2` no citó el changelog: lo trato como ruido — con el kit de la apertura, `m5` dio Next 2/2 y su `m3-2` tampoco propuso la fila caducada; la regla no cambió y el GREEN previo dio Next 2/2 — coste si mal: una regresión de M5 que sale en campo.
- `d1` no mide su causa por un defecto previo del molde: va a deuda — coste si mal: la fila C sigue sin medir.
- El rechazo de una causa propuesta en la migración no se mide con sujetos — la persona de `v1` siempre aprueba — coste si mal: una fila rechazada mal colocada, a la vista en el gate.
- El test de vocabulario de la skill vive en `cli/test/roadmap/` y no en `cli/test/kit/` — junto a su lista — coste si mal: mover un test.
- Una fila de En espera o Descartadas con la causa rechazada pierde «Falta» o «Motivo» al ir a Por triar, y un `**Salda:**` a una fila rechazada no se vigila — caso raro, a la vista en el gate — coste si mal: un dato que reponer a mano.

## 4. Verificación

### 4.1 Builds

- `npx vitest run test/roadmap test/kit/word-budget.test.ts` y `tsc --noEmit`: verdes en cada task y tras la pasada de fix.
- La línea `Gate:` del cierre va en el mensaje final: corre sobre el merge de sincronización, porque la base va por delante y hay otras ramas abiertas.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · suite de `test/roadmap` verde · smoke por THEN abajo · revisión final Spec y Código sobre `c466954a`, con fixes; re-revisión sobre la pasada: `sdd-debugging` sobre su tope (decidido por el dev-lead, 1.700), `m3` 1/2 y `d1` C 0/2, adjudicados arriba; `m5-2` nuevo, adjudicado arriba.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `roadmap`: cabeceras, orden y fallos de forma | suite | `debt.test.ts` |
| `roadmap`: causa y arreglo fuera de la lista | ejecución real | `sdd roadmap check` sobre un `debt.md` con `mala suerte` da el mensaje literal y sale con 1 |
| `roadmap`: fila de problema sin remedio | ejecución real | da `fila de problema sin «Remedio temporal»`, y con el mismo enlace repetido no |
| `roadmap`: aviso con el sufijo `· causa:` | suite | `warns with the cause suffix`, las dos formas |
| `planning`: 2.º caso por causa | ejecución real | `c1` 2/2 en `green` y `green-fix`: una fila, causa reclasificada, remedio y `comprobación automática`; `/tmp` aparte; `relanza` sin juntar |
| `planning`: 2.x pasa a `**Actuar**` | ejecución real | `c2` 2/2 |
| `planning`: triaje con celdas | ejecución real | `m3`: conducta de causas 2/2; la fila caducada y el changelog, ver §3 |
| `planning`: forma 2.x | ejecución real | `m6` 2/2 en `green`; no relanzado tras el fix |
| `feature-flow`: lee la deuda; el remedio no es causa raíz | ejecución real | `d2` 2/2 en `green` y `green-fix` |
| `feature-flow`: sin fila, sigue la Fase 1 | ejecución real | `d1` 2/2 siguen investigando; su rúbrica C no mide, §4.3 |
| `migration`: celdas con marcas, propuesta, remedio | ejecución real | `v1` 2/2 en `green-fix`, `Roadmap válido` |
| `migration`: «Falta» sin la palabra `falta` | no probado | frase añadida tras la última medición de `v1` |
| `migration`: causa rechazada a Por triar | no probado | la persona siempre aprueba |

### 4.3 Residuales / deuda generada

- `d1` de `sdd-debugging` no mide su causa: fila en «Deuda técnica».

## 5. Aprendizajes

- Un RED de «encuentra la fila» sale limpio si la fila lleva el literal del error; `SUBJECT_CAP` cuenta la campaña entera del `RUNS_DIR` → `tech-stack.md`.
- Revisión de skills: `.claude/skills/` solo trae `skill-creator`, sin relación con este cambio → no aplica.

## 6. Adendas
