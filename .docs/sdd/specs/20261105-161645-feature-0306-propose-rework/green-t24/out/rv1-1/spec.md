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

- Nuevas: `bookings` — recoge `anular` (que existe en el código pero no está documentado en ninguna capacidad) con su regla nueva de permiso, y el listado `anuladas`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec dispatched: dos revisores — señales: MODIFIED (en la versión anterior), reglas de visibilidad o permiso, datos (quién anuló), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): si `anular` tiene requisito vigente que modificar, qué pasa con cliente/responsable sobre lo propio y con `--como` ausente o inválido (señal: permiso)
- Técnica (sonnet): escenarios verificables de `anular` y `anuladas`, dónde vive «quién anuló» y qué pasa con las reservas ya existentes (señal: contrato público + datos)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. **El rol sale de `--como <cliente|responsable>`**: la app no tiene usuarios. Es un parámetro que se declara, no una identidad comprobada.
2. **Capacidad nueva `bookings`** (slug en inglés, contenido en castellano). Hallazgo de la review: ninguna capacidad ni spec previa documenta `anular` (el código sí lo tiene: `voidBooking` en `src/app.js`), así que no hay requisito que modificar; el delta es `ADDED` y fija también el comportamiento actual (`anulada …`, `sin reserva …`).
3. **Sin dueño de la reserva.** Las reservas no guardan quién las hizo y la misión dice que no hay más usuarios. «Reservas de otros» del roadmap se traduce a permiso por rol, sin distinguir propias de ajenas: el `cliente` no puede anular ninguna, ni la suya (para eso está `cancelar`), y el `responsable` puede anular cualquiera.
4. **Un único rol `responsable`**, no uno por sala: el roadmap dice «responsable de cada sala», pero no existe ningún dato de qué responsable lleva qué sala. Si se quiere por sala, es otra feature.
5. **`--como` es obligatorio.** Sin él, o con otro valor, no se anula nada y responde `indica --como cliente o --como responsable`. Es un cambio visible: hoy `anular Norte lun` a secas funciona.
6. **Orden de comprobación:** primero `--como` (ausente o inválido, incluido sin valor), después el permiso, después si existe la reserva. Un `cliente` sobre una reserva inexistente recibe el mensaje de permiso, no `sin reserva`.
7. **Literales:** permiso denegado → `solo el responsable de sala puede anular`; listado → `Norte lun — anulada por responsable`; sin ninguna → `sin anuladas`.
8. **`anuladas` es un comando nuevo** (hoy no existe), sin `--como` y abierto a todos. No hay formato anterior que romper.
9. **«Quién anuló» guarda el rol.** Como solo el `responsable` puede anular, el valor siempre es `responsable`: aporta trazabilidad solo si más adelante hay más roles o identidades. Lo dejo porque estaba en el planteamiento; **valida si lo quieres o lo quitamos**. Si se quita, cambian solo los escenarios 1 y 8 (sin el `— anulada por responsable`, `anuladas` listaría `Norte lun`).
10. **Dónde vive el dato:** campo `voidedBy` en cada reserva de `bookings` en memoria (`src/app.js`). La app no persiste nada entre ejecuciones, así que no hay migración ni reservas antiguas sin el dato.
11. **`cancelar` queda como está** (No entra): sigue abierto a cualquiera, así que un `cliente` puede cancelar la reserva de otro. Lo dejo fuera a propósito porque la 0010 toca `cancelar`; al cerrar propondré una fila de roadmap para cerrarlo, sin decidirlo aquí.

Reglas de la capacidad (5 bis): dato en memoria (`voidedBy`) · nombres en castellano (constitución 4) · límites: no aplica · avisos: no aplica · conflicto: reserva inexistente o ya anulada → `sin reserva <sala> <día>` (escenarios 5 y 7) · límites: no aplica, no hay cantidades que acotar · avisos: no aplica, la app no avisa nada. `bookings` queda como capacidad de reservas: hoy solo recoge `anular` y `anuladas`, y se completará con reservar, cancelar y libres cuando se documenten.

### Hallazgos de la review

- **Aceptado** — Dominio 1: no hay requisito vigente de `anular` → pasa a `ADDED` y capacidad nueva (decisión 2).
- **Aceptado** — Dominio 2 y 10: «de Ana» da por hecho un dueño que no existe → GIVEN sin dueño (decisión 3).
- **Aceptado** — Dominio 3 / Dominio 8: lo propio y `cancelar` → decisiones 3 y 11.
- **Aceptado** — Dominio 4, Técnica 1, 5 y 6: `--como` ausente, inválido y orden de comprobación → decisiones 5 y 6, con escenarios.
- **Aceptado** — Dominio 5: `anuladas` frente al cliente → decisión 8 (`anuladas` abierto a todos).
- **Aceptado** — Dominio 6 y Técnica 7: reglas y dónde vive el dato → decisión 10 y reglas de la capacidad.
- **Aceptado** — Dominio 7: «quién» es solo un rol → decisión 9, a validar.
- **Aceptado** — Técnica 2, 4 y 9: escenarios separados, salida de `anular` afirmada, la línea del bloque de review contradecía el delta (reescrita).
- **Aceptado en parte** — Técnica 3: las anulaciones antiguas no existen (la app no persiste), así que no se añade escenario histórico; se declara en la decisión 10.
- **Aceptado** — Técnica 8: aún no hay tests de `anular`; `test/anular.test.js` es nuevo.
- **Aceptado** — Segunda ronda (1 Crítico: el escenario 4 mezclaba casos): escenarios separados, uno por WHEN, con GIVEN del estado inicial y comprobaciones por `libres` y `anuladas`; orden de validación declarado; límites y avisos justificados; decisión 11 sin delegar.
- **Aceptado** — Dominio 9: el Intent recoge la trazabilidad.

## Intent

Hoy `anular` está abierto a cualquiera. El `responsable` de sala debe poder anular reservas, y el `cliente` no. Además, el listado `anuladas` deja ver qué reservas se anularon y por quién (por rol).

## Scope

- Entra: `anular` con `--como` obligatorio; el comando nuevo `anuladas`; el campo `voidedBy`. `src/app.js` no tiene texto de ayuda que actualizar, y ningún test actual llama a `anular`.
- No entra: `cancelar` (decisión 11), roles por sala, dueño de la reserva, persistencia.

## Dónde se prueba

- `anular` y `anuladas`: por `run('anular', …)`, `run('anuladas', [])` y `run('libres', …)`, en `test/anular.test.js` (nuevo), como `test/cancel.test.js`.

## Delta de comportamiento

Todos los escenarios parten del estado inicial de la app: la reserva activa de Norte del lun, de 10:00-12:00, y ninguna anulada. «Sigue activa» se comprueba con `libres 10:00-12:00`, que responde `Sur` mientras Norte está ocupada y `Norte, Sur` cuando queda libre.

### Capacidad: `bookings`

**ADDED — Anular una reserva**

Escenario 1 — el responsable anula
- GIVEN el estado inicial
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun`
- AND `libres 10:00-12:00` responde `Norte, Sur`
- AND `anuladas` responde `Norte lun — anulada por responsable`

Escenario 2 — el cliente no anula
- GIVEN el estado inicial
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular`
- AND `libres 10:00-12:00` responde `Sur`
- AND `anuladas` responde `sin anuladas`

Escenario 3 — sin `--como`
- GIVEN el estado inicial
- WHEN `anular Norte lun`
- THEN responde `indica --como cliente o --como responsable`
- AND `libres 10:00-12:00` responde `Sur`

Escenario 4 — `--como` con valor inválido
- GIVEN el estado inicial
- WHEN `anular Norte lun --como admin` (y lo mismo con `--como` sin valor al final)
- THEN responde `indica --como cliente o --como responsable`
- AND `libres 10:00-12:00` responde `Sur`

Escenario 5 — reserva inexistente, responsable
- GIVEN el estado inicial (Sur mar no tiene reserva)
- WHEN `anular Sur mar --como responsable`
- THEN responde `sin reserva Sur mar`

Escenario 6 — reserva inexistente, cliente
- GIVEN el estado inicial
- WHEN `anular Sur mar --como cliente`
- THEN responde `solo el responsable de sala puede anular` (el rol se comprueba antes que la existencia)

Escenario 7 — reserva ya anulada
- GIVEN el estado inicial y tras `anular Norte lun --como responsable`
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`

**ADDED — Listar anuladas**

Escenario 8 — hay anuladas
- GIVEN el estado inicial y tras `anular Norte lun --como responsable`
- WHEN `anuladas`
- THEN responde `Norte lun — anulada por responsable`

Escenario 9 — no hay anuladas
- GIVEN el estado inicial
- WHEN `anuladas`
- THEN responde `sin anuladas`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
