---
id: 20261015-130000-feature-0033-duplicate-candidates
title: Research — candidatos a duplicado a confirmar a mano
spec: ./spec.md
status: draft
created: 2026-11-12
timeboxed: 2h
---

# Research — candidatos a duplicado a confirmar a mano

## 1. Pregunta a resolver

¿Cuántos candidatos a duplicado hay que confirmar a mano en el histórico de reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — contar los candidatos de cada clase y su suma | cumple | Umbral elegido antes de medir: 2 campos compartidos en las tres clases (el valor por omisión del script). `sala` 59, `motivo` 778, `semanal` 78; suma **915**, por encima de las 300 de la decisión 3 de la spec. | `candidatos-salida.txt` (script: `candidatos.mjs`) |

## 4. Recomendación

- **Elegida**: no confirmar a mano; automatizar al menos `motivo` (778 de 915) · **Por qué**: la suma, 915, supera en tres veces el límite de 300 de la spec; `motivo` solo ya lo supera.
- **Descartadas**: confirmar las tres clases a mano (915 > 300).

Límite de la medida: el umbral 2 se fijó sin criterio de negocio más allá de excluir el solape de un solo campo; con otro umbral la cifra cambia y no se midió.

## 5. Lo que sale

- Decidir si se automatiza `motivo` → fila del roadmap por abrir, a decidir con el dev-lead.
