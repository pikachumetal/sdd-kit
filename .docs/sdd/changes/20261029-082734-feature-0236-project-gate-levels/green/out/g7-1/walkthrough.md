---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, commit 303fb57): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Sin `--motivo`, o con uno fuera de la lista, responde «motivo no válido: …».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, commit 303fb57): el comando `canceladas` lista las reservas canceladas con su motivo.
- **Script `cancelar`** (`package.json`): atajo `npm run cancelar -- <sala> <día> --motivo <motivo>`. No estaba en la spec ni en el plan; se añadió al final y la re-revisión lo da por limpio.
- **Capacidad `bookings`** (`.docs/sdd/capabilities/bookings.md`): no existía; la crea la fusión del delta de la spec (dos requisitos ADDED).

## 3. Desviaciones del plan

- Ninguna en las tasks: las dos del plan se hicieron en el orden previsto, en Native.
- Añadido fuera del plan: el script `cancelar` de `package.json` (ver §1).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. El `gate.json` que se integra **no lleva** ese flag y el gate de cierre salió verde sin él; el workaround queda como deuda (ver 4.3).

## 4. Verificación

### 4.1 Builds

- `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → exit 0, `bookings:test` 5 pasan, 0 fallan; salida en el scratchpad de la sesión.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (la rama no toca sus inputs, `src/rooms.js` y `test/rooms.test.js`) · ~1 s · configuración: la del gate · sobre el commit de cierre
- Revisión final: ejes Spec (opus + high) y Código (sonnet + high), limpios, sobre 303fb57. Eje Arquitectura: no (el plan lo descarta). Revisión de spec: no (dos señales, ver spec).
- Re-revisión del tramo posterior (`package.json`, que la excepción de solo documentación no cubre): un revisor `general-purpose` con `opus`, porque `sdd-kit:effort-high` no estaba disponible en la sesión; limpia, sin hallazgos ni observaciones.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · verificación del agente: gate `bookings:test` 5/5 verde (`rooms:test` saltada) · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia · re-revisión del tramo posterior limpia. No probado: la persistencia entre procesos (el almacén es en memoria; es la 0014) y `npm run cancelar` más allá de un caso feliz.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | verificado por el agente: coincide |
| Un motivo fuera de la lista (`vacaciones`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente: coincide |
| Sin `--motivo` responde lo mismo | ejecución real | verificado por el agente: coincide |
| `canceladas` tras cancelar con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real, `cancelar` y `canceladas` en el mismo proceso | verificado por el agente: coincide |

### 4.3 Residuales / deuda generada

- El almacén de reservas es un array en memoria: `canceladas` en un proceso nuevo sale vacío. Es lo que cubre la 0014 «Motivo guardado», ya en el roadmap.
- Workaround `--test-concurrency=1` por la carrera de los tests sobre el almacén compartido: fila nueva en la deuda técnica del roadmap.

## 5. Aprendizajes

- Los tests de reservas comparten el almacén en memoria del módulo y pueden pisarse si corren en paralelo → fila de deuda técnica en `roadmap.md` (no hay `architecture.md` ni un cambio estructural que anclar: es un workaround, no una convención).
- Revisión de skills: se miró `.claude/skills/` y el proyecto no tiene; el trabajo no revela un patrón reutilizable. No aplica.
- Capacidad `bookings`: fusionada con `sdd capability merge` (no existía; creada).

## 6. Adendas

- _Ninguna._
