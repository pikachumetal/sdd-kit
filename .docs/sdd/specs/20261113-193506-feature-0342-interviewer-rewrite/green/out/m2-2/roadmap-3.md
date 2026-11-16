# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0011 | — | **Informe de ocupación por sala**<br>*Horas reservadas sobre horas disponibles, por sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261113-225444-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** ocupación = horas reservadas ÷ 60 h (lun-vie 08:00-20:00) de la semana tipo, porque las reservas guardan día de la semana y no fecha; ver «Reglas de negocio» de la propuesta<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/informes.js`</details> | ⏳ | — | M |
| 0012 | — | **Exportar el informe a Excel**<br>*Un .xlsx con una fila por sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261113-225444-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** columnas Sala, Horas reservadas, Horas disponibles, Ocupación (%); la librería de .xlsx se elige en el spec<br>**Salda:** nada<br>**Toca:** `src/informes.js`, `package.json`</details> | ⏳ | 0011 | S |
| 0013 | — | **Aviso semanal a los responsables**<br>*Cada lunes a las 08:00, su sala por correo*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261113-225444-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** responsables en una configuración sala → direcciones; sala sin responsable no envía y deja log; reutiliza el envío de `src/correo.js` de la 0008<br>**Salda:** nada<br>**Toca:** `src/correo.js`, `src/informes.js`</details> | ⏳ | 0008, 0011, 0012 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
