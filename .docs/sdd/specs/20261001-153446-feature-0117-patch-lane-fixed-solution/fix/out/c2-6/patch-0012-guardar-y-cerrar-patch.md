---
id: 20261001-172142-patch-0012-guardar-y-cerrar
task: 0012
title: Patch — «Guardar y cerrar» a la derecha en las dos fichas
type: patch
solution: dev-lead
status: done
created: 2026-10-01
branch: feature/0012-guardar-y-cerrar
commit: pendiente
---

# Patch 0012 — «Guardar y cerrar» a la derecha en las dos fichas

## Capacidades

- Modificadas: `order-sheets` — la acción «Guardar» pasa a llamarse «Guardar y cerrar» y se ofrece a la derecha

## 1. Síntoma

Petición del dev-lead, literal: «Cambia «Guardar» por «Guardar y cerrar» y ponlo a la derecha, en las dos fichas.»

## 2. Solución fijada (petición cerrada)

- Texto: «Guardar y cerrar» — dev-lead, literal.
- Posición: «a la derecha» — dev-lead. Hoy `Guardar` es el primero (más a la izquierda) del grupo de acciones; pasa a ser el último (más a la derecha). Es la única lectura que mueve algo.
- Alcance: «en las dos fichas» → `pages/pedido-detalle.html` y `pages/albaran-detalle.html`.
- Comprobado que existe lo que da por existente: el botón `data-accion="guardar"` con el texto `Guardar` está en las dos páginas (`grep Guardar`); no hay otras apariciones en el código (`index.html`, `app.js`, `ficha.css`).

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`
- **Cambio**: el botón `guardar` cambia su texto a «Guardar y cerrar» y pasa de primero a último en `.ficha-acciones`. Sin CSS nuevo: el grupo ya va alineado a la derecha de la cabecera.
- **Decisiones**:
  - «Guardar y cerrar» como texto literal — dev-lead
  - «A la derecha» = último del grupo de acciones, tras Borrar — dev-lead
  - Se conservan `data-accion="guardar"` y la clase `btn-primario` — sin el dev-lead (no se ven; el identificador no se renombra porque nada lo lee)
  - Nota: `app.js` no tiene manejador para ningún botón de `data-accion`, así que el «cerrar» del texto no cambia ningún comportamiento: hoy ninguna acción hace nada. Cuando se implemente guardar, deberá cerrar la ficha.

## 4. Verificación

Sin tests automáticos en el proyecto (`tech-stack.md`): verificación en navegador real (Chromium con `playwright` 1.63.0, viewport 1280x800), medida de la posición x de cada botón.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `pedido-detalle`, antes → después | ✅ `Guardar@875, Cancelar@962, Borrar@1053` → `Cancelar@826, Borrar@917, Guardar y cerrar@992` |
| 2 | `albaran-detalle`, antes → después | ✅ idéntico al anterior |
| 3 | capturas antes y después, fuera de git | `%TEMP%\pw-0012\{pedido,albaran}-detalle-{antes,despues}.png` · enseñadas en la validación |
| 4 | detector de `§Frontend` | composición no medida: `tech-stack.md` no declara detector en §Frontend |

## 6. Delta de capacidad

### Capacidad: `order-sheets`

**MODIFIED — La ficha ofrece guardar, cancelar y borrar**
- GIVEN una ficha de pedido o de albarán
- WHEN se abre
- THEN ofrece las acciones Cancelar, Borrar y Guardar y cerrar, en ese orden de izquierda a derecha
