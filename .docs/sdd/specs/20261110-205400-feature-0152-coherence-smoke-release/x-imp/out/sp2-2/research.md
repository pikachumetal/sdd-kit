---
id: 20261015-110000-feature-0031-free-rooms-load
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-12
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas responde en < 50 ms | cumple | 2.000 llamadas con la peor carga: mediana 0,0062 ms · p99 0,0290 ms · máx 0,0692 ms (umbral 50 ms: el máximo es ~700 veces menor) | `salida-libres.txt` (script: `measure-libres.mjs`) |

Medido en una sola máquina, con Node v26.10.0, llamando a `run('libres', [franja])` en proceso: no incluye arranque de la CLI ni E/S.

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`. Variante medida como peor caso: todas en `Norte`, así `Sur` está libre y su comprobación recorre las 1.000 reservas. La variante alterna Norte/Sur, medida también, es más rápida (mediana 0,0003 ms, máx 0,1659 ms).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | mediana 0.0065 ms · máx 0.0686 ms | -0.248 MB |
| 2 | mediana 0.0075 ms · máx 0.0342 ms | -0.243 MB |
| 3 | mediana 0.0066 ms · máx 0.0259 ms | -0.244 MB |
| 4 | mediana 0.0062 ms · máx 0.0228 ms | -0.239 MB |
| 5 | mediana 0.0062 ms · máx 0.0254 ms | -0.238 MB |
| 6 | mediana 0.0062 ms · máx 0.0234 ms | -0.238 MB |
| 7 | mediana 0.0061 ms · máx 0.0215 ms | -0.231 MB |
| 8 | mediana 0.0062 ms · máx 0.0692 ms | -0.230 MB |
| 9 | mediana 0.0062 ms · máx 0.0426 ms | -0.227 MB |
| 10 | mediana 0.0073 ms · máx 0.0311 ms | -0.227 MB |

El tiempo no crece con las repeticiones. El recurso (heap tras `gc`, sobre el inicial) no crece de forma sostenida: en esta variante baja ~0,23 MB y se estabiliza; en la alterna sube 0,045 MB en 2.000 llamadas, que es ruido del motor y no una fuga medible (ver `salida-libres.txt`).

## 4. Recomendación

- **Elegida**: no añadir caché a `libres` antes de abrirlo a toda la oficina · **Por qué**: O1 cumple con margen (máx 0,0692 ms frente a 50 ms) con la peor carga confirmada, y el aguante no muestra ni tiempo ni memoria creciendo.
- **Descartadas**: caché de `libres` — no hay medida que la justifique con 1.000 reservas; reabrir la decisión solo si la carga real supera con mucho esa cifra, que esta medida no cubre.

## 5. Lo que sale

- Nada: el spike no deja código de producción y la medida no expone ningún arreglo → nada
