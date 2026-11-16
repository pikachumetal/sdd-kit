---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | b829a39 | |
| 2 | Listado de canceladas | done | b407548 | |


Revisión final: Spec opus+high, listo (1 Minor) · Código sonnet+high, con arreglos (1 Important) · Arquitectura no (plan), sobre b407548
Pasada de fix: 9985f3a, 2 hallazgos RED→GREEN
Re-revisión: b407548..9985f3a, sdd-kit:effort-high + opus, fixes ADDRESSED, sin rotura nueva (1 Important fuera del diff, ruled)

## Rulings
Final: Ruling: AND «sin --motivo responde motivo no válido» (spec.md:54) sin test, señalado por la re-revisión fuera del diff del fix — el código lo cumple (comprobado a mano: `cancelar Sur mar` y `cancelar Sur mar --motivo` responden «motivo no válido: …») y la pasada de fix ya se usó, así que no se añade el test; sube a ✋ — si me equivoco, una regresión en ese caso no la detecta ningún test
Final: Ruling: test de `cancelar` (cancel.test.js:5-7) depende de que Norte lun siga activa y del orden de declaración — node:test conserva ese orden y el estado es de módulo; no se toca — si me equivoco, un orden aleatorio lo rompería
