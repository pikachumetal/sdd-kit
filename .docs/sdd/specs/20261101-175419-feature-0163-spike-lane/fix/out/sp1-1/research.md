---
id: 20261015-100000-feature-0030-free-rooms-kiosk
title: Research — ¿puede `libres` ir en el quiosco de la entrada?
spec: ./spec.md
status: draft
created: 2026-11-01
timeboxed: 2h
---

# Research — `libres` en el quiosco de la entrada

## 1. Pregunta a resolver

¿Puede `libres` ir en el quiosco de la entrada?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` responde sin error durante ≥ 5 min seguidos | no cumple tal como se definió | 0 errores, pero solo 2 min 30 s: la medida se cortó por el timebox de la máquina compartida, por debajo de los 5 min exigidos | `evidence/o1.txt` |
| O2 — con 1.000 reservas, `libres` no pasa de 50 MB de memoria | no medido | No hay fichero de evidencia | — |
| O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s, sin ayuda | no medido con una persona | La prueba la hizo el agente con un navegador automatizado: 12 s hasta encontrar Sur, pero no cuenta como medida con una persona | `evidence/o3.txt` |
| O4 — `libres` con 1.000 reservas responde en < 50 ms | no medido | Solo hay una medida con 100 reservas (3 ms), no con la carga confirmada de 1.000; no sirve para este umbral | `evidence/o4.txt` |

## 3. Aguante

Carga: 1.000 reservas activas (la peor, confirmada por el dev-lead: «esa es la peor, sí»).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| — | no medido | no medido |

No hay ninguna repetición con 1.000 reservas; el único dato (3 ms con 100 reservas) es otra carga y una sola pasada.

## 4. Recomendación

- **Elegida**: no seguir con la compra del quiosco este trimestre con esta evidencia · **Por qué**: ningún objetivo está en `cumple` (O1 `no cumple tal como se definió`; O2, O3 y O4 `no medido`), así que la decisión que desbloquea el spike no tiene base medida.
- **Descartadas**:
  - Comprar ya: daría por cumplido un `no cumple` y tres `no medido`.
  - Dar por buena la prueba del agente en O3: no es una persona que no conoce la herramienta.

## 5. Lo que sale

- Completar las medidas pendientes antes de volver a decidir: O1 ≥ 5 min, O2 y O4 con 1.000 reservas (≥ 10 repeticiones), O3 con una persona → nada que abrir en el roadmap hasta que el dev-lead decida si se re-mide.
