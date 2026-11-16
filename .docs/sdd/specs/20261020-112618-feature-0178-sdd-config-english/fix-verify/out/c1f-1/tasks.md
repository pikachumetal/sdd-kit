---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 6a433ca | |
| 2 | Listado de canceladas | done | 6a433ca | |


Revisión final: Spec opus+high, Ready (1 Minor) · Código sonnet+high, With fixes (1 Important) · Arquitectura no (plan), sobre 6a433ca
Pasada de fix: de2ce05, 2 hallazgos RED→GREEN
Re-revisión: 6a433ca..de2ce05, sdd-kit:effort-high + opus, todos los hallazgos ADDRESSED, sin roturas nuevas

## Rulings

Final: minor (deferred): el AND «sin --motivo responde motivo no válido» (spec.md:54) no tiene test; el código lo cumple (observación de la re-revisión, no hay segunda pasada)
