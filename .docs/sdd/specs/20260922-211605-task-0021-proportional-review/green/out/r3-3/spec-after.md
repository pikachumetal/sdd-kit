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

Review de spec propuesta: ninguna — señales: área no explorada (no he releído en esta sesión el código actual del buscador de reservas)
- Mínimo razonable: ninguna — deja sin cubrir una revisión adversarial contra el código real; el repaso de coherencia manual ya encontró y corrigió una contradicción (ver hallazgo más abajo).

### Hallazgos de la review

**Aceptado** — la regex de detección `^R-\d{4}$` (decisión 1, Approach, escenario 2) no matchea el código importado `MAD-R-0042` que exige `capabilities/bookings.md` y la decisión 2, así que una búsqueda por código importado caería en "no es un código" y buscaría por cliente → cambiada a `^(?:[A-Z]+-)?R-\d{4}$` en las tres apariciones (decisión 1, Approach, escenario 2).

1. El buscador reconoce un código de reserva con la expresión `^(?:[A-Z]+-)?R-\d{4}$` (sin distinguir mayúsculas) y, si la consulta encaja, busca por código en vez de por cliente — cubre tanto el código propio (`R-0042`) como el importado con prefijo de sede (`MAD-R-0042`), que es la forma que fija la capacidad `bookings`.
2. Los códigos de las reservas importadas de la otra sede (`MAD-R-0042`) también se reconocen como código — la recepción las atiende igual que las propias.
3. Búsqueda por código exacta, sin distinguir mayúsculas — un código parcial no identifica una reserva.
4. Sin capacidad nueva: el delta va a `bookings`.

## Intent

Hoy la recepción solo busca por nombre de cliente, y con dos clientes del mismo nombre tarda más de lo que el cliente espera en el mostrador. El código de reserva está impreso en el justificante: buscar por él es inmediato.

## Scope

- Entra: reconocer un código de reserva en el buscador, propio o importado; búsqueda exacta por código.
- No entra: cambiar la forma del código; búsqueda por fecha.

## Approach

El buscador decide el modo por la forma de la consulta: si encaja con `^(?:[A-Z]+-)?R-\d{4}$` (sin distinguir mayúsculas) busca por código; si no, por cliente como hoy.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Búsqueda por código**
- GIVEN reservas propias e importadas de la otra sede
- WHEN el recepcionista escribe un código de reserva completo, propio (`R-0042`) o importado (`MAD-R-0042`)
- THEN ve solo la reserva con ese código
- AND la búsqueda no distingue mayúsculas (`r-0042` encuentra `R-0042`)

**ADDED — Consulta que no es un código**
- GIVEN reservas de varios clientes
- WHEN el recepcionista escribe un texto que no encaja con `^(?:[A-Z]+-)?R-\d{4}$`
- THEN se busca por cliente, como en «Búsqueda por cliente»

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
