---
id: 20261015-100000-feature-0030-free-rooms-kiosk
title: Research — ¿puede `libres` ir en el quiosco de la entrada?
spec: ./spec.md
status: draft
created: 2026-11-15
timeboxed: 2h
---

# Research — `libres` en el quiosco de la entrada

## 1. Pregunta a resolver

¿Puede `libres` ir en el quiosco de la entrada?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` responde sin error durante ≥ 5 min seguidos | cumple | 5,17 min en bucle, 162.700.000 llamadas, 0 errores. Mide la función `libres` de `src/app.js`, no un quiosco desplegado. La medida anterior (2 min 30 s, cortada por el timebox) no llegaba al umbral y queda sustituida. | `evidence/o1-5min.txt` (anterior: `evidence/o1.txt`) |
| O2 — con 1.000 reservas, `libres` no pasa de 50 MB de memoria | no cumple tal como se definió | RSS del proceso: 58,6 MB tras la primera medida y 60,0–61,0 MB tras las 10 repeticiones; el umbral son 50 MB. Un proceso de Node vacío ya marca 57,0 MB, así que las 1.000 reservas añaden unos 1,6 MB (heap 4,1 MB). El umbral queda por debajo de lo que consume el propio runtime. | `evidence/o2-o4-1000.txt`, `evidence/o4-aguante.txt` |
| O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s, sin ayuda | no medido con una persona | La única prueba la hizo el agente con un navegador automatizado: 12 s hasta encontrar Sur. No cuenta como medida con una persona. | `evidence/o3.txt` |
| O4 — `libres` con 1.000 reservas responde en < 50 ms | cumple | 0,0087 ms por llamada (media de 1.000) y 0,0015–0,0027 ms en las 10 repeticiones. Mide la función, sin el arranque del proceso. La medida anterior, con 100 reservas, no era la carga de la spec y queda sustituida. | `evidence/o2-o4-1000.txt`, `evidence/o4-aguante.txt` (anterior: `evidence/o4.txt`) |

## 3. Aguante

Carga: 1.000 reservas activas, la peor carga que confirmó el dev-lead («esa es la peor, sí»).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,0024 ms/llamada | rss 60,0 MB · heap 4,10 MB |
| 2 | 0,0027 ms/llamada | rss 60,6 MB · heap 4,46 MB |
| 3 | 0,0019 ms/llamada | rss 60,8 MB · heap 4,46 MB |
| 4 | 0,0017 ms/llamada | rss 60,8 MB · heap 4,46 MB |
| 5 | 0,0021 ms/llamada | rss 60,8 MB · heap 4,44 MB |
| 6 | 0,0025 ms/llamada | rss 60,9 MB · heap 4,46 MB |
| 7 | 0,0019 ms/llamada | rss 60,9 MB · heap 4,46 MB |
| 8 | 0,0016 ms/llamada | rss 60,9 MB · heap 4,47 MB |
| 9 | 0,0024 ms/llamada | rss 61,0 MB · heap 4,47 MB |
| 10 | 0,0015 ms/llamada | rss 61,0 MB · heap 4,51 MB |

Cada repetición son 100.000 llamadas. El tiempo es estable. El RSS sube 1 MB y se estabiliza (60,0 → 61,0 MB) y el heap sube 0,4 MB en las 10 repeticiones, sin crecimiento sostenido. El umbral de tiempo de O4 se cumple con margen.

## 4. Recomendación

- **Elegida**: no decidir la compra todavía; primero medir O3 con una persona y redefinir O2 · **Por qué**: O1 y O4 cumplen, pero O3 está `no medido con una persona` y O2 es `no cumple tal como se definió`. Con esas dos filas no se puede sostener «sí, comprar» ni «no, descartar».
- **Descartadas**:
  - Comprar este trimestre: se apoyaría en O3, que solo se probó con el agente.
  - Descartar el quiosco: el rendimiento (O1, O4) y la memoria real (+1,6 MB sobre el runtime) no lo desaconsejan.

## 5. Lo que sale

- Medir O3 con una persona que no conozca la herramienta → fila del roadmap por abrir.
- Redefinir el umbral de O2 (50 MB queda por debajo del RSS de un Node vacío, 57 MB): medir el incremento sobre el runtime o subir el umbral → decisión del dev-lead antes de repetir la medida.
