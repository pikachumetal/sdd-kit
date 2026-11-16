# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0011 | — | **Informe de ocupación por sala**<br>*Comando que da horas reservadas y % de ocupación por sala y semana*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-231021-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** las de la propuesta<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/informe.js`</details> | ⏳ | — | M |
| 0012 | — | **Exportar el informe a Excel**<br>*El informe a un .xlsx, con fila de total*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-231021-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** las de la propuesta<br>**Salda:** nada<br>**Toca:** `src/informe.js`, `package.json`</details> | ⏳ | 0011 | S |
| 0013 | — | **Aviso semanal a los responsables**<br>*El informe de la semana anterior por correo a los responsables de cada sala, los lunes*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-231021-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** las de la propuesta<br>**Salda:** nada<br>**Toca:** `src/correo.js`, `src/informe.js`</details> | ⏳ | 0011, 0012, 0008 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
