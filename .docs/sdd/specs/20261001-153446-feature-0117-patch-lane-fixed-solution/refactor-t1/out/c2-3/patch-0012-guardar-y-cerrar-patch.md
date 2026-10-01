---
id: 20261001-164724-patch-0012-guardar-y-cerrar
task: 0012
title: Patch — «Guardar» pasa a «Guardar y cerrar» y a la derecha
type: patch
solution: dev-lead
status: done
created: 2026-10-01
branch: feature/0012-guardar-y-cerrar
commit: pendiente
---

# Patch 0012 — «Guardar» pasa a «Guardar y cerrar» y a la derecha

## Capacidades

- Modificadas: `order-sheets` — el botón Guardar pasa a llamarse «Guardar y cerrar» y se coloca a la derecha

## 1. Síntoma

Petición (literal): «Cambia «Guardar» por «Guardar y cerrar» y ponlo a la derecha, en las dos fichas.»

## 2. Solución fijada (petición cerrada)

- Solución fijada, del dev-lead: «Cambia «Guardar» por «Guardar y cerrar» y ponlo a la derecha, en las dos fichas.» El texto literal y la posición los fija la petición.
- Lo que da por existente, comprobado: `pages/pedido-detalle.html` y `pages/albaran-detalle.html` tienen un único botón `data-accion="guardar"` con el texto «Guardar», el primero de `.ficha-acciones` (Guardar, Cancelar, Borrar).
- Sin tests en el proyecto (`tech-stack.md`): no hay test en RED.

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`
- **Cambio**: el botón pasa a ser el último de `.ficha-acciones` y su texto a «Guardar y cerrar». Sin cambios de CSS, de `app.js` ni de `data-accion`.
- **Decisiones**:
  - «A la derecha» = último de la fila de acciones (Cancelar, Borrar, Guardar y cerrar); el grupo ya estaba pegado al borde derecho de la cabecera — dev-lead
  - Solo cambia el texto: el botón no tiene manejador en `app.js` (ni antes ni ahora), así que «cerrar» no añade comportamiento — dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de cada ficha en Chromium (Playwright 1.63, 1280x800), antes y después | `C:\tmp\shots\antes-pedido-detalle.png`, `antes-albaran-detalle.png`, `despues-pedido-detalle.png`, `despues-albaran-detalle.png` (fuera de git) · orden de botones tras el cambio: Cancelar, Borrar, Guardar y cerrar en las dos |
| 2 | detector de `§Frontend` | composición no medida: `tech-stack.md` no declara detector en §Frontend |

## 6. Delta de capacidad

### Capacidad: `order-sheets`

**MODIFIED — La ficha ofrece guardar, cancelar y borrar**
- GIVEN una ficha de pedido o de albarán
- WHEN se abre
- THEN ofrece las acciones Cancelar, Borrar y «Guardar y cerrar», esta última a la derecha
