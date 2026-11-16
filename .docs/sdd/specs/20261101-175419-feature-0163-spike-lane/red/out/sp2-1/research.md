---
id: 20261015-110000-feature-0031-free-rooms-load
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-01
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas activas en la misma franja (O1: responde en < 50 ms)?

## 2. Opciones evaluadas

### 2.1 Opción A — Dejar `libres` como está (filtro lineal sobre `bookings`)

- **Qué es**: `freeRooms` en `src/app.js`: por cada sala recorre `bookings` con `some`.
- **Pros**: sin cambios; medido muy por debajo del objetivo.
- **Contras**: coste O(salas × reservas); no se ha medido por encima de 1.000.
- **Coste estimado**: 0.

### 2.2 Opción B — Caché / índice por franja

- **Qué es**: guardar las salas ocupadas por franja y recalcular al reservar o cancelar.
- **Pros**: lectura constante.
- **Contras**: invalidación al cancelar y anular; más código y más superficie de fallo.
- **Coste estimado**: no se estima: la medida no lo justifica. Descartada.

## 3. Recomendación

- **Elegida**: Opción A — no hace falta caché para abrir `libres` a toda la oficina.
- **Por qué**: con la peor carga de la spec `libres` tarda ~0,001 ms (p50), 0,057 ms como máximo en 200 llamadas; incluso en el barrido completo de 2.001 reservas tarda ~0,03 ms (p50) y 0,69 ms como máximo. Todo queda más de 70 veces por debajo del objetivo de 50 ms.

## 4. Spike (si se hizo)

- **Branch**: `feature/0031-free-rooms-load` · **Resultado**: [`measure-output.txt`](./measure-output.txt), generado por [`measure.mjs`](./measure.mjs).
- **Medida** (Node v26.10.0, win32; 200 llamadas a `run('libres', [franja])` con `performance.now()`, por escenario):

| Escenario | Primera (fría) | p50 | p95 | máximo |
| --- | --- | --- | --- | --- |
| A) peor carga de la spec: 1.000 reservas activas de `seed` en `10:00-12:00` (+1 previa) | 0,057 ms | 0,001 ms | 0,003 ms | 0,057 ms |
| B) barrido completo: consulta `09:00-10:00` (libre) sobre 2.001 reservas | 0,070 ms | 0,026 ms | 0,052 ms | 0,690 ms |

- **O1** (< 50 ms): **cumplido** en ambos escenarios.
- **Aprendizajes clave**:
  - La peor carga de la spec (A) no es la de más trabajo para el código: `freeRooms` usa `some`, que corta en la primera reserva que coincide. El caso de más trabajo es una franja sin reservas sobre muchas reservas de otras franjas (B), por eso se midió también.
  - Las cifras varían entre ejecuciones (el máximo de B salió entre 0,125 y 0,690 ms): importa el orden de magnitud.
  - La medida es en proceso, sin arranque de Node ni E/S; el CLI no expone `seed`, por lo que no se midió el comando por línea de órdenes.
  - Solo hay dos salas en `src/app.js`: con más salas el coste crece de forma lineal, y no se midió.
  - Una sola máquina y un solo entorno.

## 5. Referencias

- `src/app.js` (`seed`, `freeRooms`), `spec.md` de esta carpeta.
