# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `libres --planta N` devuelve también salas de plantas inferiores; `roomsOnFloor` (`src/app.js`) filtra con `<=` y debe ser `===`. El arreglo del informe (`<=`→`<`) no sirve: con `--planta 2` sigue devolviendo `Norte (planta 1)`. Origen: `docs/qa/2026-10-12-informe.md` §2 | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| CSV sin tildes en la cabecera (`sala,d?a,franja`) según QA (`docs/qa/2026-10-12-informe.md` §1) | Medio | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo: `node src/app.js exportar` da `sala,día,franja` en UTF-8 y no existe la versión 1.4.2 (última: v0.3.0); pedir a QA entorno y comando |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
