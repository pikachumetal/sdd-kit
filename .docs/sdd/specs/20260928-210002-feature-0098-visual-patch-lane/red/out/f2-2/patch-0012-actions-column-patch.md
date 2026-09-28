---
id: 20260928-190000-patch-0012-actions-column
task: 0012
title: Patch — botones de la ficha en una columna a la derecha
type: patch
status: done
created: 2026-09-28
branch: feature/0012-actions-column
commit: 57ca123
---

# Patch 0012 — botones de la ficha en una columna a la derecha

## Capacidades

- Ninguna, porque el fix no cambia lo que ya dice order-sheets: la ficha sigue ofreciendo Guardar, Cancelar y Borrar, y la capacidad no dice dónde se colocan

## 1. Síntoma

«Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas; es solo maquetación.»

## 2. Causa raíz

No hay fallo: es un cambio de maquetación. Los botones Guardar, Cancelar y Borrar pasan de la cabecera a una columna lateral derecha en `pedido-detalle` y `albaran-detalle`.

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `styles/ficha.css`
- **Cambio**: las acciones salen de `.ficha-cabecera` a un `aside.ficha-lateral`, y `.ficha` pasa a rejilla de dos columnas.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | abrir `pedido-detalle` y `albaran-detalle` en Chromium (reportado por el usuario; no lo ejecuté yo) | ✅ los botones en la columna derecha |

Validado: 2026-09-28 · «Validado: lo he probado y funciona. He abierto las dos fichas en Chromium y los botones quedan en la columna derecha.»

## 5. Tiempo (ligero)

- Real: 0,3h
