---
id: 20261009-110000-feature-0013-price-module
feature: 0013
title: Precio en su módulo
mode: full
profile: delegate
status: approved
created: 2026-10-09
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-09
---

# Spec — Precio en su módulo

## Capacidades

- Ninguna, porque refactor: `precio` responde lo mismo.

## Decisiones que he tomado yo — valida estas

1. El módulo es `src/price.js` y exporta `priceFor(room, day, hours)`, que devuelve el texto `<n> €` o `sala desconocida: <sala>`.

## Intent

Las tarifas van a crecer (0015, tarifas por temporada) y `run` ya mezcla el cálculo con el despacho de comandos. Se saca el cálculo a su módulo antes de tocarlo.

## Scope

- Entra: `src/price.js` con `priceFor`; `run('precio', …)` lo usa.
- No entra: tarifas nuevas, cambiar respuestas.

## Dónde se prueba

- Lo que responde `precio`: la suite existente, `test/price.test.js`, sin cambios.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-09 | aprobada |
