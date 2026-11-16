# Roadmap — salas

## Now

Perfil de control: delegate

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0012 | — | **Exportar a Excel**<br>*Una hoja por sala con una fila por reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reglas de negocio<br>**Decisiones ya tomadas:** una hoja por sala<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | M |
| 0014 | — | **Corregir `libres --planta`**<br>*Filtra por la planta pedida y la ayuda dice lo que hace*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `docs/qa/2026-10-12-informe.md` §2 y §3<br>**Decisiones ya tomadas:** en `roomsOnFloor` de `src/app.js`, `<=` pasa a `===`, no a `<` como propuso el informe: `<` devolvería las plantas anteriores a la pedida, y con `--planta 2` no saldría ninguna sala (solución por confirmar: no se ha ejecutado el cambio). En `docs/ayuda.md` la frase «`libres --planta <n>` lista las salas de la planta <n>; sin número, responde «indica una planta».» pasa a «`libres --planta <n>` lista las salas libres de la planta <n>; sin número, las libres de todas las plantas.»<br>**Salda:** las dos filas de «Lista» de `libres --planta`<br>**Toca:** `src/app.js`, `docs/ayuda.md`, `test/app.test.js`</details> | ⏳ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0013 | — | **Aviso semanal a los responsables**<br>*Cada lunes, las reservas de su planta*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reglas de negocio y §Enmiendas<br>**Decisiones ya tomadas:** el aviso sale los lunes a las 8:00<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | 0012, 0014 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
