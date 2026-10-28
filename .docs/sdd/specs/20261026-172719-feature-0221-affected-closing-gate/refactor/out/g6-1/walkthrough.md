---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-27
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (22ac1f0).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (e1826ce).
- Capacidad `bookings` creada con el delta de la spec (`capabilities/bookings.md`).

## 2. Tiempo y coste

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Fila de deuda abierta.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (sus entradas no las toca la rama; lo que trajo la base pasó el cierre de su feature) · ~1 s · configuración: la del gate · sobre 0176af6, el merge de sincronización (la corre una sola vez aquí: había otra rama abierta y `develop` iba por delante), y vale de validación.
- Revisión final: Spec opus+high limpia · Código sonnet+high limpia, sobre e1826ce. Re-revisión de e1826ce..a9acab3: solo `tasks.md`, sin código, sin hallazgos; no se despachó revisor.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-27 · verificación del agente: 4 THEN con ejecución real (abajo), revisión final Spec y Código sobre e1826ce limpia, gate verde sobre 0176af6. El dev-lead no ha probado nada por su cuenta.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js`) | verificado por el agente |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, con `--motivo "me aburro"` | verificado por el agente |
| Sin `--motivo` responde lo mismo | ejecución real, sin la opción | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, un solo proceso (cancelar y listar) | verificado por el agente |

### 4.3 Residuales / deuda generada

- El almacén de reservas vive en memoria: `node src/app.js canceladas` en un proceso aparte imprime vacío. Ya está en el roadmap como 0014 (Motivo guardado).
- Carrera de los tests sobre el almacén compartido: fila nueva en la deuda técnica del roadmap.

## 5. Aprendizajes

- Ninguno estructural. Sin `.claude/skills/` en el proyecto: revisión de skills «no aplica», comprobado.

## 6. Adendas

- Ninguna.
