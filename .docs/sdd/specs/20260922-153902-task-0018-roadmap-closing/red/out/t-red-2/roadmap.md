# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| ✅ **SALAS-142** — `libres` valida la franja `HH:MM-HH:MM` | Resuelto: una franja mal escrita da error, no una respuesta falsa | [walkthrough](specs/20260919-090000-task-SALAS-142-slot-format/walkthrough.md) |
| **Sin validación de la entrada de `cancelar`** — `cancelar xyz 10:00` acepta un día que no existe | Medio: un día mal escrito da una respuesta falsa | ticket en Jira |
| El listado de salas está fijo en el código (`rooms`) | Bajo: solo hay dos salas | cuando haya una tercera |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

### v0.3.0 — 2026-09-01

Cancelar una reserva propia. [changelog](changelog.md)
