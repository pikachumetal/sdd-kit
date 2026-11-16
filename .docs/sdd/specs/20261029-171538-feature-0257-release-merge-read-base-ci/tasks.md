---
id: 20261029-171538-feature-0257-release-merge-read-base-ci
title: Tasks — La release y el merge leen la CI de la base
---

# Tasks — La release y el merge leen la CI de la base (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | El merge lee la CI de la base | done | 620beec2 | RED 0/1 en `ci1` y `ci2`; GREEN 2/2 tras un REFACTOR (literales) |
| 2 | El corte lee la CI de la base | done | 9e9cee61 | RED: K1 0/1 en `rc1` y `rc2`; GREEN 2/2 tras tres REFACTOR (orden tal cual, en una llamada propia) |

Revisión final: Spec opus+high, With fixes (2 Important, 4 Minor) · Código sonnet+high, Yes (4 Minor) · Arquitectura no (plan), sobre 9e9cee61
Pasada de fix: ea7e29d2, 10 hallazgos (los 2 Important con `rc2` y `ci2` repetidos n = 2)
Re-revisión: 9e9cee61..ea7e29d2, sdd-kit:effort-high + opus, 9/9 resueltos; 1 Important nuevo arreglado en f1df0e9d, sin revisar

## Rulings

- Sin escenarios para el hotfix, el `failure` en el corte y la release sin CI — el «Dónde se prueba» aprobado no los promete — coste si está mal: un camino sin medir llega a campo
- `ci2`: error entero 1/2 tras la pasada de fix — el marco literal sale 2/2 — coste si está mal: el aviso pierde «gh auth login»
