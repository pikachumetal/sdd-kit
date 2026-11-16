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
| O1 — `libres` responde sin error durante ≥ 5 min seguidos | no cumple tal como se definió | 0 errores, pero solo 2 min 30 s: cortado por el timebox de la máquina compartida. No llegó a 5 min | `evidence/o1.txt` |
| O2 — con 1.000 reservas, `libres` no pasa de 50 MB de memoria | no cumple tal como se definió | RSS del proceso 63,8 MB (63,2 MB antes de llamar a `libres`: es la base de Node). `heapUsed` 5,7 MB. Con RSS pasa de 50 MB; el umbral no dice qué memoria cuenta | `evidence/o2-o4-1000.txt` |
| O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s, sin ayuda | no medido con una persona | Los 12 s los midió el agente con un navegador automatizado, sin ninguna persona | `evidence/o3.txt` |
| O4 — con 1.000 reservas, `libres` responde en < 50 ms | cumple | 0,015–0,110 ms en 10 repeticiones con 1.000 reservas activas. La medida de 3 ms de `o4.txt` es con 100 reservas, no es la carga de la spec y no cuenta | `evidence/o2-o4-1000.txt` |

## 3. Aguante

Carga: 1.000 reservas activas (la peor, confirmada por el dev-lead).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,110 ms | 63,8 MB |
| 2 | 0,049 ms | 63,8 MB |
| 3 | 0,078 ms | 63,8 MB |
| 4 | 0,052 ms | 63,8 MB |
| 5 | 0,036 ms | 63,8 MB |
| 6 | 0,017 ms | 63,8 MB |
| 7 | 0,015 ms | 63,8 MB |
| 8 | 0,015 ms | 63,8 MB |
| 9 | 0,017 ms | 63,8 MB |
| 10 | 0,016 ms | 63,8 MB |

Memoria estable en las 10 repeticiones. Medido sobre una copia de `src/app.js` fuera del repo con las 1.000 reservas inyectadas; el código de producción no se tocó.

## 4. Recomendación

- **Elegida**: no decidir la compra todavía; completar O1 (≥ 5 min), O3 (con una persona) y fijar qué memoria cuenta en O2 · **Por qué**: solo O4 cumple. O1 y O2 quedan `no cumple tal como se definió` y O3 `no medido con una persona`; ninguno se da por cumplido.
- **Descartadas**: comprar ya (sostenerlo exigiría dar por cumplidas O1, O2 y O3); no seguir (la única medida que cumple, O4, deja mucho margen, y las otras tres son por medir, no medidas en contra).

## 5. Lo que sale

- Nada que cambie código. Faltan tres medidas (O1 completa, O3 con una persona, O2 con la memoria definida) → nada, las decide el dev-lead antes de la compra.
