# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` lista salas de otras plantas; `roomsOnFloor` (`src/app.js`) filtra con `<=` y debe comparar con `===` (informe QA 2026-10-12, hallazgo 2) | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| `salas libres --planta 2` devuelve `Norte (planta 1)`. Evidencia: `node src/app.js libres --planta 2` → `Norte (planta 1)`. El arreglo propuesto del informe (`<=` por `<`) no sirve: Norte (1) < 2 sigue saliendo; hace falta `===`. Origen: [informe QA](../../docs/qa/2026-10-12-informe.md) §2 | Medio: resultado incorrecto en un comando de uso diario | **Actuar** → 0008 · causa: defecto del producto · arreglo: — |
| La exportación a CSV pierde las tildes desde la 1.4.2 (`sala,d?a,franja`). Evidencia: `node src/app.js exportar` sale `sala,día,franja`, y los bytes son UTF-8 correctos (`c3 ad`); no se reproduce. Origen: [informe QA](../../docs/qa/2026-10-12-informe.md) §1 | Medio si se confirma: datos con tildes ilegibles | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo (¿codificación del programa que abre el CSV, p. ej. Excel?) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
