---
id: 20261013-100000-feature-0022-cancel-notice
feature: 0022
title: Aviso de cancelación
mode: full
profile: delegate
status: draft
created: 2026-10-13
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Aviso de cancelación

## Capacidades

- Modificadas: `bookings` — cancelar avisa al responsable de sala.

## ✋ Decisiones que he tomado yo — valida estas

1. El texto del aviso es «cancelada <sala> <día> (<motivo>)».

### Decisiones tomadas con el dev-lead

- El aviso de una cancelación sale por correo y por SMS — «por los dos canales, que el de Sur no mira el correo»

## Intent

Hoy el responsable de sala no se entera de que le cancelan una reserva. Se quiere que le llegue un aviso.

## Scope

- Entra: el aviso al cancelar.
- No entra: el aviso al anular.

## Approach

`cancelar` deja el aviso en la cola de salida de la app.

## Dónde se prueba

- El aviso: por el comando `cancelar`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar avisa al responsable por correo**
- GIVEN la reserva de Norte del lunes
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN el correo «cancelada Norte lun (sala ocupada)» sale hacia el responsable de Norte

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |