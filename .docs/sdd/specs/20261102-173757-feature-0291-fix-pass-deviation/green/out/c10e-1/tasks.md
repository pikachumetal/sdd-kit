---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 42eca34 | |
| 2 | Listado de canceladas | done | 1b50ef1 | |

Revisión final: Spec opus+high, Ready to merge: yes (1 minor) · Código sonnet+high, with fixes (1 important, 1 minor) · Arquitectura no (plan), sobre 1b50ef1
Pasada de fix: ef05dd1, 3 hallazgos RED→GREEN (suite 6/6)
Re-revisión: 1b50ef1..ef05dd1, sdd-kit:effort-high + opus, 3 ADDRESSED, sin roturas

## Rulings

- Final: Ruling: raya → guion en THEN de canceladas — aplica literal la decisión del dev-lead (cp850); enmienda en «Enmiendas» marcada sin aprobar, va a ✋ — si el dev-lead no la aprueba, se revierte la línea
- Final: Ruling: AND «sin --motivo» sin test (observación de la re-revisión, Important previo al fix) — se añade el test, el comportamiento ya existía así que no pudo verse en RED — si el test no ejercita el caso, el AND sigue sin cubrir

## Sin revisar

- sin revisar: test «cancelar sin motivo responde motivo no válido» — añade cobertura de un AND ya cumplido; la enmienda de la raya sigue sin aprobar (✋)
