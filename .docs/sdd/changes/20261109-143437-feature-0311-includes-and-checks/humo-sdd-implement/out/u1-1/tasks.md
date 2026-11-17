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
| 1 | Cancelar con motivo | done | (commit de la task 1) | |
| 2 | Listado de canceladas | done | (ver git log) | THEN enmendado el 2026-11-09: sin «quién canceló» (aprobado por el dev-lead) |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 794814a
Pasada de fix: b78e94b, 2 hallazgos RED→GREEN
Re-revisión: 794814a..b78e94b, sdd-kit:effort-high + opus, todos resueltos, sin roturas nuevas

## Rulings

- Task 2: Ruling: enmienda del spec aprobada por el dev-lead el 2026-11-09 (opción A) — el THEN de `canceladas` ya no enseña «quién canceló» — si se equivocó, hay que añadir un dato de quién cancela (`--por`) en una task nueva
- Final: Ruling: sin operations.md ni E2E declarados — el eje Code recibe «sin E2E declarados» — sin coste
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía (un mensaje «sin canceladas» sería comportamiento nuevo, no está en ningún THEN)
- Final: Ruling: las cancelaciones no persisten entre ejecuciones (datos en memoria, diseño de la base 0ef5a87; spec y plan no piden persistencia) — se queda — `node src/app.js canceladas` desde la shell sale siempre vacío; si el dev-lead quería rastro entre ejecuciones, hace falta una feature de persistencia
- Final: Ruling: la Task 1 sustituyó dos tests de antes de la feature por los de motivo — los tests de «sin reserva» y «sin motivo» se recuperan en la pasada de fix — sin coste
- Final: minor (deferred): el test «cancelar sin motivo» usa Norte lun, ya cancelada por el test 1; pasa sin depender del orden pero conviene saberlo
