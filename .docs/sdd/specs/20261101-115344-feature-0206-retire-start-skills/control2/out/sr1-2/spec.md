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

- Nuevas: `bookings` — `anular` lo puede usar solo el responsable de sala, sobre reservas de cualquiera, y guarda quién anuló; `anuladas` lo muestra.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 3 ficheros
- Dominio: que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica: que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios. Es una convención de la herramienta, no autenticación: cualquiera puede escribir `--como responsable`.
2. Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md` no existe: no hay requisito base que modificar). Su requisito «Anular una reserva» entra como `ADDED` y describe el comportamiento completo, el de hoy incluido.
3. Sin `--como`, o con un valor que no sea `cliente` ni `responsable`, `anular` responde `indica --como cliente|responsable` y la reserva no cambia. Rompe el uso actual sin flag, y es intencionado: sin rol no hay permiso que comprobar.
4. El cliente tampoco puede anular su propia reserva. `cancelar` queda como está, abierto a todos (fuera de alcance).
5. Se valida el rol antes que la reserva: un cliente que anula una reserva que no existe recibe `solo el responsable de sala puede anular`.
6. `anuladas` no recibe `--como` y lo ve cualquiera, con quién anuló. Lo que se prohíbe al cliente es anular, no mirar. Esto cambia la línea «Dominio» de la review de arriba.
7. Quién anuló se guarda en la propia reserva anulada, con el valor `responsable`. El nombre del campo y el almacén los fija el plan al leer el código.
8. Las anuladas antes de este cambio no tienen autor y se listan sin él: `Norte lun — anulada`. No se migra.
9. Reglas de la capacidad: datos, en la reserva (decisión 7) · idioma, castellano, como los mensajes de hoy · límites, `--como` admite solo `cliente` y `responsable` · avisos, `solo el responsable de sala puede anular` e `indica --como cliente|responsable` · conflicto, anular una reserva inexistente o ya anulada se queda como hoy (no entra aquí, ver Scope).

### Hallazgos de la review

- **Aceptado** — Dominio 1 / Técnica 8: `bookings` no existe → `ADDED` y capacidad nueva declarada (decisión 2).
- **Aceptado** — Dominio 2 / Técnica 4: nada cubre qué ve el cliente → decisión 6 y escenario de `anuladas`.
- **Aceptado** — Dominio 3 / Técnica 2: `--como` ausente o inválido → decisión 3 y escenarios.
- **Aceptado** — Dominio 4 / Técnica 5: el cliente anulando la suya y `cancelar` → decisión 4.
- **Aceptado** — Dominio 5 (5 bis) / Técnica 5, 7: reglas y dónde se guarda → decisiones 7 y 9.
- **Aceptado** — Dominio 6 / Técnica 7: anuladas anteriores → decisión 8 y escenario.
- **Aceptado** — Dominio 7: sin autenticación → decisión 1.
- **Aceptado** — Técnica 1 (Crítico): un escenario mezclaba tres comportamientos → separado en cuatro más los de `--como`.
- **Aceptado** — Técnica 3 (parcial): orden de validación → decisión 5.
- **Aceptado** — Técnica 6: el formato de `anuladas` cambia con el sufijo; es un cambio declarado y lo protegen los escenarios de las anuladas con y sin autor.
- **Aceptado** — Técnica 10: se listan los tests existentes que cambian en «Dónde se prueba».
- **Rechazado** — Técnica 3 (parcial): escenarios de reserva inexistente o ya anulada para el responsable → no cambian con esta feature; quedan como hoy y fuera de alcance.
- **Rechazado** — Técnica 9: stdout/stderr y código de salida → los fija el plan copiando `test/cancel.test.js`; la spec describe el texto.
- **Rechazado** — Dominio 8: Ana como clienta → no hace falta; el rechazo se prueba con `--como cliente` sobre la reserva de Ana, que es la del GIVEN.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no.

## Scope

- Entra: `anular` con `--como`, y quién anuló en el listado `anuladas`.
- No entra: `cancelar`; anular una reserva inexistente o ya anulada.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- `anuladas`: en el mismo fichero.
- Los tests actuales de `anular` y de `anuladas` pasan a llevar `--como`; el plan los lista al leer `test/`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Anular una reserva**

Escenario: el responsable anula
- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada

Escenario: el cliente no puede anular
- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa

Escenario: sin rol o con un rol desconocido
- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun`, o `anular Norte lun --como admin`
- THEN responde `indica --como cliente|responsable` y la reserva sigue activa

**ADDED — Listado de anuladas**

Escenario: anulada por el responsable
- GIVEN la reserva de Norte del lun, anulada con `--como responsable`
- WHEN `anuladas`
- THEN lista `Norte lun — anulada por responsable`

Escenario: anulada antes de este cambio
- GIVEN una reserva de Norte del lun anulada antes de este cambio, sin autor
- WHEN `anuladas`
- THEN lista `Norte lun — anulada`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
