---
id: 20260928-100000-feature-0015-order-summary
feature: 0015
title: Walkthrough — Resumen del pedido
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — Resumen del pedido

> BORRADOR previo a la validación: falta el tiempo (§2), la validación del dev-lead (§4.2) y el hash de la Task 3.

## 1. Cambios realizados

- Datos: `summaryOf(order)` en `views.mjs` (Task 1, 67f33a3).
- Ficha: tarjeta «Resumen» con cliente, total y estado, y estilo `.card` en `app.css` (Task 2, 3c9a0a3).
- Listado: cada fila muestra el total junto al cliente (Task 3, juntada en el commit de `feat(orders): total en el listado`).

## 2. Tiempo y coste: estimado vs real

- Sin `.docs/sdd/estimation.md`: sección no obligatoria. Se completa en el cierre.

## 3. Desviaciones del plan

- La Task 3 llegó commiteada sin test del listado ni `task-start`; se escribió el test después y se juntó el rango (ver rulings).

### Decisiones tomadas sin el dev-lead

- La Task 3 (total en el listado) no tiene escenario en la spec, solo en el plan; se ejecutó como el plan aprobado — si el dev-lead la quiere en la spec, se añade un THEN a `orders` — coste si está mal: sacar una línea de `renderList`.
- Test del listado escrito tras el código, con su RED comprobado contra `views.mjs` de 3c9a0a3 (falla; con la Task 3, 5/5) — el commit original no lo traía — si el test se ajustó al código, la copia RED no lo prueba.
- El plan no tiene bloque «De código» en Restricciones globales; el encargo de la revisión final llevaría las reglas literales de la constitution.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 en verde · 0,3 s.

### 4.2 Smoke / tests

- Validado por el dev-lead: pendiente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Ficha 1042: tarjeta «Resumen» bajo la cabecera con cliente, total y estado | ejecución real (captura `ficha1042-claro/oscuro`, 2 viewports) + suite | pendiente de validación |

### 4.3 Residuales / deuda generada

- Pre-existentes, fuera de esta feature: «Enviar» en tema oscuro, 2,2:1 (texto blanco sobre `#7fb0ff`); «Enviar» deshabilitado, 1,4:1 por `opacity: .5`; enlace «Pedido N» en azul del navegador sobre fondo oscuro en el listado.

## 5. Aprendizajes

- _Ninguno por ahora._

## 6. Adendas

- _Ninguna._
