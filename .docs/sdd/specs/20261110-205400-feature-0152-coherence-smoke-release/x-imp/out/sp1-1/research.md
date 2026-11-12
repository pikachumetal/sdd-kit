---
id: 20261015-100000-feature-0030-free-rooms-kiosk
title: Research — ¿puede `libres` ir en el quiosco de la entrada?
spec: ./spec.md
status: draft
created: 2026-11-12
timeboxed: 2h
---

# Research — `libres` en el quiosco de la entrada

## 1. Pregunta a resolver

¿Puede `libres` ir en el quiosco de la entrada?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` responde sin error durante ≥ 5 min seguidos | cumple | 5 min 2 s en bucle, 39.362.000 llamadas, 0 errores. La medida anterior (2 min 30 s) no llegaba al umbral y no se usa. | `evidence/o1-5min.txt` (`evidence/o1.txt` queda como medida descartada) |
| O2 — con 1.000 reservas, `libres` no pasa de 50 MB de memoria | no cumple tal como se definió | Con 1.000 reservas activas el proceso llega a 66,0 MB de RSS (67,3 MB tras el aguante). Sin las reservas añadidas, solo cargar el módulo ya da 62,7 MB: lo que aportan las reservas es ≈ 3,3 MB de RSS y 4,4 MB de heap. El umbral no dice qué memoria mide; con RSS lo incumple el runtime de Node, no `libres`. | `evidence/o2-o4-1000.txt` |
| O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s, sin ayuda | no medido con una persona | Solo hay la prueba del agente con un navegador automatizado (12 s hasta encontrar Sur); no cuenta como medida con una persona. | `evidence/o3.txt` |
| O4 — `libres` con 1.000 reservas responde en < 50 ms | cumple | Con 1.000 reservas activas: 0,022 ms de media por llamada, p99 0,014 ms, máximo 0,38 ms. Es la llamada en proceso: no incluye el arranque de `node` ni el navegador del quiosco. La medida anterior (100 reservas, 3 ms) no era la peor carga y no se usa. | `evidence/o2-o4-1000.txt` |

## 3. Aguante

Carga: 1.000 reservas activas (la peor, confirmada: «esa es la peor, sí»).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,0024 ms/llamada | RSS 66,9 MB · heap 4,5 MB |
| 2 | 0,0025 ms/llamada | RSS 67,0 MB · heap 4,5 MB |
| 3 | 0,0028 ms/llamada | RSS 67,0 MB · heap 5,4 MB |
| 4 | 0,0027 ms/llamada | RSS 67,0 MB · heap 5,4 MB |
| 5 | 0,0026 ms/llamada | RSS 67,2 MB · heap 4,6 MB |
| 6 | 0,0021 ms/llamada | RSS 67,1 MB · heap 4,9 MB |
| 7 | 0,0022 ms/llamada | RSS 67,2 MB · heap 5,0 MB |
| 8 | 0,0020 ms/llamada | RSS 67,3 MB · heap 5,2 MB |
| 9 | 0,0020 ms/llamada | RSS 67,3 MB · heap 5,2 MB |
| 10 | 0,0020 ms/llamada | RSS 67,3 MB · heap 5,2 MB |
| 11 | 0,0020 ms/llamada | RSS 67,3 MB · heap 5,2 MB |
| 12 | 0,0018 ms/llamada | RSS 67,3 MB · heap 5,2 MB |

Cada repetición son 100.000 llamadas. El tiempo no empeora. El RSS sube 0,4 MB entre la primera y la última repetición y se estabiliza desde la 8; el heap oscila entre 4,5 y 5,4 MB sin crecer. Salida en bruto: `evidence/o4-aguante.txt`.

## 4. Recomendación

- **Elegida**: no decidir la compra todavía. Falta O3 con una persona y hay que fijar qué mide O2. · **Por qué**: O1 y O4 cumplen con medida completa; O2 no cumple tal como se definió (66,0 MB de RSS contra 50 MB) y O3 no se ha medido con una persona. Con lo medido, `libres` no es el obstáculo: en O2 el RSS lo domina el runtime (62,7 MB sin reservas añadidas).
- **Descartadas**: (1) comprar ya: dar por buenos O2 y O3 sería citar filas que no cumplen o no se midieron. (2) No seguir: ninguna fila medida muestra que `libres` falle; lo que falla es el umbral de O2, que no dice qué memoria cuenta.

## 5. Lo que sale

- Prueba de O3 con una persona que no conozca la herramienta → fila del roadmap por abrir (la abre el dev-lead; este spike no la abre).
- Precisar O2 (RSS del proceso o heap) → decisión del dev-lead antes de dar el objetivo por cerrado.
