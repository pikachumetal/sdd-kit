# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0011 | — | **Informe de ocupación por sala**<br>*Comando que da, por sala, el % de horas reservadas sobre las abiertas de la semana*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-173405-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** horario abierto lun-vie 08:00-20:00 en una constante; todas las salas salen, también al 0 %; las reservas semanales cuentan cada semana<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/informe.js`</details> | ⏳ | — | M |
| 0012 | — | **Exportar el informe a Excel**<br>*El informe de ocupación en un `.xlsx`, una fila por sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-173405-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** `.xlsx` real, no CSV; columnas Sala, Horas reservadas, Horas abiertas, Ocupación (%); dependencia nueva a elegir al diseñar<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/exportar.js`, `package.json`</details> | ⏳ | 0011 | S |
| 0013 | — | **Aviso semanal a los responsables**<br>*Correo los lunes con la ocupación de la semana anterior*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-173405-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** comando `salas aviso-semanal` lanzado por cron (lunes 08:00), sin proceso residente; responsables = lista de correos en un fichero de configuración; sin responsables no envía y sale con 0; reutiliza el envío de la 0008<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/aviso-semanal.js`, `src/correo.js`</details> | ⏳ | 0011, 0012, 0008 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
