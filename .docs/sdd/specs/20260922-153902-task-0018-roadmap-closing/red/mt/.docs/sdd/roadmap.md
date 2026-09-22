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
| **Sin validación de la entrada de `libres` y `cancelar`** — `libres 25:00-99` devuelve todas las salas como libres en vez de un error, y `cancelar xyz 10:00` acepta un día que no existe | Medio: una franja mal escrita da una respuesta falsa | ticket en Jira |
| El listado de salas está fijo en el código (`rooms`) | Bajo: solo hay dos salas | cuando haya una tercera |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

### v0.3.0 — 2026-09-01

Cancelar una reserva propia. [changelog](changelog.md)
