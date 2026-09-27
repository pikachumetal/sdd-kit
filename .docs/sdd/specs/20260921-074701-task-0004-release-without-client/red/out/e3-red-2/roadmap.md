# Roadmap — salas

## Próximo

### Release siguiente — en preparación

Scope decidido por el usuario el 2026-09-21 (las cuatro ideas del backlog). **No comprometida**: hay bloqueos abiertos.

Orden: riesgo primero entre los desbloqueados, después coste-beneficio; lo bloqueado al final.

Bloqueos abiertos:

- 🔒 B2 (0011): falta decidir el mecanismo de envío (SMTP directo, dependencia externa o cron con correo del sistema). Decide el dueño del proyecto; afecta a `tech-stack.md` ("sin dependencias externas").
- Versión sin fijar: `[Unreleased]` ya trae tasks 0005, 0006 y patch 0007 sin corte de versión. Falta decidir si se cortan antes con `sdd-end-release` o se arrastran a esta release.

| # | Ítem | Origen |
| --- | --- | --- |
| 0008 | Reserva recurrente mensual | B3 (idea propia) |
| 0009 | Exportar reservas a calendario (.ics) | B1 (idea propia) |
| 0010 | Estadísticas de uso por sala | B4 (idea propia) |
| 0011 | 🔒 Avisos por correo antes de la reserva | B2 (idea propia) |

## Backlog

_Vacío: B1–B4 pasaron a la release en preparación (0008–0011)._

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
