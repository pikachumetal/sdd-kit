---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; `canceladas` lista «sala día — motivo». Task 1 (783a8f8), Task 2 (e2b103a).
- `test/cancel.test.js`: tests de ambos comandos.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos de la spec, mergeada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 5/5 en verde, ejecutado por el agente en el cierre, sobre el commit de cierre (lo posterior a la Task 2 solo toca `.docs/`).
- Gate: `node --test` → corrió 5/5 · sobre el commit de cierre. Sin `operations.md`: no hay suites ni «Sin filtro» declarados.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 3/3 THEN con ejecución real (la CLI y un script en un solo proceso para encadenar cancelar y canceladas) · revisión final Spec y Código limpia sobre e2b103a; lo posterior es `tasks.md` (17 líneas de documentación), revisado en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | verificado por el agente |
| motivo fuera de la lista (`"me aburro"`) y sin `--motivo` responden «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente (los dos) |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real | verificado por el agente |

Nada reportado por el usuario: no probado por la persona.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del estado del primero (ver la decisión sin el dev-lead): deuda en `debt.md`.
- El almacén de reservas es en memoria: un proceso de la CLI no ve las cancelaciones de otro. Es la base del molde, y la 0014 «Motivo guardado» ya lo recoge.

## 5. Aprendizajes

- La capacidad `bookings` no existía: la 0010 la crea con sus dos requisitos → `.docs/sdd/capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
