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
| O1 — `libres` responde sin error durante ≥ 5 min seguidos | cumple | 305 s seguidos, 3.999.400 llamadas, 0 errores, con 1.000 reservas. Medido en proceso sobre una copia de `src/app.js`, no por el CLI. La medida anterior (150 s) no llegaba al umbral y no cuenta. | `evidence/o1-o2-o4-1000-reservas.txt` (`evidence/o1.txt`, la anterior) |
| O2 — con 1.000 reservas, `libres` no pasa de 50 MB de memoria | no cumple tal como se definió | RSS del proceso: 63,4 MB al empezar y 67,9 MB al acabar, ya con las 1.000 reservas. Supera los 50 MB. No se separó el heap del RSS, así que no sé cuánto es de `libres` y cuánto del propio Node. | `evidence/o1-o2-o4-1000-reservas.txt` |
| O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s, sin ayuda | no medido con una persona | Solo hay una simulación del agente con un navegador automatizado (12 s). No cuenta. | `evidence/o3.txt` |
| O4 — `libres` con 1.000 reservas responde en < 50 ms | cumple | 0,003–0,005 ms por llamada con 1.000 reservas activas. La medida anterior (3 ms) era con 100 reservas y no cuenta. | `evidence/o1-o2-o4-1000-reservas.txt` (`evidence/o4.txt`, la anterior) |

## 3. Aguante

Carga: 1.000 reservas activas (confirmada por el dev-lead: «esa es la peor, sí»).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,003 ms | 65,4 MB |
| 2 | 0,005 ms | 65,5 MB |
| 3 | 0,003 ms | 65,6 MB |
| 4 | 0,004 ms | 65,6 MB |
| 5 | 0,004 ms | 65,7 MB |
| 6 | 0,004 ms | 66,1 MB |
| 7 | 0,004 ms | 66,1 MB |
| 8 | 0,003 ms | 66,1 MB |
| 9 | 0,003 ms | 66,1 MB |
| 10 | 0,003 ms | 66,1 MB |
| 11 | 0,003 ms | 66,1 MB |
| 12 | 0,003 ms | 66,1 MB |

La memoria sube 0,7 MB en las primeras 6 repeticiones y se queda plana; el RSS final del bucle completo fue 67,9 MB.

## 4. Recomendación

- **Elegida**: no decidir la compra todavía · **Por qué**: O1 y O4 cumplen, pero O2 no cumple tal como se definió (67,9 MB frente a 50 MB) y O3 no está medido con una persona. Sin esas dos filas no puedo sostener un «sí» a la decisión que desbloquea.
- **Descartadas**:
  - Comprar el quiosco ya: apoyada solo en O1 y O4, ignora un `no cumple` y un `no medido`.
  - Dar O3 por cumplido con los 12 s del agente: una simulación no es una persona que no conoce la herramienta.

Para cerrar: que una persona haga la prueba de O3, y que el dev-lead diga si los 50 MB de O2 son de proceso entero (entonces no cumple) o solo de `libres` (entonces hay que medir el heap).

## 5. Lo que sale

- Medir O3 con una persona → fila del roadmap por abrir
- Medir el heap de `libres` frente al RSS, si el dev-lead dice que O2 es de `libres` → fila del roadmap por abrir
