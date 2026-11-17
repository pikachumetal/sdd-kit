---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 037e794 | |
| 2 | Listado de canceladas | done | edc453f | |

Revisión final: code-reviewer + opus, limpia, sobre edc453f

## Rulings

- Task 2: Ruling: `canceladas` escribe una línea por reserva, en el orden en que se cancelaron — la spec no fija el orden — si me equivoco, ordenar por sala es un cambio de una línea.
- Task 2: Ruling: las reservas anuladas (`anular`) no salen en `canceladas` — la spec no lo dice, y el glosario separa Cancelación de Anulación — si me equivoco, el listado de la 0011 tendrá que sumarlas.
- Cierre: el commit de registro de tasks (solo `tasks.md`, 21 líneas, supera por una el límite de 20 de la exención) no se re-revisa: su único fichero cae en la carpeta de la feature, que el paquete de review excluye por construcción, así que no habría diff que revisar. Revisado en el hilo. Ese commit se junta en el de cierre.
- Cierre: `canceladas` desde la CLI en un proceso aparte sale vacío, porque las reservas viven en memoria y no se persisten entre ejecuciones (ya era así para `cancelar` en la base). El THEN del listado se ha comprobado en un mismo proceso. Persistir las reservas queda fuera de la 0010.

## Smoke

| THEN | Evidencia | Cómo |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `--motivo "porque sí"` y sin `--motivo`: ambos dan ese mensaje |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real | `run("cancelar", …)` y `run("canceladas", [])` en un mismo proceso; por CLI en procesos separados sale vacío (ver ruling) |

Suite completa (`node --test`): 5 pass, 0 fail, <1 s.
- Cierre: `capability merge` y `capability check` fallan porque `bookings` no tiene fichero en `capabilities/` aunque la spec lo declara como «Modificadas». No lo he corregido: crear la capacidad la aprueba el dev-lead (regla 2 de la plantilla de capacidad), así que queda pendiente de él y el delta sin fusionar.
