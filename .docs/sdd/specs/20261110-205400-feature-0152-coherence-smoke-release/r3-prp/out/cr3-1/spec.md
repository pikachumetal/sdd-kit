---
id: 20261008-130000-feature-0028-close-notice-pending
feature: 0028
title: El aviso de cierre dice qué queda pendiente
mode: full
profile: delegate
status: approved
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: 2026-10-08
---

# Spec — El aviso de cierre dice qué queda pendiente

Validación: agente — solo cambia una skill.

## Capacidades

- Ninguna, porque es una skill del propio repo.

## ✋ Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que quedaba una fila abierta.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` dice qué queda pendiente.
- Entra, si el RED lo exhibe: el paso 2 de esa skill repite lo pendiente antes de correr el gate.
- No entra: el roadmap.

## Dónde se prueba

- El paso 1: `c1`, en un molde sin lista de pendientes.
- El paso 2: `c2`, RED con n = 3 antes de escribirlo.

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra lo pendiente

- GIVEN un cierre en un molde sin lista de pendientes
- WHEN se avisa
- THEN el aviso nombra lo pendiente sacándolo del roadmap

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `c1` × 2 y `c2` × 3 | 3,50 |
| GREEN | `c1` × 2 y `c2` × 2 | 2,80 |
| Suma | 9 | 6,30 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | 2026-10-08 | aprobada |
