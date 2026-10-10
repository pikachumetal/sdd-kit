---
id: 20261010-114840-feature-0012-libres-por-planta
feature: 0012
title: Filtrar las salas libres por planta
mode: full
status: draft
created: 2026-10-10
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Filtrar las salas libres por planta

🦆 Hoy `salas libres 10:00-12:00` enseña todas las salas libres en esa franja, estén en la planta que estén. Con `--planta 2` solo enseñará las libres de la planta 2: si Norte y Sur están libres y solo Sur está en la planta 2, el resultado es `Sur`. Sin `--planta` el comando se comporta como hasta ahora. Para poder filtrar, cada sala pasa a tener una planta anotada.

> **Estado**: draft
> **Siguiente paso**: aprobación de la spec → `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran (`salas libres`).
- Modificadas: ninguna (el repo aún no tiene `capabilities/`; el comportamiento vigente de `libres` no está escrito en ninguna capacidad).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (1 de 8) · tamaño: ~15 líneas en 2 ficheros
- Mínimo razonable: ninguna — deja sin mirar solo si el delta contradice reglas de negocio ya escritas, y no hay `capabilities/` ni «Reglas de producto» con las que contrastarlo.

Las dos primeras salen de ti; el resto son mías:

1. **(tuya)** La opción se llama `--planta`.
2. **(tuya)** Sin `--planta`, `libres` lista todas las salas libres, como hoy.
3. **Planta de cada sala: Norte → 1, Sur → 2.** Nadie me ha dicho en qué planta está cada sala: el código solo tiene los nombres. **Corrígeme los valores reales**; los ejemplos de los escenarios usan estos.
4. **Dónde vive el dato**: la planta se anota junto a cada sala en `src/app.js` (no hay base de datos, `operations.md`: las reservas viven en memoria). Una sala sin planta anotada nunca sale con `--planta`.
5. **Forma del valor**: `--planta <número>`, p. ej. `--planta 2`. La planta se compara como texto exacto («2» = «2»); no hay `--planta=2`.
6. **Orden de los argumentos**: `--planta` puede ir antes o después de la franja (`libres 10:00-12:00 --planta 2` o `libres --planta 2 10:00-12:00`). La franja es el argumento que no es la opción ni su valor.
7. **Planta sin salas**: `salas libres 10:00-12:00 --planta 9` responde `sin salas en la planta 9`. Así no se confunde con «hay salas en esa planta, pero están todas reservadas», que sigue dando la salida vacía de hoy.
8. **`--planta` sin valor** (`libres 10:00-12:00 --planta`) responde `falta el número de planta`, sin listar nada.
9. **Capacidad nueva `room-availability`**: como `libres` no estaba en ninguna capacidad, la creo con sus dos requisitos nuevos; el comportamiento previo (excluir salas reservadas en la franja) no lo reescribo aquí, no cambia.
10. **Término nuevo «Planta»**: se propone añadirlo a `PRODUCT.md` en el cierre (ver «Términos y ADR»).

## Intent

`salas libres <franja>` devuelve todas las salas libres de la franja. Cuando el coworking tiene salas en varias plantas, quien busca sitio quiere ver solo las de la suya. Se quiere poder acotar el listado a una planta sin cambiar lo que hace el comando sin la opción.

## Scope

- Entra: la opción `--planta <número>` en `libres`; anotar la planta de cada sala; los dos mensajes de error de las decisiones 7 y 8; tests.
- No entra: filtrar por otra cosa (aforo, equipamiento); mostrar la planta en la salida; `--planta` en `reservar`, `cancelar` o `anular`; validar el formato de la franja (deuda técnica ya registrada en el roadmap); guardar plantas fuera del código.

## Approach

`libres` obtiene las salas libres de la franja como hoy y, si recibe `--planta`, las reduce a las de esa planta antes de enseñarlas. Cada sala lleva su planta anotada junto a su nombre.

## Dónde se prueba

- Filtro por planta, sin `--planta`, planta sin salas y `--planta` sin valor: llamando a `run('libres', [...])`, como el test existente «libres excluye la sala reservada en la franja», en `test/app.test.js`.

## Términos y ADR

- Términos resueltos: Planta — piso del edificio en el que está una sala; `--planta` es la opción que acota `libres` a un piso. _Evitar_: piso, nivel.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

**ADDED — Libres sin filtro de planta**
- GIVEN salas Norte (planta 1) y Sur (planta 2); Norte reservada el lunes 10:00-12:00, Sur libre
- WHEN `salas libres 10:00-12:00` (sin `--planta`)
- THEN la salida es `Sur`
- AND con ninguna sala reservada en la franja, `salas libres 14:00-16:00` da `Norte, Sur`

**ADDED — Libres filtradas por planta**
- GIVEN salas Norte (planta 1) y Sur (planta 2), ambas libres en 14:00-16:00
- WHEN `salas libres 14:00-16:00 --planta 2`
- THEN la salida es `Sur`
- AND `salas libres 14:00-16:00 --planta 1` da `Norte`
- AND `salas libres --planta 2 14:00-16:00` da `Sur`

**ADDED — Planta filtrada con todas las salas ocupadas**
- GIVEN Norte (planta 1) reservada en 10:00-12:00, Sur (planta 2) libre
- WHEN `salas libres 10:00-12:00 --planta 1`
- THEN la salida es vacía, igual que hoy cuando no hay ninguna libre

**ADDED — Planta sin salas**
- GIVEN salas solo en las plantas 1 y 2
- WHEN `salas libres 10:00-12:00 --planta 9`
- THEN la salida es `sin salas en la planta 9`

**ADDED — Opción de planta sin valor**
- GIVEN cualquier estado de reservas
- WHEN `salas libres 10:00-12:00 --planta`
- THEN la salida es `falta el número de planta`

**Reglas de la capacidad**
- **Dónde viven los datos**: la planta de cada sala está anotada en el código de la aplicación, junto al nombre de la sala.
- **Idioma de los nombres**: `--planta` y los avisos, en castellano (constitution, art. 4).
- **Límites**: no aplica.
- **Avisos**: `sin salas en la planta <valor>` · `falta el número de planta`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
