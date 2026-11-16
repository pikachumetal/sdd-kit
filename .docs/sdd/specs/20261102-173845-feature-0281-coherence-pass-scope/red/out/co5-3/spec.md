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

- Modificadas: `rooms` — cada sala tiene planta.
- Modificadas: `reports` — el informe de ocupación se agrupa por planta.
- Modificadas: `cli` — `libres` acepta `--planta <n>`.

## Decisiones que he tomado yo — valida estas

1. Las plantas son números enteros, y la planta baja es la 0.
2. El informe ordena las plantas de menor a mayor.
3. La opción se llama `--planta <n>` y va tras la franja: `libres 10:00-12:00 --planta 1`.
4. Una planta sin salas responde `sin salas en la planta <n>`, sin error.
5. La sala Este no existe en `src/app.js` (hoy solo Norte y Sur), aunque `rooms` ya dice que la herramienta la conoce: la añado en la planta 1. La aserción del test existente de `libres` pasa de `Sur` a `Sur, Este`.
6. El informe no muestra plantas sin reservas activas.
7. Sin review de la spec: 1 señal (`MODIFIED` de `libres`) y un delta pequeño (~40 líneas en 4 ficheros).

## Intent

Conserjería reparte la limpieza por plantas y hoy saca la ocupación a mano, sala por sala. Quiere el informe agrupado por planta, y de paso quien reserva quiere ver solo lo que tiene cerca.

## Scope

- Entra: la lista de salas de `src/app.js` guarda la planta de cada una y gana la sala Este (planta 1).
- Entra: el informe de ocupación agrupa por planta, con un subtotal por cada una.
- Entra: `README.md` explica cómo leer el informe.
- Entra: `libres <franja> --planta <n>` lista solo las salas libres de esa planta (`src/app.js`, función `run`).
- Entra: `test/app.test.js` cubre la agrupación y el filtro, y actualiza la aserción de `libres` por la sala Este.
- No entra: reservar por planta; exportar el informe.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «`libres` no acepta más argumentos ni opciones que la franja» | `capabilities/cli.md`, «Consultar las salas libres» | lo sustituye el `MODIFIED` de este delta |
| `libres excluye la sala reservada en la franja` (espera `Sur`) | `test/app.test.js` | se actualiza a `Sur, Este` (decisión 5) |
| el informe pasa de un total a una línea por planta | `capabilities/reports.md`, «El informe cuenta las reservas activas» | sigue cierto por planta: se queda; el `ADDED` lo complementa |
| `salas libres 10:00-12:00` | `changelog.md`, entrada de la 0006 | historia: no se toca |

- Filas que implementa: 0029 → `roadmap.md` línea 9, «Las salas tienen planta». La spec cubre además informe y filtro: `sdd-archive` la cierra y amplía su texto a «Ocupación por planta». Comprobado con `grep -rn 0029 .docs README.md` y buscando `libres`, `ocupación` y `planta` en `.docs`, `src`, `test` y `README.md`.

## Approach

La planta va en la lista de salas, junto al nombre. Norte y Sur están en la 0 y Este en la 1. El informe recorre la lista y acumula por planta.

## Dónde se prueba

- planta de una sala, filtro y agrupación: por el comando, como `test/app.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Cada sala tiene planta

- GIVEN las salas Norte y Sur en la planta 0 y Este en la 1
- WHEN se filtra por la planta 1
- THEN solo queda Este

### Capacidad: `reports`

#### ADDED — La ocupación se agrupa por planta

- GIVEN dos reservas en Norte y una en Este
- WHEN se pide el informe de ocupación
- THEN sale `planta 0: 2` y `planta 1: 1`, en ese orden

### Capacidad: `cli`

#### MODIFIED — Consultar las salas libres

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres, separadas por comas
- AND `libres` acepta además la opción `--planta <n>`, que deja solo las salas libres de esa planta
- AND `libres` no acepta más argumentos ni opciones que la franja y `--planta`
- AND si no hay salas en esa planta responde `sin salas en la planta <n>`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
