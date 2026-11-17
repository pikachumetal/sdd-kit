---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro): `src/app.js`, `test/cancel.test.js` (task 1, `7f76fd1`).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas: `src/app.js`, `test/cancel.test.js` (task 2, `a9d6860`).
- La capacidad `bookings` nace en `.docs/sdd/capabilities/bookings.md`, con los dos requisitos de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Build: no aplica. `node --test --test-concurrency=1 test/` → 5/5 pasan; `node e2e/run.mjs` → 7/7 pasan (48,2 s de 0,5 min de presupuesto).
- Gate: `node --test --test-concurrency=1 test/` · `node e2e/run.mjs` (gate de cierre de `operations.md` §Testing, sin filtro) → unit: corrió 5/5 · e2e: corrió 7/7 · ~49 s · configuración: la del gate, más `--test-concurrency=1` (ruling de la task 2) · sobre el commit de cierre.
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:3610/health` → `ok`, levantado en esta sesión y parado con `env-down.mjs`.
- E2E: 48,2 s de 0,5 min.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite unitaria 5/5 · e2e 7/7 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre a9d6860; el commit de `tasks.md` posterior a la revisión solo añade `tasks.md` (17 líneas, la carpeta de la feature que el paquete de revisión excluye) y no se re-revisó: `sin revisar: commit de tasks.md — solo añade tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js cancelar …`) + suite | ok |
| Un motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite + e2e | ok |
| Sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` tras cancelar con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real (mismo proceso) + suite | ok |

Todo verificado por el agente; nada reportado por el dev-lead.

### 4.3 Residuales / deuda generada

- El ruling de la task 2 dice que hay una carrera sobre el almacén en memoria. En el cierre, 5 pasadas de `node --test test/` sin la bandera salieron 5/5 verdes (cada fichero de test corre en su proceso): la carrera no se reproduce → fila en la deuda técnica del roadmap, para confirmarla o quitar la bandera.

## 5. Aprendizajes

- La bandera `--test-concurrency=1` no se ha escrito en `operations.md`: el ruling no se pudo reproducir en el cierre → deuda técnica del roadmap.
- El comportamiento nuevo (motivo y listado) vive solo en `capabilities/bookings.md`.

Retro: documento o skill desmentido → deuda técnica del roadmap (`.docs/sdd/roadmap.md`): el ruling de la task 2 afirma una carrera que 5 pasadas sin la bandera no reproducen

## 6. Adendas

- _Ninguna_
