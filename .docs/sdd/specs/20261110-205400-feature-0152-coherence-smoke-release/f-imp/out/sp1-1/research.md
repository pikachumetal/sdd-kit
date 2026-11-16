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
| O1 — `libres` responde sin error ≥ 5 min seguidos | no cumple tal como se definió | 2 min 30 s con 0 errores; se cortó por el timebox de la máquina compartida, a la mitad del umbral | `evidence/o1.txt` |
| O2 — con 1.000 reservas, ≤ 50 MB de memoria | no cumple tal como se definió | RSS del proceso 64,1 → 65,8 MB, por encima de 50 MB. Un Node vacío ya ocupa 62,3 MB: el umbral es inalcanzable con este runtime, y `libres` añade ~3,5 MB (heap 5-6 MB) | `evidence/o2-o4-1000.txt` |
| O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s | no medido con una persona | Lo hizo el agente con un navegador automatizado (12 s): no cuenta como persona | `evidence/o3.txt` |
| O4 — con 1.000 reservas, < 50 ms | cumple | Mediana 0,013-0,014 ms, máximo 0,546 ms en 10 × 200 llamadas. La medida anterior (3 ms) era con 100 reservas y no cuenta | `evidence/o2-o4-1000.txt` (`evidence/o4.txt` es con 100) |

## 3. Aguante

Carga: 1.000 reservas activas (la peor, confirmada por el dev-lead).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | mediana 0,013 ms | RSS 64,1 MB |
| 2 | mediana 0,014 ms | RSS 64,6 MB |
| 3 | mediana 0,013 ms | RSS 64,9 MB |
| 4 | mediana 0,013 ms | RSS 65,2 MB |
| 5 | mediana 0,013 ms | RSS 65,3 MB |
| 6 | mediana 0,014 ms | RSS 65,7 MB |
| 7 | mediana 0,014 ms | RSS 65,7 MB |
| 8 | mediana 0,014 ms | RSS 65,8 MB |
| 9 | mediana 0,014 ms | RSS 65,8 MB |
| 10 | mediana 0,014 ms | RSS 65,8 MB |

El tiempo es estable, pero el RSS crece en cada repetición (+1,7 MB en 10) y se estabiliza hacia el final; con 10 repeticiones no se puede descartar una fuga lenta.

## 4. Recomendación

- **Elegida**: no decidir la compra todavía; completar O1 (≥ 5 min) y O3 (con una persona) antes de contestar. · **Por qué**: solo O4 cumple; O1 y O2 no cumplen tal como se definieron y O3 no está medido con una persona.
- **Descartadas**: dar «sí» porque el tiempo de respuesta sobra (O4), porque deja dos objetivos sin cumplir y uno sin medir; dar «no» por O2, porque el umbral de 50 MB no es alcanzable ni con un Node vacío, así que el objetivo está mal planteado más que el producto mal.

## 5. Lo que sale

- Revisar el umbral de O2 (medir el incremento sobre el runtime, no el RSS total) → fila por abrir en el roadmap.
- Repetir O1 con ≥ 5 min fuera de la máquina compartida y O3 con una persona → fila por abrir en el roadmap.
