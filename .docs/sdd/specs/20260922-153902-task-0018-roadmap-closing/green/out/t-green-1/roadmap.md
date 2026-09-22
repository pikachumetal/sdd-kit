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
| **[Task SALAS-142, 2026-09-22: parcial — specs/20260919-090000-task-SALAS-142-slot-format/walkthrough.md; queda: validar el día de `cancelar`]** Sin validación de la entrada de `libres` y `cancelar` — `libres 25:00-99` devuelve todas las salas como libres en vez de un error, y `cancelar xyz 10:00` acepta un día que no existe | Medio: una franja mal escrita da una respuesta falsa | ticket en Jira |
| El listado de salas está fijo en el código (`rooms`) | Bajo: solo hay dos salas | cuando haya una tercera |
| `spec.md` de SALAS-142 no declaró capacidad nueva en `capabilities/` para el cambio de comportamiento de `libres` (valida franja); sin `capabilities/`, el delta solo quedó en el walkthrough | Bajo: el comportamiento está probado y documentado, pero no en una fuente viva por requisito | próxima spec que toque `libres` o `cancelar`: declarar la capacidad |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

### v0.3.0 — 2026-09-01

Cancelar una reserva propia. [changelog](changelog.md)
