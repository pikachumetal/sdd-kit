---
id: 20261015-110000-feature-0031-free-rooms-load
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-15
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas responde en < 50 ms | cumple | Peor carga de la spec: 12 repeticiones entre 0,0015 y 0,0833 ms (la primera, en frío, 0,0833 ms). El máximo es unas 600 veces menor que el umbral. | `salida-libres-1000.txt` (script: `medir-libres.mjs`) |

La medida es de la función `run('libres', [franja])` dentro del proceso, sin contar el arranque de `node` de la CLI.

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`, más la reserva que `src/app.js` ya trae.

| Repetición | Tiempo (ms) | Recurso acumulado (heapUsed, MB) |
| --- | --- | --- |
| 1 | 0,0833 | 4,95 |
| 2 | 0,0040 | 4,95 |
| 3 | 0,0068 | 4,95 |
| 4 | 0,0024 | 4,95 |
| 5 | 0,0059 | 4,96 |
| 6 | 0,0026 | 4,96 |
| 7 | 0,0019 | 4,96 |
| 8 | 0,0026 | 4,97 |
| 9 | 0,0150 | 5,66 |
| 10 | 0,0044 | 5,66 |
| 11 | 0,0019 | 5,66 |
| 12 | 0,0015 | 5,66 |

El tiempo no crece con las repeticiones. El heap sube de 4,95 a 5,66 MB a mitad de la serie y no sigue subiendo (el código de `libres` no guarda nada entre llamadas, así que es compatible con el recolector de basura; no he medido el GC).

**Medida complementaria, fuera del objetivo**: con las 1.000 reservas en una sala que no es ninguna de las dos de `libres` (`Este`), `some` no corta antes y recorre las 1.000 por cada sala. Salida en `salida-libres-1000-no-coincide.txt`: entre 0,0187 y 0,1919 ms, heap de 4,95 a 5,66 MB sin crecer. Tampoco se acerca a 50 ms.

## 4. Recomendación

- **Elegida**: abrir `libres` a toda la oficina sin caché · **Por qué**: O1 cumple (máximo 0,0833 ms frente a 50 ms) y el aguante de 12 repeticiones no muestra ni tiempo ni memoria creciendo.
- **Descartadas**: añadir una caché ahora — no hay medida que la justifique, y sumaría una invalidación que mantener cuando se cancela o anula una reserva.

Alcance de la medida: 1.000 reservas en un solo proceso. No cubre otras cargas ni más de 1.000 reservas; si el volumen real las supera, hay que repetir con ellas.

## 5. Lo que sale

- nada
