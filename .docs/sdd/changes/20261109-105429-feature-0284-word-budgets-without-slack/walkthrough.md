---
id: 20261109-105429-feature-0284-word-budgets-without-slack
feature: 0284
title: Walkthrough — Los topes de palabras vuelven a mandar, sin el margen del 25 %
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-09
---

# Walkthrough — Los topes de palabras vuelven a mandar, sin el margen del 25 %

## 1. Cambios realizados

- **Test de topes** (`cli/test/kit/word-budget.test.ts`, `e889ce23`): fuera `slack = 1.25`, `budgetWithSlack` y `roundHalfToEven`; `expectWithin` compara con el tope de la tabla. El test del redondeo pasa a ser el del ticket de la 0276: `expectWithin(3692, 3600)` lanza `mide 3692 y el tope es 3600`. Sin el factor salieron 15 rojos, los de la tabla «Topes de palabras» de la spec, y los 14 topes suben a lo medido: 8 skills, el kit entero (103.372) y los cuatro documentos de anclaje.
- **Regla 6 de `CLAUDE.md`** (`470dae16`): el saldo de palabras de un arreglo se cuenta sobre las skills que toca, juntas; una regla que pasa de una skill a su plantilla (ADR 0014) no alarga.
- **Capacidad `archive`**: «Límites» pasa a `SKILL.md` 3.920 y total 9.794.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 0.3h
- Esfuerzo real: 0,38 h — reloj de la sesión 0,55 h desde 2026-11-09T10:48Z, sin 10 min de espera al dev-lead (1 espera)
- Desviación: +0,08 h (+27 %)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 20.417.330 — claude-opus-5-5 20.417.330
- Tokens de subagentes: 1.428.329 en 3 despachos — Revisión adversarial de la spec 0284 claude-sonnet-5-5 273.274 / 1 min; Final review — Spec axis claude-opus-5-5 972.881 / 2 min; Final review — Code axis claude-sonnet-5-5 182.174 / 0 min
- Coste de la sesión: 9,42 $ (hilo 8,05 $ + subagentes 1,36 $)
- Coste de sujetos: no aplica
- Review de spec: 1 revisor (dominio y técnica, Sonnet) · hallazgos 10, aceptados 6

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. La verificación de la Task 1 corrió como `pnpm --dir cli exec vitest run …` (ruling abajo).

### Decisiones tomadas sin el dev-lead

- La Verificación de la Task 1 corre como `pnpm --dir cli exec vitest run …` y no con `cd cli;` — `sdd task done` lanza un solo comando sin shell — si es un error, nada: el test es el mismo.
- Código, Minor 1: el test del GIVEN usa los literales 3692 y 3600 — son las cifras de la fila 0284 y del ticket de la 0276, y el nombre del test dice qué comprueba — coste si está mal: ninguno funcional.
- Código, Minor 2: topes exactos, sin holgura — es la decisión 2 de la spec — coste si está mal: toda edición que sume palabras toca la tabla, que es lo que se pide.
- Código, Minor 3: paréntesis anidados en la regla 6 de `CLAUDE.md` — la frase es el «Después» literal de la decisión 6 — coste si está mal: una lectura algo más lenta.
- Spec, «no verificado» (RED en rojo, `cli:typecheck`, comprobaciones del kit, `dist/` construido): verificados en la sesión — coste si está mal: ninguno.
- Spec, «no verificado» (la base cambia antes del cierre): se comprueba tras `sdd merge --sync`, con la decisión 8 — coste si está mal: rojo del gate tras sincronizar, que se re-mide.
- Spec, recomendación: `sdd-templates` exacto sigue en rojo cuando una regla pasa a una plantilla, hasta que su spec suba el tope — lo pide el requisito de `feature-flow`; «no alarga» habla del saldo de la regla 6 — coste si está mal: una sorpresa en campo, que iría al ticket.
- Spec y Código, «Declined to judge» (`tasks.md` sin actualizar, filas del roadmap, `tech-stack.md` en su tope, `kit:own` en rojo, tabla en el test): los cubre el cierre, una decisión de la spec o la forma del repo — coste si está mal: ninguno nuevo.

## 4. Verificación

### 4.1 Builds

- Baseline sobre `3b179f84`, en un worktree aparte: `moon run cli:typecheck cli:test` → cli:typecheck: corrió 1/1 · cli:test: corrió 2376/2388 (12 skipped) · kit:test-headless: saltada (fuera del Scope de la spec).
- Gate de cierre: con la 0322 abierta a la vez, corre una vez sobre el merge de sincronización (paso 6 de `sdd-archive`); su línea `Gate:` y su sha van en el mensaje final.
- `moon run kit:build kit:copies kit:own kit:skill-size` sobre `470dae16`: `kit:own` en rojo con las mismas 24 frases repetidas que el baseline (0311); `kit:copies` y `kit:skill-size` en verde.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-09 · `word-budget.test.ts` RED con el factor (1 failed | 77 passed) y GREEN sin él (78/78) · `cli:typecheck` en verde · 3/3 THEN verificados · revisión final Spec y Código sobre `470dae16`, limpias, sin pasada de fix · la suite entera, tras la sincronización

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| GIVEN una skill con 3.692 palabras y tope 3.600 WHEN corre `word-budget.test.ts` THEN sale en rojo con las dos cifras | suite: RED con el factor (`expected [Function] to throw an error`), GREEN sin él | ✅ |
| `word-budget.test.ts` pasa sin margen, con cada tope nuevo y su motivo en la spec | suite: `Tests  78 passed (78)` | ✅ |
| `moon run kit:build kit:copies kit:own kit:skill-size` sin rojos nuevos | ejecución real: `kit:own` con las mismas 24 frases del baseline `3b179f84`; `kit:copies` y `kit:skill-size` en verde | ✅ |

### 4.3 Residuales / deuda generada

- `architecture.md:83` dice que `estimation.md` tiene tope de palabras y el test no lo mide: un solo caso, queda en el ticket.

## 5. Aprendizajes

- Ninguno nuevo para los documentos vivos: «mide cada tope con el conteo del test antes de presentar la spec» ya vive en `spec-template.md` («Topes de palabras»); desde esta feature, el test sin margen la hace cumplir. `tech-stack.md`, en su tope exacto, no recibe nada.

Retro: sin señales

## 6. Adendas
