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

Review de spec: ninguna — señales: `MODIFIED` (un requisito de `cli`), contrato público (la opción `--planta` de la línea de comandos) · tamaño: ~40 líneas en 3 ficheros. 2 señales: no se propone review.

Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

1. Las plantas son números enteros, y la planta baja es la 0.
2. El informe ordena las plantas de menor a mayor.
3. Norte y Sur en la planta 0 y Este en la 1 vienen de tu ejemplo; no hay otro dato de plantas en el repo.
4. **`src/app.js` hoy solo tiene Norte y Sur**; la capacidad `rooms` ya dice que la herramienta conoce Norte, Sur y Este. Añado Este a la lista (planta 1) para que código y capacidad coincidan. Si Este no debe existir aún, dímelo y el ejemplo cambia.
5. **El informe de ocupación no existe como comando en el código** (`run` responde `salas` a lo que no conoce). Propongo llamarlo `ocupacion`, que sale `planta 0: 2` y `planta 1: 1`, una línea por planta, en ese formato. El nombre y el formato son míos.
6. La opción se llama `--planta` y va después de la franja: `libres 10:00-12:00 --planta 1`. Sin salas libres en esa planta responde vacío, como `libres` hoy.
7. «Subtotal por cada planta» lo leo como el número de reservas activas de las salas de esa planta; las canceladas y anuladas no cuentan, como en el requisito vigente de `reports`.
8. El requisito vigente «El informe cuenta las reservas activas» se queda como está (sigue siendo verdad: cada subtotal cuenta solo activas), y el de la agrupación entra como `ADDED`, no como `MODIFIED`.
9. El `libres --planta` entra en la cuenta aunque la fila 0029 del roadmap solo dice «Las salas tienen planta»: viene del Intent.

Pasada de coherencia: el `MODIFIED` de `cli` no estaba en la spec (el filtro iba disfrazado de `ADDED` en `rooms`, y contradecía el AND vigente de `cli`); lo declaré, y moví el filtro a su escenario de `cli`. Completé el Scope con el código que implementa `libres` y con el informe, y rellené «Lo que se retira o cambia de forma» (antes decía «nada»: la fila 0029 del roadmap y el AND retirado de `cli` aparecen).

`capability merge` sobre una copia de `.docs/sdd` fuera del repo: `rooms.md: añadido «Cada sala tiene planta»` · `reports.md: añadido «La ocupación se agrupa por planta»` · `cli.md: sustituido «Consultar las salas libres»` · `cli.md: añadido «Salas libres de una planta»`. El repo no cambió.

## Intent

Conserjería reparte la limpieza por plantas y hoy saca la ocupación a mano, sala por sala. Quiere el informe agrupado por planta, y de paso quien reserva quiere ver solo lo que tiene cerca.

## Scope

- Entra: la lista de salas de `src/app.js` guarda la planta de cada una (y gana Este).
- Entra: `src/app.js` — `run` en la rama de `libres` y `freeRooms`, que aplican el filtro `--planta`.
- Entra: `src/app.js` — el informe de ocupación (`ocupacion`), agrupado por planta con un subtotal por cada una.
- Entra: `README.md` explica cómo leer el informe.
- Entra: `libres <franja> --planta <n>` lista solo las salas libres de esa planta.
- Entra: `test/app.test.js` cubre la agrupación y el filtro.
- No entra: reservar por planta; exportar el informe.
- Fuera, a propósito: `test/cancel.test.js` (no toca cancelar), `scripts/lint.mjs` (solo mira tabuladores) y `.docs/sdd/changelog.md` línea 10 (historia de la task 0006, no se reescribe).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «`libres` no acepta más argumentos ni opciones que la franja» | `.docs/sdd/capabilities/cli.md`, requisito «Consultar las salas libres» | se reemplaza por el `MODIFIED` de `cli` de esta spec |
| `libres <franja>` | `.docs/sdd/changelog.md` línea 10 (entrada de la task 0006) | se queda: es historia de una release |
| `libres <franja>` | `test/app.test.js`, test «libres excluye la sala reservada en la franja» | se queda: sigue verde (sin `--planta` el comportamiento no cambia) |
| fila 0029 del roadmap | `.docs/sdd/roadmap.md` línea 9 | la mueve `sdd-archive` al cerrar la feature |

- Filas que implementa: 0029 → `.docs/sdd/roadmap.md` línea 9 (comprobado con `grep -rn 0029 .docs README.md`; el resto de apariciones es esta carpeta).

## Approach

La planta va en la lista de salas, junto al nombre. Norte y Sur están en la 0 y Este en la 1. El informe recorre la lista y acumula por planta.

## Dónde se prueba

- planta de una sala, agrupación y filtro `--planta`: por el comando, como `test/app.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Cada sala tiene planta

- GIVEN las salas Norte y Sur en la planta 0 y Este en la 1
- WHEN se consulta la planta de cada sala
- THEN Norte y Sur están en la planta 0 y Este en la 1

### Capacidad: `reports`

#### ADDED — La ocupación se agrupa por planta

- GIVEN dos reservas activas en Norte y una en Este
- WHEN se pide el informe de ocupación con `ocupacion`
- THEN sale `planta 0: 2` y `planta 1: 1`, con las plantas de menor a mayor

### Capacidad: `cli`

#### MODIFIED — Consultar las salas libres

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres, separadas por comas
- AND `libres` acepta como única opción `--planta <n>`

#### ADDED — Salas libres de una planta

- GIVEN las salas Norte y Sur en la planta 0 y Este en la 1, todas libres en la franja
- WHEN la persona ejecuta `libres <franja> --planta 1`
- THEN lista solo Este

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
