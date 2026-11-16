# Roadmap — salas

## Now

Perfil de control: delegate

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0012 | — | **Exportar a Excel**<br>*Una hoja por sala con una fila por reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reglas de negocio<br>**Decisiones ya tomadas:** una hoja por sala<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | M |
| 0014 | — | **`libres --planta <n>` solo lista la planta pedida**<br>*Con `--planta 2` sale `Norte (planta 1)`*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `docs/qa/2026-10-12-informe.md`, hallazgo 2<br>**Decisiones ya tomadas:** en `roomsOnFloor` de `src/app.js`, `floors[room] <= floor` pasa a `floors[room] === floor`; el `<` que propone el informe no sirve, porque con la planta 2 sigue listando `Norte (planta 1)` (probado en una copia)<br>**Salda:** `salas libres --planta 2` lista también salas de la planta 1<br>**Toca:** `src/app.js`, `test/app.test.js`</details> | ⏳ | — | S |
| 0015 | — | **La ayuda de `libres --planta` dice lo que hace**<br>*Solo las libres, y todas las plantas sin número*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `docs/qa/2026-10-12-informe.md`, hallazgo 3<br>**Decisiones ya tomadas:** en `docs/ayuda.md`, la frase «`libres --planta <n>` lista las salas de la planta <n>; sin número, responde «indica una planta».» pasa a «`libres --planta <n>` lista las salas libres de la planta <n>; sin número, las libres de todas las plantas.»<br>**Salda:** `docs/ayuda.md` no dice que `libres --planta` lista solo las salas libres, ni qué da sin número<br>**Toca:** `docs/ayuda.md`</details> | ⏳ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0013 | — | **Aviso semanal a los responsables**<br>*Cada lunes, las reservas de su planta*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reglas de negocio y §Enmiendas<br>**Decisiones ya tomadas:** el aviso sale los lunes a las 8:00<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | 0012, 0014 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
