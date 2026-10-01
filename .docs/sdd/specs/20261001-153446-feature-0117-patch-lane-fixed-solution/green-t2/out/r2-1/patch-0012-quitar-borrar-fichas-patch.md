---
id: 20261001-170305-patch-0012-quitar-borrar-fichas
task: 0012
title: Patch — Quitar Borrar de las fichas y Guardar/Cancelar en columna derecha
type: patch
solution: dev-lead
status: done
created: 2026-10-01
branch: feature/0012-quitar-borrar-fichas
commit: <hash>
---

# Patch 0012 — Quitar Borrar de las fichas y Guardar/Cancelar en columna derecha

## Capacidades

- Modificadas: `order-sheets` — la ficha deja de ofrecer Borrar y coloca Guardar y Cancelar en una columna a la derecha

## 1. Síntoma

Petición del dev-lead, literal: «Quita Borrar de las dos fichas (pages/pedido-detalle.html y pages/albaran-detalle.html) y pon Guardar y Cancelar en una columna a la derecha.»

## 2. Causa raíz (intención)

Ajuste de presentación con retirada: Borrar desaparece de `pedido-detalle` y `albaran-detalle`, y Guardar y Cancelar pasan de la cabecera a una columna a la derecha del cuerpo de la ficha. Solución fijada por el dev-lead; no hay fallo que reproducir.

Existe lo que la petición da por existente: ambas páginas tienen los tres botones en `.ficha-acciones` dentro de `.ficha-cabecera`.

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `styles/ficha.css`
- **Cambio**: se quita el botón Borrar; las acciones salen de la cabecera y se colocan en un contenedor `.ficha-contenido` (flex) junto a `.ficha-cuerpo`, con `.ficha-acciones` en columna.
- **Decisiones**:
  - Guardar encima de Cancelar, a la derecha de la tabla, alineadas arriba — dev-lead («en una columna a la derecha»; el orden es el que ya tenían)
- **Retirado**: botón Borrar (`data-accion="borrar"`) en las dos fichas y la regla `.btn-peligro` de `ficha.css`, que solo usaba ese botón · Lo que el usuario deja de poder hacer: borrar un pedido o un albarán desde su ficha.
  - Sin otros usos: `grep` de `btn-peligro` y `data-accion` fuera de `pages/` solo daba `ficha.css:6`; `app.js` no tiene manejadores de acciones; no hay textos ni claves de i18n ni datos que migrar.

## 4. Verificación

Sin tests automáticos (`tech-stack.md`). Capturas con Playwright, 1280x800 y 390x844, fuera de git en `%TEMP%\patch-0012\` (`<pantalla>-<desktop|mobile>-antes.png` y `-despues.png`, para `pedido-detalle` y `albaran-detalle`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Capturas de `pedido-detalle` y `albaran-detalle` en Chromium (Playwright), antes y después | `%TEMP%\patch-0012\*-antes.png` / `*-despues.png` · enseñadas en la validación. El agente no pudo abrir las imágenes: la composición se comprobó midiendo cajas en el DOM |
| 2 | Medidas en el DOM, después (ambas pantallas) | Borrar ausente · 1280x800: tabla x 160–1021, Guardar y Cancelar x 1037–1120 (y 123 y 160), a la derecha de la tabla · 390x844: tabla x 8–283, botones x 299–382 · sin desbordamiento horizontal ni errores de consola · total `36,26 €` intacto |
| 3 | Detector de `§Frontend` | composición no medida: `tech-stack.md` no declara detector en §Frontend |

## 6. Delta de capacidad

### Capacidad: `order-sheets`

**REMOVED — La ficha ofrece guardar, cancelar y borrar**
- motivo: Borrar se retira de las fichas; el requisito se sustituye por el siguiente.

**ADDED — La ficha ofrece guardar y cancelar en una columna a la derecha**
- GIVEN una ficha de pedido o de albarán
- WHEN se abre
- THEN ofrece las acciones Guardar y Cancelar, en columna a la derecha del cuerpo, y no ofrece Borrar
