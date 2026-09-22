# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0009 | Avisos por correo antes de la reserva | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| **[Patch 0008, 2026-09-22: parcial — [patch.md](specs/20260919-090000-patch-0008-slot-format/patch.md); queda: validar la entrada de `cancelar`]** **Sin validación de la entrada de `libres` y `cancelar`** — `libres 25:00-99` devuelve todas las salas como libres en vez de un error, y `cancelar xyz 10:00` acepta un día que no existe | Medio: una franja mal escrita da una respuesta falsa | patch |
| El listado de salas está fijo en el código (`rooms`) | Bajo: solo hay dos salas | cuando haya una tercera |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | [20260918-090000-patch-0007-cancel](specs/20260918-090000-patch-0007-cancel/patch.md) | La cancelación borraba reservas de otro día con la misma hora |
| 2026-09-22 | [20260919-090000-patch-0008-slot-format](specs/20260919-090000-patch-0008-slot-format/patch.md) | `libres` aceptaba una franja mal escrita |

## Releases cerradas

### v0.3.0 — 2026-09-01

Cancelar una reserva propia. [changelog](changelog.md)
