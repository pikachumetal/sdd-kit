---
id: 20260928-211918-patch-0012-acciones-cabecera-derecha
task: 0012
title: Patch — Guardar y Cancelar de la cabecera en columna a la derecha
type: patch
status: done
created: 2026-09-28
branch: feature/0012-acciones-cabecera-derecha
commit: pendiente
---

# Patch 0012 — Guardar y Cancelar de la cabecera en columna a la derecha

## Capacidades

- Ninguna, porque ninguna capacidad describe la disposición de la cabecera; `order-sheets` solo dice qué acciones ofrece la ficha, y siguen siendo las mismas.

## 1. Síntoma

«Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas; es solo maquetación.»

## 2. Causa raíz

No es un fallo: es un ajuste de presentación. En `pages/pedido-detalle.html` y `pages/albaran-detalle.html` los tres botones son hijos directos de `.ficha-acciones`, que en `styles/ficha.css` es una fila (`display: flex; gap: 8px`). No hay contenedor donde apilar solo Guardar y Cancelar.

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `styles/ficha.css`
- **Cambio**: Guardar y Cancelar se envuelven en `div.ficha-acciones-columna` (flex en columna, `order: 1` para quedar en el borde derecho de la cabecera). Borrar queda en la fila, a su izquierda. Sin cambios en bindings, textos, `data-accion` ni JS.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Playwright (1000 px) en pedido y albarán: Guardar y Cancelar con la misma x (896,6), Guardar encima de Cancelar (y 33,9 / 70,9), borde derecho en 980 (borde de `.ficha`) | ✅ |
| 2 | Borrar sigue en la fila, a la izquierda de la columna (x 821,6) | ✅ |

Verificado por el agente con medidas de posición. Falta la validación del usuario (paso 0 de `sdd-end-patch`).
