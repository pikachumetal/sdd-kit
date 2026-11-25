---
id: 20261120-090000-feature-0030-libres-load
feature: 0030
title: Walkthrough — ¿Aguanta `libres` 1.000 reservas?
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — ¿Aguanta `libres` 1.000 reservas?

## 1. Cambios realizados

- Medidas del spike en `medidas/`: `medir-libres.mjs` (copia fiel de `freeRooms`), `o1-libres.txt`, `o2-memoria.txt` — e9594e9, 602f257, b044f0b, eacaf17.
- `research.md` con la respuesta: O1 y O2 no cumplen, O3 sin medir con una persona; las reservas siguen en memoria en la 0014.

## 3. Desviaciones del plan

- Task 3 y Task 4 añadidas al final por la validación: O2 estaba `no medido` siendo medible, y la revisión final halló que O1 medía un modelo y no `freeRooms`.

### Decisiones tomadas sin el dev-lead

- «4 s» de O3 retirado como evidencia — era una simulación sin método — coste: ninguno.
- `spec.md` se contradice (Validación: agente frente a O3, que pide una persona) — queda diferido, es una enmienda a una spec aprobada — coste: el lector puede creer que O3 se midió.

## 4. Verificación

### 4.1 Builds

- Gate: no aplica, porque ningún archivo fuera de `changes/` cambió desde el merge-base.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-25 · filas de research.md contra su evidencia (O1 y O2 recalculadas ejecutando `node medidas/medir-libres.mjs` y `--memoria`, O3 `no medido con una persona`) · revisión final Spec sobre 027d5e1 (No: 1 Critical, 4 Important, arreglados en la Task 4) · re-revisión 027d5e1..70bf0d8: Yes, sin Critical ni Important

| Objetivo | Evidencia | Resultado |
| --- | --- | --- |
| O1 — < 2.000 comparaciones | ejecución real | no cumple: 3.000 y 4.000 (7 con coincidencia temprana) |
| O2 — < 50 MB | ejecución real | no cumple tal como se definió: RSS 54,4 MB, delta de las reservas 0,1 MB |
| O3 — < 10 s | no probado | no medido con una persona |

### 4.3 Residuales / deuda generada

- O3 pendiente de una persona en la recepción.
- Redefinir O2 como delta sobre el runtime.
- Fila de roadmap: índice o filtro en `libres`.
- Corregir la contradicción de `spec.md`.

## 5. Aprendizajes

- Un umbral absoluto de memoria no discrimina si el runtime vacío ya lo supera → redefinir O2 en la 0014.

Retro: sin señales

## 6. Adendas

- _Ninguna_
