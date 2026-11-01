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

🦆 Hoy cualquiera anula cualquier reserva. Con este cambio, solo el responsable de sala anula: con `--como responsable` la reserva de Ana en Norte el lunes queda anulada, y con `--como cliente` sale «solo el responsable de sala puede anular» y la reserva sigue. Hay un listado nuevo, `anuladas`: el responsable ve quién anuló cada una y el cliente solo ve que está anulada. El rol lo escribe quien llama; no es una barrera de seguridad, porque la herramienta la usa una sola persona.

## Capacidades

- Nuevas: `bookings` — `anular` lo puede usar solo el responsable de sala, sobre reservas de cualquiera, y guarda quién anuló; `anuladas` lista las anuladas. El proyecto no tiene `capabilities/`: esta feature crea `bookings` con lo que cambia (el resto del comportamiento de reservas no se documenta aquí).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 3 ficheros
- Dominio: que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica: que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

Política de modelos: revisores de la spec, dominio y técnica, en Sonnet (`sdd-kit:effort-medium`); la implementación, según el plan.

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios. Es una convención de la CLI, no un control de acceso: quien llama puede escribir `--como responsable`. La misión dice que solo la usa su autor, así que no se añade autenticación.
2. `bookings` es una capacidad nueva: no existe `capabilities/`. Por eso el delta es `ADDED`, no `MODIFIED`. Solo documenta lo que esta feature define.
3. `anuladas` no existe hoy: es un comando nuevo, no un cambio de formato. No hay formato anterior que romper.
4. `--como` es obligatorio en `anular`. Hoy `anular Norte lun` funciona sin él; sin `--como`, o con un valor que no sea `cliente` ni `responsable`, responde `indica --como cliente|responsable` y no cambia nada. Esto cambia el contrato de `anular` (no hay tests de `anular` hoy).
5. El responsable anula cualquier reserva activa, también las suyas.
6. El cliente no ve quién anuló: `anuladas` con `--como cliente`, o sin `--como`, lista `Norte lun — anulada`, sin autor. Con `--como responsable` lista `Norte lun — anulada por responsable`.
7. Quién anuló se guarda en un campo nuevo, `voidedBy`, de la reserva en memoria, como el resto del estado. No hay persistencia ni reservas anuladas de antes: no hace falta migración.
8. `cancelar` queda como está, sin roles.
9. Mensaje de rechazo del cliente: `solo el responsable de sala puede anular`.

Prueba del delta en una copia de `.docs/sdd` (`sdd capability merge`): `bookings.md: añadido «…»` × 6 escenarios, salida 0; el `capabilities/` del repo no cambia.

### Hallazgos de la review

- **Aceptado** — Crítico (los dos revisores): `capabilities/bookings.md` no existe → comprobado en el repo; el delta pasa a `ADDED` y la decisión 2 declara la capacidad nueva.
- **Aceptado** — Crítico (dominio): `anuladas` aparece como si ya existiera → comprobado en `src/app.js`: no existe; `ADDED — Listar reservas anuladas`, decisión 3, y entra en el Scope.
- **Aceptado** — Importante (técnica): un escenario mezclaba tres requisitos y el listado no tenía WHEN → un escenario por requisito.
- **Aceptado** — Importante (los dos): `--como` ausente o inválido → decisión 4 y escenarios.
- **Aceptado** — Importante (dominio): qué ve el cliente en `anuladas` → decisión 6 y escenarios con `--como cliente` y sin `--como`.
- **Aceptado** — Importante (dominio): frontera entre `anular` y `cancelar`, reserva ya anulada o inexistente → decisión 8 y escenario de reserva sin activa.
- **Aceptado** — Importante (dominio): faltan las cinco reglas de la capacidad → sección «Reglas de la capacidad». La constitution no tiene «Reglas de producto»; solo fija el castellano.
- **Aceptado** — Importante (los dos): reservas anuladas antes del cambio y dónde se guarda quién anuló → decisión 7.
- **Aceptado** — Importante (dominio): `--como` no es control de acceso frente a la misión → decisión 1 y el Intent lo dicen.
- **Aceptado** — Importante/Menor (técnica): «sobre reservas de cualquiera» sin verificar → escenarios con reserva de Ana y con reserva del propio responsable.
- **Aceptado** — Menor (técnica): decisiones en el cuerpo sin listar y `anuladas` sin prueba → decisiones 4 a 9 y «Dónde se prueba».

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no. El rol es una convención de la CLI (`--como`), no una barrera de seguridad.

## Scope

- Entra: `anular` con `--como` obligatorio; el comando nuevo `anuladas`, con quién anuló solo para el responsable; el campo `voidedBy` en `src/app.js`.
- No entra: `cancelar`; autenticación; persistencia.

## Dónde se prueba

- Anular y listar: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Anular una reserva**
- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada

**ADDED — El responsable anula también las suyas**
- GIVEN una reserva de Norte del lun, hecha por el responsable
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun`

**ADDED — El cliente no anula**
- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa

**ADDED — `--como` obligatorio y válido**
- GIVEN la reserva de Norte del lun, de Ana
- WHEN `anular Norte lun`, o `anular Norte lun --como admin`
- THEN responde `indica --como cliente|responsable` y la reserva sigue activa

**ADDED — Anular lo que no está activo**
- GIVEN que no hay reserva activa de Norte del mar
- WHEN `anular Norte mar --como responsable`
- THEN responde `sin reserva Norte mar`

**ADDED — Listar reservas anuladas**
- GIVEN la reserva de Norte del lun, anulada por el responsable
- WHEN `anuladas --como responsable`
- THEN responde `Norte lun — anulada por responsable`
- AND con `--como cliente`, o sin `--como`, responde `Norte lun — anulada`

#### Reglas de la capacidad

- Dónde viven los datos: en la reserva en memoria de `src/app.js`, con el campo `voidedBy`. No aplica persistencia.
- Idioma de los nombres: castellano en la interfaz (constitution, art. 4); los valores de `--como` son `cliente` y `responsable`.
- Límites: `--como` solo admite esos dos valores.
- Avisos: `solo el responsable de sala puede anular` e `indica --como cliente|responsable`.
- Regla ante conflicto: anular una reserva que ya no está activa responde `sin reserva <sala> <día>`; no se anula dos veces.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
