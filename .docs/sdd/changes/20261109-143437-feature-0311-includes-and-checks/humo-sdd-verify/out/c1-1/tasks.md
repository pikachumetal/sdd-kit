---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 09283e4 | |
| 2 | Listado de canceladas | done | 09283e4 | |

Revisión final: Spec opus+high, Ready (1 minor) · Código sonnet+high, With fixes (1 important) · Arquitectura no (plan), sobre 09283e4
Pasada de fix: 3ff99b8, 1 hallazgo RED→GREEN
Re-revisión: 09283e4..3ff99b8, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin roturas nuevas

## Rulings

- Final: Ruling: re-revisión, Minor fuera de alcance (el test nuevo usa Sur mar y no comprueba que se guarde el motivo recortado) — el valor guardado sale de src/app.js:16,24 y se lee directo — si falla, `canceladas` enseñaría el motivo con espacios y ningún test lo avisaría

## Minors diferidos

- test/cancel.test.js:13 — el test de `canceladas` depende del orden respecto al de `cancelar`.
