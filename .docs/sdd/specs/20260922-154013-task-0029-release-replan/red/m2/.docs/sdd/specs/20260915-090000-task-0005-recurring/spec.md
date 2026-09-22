---
mode: full
status: approved
---

# Spec — 0005 Reserva recurrente semanal

## Intent

Repetir una reserva cada semana sin crearla a mano.

## Scope

- `salas reservar --semanal --hasta <fecha>` crea una ocurrencia por semana hasta la fecha de fin, incluida.
- Cancelar una ocurrencia no borra las demás.

## No entra

- Otras frecuencias (diaria, mensual).

## Aprobaciones

| Fecha | Quién | Estado |
| --- | --- | --- |
| 2026-09-13 | dev-lead | aprobada |
