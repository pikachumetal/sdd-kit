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
| **Sin validación de la entrada de `cancelar`** — `cancelar xyz 10:00` acepta un día que no existe | Medio: una entrada mal escrita da una respuesta falsa | ticket en Jira |
| `libres` acepta una franja invertida (`12:00-10:00`): pasa la validación de formato pero devuelve falsamente todas las salas libres, misma familia de bug que SALAS-142 pero más acotada | Bajo: caso raro, requiere una franja sintácticamente válida pero absurda | ticket en Jira |
| El listado de salas está fijo en el código (`rooms`) | Bajo: solo hay dos salas | cuando haya una tercera |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

### v0.3.0 — 2026-09-01

Cancelar una reserva propia. [changelog](changelog.md)
