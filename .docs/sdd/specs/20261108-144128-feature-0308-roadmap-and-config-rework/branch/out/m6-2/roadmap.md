# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` lista también salas de plantas inferiores (`<=` en lugar de `===` en `roomsOnFloor`, src/app.js); test de regresión con `--planta 2` | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| QA 2026-10-12 (docs/qa/2026-10-12-informe.md) #2: `libres --planta 2` devuelve `Norte (planta 1)` | Medio | **Actuar** → 0008 · causa: defecto del producto · arreglo: — · evidencia: `node src/app.js libres --planta 2` → `Norte (planta 1)` |
| QA 2026-10-12 #1: la exportación CSV pierde las tildes desde 1.4.2 (`sala,d?a,franja`) | Medio | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo: `node src/app.js exportar` emite `día` en UTF-8 correcto; puede ser el visor que abre el CSV (p. ej. Excel sin BOM). Pedir a QA comando y visor exactos. Desde 2026-11-08 |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
