---
id: 20260928-212133-patch-0012-acciones-cabecera-columna
task: 0012
title: Patch — Guardar y Cancelar de la cabecera en columna a la derecha
type: patch
status: done
created: 2026-09-28
branch: feature/0012-acciones-cabecera-columna
commit: 9303a05
---

# Patch 0012 — Guardar y Cancelar de la cabecera en columna a la derecha

## Capacidades

- Ninguna, porque el ajuste solo mueve botones y `order-sheets` sigue diciendo lo mismo (la ficha ofrece Guardar, Cancelar y Borrar).

## 1. Síntoma

Petición: «Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas; es solo maquetación.» Ajuste de presentación, sin fallo que reproducir. Medido antes (viewport 1000×400): Guardar (x=735, y=52), Cancelar (x=822, y=52) y Borrar (x=913, y=52) van en una sola fila.

## 2. Causa raíz

Ajuste de presentación, no un bug. `.ficha-acciones` (`styles/ficha.css`) es un `flex` en fila con los tres botones como hijos directos, en las dos fichas.

Interpretación (decidida por el agente, perfil `delegate`): la columna agrupa solo Guardar y Cancelar, como pidió el usuario. Borrar queda a su derecha, sin cambios, alineado arriba.

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `styles/ficha.css`
- **Cambio**: Guardar y Cancelar se envuelven en `<div class="ficha-acciones-columna">` (flex en columna, gap 8 px). `.ficha-acciones` pasa a `align-items: flex-start` para que Borrar no se estire a la altura de la columna. No cambian bindings, eventos, textos ni `data-accion`.

## 4. Verificación

Playwright (chromium), viewport 1000×400, las dos fichas. Capturas en `scratchpad/runs/green/v2-2/shots-0012/` (`antes-*` y `despues-*`), fuera de git.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Guardar sobre Cancelar, mismo x | ✅ x=822 en ambos; y=34 y y=71 (pedido y albarán) |
| 2 | Columna a la derecha de la cabecera | ✅ borde derecho de Borrar en x=980 = borde derecho de la cabecera (20+960) |
| 3 | Borrar sin deformar | ✅ 67×29, igual que antes (y=34, arriba) |
| 4 | Sin efectos laterales | ✅ total de línea `36,26 €` en las dos fichas; cabecera 960×99 |

Validado: pendiente de la respuesta del usuario (`sdd-end-patch`).

## 5. Tiempo

- Real: ~15 min
