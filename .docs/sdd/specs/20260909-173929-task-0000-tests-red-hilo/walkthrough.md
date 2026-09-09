---
id: 20260909-173929-task-0000-tests-red-hilo
task: 0000
title: Walkthrough — Tests RED escritos por el hilo principal antes de despachar (T16)
spec: ./spec.md
status: done
created: 2026-09-09
---

# Walkthrough — Tests RED escritos por el hilo principal antes de despachar (T16)

Task en **modo lite**.

## 1. Cambios realizados

Commit `8b25d7b`:

- `skills/sdd-start-task/SKILL.md` paso 6: el hilo escribe y commitea los tests (uno por THEN, en RED) antes del primer despacho; racionalización «el implementador ya hace TDD».
- `skills/sdd-start-task/references/encargo-revision.md`: sección «Encargo del implementador» (Restricciones globales + contrato de tests).
- `skills/sdd-templates/templates/plan-template.md`: campo `Tests RED` por task, recomendación de forma como ayuda.
- `tests/tests-red-hilo-red.md` (reutiliza la campaña de T11: hilo 0/2, implementador 2/2) y `tests/tests-red-hilo-green.md` (2/2 en los cuatro predicados).

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 0,6 h (rango 0,4–0,9)
- Esfuerzo real: **~0,35 h** (aproximado: spec aprobada 17:41 UTC, commit 17:58 UTC, cierre ~18:05 UTC; dos sujetos GREEN en paralelo, 4,6 $). Spec: ~0,15 h.
- Desviación: −0,25 h (−42 %)
- Causa de la desviación: RED sin campaña (releído de los streams de T11) y GREEN limpio a la primera.
- Review de spec: no · hallazgos 0 (lite)

## 3. Desviaciones del plan

Sin plan (lite). Ninguna respecto a la spec.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → **Passed: 136, Failed: 0, Skipped: 5**.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-09 · en la conversación («ok seguimos, me fío»), sin prueba propia: acepta el GREEN del agente como validación.

| # | Caso (escenario del delta) | Resultado |
| --- | --- | --- |
| 1 | Los tests existen y están commiteados antes del primer encargo, uno por THEN, en RED | ✅ verificado 2/2 en el stream (`Write`/`Edit` en `test/` + commit antes del primer `Agent`); 3/3 THEN |
| 2 | El encargo nombra la ruta como contrato y el implementador no los modifica | ✅ verificado 2/2: frase en el `input.prompt` del `Agent`; `git diff <RED>..HEAD -- test/` vacío |

### 4.3 Residuales / deuda generada

Ninguna. Hueco de spec detectado por los tests (qué lleva `refund` sin envío) → caso para la lente dominio, T17.

## 5. Aprendizajes

- **Un test escrito desde la spec por otra mano destapa huecos de spec antes del código**: los dos hilos escribieron un test para un caso que la spec no cubría, y lo decidieron ellos (`null` / `undefined`). Ese es el efecto que §1.2 buscaba, y es también un aviso: lo que el test decide sin spec es una decisión al azar (T17). → `tech-stack.md`.
- **Reusar streams como RED**: si una campaña previa ya es la fixture que pide el §, releerla con la pregunta nueva vale como baseline y cuesta cero. → `tech-stack.md`.
