---
id: 20261009-130000-feature-0015-report-groupings
feature: 0015
title: Informe por sala y por motivo
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

# Spec — Informe por sala y por motivo

## Capacidades

- Modificadas: `bookings` — nace el comando `informe`.

## Decisiones que he tomado yo — valida estas

1. Las salas van en orden alfabético y, dentro de cada sala, las reservas en el orden de la semana (lun, mar, mié, jue, vie).
2. Sin canceladas, `informe` responde «sin canceladas».

## Intent

El responsable quiere ver de un vistazo qué se canceló y por qué, sala a sala.

## Scope

- Entra: comando `informe`.
- No entra: filtros por fecha o por motivo; exportar.

## Dónde se prueba

- Informe: por la salida de `run('informe', [])`, en `test/informe.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — El informe lista cada cancelada con su motivo, por sala**
- GIVEN las reservas del almacén
- WHEN `informe`
- THEN cada reserva cancelada aparece bajo su sala, con su día, su franja y su motivo: `  vie 10:00-12:00 — sala ocupada`
- AND cada sala abre con su línea `Norte: 2 canceladas` y el informe cierra con `Total: 3 canceladas`
- AND una reserva activa no aparece

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-09 | aprobada |
