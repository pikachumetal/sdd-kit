---
id: 20261015-150000-feature-0035-room-hours-cs
feature: 0035
title: Plan de implementación — Horas reservadas por sala
spec: ./spec.md
status: approved
created: 2026-10-15
---

# Plan de implementación — Horas reservadas por sala

## Decisiones que he tomado yo — valida estas

1. Una task, Native.

**Goal**: `Rooms.Hours`.

**Ejecución**: native, porque es una task en un fichero.

## Restricciones globales

### De código

- Texto de la interfaz en castellano.
- Sin comentarios que repitan el código ni que citen documentos.

### De proceso

- Native: implementa la sesión.

## Review Focus

- ninguna: comprobado

## 2. Tasks

### Task 1 — `Rooms.Hours`

**Tras**: —
**Tests RED**: hilo principal · `Tests.cs`
**Superficies**: backend
**Verificación**: `dotnet run` → `todo en verde`, con código de salida 0
**Interfaces**:
- Consume: `Rooms.SlotHours(slot)` (`"10:00-12:00"` → `2`) y `Rooms.Bookings` (`Booking(Room, Day, Slot, Status)`, `Status` en `active` o `cancelled`).
- Produce: `Rooms.Hours(string room)` → `"<sala>: <n> h"`.
**Ficheros**: `Rooms.cs`, `Tests.cs`

## 3. Validación final

- [ ] Gate de cierre: `dotnet run`
