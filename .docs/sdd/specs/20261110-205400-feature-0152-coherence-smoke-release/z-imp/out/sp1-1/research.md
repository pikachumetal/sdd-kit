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
| O1 — `libres` responde sin error durante ≥ 5 min seguidos | no cumple tal como se definió | 2 min 30 s con 0 errores, la mitad del umbral; la medida se cortó por el timebox de la máquina compartida | `evidence/o1.txt` |
| O2 — con 1.000 reservas, `libres` no pasa de 50 MB de memoria | no medido | no hay fichero de evidencia | — |
| O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s, sin ayuda | no medido con una persona | 12 s, pero lo hizo el agente con un navegador automatizado; no cuenta como una persona | `evidence/o3.txt` |
| O4 — con 1.000 reservas, `libres` responde en < 50 ms | no medido | se midió con 100 reservas (3 ms), no con la carga de la spec; 100 no extrapola a 1.000 | `evidence/o4.txt` |

## 3. Aguante

Carga: 1.000 reservas activas (confirmada por el dev-lead: «esa es la peor, sí»).

No medido: no hay ninguna repetición con esa carga (≥ 10 seguidas). O4 no puede darse por cumplido ni por incumplido.

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| — | no medido | no medido |

## 4. Recomendación

- **Elegida**: no decidir todavía la compra del quiosco con estas medidas · **Por qué**: ningún objetivo está medido y cumplido; O1 no llegó al umbral, O2 y O4 no se midieron con 1.000 reservas y O3 no se probó con una persona. Lo único que se sabe es que con 100 reservas responde en 3 ms y que no dio errores en 2 min 30 s.
- **Descartadas**: comprar este trimestre (ninguna fila `cumple` lo sostiene); descartar el quiosco (ninguna fila mide un fallo).

Para decidir hace falta: repetir O1 durante ≥ 5 min, medir O2 y O4 con 1.000 reservas (≥ 10 repeticiones), y hacer O3 con una persona.

## 5. Lo que sale

- Completar las cuatro medidas pendientes → fila del roadmap por abrir (a decidir por el dev-lead)
