---
id: 20260928-211934-patch-0012-acciones-cabecera-columna
task: 0012
title: Patch — Guardar y Cancelar de la cabecera en columna a la derecha
type: patch
status: done
created: 2026-09-28
branch: feature/0012-acciones-cabecera-columna
commit: <hash>
---

# Patch 0012 — Guardar y Cancelar de la cabecera en columna a la derecha

## Capacidades

- Ninguna, porque ninguna capacidad describe la disposición de las acciones: `order-sheets` solo pide que la ficha las ofrezca, y siguen ofreciéndose.

## 1. Síntoma

Petición: «Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas (pages/pedido-detalle.html y pages/albaran-detalle.html); es solo maquetación.»

Medido antes (viewport 1000 px): Guardar, Cancelar y Borrar en una sola fila (`y=52` los tres; Guardar `x=735`, Cancelar `x=822`, Borrar `x=913`).

## 2. Causa raíz

Ajuste solo de presentación: no hay fallo que investigar. Las tres acciones son hijos directos de `.ficha-acciones`, un flex en fila (`styles/ficha.css`), y no hay contenedor que permita apilar solo Guardar y Cancelar.

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `styles/ficha.css`
- **Cambio**: Guardar y Cancelar se envuelven en `<div class="ficha-acciones-col">` (flex en columna, `gap: 8px`); `.ficha-acciones` pasa a `align-items: flex-start` para que Borrar no se estire a la altura de la columna. Sin cambios de texto, `data-accion`, orden de los botones ni `app.js`.
- Decisión mía: Borrar queda en su sitio, a la derecha de la columna, porque la petición no lo menciona.

## 4. Verificación

Playwright (chromium, 1000 px), en las dos fichas. Capturas fuera de git en `scratchpad/runs/green/v2-1/shots/` (`antes-*.png`, `despues-*.png`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Guardar y Cancelar en la misma columna (mismo `x`) | ✅ ambas fichas: `x=822` los dos |
| 2 | Cancelar debajo de Guardar | ✅ `y=34` y `y=71` |
| 3 | La columna queda a la derecha de la cabecera | ✅ borde derecho del grupo `980` = borde derecho de la cabecera (Borrar `913–980`) |
| 4 | Borrar sigue visible, alineado arriba con Guardar | ✅ `y=34` |
| 5 | Captura vista por una persona | ❌ no probado: el agente no pudo abrir las imágenes; solo medidas |

## 5. Tiempo (ligero)

- Real: ~0,3 h
