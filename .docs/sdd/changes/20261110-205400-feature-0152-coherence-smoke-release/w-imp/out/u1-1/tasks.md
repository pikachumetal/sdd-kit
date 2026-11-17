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
| 1 | Cancelar con motivo | done | 9dd4e9e | afectada por enmienda 2026-11-12 → Task 3 |
| 2 | Listado de canceladas | done | 52f00c7 | tras la 3, ver ledger |
| 3 | Enmienda 2026-11-12: `--por` en cancelar | done | 984737f | va antes que la 2, que la necesita |

## Ledger

- Task 2: Ruling: la Task 3 (enmienda) se ejecuta antes que la 2, porque el listado necesita el `--por` guardado.
- Task 3: Ruling: sin revisor de spec previo a la aprobación — el dev-lead aprobó la enmienda directamente; la revisión de la spec queda para la revisión final.
- Final: Eje Arquitectura: no en el plan (sin línea; decidido al despachar) · señales en el diff: ninguna (sin módulo nuevo, sin dependencia —no hay manifiesto cambiado—, sin contrato entre módulos; el campo `by` vive en la reserva en memoria) → no sale
- Final: Ruling: ejes Spec y Code en paralelo, `sdd-kit:effort-high` (opus y sonnet); el tipo está en el harness
- Final: Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre 52f00c7
- Final: fixed «cancelar sin reserva» sin test (Spec Important) — `cancelar sin reserva lo dice` y `cancelar otro día no cancela la reserva del lunes`, ambos verdes al nacer (el comportamiento existía) y probados por mutación: fallan si `findBooking` ignora el día o si se quita el `sin reserva`; suite 10/10
- Final: fixed test de canceladas dependiente del orden (Code Important, Spec Minor 4) — con `--test-name-pattern="canceladas"` antes `pass 0 fail 1`, ahora `fail 0`; usa un módulo nuevo por import con query; suite 10/10
- Final: fixed `--por --motivo otro` guardaba `by = '--motivo'` (Code Important, Spec Minor 6) — `cancelar con --por sin nombre pide quién cancela` RED→GREEN, suite 10/10. Es aplicar «--por <nombre> obligatorio» tal cual: un valor que empieza por `--` no es un nombre; no añade THEN
- Final: Pasada de fix: 66097e9, 3 hallazgos RED→GREEN
- Final: minor (deferred): Spec 1 — Scope y Approach de spec.md no nombran `--por`, y Aprobaciones sin fila de la enmienda
- Final: minor (deferred): Spec 2 — plan.md dice «dos tasks» y no marca el orden 1 → 3 → 2
- Final: minor (deferred): Spec 3 — el delta etiqueta ADDED un cambio incompatible de `cancelar`; MODIFIED y línea de CHANGELOG al archivar
- Final: minor (deferred): Spec 5 / Code 2 — `canceladas` sin cancelaciones imprime una línea vacía
- Final: minor (deferred): Code 1 — `test/cancel.test.js` pasó de CRLF a LF y `src/app.js` sigue en CRLF
- Final: minor (deferred): Code 3 — línea de `cancelar` en `run` larga; `optionOf` asume sala y día primero
- Final: minor (deferred): Code 4 / 5 — validar motivo y `--por` antes de la reserva no está documentado; separador ` — ` literal
- Final: Ruling: no verificado «CLI real» (Spec) — comprobado a mano: `cancelar … --por Ana` responde «cancelada Norte lun (sala ocupada)»; sin `--por`, «falta quién cancela…»; motivo inválido, «motivo no válido…» — cost if wrong: ninguno
- Final: Ruling: no verificado «test de regresión del patch 0007» — `patch.md` no nombra el test; la base solo tenía los dos de cancelar y los dos están ahora cubiertos — cost if wrong: bajo
- Final: Ruling: Declined (Spec) persistencia entre ejecuciones — el estado es en memoria, así que `canceladas` en un proceso nuevo sale vacío; la fila 0014 del ROADMAP lo deja fuera. Quien lo use por CLI no ve nunca el listado: se avisa al dev-lead — cost if wrong: la feature no se ve de punta a punta hasta la 0014
- Final: Ruling: Declined (Spec) comprobar que `--por` es quien reservó — las reservas no guardan titular y la spec no lo pide — cost if wrong: cualquiera cancela a nombre de otro
- Final: Ruling: Declined (Spec) finales de línea, orden fijo de argumentos, Co-Authored-By — ya existían o no son del eje Spec — cost if wrong: ruido en el diff
- Final: Ruling: Declined (Code) `canceladas` expone solo canceladas y `voidBooking` no guarda motivo — alcance de la spec («No entra: anulaciones», 0011) — cost if wrong: las anuladas no aparecen
- Final: Ruling: Declined (Code) estado y parseo de la CLI en un módulo, efecto al importar — preexistente — cost if wrong: ninguno ahora
- Final: Ruling: Declined (Code) cambio de aserciones antiguas de `cancelar` — sigue la spec nueva; los RED de las tasks 2 y 3 se compararon idénticos a su copia — cost if wrong: ninguno
- Final: Re-revisión: 52f00c7..899a708, sdd-kit:effort-high + opus, todos los hallazgos ADDRESSED, sin Critical ni Important nuevos
- Final: minor (deferred): re-revisión — el `cancelar` de preparación del test de canceladas no comprueba su resultado; `Math.random()` como clave del import; la primera aserción del test de `--por` ya estaba en verde
