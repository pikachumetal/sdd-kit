---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-21
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`) — `cancelar <sala> <día> --motivo <motivo>` acepta solo cambio de planes, sala ocupada y otro; fuera de la lista o sin `--motivo` responde «motivo no válido: …». Commit a9fb581.
- **Listado de canceladas** (`src/app.js`, tests unitario y E2E) — comando `canceladas`, que lista sala, día y motivo de las reservas canceladas. Commit 5496b7a.
- **Capacidad** `bookings` creada con `sdd capability merge` a partir del delta de la spec (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Una en el gate, que no llegó al código (abajo).

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar una carrera de los tests sobre el almacén compartido en memoria, como workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **No está aplicado**: ni `package.json` ni `operations.md` lo llevan, y el gate declarado (`node --test test/`) pasa 5/5 sin él. La carrera queda como deuda a confirmar.

## 4. Verificación

### 4.1 Builds

- Suite completa (gate de cierre): `node --test test/ && node e2e/run.mjs` → unit 5/5 · E2E 7/7 · 48,1 s de E2E · configuración: la del gate · sha `5496b7a` (el cierre posterior solo toca documentación).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:4672/health` → `ok`, levantado en esta sesión antes de cada pasada y parado al acabar.
- E2E: 48,1 s de 0,5 min — supera el presupuesto (ver 4.3).
- Estabilidad de los specs que toca la rama (frente a `develop`, solo `e2e/cancel.e2e.mjs`): los 3 tests nuevos o cambiados ×3 y los otros 2 ×1 = 11 ejecuciones, 11 verdes, sin reintentos (`retries: 0`):
  - cancela una reserva con su motivo ×3 (6,1 · 6,0 · 6,0 s)
  - rechaza un motivo fuera de la lista ×3 (6,1 · 6,0 · 6,0 s)
  - la cancelada sale en canceladas con su motivo ×3 (12,1 · 12,0 · 12,0 s)
  - anula una reserva ×1 y anular sin reserva avisa ×1 (6,1 · 6,0 s)
  - `e2e/free.e2e.mjs` no lo toca la rama: no se repite (pasa ×1 en la suite completa).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-21 · verificación del agente: suite 5/5 unit y 7/7 E2E, 11/11 ejecuciones en la tanda de estabilidad, 5/5 THEN con ejecución real contra un servidor levantado en esta sesión, revisión final Spec y Código sobre `5496b7a`, limpia. Nadie ha probado el cambio a mano: no hay frase del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real · suite | verificado por el agente |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`me aburro`) · suite | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real · suite unitaria | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real · suite (E2E con «otro») | verificado por el agente |
| (GIVEN del listado) la reserva cancelada con «sala ocupada» | ejecución real | verificado por el agente |

### 4.3 Residuales / deuda generada

- Suite E2E por encima de su presupuesto: 48,1 s de 0,5 min — deuda del proyecto. Cada paso espera 6 s con la traza completa (`E2E_TRACE`, por defecto `on`); no se ha cambiado el gate para esquivarlo.
- La carrera de los tests unitarios sobre el almacén compartido en memoria, que el ruling de la Task 2 decía esquivar, no se reprodujo en esta pasada. Fila de deuda para confirmar si existe y aislar el almacén por test.
- Fuera de scope, ya en el roadmap: anulaciones del responsable (0011), informe (0012), motivo guardado en el almacén (0014).

## 5. Aprendizajes

- Los requisitos nuevos de comportamiento → `capabilities/bookings.md`, fusionado con `sdd capability merge`.
- Sin aprendizaje de convención, estructura o versión: no hay `architecture.md` que tocar y nada cambia en `tech-stack.md`.
- Revisión de skills: el proyecto no tiene `.claude/skills/`; este trabajo no revela un patrón reutilizable ni desmiente nada. No aplica.

## 6. Adendas

- (ninguna)
