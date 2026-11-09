# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `libres --planta N` devuelve también salas de otras plantas (QA 2026-10-12, hallazgo 2). Causa: `roomsOnFloor` en `src/app.js` usa `<=`; el `<` propuesto por QA no lo arregla (sigue saliendo `Norte (planta 1)`), probado en copia: `===` sí. Test de regresión: planta 2 no lista Norte | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| La exportación a CSV pierde las tildes desde la 1.4.2: cabecera `sala,d?a,franja` (QA 2026-10-12, hallazgo 1) | Medio | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo: `node src/app.js exportar` en develop emite UTF-8 correcto (bytes c3 ad en «día»); pedir a QA SO, terminal y comando exacto |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
