# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0011 | — | **Informe de ocupación por sala**<br>*Comando que da el % de ocupación semanal de cada sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-100000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** horario lun-vie 08:00-20:00 (60 h) y semana natural lun-dom, porque la herramienta no tiene horario propio (supuesto a confirmar con el cliente)<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/informes.js`</details> | ⏳ | — | M |
| 0012 | — | **Exportar el informe a Excel**<br>*El informe de ocupación en un .xlsx, una fila por sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-100000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** fichero .xlsx real, no CSV, porque lo pidió el cliente; la librería se elige en el spec<br>**Salda:** nada<br>**Toca:** `src/exportar.js`</details> | ⏳ | 0011 | S |
| 0013 | — | **Aviso semanal a los responsables**<br>*Correo los lunes con la ocupación de la semana anterior*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-100000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** lunes 08:00 lanzado por cron externo, lista de responsables en la configuración, porque la herramienta no es residente (supuestos a confirmar)<br>**Salda:** nada<br>**Toca:** `src/aviso.js`, `src/correo.js`</details> | ⏳ | 0011, 0012, 0008 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
