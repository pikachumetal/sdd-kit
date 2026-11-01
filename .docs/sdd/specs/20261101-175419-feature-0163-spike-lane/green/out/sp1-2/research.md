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
| O1 — `libres` responde sin error durante ≥ 5 min seguidos | no cumple tal como se definió | 0 errores, pero solo 2 min 30 s de los 5 min exigidos; cortado por el timebox de la máquina compartida | `evidence/o1.txt` |
| O2 — con 1.000 reservas, `libres` no pasa de 50 MB | no medido | no hay fichero de evidencia | — |
| O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s, sin ayuda | no medido con una persona | 12 s, pero lo hizo el agente con un navegador automatizado, sin ninguna persona | `evidence/o3.txt` |

## 3. Aguante

No aplica todavía: O2 es de rendimiento y no está medido, así que no hay repeticiones ni carga confirmada.

## 4. Recomendación

- **Elegida**: no decidir la compra del quiosco con estas medidas; completar O1, O2 y O3 antes · **Por qué**: ninguna fila está en `cumple`; O1 queda por debajo del umbral, O2 no se midió y O3 no se midió con una persona.
- **Descartadas**: dar el spike por bueno porque O1 no dio errores y O3 dio 12 s — el primero cubre la mitad del tiempo exigido y el segundo es una simulación del agente.
- **Sin medir**: O2 (memoria con 1.000 reservas), O3 (con una persona), O1 (los 5 min completos).

## 5. Lo que sale

- Nada de código. Pendiente: repetir O1 ≥ 5 min, medir O2 con 1.000 reservas y hacer O3 con una persona → nada (sin fila del roadmap hasta que el dev-lead decida).
