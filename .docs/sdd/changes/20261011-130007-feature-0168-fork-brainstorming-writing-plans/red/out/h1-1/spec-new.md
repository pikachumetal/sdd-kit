---
id: 20261011-132123-feature-0012-libres-por-planta
feature: 0012
title: Filtrar las salas libres por planta
mode: full
profile: delegate
status: approved
created: 2026-10-11
author: <git-user>
approvers:
  - role: dev-lead
    name: <git-user>
    approved_at: 2026-10-11
---

# Spec — Filtrar las salas libres por planta

🦆 Hoy `libres 14:00-16:00` enseña todas las salas libres en esa franja. Con esta feature se podrá escribir `libres 14:00-16:00 --planta 2` y ver solo las libres de la planta 2 (`Sur`); sin `--planta` sigue saliendo `Norte, Sur`, como ahora. Cada sala pasa a tener una planta en los datos en memoria y el comando filtra por ella.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja, con el filtro por planta.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (1) · tamaño: ~25 líneas en 2 ficheros (`src/app.js` y un test nuevo).
- Mínimo razonable: ninguna — no deja nada sin mirar que supere el coste de un revisor, porque el delta es una opción de un comando sobre datos en memoria.

1. **La planta de cada sala: `Norte` en la planta 1 y `Sur` en la planta 2.** El código y la documentación no dicen en qué planta está cada sala; es un valor inventado por mí para poder escribir los escenarios. **Corrígelo si no es así**: es el dato que más pesa de la spec, y los tests de la Task 1 lo usan.
2. **Forma de la opción: `--planta <número>`**, con el número como valor separado (`--planta 2`), no `--planta=2`. Sigue el estilo de `--cada-semana`, que ya es una opción con guion doble. Se admite antes o después de la franja (`libres --planta 2 14:00-16:00`).
3. **Planta sin salas: `sin salas en la planta 5`.** Distingue «esa planta no existe» de «no queda ninguna libre», que hoy sale como línea vacía y se mantiene.
4. **`--planta` sin número: `falta el número de planta`.** En vez de listar todo en silencio.
5. **Capacidad nueva `room-availability`.** `libres` (feature 0006) nunca llegó a `capabilities/`; la capacidad nace aquí con ese requisito base y el nuevo, ambos `ADDED`. El slug lo valida el dev-lead al aprobar.
6. **Sin cambios en PRODUCT.md ni README.md.** «Planta» no entra en Terminology: no ha salido de la entrevista y no hay un término que evitar que yo sepa.
7. **Una sola task.** Una superficie (`src/app.js`), sin migración: no procede partir.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»
- Spec aprobada por delegación; validación presencial después — «Apruebo la spec por delegación, nos vemos en la validación» (2026-10-11)
- Escribir spec y plan y parar antes de implementar — «escribe la spec y el plan y para antes de implementar»

## Intent

Hoy `libres <franja>` enseña todas las salas libres sin importar dónde estén. Con salas en varias plantas, quien quiere reservar sin cambiar de planta tiene que leer la lista entera. La opción `--planta` deja pedir solo las de una planta.

## Scope

- Entra: la opción `--planta <número>` en `libres`; la planta como dato de cada sala; los dos mensajes de error de los puntos 3 y 4.
- No entra: filtrar `reservar`, `cancelar` o `anular` por planta; mostrar la planta en la salida de `libres`; dar de alta salas o plantas desde la línea de comandos; validar el formato de la franja (deuda técnica ya anotada en el roadmap).

## Approach

`libres` lee las opciones de sus parámetros antes de tomar la franja. Con `--planta`, filtra las salas por su planta antes de quitar las ocupadas en la franja; sin ella, el resultado es el de hoy.

## Dónde se prueba

- `libres` con y sin `--planta`, y los dos mensajes: por `run('libres', [...])`, como los tests de `test/app.test.js`; fichero nuevo `test/floor.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

**ADDED — Salas libres en una franja**
- GIVEN las salas `Norte` y `Sur`, y `Norte` reservada el lunes de 10:00-12:00
- WHEN se ejecuta `libres 10:00-12:00`
- THEN sale `Sur`

**ADDED — Salas libres de una planta**
- GIVEN `Norte` en la planta 1, `Sur` en la planta 2, y `Norte` reservada de 10:00-12:00
- WHEN se ejecuta `libres 14:00-16:00 --planta 2`
- THEN sale `Sur`
- AND `libres 14:00-16:00 --planta 1` saca `Norte`
- AND `libres 14:00-16:00` sin `--planta` saca `Norte, Sur`
- AND `libres --planta 2 14:00-16:00` saca lo mismo que `libres 14:00-16:00 --planta 2`

**ADDED — Planta con todas las salas ocupadas**
- GIVEN `Norte` en la planta 1, reservada de 10:00-12:00
- WHEN se ejecuta `libres 10:00-12:00 --planta 1`
- THEN sale una línea vacía, como hoy cuando no queda ninguna libre

**ADDED — Planta sin salas**
- GIVEN que ninguna sala está en la planta 5
- WHEN se ejecuta `libres 14:00-16:00 --planta 5`
- THEN sale `sin salas en la planta 5`

**ADDED — Planta sin número**
- GIVEN cualquier estado
- WHEN se ejecuta `libres 14:00-16:00 --planta`
- THEN sale `falta el número de planta`

**Reglas de la capacidad**
- **Dónde viven los datos**: en memoria, en `src/app.js`, la planta junto a cada sala (`operations.md`: sin base de datos)
- **Idioma de los nombres**: castellano (Art. 4 de la constitution); la opción es `--planta`
- **Límites**: no aplica
- **Avisos**: `sin salas en la planta <n>` y `falta el número de planta`
- **Regla ante conflicto**: no aplica

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | <git-user> | 2026-10-11 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
