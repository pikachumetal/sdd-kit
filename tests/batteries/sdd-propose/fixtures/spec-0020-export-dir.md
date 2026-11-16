---
id: 20261008-180000-feature-0020-export-dir
feature: 0020
title: La exportación escribe en out/
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — La exportación escribe en out/

## Capacidades

- Modificadas: `export` — los ficheros exportados van a `out/` y no a la raíz.

## ✋ Decisiones que he tomado yo — valida estas

1. La carpeta se fija en `config.json`: `"base": "."` pasa a `"base": "./out"`.

## Intent

Hoy `exportar` deja los ficheros en la raíz del repo y se mezclan con el código. Tienen que ir a `out/`.

## Scope

- Entra: `config.json`, la clave `base`.
- No entra: el formato de los ficheros exportados.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `"base": "."` | `config.json:2` | Scope |

## Dónde se prueba

- La carpeta: por `run('exportar', …)`, en `test/export.test.js`.

## Delta de comportamiento

### Capacidad: `export`

#### MODIFIED — Exportar las reservas

- GIVEN la reserva de Norte del lunes
- WHEN `exportar`
- THEN escribe `out/reservas.csv` con `Norte,lun,10:00-12:00`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
