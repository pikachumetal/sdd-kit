# Walkthrough — Motivo al cancelar

Feature 0010: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y `canceladas` lista las reservas canceladas con su motivo. Capacidad `bookings` creada (no existía).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 6 pasan, 0 fallan, 0,4 s, sobre 8a729a0 (verificado por el agente; salida guardada entera antes de leerla).
- Gate de la constitución: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, sobre 8a729a0, pero **filtrado**: `rooms:test` sale «skipped» porque ningún cambio toca sus entradas. Por eso no vale como suite completa; se corrió además `node scripts/gate.mjs run bookings:test rooms:test` (sin `--affected`): 5 + 1 pasan, 0 fallan.

### 4.2 Smoke (verificado por el agente, `node src/app.js …`)

| THEN | Comando | Resultado |
| --- | --- | --- |
| cancelada con motivo de la lista | `cancelar Norte lun --motivo "sala ocupada"` | `cancelada Norte lun (sala ocupada)` ✔ |
| motivo fuera de la lista | `cancelar Sur mar --motivo X` | `motivo no válido: cambio de planes, sala ocupada, otro` ✔ |
| sin `--motivo` | `cancelar Norte lun` | `motivo no válido: cambio de planes, sala ocupada, otro` ✔ |
| listado de canceladas | `canceladas` | solo por `test/cancel.test.js`; **no probado** por la CLI |

- `no probado`: `canceladas` desde la CLI. El almacén es en memoria y cada invocación es un proceso nuevo, así que tras un `cancelar` el listado sale vacío. Es el hueco que cubre la fila 0014 («Motivo guardado»), no esta feature.
- `no probado`: «sin `--motivo`» no tiene test automático; solo el smoke de arriba.
- Un intento previo con `--motivo sala-ocupada` (con guion) responde «motivo no válido»: el motivo se escribe con espacio, tal como la lista.

Validación en campo: 2026-10-26 · verificación del agente: smoke por THEN (tabla 4.2) y suite completa en verde sobre 8a729a0; `canceladas` por CLI y «sin `--motivo`» automático, no probados.

## 5. Revisión final

Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 3d41684. `8a729a0` solo toca `tasks.md` (documentación): sin re-revisión.

## 6. Decisiones tomadas sin el dev-lead

- ✋ Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test; si es erróneo, la suite tarda el doble. **No está aplicado**: `gate.json` y la constitución no llevan la bandera, y los ficheros de test corren en procesos distintos. Fila de deuda abierta en el roadmap.

## 7. Aprendizajes

- Ninguno que vaya a un documento vivo. No hay `.claude/skills/` (revisado, no aplica).
- `bookings.md` no existía: creado por `sdd capability merge` desde la spec.
