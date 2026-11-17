---
id: 20261001-161047-patch-0012-guardar-y-cerrar
task: 0012
title: Patch — «Guardar» pasa a «Guardar y cerrar» y a la derecha
type: patch
solution: dev-lead
status: done
created: 2026-10-01
branch: feature/0012-guardar-y-cerrar
commit: <hash>
---

# Patch 0012 — «Guardar» pasa a «Guardar y cerrar» y a la derecha

## Capacidades

- Modificadas: `order-sheets` — la acción Guardar pasa a llamarse «Guardar y cerrar» y va la última

## 1. Síntoma

Petición, literal: «Cambia «Guardar» por «Guardar y cerrar» y ponlo a la derecha, en las dos fichas.»

## 2. Solución fijada (petición cerrada)

- Frase literal del dev-lead: «Cambia «Guardar» por «Guardar y cerrar» y ponlo a la derecha, en las dos fichas.»
- Da por existente: el botón `data-accion="guardar"` en `pages/pedido-detalle.html` y `pages/albaran-detalle.html`. Comprobado: está en ambas, en la primera posición de `.ficha-acciones`.
- Antes del cambio, el grupo `.ficha-acciones` ya está a la derecha de la cabecera (`justify-content: space-between`) y «Guardar» era el botón más a la izquierda del grupo (x=875, en 1280x800). «A la derecha» se ha leído como el extremo derecho de ese grupo, tras «Borrar».

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`
- **Cambio**: el botón de guardar cambia su texto a «Guardar y cerrar» y pasa a ser el último de `.ficha-acciones`. Sin cambios en `data-accion`, en CSS ni en `app.js`: el botón no tiene manejador, así que «cerrar» no añade comportamiento.
- **Decisiones**:
  - Texto «Guardar y cerrar» — dev-lead
  - Posición a la derecha, en las dos fichas — dev-lead
  - Lectura de «derecha» como el extremo derecho del grupo de botones, no un cambio de zona de la cabecera — sin el dev-lead (no cambia lo que el usuario puede hacer; si quería otra cosa, que lo diga en la validación)

## 4. Verificación

El proyecto no tiene tests (`tech-stack.md`); se verifica abriendo las páginas en un navegador (Chromium con Playwright, 1280x800).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Orden y texto de los botones de `pedido-detalle` antes → después | ✅ `Guardar@875, Cancelar@962, Borrar@1053` → `Cancelar@826, Borrar@917, Guardar y cerrar@992` |
| 2 | Ídem en `albaran-detalle` | ✅ mismo resultado |
| 3 | Capturas antes y después de las dos pantallas, fuera de git | `%TEMP%\claude\…\scratchpad\capturas-0012\` (`antes-*.png`, `despues-*.png`) · se enseñan en la validación |
| 4 | Detector de `§Frontend` | composición no medida: `tech-stack.md` no declara detector en §Frontend |

## 6. Delta de capacidad

### Capacidad: `order-sheets`

**MODIFIED — La ficha ofrece guardar, cancelar y borrar**
- GIVEN una ficha de pedido o de albarán
- WHEN se abre
- THEN ofrece las acciones Cancelar, Borrar y «Guardar y cerrar», esta última a la derecha de las demás
