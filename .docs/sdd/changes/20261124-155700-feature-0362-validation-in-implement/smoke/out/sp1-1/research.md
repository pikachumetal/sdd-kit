---
id: 20261015-100000-feature-0030-free-rooms-kiosk
title: Research — ¿puede `libres` ir en el quiosco de la entrada?
spec: ./spec.md
status: draft
created: 2026-11-25
timeboxed: 2h
---

# Research — `libres` en el quiosco de la entrada

## 1. Pregunta a resolver

¿Puede `libres` ir en el quiosco de la entrada?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` sin error ≥ 5 min seguidos | no cumple tal como se definió | 2 min 30 s, 0 errores; cortado por el timebox de la máquina compartida. Medido por debajo del umbral. | `evidence/o1.txt` |
| O2 — con 1.000 reservas, ≤ 50 MB de memoria | no cumple tal como se definió | RSS del proceso 54,3 → 56,4 MB en 10 repeticiones (> 50 MB). Más de la mitad es la base de Node (~54 MB al inicio); el crecimiento atribuible a las reservas es ~2 MB. Medido con un reimplementado del filtro de `freeRooms`, no con `src/app.js`: `bookings` no es inyectable. | `evidence/o2-o4-1000.txt` |
| O3 — persona que no conoce la herramienta encuentra sala libre en < 30 s sin ayuda | no medido con una persona | 12 s, pero lo hizo el agente con un navegador automatizado, sin ninguna persona. | `evidence/o3.txt` |
| O4 — con 1.000 reservas, < 50 ms | cumple (con la salvedad del reimplementado) | 0,006–0,011 ms por llamada con 1.000 reservas activas. La medida previa de 3 ms era con 100 reservas, no la peor carga. | `evidence/o2-o4-1000.txt` (previa: `evidence/o4.txt`) |

## 3. Aguante

Carga: 1.000 reservas activas (la peor, confirmada por el dev-lead).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,009 ms | 54,7 MB |
| 2 | 0,006 ms | 55,5 MB |
| 3 | 0,008 ms | 55,6 MB |
| 4 | 0,006 ms | 55,7 MB |
| 5 | 0,006 ms | 55,7 MB |
| 6 | 0,006 ms | 55,7 MB |
| 7 | 0,011 ms | 56,1 MB |
| 8 | 0,007 ms | 56,2 MB |
| 9 | 0,006 ms | 56,3 MB |
| 10 | 0,006 ms | 56,4 MB |

El tiempo cumple en las 10 repeticiones. El recurso crece sin estabilizarse en el tramo medido (54,7 → 56,4 MB, +1,7 MB): puede ser calentamiento del motor, pero con 10 repeticiones no se distingue de una fuga.

## 4. Recomendación

- **Elegida**: no decidir la compra con esta medida; repetir lo que falta antes de decidir este trimestre. **Por qué**: solo O4 cumple. O1 y O2 salen «no cumple tal como se definió» y O3 está «no medido con una persona». La decisión que desbloquea (comprar el quiosco este trimestre) no se sostiene con filas que no cumplen o no se midieron.
- **Descartadas**: (a) «comprar ya»: dos objetivos no cumplen y uno no se midió con una persona. (b) «no seguir»: el rendimiento (O4) cumple con holgura y el fallo de O2 es sobre todo la base de Node, así que no hay motivo para descartarlo.

## 5. Lo que sale

- Repetir O1 con ≥ 5 min en una máquina no compartida → fila del roadmap por abrir.
- Repetir O3 con una persona real → fila del roadmap por abrir.
- Decidir si O2 mide el RSS del proceso o solo lo atribuible a las reservas, y medirlo contra `src/app.js` real (`bookings` hoy no es inyectable) → fila del roadmap por abrir.
