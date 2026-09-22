---
id: 20260922-211559-task-0001-payments
task: 0001
title: Módulo de pagos — registrar pago y consultar saldo pendiente
mode: full
profile: delegate
status: draft
created: 2026-09-22
author: Àngel Delgado (spec redactada por Claude, perfil delegate)
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Módulo de pagos

> **Estado**: draft.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`payments` e `invoicing`), contrato público (el repositorio de `invoicing` es la interfaz que consumirá la task 0002), datos (entidades `Payment` e `Invoice` nuevas, persistidas en memoria). 3 señales, por debajo del umbral de 4 que recomienda revisores.

1. Creo un módulo `invoicing` mínimo ahora (solo la entidad Factura y su repositorio en memoria, sin caso de uso de emisión) para que `payments` tenga algo real contra lo que registrar — sin un importe total persistido no se puede calcular ni consultar un saldo pendiente. Descarté pasar el importe total como parámetro en cada llamada porque "consultar su saldo pendiente" (mission.md) exige poder preguntar por una factura ya conocida, no repetir su importe en cada consulta. La emisión completa desde pedidos queda para la task 0002, que ampliará esta misma capacidad con un `MODIFIED`/`ADDED`.
2. Declaro `invoicing` como capacidad nueva en `capabilities/`, junto a `payments`, para que la task 0002 la amplíe por nombre en vez de abrir una capacidad paralela.
3. Rechazo el sobrepago: un pago que supera el saldo pendiente no se admite (`PAYMENT_EXCEEDS_BALANCE`). La constitution deja "Límites" pendiente; decido conservador porque admitir saldo negativo contradice la propia definición de "saldo pendiente" de mission.md (importe de la factura menos la suma de sus pagos).
4. No modelo fecha/hora de cobro en el pago. La mission no la pide para calcular el saldo pendiente y esta task no incluye historial ni reportes; se añade si una task futura lo necesita.
5. No expongo API HTTP. `tech-stack.md` no declara framework ni puerto y billing-api no tiene servidor todavía; esta task deja los casos de uso listos para que otra task los exponga cuando el proyecto decida el transporte.
6. Reutilizo el patrón exacto de `../orders-api` (funciones puras de dominio, casos de uso en `application` que orquestan repositorios inyectados, repositorios en memoria, resultado `{ok, fail}`) porque la constitution lo fija como proyecto de referencia.

## Intent

Hoy el cobro de facturas se lleva en una hoja de cálculo compartida y se pierden cobros parciales (mission.md). billing-api no tiene todavía ningún módulo de dominio. Esta task construye el primero: registrar un pago contra una factura y consultar su saldo pendiente, cubriendo la fila 0001 del roadmap. Los importes se guardan en céntimos enteros (constitution, art. 1).

## Scope

- Entra: registrar un pago contra una factura; consultar el saldo pendiente de una factura; el modelo mínimo de Factura (identificador + importe total) necesario para que exista algo contra lo que pagar; validar el importe del pago; rechazar el sobrepago.
- No entra: emitir facturas desde pedidos cerrados (task 0002); exponer API HTTP; persistencia distinta de memoria; fecha/hora de cobro; reportes o consultas agregadas para Dirección.

## Approach

Replicar el patrón de `../orders-api`: cada concepto en su propio módulo (`domain` con funciones puras de validación, `application` con los casos de uso que orquestan repositorios inyectados, `infrastructure` con repositorios en memoria), y el resultado `{ok, fail}` de `src/shared/result.js` para todo lo que devuelve un caso de uso. Se crea un módulo `invoicing` mínimo (solo entidad + repositorio) como base que `payments` necesita hoy y que la task 0002 ampliará.

## Delta de comportamiento

### Capacidad: `payments`

**ADDED — Registrar un pago contra una factura**
- GIVEN una factura existente con saldo pendiente
- WHEN se registra un pago con un importe en céntimos mayor que cero y menor o igual al saldo pendiente
- THEN el pago queda registrado y el saldo pendiente de la factura se reduce en ese importe

**ADDED — Rechazar un pago que supera el saldo pendiente**
- GIVEN una factura existente con saldo pendiente
- WHEN se registra un pago con un importe mayor que el saldo pendiente
- THEN el pago se rechaza con el código `PAYMENT_EXCEEDS_BALANCE` y no se registra

**ADDED — Rechazar un pago con importe inválido**
- GIVEN una factura existente
- WHEN se registra un pago con importe cero, negativo o no entero
- THEN el pago se rechaza con el código `PAYMENT_INVALID_AMOUNT` y no se registra

**ADDED — Rechazar un pago contra una factura inexistente**
- GIVEN un identificador de factura que no existe
- WHEN se registra un pago contra ese identificador
- THEN el pago se rechaza con el código `INVOICE_NOT_FOUND`

**ADDED — Consultar el saldo pendiente de una factura**
- GIVEN una factura existente con cero o más pagos registrados
- WHEN se consulta su saldo pendiente
- THEN se devuelve el importe total de la factura, lo pagado y el saldo pendiente (total menos pagado)

**ADDED — Rechazar la consulta de saldo de una factura inexistente**
- GIVEN un identificador de factura que no existe
- WHEN se consulta su saldo pendiente
- THEN la consulta se rechaza con el código `INVOICE_NOT_FOUND`

**Reglas de la capacidad**
- **Dónde viven los datos**: en memoria (regla general del proyecto, tech-stack.md)
- **Idioma de los nombres**: códigos de error en inglés (`INVOICE_NOT_FOUND`, `PAYMENT_INVALID_AMOUNT`, `PAYMENT_EXCEEDS_BALANCE`); mensajes al usuario en castellano
- **Límites**: el importe de un pago no puede superar el saldo pendiente de la factura; no se admite sobrepago
- **Avisos**: al rechazar un pago o una consulta, el mensaje en castellano indica el motivo y, cuando aplica, el saldo pendiente actual
- **Regla ante conflicto**: no aplica — una sola fuente de verdad, la suma de los pagos registrados contra la factura

### Capacidad: `invoicing`

**ADDED — Existencia mínima de una factura para poder registrarle pagos**
- GIVEN un importe total en céntimos enteros mayor que cero
- WHEN se da de alta una factura con ese importe (vía el repositorio; sin flujo de emisión todavía)
- THEN la factura queda disponible para que `payments` registre pagos contra ella y consulte su saldo pendiente

**Reglas de la capacidad**
- **Dónde viven los datos**: en memoria
- **Idioma de los nombres**: API en inglés
- **Límites**: el importe total debe ser un entero positivo de céntimos
- **Avisos**: no aplica todavía — sin flujo de usuario; lo definirá la task 0002
- **Regla ante conflicto**: no aplica

## Enmiendas

_Sin enmiendas todavía._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
