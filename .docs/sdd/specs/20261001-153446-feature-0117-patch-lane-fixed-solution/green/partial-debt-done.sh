#!/usr/bin/env bash
# Escenario e1: un patch implementado que salda solo una parte de una fila de deuda, listo para sdd-end-patch.
# Se carga desde subject.sh tras ventas_base; validation.mode: field para que el cierre no pare a pedir la validación.

partial_debt_done() {
  sed -i 's|"execution": "auto"}|"execution": "auto", "validation": {"mode": "field"}}|; s|"version": "2.2.0"|"version": "2.3.0"|' "$R/.docs/sdd/sdd-kit.json"
  cat >> "$R/.docs/sdd/roadmap.md" <<'EOF'

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| **Fichas con dos defectos de presentación del total**: (a) el total con IVA de la línea no se redondea a céntimos; (b) la ficha no muestra el total del pedido, solo el de cada línea | Bajo — totales con más decimales de los que se cobran | **Actuar**: (a) con un patch, (b) con una feature |
EOF
  sed -i 's|return Math.round(quantity \* price \* (1 + vat) \* 100) / 100;|return Math.round(quantity * price) * (1 + vat);|' "$R/app.js"
  commit "docs(sdd): deuda de los totales de la ficha" "Dos defectos en una fila; el total de la línea redondea antes del IVA."
  g checkout -q -b feature/0012-total-linea-centimos
  sed -i 's|return Math.round(quantity \* price) \* (1 + vat);|return Math.round(quantity * price * (1 + vat) * 100) / 100;|' "$R/app.js"
  local dir=".docs/sdd/specs/20261001-090000-patch-0012-total-linea-centimos"
  put "$dir/patch.md" <<'EOF'
---
id: 20261001-090000-patch-0012-total-linea-centimos
task: 0012
title: Patch — el total de la línea se redondea a céntimos
type: patch
solution: causa raíz
status: done
created: 2026-10-01
branch: feature/0012-total-linea-centimos
commit: <hash>
---

# Patch 0012 — el total de la línea se redondea a céntimos

## Capacidades

- Ninguna, porque el fix devuelve el total de la línea a lo que ya dice `order-sheets`

## 1. Síntoma

Parte (a) de la fila de deuda «Fichas con dos defectos de presentación del total»: el total con IVA de la línea no se redondea a céntimos.

## 2. Causa raíz

`lineTotal` redondeaba antes de aplicar el IVA. Se redondea el importe con IVA a céntimos.

## 3. Fix

- **Fichero(s)**: `app.js`
- **Cambio**: `lineTotal` redondea el importe con IVA a céntimos. Salda la parte (a) de la fila de deuda; la (b) sigue abierta.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | 3 × 9,99 € con IVA del 21 % → `36,26 €` | ✅ abierto en Chromium |

## 5. Tiempo (ligero)

- Real: 0,3h
EOF
  g add -A
  g commit -q -m "fix(order-sheets): redondear a céntimos el total de la línea" -m "Parte (a) de la fila de deuda de los totales."
}
