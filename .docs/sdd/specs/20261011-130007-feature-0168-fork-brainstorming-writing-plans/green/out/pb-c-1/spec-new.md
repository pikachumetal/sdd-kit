---
id: 20261011-140429-feature-0012-libres-planta
feature: 0012
title: Filtrar las salas libres por planta
mode: full
profile: delegate
status: draft
created: 2026-10-11
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Filtrar las salas libres por planta

🦆 Hoy `libres 10:00-12:00` lista todas las salas libres en esa franja, sin importar en qué planta están. Con la opción `--planta`, `libres 10:00-12:00 --planta 1` solo enseña las libres de la planta 1; sin la opción, todo sigue como hoy. Cada sala pasa a tener una planta asignada, y ese dato es lo único nuevo que hay que validar.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran (planta).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (1 de 8) · tamaño: ~15 líneas en 1 fichero + tests
- Mínimo razonable: ninguna — nada que recortar.

1. **Plantas asignadas: Norte → planta 1, Sur → planta 2.** Es un dato que nadie me dio y que tienes que corregir si no es así.
2. **Capacidad nueva `room-availability`.** `capabilities/` está vacío; el comportamiento de `libres` que ya existe (sin filtro) se documenta en ella junto con el filtro nuevo.
3. **Forma del comando: `libres <franja> --planta <número>`;** la opción puede ir antes o después de la franja.
4. **Planta sin salas** (`libres 10:00-12:00 --planta 3`): responde `sin salas en la planta 3`, distinto de la lista vacía que da hoy cuando todas las salas de la franja están ocupadas.
5. **`--planta` sin valor** (`libres 10:00-12:00 --planta`): responde `falta el número de planta`.
6. **Sin salas libres en una planta que sí tiene salas** (todas ocupadas): lista vacía, igual que hoy sin filtro.
7. **Término «planta»** en `PRODUCT.md` (Terminology): piso de la oficina donde está una sala. Evitar: «piso», «floor».

### Decisiones tomadas con el dev-lead

- Filtrar las libres por planta con la opción `--planta` — «filtrar libres por planta con la opción --planta»
- Sin `--planta`, lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `libres` no distingue plantas: quien busca sala en una planta concreta tiene que descartar a ojo las de las demás. Se quiere poder pedir solo las libres de una planta, sin cambiar lo que ya hace el comando.

## Scope

- Entra: asignar una planta a cada sala; la opción `--planta` en `libres`; documentar `libres` en la capacidad `room-availability`; el término «planta» en `PRODUCT.md`.
- No entra: filtrar por día; filtrar `reservar`, `cancelar` o `anular` por planta; mostrar la planta en la salida; plantas con nombre (solo números).

## Approach

`libres` acepta `--planta <número>`. Con ella, de las salas libres en la franja solo se enseñan las de esa planta; sin ella, comportamiento actual. Cada sala lleva su planta como dato fijo, igual que hoy la lista de salas.

## Dónde se prueba

- `libres` con y sin `--planta`, y los dos avisos: por `run('libres', …)`, como el test existente de `test/app.test.js`; sin captura (no hay pantalla).

## Términos y ADR

- Términos resueltos: planta — piso de la oficina donde está una sala (evitar «piso», «floor»).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `room-availability`

**ADDED — Libres en una franja**
- GIVEN reserva activa de Norte a las 10:00-12:00 y salas Norte (planta 1) y Sur (planta 2)
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`

**ADDED — Libres de una planta**
- GIVEN salas Norte (planta 1) y Sur (planta 2), sin reservas en 14:00-16:00
- WHEN `libres 14:00-16:00 --planta 1`
- THEN responde `Norte`
- AND `libres --planta 1 14:00-16:00` responde lo mismo

**ADDED — Sin filtro de planta lista todas**
- GIVEN salas Norte (planta 1) y Sur (planta 2), sin reservas en 14:00-16:00
- WHEN `libres 14:00-16:00`
- THEN responde `Norte, Sur`

**ADDED — Planta con salas ocupadas**
- GIVEN reserva activa de Norte a las 10:00-12:00 y Norte única sala de la planta 1
- WHEN `libres 10:00-12:00 --planta 1`
- THEN responde una lista vacía

**ADDED — Planta sin salas**
- GIVEN salas solo en las plantas 1 y 2
- WHEN `libres 10:00-12:00 --planta 3`
- THEN responde `sin salas en la planta 3`

**ADDED — Planta sin valor**
- GIVEN cualquier estado
- WHEN `libres 10:00-12:00 --planta`
- THEN responde `falta el número de planta`

**Reglas de la capacidad**
- **Dónde viven los datos**: la planta de cada sala está en memoria junto a la lista de salas (Norte: 1, Sur: 2).
- **Idioma de los nombres**: castellano («planta»); la opción es `--planta`.
- **Límites**: no aplica.
- **Avisos**: `sin salas en la planta <valor>` · `falta el número de planta`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
