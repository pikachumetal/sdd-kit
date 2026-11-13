---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-11
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | f343675 | `node --test test/cancel.test.js` → 2/2 |
| 2 | Listado de canceladas | done | 61df1c4 | `node --test test/cancel.test.js` → 3/3 |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → 2/2 pass
- [x] Task 2 — `node --test test/cancel.test.js` → 3/3 pass

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

Revisión final: Spec opus+high, con fixes · Código sonnet+high, con fixes · Arquitectura no (plan), sobre 61df1c4
Pasada de fix: 938ea30, 3 hallazgos RED→GREEN
Re-revisión: 61df1c4..938ea30, sdd-kit:effort-high + opus, limpia

## Rulings

- Final: Ruling: sin tasks.md en la rama al retomar (dos tasks) — lo escribo con los borradores de cierre, con estado y hash por task del ledger — coste si me equivoco: un commit de docs más en la revisión final
- Final: Ruling: «Capacidades» de la spec decía «Modificadas: bookings» sin fichero en capabilities/ (el proyecto no tenía ninguna) — lo paso a «Nuevas» para que `sdd capability merge` cree bookings; no toca requisitos, THEN ni Scope — coste si me equivoco: la capacidad nace en esta feature en vez de en una documentación previa
- Final: minor (deferred): un motivo inválido sobre una reserva activa no tiene test de que la deja activa (Spec M4)
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía (Spec M5 / Código M3) — un mensaje sería un THEN nuevo
- Final: minor (deferred): `--motivo sala ocupada` sin comillas se rechaza con un mensaje que lista «sala ocupada» como válido (Spec M6)
- Final: minor (deferred): el motivo se valida antes que la existencia de la reserva (Código M1) — es el orden que fija la spec
- Final: minor (deferred): `--motivo` antes de sala y día se lee como sala (Código M2)
- Final: Ruling: no verificado del eje Spec (resultados de la suite) — lo verifico yo: `node --test` → 7/7 tras la pasada de fix — coste si me equivoco: ninguno, es evidencia de esta sesión
- Final: Ruling: persistencia entre ejecuciones (los dos ejes la dejan fuera) — se queda: el estado en memoria es el diseño de la base y la spec no la pide; cambiarlo es otra feature; va a debt.md en el cierre porque la 0012 depende de que el motivo sobreviva — coste si me equivoco: el dev-lead esperaba ver el motivo desde la shell y la feature no lo da
- Final: Ruling: anular no pide motivo ni sale en canceladas — se queda: fuera de scope por la spec (0011) — coste si me equivoco: ninguno en esta feature
- Final: Ruling: CHANGELOG y README sin el comando nuevo — se queda: el CHANGELOG lo corta sdd-end-release y la fila en Now es el registro; README no documenta comandos de la base — coste si me equivoco: una línea de README
- Final: Ruling: numeración 1→3 en «Decisiones» de la spec — se queda: errata del documento aprobado, sin efecto — coste si me equivoco: ninguno
- Final: Ruling: `booking`/`room` en el código frente al glosario de PRODUCT.md — se queda: es anterior a la feature y la diff sigue el nombre existente — coste si me equivoco: renombrado en otra feature
- Final: Ruling: la política de modelos aplicada — se queda: eje Spec opus+high y Código sonnet+high como dice la spec — coste si me equivoco: ninguno
- Final: Ruling: mayúsculas y tildes del motivo («Sala ocupada») se rechazan — se queda: la lista es cerrada y la coincidencia estricta es la lectura literal de la decisión con el dev-lead — coste si me equivoco: el usuario reescribe el motivo en minúscula
- Final: Ruling: re-revisión, fuera de alcance — «cancelar con un motivo de la lista» comparte el array del módulo y solo pasa por ser el primero en cancelar Norte lun — se queda: node:test ejecuta en orden de fichero y es el primero; darle estado propio pide reiniciar el módulo, que la app no expone — coste si me equivoco: reordenar los tests lo pone en rojo con «sin reserva Norte lun»
