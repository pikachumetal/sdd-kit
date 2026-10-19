# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0021 | **Cancelar una reserva propia** — el empleado cancela una franja suya desde la CLI. Ticket SAL-41. Ficheros que toca: `src/app.js` | ⏳ |
| 0022 | **Avisar de la cancelación a recepción** — `proposal: 0019`, tras 0021. Ficheros que toca: `src/app.js`, `src/notify.js` | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B3 | Exportar las reservas del mes a CSV | Recepción, reunión del 2026-09-18 |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| **[Patch 0023, 2026-09-25: saldada — [patch](specs/20260925-100000-patch-0023-double-booking/patch.md)]** Dos reservas en la misma franja se aceptan ([ticket SAL-44](https://tracker.example.com/SAL-44)) | Alto — la sala queda doble | **Actuar**: 0023 |
| `cancel` no comprueba que la reserva sea del que cancela ([ticket SAL-45](https://tracker.example.com/SAL-45)) | Alto — cualquiera cancela cualquier reserva | **Actuar**: 0022 |
| Los mensajes de error mezclan castellano e inglés | Bajo — confunde | **Actuar**: sin fila |
| El test de franjas falla a veces en CI | Medio — rojo intermitente | **Esperar 2.º ticket**: falta un segundo fallo con su log |
| Validar el formato de la franja en la API | Bajo | **Descartada**: duplica la 0018 |
| Pasar `src/app.js` a TypeScript | Bajo | versión siguiente |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-25 | 0023 | Rechazar dos reservas en la misma franja — [patch](specs/20260925-100000-patch-0023-double-booking/patch.md) |

## Releases cerradas

### v1.2.0 — 2026-09-20

Resumen semanal de reservas para recepción (0016). Smoke: `npm test` verde.

validaciones pendientes: 0016
