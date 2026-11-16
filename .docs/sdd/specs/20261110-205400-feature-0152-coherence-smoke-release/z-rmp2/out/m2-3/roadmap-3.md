# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0011 | — | **Informe de ocupación por sala**<br>*Comando `informe`: horas reservadas y % de ocupación por sala y semana*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261112-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** semana de lun a vie, 08:00–20:00 (60 h); periodo semanal porque las reservas no guardan fecha<br>**Salda:** nada<br>**Toca:** `src/app.js`, `test/app.test.js`</details> | ⏳ | — | M |
| 0012 | — | **Exportar el informe a Excel**<br>*`informe --xlsx fichero` genera un .xlsx con una fila por sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261112-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** .xlsx real sin dependencias externas (operations.md)<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/xlsx.js`</details> | ⏳ | 0011 | M |
| 0013 | — | **Aviso semanal a los responsables**<br>*`informe-semanal` envía por correo el informe a la lista de responsables*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261112-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** lista en `responsables.json`; la periodicidad la da cron, no la app<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/correo.js`</details> | ⏳ | 0012, 0008 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
