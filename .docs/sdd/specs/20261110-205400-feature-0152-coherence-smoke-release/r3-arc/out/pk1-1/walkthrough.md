---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` (98d07ea).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` (06e1bc0).
- Capacidad nueva `bookings` con los dos requisitos de la spec.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Ruling de la Task 2 (`--test-concurrency=1` en el gate, como workaround de una carrera entre tests) — retirado en el cierre: la re-revisión lo señaló y se comprobó que no había carrera (cada fichero corre en su proceso; `node --test` a secas dio 5/5 cinco veces) — coste si estaba mal: una suite al doble de tiempo y un workaround falso en el registro. El gate sigue siendo `node --test`.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 4/4 THEN con ejecución real (el THEN «sin `--motivo`» sin test: solo ejecución real) · revisión final Spec y Código limpia sobre 06e1bc0 · re-revisión de 06e1bc0..cierre: 1 Important y 1 Minor, ambos en `tasks.md` (un Ruling con premisa falsa y un hash de commit), corregidos en el cierre

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real, suite | cancelada Norte lun (sala ocupada) |
| Motivo fuera de la lista responde «motivo no válido: …» | ejecución real, suite | motivo no válido: cambio de planes, sala ocupada, otro |
| Sin `--motivo` responde lo mismo | ejecución real | motivo no válido: cambio de planes, sala ocupada, otro |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, suite | Norte lun — sala ocupada (cancelar y listar en un mismo proceso: el almacén es en memoria) |

### 4.3 Residuales / deuda generada

- Sin test del THEN «sin `--motivo`» → fila en «Por triar» de `debt.md`.
- El test `canceladas` de `test/cancel.test.js` depende de que corra después del primero (estado de módulo compartido) → misma fila.

## 5. Aprendizajes

- El motivo vive en la reserva cancelada, en memoria; guardarlo de forma persistente es la 0014 → ROADMAP.md.

Retro: documento o skill desmentido → corregido en el mismo documento (`tasks.md`: Ruling retirado, hash de la Task 1)
Retro: error que cazaría un chequeo → fila en la deuda: sin test del THEN «sin `--motivo`» (`.docs/sdd/steering/debt.md`)

## 6. Adendas

- _Ninguna_
