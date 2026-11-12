# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0011 | — | **Informe de ocupación por sala**<br>*Ocupación de cada sala por rango de fechas*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261112-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** horas disponibles lun-vie 08:00-20:00; las canceladas no cuentan; las semanales cuentan en cada semana<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | — | M |
| 0012 | — | **Exportar el informe a Excel**<br>*Un .xlsx con una fila por sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261112-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** formato .xlsx, columnas sala, horas reservadas, horas disponibles, % ocupación<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | 0011 | S |
| 0013 | — | **Aviso semanal de ocupación a los responsables**<br>*Cada lunes a las 08:00, la ocupación de la semana anterior de sus salas*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261112-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** un responsable por sala; sin responsable no hay aviso; usa el envío de correo de 0008<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | 0011, 0008 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
