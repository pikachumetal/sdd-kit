---
id: 20261015-110000-feature-0031-free-rooms-load
title: Research — carga de `libres` con 1.000 reservas
spec: ./spec.md
status: draft
created: 2026-11-12
timeboxed: 2h
---

# Research — carga de `libres` con 1.000 reservas

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas responde en < 50 ms | cumple | Peor repetición medida: 0,110 ms (la primera, en frío, escenario B); en caliente, entre 0,005 y 0,032 ms. Unas 450 veces por debajo del umbral en el peor caso. | `measure-output.txt` (la saca `measure.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed` de `src/app.js`, más la reserva previa de la base. Dos variantes, cada una en su proceso, 15 repeticiones seguidas de `run('libres', ['10:00-12:00'])`, con `gc()` antes de cada una:

- **A** — las 1.000 reparten entre `Norte` y `Sur`: `some` corta en la primera coincidencia.
- **B** — las 1.000 son de salas que no existen en `rooms`: `some` recorre las 1.001 reservas por cada sala. Es la peor para el escaneo.

| Repetición | Tiempo A | Tiempo B | Heap A | Heap B |
| --- | --- | --- | --- | --- |
| 1 | 0,086 ms | 0,110 ms | 4,24 MB | 4,26 MB |
| 2 | 0,006 ms | 0,032 ms | 4,24 MB | 4,26 MB |
| 3 | 0,009 ms | 0,023 ms | 4,24 MB | 4,26 MB |
| 4 | 0,005 ms | 0,022 ms | 4,24 MB | 4,26 MB |
| 5 | 0,009 ms | 0,026 ms | 4,24 MB | 4,26 MB |
| 6 | 0,005 ms | 0,023 ms | 4,24 MB | 4,74 MB |
| 7 | 0,005 ms | 0,019 ms | 4,73 MB | 4,27 MB |
| 8 | 0,005 ms | 0,027 ms | 4,69 MB | 4,74 MB |
| 9 | 0,007 ms | 0,025 ms | 4,28 MB | 4,31 MB |
| 10 | 0,007 ms | 0,020 ms | 4,28 MB | 4,31 MB |
| 11 | 0,005 ms | 0,018 ms | 4,28 MB | 4,31 MB |
| 12 | 0,005 ms | 0,018 ms | 4,28 MB | 4,31 MB |
| 13 | 0,005 ms | 0,018 ms | 4,28 MB | 4,31 MB |
| 14 | 0,005 ms | 0,018 ms | 4,28 MB | 4,31 MB |
| 15 | 0,005 ms | 0,018 ms | 4,28 MB | 4,31 MB |

El tiempo no crece con las repeticiones y el heap se queda en ≈ 4,3 MB; los saltos a ≈ 4,7 MB de algunas filas no se acumulan (la repetición siguiente vuelve a ≈ 4,3 MB).

Límites de la medida: todo en memoria, en un solo proceso, una llamada por repetición y sin disco ni red; la mide el agente, no una persona. Mide `run('libres')`, no `node src/app.js libres`: el arranque de Node no entra, y `seed` no se puede invocar desde la línea de comandos, así que esa carga no se reproduce por ahí.

## 4. Recomendación

- **Elegida**: no poner caché antes de abrir `libres` a toda la oficina · **Por qué**: O1 cumple con margen de unas 450 veces en la peor carga medida (fila O1, escenario B) y el aguante no muestra recurso creciendo.
- **Descartadas**: caché de `libres` — no hay tiempo que ahorrar con 1.000 reservas (≤ 0,110 ms frente a 50 ms) y añade invalidación al cancelar y anular.

## 5. Lo que sale

- nada
