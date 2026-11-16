---
id: 20261008-140000-feature-0029-room-floors
feature: 0029
title: Las salas tienen planta
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Las salas tienen planta

## Capacidades

- Modificadas: `rooms` — cada sala tiene planta.
- Modificadas: `cli` — `libres` acepta la opción `--planta <n>`.

## Decisiones que he tomado yo — valida estas

1. Las plantas son números enteros, y la planta baja es la 0.
2. `libres <franja> --planta <n>` sobre una planta sin salas libres responde vacío, como `libres` hoy cuando no queda ninguna.
3. `--planta` con un valor que no es un entero, o sin valor, responde `planta no válida`.
4. La capacidad `cli` también cambia: su requisito «Consultar las salas libres» decía que `libres` no acepta más opciones que la franja, y eso deja de ser cierto.
5. Este no está en `src/app.js` aunque `rooms` ya dice que existe: la feature la añade, en la planta 1.
6. Resultado de `capability merge` sobre una copia de `.docs/sdd`: `rooms.md`: añadido «Cada sala tiene planta» · `cli.md`: sustituido «Consultar las salas libres», añadidos «Filtrar las salas libres por planta» y «Planta no válida» (sin errores, la copia en temp; `capabilities/` del repo intacta).
7. Política de modelos: ningún revisor de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar; lo que no nombra se confirma aparte

## Intent

Hoy nadie sabe desde la herramienta en qué planta está una sala, y quien reserva acaba en la otra punta del edificio. Quien reserva quiere ver solo las salas de su planta.

## Scope

- Entra: la lista de salas de `src/app.js` guarda la planta de cada una, y añade Este (`rooms` ya la nombra y el código no la tiene).
- Entra: `libres <franja> --planta <n>` lista solo las salas libres de esa planta (`freeRooms` y `run` en `src/app.js`).
- Entra: pruebas en `test/app.test.js`.
- No entra: reservar por planta.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «`libres` no acepta más argumentos ni opciones que la franja» | `capabilities/cli.md:20` | sustituida en el delta MODIFIED de `cli` por «acepta `--planta <n>`» |
| `libres <franja>` como único formato | `capabilities/cli.md:18`, `.docs/sdd/changelog.md:10` | `cli.md` se actualiza en el delta; el changelog es historia de una release cerrada y no se toca |

- Filas que implementa: 0029 → `roadmap.md:9`: la marca `sdd-archive` al cerrar; comprobado con `grep -rn 0029 .docs README.md`, sin más apariciones

## Approach

La planta va en la lista de salas, junto al nombre. Norte y Sur están en la 0 y Este en la 1.

## Dónde se prueba

- planta de una sala y filtro de `libres`: por el comando, como `test/app.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Cada sala tiene planta

- GIVEN las salas Norte y Sur en la planta 0 y Este en la 1
- WHEN la herramienta arranca
- THEN cada sala conoce su planta

### Capacidad: `cli`

#### MODIFIED — Consultar las salas libres (antes: "`libres` no acepta más argumentos ni opciones que la franja")

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres, separadas por comas
- AND `libres` no acepta más argumentos ni opciones que la franja y `--planta <n>`
- REMOVED AND `libres` no acepta más argumentos ni opciones que la franja

#### ADDED — Filtrar las salas libres por planta

- GIVEN las salas Norte y Sur en la planta 0 y Este en la 1, todas libres
- WHEN la persona ejecuta `libres <franja> --planta 1`
- THEN responde `Este`

#### ADDED — Planta no válida

- GIVEN cualquier estado
- WHEN la persona ejecuta `libres <franja> --planta abc`
- THEN responde `planta no válida`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
