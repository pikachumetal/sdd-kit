# Tasks — Motivo al cancelar (0010)

Plan: [plan.md](./plan.md) · Método: Native · Base: 7d8db2f

| Task | Título | Estado | Commit |
| --- | --- | --- | --- |
| 1 | Cancelar con motivo | pendiente | — |
| 2 | Listado de canceladas | pendiente | — |

## Rulings

- Task 0 · A: el test de Task 2 monta su GIVEN cancelando Norte lun con «sala ocupada»; todos los tests del fichero usan ese motivo.
- Task 0 · B: Task 1 actualiza el test existente `cancelar una reserva activa` a `--motivo "sala ocupada"` → `cancelada Norte lun (sala ocupada)`; la spec manda sobre el test viejo.
- Task 0 · C: la reserva se busca antes de validar el motivo; `sin reserva Sur mar` sin motivo se conserva.
