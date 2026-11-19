---
id: 20261008-140000-feature-0029-room-floors
feature: 0029
title: Ocupación por planta
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Ocupación por planta

## Capacidades

- Modificadas: `rooms` (requisito nuevo: cada sala tiene planta; ADDED).
- Modificadas: `reports` (la ocupación se agrupa por planta; MODIFIED del requisito que cuenta las activas).
- Modificadas: `cli` (`libres` acepta `--planta <n>`, MODIFIED; comando `informe`, ADDED).

## Decisiones que he tomado yo — valida estas

1. Las plantas son números enteros desde 0; la planta baja es la 0. No hay plantas negativas. Valor válido de `--planta`: dígitos decimales sin signo (`1`; no `-1`, `1.5`, `+1`).
2. El informe ordena las plantas de menor a mayor.
3. Norte y Sur están en la planta 0 y Este en la 1. Este no está hoy en `src/app.js` aunque `rooms` ya dice que existe: se añade al catálogo.
4. El informe no existe hoy como comando: lo añado como `informe`, que escribe una línea `planta N: k` por planta. `k` cuenta solo reservas activas; una planta sin reservas no sale; no hay total general; cuenta todas las reservas activas, de cualquier día. Sin reservas activas no escribe nada. `informe` con argumentos responde `informe no acepta argumentos`.
5. «Lo que tiene cerca» es «la misma planta»: `libres <franja> --planta <n>`. Una planta sin salas libres o inexistente da una lista vacía; «vacío» es una línea vacía; un valor inválido o sin valor responde `planta no válida`, y ese error gana a una franja inválida.
6. `rooms.md`, `reports.md` y `cli.md` cambian al cerrar; `PRODUCT.md` gana el término «planta» (el agente lo hace en el cierre).
7. Este entra al catálogo como sala nueva: `reservar Este` pasa a funcionar y `PRODUCT.md` lo añade en «Sala».
8. El título de la fila 0029 de `ROADMAP.md` cambia a «Ocupación por planta» en el cierre.
9. El README no tiene prueba: se comprueba leyéndolo en el cierre.

### Hallazgos de la review

- **Aceptado** — Este contradice `rooms` y PRODUCT.md (dos revisores, Crítico) → decisión 3 y Scope.
- **Aceptado** — ADDED de `reports` mezclado con el requisito vigente (dos revisores, Crítico) → pasa a MODIFIED, con una cancelada en el GIVEN y planta sin reservas activas.
- **Aceptado** — el escenario de `rooms` hablaba de un filtro que vive en `cli` (dos revisores, Crítico) → `rooms` comprueba el dato por la consulta `libres --planta`; el filtro, en `cli`.
- **Aceptado** — faltaban errores de `--planta`, franja ocupada, planta vacía, decisiones sin listar, `informe` inexistente, «cerca» sin definir → escenarios y decisiones 4, 5 y 9.
- **Aceptado** — segunda ronda (un Crítico: el escenario de `reports` no probaba la planta sin reservas) → Este solo con una cancelada; escenarios de franja ocupada, `informe` sin reservas y con argumento; formato de `--planta`; Este y ROADMAP en las decisiones 7 y 8.
- **Rechazado** — `approvers: Laura` y «conserjería» como roles nuevos (segunda ronda) → vienen de la plantilla y del encargo; el dev-lead valida el nombre al aprobar.
- **Aceptado** — las cinco reglas: no aplica, no hay datos persistentes ni límites nuevos más allá de la decisión 1; los nombres están en castellano.
- **Rechazado** — probar el README por batería → motivo: es texto; decisión 9.

## Intent

Conserjería reparte la limpieza por plantas y hoy saca la ocupación a mano, sala por sala. Quiere el informe agrupado por planta, y de paso quien reserva quiere ver solo las salas libres de su planta.

## Scope

- Entra: la lista de salas de `src/app.js` guarda la planta de cada una y añade Este.
- Entra: comando `informe` en `src/app.js` que agrupa por planta, con el recuento de cada una.
- Entra: `libres <franja> --planta <n>` lista solo las salas libres de esa planta (`freeRooms` y `run`).
- Entra: `README.md` explica cómo leer el informe.
- Entra: `test/app.test.js` cubre la planta, la agrupación y el filtro.
- Entra al cerrar: `rooms.md`, `reports.md`, `cli.md`, el término «planta» en `PRODUCT.md`.
- No entra: reservar por planta; exportar el informe.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «`libres` no acepta más argumentos ni opciones que la franja» | `.docs/sdd/capabilities/cli.md:20` | MODIFIED en `cli`: acepta `--planta` |
| «El informe cuenta las reservas activas» | `.docs/sdd/capabilities/reports.md` | MODIFIED en `reports`: por planta |
| fila 0029 «Las salas tienen planta» | `ROADMAP.md:9` | el título pasa a «Ocupación por planta»; lo hace `sdd-archive` |

- Filas que implementa: 0029 → `ROADMAP.md:9` (comprobado con `git grep -n 0029`, fuera de la propia spec)

## Approach

La planta va en la lista de salas, junto al nombre. El informe recorre las reservas activas y acumula por planta; `freeRooms` filtra por planta si se la piden.

## Dónde se prueba

- Una fila por requisito del delta, todas con `run` en `test/app.test.js`: planta de una sala y filtro (`libres`), error de `--planta`, `informe` agrupado y ordenado.

## Términos y ADR

- Términos resueltos: planta (a añadir en `PRODUCT.md`)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Cada sala tiene planta

- GIVEN Norte y Sur en la planta 0 y Este en la 1, y una reserva activa en Norte en `10:00-12:00`
- WHEN se ejecuta `libres 10:00-12:00 --planta 0`
- THEN lista `Sur`
- AND con `--planta 1` lista `Este`

### Capacidad: `reports`

#### MODIFIED — El informe cuenta las reservas activas

- GIVEN dos reservas activas en Norte, una activa en Sur y una cancelada en Este
- WHEN se ejecuta `informe`
- THEN sale `planta 0: 3`
- AND `planta 1` no sale, porque Este solo tiene una cancelada

### Capacidad: `cli`

#### MODIFIED — Consultar las salas libres

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres, separadas por comas
- AND con `--planta <n>` lista solo las libres de esa planta en esa franja
- AND `libres` sin `--planta` sigue listando todas las libres
- AND con una planta sin salas libres o inexistente responde vacío
- AND con `--planta` sin valor o con un valor que no es entero ≥ 0 responde `planta no válida`
- AND `libres` no acepta más argumentos ni opciones que la franja y `--planta`

#### ADDED — Pedir el informe de ocupación

- GIVEN reservas activas en varias plantas
- WHEN la persona ejecuta `informe`
- THEN escribe una línea `planta N: k` por planta con reservas activas, de menor a mayor
- AND sin reservas activas no escribe nada
- AND con argumentos responde `informe no acepta argumentos`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
