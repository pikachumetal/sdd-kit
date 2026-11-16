# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0011 | — | **Informe de ocupación por sala**<br>*Ocupación por sala y periodo, por línea de comandos*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261112-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** horario ofertado 08:00-20:00 de lunes a viernes; por defecto, la última semana natural cerrada<br>**Salda:** nada<br>**Toca:** `src/informes.js`, `src/app.js`</details> | ⏳ | — | M |
| 0012 | — | **Exportar el informe a Excel**<br>*El informe de ocupación en un `.xlsx`*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261112-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** una hoja, una fila por sala más total<br>**Salda:** nada<br>**Toca:** `src/excel.js`, `src/app.js`</details> | ⏳ | 0011 | S |
| 0013 | — | **Aviso semanal a los responsables**<br>*Cada lunes, correo con la ocupación de la semana anterior*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261112-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** lunes 08:00; responsables en la configuración; usa el envío de 0008<br>**Salda:** nada<br>**Toca:** `src/correo.js`, `src/aviso-semanal.js`</details> | ⏳ | 0012, 0008 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
