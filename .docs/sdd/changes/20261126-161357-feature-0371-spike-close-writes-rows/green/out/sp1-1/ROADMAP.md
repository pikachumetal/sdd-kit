# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0010 | — | **Motivo al cancelar**<br>*al cancelar una reserva se elige un motivo de una lista, y el listado de canceladas lo enseña*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** —<br>**Decisiones ya tomadas:** —<br>**Salda:** nada<br>**Toca:** —</details> | ⏳ | — | M |
| 0011 | — | **Anular reservas de otros**<br>*solo el responsable de cada sala anula reservas de otras personas*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** —<br>**Decisiones ya tomadas:** —<br>**Salda:** nada<br>**Toca:** —</details> | ⏳ | — | M |
| 0012 | — | **Informe de canceladas**<br>*`informe` lista las reservas canceladas por sala, con su motivo y el total*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** —<br>**Decisiones ya tomadas:** —<br>**Salda:** nada<br>**Toca:** —</details> | ⏳ | — | M |
| 0013 | — | **Precio en su módulo**<br>*el cálculo del precio sale de `app.js` sin cambiar lo que responde `precio`*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** —<br>**Decisiones ya tomadas:** —<br>**Salda:** nada<br>**Toca:** —</details> | ⏳ | — | M |
| 0014 | — | **Motivo guardado**<br>*el motivo de una cancelación se guarda en el almacén de reservas*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** —<br>**Decisiones ya tomadas:** —<br>**Salda:** nada<br>**Toca:** —</details> | ⏳ | — | M |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*—*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** —<br>**Decisiones ya tomadas:** —<br>**Salda:** nada<br>**Toca:** —</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** —<br>**Salda:** nada<br>**Toca:** —</details> | ✅ | — | S |
| 0030 | — | **¿Aguanta `libres` 1.000 reservas?**<br>*medir `libres` con la carga de enero → 0031, 0032*<details><summary>Brief</summary>**Carril:** spike<br>**Requisitos:** —<br>**Decisiones ya tomadas:** —<br>**Salda:** nada<br>**Toca:** —</details> | ✅ | — | M |
| 0031 | #412 | **Índice de reservas por sala en `libres`**<br>*`libres` deja de recorrer todas las reservas por cada sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261120-090000-feature-0030-libres-load/research.md`<br>**Decisiones ya tomadas:** parent: 0030; sale de `research.md` §5, tras O1 no cumple (2000 comparaciones con 1.000 reservas)<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | — | M |
| 0032 | #412 | **Caché de `libres` por día**<br>*`libres` guarda su resultado por día y lo invalida al reservar o cancelar*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261120-090000-feature-0030-libres-load/research.md`<br>**Decisiones ya tomadas:** parent: 0030; sale de `research.md` §5, tras O1 no cumple (2000 comparaciones con 1.000 reservas)<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | 0031 | M |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0004 | — | **Exportar reservas a calendario (.ics)**<br>*idea propia* | ⏳ | — | — |
