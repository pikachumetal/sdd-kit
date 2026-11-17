# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0011 | — | **Informe de ocupación por sala**<br>*`salas informe` con horas reservadas, disponibles y % por sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261113-225304-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** las de la propuesta (horario 08:00-20:00 lun-vie, semana lun-dom)<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/informe.js`</details> | ⏳ | — | M |
| 0012 | — | **Exportar el informe a Excel**<br>*`--excel <fichero>` genera un .xlsx con la hoja «Ocupación»*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261113-225304-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** las de la propuesta (horario 08:00-20:00 lun-vie, semana lun-dom)<br>**Salda:** nada<br>**Toca:** `src/informe.js`, `package.json`</details> | ⏳ | 0011 | S |
| 0013 | — | **Aviso semanal a los responsables**<br>*`salas aviso-semanal` envía cada lunes el informe y el .xlsx por correo*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261113-225304-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** las de la propuesta (horario 08:00-20:00 lun-vie, semana lun-dom)<br>**Salda:** nada<br>**Toca:** `src/correo.js`, `src/app.js`, `responsables.json`</details> | ⏳ | 0008, 0012 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
