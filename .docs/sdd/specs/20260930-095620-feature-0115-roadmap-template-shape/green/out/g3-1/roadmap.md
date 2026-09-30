# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 3 | Piloto en la oficina de Lugo, con el calendario de festivos locales | ⏳ |
| 0022 | **Festivos locales por oficina** — una sala no se puede reservar en un festivo de su oficina | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Reservar desde el móvil con un código QR pegado en la puerta de la sala | oficina de Vigo, 2026-09-12 |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| Los tests de recurrencia dependen de la fecha del sistema: fallan el día 29 de febrero | medio | versión siguiente |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-10 | 0018 | Bloqueo de SQLite con dos reservas a la vez — [patch](specs/20260910-090000-patch-0018-sqlite-lock/patch.md) |

## Releases cerradas

### v1.2.0 — 2026-09-20

Aviso por correo al liberar una sala (0021) y el patch 0020. [Changelog](changelog.md#120---2026-09-20).

validaciones pendientes: 0021

smoke: pendiente
