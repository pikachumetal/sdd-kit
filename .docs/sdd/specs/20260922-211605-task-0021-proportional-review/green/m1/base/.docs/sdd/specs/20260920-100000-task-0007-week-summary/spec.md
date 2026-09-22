---
id: 20260920-100000-task-0007-week-summary
task: 0007
title: Resumen semanal de huecos
mode: full
status: approved
---

# Resumen semanal de huecos

## Intent

La recepción quiere ver de un vistazo cuántos huecos y cuántos minutos libres hay cada día de la semana.

## Scope

- Duración en minutos de un hueco.
- Resumen de texto por día, ordenado por fecha.

## Delta — Capacidad: slots

### ADDED — Resumen semanal

- GIVEN ningún hueco WHEN se pide el resumen THEN devuelve «Sin huecos esta semana».
- GIVEN huecos de dos días WHEN se pide el resumen THEN una línea por día, en orden de fecha: `<día>: <n> hueco(s), <minutos> min`, con «hueco» en singular si es uno.
- GIVEN dos huecos solapados el mismo día WHEN se pide el resumen THEN lanza un error «Huecos solapados el <día>».
