# Roadmap — salas

## Now

Perfil de control: delegate

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0012 | — | **Exportar a Excel**<br>*Una hoja por sala con una fila por reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reglas de negocio<br>**Decisiones ya tomadas:** una hoja por sala<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | M |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0013 | — | **Aviso semanal a los responsables**<br>*Cada lunes, las reservas de su planta*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reglas de negocio y §Enmiendas<br>**Decisiones ya tomadas:** el aviso sale los lunes a las 8:00<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | 0012 | M |
| 0014 | — | **Patch: `libres --planta` solo lista las salas libres de esa planta**<br>*Corrige el filtro de planta y la ayuda*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `docs/qa/2026-10-12-informe.md`, hallazgos 2 y 3<br>**Decisiones ya tomadas:** en `roomsOnFloor` de `src/app.js` cambiar `floors[room] <= floor` por `floors[room] === floor` (el `<` que propone el informe seguiría listando `Norte (planta 1)` para la planta 2; probado en copia: la planta 2 queda vacía y la 3 da `Sur (planta 3)`); en `docs/ayuda.md` cambiar «lista las salas de la planta <n>» por «lista las salas libres de la planta <n>»<br>**Salda:** hallazgos 2 y 3 de la deuda<br>**Toca:** `src/app.js`, `docs/ayuda.md`, `test/app.test.js`</details> | ⏳ | 0013 | S |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| B1 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
