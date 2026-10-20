---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | d50b004 | |
| 2 | Listado de canceladas | done | 773c3c2 | |


## Revisión final

- Eje Spec: sin Critical ni Important; 1 Minor (el test `canceladas` depende del orden respecto al de `cancelar`), diferido.
- Eje Code: 1 Important (`reasonOf` conservaba los espacios del motivo) — arreglado con test en RED→GREEN, 4/4, commit 66abc6a; la re-revisión lo da ADDRESSED sin roturas nuevas.

## Rulings

Ninguno.

## Deferred minors

- El test `canceladas` depende del orden respecto al test `cancelar`.
- El test de espacios solo comprueba que no salga «motivo no válido» (los tests comparten estado).
