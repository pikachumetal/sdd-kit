---
id: 20261101-140903-feature-0272-using-sdd-templates-english
title: Tasks — using-sdd y sdd-templates en inglés
spec: ./spec.md
plan: ./plan.md
created: 2026-11-01
---

# Tasks — `using-sdd` y `sdd-templates` en inglés (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0272-using-sdd-templates-english`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Reescribir las dos skills | done | 46c3ecf0 | |
| 2 | Medir enrutado y calco | done | 160a84fe | A/B de `r1` y enmienda |

## Verificación por task

- [x] Task 1 — `moon run cli:test`
- [x] Task 2 — batería `using-sdd` y humo con `sdd decision check`

Revisión final: Spec opus+high, con 2 Important y 5 Minor, 5 sin verificar · Código sonnet+high, limpio con 5 Minor · Arquitectura no (plan), sobre 160a84fe

Pasada de fix: evidencia, plan y fila de `r1`; sin test posible, son documentos.

## Fixes adicionales

Ninguno.

## Rulings

Task 2: Ruling: A/B de r1 fuera del plan (4 sujetos en inglés, 4 en castellano, 1,33 $) tras su rojo — para distinguir traducción de inestabilidad sin relanzar para sacar verde — si es incorrecto: 1,33 $
Task 2: Ruling: humo con un sujeto en el scratchpad — sdd-templates no tiene batería — si es incorrecto: repetirlo
Task 2: Ruling: A/B de r1 ampliado a 14 sujetos por idioma a petición del dev-lead (opción 2) — 11/14 en inglés, 9/14 en castellano — coste 9,92 $ acumulados
Task 2: Ruling: la Verificación de task done es moon run cli:test, no el veredicto de la batería — el veredicto sale con 1 por r1, cubierto por la enmienda aprobada; el resultado por fila está en tests/english-using-templates-green.md — si es incorrecto: nada, la evidencia sigue ahí
Final: Ruling: los Minor de redacción («only the scenarios pass», «leaves it as it was», «unrepeated numbers», «No .docs/sdd/», comillas de battery.md) no se aplican — son el texto aprobado en la tabla de reglas y cambiarlo pide otra medición — si es incorrecto: un retoque de redacción
Final: Ruling: fuga de «Using sdd-…» en mensajes intermedios, 4 de 34 — queda en la evidencia, sin fila, por ser un caso y un menor — si es incorrecto: mensajes intermedios en inglés a quien escribe en castellano
Final: Ruling: la ADR del humo no se conservó — basta rc=0 de decision check, que fija los encabezados — si es incorrecto: repetir un sujeto, 0,15 $
