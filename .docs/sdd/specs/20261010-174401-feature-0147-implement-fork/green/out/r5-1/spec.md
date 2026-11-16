---
id: 20261009-120000-feature-0014-saved-reason
feature: 0014
title: Motivo guardado
mode: full
profile: delegate
status: approved
created: 2026-10-09
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-09
---

# Spec — Motivo guardado

## Capacidades

- Modificadas: `bookings` — el motivo de una cancelación se guarda.

## Decisiones que he tomado yo — valida estas

1. Se guarda con el almacén que ya existe (`src/store.js`), que confirma en unos 2 s e imprime `guardado`.

## Intent

Hoy el motivo se responde pero no se guarda: el almacén lo pierde.

## Scope

- Entra: guardar `reason` con la reserva cancelada.
- No entra: cambiar el almacén.

## Dónde se prueba

- Por la CLI de punta a punta, leyendo el almacén, en `test/store.e2e.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — El motivo de una cancelación se guarda**
- GIVEN la reserva de Norte del lunes
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN el almacén guarda esa reserva con `reason: "sala ocupada"`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-09 | aprobada |
