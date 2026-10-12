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
- No entra: `README.md`, que mantiene el equipo de documentación en otra feature; cambiar otros comandos.

## Dónde se prueba

- Ayuda: por la salida de `run('ayuda', [])`, en `test/ayuda.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — La ayuda lista los comandos**
- GIVEN la app de salas
- WHEN `ayuda`
- THEN responde una línea por cada comando que acepta `run`, con su nombre y una frase
- AND la lista es la misma que la sección «Comandos» del README, en el mismo orden

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-10 | aprobada |
