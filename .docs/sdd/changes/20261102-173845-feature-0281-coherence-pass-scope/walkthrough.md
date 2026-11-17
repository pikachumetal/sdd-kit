---
id: 20261102-173845-feature-0281-coherence-pass-scope
feature: 0281
title: Walkthrough — El repaso de coherencia parte también del Scope
spec: ./spec.md
status: done
created: 2026-11-02
---

# Walkthrough — El repaso de coherencia parte también del Scope

## 1. Cambios realizados

- **Regla**: `skills/sdd-propose/SKILL.md`, «Coherence pass»: «For anything retired with numbered steps, also `grep -rniE "(pasos?|steps?) <n>\b" capabilities/`: each bare hit goes in that table.» Saldo: 5.303 → 5.301.
- **Batería**: `co5` y `co6` en `tests/batteries/sdd-propose/`, con sus filas `CO5` y `CO6`, sus moldes y su procedencia. `co5` queda de control.
- **Delta**: `feature-flow`, «La spec se repasa antes del gate», gana el `AND` de los pasos.
- **No se escribe** el cruce del Scope con el índice: su RED salió limpio.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 1,5 h
- Esfuerzo real: 1 h — reloj de la sesión 1 h desde 2026-11-02T16:36Z, sin 1 min de espera al dev-lead (1 espera)
- Desviación: -0,5 h (-33 %)
- Causa de la desviación: los sujetos corren en paralelo y sin esperar; la estimación contaba más tandas de reloj que las que costaron, aunque hubo dos REFACTOR y una segunda tanda de RED.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 11.677.956 — claude-opus-5-5 11.677.956
- Tokens de subagentes: 1.890.635 en 3 despachos — Eje Código revisión final 0281 claude-sonnet-5-5 374.155 / 1 min; Eje Spec revisión final 0281 claude-opus-5-5 922.799 / 5 min; Re-revisión final 0281 claude-opus-5-5 593.681 / 2 min
- Coste de la sesión: 8,88 $ (hilo 6,21 $ + subagentes 2,67 $)
- Coste de sujetos: 10,54 $ en 29 sujetos Sonnet, frente a 13,30 $ previstos para 19
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

Las dos enmiendas de la spec: sale el frente del cruce, con la marca de la spec, y cambia lo que paga el saldo y la forma de la frase.

### Decisiones tomadas sin el dev-lead

- La 0281 corre en Native, lite, una task: `execution: auto` — ninguno.
- RED `co5` y `co6` limpios en el molde de 2 capacidades, con fuente incidental: otra tanda en moldes de 15 y 14 (`tech-stack.md`, «Una primera tanda limpia») — 1,90 $.
- `co5` limpio 6/6 sale con la marca de la spec y el escenario queda de control — el caso de campo fue en una sesión larga: si vuelve, lo abre un segundo ticket.
- El control `s1` se corre tras REFACTOR 2, no tras GREEN, porque el recorte que mide entró ahí — ninguno.
- La lectura de «el saldo no sube», decisión 1 de la spec: 5.301 sigue por encima del tope nominal de 5.250.
- En `final/`, `co6-1` cuenta como pasa aunque lista «El resumen va al final»: lo hace por una renumeración que decide, no por confundir el paso 2.
- «Medición tras la revisión final» corrió `co6` n = 2, sin `co5`: `co5` es control sin regla.
- El `grep` casa «repaso 2» y no «pasos 1 y 3» con n = 3: falsos positivos que descarta quien lee, y n = 1 ya lo encuentra — una cita rara por mirar.

## 4. Verificación

### 4.1 Builds

- Otras ramas abiertas (`feature/0192-phase-timing-breakdown`, `feature/0194-roadmap-whats-next`, `feature/0291-fix-pass-deviation`) y la base por delante: el gate de cierre corre sobre la base integrada, y su línea `Gate:` va en el mensaje final.
- `moon run cli:typecheck cli:test kit:roadmap` en el pre-commit de cada commit.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-02 · sujetos de la tabla · revisión final Spec opus+high, con arreglos, y Código sonnet+high, con arreglos, sobre el commit de la implementación · re-revisión opus+high de la pasada de fix: 7 de 7 resueltos, 2 Minor nuevos arreglados y revisados en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Una spec que retira una skill con pasos numerados lista los requisitos que citan esos pasos | ejecución real | `co6`: RED 1/3; `refactor2` 2/2; `final` 2/2 |
| Un Scope con una opción en un verbo y un delta sin `cli` añade `cli` antes del gate | ejecución real | `co5`: 7/7, sin regla nueva |
| El saldo de `sdd-propose` no sube | suite | `word-budget.test.ts` en el pre-commit; conteo 5.303 → 5.301 |
| Lo adelgazado sigue | ejecución real | `s1` 2/2, `t1` 2/2, `sp1` 2/2 y 2/2 |

`no probado`: el caso del 0116 dentro de una sesión larga; los moldes son de un turno.

### 4.3 Residuales / deuda generada

- Ninguna.

## 5. Aprendizajes

- Un RED limpio de `co6` en la capacidad declarada era incidental: en una no declarada falló 2 de 3 → procedencia y comentario del molde en la batería de `sdd-propose`.
- Reescribir la frase dejó `co6` en 1/2 dos veces; la orden con su comando, 4/4 → Art. II ya lo dice; evidencia en `tests/coherence-pass-0281-green.md`.

Retro: sin señales

## 6. Adendas
