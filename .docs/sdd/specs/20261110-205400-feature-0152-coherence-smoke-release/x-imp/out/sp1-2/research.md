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
| O1 — `libres` responde sin error durante ≥ 5 min seguidos | cumple | 330 s en bucle, 21.460.086 llamadas, 0 errores, con 1.000 reservas. Medido en proceso sobre una copia de `src/app.js`, no por el CLI ni en un quiosco. Una medida previa de 2 min 30 s (`o1.txt`) no llegaba al umbral y no cuenta. | `evidence/o1-5min.txt` |
| O2 — con 1.000 reservas, no pasa de 50 MB de memoria | no cumple tal como se definió | rss 65,6 MB; un proceso `node` vacío ya da 62,8 MB. El heap es 4,1 MB. El umbral no distingue entre el proceso y la lógica: el proceso solo supera los 50 MB. | `evidence/o2.txt` |
| O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s, sin ayuda | no medido con una persona | Solo hay una simulación del agente con navegador automatizado (12 s). No es una persona. | `evidence/o3.txt` |
| O4 — con 1.000 reservas, responde en < 50 ms | cumple | Mediana 0,011 ms, p99 0,029 ms, máx 0,659 ms en 1.000 llamadas, con 1.000 reservas activas. Es la llamada en proceso, sin arranque del CLI. La medida previa de 3 ms con 100 reservas (`o4.txt`) no es la carga de la spec y no cuenta. | `evidence/o4-1000.txt` |

## 3. Aguante

Carga: 1.000 reservas activas (la peor, confirmada por el dev-lead).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,007 ms | rss 65,7 MB · heap 4,4 MB |
| 2 | 0,007 ms | rss 65,8 MB · heap 4,4 MB |
| 3 | 0,007 ms | rss 65,9 MB · heap 4,4 MB |
| 4 | 0,007 ms | rss 65,9 MB · heap 4,9 MB |
| 5 | 0,007 ms | rss 66,1 MB · heap 4,4 MB |
| 6 | 0,007 ms | rss 66,2 MB · heap 4,4 MB |
| 7 | 0,007 ms | rss 66,2 MB · heap 4,4 MB |
| 8 | 0,012 ms | rss 66,2 MB · heap 4,5 MB |
| 9 | 0,007 ms | rss 66,3 MB · heap 4,5 MB |
| 10 | 0,007 ms | rss 66,2 MB · heap 4,5 MB |

Tiempo: mediana por llamada en cada repetición de 1.000 llamadas. El tiempo es estable. El rss crece 0,6 MB en 10 repeticiones y se estabiliza en torno a 66 MB; el heap no crece.

## 4. Recomendación

- **Elegida**: no decidir la compra todavía; falta O3 con una persona, y O2 hay que redefinirlo · **Por qué**: O1 y O4 cumplen (rendimiento y estabilidad de la lógica sobran). O2 no cumple tal como se definió (65,6 MB de proceso frente a 50 MB, de los que 62,8 son el propio `node`). O3 no está medido con una persona.
- **Descartadas**: comprar ya (O3 sin medir con una persona, O2 no cumple); no seguir (la lógica no es el problema en ninguna fila medida).

## 5. Lo que sale

- Probar O3 con una persona que no conozca la herramienta → fila del roadmap por abrir
- Aclarar con el dev-lead si O2 mide el proceso (50 MB no se alcanza con `node`) o la lógica (4,1 MB) → decisión del dev-lead, antes de comprar
