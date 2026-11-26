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

- Cancelar pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro): `src/app.js` (`cancelBooking`, `reasonOf`), commit 2d930f9.
- Comando `canceladas`, que lista sala, día y motivo de lo cancelado en el proceso: `src/app.js`, commit 39ab6d5.
- Pasada de fix de la revisión final: tests independientes (módulo fresco por test), tests de «sin motivo» y «sin reserva» recuperados, y dos e2e que no eran flujo core retirados: `test/cancel.test.js`, `e2e/cancel.e2e.mjs`, commit a553f1a.
- Capacidad `bookings` creada con los dos requisitos ADDED: `.docs/sdd/capabilities/bookings.md`.

## 3. Desviaciones del plan

- Task 3 añadida al final del plan para la pasada de fix de la revisión final.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutilizaba la cancelación del primer test — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Revocado en la Task 3.
- Task 3: revoca la anterior porque contradice «Datos» de `operations.md` — coste si es erróneo: ninguno, solo cambian tests.
- Eje Arquitectura no sale: el diff solo añade el campo `reason` a la reserva en memoria, sin módulo ni dependencia nueva — coste si es erróneo: un revisor menos sobre una frontera que no se tocó.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/` · `node e2e/run.mjs` → unit: corrió 7/7 · e2e: corrió 5/5 · sobre 2173e70 · entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:52659/health` → ok, levantado en esta sesión y parado después.
- Revisión final sobre bae2e62: Spec opus+high y Código sonnet+high, con fixes (3 Important cada uno). Re-revisión bae2e62..2173e70, opus+high, limpia.

### 4.2 Smoke / tests

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro», y la reserva sigue activa |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- `canceladas` sin canceladas imprime una línea en blanco.
- `--motivo` seguido de otro flag se rechaza como motivo inválido (seguro).
- Un motivo inválido deja la reserva activa; solo lo pinta el test de «sin motivo».
- La spec salta de la decisión 1 a la 3 y marca ADDED lo que en rigor modifica `cancelar`.

## 5. Aprendizajes

## 6. Adendas
