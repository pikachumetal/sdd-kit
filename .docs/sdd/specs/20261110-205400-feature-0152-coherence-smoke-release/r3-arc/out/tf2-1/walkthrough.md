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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, e07fd18): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, f2ba057): el comando `canceladas` lista las reservas con estado cancelada como «<sala> <día> — <motivo>».
- Capacidad `bookings` creada en `capabilities/bookings.md` con `sdd capability merge` (dos requisitos ADDED).

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,69 h — reloj de 2 sesiones 5,02 h desde 2026-10-08T09:00Z, sin 200 min de espera al dev-lead (2 esperas)
- Desviación: -2,31h (-58%)
- Causa de la desviación (obligatoria si |desviación| > 30%): esperas al dev-lead de 09:40Z 140 min y 12:40Z 60 min, ya descontadas del esfuerzo real; el trabajo medido fue menor que la estimación de 4h
- Compactación: no
- Modelo del hilo: Sonnet 5.5, effort no registrado
- Tokens del hilo: 739.987 — claude-sonnet-5-5 739.979; claude-sonnet-5 8
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1`, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Va a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` sobre el commit de cierre (código idéntico a f2ba057) → 5/5 en verde, salida en el scratchpad de la sesión (`gate-0010.txt`).
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,1 s · configuración: la del gate del plan más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre (los commits posteriores a f2ba057 son solo documentación)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre f2ba057; los tres commits posteriores son solo documentación y de menos de 20 líneas: `revisado en el hilo`, sin re-revisión

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "porque sí"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` (cancelar y listar en un mismo proceso: el almacén vive en memoria) |

Todo lo anterior lo verificó el agente; el dev-lead no ha reportado nada propio.

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén de reservas en memoria y compiten entre sí: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El almacén de reservas en memoria se comparte entre tests y obliga a ejecutarlos en serie → deuda («Por triar» de `debt.md`), no hay `operations.md` donde escribirlo.

Retro: sin señales
