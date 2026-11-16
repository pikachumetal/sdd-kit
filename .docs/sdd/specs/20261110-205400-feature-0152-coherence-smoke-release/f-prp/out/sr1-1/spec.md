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

🦆 Hoy `anular` anula cualquier reserva sin preguntar quién es. Después de este cambio hay que decir `--como responsable` o `--como cliente`: el responsable anula, el cliente recibe un rechazo y la reserva sigue como estaba. Además aparece `anuladas`, que lista lo anulado y el rol que lo hizo, y solo lo ve el responsable. `cancelar` no se toca.

## Capacidades

- Nuevas: `reservas` — primera capacidad del proyecto (hoy no hay `capabilities/`). Recoge el comportamiento actual de `anular` y lo modifica: solo el responsable de sala anula, y se guarda quién anuló.
- Nuevo comando dentro de ella: `anuladas`, que lista las reservas anuladas y quién las anuló.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (sonnet, lo pidió el dev-lead): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios. Es un control de uso, no de seguridad: cualquiera puede declararse `responsable`. Se acepta como límite conocido.
2. `--como` es obligatorio en `anular` y en `anuladas`. Sin él responde `falta --como <cliente|responsable>`; con otro valor, `rol desconocido <valor>`. En ambos casos no cambia nada. Esto rompe el `anular` de hoy, que anulaba sin flag.
3. Texto de rechazo: `solo el responsable de sala puede anular` (en `anuladas`, `solo el responsable de sala puede ver las anuladas`). Sale en castellano, como pide la constitución.
4. Se guarda el rol que anuló (`responsable`), no una persona, en la propia reserva. La app guarda las reservas en memoria, así que no hay migración ni reservas anuladas antiguas.
5. `anuladas` es un comando nuevo (hoy no existe): el único consumidor del formato es él mismo, no rompe ninguna salida actual. Formato: `<sala> <día> — anulada por <rol>`, con raya larga; sin anuladas responde `sin anuladas`.
6. Anular una reserva ya anulada, ya cancelada o inexistente responde `sin reserva <sala> <día>`, como hoy: solo se anulan las activas, y quien anuló primero se conserva.
7. El nombre de la capacidad es `reservas`, no `bookings`: `PRODUCT.md` manda evitar «booking».
8. `cancelar` no cambia, y el cliente sigue cancelando lo suyo con él. La regla de 24 h de la Cancelación no está en el código y no se toca aquí.

### Hallazgos de la review

- **Aceptado** — Dominio 1: el `MODIFIED` no tenía capacidad viva → se declara `reservas` como capacidad nueva y el comando `anuladas` como `ADDED`.
- **Aceptado** — Dominio 2 y 3 (Crítico), Técnica 8: no quedaba claro cómo conviven `cancelar` y `anular` → decisión 8 y escenario de que `cancelar` no cambia.
- **Aceptado** — Dominio 4: faltaba lo prohibido de cada rol → escenarios de `anuladas` como cliente y decisión 3.
- **Aceptado** — Dominio 5, Técnica 2 (Crítico): `--como` ausente o inválido → decisiones 1 y 2 y sus escenarios.
- **Aceptado** — Dominio 6 y 8, Técnica 5 y 7 (Crítico): reglas, formato y dónde vive el dato sin declarar → «Reglas de la capacidad» y decisiones 3 a 5.
- **Aceptado** — Dominio 7, Técnica 3: casos de borde de la reserva → decisión 6 y escenarios.
- **Aceptado** — Técnica 1 (Crítico): un escenario con cadena de AND → separado en escenarios independientes.
- **Aceptado** — Técnica 4: el escenario no probaba que se guarda el rol → `anuladas` se ejecuta en una invocación aparte de `anular`.
- **Aceptado** — Técnica 9: el fichero de pruebas de `anuladas` → mismo `test/anular.test.js`, que `node --test` recoge.
- **Aceptado** — Técnica 10: nombre `reservas` → decisión 7.
- **Segunda ronda, aceptado** — Crítico 1 (`MODIFIED` sin base viva) → pasa a `ADDED` con la nota de que sustituye al `anular` de hoy; Crítico 2 (escenario doble) → un escenario por caso, con el de ya cancelada; 3 y 4 → escenarios de `sin anuladas` y de varias anuladas, y orden y estado final en «Reglas de la capacidad»; 5 → escenarios de `anuladas` sin rol y de `anular Sur mar --como cliente`, y orden de comprobaciones; 6 → `cancelar` ignora `--como` y responde `sin reserva` sobre una anulada; 8 → Intent y Scope; 10 → «Reglas de la capacidad» completas.
- **Segunda ronda, rechazado** — 6 (que un cliente no cancele lo de otro): las reservas no guardan dueño y `cancelar` no se toca. 7 (la premisa de que no hay anuladas antiguas): se leyó en `src/app.js`, las reservas viven en memoria. 9: igual que en la primera ronda.
- **Rechazado** — Dominio 9 («Laura» sería un dato personal): es el aprobador real del proyecto y no un ejemplo; los ejemplos del delta (Norte, lun) son inventados.
- **Rechazado** — Dominio 10 y Técnica 6 (separar el bloque de la review de las decisiones): ese bloque abre el ✋ por la forma del kit.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no. Además, el responsable ve qué reservas se anularon y por quién (el rol), con un listado nuevo, `anuladas`.

## Scope

- Entra: `anular` con `--como` obligatorio (rompe la invocación actual sin flag: quien hoy anula sin `--como` pasa a recibir `falta --como <cliente|responsable>`), el comando `anuladas` y el rol guardado.
- No entra: `cancelar`, que no se toca.

## Dónde se prueba

- Anular y anuladas: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, como `test/cancel.test.js`. `node --test` lo recoge.

## Reglas de la capacidad

- Dónde vive el dato: en la reserva, en memoria (`src/app.js`); no hay persistencia.
- Idioma de los nombres: castellano (`responsable`, `cliente`, `anulada por`, y los comandos `anular` y `anuladas`).
- Límites: dos roles, `cliente` y `responsable`; salas y días como hoy, sin validación nueva.
- Avisos: `falta --como <cliente|responsable>`, `rol desconocido <valor>`, `solo el responsable de sala puede anular`, `solo el responsable de sala puede ver las anuladas`, `sin reserva <sala> <día>` y `sin anuladas`.
- Conflicto: solo se anula una reserva activa; la primera anulación se conserva. Una anulada no pasa a cancelada ni vuelve a activa.
- Orden de comprobaciones, en `anular` y en `anuladas`: primero el rol (falta o desconocido), luego el permiso, luego el estado de la reserva.
- `anuladas` lista una por línea, en el orden en que se anularon.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — El responsable anula** (sustituye al `anular` de hoy, que no pedía rol; como no hay capacidad viva, no es un `MODIFIED`)
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada

**ADDED — El cliente no anula**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa

**ADDED — El cliente no anula ni lo que no existe**
- GIVEN Sur del mar sin reserva
- WHEN `anular Sur mar --como cliente`
- THEN responde `solo el responsable de sala puede anular`, no `sin reserva Sur mar`

**ADDED — `anular` sin rol**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun`
- THEN responde `falta --como <cliente|responsable>` y la reserva sigue activa

**ADDED — `anular` con rol desconocido**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como admin`
- THEN responde `rol desconocido admin` y la reserva sigue activa

**ADDED — No se anula una ya anulada**
- GIVEN Norte del lun anulada
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`

**ADDED — No se anula una inexistente**
- GIVEN Sur del mar sin reserva
- WHEN `anular Sur mar --como responsable`
- THEN responde `sin reserva Sur mar`

**ADDED — No se anula una ya cancelada**
- GIVEN Norte del lun cancelada con `cancelar Norte lun`
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun` y `anuladas --como responsable` responde `sin anuladas`

**ADDED — Listado de anuladas**
- GIVEN Norte del lun anulada con `anular Norte lun --como responsable` en una invocación anterior
- WHEN `anuladas --como responsable`
- THEN responde `Norte lun — anulada por responsable`

**ADDED — Varias anuladas, por orden de anulación**
- GIVEN Norte del lun anulada y después Norte del mar anulada, las dos como responsable
- WHEN `anuladas --como responsable`
- THEN responde dos líneas, `Norte lun — anulada por responsable` y `Norte mar — anulada por responsable`, en ese orden

**ADDED — Sin anuladas**
- GIVEN ninguna reserva anulada
- WHEN `anuladas --como responsable`
- THEN responde `sin anuladas`

**ADDED — El cliente no ve las anuladas**
- GIVEN Norte del lun anulada
- WHEN `anuladas --como cliente`
- THEN responde `solo el responsable de sala puede ver las anuladas` y no lista nada

**ADDED — Una anulación rechazada no deja rastro**
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente` y después `anuladas --como responsable`
- THEN `anuladas` responde `sin anuladas`

**ADDED — `anuladas` sin rol o con rol desconocido**
- GIVEN cualquier estado
- WHEN `anuladas`, o `anuladas --como admin`
- THEN responde `falta --como <cliente|responsable>`, o `rol desconocido admin`

**ADDED — `cancelar` no cambia**
- GIVEN la reserva activa de Norte del lun
- WHEN `cancelar Norte lun`
- THEN responde `cancelada Norte lun`, sin pedir `--como` (`cancelar` ignora `--como` si llega)
- AND con Norte del lun ya anulada, `cancelar Norte lun` responde `sin reserva Norte lun`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
