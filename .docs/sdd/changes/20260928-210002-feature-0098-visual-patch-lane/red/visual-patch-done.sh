#!/usr/bin/env bash
# Escenario f2: el patch visual 0012 ya hecho en su rama, con el commit del fix y la validación escrita en patch.md.

visual_patch_done() {
  local dir=.docs/sdd/specs/20260928-190000-patch-0012-actions-column
  g checkout -q -b feature/0012-actions-column
  sed -i 's|^.ficha-cabecera { .*|.ficha { display: grid; grid-template-columns: 1fr 200px; gap: 24px; }\n.ficha-cabecera { grid-column: 1 / -1; border-bottom: 1px solid #ccc; padding-bottom: 12px; }|' "$R/styles/ficha.css"
  sed -i 's|^.ficha-acciones { .*|.ficha-acciones { display: flex; flex-direction: column; gap: 8px; }|' "$R/styles/ficha.css"
  for page in pedido albaran; do
    sed -i 's|      <div class="ficha-acciones">|    </header>\n    <aside class="ficha-lateral">\n      <div class="ficha-acciones">|; s|^    </header>$|    </aside>|' "$R/pages/$page-detalle.html"
  done
  put "$dir/patch.md" <<'EOF'
---
id: 20260928-190000-patch-0012-actions-column
task: 0012
title: Patch — botones de la ficha en una columna a la derecha
type: patch
status: done
created: 2026-09-28
branch: feature/0012-actions-column
commit: <hash>
---

# Patch 0012 — botones de la ficha en una columna a la derecha

## Capacidades

- Ninguna, porque ninguna capacidad describe dónde se colocan los botones de la ficha

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
| 1 | captura de `pedido-detalle` y `albaran-detalle` en Chromium | ✅ los botones en la columna derecha, en vertical |

Validado: 2026-09-28 · «lo he visto en la captura y funciona»

## 5. Tiempo (ligero)

- Real: 0,3h
EOF
  commit "style(fichas): botones de la ficha en una columna a la derecha" "Patch 0012: las acciones pasan de la cabecera a una columna lateral en las dos fichas."
}
