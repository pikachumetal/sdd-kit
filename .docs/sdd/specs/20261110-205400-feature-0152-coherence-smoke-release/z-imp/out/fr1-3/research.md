---
id: 20261015-130000-feature-0033-duplicate-candidates
title: Research — candidatos a duplicado por confirmar a mano
spec: ./spec.md
status: draft
created: 2026-11-12
timeboxed: 2h
---

# Research — candidatos a duplicado por confirmar a mano

## 1. Pregunta a resolver

¿Cuántos candidatos a duplicado hay que confirmar a mano en el histórico de reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — contar los candidatos de cada clase y su suma, con `scripts/candidatos.mjs` | cumple | Umbral 2 en las tres clases (pareja candidata si comparte al menos 2 campos; con 1 es coincidencia): sala 59, motivo 778, semanal 78, suma 915. Pasa de 300: se cumple la parada de la decisión 3 de la spec. | `candidatos-salida.txt`, `candidatos.mjs` |

Sensibilidad (misma salida): umbral 1 → 1465; umbral 3 en las tres → 525; sala 3, motivo 4, semanal 3 → 325. Ninguna combinación probada deja la suma por debajo de 300 sin subir el motivo a 4, y no hay en el repo nada que justifique ese umbral distinto.

## 4. Recomendación

- **Elegida**: no confirmar a mano todo el histórico; automatizar al menos la clase `motivo` (778 de 915) · **Por qué**: la suma, 915, triplica el tope de 300 de la spec, y `motivo` pone el 85 % de los candidatos.
- **Descartadas**: confirmar a mano las tres clases (915 por persona); subir los umbrales hasta caber en 300 (sin criterio en el repo, sería ajustar el umbral a la cifra).

## 5. Lo que sale

- nada
