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
- Modificadas: `cli` — `libres` acepta `--planta <n>`.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: MODIFIED (un requisito de `cli`) · tamaño: ~30 líneas en 3 ficheros
- Mínimo razonable: ninguna — deja sin mirar que `--planta` no rompa a quien ya ejecuta `libres <franja>`; lo cubre el escenario «sin `--planta`»

Política de modelos: ninguno (sin revisores de spec) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

1. Las plantas son números enteros, y la planta baja es la 0.
2. La sala Este no existe en `src/app.js` (hoy solo Norte y Sur), aunque `rooms` ya dice que existe: esta feature la añade, en la planta 1.
3. `libres <franja> --planta <n>` con una `<n>` que no es un entero, o sin `<n>`, responde `planta no válida`.
4. Una planta sin salas libres (o que no existe) responde la lista vacía, como hoy `libres` cuando no queda ninguna.
5. `libres <franja>` sin `--planta` no cambia: lista las libres de todas las plantas.
6. Corregido en la pasada de coherencia: el requisito «Consultar las salas libres» de `cli` dice que `libres` no acepta más opciones que la franja, y `--planta` lo contradice → es un `MODIFIED` de `cli`, no un `ADDED` de `rooms`; el filtro vive en `cli`.
7. «Planta» entra como término en `PRODUCT.md` (Terminology), porque es una palabra nueva del dominio.
8. Resultado de `sdd capability merge` sobre una copia de `.docs/sdd`: salió bien (exit 0): `rooms.md` añade «Cada sala tiene planta»; `cli.md` sustituye «Consultar las salas libres» y añade «…de una planta», «Una planta sin salas libres» y «Una planta que no es un entero». El `capabilities/` del repo no cambió.

## Intent

Hoy nadie sabe desde la herramienta en qué planta está una sala, y quien reserva acaba en la otra punta del edificio. Quien reserva quiere ver solo las salas de su planta.

## Scope

- Entra: la lista de salas de `src/app.js` guarda la planta de cada una (Norte y Sur en la 0, Este en la 1; ver decisión 2).
- Entra: `libres <franja> --planta <n>` lista solo las salas libres de esa planta (`freeRooms` y `run` de `src/app.js`, donde se aplica el requisito de `cli`).
- Entra: `test/app.test.js` cubre los escenarios del delta.
- Entra: el término «Planta» en `PRODUCT.md`.
- No entra: reservar por planta.
- Queda fuera, sin tocar: `src/app.js` `reservar`, `cancelar` y `anular` (no leen la planta); `README.md` (no documenta comandos).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «`libres` no acepta más argumentos ni opciones que la franja» | `capabilities/cli.md`, requisito «Consultar las salas libres» | se sustituye por el `MODIFIED` de esta spec |
| fila `0029` del roadmap | `.docs/sdd/roadmap.md` (Próximo) | la implementa esta feature; `sdd-archive` la pasa a hecha |

- Filas que implementa: 0029 → la fila de `roadmap.md` de arriba; comprobado con `grep -rn 0029 .docs README.md` (solo `roadmap.md` y esta spec).

## Approach

La planta va en la lista de salas, junto al nombre. Norte y Sur están en la 0 y Este en la 1.

## Dónde se prueba

- planta de una sala y filtro de `libres`: por el comando, como `test/app.test.js`.

## Términos y ADR

- Términos resueltos: «Planta» (a `PRODUCT.md`, decisión 7)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Cada sala tiene planta

- GIVEN el catálogo de `src/app.js`
- WHEN la herramienta arranca
- THEN Norte y Sur están en la planta 0 y Este en la planta 1

### Capacidad: `cli`

#### MODIFIED — Consultar las salas libres

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres de todas las plantas, separadas por comas
- AND `libres` no acepta más argumentos ni opciones que la franja y `--planta <n>`

#### ADDED — Consultar las salas libres de una planta

- GIVEN las salas Norte y Sur en la planta 0 y Este en la 1, todas libres en la franja
- WHEN la persona ejecuta `libres <franja> --planta 1`
- THEN responde `Este`

#### ADDED — Una planta sin salas libres

- GIVEN ninguna sala libre en la planta 5
- WHEN la persona ejecuta `libres <franja> --planta 5`
- THEN responde la lista vacía

#### ADDED — Una planta que no es un entero

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja> --planta alta`, o `libres <franja> --planta` sin número
- THEN responde `planta no válida`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
