# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0011 | — | **Informe de ocupación por sala**<br>*Comando `informe ocupacion`: % de horas reservadas por sala y semana*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** ocupación = horas reservadas ÷ 60 h semanales (lun-vie 08:00-20:00), un decimal; semana tipo porque las reservas no llevan fecha<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/informe.js`</details> | ⏳ | — | M |
| 0012 | — | **Exportar el informe a Excel**<br>*`--excel <fichero.xlsx>` en el informe de ocupación*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** hoja «Ocupación» con Sala, Horas reservadas, Horas disponibles, Ocupación (%); sobrescribe el fichero; la librería xlsx se elige en el spec<br>**Salda:** nada<br>**Toca:** `src/informe.js`, `package.json`</details> | ⏳ | 0011 | S |
| 0013 | — | **Aviso semanal a los responsables**<br>*Comando `informe avisar`: correo a cada responsable con la ocupación de su sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** responsables en `responsables.json`; lo programa el cron del servidor (lunes 08:00), no la herramienta; sala sin responsable: aviso por stderr y sigue<br>**Salda:** nada<br>**Toca:** `src/informe.js`, `src/correo.js`, `responsables.json`</details> | ⏳ | 0011, 0012, 0008 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
