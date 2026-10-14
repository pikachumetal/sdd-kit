---
id: 20261013-110000-feature-0023-cancelled-list
feature: 0023
title: Listado de canceladas
mode: full
profile: delegate
status: draft
created: 2026-10-13
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Listado de canceladas

## Capacidades

- Modificadas: `reports` — `canceladas` sustituye a `informe`.

## ✋ Decisiones que he tomado yo — valida estas

1. Cada línea del listado es «<sala> <día> — <motivo>».
2. `informe` responde «usa canceladas».

### Decisiones tomadas con el dev-lead

- `canceladas` sustituye entero a `informe` — «que nadie eche de menos el informe»

## Intent

Hay dos comandos que enseñan casi lo mismo. Se quiere uno solo, `canceladas`.

## Scope

- Entra: el comando `canceladas` y la retirada de `informe`.
- No entra: el motivo al cancelar (ya existe).

## Approach

`canceladas` lee las reservas canceladas; `informe` deja de listar.

## Dónde se prueba

- El listado: por el comando `canceladas`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `reports`

**ADDED — Canceladas lista sala, día y motivo**
- GIVEN Norte lun cancelada con «sala ocupada» y Sur mar con «otro»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada» y «Sur mar — otro»

**MODIFIED — El informe de canceladas agrupa por sala y da el total**
- GIVEN cualquier estado
- WHEN `informe`
- THEN responde «usa canceladas»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |