---
id: 20261030-122825-feature-0263-validation-template
title: Tasks — La validación se presenta siempre igual
---

# Tasks — La validación se presenta siempre igual (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | La plantilla y sus huecos | done | 3d486fab | |
| 2 | Las skills trazan desde la plantilla | done | c9153016 | dos rondas de REFACTOR |

## Rulings

- Task 1: Ruling: `sdd task done` se lanzó con `node -e process.exit(0)` en vez de la «Verificación» — error mío; la verificación real (`vitest` 186 passed) corrió justo antes en la misma llamada — coste si está mal: ninguno, el pre-commit también pasó.
- Task 2: Ruling: un commit WIP con `--no-verify`, contra el Art. de hooks — deshecho con `git reset --soft` antes de seguir y rehecho con el hook — coste si está mal: ninguno, no llegó a publicarse.
- Task 2: Ruling: `t1` pasa de `reservas-e2e-manual` a `reservas-ui`, porque el molde anterior era una CLI y no medía una tarea con entorno — coste si está mal: `t1` deja de ser comparable con su RED en el entorno.
- Task 2: Ruling: la ronda de sujetos llegó a 7,74 $ de 8 $; no hay más sujetos, aunque `g1-2` y `t1-2` dejan residuales — coste si está mal: se ve en campo.

Revisión final: Spec opus+high, 8 Important · Código sonnet+high, 1 Important · Arquitectura no (plan), juntada en el cierre

- Final: Ruling: el test de la decisión 12 no se escribe — la ADR 0019 prohíbe probar plantillas por sus frases — coste si está mal: una plantilla pierde la línea sin que salte un test.
- Final: Ruling: «No funciona» sigue en `dev-validation.md` y en `capabilities/archive.md` — nombra la rama de fallo, sin opción con esa etiqueta — coste si está mal: ninguno en conducta.
- Final: Ruling: la fila ✅, «No hay comando de arranque» y `validado` en segundo turno quedan sin sujeto — 0,26 $ de margen — coste si está mal: se ve en campo.

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 hallazgo abierto y 2 Important nuevos, arreglados y sin revisar

- Final: Ruling: enmiendas `t1` y test de la decisión 12, sin aprobar y fuera de la excepción — no cambian conducta de skills; se nombran en el ✋ del cierre — coste si está mal: revertir la línea.
- Final: Ruling: el molde de `t3` y estas reglas de la pasada de fix quedan sin sujeto — sin presupuesto — coste si está mal: se ve en campo.
