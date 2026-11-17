# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` solo lista las salas de la planta N (hoy `--planta 2` devuelve `Norte (planta 1)`) | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| `salas libres --planta 2` devuelve `Norte (planta 1)`: `roomsOnFloor` filtra con `<=` en vez de `===` ([informe QA 2026-10-12](../../docs/qa/2026-10-12-informe.md) §2; reproducido: `node src/app.js libres --planta 2` → `Norte (planta 1)`) | Medio: resultado incorrecto | **Actuar** → 0008 · causa: defecto del producto · arreglo: — |
| La exportación CSV pierde las tildes desde la 1.4.2 ([informe QA 2026-10-12](../../docs/qa/2026-10-12-informe.md) §1; no reproducido: `node src/app.js exportar` sale en UTF-8 correcto, `sala,día,franja`, y no existe versión 1.4.2 en el changelog) | Medio: si se confirma, datos mal codificados | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo (versión y cliente que abre el CSV) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
