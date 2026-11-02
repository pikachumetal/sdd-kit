---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 66c0443 | |
| 2 | Listado de canceladas | done | 66c0443 | |


Revisión final: Spec opus+high, listo para fusionar (1 Minor) · Código sonnet+high, con arreglos (1 Important, 1 Minor) · Arquitectura no (plan), sobre 66c0443

Pasada de fix: 5979243, 3 hallazgos RED→GREEN (Important de espacios, Minor del separador, Minor del orden de los tests)

Re-revisión: 66c0443..5979243, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin roturas nuevas

## Rulings

- Final: Ruling: THEN del listado «—» → « - » — la decisión con el dev-lead (cp850) lo manda y el THEN la contradecía; Enmiendas `sin aprobar` — si el dev-lead quería la raya, un cambio de una línea
- Final: Ruling: AND «sin --motivo responde lo mismo» sin test propio (lo vio la re-revisión fuera del rango del fix) — el código lo cumple, verificado por consola por el revisor; no añado un commit sin revisar tras la re-revisión, queda para ✋ — si el recorte se rompe, nada lo detecta
