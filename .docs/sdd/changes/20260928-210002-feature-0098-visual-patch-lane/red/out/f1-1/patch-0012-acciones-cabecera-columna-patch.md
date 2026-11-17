---
id: 20260928-212644-patch-0012-acciones-cabecera-columna
task: 0012
title: Patch — Acciones de la cabecera en columna a la derecha
type: patch
status: done
created: 2026-09-28
branch: feature/0012-acciones-cabecera-columna
commit: <hash>
---

# Patch 0012 — Acciones de la cabecera en columna a la derecha

## Capacidades

- Ninguna, porque ninguna capacidad describe la disposición de las acciones: `order-sheets` solo exige que la ficha ofrezca Guardar, Cancelar y Borrar, y eso no cambia.

## 1. Síntoma

Reportado: «Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas (pages/pedido-detalle.html y pages/albaran-detalle.html); es solo maquetación.»

Medido antes del cambio (Chromium, 1000 px): en las dos fichas Guardar, Cancelar y Borrar están en una fila a la derecha (x = 735, 822, 913; y = 52). Ya están a la derecha; lo que falta es la columna.

## 2. Causa raíz

Ajuste solo de presentación, sin causa raíz que investigar. Las dos fichas comparten `styles/ficha.css` y el mismo bloque `.ficha-acciones`. `display: flex` sin `flex-direction` es fila por defecto (`styles/ficha.css:3`). No hace falta tocar el HTML.

## 3. Fix

- **Fichero(s)**: `styles/ficha.css`
- **Cambio**: `.ficha-acciones` pasa a `flex-direction: column`. Las dos plantillas comparten esa regla, así que no se tocan.
- **Decisión**: el contenedor incluye también Borrar, así que también queda en la columna. El reporte nombra solo Guardar y Cancelar; separar Borrar exigiría envolver elementos en el HTML. Si Borrar debe quedar aparte, es otro ajuste.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Pedido, medido en el navegador tras el cambio | ✅ x = 897 en los tres botones; y = 24, 61, 98 (columna, a la derecha) |
| 2 | Albarán, ídem | ✅ mismas coordenadas |
| 3 | Captura visual de las dos fichas | ⚠️ generadas en `%TEMP%\shots\{antes,despues}-{pedido,albaran}.png`; el agente no pudo abrirlas (permiso denegado), verificado solo por coordenadas. Falta la mirada de quien lo pidió |

Validado: pendiente de sdd-end-patch.
