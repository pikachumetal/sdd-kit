# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `libres --planta 2` devuelve también salas de la planta 1 (`Norte (planta 1)`); el filtro de `roomsOnFloor` en `src/app.js` usa `<=` en vez de igualdad | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| La exportación a CSV pierde las tildes desde la 1.4.2 (cabecera `sala,d?a,franja`), según el informe de QA 2026-10-12; no reproducido: `node src/app.js exportar` emite `sala,día,franja` en UTF-8 correcto | Medio: datos de cabecera ilegibles para quien lo sufre | **Esperar 2.º ticket**: falta reproducirlo (¿qué consumidor abre el CSV? ¿Excel sin BOM?) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
