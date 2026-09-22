---
id: 20260921-120000-task-0010-my-bookings
task: 0010
title: Listar mis reservas
mode: lite
status: approved
created: 2026-09-21
---

# Spec — Listar mis reservas

## Delta de comportamiento

### Capacidad: `room-booking`

**ADDED — `mias` lista las reservas**
- GIVEN reservas existentes
- WHEN se ejecuta `salas mias`
- THEN sale una línea por reserva: `<sala> <día> <franja>`
