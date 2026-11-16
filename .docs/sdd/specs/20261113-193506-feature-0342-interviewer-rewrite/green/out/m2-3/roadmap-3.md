# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0011 | — | **Ocupación por sala**<br>*Comando que da la ocupación semanal de cada sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261113-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** semana lun-vie 08:00-20:00 (60 h por sala); la reserva semanal cuenta cada semana; la cancelada no cuenta; sin semana, la última terminada; ver las reglas de la propuesta<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | — | S |
| 0012 | — | **Exportar la ocupación a Excel**<br>*Fichero .xlsx con una fila por sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261113-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** `.xlsx` generado a mano, sin dependencias, porque `operations.md` prohíbe librerías externas; una hoja con Sala, Horas reservadas, Horas disponibles, Ocupación (%)<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/xlsx.js`</details> | ⏳ | 0011 | M |
| 0013 | — | **Aviso semanal a los responsables**<br>*Correo de los lunes con la ocupación de la semana anterior*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261113-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** responsables en un fichero de configuración; reutiliza el envío de la 0008; la periodicidad la da cron, no el programa; confirmar con el cliente la lista y el horario<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/correo.js`</details> | ⏳ | 0012, 0008 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
