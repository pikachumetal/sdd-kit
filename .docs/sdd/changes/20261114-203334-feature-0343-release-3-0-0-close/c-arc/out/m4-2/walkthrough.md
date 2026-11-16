---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, 77b8bf2): `cancelar <sala> <día> --motivo <motivo>` acepta solo cambio de planes, sala ocupada u otro; un motivo fuera de la lista o ausente responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, 48fbe47): `canceladas` lista «sala día — motivo».
- **Migración** (`migrations/v3.0.0.md`, en el commit de cierre): la línea pasa a «Paso 3: borra `roadmap.md` al acabar.».
- **Capacidad** `bookings` creada con los dos requisitos del delta (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Pasa a deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, ejecutado por el agente.
- Gate: `node --test` → 5/5 · sobre el commit de cierre (el cierre solo junta documentación y la línea de `migrations/v3.0.0.md` sobre el código ya probado de 48fbe47).
- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias; Arquitectura no (plan). Lo posterior es solo documentación.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias; `canceladas` probado en el mismo proceso que `cancelar` (las reservas viven en memoria hasta la 0014).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "porque sí"`) | «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin `--motivo` responde lo mismo | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso tras cancelar) | «Norte lun — sala ocupada» |

Verificado por el agente: todo lo anterior. Reportado por el usuario: nada.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ruling de la Task 2) → fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El comportamiento observable (motivo y listado) → `capabilities/bookings.md`, por `sdd capability merge`.
- Sin aprendizajes de convención, arquitectura ni versiones.

Retro: sin señales

## 6. Adendas

- _Ninguna_
