---
id: 20261008-170000-feature-0019-free-without-slot
feature: 0019
title: libres sin franja dice qué falta
mode: lite
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — libres sin franja dice qué falta

## Capacidades

- Nuevas: `rooms` — `libres` sin franja dice qué falta en vez de listar todas las salas.

## ✋ Decisiones que he tomado yo — valida estas

1. El mensaje es `falta la franja: libres <franja>`: dice qué falta y cómo se escribe el comando, con la forma de uso de las respuestas de `cancelBooking` en `src/app.js` (`sin reserva <sala> <día>`). No hay guía de mensajes en el repo; el texto exacto lo he elegido yo: valídalo aquí. Es un literal en `run`, en castellano (constitución, regla 4); no hay límites, avisos ni conflicto (no aplica).
2. El caso sin franja se detecta por `params[0]` ausente; una franja vacía (`libres ''`) o mal formada (`libres abc`) sigue como hoy, es decir, responde `Norte, Sur` (deuda ya apuntada: «Sin validación del formato de franja horaria»).
3. (Verificación, no decisión.) Pasada del delta sobre una copia de `.docs/sdd`: `capability merge` → `rooms.md: añadido «libres sin franja dice qué falta»`, sin rechazos. El repo no cambia.

### Hallazgos de la review

1. **Rechazado** — Crítico: el cambio es un MODIFIED, no un ADDED → `rooms` no existe en `capabilities/`, así que no hay requisito base que modificar y `capability merge` rechazaría un MODIFIED; ADDED es lo correcto. El comportamiento previo queda descrito en el Intent.
2. **Aceptado** — Crítico: el GIVEN mencionaba «el lunes», que `libres` no recibe → quitado el día; salida exacta por `run('libres', [])`; la regresión va como AND, porque el merge no admite un segundo escenario con encabezado propio.
3. **Aceptado** — la regresión de `libres <franja>` salía en el delta pero no en Scope → ahora está en Scope y en «Dónde se prueba», y como AND del escenario.
4. **Aceptado** — franja vacía o mal formada sin definir → decisión 2 dice la salida (`Norte, Sur`).
5. **Aceptado en parte** — cinco reglas → una línea en la decisión 1 (literal en `run`, castellano, resto no aplica).
6. **Aceptado** — fuente del ejemplo de uso y validación explícita del texto → decisión 1 cita `cancelBooking` y pide tu validación.
7. **Aceptado** — la pasada del merge no es una decisión → marcada como verificación (queda en ✋ porque el kit lo exige ahí).
8. **Aceptado** — tests existentes con `Norte, Sur` → comprobado que no hay ninguno; dicho en Scope.
9. **Rechazado** — nombres y aprobador: Laura es la aprobadora del proyecto y es un dato del fixture; las cinco condiciones de lite están citadas en la decisión del dev-lead.
10. **Rechazado** — confianza alta: los puntos abiertos (día, franja vacía, tests) están cerrados arriba.

#### Segunda ronda (tras aceptar un Crítico)

1. **Aceptado** — el GIVEN fijaba una reserva que el THEN principal no usa → la reserva pasa al AND.
2. **Rechazado** — pinnear `libres ''` con un escenario consagraría el defecto; queda explícitamente fuera de verificación (deuda existente).
3. **Rechazado** — enumerar las cinco condiciones de lite: constan en la decisión literal del dev-lead.
4. **Rechazado** — `rooms.md` se crea con este delta y solo recoge el requisito nuevo; el comportamiento previo está en el Intent.
5. **Rechazado** — el formato `10:00-12:00` no va en el mensaje: es la forma que tú validas en la decisión 1.
6. **Aceptado** — gate `node --test` entero y franja inválida declarada fuera en «Dónde se prueba».
7. **Rechazado** — mismo motivo que el hallazgo 9 de la primera ronda.

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas — «sí, lite»

## Intent

Hoy `libres` sin franja responde `Norte, Sur`, como si las dos estuvieran libres a cualquier hora: quien lo escribe sin franja reserva una sala ocupada.

## Scope

- Entra: `libres` sin franja, en `run` de `src/app.js`.
- No entra: cambiar `libres <franja>`, que responde igual que hoy; su regresión la cubre el test existente. Ningún test actual afirma `Norte, Sur` para `libres` sin franja, así que no hay test que actualizar.

## Dónde se prueba

- El mensaje: por `run('libres', [])`, en `test/app.test.js`.
- La regresión: el test existente `libres excluye la sala reservada en la franja` (`run('libres', ['10:00-12:00'])` → `Sur`); debe seguir en verde con `node --test` entero (constitución, regla 2).
- Fuera de verificación: la franja vacía o mal formada (deuda ya apuntada); no se fija con test para no consagrar `Norte, Sur`.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — libres sin franja dice qué falta

- GIVEN el catálogo de `src/app.js`
- WHEN `libres` sin franja, es decir, `run('libres', [])`
- THEN responde exactamente `falta la franja: libres <franja>`, tenga o no reservas el catálogo
- AND, con Norte reservada de 10:00 a 12:00, `run('libres', ['10:00-12:00'])` sigue respondiendo `Sur` (regresión: con franja nada cambia)

### Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec: 0,2 h
- Estimación de implementación: 0,5 h
- Base de la estimación: una rama en `run` y su test
- Confianza: alta

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
