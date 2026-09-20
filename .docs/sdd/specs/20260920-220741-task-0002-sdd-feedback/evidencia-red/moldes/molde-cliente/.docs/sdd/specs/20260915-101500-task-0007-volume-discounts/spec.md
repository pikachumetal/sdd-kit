---
id: 20260915-101500-task-0007-volume-discounts
task: "0007"
title: Descuentos por volumen
mode: full
status: approved
created: 2026-09-15T10:15:00+02:00
approvals:
  - gate: intent
    by: Marta Ibáñez (jefa de ventas)
    at: 2026-09-15T10:52:00+02:00
  - gate: spec
    by: Marta Ibáñez (jefa de ventas)
    at: 2026-09-15T11:40:00+02:00
---

# Spec — Descuentos por volumen

## Decisiones que he tomado yo

- El escalado se evalúa por línea de pedido (cantidad del mismo artículo en esa línea), no por
  el total del pedido: es como ya funciona el escalado manual que hacían los comerciales.
- El rappel se calcula solo al cierre de periodo, no en tiempo real durante el pedido: el jefe
  de ventas confirmó que el mayorista no necesita verlo antes del cierre.
- El redondeo pasa a bancario en los tres cálculos de descuento (escalado, rappel, tarifa) para
  no reabrir una spec distinta por cada uno.

## Intent

Los mayoristas grandes de Nortia negocian condiciones de volumen (escalados por cantidad y
rappel por periodo) que hasta ahora se aplicaban a mano por el comercial al revisar el pedido
en el ERP. Automatizar el escalado y el rappel para que se apliquen en el momento del pedido o
del cierre de periodo, sin intervención manual del comercial.

## Scope

**Dentro**: cálculo de escalado por línea de pedido, cálculo de rappel al cierre de periodo,
redondeo bancario de los tres importes de descuento de la capacidad `pricing`.

**Fuera**: interfaz de mayorista para simular su propio rappel antes de cierre (queda para una
task futura), integración del rappel liquidado con el ERP de facturación.

## Approach

Un `VolumeDiscountCalculator` en el dominio `Pricing` recibe la cantidad de una línea y la
tarifa del mayorista, y devuelve el precio de escalón aplicable. El `TariffService` expone un
`ITariffResolver` para obtener la tarifa vigente de un mayorista sin acoplar el cálculo a cómo
se almacena la tarifa. El cierre de periodo de rappel reutiliza el mismo redondeo bancario que
el escalado.

## Delta de comportamiento

**Capacidad**: `pricing`

- **ADDED** — Escalado por volumen de unidades
- **ADDED** — Rappel acumulado por periodo
- **MODIFIED** — Redondeo del descuento aplicado (de truncamiento a redondeo bancario)

## Aprobaciones

- Intent aprobado por Marta Ibáñez (jefa de ventas) el 2026-09-15 a las 10:52.
- Spec aprobada por Marta Ibáñez (jefa de ventas) el 2026-09-15 a las 11:40.
