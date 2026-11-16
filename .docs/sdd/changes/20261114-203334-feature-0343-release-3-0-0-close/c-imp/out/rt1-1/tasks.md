---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 3b448d8 | |
| 2 | Listado de canceladas | done | bbeb33a | Añade el test de «sin --motivo» que faltaba de Task 1 |

Revisión final: autorrevisión del hilo (sin herramienta de subagentes), sin hallazgos Critical/Important, 1 menor diferido, sobre e0bd9e7

## Rulings

Task 2: Ruling: compactación/retoma — sigo con Native — queda 1 task
Task 2: Ruling: añado el test de «sin --motivo» (AND de la spec sin cobertura desde Task 1) — pasa de entrada porque Task 1 ya lo cumplía — coste si falla: ninguno, solo cobertura
Task 2: Ruling: el test de canceladas importa app.js con query string para tener estado fresco — evita depender del orden de los tests — coste: si el runner cachea por query, se vería en el RED
Final: minor (deferred): `canceladas` sin canceladas devuelve cadena vacía; el spec no fija el texto
