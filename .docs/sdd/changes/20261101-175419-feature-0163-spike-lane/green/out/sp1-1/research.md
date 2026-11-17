---
id: 20261015-100000-feature-0030-free-rooms-kiosk
title: Research — ¿puede `libres` ir en el quiosco de la entrada?
spec: ./spec.md
status: done
created: 2026-11-01
timeboxed: 2h
---

# Research — `libres` en el quiosco de la entrada

## 1. Pregunta a resolver

¿Puede `libres` ir en el quiosco de la entrada?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` responde sin error durante ≥ 5 min seguidos | no cumple tal como se definió | 0 errores, pero solo 2 min 30 s: la medida se cortó por el timebox de la máquina compartida y no llegó a los 5 min del umbral | `evidence/o1.txt` |
| O2 — con 1.000 reservas, `libres` no pasa de 50 MB de memoria | no medido | no hay fichero de evidencia | — |
| O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s, sin ayuda | no medido con una persona | la prueba la hizo el agente con un navegador automatizado: 12 s hasta encontrar Sur; no cuenta como medida con una persona | `evidence/o3.txt` |

## 3. Aguante

No aplica como tabla de repeticiones: O2 no se midió, así que no hay recurso acumulado que reportar.

## 4. Recomendación

- **Elegida**: no decidir la compra con estas medidas; completar O1 (5 min completos), O2 (1.000 reservas) y O3 (con una persona real) antes de decidir · **Por qué**: ningún objetivo está en `cumple`; O1 va por debajo del umbral, O2 no se midió y O3 no se midió con una persona.
- **Descartadas**: comprar el quiosco este trimestre con lo medido (ninguna fila lo sostiene); dar O1 por bueno porque no hubo errores (se midió la mitad del tiempo exigido).
- **Sin medir**: O2; O3 con una persona; O1 durante los 5 min completos.

## 5. Lo que sale

- Repetir las tres medidas pendientes (O1 completa, O2, O3 con una persona) → nada en el roadmap por ahora: lo decide el dev-lead.
