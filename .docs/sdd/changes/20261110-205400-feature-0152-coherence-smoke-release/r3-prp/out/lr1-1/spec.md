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

Review de spec: un revisor (lite), ejecutado en sonnet con los siete puntos, más una segunda ronda por un Crítico aceptado — señales: capacidad nueva (`rooms`, la primera de `capabilities/`) · tamaño: ~10 líneas en 2 ficheros

1. Capacidad nueva `rooms` (inglés, kebab-case): no existe `capabilities/`, esta spec crea la primera con este requisito.
2. El mensaje es `falta la franja: libres <franja>`, texto literal con los `<>`: lo he elegido yo, nadie fijó el texto; va en castellano (constitución, art. 4) y dice el comando que falta completar.
3. Es una respuesta normal de `run`, no un error: mismo tipo de salida que hoy, solo cambia el texto.
4. Una franja mal formada (`libres 25:00`) no entra: ya está en la deuda («Sin validación del formato de franja horaria»).
5. Reglas de la capacidad:
   - Dónde viven los datos: no aplica, sin datos nuevos.
   - Idioma de los nombres: castellano.
   - Límites: no aplica, sin valores nuevos.
   - Avisos: el propio mensaje.
   - Regla de conflicto: no aplica; `libres` no recibe día, aunque la reserva lo tenga: una reserva activa en la franja ocupa la sala.

### Hallazgos de la review

- **Rechazado** — Crítico: el ADDED debería ser MODIFIED → no hay capacidad previa que modificar: `rooms` nace con este cambio; el comportamiento de hoy queda dicho en el Intent.
- **Aceptado** — Crítico: el GIVEN no fija el dato ni el día → el GIVEN fija la reserva y dice que `libres` no recibe día.
- **Aceptado** — el THEN literal ambiguo → exactamente ese texto, sin `Norte` ni `Sur`.
- **Aceptado** — el Intent promete más que el Scope → el Intent se recorta y `reservar` va a «No entra».
- **Aceptado** — decisiones sin listar (respuesta normal, franja mal formada) → decisiones 3 y 4.
- **Aceptado** — las cinco reglas sin declarar → decisión 5.
- **Aceptado** — un escenario mezcla dos requisitos → el de `libres <franja>` sale del delta (segunda ronda).
- **Rechazado** — escenario con todas las salas libres → es comportamiento de hoy que no cambia.
- **Aceptado** — el AND sin prueba declarada → entra en «Dónde se prueba».
- **Aceptado** — review que parecía hecha → el bloque dice «ejecutado».
- **Rechazado** — «PRODUCT.md no existe» → existe en la raíz del repo, no en `steering/`.

Segunda ronda:

- **Aceptado** — Crítico: el cruce franja/reserva sin día no estaba dicho → lo dice la decisión 5 y el GIVEN.
- **Aceptado** — el escenario de `libres <franja>` es comportamiento de hoy, no un ADDED → sale del delta y queda como regresión en «Dónde se prueba».
- **Aceptado** — `rooms` nace parcial → el Scope declara que se completa en cambios posteriores.
- **Rechazado** — el contrato de salida de `libres` (separador, orden) como requisito base → es comportamiento de hoy que este cambio no toca.
- **Rechazado** — test del literal con `<>` → el THEN ya es exacto y `assert.equal` compara el texto entero.
- **Rechazado** — sustituir a Laura por un rol → es la aprobadora que figura en la spec, sin dato real que proteger.

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas — «sí, lite»

## Intent

Hoy `libres` sin franja responde `Norte, Sur`, como si las dos estuvieran libres a cualquier hora. Pasa a decir qué falta, para que nadie tome ese listado por salas libres.

## Scope

- Entra: `libres` sin franja, en `run` de `src/app.js`.
- No entra: `libres <franja>`, que responde igual que hoy; `reservar` y el resto de comandos.
- `rooms` nace con este único requisito y se completa en cambios posteriores.

## Dónde se prueba

- El mensaje: por `run('libres', [])`, en `test/app.test.js`.
- Regresión, no requisito: `libres <franja>` sigue igual, por `run('libres', ['10:00-12:00'])` → `Sur`, que ya está en `test/app.test.js`.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — libres sin franja dice qué falta

- GIVEN el catálogo de `src/app.js`: salas Norte y Sur, y una reserva activa de Norte el lunes de 10:00 a 12:00 (`libres` no recibe día)
- WHEN `libres` sin franja
- THEN responde exactamente `falta la franja: libres <franja>`, sin `Norte` ni `Sur`

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
