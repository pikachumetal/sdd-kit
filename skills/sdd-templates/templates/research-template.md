---
id: <yyyyMMdd-HHmmss>-feature-<id>-<slug>
title: Research — <tema investigado>
spec: ./spec.md
status: draft
created: <YYYY-MM-DD>
timeboxed: 2h
---

# Research — <tema>

> **Timebox**: máx 2h; si se desborda, escalar al usuario. Borra los bloques de ayuda (`>`) al redactar.

## 1. Pregunta a resolver

La de la spec.

## 2. Objetivos

> Una fila por objetivo de la spec. Estado: `cumple`, `no cumple` o `no medido`. Medido por debajo del umbral: `no cumple tal como se definió`, aunque funcione. Lo que simula el agente no cuenta como medido con una persona: `no medido con una persona`. Sin fichero de evidencia: `no medido`.

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — <objetivo y umbral> | | <lo medido, con su cifra> | <fichero con la salida en bruto> |

## 3. Aguante *(solo si un objetivo es de rendimiento)*

> ≥ 10 repeticiones seguidas con la peor carga que confirmó el dev-lead. Un umbral cumplido con el recurso creciendo se dice.

Carga: <la de la spec>

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |

## 4. Recomendación

> Solo cita filas medidas; no dar por cumplido un `no cumple` ni un `no medido`. «No seguir» es una recomendación válida.

- **Elegida**: <opción, o no seguir> · **Por qué**: <filas que la sostienen>
- **Descartadas**: <1-3, y por qué>

## 5. Lo que sale

> Un arreglo que la medida deja a la vista va aquí, con su fila: el spike no deja código de producción.

- <cambio> → <fila del roadmap por abrir> | nada
