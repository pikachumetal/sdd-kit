---
id: 20261120-090000-feature-0030-libres-load
feature: 0030
title: Walkthrough — ¿Aguanta `libres` 1.000 reservas?
spec: ./spec.md
plan: ./plan.md
status: draft
created: 2026-11-25
---

# Walkthrough — ¿Aguanta `libres` 1.000 reservas? (borrador de sdd-validate)

## 3. Desviaciones del plan

- Task 3 y Task 4 añadidas al final del plan por la validación: O2 estaba `no medido` siendo medible; la revisión final (Spec) pidió medir el RSS y reescribir la recomendación.

### Decisiones tomadas sin el dev-lead

- Medir O2 como RSS del proceso (lo que dice la spec) y no como heap — el heap solo va de detalle — si está mal, O2 cambia de estado.
- Recomendación: las reservas pueden seguir en memoria y `libres` necesita otro recorrido — O1 falla por el recorrido lineal, no por dónde viven las reservas — si está mal, la 0014 migraría a fichero sin ganar comparaciones.

## 4. Verificación

### 4.2 Smoke / tests

- Validación en campo: 2026-11-25 · O1 `ejecución real` (2000 comparaciones ×10, reproducido por el revisor) · O2 `ejecución real` (RSS 54,1–54,3 MB ×10 frente a 54,1–54,2 MB de un node vacío) · O3 `no medido con una persona` · revisión final Spec opus+high con fixes (3 Important corregidos, 1 `minor (deferred)`), re-revisión ec2f53d..253ca3e con fixes; 1 corrección posterior (c46364b) `sin revisar`, revisada en el hilo · gate: no aplica (ningún fichero fuera de `changes/`)

| Objetivo | Evidencia | Resultado |
| --- | --- | --- |
| O1 | ejecución real | no cumple tal como se definió (2000 comparaciones) |
| O2 | ejecución real | no cumple tal como se definió (RSS 54,2 MB; un node vacío ya pasa de 50 MB) |
| O3 | no probado | no medido con una persona |
