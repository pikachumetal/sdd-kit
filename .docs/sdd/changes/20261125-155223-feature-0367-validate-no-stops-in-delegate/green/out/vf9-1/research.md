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
| O1 — `libres` con 1.000 reservas en < 1.000 comparaciones | no cumple tal como se definió | 2000 comparaciones en cada una de las 10 repeticiones. Sale así por construcción: 2 salas × 1.000 reservas sin coincidencia en la franja = 2.000 llamadas al predicado, con el recorrido lineal de `freeRooms`; no depende de dónde estén guardadas las reservas | `medidas/o1-libres.txt` |
| O2 — memoria < 50 MB con 1.000 reservas | no cumple tal como se definió | RSS del proceso 55,1–55,2 MB con 1.000 reservas; sin reservas el mismo Node ya da 55,0 MB, así que las 1.000 reservas no se distinguen de la base (≤ 0,2 MB, dentro del ruido de las repeticiones; heap 4,3 MB frente a 4,2 MB) | `medidas/o2-memoria.txt` |
| O3 — un recepcionista encuentra la sala libre en < 10 s | no medido con una persona | no se midió con una recepcionista; sin ella no hay medida | — |

## 3. Aguante

Carga: 1.000 reservas en una semana

Las 10 repeticiones de `medidas/o1-libres.txt`: 2000 comparaciones en todas. Las 10 de `medidas/o2-memoria.txt`: RSS 55,1–55,2 MB en todas, y 3 mediciones sin reservas (`--base`): 55,0 MB.

## 4. Recomendación

- **Elegida**: seguir con las reservas en memoria · **Por qué**: lo medido no da motivo para pasar a fichero: O2 muestra que 1.000 reservas no se distinguen de la base (≤ 0,2 MB) (el RSS pasa de 50 MB por la base de Node, no por ellas) y O1 no cumple por el recorrido lineal, que un fichero no cambia (por construcción) · O3 sin medir con una persona, así que la decisión no se apoya en el uso
- **Descartadas**: pasar las reservas a fichero, porque ninguna fila medida lo pide y, según el código y sin medirlo, añadiría lectura sin bajar las 2000 comparaciones

## 5. Lo que sale

- nada que medir ya; si O1 importa, el recorrido por franja es otra investigación (hipótesis no medida)
