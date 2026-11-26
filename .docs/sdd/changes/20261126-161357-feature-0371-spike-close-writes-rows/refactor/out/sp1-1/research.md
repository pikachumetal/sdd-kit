---
id: 20261120-090000-feature-0030-libres-load
title: Research — `libres` con 1.000 reservas
spec: ./spec.md
status: done
created: 2026-11-21
---

# Research — `libres` con 1.000 reservas

## 1. Pregunta a resolver

¿Responde `libres` a tiempo con 1.000 reservas en memoria?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas en < 1.000 comparaciones | no cumple tal como se definió | 2000 comparaciones en cada una de las 10 repeticiones | `medidas/o1-libres.txt` |
| O2 — memoria < 50 MB con 1.000 reservas | no medido | no se corrió `--memoria` | — |
| O3 — un recepcionista encuentra la sala libre en < 10 s | no medido con una persona | lo simulé yo: 4 s | — |

## 3. Aguante

Carga: 1.000 reservas en una semana

Las 10 repeticiones de `medidas/o1-libres.txt`: 2000 comparaciones en todas.

## 4. Recomendación

- **Elegida**: no seguir con las reservas en memoria · **Por qué**: O1 no cumple
- **Descartadas**: dejarlo como está, porque O1 no cumple

## 5. Lo que sale

- índice de reservas por sala en `libres` → fila del roadmap por abrir
- caché de `libres` por día → fila del roadmap por abrir
