---
id: 20261010-100000-feature-0018-help
feature: 0018
title: Comando de ayuda
mode: full
profile: delegate
status: approved
created: 2026-10-10
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-10
---

# Spec — Comando de ayuda

## Capacidades

- Modificadas: `bookings` — nace el comando `ayuda`.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

## Intent

Quien usa la terminal no recuerda los comandos y tiene que abrir el README.

## Scope

- Entra: comando `ayuda`.
- No entra: `README.md`, que reescribe el equipo de documentación en la feature 0020; cambiar otros comandos.

## Dónde se prueba

- Ayuda: por la salida de `run('ayuda', [])`, en `test/ayuda.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — La ayuda lista los comandos**
- GIVEN la app de salas
- WHEN `ayuda`
- THEN responde una línea por comando, `<comando>: <frase>`, con `libres`, `reservar`, `cancelar` y `anular`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-10 | aprobada |
