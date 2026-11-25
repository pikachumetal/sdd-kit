---
id: 20261120-090000-feature-0030-libres-load
title: Research — `libres` con 1.000 reservas
spec: ./spec.md
status: draft
created: 2026-11-21
---

# Research — `libres` con 1.000 reservas

## 1. Pregunta a resolver

¿Responde `libres` a tiempo con 1.000 reservas en memoria?

## 2. Objetivos

Las medidas salen de `medidas/medir-libres.mjs`, que corre una copia fiel de `freeRooms` de `src/app.js` (2 salas, igualdad de franja, estado `active`, `.some()` con salida temprana). Una «comparación» es cada test de igualdad evaluado en el predicado de `.some()` (sala, franja, estado).

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas en < 2.000 comparaciones | no cumple | dos patrones de datos superan 2.000: 3.000 comparaciones (ninguna reserva iguala la franja) y 4.000 (todas igualan sala y franja pero están canceladas; es el máximo posible con 2 salas), en las 10 repeticiones; solo con una coincidencia temprana baja a 7 | `medidas/o1-libres.txt` |
| O2 — memoria del proceso < 50 MB con 1.000 reservas | no cumple tal como se definió | RSS del proceso 54,4 MB tras sembrar, pero 54,3 MB antes: un proceso Node vacío ya supera los 50 MB, y las 1.000 reservas añaden 0,1 MB de RSS y 0,1 MB de heap (3 corridas; el RSS absoluto varía unas décimas entre ejecuciones, el delta queda en 0,1 MB, al límite del redondeo) | `medidas/o2-memoria.txt` |
| O3 — un recepcionista encuentra la sala libre en < 10 s | no medido con una persona | no hay medida: los «4 s» fueron una simulación mía, no una persona, y no cuentan como evidencia | — |

## 3. Aguante

Carga: 1.000 reservas en una semana, la peor carga confirmada.

| Carga | Repeticiones | Comparaciones |
| --- | --- | --- |
| sin coincidencia (todas recorridas) | 10 | 3.000 en las 10 |
| canceladas (sala y franja iguales, estado distinto) | 10 | 4.000 en las 10 |
| coincidencia temprana | 10 | 7 en las 10 |

El recuento es determinista: las repeticiones iguales no miden tiempo ni memoria bajo repetición, solo confirman que el recuento no varía.

## 4. Recomendación

- **Elegida**: las reservas siguen en memoria en la 0014 · **Por qué**: 1.000 reservas ocupan 0,1 MB (medido, O2), así que la memoria no es el problema; el coste de O1 (3.000–4.000 comparaciones) lo fija el recorrido de `libres`, que no cambia con el almacén
- **Descartadas**: pasar las reservas a fichero, porque no reduce el recorrido de `libres` y la memoria que ahorraría es de 0,1 MB; no se midió una versión con fichero, es un razonamiento sobre el recorrido, no una medida
- **Lo que este spike no decide ni midió**: no se midió tiempo de reloj (solo comparaciones), ni O3, ni una versión con fichero; los 0,1 MB son de reservas sintéticas de 4 campos; «índice o filtro» es una vía, no una medida; O2 no separa memoria de fichero, porque el umbral de 50 MB lo supera el runtime vacío; y O1 se arregla con un índice o filtro en `libres`, no con el almacén

## 5. Lo que sale

- O3 queda pendiente: hace falta una persona en la recepción
- Redefinir O2 como delta sobre la base del runtime (el umbral absoluto de 50 MB no es alcanzable en Node)
- Fila nueva en el roadmap para que `libres` deje de recorrer todas las reservas (índice o filtro por franja), independiente de la 0014
- Entrada para la 0014: guardar el motivo no obliga a pasar a fichero
