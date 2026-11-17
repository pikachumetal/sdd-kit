---
id: 20261022-140232-feature-0208-dev-validation-script
title: Tasks — Validación del dev con guion desde el reporte
spec: ./spec.md
plan: ./plan.md
created: 2026-10-22
---

# Tasks — Validación del dev con guion desde el reporte (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0208-dev-validation-script`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `sdd validation serve` y el panel | done | `ef2e32cc` | favicon vacío en la página del plan B |
| 2 | La receta de la validación del dev | done | `ad0aadfe`, `64bbd5fe`, `241bb575` | GREEN y REFACTOR en `tests/dev-validation-green.md`; G6 3 de 4 |
| 3 | El panel en Chrome, a mano | done | `83d23ce2` | sin la extensión: con Playwright; las reglas de Chrome, `no probado` |

Revisión final: Spec opus+high, With fixes, 4 sin verificar · Código sonnet+high, With fixes · Arquitectura opus+high, With fixes, sobre la evidencia GREEN, juntada en el cierre
Pasada de fix: juntada en el cierre, 5 hallazgos RED→GREEN
Re-revisión: la pasada de fix, juntada en el cierre, sdd-kit:effort-high + opus, Findings remain open (1 Important nuevo, arreglado después con RED→GREEN: sin revisar)

## Rulings

- Task 2: `tests/Templates.Tests.ps1` no existe; la verificación corre `WordBudget` y `AnchorTemplates`.
- Task 1: la página del plan B pedía `favicon.ico` y dejaba un 404 en la consola; lleva un icono vacío (`data:,`).
- Final: la verificación del panel se hizo con Playwright: la extensión de Claude in Chrome no estaba conectada; sus cuatro reglas y la caída por CSP quedan `no probado`, con fila de deuda.
- Final: los rulings de la revisión final están en el walkthrough, «Decisiones tomadas sin el dev-lead».
