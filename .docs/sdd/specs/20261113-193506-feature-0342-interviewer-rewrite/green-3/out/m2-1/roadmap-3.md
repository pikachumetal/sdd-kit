# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0011 | — | **Informe de ocupación por sala**<br>*Ocupación por sala y periodo desde la CLI*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-100000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** las de la propuesta, pendientes de confirmar por el cliente<br>**Salda:** nada<br>**Toca:** `src/informes.js`, `src/app.js`</details> | ⏳ | — | M |
| 0012 | — | **Exportar el informe a Excel**<br>*Informe de ocupación a `.xlsx`*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-100000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** las de la propuesta, pendientes de confirmar por el cliente<br>**Salda:** nada<br>**Toca:** `src/informes.js`</details> | ⏳ | 0011 | S |
| 0013 | — | **Aviso semanal de ocupación a los responsables**<br>*Correo semanal a cada responsable con sus salas*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-100000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** las de la propuesta, pendientes de confirmar por el cliente<br>**Salda:** nada<br>**Toca:** `src/informes.js`, `src/correo.js`</details> | ⏳ | 0012, 0008 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
