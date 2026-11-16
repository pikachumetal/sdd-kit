---
id: 20261011-134908-feature-0012-libres-por-planta
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

🦆 Hoy `salas libres 14:00-16:00` enseña todas las salas libres en esa franja, estén en la planta que estén. Con `salas libres 14:00-16:00 --planta 1` solo enseña las de la planta 1 (por ejemplo, Norte); sin `--planta` todo sigue igual que ahora. Para poder filtrar, cada sala pasa a tener una planta: Norte en la 1 y Sur en la 2. Si pides una planta que no tiene salas, te lo dice en vez de enseñar una línea vacía.

> **Estado**: approved por delegación. **Siguiente paso**: `plan.md`; se para antes de implementar.

## Capacidades

- Nuevas: `free-rooms` — listado de salas libres por franja, con el filtro por planta.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`free-rooms`) · tamaño: ~25 líneas en 1 fichero de código y 1 de tests. Con 1 señal de 8 la rúbrica no propone review; la decide el agente, sin preguntar, por la spec delegada.

1. **Planta de cada sala: Norte → 1, Sur → 2.** Hoy las salas no tienen planta; el dato lo invento yo y es el que hay que corregir si no es el real. Vive junto a la lista de salas, en memoria.
2. **Forma del argumento: `--planta <n>`, con `<n>` un número entero positivo, en cualquier posición respecto a la franja** (`libres --planta 1 14:00-16:00` y `libres 14:00-16:00 --planta 1` dan lo mismo). No admito `--planta=1`. Hoy la franja es el primer argumento posicional; basta con ignorar la opción y su valor al buscarla.
3. **Planta sin salas** (p. ej. `--planta 3`): responde `no hay salas en la planta 3`, no una línea vacía.
4. **`--planta` sin valor o con un valor que no es un número entero positivo** (`--planta`, `--planta x`): responde `falta el número de planta`.
5. **Planta con salas pero ninguna libre en la franja** (p. ej. `libres 10:00-12:00 --planta 1`): se mantiene el comportamiento actual de `libres` cuando no queda ninguna, que es una línea vacía. Cambiarlo afectaría también a `libres` sin `--planta` y no me lo pediste.
6. **«Sin `--planta`, lista todas las salas» lo leo como «todas las salas libres en la franja»**, es decir, el comportamiento actual intacto, no una lista de salas con su estado.
7. **Capacidad nueva `free-rooms`** (nombre en inglés kebab-case): el proyecto no tiene `capabilities/`. Recoge como primer requisito el listado actual de la task 0006 (para que el filtro tenga a qué modificar) y como segundo el filtro de esta feature.
8. **Sin review de spec ni cambios de `libres` más allá de la planta**: no toco que `libres` ignore el día al decidir si una sala está libre (comportamiento vigente, fuera de alcance).

### Decisiones tomadas con el dev-lead

- Nombre de la opción: `--planta` — «la opción se llama --planta»
- Sin `--planta`, se listan todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»
- Aprobación de esta spec por delegación (2026-10-11) — «Apruebo la spec por delegación, nos vemos en la validación: escribe la spec y el plan y para antes de implementar»

## Intent

Quien reserva una sala suele saber en qué planta está su equipo, y `libres` le enseña salas de todas las plantas. Se quiere poder restringir el listado a una planta con una opción, sin cambiar nada para quien no la use.

## Scope

- Entra: la opción `--planta <n>` en `libres`; la planta como dato de cada sala; los avisos de planta sin salas y de valor ausente o inválido.
- No entra: filtrar `reservar`, `cancelar` o `anular` por planta; mostrar la planta en el listado; varias plantas a la vez; cambiar la lógica de «libre» (el día sigue sin intervenir); validar el formato de la franja (deuda técnica del roadmap).

## Approach

`libres` separa la opción `--planta` y su valor del resto de argumentos, toma la franja del que queda y filtra por planta las salas libres que ya calculaba. Cada sala declara su planta. El cómo exacto está en `plan.md`.

## Dónde se prueba

- Listado de libres con y sin `--planta`, y los dos avisos: por `run('libres', [...])`, en `test/app.test.js`, como el test actual de `libres`.

## Términos y ADR

- Términos resueltos: planta — el nivel del edificio en que está una sala; se pide con `--planta <n>`.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `free-rooms`

**ADDED — Listar las salas libres de una franja**
- GIVEN las salas Norte (planta 1) y Sur (planta 2), y una reserva activa de Norte en la franja `10:00-12:00`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN responde `Sur`
- AND con `libres 14:00-16:00` responde `Norte, Sur`

**ADDED — Filtrar las salas libres por planta**
- GIVEN las salas Norte (planta 1) y Sur (planta 2), y una reserva activa de Norte en la franja `10:00-12:00`
- WHEN se ejecuta `libres 14:00-16:00 --planta 1`
- THEN responde `Norte`
- AND `libres 14:00-16:00 --planta 2` responde `Sur`
- AND `libres --planta 1 14:00-16:00` responde `Norte`, igual que con la opción detrás
- AND `libres 10:00-12:00 --planta 2` responde `Sur`
- AND `libres 10:00-12:00 --planta 1` responde una línea vacía, porque Norte está reservada en esa franja
- AND `libres 14:00-16:00 --planta 3` responde `no hay salas en la planta 3`
- AND `libres 14:00-16:00 --planta` y `libres 14:00-16:00 --planta x` responden `falta el número de planta`
- AND `libres 14:00-16:00`, sin `--planta`, sigue respondiendo `Norte, Sur`

**Reglas de la capacidad**
- **Dónde viven los datos**: la planta de cada sala vive junto a la lista de salas, en memoria (sin base de datos, `operations.md`).
- **Idioma de los nombres**: castellano (`--planta`).
- **Límites**: una sola planta por consulta.
- **Avisos**: `no hay salas en la planta <n>` · `falta el número de planta`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

_Sin enmiendas._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | <git-user> | 2026-10-11 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
