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

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas en < 1.000 comparaciones | no cumple tal como se definió | 2000 comparaciones en cada una de las 10 repeticiones | `medidas/o1-libres.txt` |
| O2 — memoria del proceso < 50 MB con 1.000 reservas | no cumple tal como se definió | RSS 55,1–55,3 MB en las 10 repeticiones, pero un Node vacío ya da 54,6 MB: las 1.000 reservas suman como mucho 0,6 MB de RSS (el heap total es 4,3 MB, con el runtime) y el umbral lo incumple el propio runtime | `medidas/o2-memoria.txt` |
| O3 — un recepcionista encuentra la sala libre en < 10 s | no medido con una persona | sin recepcionista no hay dato; no se cuenta ninguna estimación propia | — |

## 3. Aguante

Carga: 1.000 reservas en una semana

La carga siembra las 1.000 reservas en 2 salas y 5 días con franjas que nunca incluyen `10:00-12:00`, a propósito: con la franja libre en todas las salas, `some` no corta y recorre las 1.000 reservas por sala (el peor caso de `freeRooms`, que ignora el día). La copia medida no lleva la reserva semilla de `src/app.js`.

| Repetición | O1 comparaciones | O2 heap (MB) | O2 RSS (MB) |
| --- | --- | --- | --- |
| 1 | 2000 | 4,3 | 55,2 |
| 2 | 2000 | 4,3 | 55,2 |
| 3 | 2000 | 4,3 | 55,1 |
| 4 | 2000 | 4,3 | 55,2 |
| 5 | 2000 | 4,3 | 55,2 |
| 6 | 2000 | 4,3 | 55,3 |
| 7 | 2000 | 4,3 | 55,2 |
| 8 | 2000 | 4,3 | 55,1 |
| 9 | 2000 | 4,3 | 55,1 |
| 10 | 2000 | 4,3 | 55,2 |

## 4. Recomendación

- **Elegida**: seguir con las reservas en memoria y cambiar cómo `libres` las recorre · **Por qué**: O1 no cumple (2000 comparaciones frente a 1.000) por el recorrido lineal de `freeRooms`, que no depende de dónde se guarden las reservas; pasarlas a fichero no reduce comparaciones y añade E/S. Las 1.000 reservas cuestan como mucho 0,6 MB de proceso (O2): la memoria no es el problema, y el umbral de 50 MB lo incumple Node vacío
- **Descartadas**: dejarlo como está, porque O1 no cumple · pasar las reservas a fichero, porque no ataca la causa de O1 (el recorrido) y no hay dato de memoria que lo justifique

## 5. Lo que sale

- Cambiar cómo `libres` recorre las reservas para bajar de 1.000 comparaciones: pendiente de apuntar en el roadmap, antes de la 0014
- Las cifras de RSS son de Node v26.10.0 en Windows 11 y no se reproducen al decimal en otro entorno
