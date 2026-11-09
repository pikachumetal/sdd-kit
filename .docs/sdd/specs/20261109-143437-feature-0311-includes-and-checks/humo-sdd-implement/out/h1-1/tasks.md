# Tasks — Motivo al cancelar (0010)

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | b364f5a |
| 2 — Listado de canceladas | hecha | d02b239 |

## Rulings

- Ruling: `cancelar` de una reserva inexistente sigue respondiendo «sin reserva <sala> <día>» aunque falte el motivo — la spec solo fija el AND de motivo sobre la reserva de Norte lun y el test existente `cancelar sin reserva lo dice` no lleva motivo — si falla: quien cancele sin reserva ni motivo verá otro mensaje.
- Ruling: el test existente `cancelar una reserva activa` se reescribe con motivo (el AND «sin --motivo» lo invalida) — es consecuencia directa de la spec — si falla: ninguno, la spec lo manda.
- Final: Ruling: sin herramienta de subagentes en este harness — revisión final como autorrevisión por pasadas (Spec, Código) en el hilo — la autorrevisión del autor es más débil que revisores frescos; el dev-lead decide si basta antes del merge
- Final: minor (deferred): canceladas sin ninguna cancelada responde cadena vacía (la spec calla)
- Final: minor (deferred): optionValue toma como valor el siguiente argumento aunque sea otro flag (--motivo --x → motivo no válido, correcto por casualidad)
- Final: minor (deferred): ningún test cubre los motivos «cambio de planes» y «otro»
- Final: minor (deferred): el test de canceladas depende del estado que deja el test anterior del fichero (orden)

## Revisión

Revisión final: autorrevisión en el hilo (sin herramienta de subagentes) · Spec sin hallazgos · Código 1 hallazgo corregido (finales de línea), 4 minors diferidos · Arquitectura no (plan), sobre 3cf83cd
Pasada de fix: 3cf83cd, 1 hallazgo, suite 7/7
