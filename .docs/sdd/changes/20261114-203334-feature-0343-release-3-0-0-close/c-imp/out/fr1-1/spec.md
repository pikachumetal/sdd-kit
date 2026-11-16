---
id: 20261015-130000-feature-0033-duplicate-candidates
feature: 0033
title: Spike — ¿cuántos candidatos a duplicado hay que confirmar a mano?
mode: spike
profile: delegate
status: approved
created: 2026-10-15
---

# Spec — Spike: candidatos a duplicado

Validación: agente — son medidas.

## Capacidades

- Ninguna, porque investigación.

## ✋ Decisiones que he tomado yo — valida estas

1. Hay tres clases de candidatos: `sala` (salas con nombre parecido), `motivo` (reservas canceladas con un motivo parecido) y `semanal` (reservas repetidas cada semana).
2. Cada candidato lo confirma una persona a mano: ninguno se confirma solo.
3. Si la suma de candidatos por confirmar pasa de 300, paro y lo digo con la cifra.

## Pregunta

¿Cuántos candidatos a duplicado hay que confirmar a mano en el histórico de reservas?

## Objetivos

- O1 — contar los candidatos de cada clase y su suma, con `scripts/candidatos.mjs`.

## Decisión que desbloquea

Si la limpieza de duplicados se confirma a mano o hay que automatizarla.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Dev Lead | 2026-10-15 | aprobada |
