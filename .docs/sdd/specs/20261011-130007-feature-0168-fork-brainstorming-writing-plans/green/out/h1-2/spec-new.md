---
id: 20261011-135546-feature-0012-libres-planta
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

🦆 Hoy, al pedir las salas libres de una franja, salen todas las que no están reservadas, estén en la planta que estén. Con la nueva opción de planta, pedir las libres de 10:00-12:00 en la planta 2 enseña solo las libres de esa planta: con Norte (planta 1) reservada y Sur (planta 2) libre, saldría Sur; en la planta 1 no saldría ninguna. Sin la opción, el listado es el de siempre, con todas las salas. Para saber qué sala está en qué planta, cada sala pasa a llevar su planta.

## Capacidades

- Nuevas: `free-rooms` — qué salas están libres en una franja y cómo se filtra ese listado (hoy el comportamiento existe en el código, pero no tiene capacidad escrita).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (1 de 8) · tamaño: ~25 líneas en 2 ficheros
- Mínimo razonable: ninguna — deja sin mirar solo si la planta de Norte y Sur coincide con la real; es el único dato que la spec inventa y está en la decisión 1.

1. **Planta de cada sala: Norte en la planta 1 y Sur en la planta 2.** Nadie lo dijo y el código no guarda la planta de ninguna sala; son valores de partida que habrá que corregir si no coinciden con el coworking. Es la decisión que más conviene que leas.
2. **La planta es un número entero**: `--planta 1`, `--planta 2`. No admito nombres («baja», «primera») porque el glosario no los define.
3. **Dónde va la opción**: `salas libres 10:00-12:00 --planta 2`. La franja sigue siendo el primer argumento que no es la opción; `salas libres --planta 2 10:00-12:00` da el mismo resultado.
4. **Planta sin salas** (por ejemplo `--planta 7`): el listado sale vacío, igual que cuando no queda ninguna sala libre. No invento un texto nuevo para eso.
5. **Valor que no es un entero** (`--planta` sin valor, `--planta abc`, `--planta 1.5`): se responde con el texto literal `planta no válida: usa un número entero, p. ej. --planta 1` y no se lista nada.
6. **Capacidad nueva `free-rooms`** (slug en inglés, kebab-case): el proyecto no tiene capacidades escritas, así que el delta documenta también el listado por franja que ya existe (requisito «Listado de libres por franja») para que el filtro no quede suelto. Ese requisito describe lo que hace hoy el código; no lo cambia.
7. **«Planta» entra en el glosario** de `PRODUCT.md` al cerrar: una planta del edificio, a la que pertenece cada sala. Evitar: «piso», «floor».
8. **Sin review de la spec**: 1 señal de 8 y un delta de unas 25 líneas; el nivel por defecto es ninguno.

### Decisiones tomadas con el dev-lead

- Perfil `delegate`, el del proyecto, sin cambiarlo — «Perfil delegate».
- La opción se llama `--planta` — «la opción se llama --planta».
- Sin `--planta`, lista todas las salas — «sin --planta, lista todas las salas».
- Spec aprobada por delegación, con parada antes de implementar — «Apruebo la spec por delegación, nos vemos en la validación: escribe la spec y el plan y para antes de implementar» (2026-10-11).

## Intent

`salas libres <franja>` lista las salas sin reserva en esa franja, de todas las plantas. Quien está en una planta y quiere una sala sin cambiar de planta tiene que descartar a mano las que no son de la suya. Se quiere poder pedir las libres de una sola planta, sin cambiar lo que pasa cuando no se pide.

## Scope

- Entra: opción `--planta <n>` en `libres`; cada sala con su planta; capacidad `free-rooms`; término «Planta» en el glosario.
- No entra: filtrar por planta en `reservar`, `cancelar` o `anular`; nombres de planta; más de una planta en una misma orden; mostrar la planta en el listado; guardar plantas fuera del código (las reservas y las salas siguen en memoria).

## Approach

`libres` acepta `--planta <n>` además de la franja. Con la opción, el listado se limita a las salas libres cuya planta es `<n>`; sin ella, no cambia. La planta de cada sala se declara junto a las salas, en `src/app.js`.

## Dónde se prueba

- Libres con y sin planta, planta sin salas y valor no válido: por `run('libres', [...])`, como los tests actuales de `test/app.test.js`.

## Términos y ADR

- Términos resueltos: Planta — la planta del edificio a la que pertenece una sala. Evitar: «piso», «floor».
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `free-rooms`

**ADDED — Listado de libres por franja**
- GIVEN Norte reservada de 10:00-12:00 y Sur sin reservas
- WHEN se pide `libres 10:00-12:00`
- THEN sale `Sur`

**ADDED — Filtro por planta**
- GIVEN Norte en la planta 1, Sur en la planta 2, ninguna reservada en 14:00-16:00
- WHEN se pide `libres 14:00-16:00 --planta 2`
- THEN sale `Sur`
- AND con `--planta 1` sale `Norte`

**ADDED — Sin planta, todas las salas**
- GIVEN Norte en la planta 1, Sur en la planta 2, ninguna reservada en 14:00-16:00
- WHEN se pide `libres 14:00-16:00` sin `--planta`
- THEN sale `Norte, Sur`

**ADDED — El filtro de planta respeta las reservas**
- GIVEN Norte (planta 1) reservada de 10:00-12:00 y Sur (planta 2) sin reservas
- WHEN se pide `libres 10:00-12:00 --planta 1`
- THEN no sale ninguna sala (listado vacío)

**ADDED — Planta sin salas**
- GIVEN solo hay salas en las plantas 1 y 2
- WHEN se pide `libres 14:00-16:00 --planta 7`
- THEN el listado sale vacío

**ADDED — Planta no válida**
- GIVEN cualquier estado de reservas
- WHEN se pide `libres 14:00-16:00 --planta abc`
- THEN sale `planta no válida: usa un número entero, p. ej. --planta 1`
- AND con `--planta` sin valor sale el mismo texto

**ADDED — Opción antes de la franja**
- GIVEN Norte en la planta 1, Sur en la planta 2, ninguna reservada en 14:00-16:00
- WHEN se pide `libres --planta 2 14:00-16:00`
- THEN sale `Sur`

**Reglas de la capacidad**
- **Dónde viven los datos**: la planta de cada sala va en el código, junto a la lista de salas; las reservas siguen en memoria.
- **Idioma de los nombres**: la opción es `--planta`; el término del producto es «planta».
- **Límites**: una sola planta por orden; la planta es un entero.
- **Avisos**: `planta no válida: usa un número entero, p. ej. --planta 1`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | <git-user> | 2026-10-11 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
