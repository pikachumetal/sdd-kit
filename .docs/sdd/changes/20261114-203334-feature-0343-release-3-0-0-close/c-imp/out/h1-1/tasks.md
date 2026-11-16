# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | f3ec416 |
| 2 — Listado de canceladas | hecha | 4a0196a |

Revisión final: autorrevisión (sin subagentes): Spec sin hallazgos · Código 1 minor diferido · Arquitectura no (plan), sobre 0136c9c

## Rulings

Task 1: Ruling: el motivo se valida antes de buscar la reserva (también para «sin reserva») y los tests existentes pasan --motivo — la spec dice que sin --motivo responde «motivo no válido» — si se equivoca, «cancelar Sur mar» sin motivo dirá motivo no válido en vez de «sin reserva».
Final: Ruling: efecto del harness — sin herramienta de subagentes y sin tipos sdd-kit:effort-*; revisión final por autorrevisión — el autor comparte puntos ciegos — el dev-lead decide si basta antes del merge
Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía (la spec no dice nada)
