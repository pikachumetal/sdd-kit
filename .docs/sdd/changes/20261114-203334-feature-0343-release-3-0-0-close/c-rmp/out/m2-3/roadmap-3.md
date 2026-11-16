# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0011 | — | **Informe de ocupación por sala**<br>*Comando que muestra el porcentaje de ocupación semanal de cada sala*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** ventana lun-vie 08:00-20:00 (60 h) como constante; sin histórico porque las reservas no guardan fecha; ver «Reglas de negocio» de la propuesta<br>**Salda:** nada<br>**Toca:** `src/app.js`, `src/informes.js`</details> | ⏳ | — | M |
| 0012 | — | **Exportar el informe a Excel**<br>*El informe de ocupación como CSV que abre Excel*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** CSV UTF-8 con BOM y separador `;` en vez de .xlsx, porque la constitution prohíbe dependencias externas<br>**Salda:** nada<br>**Toca:** `src/informes.js`</details> | ⏳ | 0011 | M |
| 0013 | — | **Aviso semanal a los responsables**<br>*Un correo semanal a cada responsable con la ocupación de sus salas*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261114-120000-proposal-0010-informes/proposal.md`<br>**Decisiones ya tomadas:** comando `informe semanal` lanzado por cron los lunes 08:00; responsables en `responsables.json`; envío con `src/correo.js` de la 0008<br>**Salda:** nada<br>**Toca:** `src/informes.js`, `src/correo.js`, `responsables.json`</details> | ⏳ | 0011, 0012, 0008 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
