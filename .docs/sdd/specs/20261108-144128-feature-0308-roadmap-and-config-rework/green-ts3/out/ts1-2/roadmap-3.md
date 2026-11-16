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
| 0014 | — | **Corregir `libres --planta` y su ayuda**<br>*Con `--planta 2` solo salas libres de la planta 2*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `docs/qa/2026-10-12-informe.md`, hallazgos 2 y 3<br>**Decisiones ya tomadas:** el filtro de `roomsOnFloor` en `src/app.js:12` pasa de `<=` a `===` (el `<` que propone el informe dejaría la planta 1 sin salas y no la corrige); solución por confirmar contra la planta 1 y la 3. `docs/ayuda.md` pasa a decir que lista las salas libres de la planta <n> y, sin número, las libres de todas las plantas<br>**Salda:** los dos ítems de «Lista» de `libres --planta`<br>**Toca:** `src/app.js`, `docs/ayuda.md`, `test/app.test.js`</details> | ⏳ | — | S |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| B1 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
