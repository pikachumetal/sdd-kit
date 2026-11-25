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
| O1 — `libres` con 1.000 reservas en < 1.000 comparaciones | no cumple tal como se definió | 2000 comparaciones en cada una de las 10 repeticiones; ninguna reserva sembrada cae en la franja consultada, así que `some` nunca corta antes y 2000 (2 salas × 1.000 reservas) es el máximo | `medidas/o1-libres.txt` |
| O2 — memoria < 50 MB con 1.000 reservas | no cumple tal como se definió | RSS del proceso con 1.000 reservas: 54,1–54,3 MB en 10 repeticiones; un `node` vacío, medido en la misma sesión: 54,1–54,2 MB (`medidas/o2-rss-node-vacio.txt`). Ni un `node` vacío baja de 50 MB, así que O2 no se puede cumplir tal como está definido, con o sin reservas; lo que añaden las 1.000 reservas (< 1 MB de RSS, heapUsed 4,3 MB frente a 4,2 MB del `node` vacío) queda al nivel del ruido entre ejecuciones. Es la copia del script, no la app real | `medidas/o2-memoria.txt` |
| O3 — un recepcionista encuentra la sala libre en < 10 s | no medido con una persona | lo simulé yo (4 s), que no es evidencia y no cuenta para O3 | — |

## 3. Aguante

Carga: 1.000 reservas en una semana

Las 10 repeticiones de `medidas/o1-libres.txt`: 2000 comparaciones en todas.

Las 10 repeticiones de `medidas/o2-memoria.txt`: heapUsed 4,3 MB y RSS 54,1–54,3 MB; las del `node` vacío (`medidas/o2-rss-node-vacio.txt`): heapUsed 4,2 MB y RSS 54,1–54,2 MB.

## 4. Recomendación

- **Elegida**: las reservas pueden seguir en memoria, pero `libres` necesita otro recorrido (por ejemplo un índice por franja) · **Por qué**: O1 no cumple porque el recorrido es lineal (2 salas × 1.000 reservas = 2000 comparaciones), y pasar las reservas a fichero no lo reduce: habría que cargarlas y recorrerlas igual; la memoria no es el límite: las 1.000 reservas añaden < 1 MB sobre un `node` vacío (O2), y pasar a fichero tampoco haría cumplir O2, porque el mínimo es el propio `node`
- **Descartadas**: dejarlo como está, porque O1 no cumple · pasar las reservas a fichero, porque no reduce las comparaciones de O1 y lo medido en memoria no lo pide
- **Sin medir**: que un índice cumpla O1, y O3 (una persona)

## 5. Lo que sale

- un nuevo recorrido de `libres` (por ejemplo un índice por franja) para la 0014
- redefinir O2 como incremento sobre un `node` vacío, porque «< 50 MB de proceso» no es alcanzable
