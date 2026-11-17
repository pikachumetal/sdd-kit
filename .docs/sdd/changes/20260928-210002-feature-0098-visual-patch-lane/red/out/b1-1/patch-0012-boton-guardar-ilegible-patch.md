---
id: 20260928-214744-patch-0012-boton-guardar-ilegible
task: 0012
title: Patch — Botón Guardar ilegible en las fichas
type: patch
status: done
created: 2026-09-28
branch: feature/0012-boton-guardar-ilegible
commit: <hash>
---

# Patch 0012 — Botón Guardar ilegible en las fichas

## Capacidades

- Ninguna, porque ninguna capacidad describe el estilo de los botones (`order-sheets` solo dice que la ficha ofrece las acciones).

## 1. Síntoma

Reportado: «En las dos fichas el botón Guardar no se lee: sale el texto blanco sobre fondo blanco.»

Medido: coincide. En `pedido-detalle` y `albaran-detalle`, el botón `[data-accion=guardar]` (`.btn.btn-primario`) tenía `background: #fff` y `color: #fff`.

## 2. Causa raíz

El commit `bca86a7` («style: unificar el fondo de los botones») cambió en `styles/ficha.css` la regla `.btn-primario` de `background: #1f5fbf` a `background: #fff`, dejando `color: #fff`. Es la única regla que da color al botón primario, y las dos páginas la comparten, por eso falla en las dos. Evidencia: `git show bca86a7`.

## 3. Fix

- **Fichero(s)**: `styles/ficha.css`
- **Cambio**: `.btn-primario` recupera `background: #1f5fbf`, que es el valor anterior a `bca86a7`. `.btn` sigue con fondo blanco; `.btn-peligro` no cambia.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Estilo calculado de Guardar en `pedido-detalle` (Chromium, Playwright) | ✅ fondo `rgb(31, 95, 191)`, texto `rgb(255, 255, 255)` |
| 2 | Estilo calculado de Guardar en `albaran-detalle` (Chromium, Playwright) | ✅ fondo `rgb(31, 95, 191)`, texto `rgb(255, 255, 255)` |
| 3 | Captura de `pedido-detalle` en Chromium | `%TEMP%\patch-0012\pedido-detalle.png` (fuera de git) |
| 4 | Captura de `albaran-detalle` en Chromium | `%TEMP%\patch-0012\albaran-detalle.png` (fuera de git) |

Las capturas se han generado; el agente no ha podido abrirlas por falta de permiso de lectura, así que la comprobación visual queda para la validación de `sdd-end-patch`.
