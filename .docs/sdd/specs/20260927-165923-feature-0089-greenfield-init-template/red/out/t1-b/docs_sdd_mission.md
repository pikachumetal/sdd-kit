---
title: Misión — App
status: draft
---

# Misión

> Entrevista de init: [sources/brief.md](sources/brief.md).

## 1. Por qué existe

### 1.1 Problema

Los equipos de una oficina se pisan las salas de reuniones: no hay forma de ver de un vistazo
cuáles están libres en cada momento.

### 1.2 Solución

Un sistema de reservas de salas con calendario de ocupación: cada empleado ve qué salas están
libres u ocupadas y reserva la suya; un administrador de oficina da de alta las salas y ve todas
las reservas.

## 2. Usuarios y roles

- **Empleado**: reserva y cancela sus propias reservas; de las reservas de otros solo ve
  «ocupada», nunca quién la hizo.
- **Administrador de oficina**: da de alta las salas y ve todas las reservas de la oficina.

## 3. Módulos

- **Salas**: alta y datos de cada sala reservable.
- **Reservas**: crear, cancelar y consultar reservas de una sala.
- **Calendario de ocupación**: vista de qué salas están libres u ocupadas en un momento dado.

## 4. Fuera de alcance

<!-- sdd-template: pending -->

## 5. Glosario

- **Sala**: recurso reservable de la oficina, dado de alta por un administrador de oficina.
- **Reserva**: ocupación de una sala por un empleado en un rango horario; se cancela, nunca se
  borra (constitution, «Artículos de producto»).
- **Calendario de ocupación**: vista que muestra, para un día, qué salas están libres u ocupadas.
