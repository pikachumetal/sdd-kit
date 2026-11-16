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

- Nueva: `bookings` — recoge cómo se anula una reserva (solo el responsable de esa sala, sobre reservas de cualquiera) y el listado `anuladas`, que dice quién anuló.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: permiso por rol, datos (quién anula), contrato público (la salida de `anular` y el comando `anuladas`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): que el responsable de una sala no pueda anular en otra y qué ve el cliente (señal: permiso)
- Técnica (sonnet): que `--como` omitido o inválido y las reservas inexistentes tengan su THEN (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. **Capacidad nueva `bookings`** (slug en inglés, contenido en castellano): no hay ningún fichero en `capabilities/`, así que el delta es ADDED, no MODIFIED. `anular` ya existe en el código pero no estaba documentado: el ADDED lo documenta ya con las reglas nuevas, y el cambio de contrato respecto a hoy (sin `--como` ya no anula) está declarado en Intent, Scope y decisión 4. Al cerrar se crea `capabilities/bookings.md` con estos dos requisitos.
2. **El rol sale de `--como`**, porque la app no tiene usuarios: `--como cliente` o `--como responsable:<sala>` (p. ej. `responsable:Norte`). Es una etiqueta que declara quien teclea, no una identidad.
3. **El responsable lo es de una sala**: `responsable:Norte` anula en Norte y no en Sur, como dice la fila 0011 del roadmap («cada sala»). Alternativa que descarto: un `responsable` genérico para todas las salas; es más simple, pero cumple la fila solo a medias. Dime si prefieres esa. La sala se compara tal cual, con mayúsculas (`Norte`), y solo valen las salas que existen (`Norte`, `Sur`): `responsable:` sin sala o con una sala desconocida es `rol no válido: <valor>`. El cliente y el responsable de otra sala reciben el mismo mensaje a propósito (`solo el responsable de sala puede anular`): para quien no puede anular, el motivo es el mismo.
4. **Sin `--como` o con un valor que no sea ninguno de esos dos, `anular` no anula**: responde `falta --como cliente|responsable:<sala>` o `rol no válido: <valor>`. Cambia lo de hoy (hoy cualquiera anula sin decir nada).
5. **Orden de las comprobaciones**: primero el rol es válido, luego la reserva existe y por último el permiso. Un cliente sobre una reserva inexistente recibe `sin reserva …`.
6. **Reserva ya anulada o cancelada**: cuenta como inexistente (`sin reserva …`), como ya hace `cancelar`. No hay mensaje propio.
7. **`anuladas` es un comando nuevo**, abierto a todos y sin `--como`. Lista una línea por reserva anulada, en el orden en que se anularon, `<sala> <día> — anulada por responsable`: la columna es siempre el literal `responsable`, sin la sala, porque solo el responsable puede anular. Sin ninguna anulada, no imprime nada. Descarto ocultar quién anuló al cliente: la fila del roadmap no lo pide.
8. **Las cinco reglas del dato nuevo.** Dónde vive: un campo `voidedBy` en la reserva en memoria de `src/app.js` (la app no persiste nada en disco), así que no hay migración ni datos previos. Idioma: castellano (constitución, punto 4). Valor: el literal `responsable`, sin sala. Límites: no aplican, solo hay un valor posible. Avisos: no aplican, el rechazo ya es el mensaje de la decisión 3. Conflicto: anular una reserva ya anulada es `sin reserva …` (decisión 6) y no cambia `voidedBy`.
9. **Canal y código de salida**: los mensajes de rechazo salen por el mismo canal que el resto de respuestas (`console.log`) y no cambia el código de salida.
10. **`cancelar` no cambia** y sigue disponible para el cliente; la regla de 24 h de `PRODUCT.md` queda fuera de esta feature. La app no sabe de quién es cada reserva: no hay escenario «el cliente anula la suya». Vocabulario de `PRODUCT.md`: «anulada» es lo que hace el responsable y «cancelada» lo que hace el cliente.
11. **Roles frente a la misión**: `mission.md` dice que la usa una sola persona y `PRODUCT.md` habla de equipos. Aquí los roles son etiquetas del terminal; no alineo esos documentos en esta feature.

### Hallazgos de la review

- **Aceptado** — `bookings` no tiene capacidad y el delta era MODIFIED → delta ADDED y capacidad nueva declarada (decisión 1).
- **Aceptado** — el responsable no estaba ligado a una sala → `responsable:<sala>` y escenario de rechazo en otra sala (decisión 3).
- **Aceptado** — escenario único con tres comportamientos → un escenario por comportamiento.
- **Aceptado** — `--como` omitido, inválido y orden de comprobaciones → decisiones 4 y 5, con escenarios.
- **Aceptado** — reserva inexistente o ya anulada → decisión 6, con escenario.
- **Aceptado** — `anuladas` sin escenario propio, sin caso vacío y sin decir si existe → es un requisito ADDED con tres escenarios (decisión 7).
- **Aceptado** — dato nuevo sin sus reglas, sin dónde se prueba y sin canal de error → decisiones 8 y 9 y «Dónde se prueba».
- **Rechazado** — «el cliente anula su propia reserva y se le remite a `cancelar`» → la app no guarda de quién es una reserva (decisión 10).
- **Rechazado** — identificar la reserva también por franja → hoy se identifica por sala y día, y cambiarlo está fuera de esta feature.
- **Rechazado** — sacar el bloque de revisión de «✋» → es la forma que fija `review-spec.md`.
- **Rechazado** — «`anuladas` no debe mostrar quién anuló al cliente» → ver decisión 7.
- **Rechazado** — contradicción entre `mission.md` y `PRODUCT.md` → ver decisión 11.

Segunda ronda (un revisor, sonnet, tras aceptar dos Críticos):

- **Aceptado** — decisión 7 confusa y GIVEN que no coincidía con la salida → decisión 7 reescrita, GIVEN alineado y escenario con dos anuladas que fija orden y formato.
- **Aceptado** — el cambio de contrato de `anular` no estaba declarado → decisión 1, Intent y Scope.
- **Aceptado** — faltaban escenarios de reserva ya anulada, de orden de comprobaciones y de sala vacía o desconocida → escenarios nuevos y decisión 3 (comparación de la sala).
- **Aceptado** — el escenario «sin reserva» no distinguía casos ni comprobaba `anuladas` → THEN ampliado y escenario de reserva ya anulada (decisión 6).
- **Aceptado** — `anuladas` no estaba en el Intent → Intent ampliado.
- **Aceptado** — las cinco reglas incompletas y el valor de `voidedBy` sin fijar → decisión 8 reescrita.
- **Aceptado** — vocabulario y regla de 24 h → decisión 10.
- **Aceptado** — «nadie más» sobrepromete: `--como` es una etiqueta → Intent.
- **Aceptado** — mismo mensaje para dos causas → decisión 3 lo declara a propósito.
- **Rechazado** — actualizar los tests actuales de `anular` → no hay ninguno (`git grep` en `test/` no encuentra «anul»).

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de una sala debe poder anular las reservas de otras personas en su sala, y saberse quién anuló cada una. `--como` es una etiqueta que declara quien teclea, no una barrera de acceso: la app no tiene usuarios.

## Scope

- Entra: `anular` con `--como` (cambia el contrato de hoy: sin `--como` ya no anula) y el comando `anuladas`, que dice quién anuló.
- No entra: `cancelar`, distinguir de quién es cada reserva, la franja horaria y alinear `mission.md` con `PRODUCT.md`.

## Dónde se prueba

- Anular y `anuladas`, con `--como`: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Anular una reserva**

Escenario: el responsable de la sala anula
- GIVEN la reserva de Norte del lun
- WHEN `anular Norte lun --como responsable:Norte`
- THEN responde `anulada Norte lun` y la reserva queda anulada, con `voidedBy` igual a `responsable`

Escenario: el cliente no puede anular
- GIVEN la reserva de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa

Escenario: el responsable de otra sala no puede anular
- GIVEN la reserva de Norte del lun
- WHEN `anular Norte lun --como responsable:Sur`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa

Escenario: falta `--como`
- GIVEN la reserva de Norte del lun
- WHEN `anular Norte lun`
- THEN responde `falta --como cliente|responsable:<sala>` y la reserva sigue activa

Escenario: rol no válido
- GIVEN la reserva de Norte del lun
- WHEN `anular Norte lun --como admin`
- THEN responde `rol no válido: admin` y la reserva sigue activa

Escenario: sala no válida en el rol
- GIVEN la reserva de Norte del lun
- WHEN `anular Norte lun --como responsable:` o `--como responsable:Este`
- THEN responde `rol no válido: <valor>` y la reserva sigue activa

Escenario: sin reserva
- GIVEN que no hay reserva activa de Sur el mar
- WHEN `anular Sur mar --como cliente`
- THEN responde `sin reserva Sur mar`

Escenario: el rol se valida antes que la reserva
- GIVEN que no hay reserva activa de Sur el mar
- WHEN `anular Sur mar --como admin`
- THEN responde `rol no válido: admin`

Escenario: reserva ya anulada
- GIVEN la reserva de Norte del lun ya anulada
- WHEN `anular Norte lun --como responsable:Norte`
- THEN responde `sin reserva Norte lun`, `voidedBy` no cambia y `anuladas` la lista una sola vez

**ADDED — Listar las reservas anuladas**

Escenario: hay anuladas
- GIVEN las reservas de Norte del lun y de Sur del mar anuladas, en ese orden, por `responsable:Norte` y `responsable:Sur`
- WHEN `anuladas`
- THEN responde dos líneas, `Norte lun — anulada por responsable` y `Sur mar — anulada por responsable`

Escenario: no hay anuladas
- GIVEN que ninguna reserva está anulada
- WHEN `anuladas`
- THEN no responde nada

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
