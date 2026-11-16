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

## 2. Opciones evaluadas

### 2.1 Opción A — Comprar el quiosco este trimestre con `libres` tal cual

- **Qué es**: decidir ya con las medidas actuales.
- **Pros**: no retrasa la compra.
- **Contras**: ninguno de los tres objetivos está demostrado (ver §4).
- **Coste estimado**: sin estimar; el riesgo es comprar sin evidencia.

### 2.2 Opción B — Completar las tres medidas y decidir después

- **Qué es**: repetir O1 sin recorte, medir O2 y hacer O3 con una persona real.
- **Pros**: la decisión se apoya en las medidas que la spec pidió.
- **Contras**: retrasa la decisión lo que tarden las medidas.
- **Coste estimado**: sin estimar; O1 son ≥ 5 min de ejecución y O3 necesita una persona.

## 3. Recomendación

- **Elegida**: Opción B. Con lo medido no se puede responder la pregunta.
- **Por qué**: los objetivos no están cumplidos ni refutados.

## 4. Spike (si se hizo)

- **Branch**: `feature/0030-free-rooms-kiosk` · **Duración real**: no registrada · **Resultado**: `evidence/`
- **Aprendizajes clave** — resultado por objetivo:

| Objetivo | Medida | Veredicto |
| --- | --- | --- |
| O1 — sin error ≥ 5 min seguidos | 2 min 30 s, 0 errores; cortado por el timebox de la máquina compartida (`evidence/o1.txt`) | **No concluyente**: se midió la mitad del mínimo. Sin errores hasta ahí, pero no cumple el criterio. |
| O2 — ≤ 50 MB con 1.000 reservas | No hay medida en `evidence/` | **No medido** |
| O3 — persona que no conoce la herramienta, < 30 s, sin ayuda | 12 s hasta encontrar Sur, con un navegador automatizado y sin ninguna persona (`evidence/o3.txt`) | **No válido**: el objetivo pide una persona; el agente conoce la herramienta. Es una cota inferior técnica, no la prueba. |

## 5. Referencias

- `evidence/o1.txt`, `evidence/o3.txt`
- `spec.md` (Objetivos O1–O3)
