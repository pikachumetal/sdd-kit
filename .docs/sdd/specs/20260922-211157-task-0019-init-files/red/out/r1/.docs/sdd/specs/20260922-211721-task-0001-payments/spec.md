---
id: 20260922-211721-task-0001-payments
task: 0001
title: Módulo de pagos - registrar pago y consultar saldo pendiente
mode: full
profile: delegate
status: draft
created: 2026-09-22
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Módulo de pagos

> **Estado**: draft.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Decisiones que he tomado yo — valida estas

1. Estructura del módulo: `src/modules/payments/{domain,application,infrastructure}` + `src/shared/result.js`, calcado de `../orders-api` — la constitution dice que billing-api replica sus patrones (dominio funcional con `Result` ok/fail, casos de uso con inyección de dependencias, repos en memoria).
2. Sin módulo de facturas todavía (task 0002 posterior): añado un `InvoiceRepository` mínimo en memoria dentro de `payments/infrastructure` (`save`/`findById`) solo para poder seedear facturas y probar el módulo. Lo marco con un comentario `ponytail:` porque task 0002 lo sustituirá o realojará cuando exista el módulo de facturas real.
3. Validación del pago: solo que el importe sea entero positivo en céntimos (constitution, art. 1) y que la factura exista (`INVOICE_NOT_FOUND`). No pongo tope de sobrepago: la constitution deja "Límites" pendiente y `mission.md` define el saldo pendiente como una resta literal (factura − suma de pagos), así que no invento una regla de negocio que nadie ha pedido.
4. Dos casos de uso con DI (patrón orders-api: constructor con repos + `idGenerator`): `RegisterPayment` y `GetOutstandingBalance`.
5. Sin capa HTTP: igual que orders-api, esta task no expone servidor ni rutas — se prueba con `node --test` directamente contra los casos de uso.
6. Persistencia 100% en memoria (`Map`), conforme a la regla de producto "dónde viven los datos: en memoria hasta que se decida la base de datos".

Capacidad nueva: `payments` (única señal de la rúbrica de review — 1 de 4 necesarias para recomendar revisor; no propongo review).

## Intent

Hoy el cobro se sigue en una hoja de cálculo compartida y se pierden pagos parciales. Esta task le da a billing-api su primera pieza operativa: registrar un pago contra una factura y calcular al vuelo cuánto queda pendiente, sin depender todavía del módulo de facturas (task 0002, posterior). Sigue el patrón de capas ya validado en `orders-api`.

## Scope

- Entra: registrar un pago contra una factura por su id; consultar el saldo pendiente de una factura; persistencia en memoria de pagos y de un stub mínimo de facturas para poder probar el módulo sin depender de task 0002.
- No entra: emisión de facturas (task 0002); API HTTP o rutas; persistencia en base de datos; editar o anular un pago ya registrado; avisos o notificaciones de cobro.

## Approach

Módulo `payments` en tres capas, igual que `orders-api`: dominio funcional con la factory `createPayment` que valida el importe y devuelve `Result` (ok/fail, sin excepciones de negocio); dos casos de uso con inyección de dependencias (`RegisterPayment`, `GetOutstandingBalance`); repositorios en memoria para pagos y para un stub mínimo de facturas que la task 0002 sustituirá.

## Delta de comportamiento

### Capacidad: `payments`

**ADDED — Registrar un pago contra una factura existente**
- GIVEN una factura con id conocido
- WHEN se registra un pago con un importe en céntimos, entero y positivo
- THEN el pago queda guardado asociado a esa factura
- AND el saldo pendiente de la factura disminuye en ese importe

**ADDED — Rechazar un pago con importe inválido**
- GIVEN una factura existente
- WHEN se registra un pago con un importe que no es un entero positivo en céntimos
- THEN la operación falla con el código `PAYMENT_INVALID_AMOUNT` y no se guarda ningún pago

**ADDED — Rechazar un pago contra una factura inexistente**
- GIVEN un id de factura que no existe
- WHEN se intenta registrar un pago contra ese id
- THEN la operación falla con el código `INVOICE_NOT_FOUND` y no se guarda ningún pago

**ADDED — Consultar el saldo pendiente de una factura**
- GIVEN una factura existente con cero o más pagos registrados
- WHEN se consulta su saldo pendiente
- THEN se obtiene el importe de la factura menos la suma de sus pagos, en céntimos

**ADDED — Rechazar la consulta de saldo de una factura inexistente**
- GIVEN un id de factura que no existe
- WHEN se consulta su saldo pendiente
- THEN la operación falla con el código `INVOICE_NOT_FOUND`

**Reglas de la capacidad**
- **Dónde viven los datos**: en memoria (constitution) — no aplica cambio de valor.
- **Idioma de los nombres**: API y claves en inglés, mensajes en castellano (constitution) — no aplica cambio de valor.
- **Límites**: no aplica — esta capacidad no introduce ningún tope nuevo (ver decisión 3).
- **Avisos**: no aplica.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
