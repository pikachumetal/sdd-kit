---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 1294c65 | |
| 2 | Listado de canceladas | done | 4edd7a2 | |


Revisión final: Spec opus+high, listo (1 minor) · Código sonnet+high, con arreglos (1 important, 1 minor) · Arquitectura no (plan), sobre 4edd7a2
Pasada de fix: dede6c8, 3 hallazgos RED→GREEN

## Rulings

Final: Ruling: THEN de canceladas «—» → « - » — aplica literalmente la decisión con el dev-lead (línea de «Decisiones tomadas con el dev-lead»); Enmienda escrita sin aprobar — si Laura quería la raya, se revierte una línea y un test
Re-revisión: 4edd7a2..dede6c8, sdd-kit:effort-high + opus, todo atendido, sin roturas nuevas

## Minors diferidos

- El AND «sin --motivo responde lo mismo» no tiene test propio.
