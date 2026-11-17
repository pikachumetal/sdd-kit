---
id: 20261001-161025-patch-0012-cancelar-vuelve-al-listado
task: 0012
title: Patch — Cancelar vuelve al listado de pedidos
type: patch
solution: ticket
status: done
created: 2026-10-01
branch: feature/0012-cancelar-vuelve-al-listado
commit: <hash>
---

# Patch 0012 — Cancelar vuelve al listado de pedidos

## Capacidades

- Modificadas: `order-sheets` — «La ficha ofrece guardar, cancelar y borrar» añade que Cancelar lleva al listado de pedidos

## 1. Síntoma

Ticket VEN-31 (cambio pedido por producto): «Cancelar tiene que llevar al listado de pedidos». Hoy el botón `data-accion="cancelar"` de las dos fichas no hace nada: `app.js` no tiene ningún manejador de ese botón.

## 2. Solución fijada

- **Frase literal del ticket VEN-31 (autor: ticket)**: «en app.js, un listener de click en [data-accion="cancelar"] que haga location.assign('../index.html'), en las dos fichas».
- **Lo que da por existente, comprobado**: `index.html` (título «Pedidos», listado de pedidos) existe en la raíz, y `pages/pedido-detalle.html` y `pages/albaran-detalle.html` llevan `data-accion="cancelar"` y cargan `../app.js`, así que `../index.html` resuelve desde `pages/`.

## 3. Fix

- **Fichero(s)**: `app.js`
- **Cambio**: un listener de click sobre cada `[data-accion="cancelar"]` que hace `location.assign('../index.html')`. Sirve a las dos fichas porque comparten `app.js`; no se toca ningún `.html`.
- **Decisiones**:
  - destino `../index.html`, listener en `app.js`, en las dos fichas — ticket

## 4. Verificación

El proyecto no tiene tests automáticos (`tech-stack.md`): la verificación es en navegador real (Chromium, `playwright` 1.63.0).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `pedido-detalle.html`: clic en Cancelar | ✅ navega a `index.html` («Pedidos») |
| 2 | `albaran-detalle.html`: clic en Cancelar | ✅ navega a `index.html` («Pedidos») |

Script de verificación fuera de git: `%TEMP%\ven31\t.js`.

## 6. Delta de capacidad

### Capacidad: `order-sheets`

**MODIFIED — La ficha ofrece guardar, cancelar y borrar**
- GIVEN una ficha de pedido o de albarán
- WHEN se abre
- THEN ofrece las acciones Guardar, Cancelar y Borrar
- AND al pulsar Cancelar se vuelve al listado de pedidos
