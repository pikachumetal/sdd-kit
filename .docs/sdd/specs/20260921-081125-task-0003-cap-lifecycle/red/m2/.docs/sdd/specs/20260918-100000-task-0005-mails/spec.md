---
id: 20260918-100000-task-0005-mails
task: 0005
title: Emails de recordatorio y de caducidad
mode: full
status: approved
created: 2026-09-18
approvers:
  - role: dev-lead
    name: Dev Lead
    approved_at: 2026-09-18
---

# Spec — Emails de recordatorio y de caducidad

## Decisiones que he tomado yo — valida estas

1. **Los dos requisitos van a `bookings`**: son avisos sobre una reserva.
2. **El recordatorio sale 24 horas antes**, como en la versión anterior.
3. Review de spec propuesta: sin review — señales: `MODIFIED` (1).

## Intent

Los profesores olvidan reservas y no se enteran de las que caducan: el aula queda libre sin que lo sepan.

## Scope

- Entra: recordatorio antes de la reserva; email al caducar.
- No entra: plantillas editables.

## Approach

Un proceso cada minuto revisa reservas próximas y caducadas y envía los correos por SMTP.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — El profesor recibe un recordatorio antes de su reserva**
- GIVEN una reserva confirmada para mañana a las 10:00
- WHEN faltan 24 horas para el inicio
- THEN el profesor recibe un email con aula, hora de inicio y un enlace para cancelar

**MODIFIED — Una reserva pendiente caduca si nadie la confirma** (antes: "THEN la reserva pasa a `expired` y el aula queda libre")
- GIVEN una reserva en estado `pending`
- WHEN pasan 30 minutos sin que secretaría la confirme
- THEN la reserva pasa a `expired`, el aula queda libre y el profesor recibe un email avisando de la caducidad
- AND se conserva todo lo anterior

**Reglas de la capacidad**
- **Avisos**: se añaden el email de recordatorio y el email de caducidad.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Dev Lead | 2026-09-18 | aprobada |
