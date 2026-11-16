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
| O1 — `libres` responde sin error durante ≥ 5 min seguidos | no cumple tal como se definió | 0 errores, pero solo 2 min 30 s (la mitad del umbral); cortado por el timebox de la máquina compartida | `evidence/o1.txt` |
| O2 — con 1.000 reservas, `libres` no pasa de 50 MB de memoria | no medido | No hay fichero de evidencia | — |
| O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s, sin ayuda | no medido con una persona | Lo hizo el agente con un navegador automatizado: 12 s hasta encontrar Sur. No cuenta como medida con una persona | `evidence/o3.txt` |
| O4 — `libres` con 1.000 reservas responde en < 50 ms | no medido | Se midió con 100 reservas (3 ms), no con la peor carga confirmada de 1.000 | `evidence/o4.txt` |

## 3. Aguante

Carga: 1.000 reservas activas (confirmada por el dev-lead: «esa es la peor, sí»).

No medido: no hay ninguna serie de ≥ 10 repeticiones con 1.000 reservas. Lo único que hay es una medida con 100 reservas (`evidence/o4.txt`), que no sustituye la carga confirmada.

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| — | — | — |

## 4. Recomendación

- **Elegida**: no decidir la compra del quiosco con estas medidas; completar O1–O4 primero · **Por qué**: ningún objetivo está cumplido. O1 queda por debajo del umbral, O2 y O4 no se midieron con 1.000 reservas y O3 no se probó con una persona. Los 3 ms y los 12 s son buenas señales, pero no responden a los objetivos tal como se definieron.
- **Descartadas**: comprar ya (no hay ninguna fila `cumple`); dar por buenos los números del agente (O3 simulado y O4 con 100 reservas no son la medida acordada).

## 5. Lo que sale

- Repetir O1 con ≥ 5 min seguidos, y O2 y O4 con 1.000 reservas (≥ 10 repeticiones) → fila del roadmap por abrir
- Probar O3 con una persona que no conozca la herramienta → fila del roadmap por abrir
