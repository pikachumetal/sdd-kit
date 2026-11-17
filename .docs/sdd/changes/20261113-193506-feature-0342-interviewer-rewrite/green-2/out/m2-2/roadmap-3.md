# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0010 | — | **Informe de ocupación por sala**<br>*Comando informe: horas reservadas sobre horas disponibles por sala y semana*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-100000-proposal-0013-informes/proposal.md`<br>**Decisiones ya tomadas:** ventana 08:00-20:00 lun-vie (60 h por sala y semana); semana natural, por defecto la última completa<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/informe.js`</details> | ⏳ | — | M |
| 0011 | — | **Exportar el informe a Excel**<br>*informe --excel: fichero .xlsx con una fila por sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-100000-proposal-0013-informes/proposal.md`<br>**Decisiones ya tomadas:** .xlsx real y no CSV; la dependencia que lo escribe se elige en su spec<br>**Salda:** nada<br>**Toca:** `src/informe.js`, `package.json`</details> | ⏳ | 0010 | S |
| 0012 | — | **Aviso semanal a los responsables**<br>*Comando avisar-semanal: cada responsable recibe la ocupación de su sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-100000-proposal-0013-informes/proposal.md`<br>**Decisiones ya tomadas:** comando para cron, sin proceso residente; responsables en un fichero por sala; reutiliza el envío de `src/correo.js` de la 0008<br>**Salda:** nada<br>**Toca:** `src/correo.js`, `src/informe.js`</details> | ⏳ | 0008, 0010, 0011 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
