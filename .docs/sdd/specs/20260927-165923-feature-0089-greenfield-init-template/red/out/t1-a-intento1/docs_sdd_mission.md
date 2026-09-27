---
title: Misión — App
status: active
---

# Misión

## 1. Por qué existe

### 1.1 Problema

Los equipos de una oficina se pisan las salas de reuniones: no hay forma de ver cuáles están
libres.

### 1.2 Solución

Una app donde cada empleado ve la ocupación de las salas, reserva la que le haga falta y cancela
sus propias reservas. Un administrador de oficina da de alta las salas y ve todas las reservas.

## 2. Usuarios y roles

- **Empleado**: reserva y cancela sus propias reservas. No ve quién reservó las demás, solo
  "ocupada".
- **Administrador de oficina**: da de alta salas y ve todas las reservas.

## 3. Módulos

- Salas
- Reservas
- Calendario de ocupación

## 4. Fuera de alcance

- Pagos o facturación por sala.
- Recursos distintos de salas (proyectores, plazas de parking...).
- Integración con calendarios externos (Outlook, Google Calendar).

## 5. Glosario

- **Sala**: recurso reservable, dado de alta por un administrador.
- **Reserva**: franja horaria de una sala asignada a un empleado; máximo 4 horas.
- **Ocupación**: vista de qué salas están libres u ocupadas en un rango de tiempo.
