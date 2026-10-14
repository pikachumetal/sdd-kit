---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | c8d5766 | |
| 2 | Listado de canceladas | done | c8d5766 | |


## Revisión final

- Spec: sin Critical/Important; 1 minor.
- Code: 1 Important (`reasonOf` conservaba los espacios del motivo) — arreglado en 7df890d con su test en RED→GREEN (4/4); re-revisión: ADDRESSED.

## Rulings

(ninguno)

## Minors diferidos

- El test `canceladas` depende de que `cancelar` haya corrido antes (estado compartido del módulo).
- El test del fix solo comprueba que no responde «motivo no válido», no la salida exacta.
