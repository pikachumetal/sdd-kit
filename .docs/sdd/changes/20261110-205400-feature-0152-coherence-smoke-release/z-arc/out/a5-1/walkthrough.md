---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (5eaad54).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas: `src/app.js`, `test/cancel.test.js` (79b238a).
- Capacidad `bookings` creada con los dos requisitos del delta (`sdd capability merge`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 pass, 0 fail, 350 ms, sobre el commit previo al cierre; el commit de cierre solo añade documentación. El proyecto no declara gate ni «Suites» (no hay `operations.md`).
- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 79b238a. `HEAD` se movió después solo con commits de documentación (`tasks.md`, una línea de `spec.md`, `ROADMAP.md`): sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 sobre el commit previo al cierre · smoke con ejecución real de los 3 THEN de `cancelar` por la CLI (`node src/app.js …`) · el THEN de `canceladas` no se puede ver por la CLI (ver `no probado`) · revisión final Spec y Código limpia sobre 79b238a.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real + suite | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real (sin test propio) | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | suite + llamada real a `run` en un mismo proceso; por la CLI `no probado` | en un proceso: `cancelada Norte lun (sala ocupada)` y luego `Norte lun — sala ocupada`; por la CLI, `canceladas` en un proceso nuevo imprime una línea vacía |

**Sin probar:** `canceladas` por la CLI. Las reservas viven en memoria dentro de `src/app.js`: cada invocación de `node src/app.js` empieza sin cancelaciones, así que el comando real siempre sale vacío. El THEN solo se cumple dentro de un proceso (lo que hace el test). La 0014 («Motivo guardado: el motivo se guarda en el almacén de reservas») lo toca; no asumo que lo arregle.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ruling de la Task 2): fila en «Por triar» de la deuda.
- El THEN «sin `--motivo`» no tiene test propio (solo ejecución real): fila en «Por triar».
- `canceladas` no es utilizable por la CLI mientras el estado sea en memoria: fila en «Por triar», relacionada con la 0014.

## 5. Aprendizajes

- Sin cambio estructural ni convención nueva: el comportamiento observable vive en `capabilities/bookings.md`, y lo estructural no cambia `architecture.md`. → `capabilities/bookings.md`
- Un test que depende del orden de otro es un workaround, no una decisión: va a la deuda, no a un doc de steering. → `steering/debt.md`

Retro: sin señales

## 6. Adendas

- _(ninguna)_
