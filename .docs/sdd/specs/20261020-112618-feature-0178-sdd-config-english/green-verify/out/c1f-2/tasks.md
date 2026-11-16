---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | f480d48 | |
| 2 | Listado de canceladas | done | 919ffe6 | |


## Revisión final

- Spec: sin Critical ni Important; 1 Minor (diferido).
- Code: 1 Important — `reasonOf` conservaba los espacios del motivo. Arreglado en `e02afe0` (test RED→GREEN, 4/4); re-revisión: ADDRESSED.

## Rulings

Ninguno.

## Minors diferidos

- El test `canceladas` depende del orden del test `cancelar` (estado compartido del módulo).
- El test del recorte solo prueba que el motivo pasa la validación (`sin reserva Sur mar`), no una cancelación con motivo con espacios ni que se guarde recortado.
