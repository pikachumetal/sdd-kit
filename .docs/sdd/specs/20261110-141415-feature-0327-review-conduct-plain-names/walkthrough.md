---
id: 20261110-141415-feature-0327-review-conduct-plain-names
feature: 0327
title: Walkthrough — La revisión de la spec ve una prueba que pasa sin la conducta, y el 🦆 no nombra ids sin explicarlos
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-10
---

# Walkthrough — La revisión de la spec ve una prueba que pasa sin la conducta, y el 🦆 no nombra ids sin explicarlos

## 1. Cambios realizados

- **Revisor de la spec** (Task 1, `e10cfc41`): el punto (2) del encargo de `skills/sdd-propose/references/review-spec.md` pide señalar el escenario o la fila de batería que pasa sin la conducta («a word the agent writes, a value it gets right by eye»); sale la medida de campo de la task 0009 para compensar: `sdd-propose`, −10 palabras.
- **🦆 de una parada** (Task 2): sin cambio; el RED salió limpio 3/3 (decisión 6).
- **Baterías**: `rc1` y `rc2` en la de `sdd-propose` (fixture `spec-0031.md`; en `rc2` la fila floja vive en la batería del molde, como en la 0326), `s5` en la de `sdd-rubber-duck`.
- **Docs**: deltas de `feature-flow` y `explaining` fusionados.

## 2. Tiempo y coste: estimado vs real

- Tipo: skill
- Estimación de implementación (del plan): 1h
- Esfuerzo real: 2,6h, aproximado con las marcas de los commits y de la spec (de la spec, 14:14, al cierre, ~16:50); `sdd session tokens` da «no medido (sin transcripts de Claude Code para el worktree)»: la sesión trabajó desde el checkout de `develop`
- Desviación: +1,6h (+160 %)
- Causa de la desviación: sin medir con `Esperas y huecos`; la enmienda de `rc2` (una tanda RED y una GREEN más, ~10 min cada una) y dos paradas por dinero
- Compactación: sí, antes de la aprobación de la spec → Native
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: no medido (sin transcripts del worktree)
- Tokens de subagentes: no medido (sin transcripts del worktree); despachos: revisor de la spec (opus), ejes Spec (opus) y Código (sonnet)
- Coste de la sesión: no medido (sin transcripts del worktree)
- Coste de sujetos: 4,29 $ en 10 sujetos sonnet — `rc1` RED 0,89 $ y control 0,80 $; `s5` RED 0,17 $ y control 0,08 $; `rc2` RED 1,10 $ y GREEN 1,25 $
- Review de spec: 1 revisor · hallazgos 10, aceptados 10

## 3. Desviaciones del plan

- **Escenario `rc2`** (enmienda del 2026-11-10, «1»): el eje Spec vio que `rc1` dejaba la fila floja escrita en la spec, a la vista del revisor; en la 0326 vivía en la batería. `rc2` la pone en la batería: RED 1/2, y entra la frase.
- **Techo de la campaña** de 3,85 $ a lo que haga falta (dev-lead, «1, subelo a lo que sea»): gastado 4,29 $.
- **Frase del 🦆 no escrita**: RED limpio 3/3.

### Decisiones tomadas sin el dev-lead

- Task 2: el ticket 0326 §2 fue un caso de «la regla existía y no la apliqué» (los ids salieron en mensajes de progreso del hilo, no en un 🦆 de la skill) — coste si está mal: otra parada por jerga; `s5` queda en la batería.
- Revisión final: la fixture de la 0031 declara una capacidad nueva a propósito — coste si está mal: hallazgos del revisor que no son la fila floja, sin efecto en `RC1`/`RC2`.
- Revisión final: sin re-revisión — la pasada de fix no toca skills y la frase la mide `rc2` — coste si está mal: un defecto de fixture sin ver.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 471/471 · cli:typecheck: corrió · cli:test: corrió 2388/2388 (12 skipped) · 122 s · configuración: la del gate · sobre el árbol del commit de cierre (verificado por el agente)
- `moon run kit:build kit:skill-size kit:own` → «Skills al día: 127 ficheros.»; `word-budget.test.ts` 77/77
- Tandas: `rc1` RED (kit de `develop`) 3/3 limpio; `s5` RED 3/3 limpio; `rc2` RED 1/2 → GREEN 2/2 (`dist/` de la rama)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-10 · gate 471/471 y 2388/2388 · `rc2` RED 1/2 → GREEN 2/2 · `rc1` y `s5` limpios 3/3 · revisión final Spec (opus) y Código (sonnet)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `feature-flow`: el revisor señala que la fila pasa con «pendiente» sin nombrar la 0011 | ejecución real: `rc1` 3/3 (fila en la spec) y `rc2` GREEN 2/2 (fila en la batería) — `tests/sdd-propose-0327-red.md`, `-green.md` | ✅ |
| `explaining`: el 🦆 de una parada por dinero no nombra `co2p` ni `CO2P-M` sin explicarlos | ejecución real: `s5` 3/3 con el kit de `develop` — `tests/sdd-rubber-duck-0327-red.md` | ✅ |

### 4.3 Residuales / deuda generada

- Ninguna.

## 5. Aprendizajes

- Un escenario que pone el defecto donde el revisor ya mira mide el caso fácil: `rc1` salió limpio 3/3 y `rc2`, con la fila donde estaba en la 0326, 1/2 → procedencia de `rc2` en `tests/batteries/sdd-propose/battery.md`

Retro: nada que cambiar en el entorno.

## 6. Adendas
