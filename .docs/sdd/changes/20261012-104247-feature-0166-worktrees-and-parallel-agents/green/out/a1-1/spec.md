---
id: 20261008-110000-feature-0011-void-others
feature: 0011
title: Anular reservas de otros
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Anular reservas de otros

## Capacidades

- Nueva: `bookings` — `anular` solo lo usa el responsable de sala y guarda quién anuló; `anuladas` lista las anuladas y solo al responsable le dice quién anuló.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), MODIFIED (`anular` deja de ser libre), reglas de visibilidad o permiso, datos (quién anuló), contrato público (la salida de `anular` y el comando nuevo `anuladas`) · tamaño: ~60 líneas en 3 ficheros
- Dominio: que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica: que el comando nuevo `anuladas` y los mensajes de `anular` tengan salida exacta y verificable (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios. Es una convención de la interfaz, no autenticación: cualquiera puede escribir `--como responsable`. Encaja con la misión (un solo usuario, el autor) porque los roles los simula el propio operador.
2. `anuladas` **no existe hoy** en `src/app.js`: es un comando nuevo (ADDED), no una modificación. La capacidad `bookings` tampoco existe en `capabilities/`: la declaro nueva y se crea al cerrar la feature, con el comportamiento de `anular` descrito aquí.
3. «De otros» no se puede modelar: la reserva no tiene dueño (`{ room, day, slot, status }`). El responsable anula **cualquier** reserva activa. El cliente no anula ninguna, tampoco la suya: lo suyo es `cancelar` (PRODUCT.md: cancelación = el cliente; anulación = el responsable).
4. Sin `--como`, se trata como cliente: responde `solo el responsable de sala puede anular`. Es el valor por defecto restrictivo y cambia el comportamiento de hoy, donde `anular` funciona sin flag.
5. Valor de `--como` distinto de `cliente|responsable`: `rol no válido: <valor>`, sin tocar la reserva. Mismo mensaje en `anuladas`.
6. Orden de comprobación en `anular`: primero el rol, después la reserva. Así un cliente no averigua si una reserva existe.
7. Anular una reserva que no está activa (ya anulada, cancelada o inexistente) responde `sin reserva <sala> <día>`, como hoy, y no cambia quién anuló la primera vez.
8. «Quién anuló» es el **rol**, no una persona: con dos roles y solo uno que puede anular, el valor guardado es siempre `responsable`. Lo guardo igualmente porque lo pide el Intent; si no hay más roles a la vista, dímelo y se quita el campo.
9. `anuladas` lo puede usar cualquiera (cliente o sin flag): el cliente ve `Norte lun — anulada`, sin quién. Con `--como responsable` ve `Norte lun — anulada por responsable`. Sin ninguna anulada responde `sin anuladas`.
10. El dato vive en el array `bookings` en memoria de `src/app.js`, como un campo nuevo `voidedBy` de cada reserva. No hay persistencia ni reservas anuladas de antes, así que no hay migración.
11. `cancelar` queda como está, abierto a cualquiera, por la misma falta de dueño: no se puede restringir a «lo propio». Es un hueco conocido, fuera de este cambio.
12. Ejemplos con la sala y el día que ya siembra la app (`Norte`, `lun`); no hay personas ni clientes reales en la spec.

### Reglas de la capacidad

- **Dónde viven los datos:** campo `voidedBy` de la reserva en el array en memoria de `src/app.js`.
- **Idioma de los nombres:** castellano en los textos de interfaz (constitution, 4); los valores de `--como` son `cliente` y `responsable`.
- **Límites:** no aplica.
- **Avisos:** `solo el responsable de sala puede anular` y `rol no válido: <valor>`, literales.
- **Regla ante conflicto:** una reserva ya anulada no se anula otra vez ni cambia `voidedBy` (decisión 7); rol inválido o ausente no toca nada.

### Hallazgos de la review

Técnica (T) y dominio (D):

- **Aceptado** — T1 el requisito mezclaba tres comportamientos en un escenario → separados en escenarios con su propio WHEN.
- **Aceptado** — T2 `anuladas` no existe → comando nuevo, ADDED, con su requisito (decisión 2). Leído en `src/app.js`: confirmado.
- **Aceptado** — T3, D5 casos sin escenario: sin `--como`, rol inválido, reserva inexistente o ya anulada → escenarios 3, 4 y 5 del requisito de anular (decisiones 4–7).
- **Aceptado** — T4, D8 decisiones del cuerpo y `--como` autodeclarado → decisiones 1, 4–9.
- **Aceptado** — T5, D4, D9 dónde vive el dato y qué es «quién» → decisiones 8 y 10 y «Reglas de la capacidad». Sin reservas anuladas previas: el almacén es en memoria.
- **Aceptado** — T6 faltaba dónde se prueba `anuladas` → «Dónde se prueba».
- **Aceptado** — T7, D7 relación con `cancelar` → decisiones 3 y 11.
- **Aceptado** — T8, D1 sin baseline en `capabilities/` → decisión 2: capacidad nueva, con el comportamiento actual citado en «Hoy».
- **Aceptado** — D2 (Crítico) el cliente tampoco anula lo suyo → decisión 3.
- **Aceptado** — D3 (Crítico) faltaba la visibilidad de `anuladas` por rol → requisito «Listar anuladas», escenarios 1 y 2.
- **Aceptado** — D4 el formato de `anuladas` escondido como AND → requisito propio.
- **Aceptado** — D6 faltaban las cinco reglas → «Reglas de la capacidad».
- **Aceptado** — D10 roles frente a la misión → decisión 1.
- **Aceptado** — Ejemplo con nombre de persona («Ana») → quitado, decisión 12.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de sala debe poder anularlas, y el cliente no, tampoco la suya (para eso tiene `cancelar`). Quién anuló solo lo ve el responsable.

## Scope

- Entra: `anular` con `--como` (rol, mensaje de rechazo y `voidedBy`); comando nuevo `anuladas`; la capacidad `bookings` al cerrar.
- Ficheros: `src/app.js`, `test/anular.test.js` (nuevo), `capabilities/bookings.md` (al cerrar).
- No entra: `cancelar`, dueño de la reserva, autenticación real, persistencia.

## Dónde se prueba

- Anular y anuladas: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, con el patrón de `test/cancel.test.js` (`node:test`, `assert/strict`, `import { run } from '../src/app.js'`).
- El almacén es un array de módulo sin reinicio: el plan decide cómo aislar los escenarios que anulan `Norte lun`.

## Delta de comportamiento

### Capacidad: `bookings` (nueva)

**ADDED — Anular una reserva**

Hoy: `anular <sala> <día>` responde `anulada <sala> <día>` a cualquiera, y `sin reserva <sala> <día>` si no hay reserva activa.

Escenario 1 — el responsable anula
- GIVEN la reserva activa de Norte el lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun`, la reserva queda anulada y `voidedBy` es `responsable`

Escenario 2 — el cliente no anula
- GIVEN la reserva activa de Norte el lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa

Escenario 3 — sin rol
- GIVEN la reserva activa de Norte el lun
- WHEN `anular Norte lun`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa

Escenario 4 — rol inválido
- GIVEN la reserva activa de Norte el lun
- WHEN `anular Norte lun --como admin`
- THEN responde `rol no válido: admin` y la reserva sigue activa

Escenario 5 — nada que anular
- GIVEN Norte el lun ya anulada por `responsable`, o una sala y día sin reserva
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun` y `voidedBy` no cambia

**ADDED — Listar anuladas**

Escenario 1 — el responsable ve quién anuló
- GIVEN Norte el lun anulada por `responsable`
- WHEN `anuladas --como responsable`
- THEN responde `Norte lun — anulada por responsable`

Escenario 2 — el cliente no ve quién anuló
- GIVEN Norte el lun anulada por `responsable`
- WHEN `anuladas --como cliente`, o `anuladas` sin flag
- THEN responde `Norte lun — anulada`

Escenario 3 — ninguna anulada
- GIVEN ninguna reserva anulada
- WHEN `anuladas`
- THEN responde `sin anuladas`

Escenario 4 — rol inválido
- GIVEN cualquier estado
- WHEN `anuladas --como admin`
- THEN responde `rol no válido: admin`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
