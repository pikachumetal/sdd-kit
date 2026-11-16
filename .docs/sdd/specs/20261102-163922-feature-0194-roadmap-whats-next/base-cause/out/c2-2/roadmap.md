# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: fallar pronto y con un mensaje claro cuando la ruta de trabajo (`RUNS_DIR` o la copia del molde) es demasiado larga | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| Una ruta de trabajo larga (scratchpad de sesión) rompe en silencio o con un error engañoso: `out/` vacía con `DRY_RUN=1` ([ticket](../../docs/tickets/2026-10-05-salidas.md), 25 min) y `ENOENT` al copiar el molde ([ticket](../../docs/tickets/2026-10-20-copia-molde.md), 40 min) | Medio: ~65 min perdidos en dos casos, sin pista del motivo | **Actuar** → 0008 · causa: entorno de la máquina · arreglo: comprobación automática · remedio: colgar la raíz de trabajo de `D:` |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
