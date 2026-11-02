---
id: 20261102-135210-feature-0271-clean-red-rules
feature: 0271
title: Walkthrough — Una sola línea de conducta ante un RED limpio
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-02
---

# Walkthrough — Una sola línea de conducta ante un RED limpio

## 1. Cambios realizados

- `.docs/sdd/tech-stack.md`: «Una primera tanda limpia…» lleva la regla (n = 3 con caso de campo o marca en el Scope, gemelo si la petición propone el fallo, otra tanda si la fuente es incidental), y se funde en ella «Un RED limpio con n=2…». «Un baseline que no falla…», «Un baseline limpio no reproduce…» y «Matices de campaña» se alinean.
- `skills/sdd-templates/templates/spec-template.md`: línea `Entra, si el RED lo exhibe:` en el Scope. Salen dos frases repetidas.
- `skills/sdd-implement/SKILL.md`, «Deviation», y `skills/sdd-propose/references/control-profiles.md`, «Desvío»: lo marcado, con RED limpio y n = 3, sale con un ruling; lo demás es un desvío. Salen la fila de excusas y «Arbitra así…».
- `skills/sdd-propose/references/plan-writing.md`: no cambia. Sus dos frentes marcados salieron con RED limpio: la propia regla aplicada a esta spec.
- Baterías: `a3`, `a4` en `sdd-implement`; `cr1`, `cr2`, `cr3` en `sdd-propose`. Evidencia en `tests/clean-red-rules-0271-red.md` y `-green.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2 h
- Esfuerzo real: 1,26 h — reloj de la sesión 2,22 h desde 2026-11-02T13:48Z, sin 57 min de espera al dev-lead (1 espera)
- Desviación: -0,74 h (-37 %)
- Causa de la desviación: los dos frentes de `plan-writing.md` salieron con RED limpio, y la tanda de REFACTOR se quedó en un hueco de plantilla.
- Compactación: no
- Modelo del hilo: Opus 5.5
- Tokens del hilo: 23.323.858 — claude-opus-5-5 23.323.858
- Tokens de subagentes: 2.737.706 en 3 despachos — Final review — Spec axis claude-opus-5-5 1.787.111 / 6 min; Re-review final 0271 claude-opus-5-5 535.220 / 2 min, en curso; Final review — Code axis claude-sonnet-5-5 415.375 / 1 min
- Coste de la sesión: 13,66 $ (hilo 10,32 $ + subagentes 3,34 $)
- Coste de sujetos: 20,81 $ en 27 sujetos Opus y Sonnet — RED, GREEN, REFACTOR y `cr3`, frente a una previsión de 28,57 $ en 33
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- `a4` se midió también en el RED, sin estar en él, para decidir sobre el `a3` limpio.
- Se añadió `cr3`, por el hallazgo I2 del eje Spec.
- `plan-writing.md` no se tocó.

### Decisiones tomadas sin el dev-lead

- `a3` salió limpio 3/3 y no paré, aunque el plan decía parar: `a3` y `a4` son el mismo frente, `a4` falló 0/2 y nada salió del Scope — la mitad «n = 3 sale con un ruling» queda sin fallo detrás — si está mal: quitar media frase de `sdd-implement`.
- Salen los dos frentes marcados de `plan-writing.md`, con `cr2` limpio 3/3 — la regla de esta spec — si está mal: los dos tickets siguen sin regla.
- CR2B sale tras `cr3` limpio 3/3 en un molde grande; sigue como posible falso negativo en sesión larga — fila de deuda — si está mal: una frase más del Self-review.
- Hueco de plantilla acortado y reescrito tras `cr1` 0/2 — saldo y forma — si está mal: `cr1` falla.
- «Medido contra el tope nominal» se lee como saldo ≤ 0 sobre lo medido, con el nominal a la vista (decisión 6 de la spec, aprobada) — tres mediciones siguen sobre el nominal, dentro del margen del 25 % — si está mal: 3.587 palabras de recorte en otra feature.
- Sin medir `a3` tras la revisión final: la cláusula no cambió desde su GREEN — si está mal: 2 sujetos.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 361/361 · cli:typecheck: corrió · cli:test: corrió 1915/1927, 12 saltados por los propios tests; 1 min 40 s, sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-02 · gate en verde · 27 sujetos · revisión final Spec y Código y su re-revisión, juntadas en el cierre (`tasks.md`).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Marcado, limpio 3 de 3: sale con `Ruling:` y sin parar | ejecución real, `a3` | 3/3 |
| Con menos sujetos no sale | ejecución real, `a4` | 2/2; RED 0/2 |
| Sin marca: para con la medida, ni saca ni escribe | ejecución real, `a2` | 2/2 |
| El freno de alcance sigue parando sin la fila de excusas | ejecución real, `b2` | 2/2 |
| El Scope marca lo condicionado | ejecución real, `cr1` | 2/2 tras REFACTOR; RED 0/3 |
| Ninguna línea de `tech-stack.md` contradice | lectura, tabla de `tests/clean-red-rules-0271-green.md` | sin contradicción tras I1 |
| Saldo de las skills | conteo de `word-budget.test.ts` frente a `760feee7` | `sdd-implement` −19, `control-profiles.md` −3, `spec-template.md` −1, `tech-stack.md` −2, `plan-writing.md` 0 |

### 4.3 Residuales / deuda generada

- CR2B limpio en sujetos recién arrancados: fila de deuda; los casos de campo (0277 §5, 0282 §2) salieron de sesiones largas.
- Tres mediciones sobre el tope nominal, dentro del margen, hasta la limpieza de la v3 que ya lo prevé.

## 5. Aprendizajes

- Un frente cuya guía nueva tiene dos mitades se mide por las dos: `a3` limpio escondía el fallo de `a4` → `tests/batteries/sdd-implement/battery.md`, procedencia.
- Un hueco de plantilla con un nombre abstracto se usa para otra cosa: «aunque sea todo el cambio» dio 2/2 donde «frente de campo sin medir» dio 0/2 → `tests/batteries/sdd-propose/battery.md`, procedencia.

Retro: error que cazaría un chequeo → feature 0287, ya abierta: un heredoc rompió `tests/batteries/sdd-propose/subject.mjs` y `node --check` lo cazaría (`.docs/sdd/roadmap.md`)

## 6. Adendas
