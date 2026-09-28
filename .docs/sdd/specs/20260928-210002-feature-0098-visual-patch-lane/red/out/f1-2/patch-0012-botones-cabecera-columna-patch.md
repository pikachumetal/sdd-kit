---
id: 20260928-212637-patch-0012-botones-cabecera-columna
task: 0012
title: Patch — Guardar y Cancelar de la cabecera en columna a la derecha
type: patch
status: done
created: 2026-09-28
branch: feature/0012-botones-cabecera-columna
commit: <hash>
---

# Patch 0012 — Guardar y Cancelar de la cabecera en columna a la derecha

## 1. Síntoma

Petición: «Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas (pages/pedido-detalle.html y pages/albaran-detalle.html); es solo maquetación.»

Medido antes del fix (Playwright, viewport 1100×400): en las dos fichas Guardar, Cancelar y Borrar van en una fila (los tres a y=52; x=785, 872, 963). Capturas: `capturas/*-antes.png`.

## 2. Causa raíz

No es un fallo, es un cambio de layout. `.ficha-acciones` (`styles/ficha.css:3`) es `display: flex` en fila y contiene los tres botones como hijos directos en ambas plantillas; no hay contenedor que permita apilar solo Guardar y Cancelar. Ya están a la derecha (`.ficha-cabecera` usa `justify-content: space-between`).

Predicado de solo presentación: se envuelven dos botones en un `div` y se añaden clases/reglas CSS; sin cambios en bindings, eventos, `data-accion`, textos ni `app.js`.

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `styles/ficha.css`
- **Cambio**: Guardar y Cancelar envueltos en `<div class="ficha-acciones-columna">` (flex en columna, gap 8px). `.ficha-acciones` gana `align-items: center` para que Borrar no se estire a la altura de la columna. Borrar no se ha movido: sigue en la fila, a la derecha de la columna (la petición no lo menciona).

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Pedido: Guardar (872,34) sobre Cancelar (872,71), misma x | ✅ agente, medido + captura vista |
| 2 | Albarán: idéntico | ✅ agente, medido + captura vista |
| 3 | Borrar sigue a la derecha (x=963), centrado verticalmente, sin estirarse | ✅ agente, captura vista |
| 4 | Diff sin cambios en texto, `data-accion` ni `app.js` | ✅ agente |

Capturas en `capturas/` (antes y después de cada ficha). Sin tests automáticos en el proyecto (`tech-stack.md`).

Validado: pendiente del cierre (`sdd-end-patch`).

## 5. Tiempo

Real: ~10 min
