---
id: 20261125-155223-feature-0367-validate-no-stops-in-delegate
feature: 0367
title: Walkthrough — sdd-validate en delegate no para antes de volver a sdd-implement ni antes de sdd-archive
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — `sdd-validate` en `delegate` no para antes de volver a `sdd-implement` ni antes de `sdd-archive`

## 1. Cambios realizados

- **Batería** (`5953ad0ab`): molde `reservas-final-bug-campo` en `tests/batteries/sdd-archive/subject.mjs` (el de `vf3` con `validation.mode: field`), escenario `vf10` y fila VF10 en `tests/batteries/sdd-validate/battery.md`, que mide la acción: el commit del arreglo, `sdd-archive` tras registrar y el `sdd merge` del cierre. RED en `tests/sdd-validate-0367-red.md`.
- **Skill** (`8c42f2406`): `skills/sdd-validate/SKILL.md`, «Order» paso 5: «then `sdd-archive` without asking (features through `sdd-implement-native`'s «Finish»): `delegate` merges by the `merge` block.»; «A failure goes back to `sdd-implement`» pierde «without asking». 762 y 1828 palabras, las mismas que antes. GREEN y controles en `tests/sdd-validate-0367-green.md`.
- **Capacidad**: `validation`, dos `MODIFIED` (el paso a `sdd-archive` y su merge no se preguntan con la validación registrada en `field`; la vuelta no se pregunta en ningún modo y no pasa a `sdd-archive` hasta que la validación queda registrada).
- **Roadmap**: el `**Toca:**` de la fila 0367 nombra los ficheros que tocó.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 1,78 h — reloj de la sesión 3,22 h desde 2026-11-25T14:31Z, sin 87 min de espera al dev-lead (4 esperas)
- Desviación: +0,28 h (+19 %)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 39.413.217 — claude-opus-5-5 39.413.217
- Tokens de subagentes: 3.277.250 en 5 despachos — Segunda ronda spec 0367 claude-sonnet-5-5 229.406 / 1 min; Revisión adversarial spec 0367 claude-opus-5-5 217.051 / 1 min; Re-revisión de la pasada de fix 0367 claude-opus-5-5 959.749 / 2 min; Final review — Code axis claude-sonnet-5-5 308.330 / 1 min; Final review — Spec axis claude-opus-5-5 1.562.714 / 3 min
- Coste de la sesión: 16,28 $ (hilo 12,97 $ + subagentes 3,31 $)
- Coste de sujetos: 20,75 $ en 11 sujetos sonnet — red 4,44 $; green 7,79 $; control 3,87 $; fix 4,65 $
- Review de spec: 1 revisor (opus) y segunda ronda (sonnet) · hallazgos 20, aceptados 20 (uno en parte)

## 3. Desviaciones del plan

- _Ninguna_ de alcance. El RED dio el motivo «merge» en los dos sujetos, así que la redacción es la de esa rama del predicado de Approach.

### Decisiones tomadas sin el dev-lead

- El `SILENCIO:` del vigilante en el RED fue falso: la salida iba por `Select-Object -Last 30`, que la retiene hasta el final; las tandas siguientes escribieron a un fichero — sin coste: los sujetos acabaron.
- Pasada de fix de la revisión final (juntada en el cierre): la vuelta lleva «at once» y el paso 5 «the complete `merge` block»; para el saldo, «Closing drafts» pierde «in their place,», medido solo con `vf10` (no con controles ni `vf9`, como pedía la decisión 13): `sdd-archive` paso 0.1 fija la carpeta del borrador y los dos sujetos de `fix/out` lo escriben ahí — si me equivoco, un borrador fuera de la carpeta, que `sdd-archive` para.
- La fila VF10 se endureció tras el RED y el GREEN, por los hallazgos: el RED sigue rojo, y el primer GREEN, releído con ella, la cumple (commit del arreglo con `test/cancel.test.js`, merge sin `--sync`) — coste: ninguno.
- Sin cambio, con ruling: el paso 5 no nombra el patch (lo deja fuera de la «Finish» de Native), ni `unattended` (lo cubre `sdd-archive` paso 7); VF10 sigue en una fila con tres cláusulas etiquetadas, como VF9.

## 4. Verificación

### 4.1 Builds

- `moon run kit:build` → 0; `moon run kit:own` → 0; `npx vitest run test/kit/word-budget.test.ts` → `Tests  92 passed (92)`.
- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 801/801 · cli:typecheck: corrió · cli:test: corrió 2591/2606 (15 skipped) · 2 min 21 s · sobre 8c42f24. La pasada de fix (juntada en el cierre) solo toca la skill, su `dist/` y la batería; `word-budget.test.ts` 92/92 y `kit:own` 0 tras ella.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-25 · gate verde sobre 8c42f24 (kit:test-headless 801/801, cli:test 2591/2606) · `vf10` rojo 2/2 en el RED y verde 2/2 en el GREEN y tras la pasada de fix · `vf9` 2/2 · controles `vf2`, `vf3` y `v1a` 1/1 · 2 THEN `no probado` · revisión final Spec opus y Código sonnet sobre 8c42f24, pasada de fix juntada en el cierre, re-revisión opus aprobada

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| MODIFIED 1: con `field`, invoca `sdd-archive` sin preguntar y el cierre fusiona en `develop` con el bloque `merge` | ejecución real | `vf10` 2/2: `sdd-archive` tras `Validación en campo:` y `sdd merge` → «fusionada en develop»; `vf9` 2/2 igual (RED: 0/2) |
| MODIFIED 2: vuelve a `sdd-implement` sin preguntar, en cualquier modo | ejecución real | `vf10` ×2, `vf2` y `vf3`: commit del arreglo sin pregunta antes, sin «without asking» en el texto |
| MODIFIED 2: no pasa a `sdd-archive` hasta que la validación queda registrada | ejecución real | `vf2` y `vf3` (`manual`) acaban en el guion, sin `sdd-archive` |
| MODIFIED 2: la decisión de la revisión final se pregunta sola | ejecución real | `v1a` 1/1, en `manual`; no probado en `field` (decisión 5) |
| MODIFIED 1: hotfix a la rama estable, bloque incompleto, tag y push siguen siendo de una persona | no probado | sin cambio de texto; lo fija el paso 7 de `sdd-archive` (decisión 11) |
| MODIFIED 2: el 3.er fix descubierto sigue parando | no probado | sin cambio de texto (decisión 12) |

### 4.3 Residuales / deuda generada

- Ninguno.

## 5. Aprendizajes

- En `delegate` con validación en campo, los sujetos paraban antes de `sdd-archive` por el merge a `develop`, no por la falta de una sesión de Native: la regla del paso 5 lo dice → capacidad `validation` (delta fusionado con `sdd capability merge`).
- La salida de `battery.mjs run` con `| Select-Object -Last N` queda retenida y el vigilante da un `SILENCIO:` falso → `steering/operations.md`, junto a «`SPEC_DIR` va en ruta absoluta».

Retro: búsqueda a ciegas → ticket del kit: la «Verificación» del plan (`plan-template.md`) da `battery.mjs run` sin las variables de la campaña (`SPEC_DIR`, `KIT_DIR`, `RUNS_DIR`, `PHASE`, `COST_CAP`, `SUBJECT_CAP`); el RED falló tres veces antes de lanzarse, como el `verdict` sin carpeta de la 0365

## 6. Adendas
