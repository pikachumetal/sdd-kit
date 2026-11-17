---
id: 20261001-161243-patch-0012-cancelar-al-listado
task: 0012
title: Patch — Cancelar lleva al listado de pedidos
type: patch
solution: ticket
status: done
created: 2026-10-01
branch: feature/0012-cancelar-al-listado
commit: <hash>
---

# Patch 0012 — Cancelar lleva al listado de pedidos

## Capacidades

- Modificadas: `order-sheets` — Cancelar vuelve al listado de pedidos

## 1. Síntoma

Ticket VEN-31, cambio pedido por producto: «Cancelar tiene que llevar al listado de pedidos». Medido antes del cambio: en `pedido-detalle` y `albaran-detalle`, pulsar Cancelar no hace nada (la URL no cambia).

## 2. Causa raíz (solución fijada, petición cerrada)

Solución fijada por el ticket VEN-31: «en app.js, un listener de click en [data-accion="cancelar"] que haga location.assign('../index.html'), en las dos fichas».

Lo que da por existente, comprobado: ambas fichas tienen `<button data-accion="cancelar">` y cargan `../app.js`; `index.html` existe en la raíz y su título es «Pedidos»; `../index.html` se resuelve desde `pages/`. Ningún código enlaza hoy el botón.

## 3. Fix

- **Fichero(s)**: `app.js`
- **Cambio**: un listener de click por cada `[data-accion="cancelar"]` que hace `location.assign('../index.html')`. Las plantillas no se tocan: el selector ya cubre las dos fichas.
- **Decisiones**:
  - Selector, destino y mecanismo (`location.assign`) — ticket

## 4. Verificación

El proyecto no tiene tests automáticos (`tech-stack.md`); la verificación es en navegador real (Chromium, Playwright 1.63.0, script en `%TEMP%\ven31-verify.js`, fuera de git).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Antes del cambio, Cancelar en `pedido-detalle` y `albaran-detalle` | ✅ se queda en la ficha (la petición no estaba cumplida) |
| 2 | Después, Cancelar en `pedido-detalle` | ✅ termina en `index.html`, título «Pedidos», 0 errores de página |
| 3 | Después, Cancelar en `albaran-detalle` | ✅ termina en `index.html`, título «Pedidos», 0 errores de página |
| 4 | El total de línea sigue siendo `36,26 €` en ambas | ✅ |

Validación pendiente del usuario (`sdd-end-patch`).

## 6. Delta de capacidad

### Capacidad: `order-sheets`

**MODIFIED — La ficha ofrece guardar, cancelar y borrar**
- GIVEN una ficha de pedido o de albarán
- WHEN se abre
- THEN ofrece las acciones Guardar, Cancelar y Borrar
- AND al pulsar Cancelar se vuelve al listado de pedidos
