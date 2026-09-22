---
id: 20260922-090000-task-0008-booking-code-search
task: 0008
title: Buscar una reserva por su código
mode: full
status: draft
created: 2026-09-22
author: agente
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Buscar una reserva por su código

## Decisiones que he tomado yo — valida estas

1. El buscador reconoce un código de reserva con la expresión `^(?:[A-Za-z]+-)?R-\d{4}$`, sin distinguir mayúsculas; si la consulta encaja, busca por código en vez de por cliente — es la forma del código que fija la capacidad `bookings`, con el prefijo de sede opcional para cubrir también las importadas.
2. El prefijo de sede es genérico (letras seguidas de guion), no solo `MAD-`: la regex de la decisión 1 no enumera sedes, así que una reserva importada de cualquier sede se reconoce igual sin tocar el buscador cuando se añadan sedes nuevas.
3. Búsqueda por código exacta, sin distinguir mayúsculas — un código parcial no identifica una reserva.
4. Sin capacidad nueva: el delta va a `bookings`.

## Intent

Hoy la recepción solo busca por nombre de cliente, y con dos clientes del mismo nombre tarda más de lo que el cliente espera en el mostrador. El código de reserva está impreso en el justificante: buscar por él es inmediato.

## Scope

- Entra: reconocer un código de reserva en el buscador, propio o importado; búsqueda exacta por código.
- No entra: cambiar la forma del código; búsqueda por fecha.

## Approach

El buscador decide el modo por la forma de la consulta: si encaja con `^(?:[A-Za-z]+-)?R-\d{4}$` busca por código; si no, por cliente como hoy. Esto reemplaza el filtro actual de `src/search.js` (case-insensitive por substring sobre `booking.customer`), que no tiene ningún campo `code` todavía.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Búsqueda por código**
- GIVEN reservas propias e importadas de la otra sede
- WHEN el recepcionista escribe un código de reserva completo, propio (`R-0042`) o importado (`MAD-R-0042`)
- THEN ve solo la reserva con ese código
- AND la búsqueda no distingue mayúsculas (`r-0042` encuentra `R-0042`)

**ADDED — Consulta que no es un código**
- GIVEN reservas de varios clientes
- WHEN el recepcionista escribe un texto que no encaja con `^(?:[A-Za-z]+-)?R-\d{4}$`
- THEN se busca por cliente, como en «Búsqueda por cliente»

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
