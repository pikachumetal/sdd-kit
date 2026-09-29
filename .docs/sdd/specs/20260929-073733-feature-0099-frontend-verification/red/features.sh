#!/usr/bin/env bash
# Features del molde `pedidos` a medio hacer: la 0015 (full, tres tasks) y la 0016 (lite). Se cargan tras mold.sh.

F15=".docs/sdd/specs/20260928-100000-feature-0015-order-summary"
F16=".docs/sdd/specs/20260928-110000-feature-0016-urgent-badge"

f15_docs() {
  put "$F15/spec.md" <<'EOF'
---
id: 20260928-100000-feature-0015-order-summary
feature: 0015
title: Resumen del pedido
mode: full
status: approved
created: 2026-09-28
---

# Spec — Resumen del pedido

## Intent

El comercial abre la ficha y no ve de un vistazo a quién es el pedido ni cuánto suma: una tarjeta de resumen arriba de la ficha.

## Delta de comportamiento

### Capacidad: `orders`

**ADDED — La ficha abre con un resumen del pedido**
- GIVEN el pedido 1042 de Ferretería López, pendiente de envío, por 1.240,00 €
- WHEN se abre `/pedidos/1042`
- THEN bajo la cabecera hay una tarjeta «Resumen» con el cliente, el total y el estado

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Dev Lead | 2026-09-28 | aprobada |
EOF
  put "$F15/plan.md" <<'EOF'
---
id: 20260928-100000-feature-0015-order-summary
feature: 0015
title: Plan de implementación — Resumen del pedido
spec: ./spec.md
status: approved
created: 2026-09-28
---

# Plan de implementación — Resumen del pedido

**Ejecución**: native, fijado en sdd-kit.json.

## 2. Tasks

### Task 1 — Los datos del resumen

**Superficies**: backend
**Verificación**: `node --test`

- `summaryOf(order)` en `views.mjs` devuelve `{ customer, total, status }`.

### Task 2 — La tarjeta de resumen en la ficha

**Superficies**: frontend
**Verificación**: `node --test`
**Verificación visual**: `/pedidos/1042` y `/pedidos/1042?theme=dark` · estados: normal, y `/pedidos/1043` con «Enviar» deshabilitado · temas claro y oscuro · qué mirar: la tarjeta muestra cliente, total y estado, bajo la cabecera y antes de la tabla
**Se prueba en la aplicación**: el comercial abre `/pedidos/1042` y ve la tarjeta «Resumen» con Ferretería López, 1.240,00 € y Pendiente de envío.

- `renderDetail` pinta `<section class="card">` con `<h2>Resumen</h2>` y los tres datos; estilo `.card` en `app.css`.

### Task 3 — El listado enlaza cada pedido con su resumen

**Superficies**: frontend
**Verificación**: `node --test`

- Cada fila del listado muestra el total junto al cliente.
EOF
}

f15_tasks() {
  put "$F15/tasks.md" <<EOF
# Tasks — Resumen del pedido (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Los datos del resumen | done | $1 | |
| 2 | La tarjeta de resumen en la ficha | $2 | $3 | $4 |
| 3 | El listado enlaza cada pedido con su resumen | $5 | $6 | |
EOF
}

f15_task1() {
  sed -i 's|^export function renderDetail|export const summaryOf = (order) => ({ customer: order.customer, total: order.total, status: order.status });\n\nexport function renderDetail|' "$R/views.mjs"
  cat >> "$R/tests/views.test.mjs" <<'EOF'

import { summaryOf } from '../views.mjs';

test('el resumen lleva cliente, total y estado', () => {
  assert.deepEqual(summaryOf(orders[0]), { customer: 'Ferretería López', total: '1.240,00 €', status: 'Pendiente de envío' });
});
EOF
  commit "feat(orders): datos del resumen del pedido" "Task 1 de la 0015."
}

f15_task2() {
  sed -i 's|^<table class="lineas">|${summaryCard(order)}\n<table class="lineas">|' "$R/views.mjs"
  sed -i 's|^export function renderDetail|const summaryCard = (order) => { const s = summaryOf(order); return `<section class="card"><h2>Resumen</h2><p>${s.customer}</p><p>${s.total}</p><p>${s.status}</p></section>`; };\n\nexport function renderDetail|' "$R/views.mjs"
  cat >> "$R/app.css" <<EOF
.card { border: 1px solid var(--border); border-radius: 8px; padding: $CARD_PADDING; margin: 16px 0; }
.card h2 { margin: 0; font-size: 18px; }
.card p { margin: 0; }
EOF
  cat >> "$R/tests/views.test.mjs" <<'EOF'

test('la ficha abre con la tarjeta de resumen', () => {
  const html = renderDetail(orders[0]);
  assert.match(html, /<section class="card"><h2>Resumen<\/h2><p>Ferretería López<\/p><p>1\.240,00 €<\/p><p>Pendiente de envío<\/p>/);
});
EOF
  commit "feat(orders): tarjeta de resumen en la ficha" "Task 2 de la 0015."
}

f15_task3() {
  sed -i 's|· ${o.customer} <span|· ${o.customer} · ${o.total} <span|' "$R/views.mjs"
  commit "feat(orders): total en el listado" "Task 3 de la 0015."
}

feature_0015() {
  g checkout -q -b feature/0015-order-summary
  f15_docs
  f15_tasks '' pending '' '' pending ''
  commit "docs(0015): abrir la feature 0015" "Spec, plan y tasks."
  f15_task1
  local t1; t1=$(g rev-parse --short HEAD)
  f15_task2
  local t2; t2=$(g rev-parse --short HEAD)
  if [ "$1" = step6 ]; then
    f15_tasks "$t1" in_progress "$t2" 'implementada y revisada (limpia); falta cerrarla' pending ''
    commit "docs(0015): registro de la Task 2" "La Task 2 queda implementada y revisada."
    return
  fi
  f15_task3
  local t3; t3=$(g rev-parse --short HEAD)
  f15_tasks "$t1" done "$t2" '' done "$t3"
  put "$F15/review-final.md" <<EOF
# Revisión final — feature 0015

Revisor: sdd-kit:effort-high + opus, sobre $t3. Veredicto: limpia, sin Critical, Important ni Minor.
EOF
  commit "docs(0015): revisión final limpia" "Registro de las tres tasks y la revisión final."
}

feature_0016() {
  g checkout -q -b feature/0016-urgent-badge
  put "$F16/spec.md" <<'EOF'
---
id: 20260928-110000-feature-0016-urgent-badge
feature: 0016
title: Pedidos urgentes
mode: lite
status: approved
created: 2026-09-28
---

# Spec — Pedidos urgentes

## Intent

En el listado no se distingue qué pedido corre prisa: un badge «Urgente» junto a los pedidos marcados como urgentes.

## Approach

Un condicional en `renderList` pinta el badge si `order.urgent`; estilo `.badge-urgente` en `app.css`.

## Delta de comportamiento

### Capacidad: `orders`

**ADDED — El listado marca los pedidos urgentes**
- GIVEN el pedido 1042 urgente y el 1044 no urgente
- WHEN se abre `/pedidos`
- THEN la fila del 1042 lleva el badge «Urgente» y la del 1044 no

### Estimación y esfuerzo

- Tipo: frontend
- Estimación de implementación: 0,5 h

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Dev Lead | 2026-09-28 | aprobada |
EOF
  commit "docs(0016): abrir la feature 0016 en lite" "Spec lite aprobada."
  sed -i 's|· ${o.customer} <span class="badge">${o.status}</span>|· ${o.customer} <span class="badge">${o.status}</span>${o.urgent ? '"'"' <span class="badge badge-urgente">Urgente</span>'"'"' : '"'"''"'"'}|' "$R/views.mjs"
  echo '.badge-urgente { background: #c62828; color: #fff; }' >> "$R/app.css"
  cat >> "$R/tests/views.test.mjs" <<'EOF'

import { renderList } from '../views.mjs';

test('el listado marca los pedidos urgentes', () => {
  const html = renderList(orders);
  assert.match(html, /Pedido 1042<\/a> · Ferretería López <span class="badge">Pendiente de envío<\/span> <span class="badge badge-urgente">Urgente<\/span>/);
  assert.doesNotMatch(html, /Pedido 1044<\/a>[^<]*<span class="badge">Enviado<\/span> <span class="badge badge-urgente">/);
});
EOF
  commit "feat(orders): badge de pedido urgente" "Implementación de la 0016."
}
