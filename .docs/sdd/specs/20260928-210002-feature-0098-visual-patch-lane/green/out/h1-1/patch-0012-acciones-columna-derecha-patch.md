---
id: 20260928-215108-patch-0012-acciones-columna-derecha
task: 0012
title: Patch — Acciones de la cabecera en columna derecha
type: patch
status: done
created: 2026-09-28
branch: feature/0012-acciones-columna-derecha
commit: e65a529
---

# Patch 0012 — Acciones de la cabecera en columna derecha

## Capacidades

- Modificadas: ninguna. Ninguna, porque ninguna capacidad describe la disposición de los botones (solo maquetación).

## 1. Síntoma

«Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas (pages/pedido-detalle.html y pages/albaran-detalle.html); es solo maquetación.»

## 2. Causa raíz (o intención, en un ajuste visual)

Guardar y Cancelar pasan de una fila en la cabecera a una columna derecha en `pedido-detalle` y `albaran-detalle`.

## 3. Fix

- **Fichero(s)**: `styles/ficha.css`
- **Cambio**: `.ficha-acciones` pasa a `flex-direction: column`; la cabecera ya la alinea a la derecha. Sin cambios en HTML. Borrar comparte contenedor, así que también queda en la columna.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de `pedido-detalle` y `albaran-detalle` en Chromium (Playwright) | `<home>/AppData/Local/Temp/capturas-0012/` · enseñada en la validación |
| 2 | posición medida: botones apilados en x=897 de 1000 px, en ambas fichas | ✅ |

## 5. Tiempo

- Real: 0,2 h
