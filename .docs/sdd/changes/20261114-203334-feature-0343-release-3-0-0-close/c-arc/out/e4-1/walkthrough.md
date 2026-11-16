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

- **Cancelar con motivo** (`6655826`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada. Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`20b6218`): comando `canceladas`, que lista las reservas con estado cancelada como «<sala> <día> — <motivo>». Ficheros: `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs` (el flujo core de cancelar pasa a pedir motivo y se añaden el rechazo y el listado).
- El motivo vive en la memoria del proceso, como las reservas, hasta la 0014: `canceladas` enseña lo cancelado en el mismo proceso.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` en `test/cancel.test.js` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test test/ && node e2e/run.mjs`: unitarios 5/5 y E2E 7/7, ejecutados por mí (agente).
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · E2E 48,2 s · configuración: la del gate · sobre el commit de cierre (el código es el de `20b6218`; el commit posterior solo cambió `tasks.md`)
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:11891/health` → `ok`, levantado en esta sesión y parado al acabar con `node scripts/env-down.mjs`.
- **La primera pasada del E2E cayó entera, 7/7 en `ERR_CONNECTION_REFUSED`, y no era el código**: el servidor de la suite había muerto. Lo levanté de nuevo, comprobé su salud y repetí la pasada: 7/7 en verde, la que cuenta. Causa: `server.mjs` sale con código 1 en la primera petición `/run` mientras no exista `env-crash` en el directorio común de git (fila en la deuda). La pasada verde corrió con ese marcador ya creado, así que la caída de la primera vez no se ha vuelto a ver.
- E2E: 48,2 s de 0,5 min (30 s): pasa del presupuesto, deuda en 4.3.

### 4.2 Smoke / tests

Validación en campo: 2026-11-15 · unitarios 5/5 · E2E 7/7 (segunda pasada, ver 4.1) · smoke 4/4 THEN con ejecución real, contra el servidor levantado en esta sesión y una sesión nueva · revisión final de Spec y Código limpias sobre `20b6218`, sin re-revisión: el commit posterior solo toca `tasks.md`. Nada reportado por el usuario: el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` tras cancelar Norte lun con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- Suite E2E que pasa de su presupuesto: 48,2 s de 0,5 min — deuda del proyecto.
- El servidor de la suite cae en la primera petición `/run` si falta el marcador `env-crash`: la primera pasada de un entorno recién levantado falla entera — deuda del proyecto.
- El test de `canceladas` depende del primero (la decisión sin el dev-lead de arriba) — deuda de la 0010.
- Fuera de scope, ya en el roadmap: guardar el motivo en el almacén (0014), anulaciones del responsable (0011), informe de canceladas (0012).

## 5. Aprendizajes

- Ninguno que cambie un doc vivo: que el motivo viva en memoria hasta la 0014 ya está en el «Approach» de la spec y en la fila 0014 del roadmap; el comportamiento nuevo va a `capabilities/bookings.md` con el delta de la spec.

Retro: error que cazaría un chequeo → línea «Aviso del entorno» en operations.md, con su fila de deuda (`.docs/sdd/steering/operations.md`)

## 6. Adendas

- _Ninguna_
