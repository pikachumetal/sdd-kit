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

- Nueva: `reservas` — no existe todavía en `capabilities/`; se crea al cerrar con el comportamiento de anular de esta spec. Hoy no hay capacidad escrita: la regla vigente («cualquiera anula cualquier reserva activa y responde `anulada <sala> <día>`», `voidBooking` en `src/app.js`) solo está en el código.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores + segunda ronda de uno — señales: nueva capacidad, reglas de visibilidad o permiso, datos (quién anula), contrato público (salida de `anular` y comando nuevo `anuladas`) · tamaño: ~110 líneas en 3 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló, y qué pasa sin rol o con un rol inválido (señal: permiso)
- Técnica (sonnet): que cada THEN de `anular` y `anuladas` se pueda comprobar con `run(…)` y que el dato de quién anuló tenga sitio (señal: contrato público + datos)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. **Nueva capacidad `reservas`** (en castellano, como pide la constitución), creada al cerrar: no hay carpeta `capabilities/`.
2. **El rol sale de `--como <cliente|responsable>`**: la app no tiene usuarios. Es declarativo: **no autentica**, cualquiera puede escribir `--como responsable`. Es una decisión de producto que te dejo ver: `PRODUCT.md` dice «No hay más usuarios», pero su Terminología ya distingue cliente y responsable de sala. No toco el Product Purpose.
3. **Sin `--como` se trata como `cliente`** (el valor más restrictivo), en `anular` y en `anuladas`. Un valor distinto de `cliente` y `responsable`, o `--como` sin valor, se rechaza. `--como <valor>` va al final, tras sala y día.
4. **Cambio incompatible**: `anular` sin rol deja de anular (hoy anula). No hay tests de `anular` hoy (`test/` solo tiene `app.test.js` y `cancel.test.js`), así que no hay que actualizar ninguno.
5. **Se valida el rol antes de buscar la reserva**: un cliente que anula una reserva inexistente recibe el rechazo de permiso, no `sin reserva`.
6. **Se guarda el rol, no una persona** (campo `voidedBy` de la reserva, en memoria como el resto de datos). Con un solo rol que pueda anular, hoy el dato siempre vale `responsable`: lo guardo porque la fila lo pide; si no te sirve, se quita.
7. **`anuladas` es un comando nuevo** (no existe hoy), para los dos roles. Lista una línea por reserva anulada, en el orden en que se anularon: `<sala> <día>` y, solo con `--como responsable`, ` — anulada por responsable`. Un cliente sí ve qué reservas se anularon, pero no quién. Sin anuladas responde `sin anuladas`.
8. **Reserva ya anulada, cancelada o inexistente**: `sin reserva <sala> <día>`, como hoy (`findBooking` solo encuentra reservas activas). El caso «cancelada» lo garantiza `findBooking` y no lleva escenario: con una sola reserva y `cancelar` fuera de alcance no se puede montar en el mismo proceso.
9. **La franja no aplica**: la app direcciona la reserva por sala y día, no por franja.
10. **`cancelar` queda fuera**: no cambia.

### Hallazgos de la review

- **Aceptado** — Crítico: el `MODIFIED` no tenía verdad viva contra la que compararse → capacidad nueva con `ADDED` y la regla de hoy escrita en «Capacidades».
- **Aceptado** — Crítico: el cliente no tenía escenario sobre `anuladas` → escenarios «El cliente no ve quién anuló» y decisión 7.
- **Aceptado** — Crítico: escenario único que mezclaba tres comportamientos; sin escenarios de rol ausente ni inválido → un escenario por comportamiento y decisión 3.
- **Aceptado** — Importante: `anuladas` no existía y la decisión técnica «no rompa el formato» se contradecía → comando nuevo declarado (decisión 7); se quita esa línea de la review propuesta.
- **Aceptado** — Importante: sin las cinco reglas, sin franja, sin reserva ya anulada → «Reglas de la capacidad», decisiones 8 y 9, escenario «Anular lo que no está activo».
- **Aceptado** — Importante: «quién» prometía una persona y guardaba un rol → decisión 6 y frase de Intent.
- **Aceptado** — Importante: el «rechazo de rol inválido» no cubría `anuladas`; cambio incompatible sin declarar; precedencia rol/reserva; `--como` sin valor; escenarios dobles; orden de ejecución → escenarios y decisiones 3, 4, 5, 7, y orden explícito en «Dónde se prueba».
- **Aceptado** — Importante: nombre `bookings` contra la Terminología → `reservas`.
- **Rechazado** — Crítico: el rol de la spec contradice «No hay más usuarios» de `PRODUCT.md` y habría que actualizarlo → no lo toco: es una decisión del dev-lead, ya recogida en la decisión 2 para que la valide. Si Laura quiere que `PRODUCT.md` lo diga, es otra fila.
- **Rechazado** — Menor: `voidedBy` es un dato muerto, eliminarlo → la fila pide guardar quién anuló; queda como decisión 6, con su salida abierta.

## Intent

Hoy cualquiera anula cualquier reserva activa. El responsable de sala debe poder anular una reserva y que quede registrado que fue él; quien actúa como cliente, no. Sin rol declarado, `anular` deja de anular.

## Scope

- Entra: `anular` con `--como` (cambio incompatible sin rol); guardar `voidedBy`; comando nuevo `anuladas` con `--como`.
- No entra: `cancelar`; identidad real o autenticación; guardar en disco; cambios en `PRODUCT.md`.

## Dónde se prueba

- `test/anular.test.js`: por `run('anular', […])` y `run('anuladas', […])` importando `run` de `src/app.js`, igual que `test/cancel.test.js`. La app arranca con una sola reserva activa, `Norte lun` (`10:00-12:00`), y los datos viven en memoria: los escenarios se ejecutan en este orden, porque los últimos suponen la anulación del séptimo:
  1. Sin anuladas · 2. El cliente no puede anular · 3. Sin rol se actúa como cliente · 4. Un rol desconocido se rechaza · 5. `--como` sin valor · 6. El rol se valida antes que la reserva · 7. El responsable anula · 8. Anular lo que no está activo · 9. El responsable ve quién anuló · 10. El cliente no ve quién anuló · 11. Sin rol, `anuladas` es la vista del cliente · 12. `anuladas` con rol desconocido.

## Reglas de la capacidad

- Dónde vive el dato: campo `voidedBy` de la reserva, en memoria; sin persistencia.
- Idioma de los nombres: mensajes en castellano (constitución, punto 4); la opción es `--como`.
- Límites: no aplica.
- Avisos: el rechazo al cliente y los de rol desconocido o ausente, con el texto exacto de los escenarios.
- Regla ante conflicto: una reserva no activa responde `sin reserva <sala> <día>`.
- La constitución no tiene «Reglas de producto»: no hay valor del que tomarlas.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — Sin anuladas**
- GIVEN ninguna reserva anulada
- WHEN `anuladas`
- THEN responde `sin anuladas`

**ADDED — El cliente no puede anular**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular`
- AND `libres 10:00-12:00` sigue sin listar `Norte`

**ADDED — Sin rol se actúa como cliente**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun`
- THEN responde `solo el responsable de sala puede anular`
- AND `libres 10:00-12:00` sigue sin listar `Norte`

**ADDED — Un rol desconocido se rechaza**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como admin`
- THEN responde `rol desconocido admin: usa cliente o responsable`
- AND `libres 10:00-12:00` sigue sin listar `Norte`

**ADDED — `--como` sin valor se rechaza**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como`
- THEN responde `falta el rol tras --como: usa cliente o responsable`
- AND `libres 10:00-12:00` sigue sin listar `Norte`

**ADDED — El rol se valida antes que la reserva**
- GIVEN que no existe reserva de Sur del mar
- WHEN `anular Sur mar --como cliente`
- THEN responde `solo el responsable de sala puede anular`

**ADDED — El responsable anula**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun`
- AND `libres 10:00-12:00` lista `Norte, Sur`

**ADDED — Anular lo que no está activo**
- GIVEN la reserva de Norte del lun ya anulada
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`
- AND `anuladas --como responsable` sigue listando una sola línea `Norte lun — anulada por responsable`

**ADDED — El responsable ve quién anuló**
- GIVEN la reserva de Norte del lun anulada por el responsable
- WHEN `anuladas --como responsable`
- THEN responde `Norte lun — anulada por responsable`

**ADDED — El cliente no ve quién anuló**
- GIVEN la reserva de Norte del lun anulada por el responsable
- WHEN `anuladas --como cliente`
- THEN responde `Norte lun`

**ADDED — Sin rol, `anuladas` es la vista del cliente**
- GIVEN la reserva de Norte del lun anulada por el responsable
- WHEN `anuladas`
- THEN responde `Norte lun`

**ADDED — `anuladas` con rol desconocido**
- GIVEN la reserva de Norte del lun anulada por el responsable
- WHEN `anuladas --como admin`
- THEN responde `rol desconocido admin: usa cliente o responsable`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
