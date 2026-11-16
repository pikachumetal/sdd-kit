---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 4e0dd18 | |
| 2 | Listado de canceladas | done | 1756932 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 1756932
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, abiertos 1 Important + 3 Minor (rulings)

## Rulings

- Final: Ruling: falta test que fije «sin canceladas» (Important) — el cambio es de una línea (`src/app.js:36`) y la suite 5/5 más el smoke con ejecución real lo cubren hoy; la regresión sin test queda como deuda en el roadmap — coste si está mal: quitar el `||` no rompería la suite.
- Final: Ruling: `src/app.js` pasó de CRLF a LF en `61915c5` (Minor) — es el único fichero de código en LF; no se revierte en el cierre para no abrir otra pasada — coste: `git blame` de todo el fichero apunta a ese commit.
- Final: Ruling: «sin canceladas» no está en la spec (Minor) — el comportamiento está aprobado de hecho por el dev-lead al validar, pero la spec sigue sin escenario — coste: la capacidad no lo recogerá hasta que se enmiende.
- Final: Ruling: `tasks.md` apuntaba `1756932` para la task 1 (Minor) — corregido a `4e0dd18`.
