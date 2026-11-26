---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo de la lista cerrada (`cancelar <sala> <día> --motivo <motivo>`): `src/app.js`, commit 055fb6b.
- Comando `canceladas`, que enseña sala, día y motivo: `src/app.js`, commit 1ebdf39.
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con los dos ADDED de la spec.
- Task 3 (664b8b5), añadida al final del plan cuando el guion falló: `libres` volvía a tratar la reserva cancelada como libre. Revierte c26092a, que la dejaba ocupando la sala.
- Pasada de fix de la revisión final: cada test unitario prepara su propio estado, se añade el test de «sin `--motivo`» y se recupera el de «sin reserva».

## 3. Desviaciones del plan

- Task 3 no estaba en el plan: se añadió tras el fallo del paso 3 del guion («Se prueba en la aplicación»).

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutilizaba la cancelación del primer test — workaround hasta que cada test prepare sus datos — coste si era erróneo: el test falla si corre solo. Resuelto en la pasada de fix de la revisión final.
- El guion «cancelar y luego libres» se ejecuta en una sesión del servidor (`x-session`), no con dos procesos de la CLI: la memoria vive en el proceso hasta la 0014 — coste si es erróneo: quien lo pruebe con dos comandos de CLI verá «Sur» sin que haya bug.
- Decisión 3 de la spec (numeración sin la 2), mayúsculas en el motivo y motivo sin comillas: se dejan como están (lista cerrada, argv normal) — coste si es erróneo: ninguno en el código.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/` · `node e2e/run.mjs` → unit: corrió 8/8 · e2e: corrió 7/7 · sobre el commit de cierre (el gate corrió antes de él; desde entonces solo cambió `.docs/`).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:55953/health` → ok, levantado en esta sesión y parado al acabar.
- E2E: ~48 s de 0,5 min de presupuesto (30 s): pasa el presupuesto, deuda del proyecto.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-25 · gate verde (unit 8/8, e2e 7/7) · guion de la spec ejecutado en una sesión del servidor con `ejecución real` en los 4 THEN · revisión final Spec (opus) y Código (sonnet) con 3 Important arreglados, re-revisión limpia, 0 sin revisar, 0 sin verificar. Los dos commits de `tasks.md` posteriores a la re-revisión (menos de 20 líneas, solo docs) los revisé en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» (con `x`) |
| sin `--motivo` responde lo mismo | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | «Norte lun — sala ocupada» |
| Línea del plan: tras cancelar, `libres 10:00-12:00` vuelve a dar «Norte, Sur» | ejecución real | «Norte, Sur» (antes de la Task 3, «Sur») |

### 4.3 Residuales / deuda generada

- Diferidos de la revisión final (Minor): `canceladas` vacía responde una cadena vacía (cambiaría la salida, decisión del dev-lead); `src/app.js` pasó de CRLF a LF en c26092a; `cancelar Norte --motivo otro` sin día toma `--motivo` como día; literales de estado repetidos; orden de helpers y exports.
- La suite e2e (~48 s) pasa el presupuesto de 0,5 min: deuda del proyecto (fila en `debt.md`).

## 5. Aprendizajes

- Un test que depende del estado que dejó otro oculta regresiones (la revisión final lo cazó) → ya está en `operations.md` «Datos»; no se duplica.

Retro: error que cazaría un chequeo → un test (`test/cancel.test.js`: `libres vuelve a ofrecer la sala de una reserva cancelada`) (test/cancel.test.js)
Retro: documento o skill desmentido → ticket del kit: «Closing drafts» de `sdd-validate` manda vigilar cada despacho con `sdd watch subagent`, y devolvió «SIN TRANSCRIPT… el vigía de silencio no funciona en esta sesión»

## 6. Adendas

- (ninguna)
