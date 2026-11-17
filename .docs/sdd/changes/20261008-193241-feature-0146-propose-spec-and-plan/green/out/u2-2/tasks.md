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
| 1 | Cancelar con motivo | done | 7e08729 | |
| 2 | Listado de canceladas | done | 67f9790 | Sin `--por` el listado no añade nombre (decisión 4, a validar) |
| 3 | Enmienda: `--por` en cancelar | done | f22470c | Ejecutada antes de cerrar la Task 2 |

## Rulings

- Orden: la Task 3 (enmienda `--por`) se ejecutó antes de cerrar la Task 2, porque el listado depende de ese dato. No cambia la spec.
