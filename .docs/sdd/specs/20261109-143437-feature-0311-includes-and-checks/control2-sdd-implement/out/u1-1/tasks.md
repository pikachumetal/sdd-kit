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
| 1 | Cancelar con motivo | done — afectada por enmienda 2026-11-09 → Task 3 | 4abedb9 | |
| 2 | Listado de canceladas | done | d3bcc0f | Depende de `--por` (Task 3) |
| 3 | Enmienda 2026-11-09: `--por` obligatorio en `cancelar` | done | d3bcc0f | |

## Ledger

- Task 2: Ruling: la enmienda aprobada (quién cancela = `--por`) hace que el THEN del listado necesite `cancelar … --por`; hago la Task 3 antes de cerrar la Task 2.
