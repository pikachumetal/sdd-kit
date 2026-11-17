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
| 0014 | — | **Arreglar `libres --planta` con salas de otra planta**<br>*`libres --planta 2` devuelve `Norte (planta 1)`*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `docs/qa/2026-10-12-informe.md` §2<br>**Decisiones ya tomadas:** el arreglo del informe (`<=` por `<`) no sirve: en una copia, `libres --planta 2` sigue devolviendo `Norte (planta 1)`; con `===` devuelve vacío para la 2 y `Norte (planta 1)` para la 1. Solución por confirmar con el caso real y su prueba<br>**Salda:** `libres --planta 2` lista también salas de la planta 1<br>**Toca:** `src/app.js`, `test/app.test.js`</details> | ⏳ | 0013 | S |
| 0015 | — | **Aclarar en la ayuda que `libres --planta` lista solo salas libres**<br>*Texto de `docs/ayuda.md`*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `docs/qa/2026-10-12-informe.md` §3<br>**Decisiones ya tomadas:** la frase «`libres --planta <n>` lista las salas de la planta <n>» pasa a «`libres --planta <n>` lista las salas libres de la planta <n>»; las ocupadas ya se excluyen en `roomsOnFloor`<br>**Salda:** `docs/ayuda.md` no dice que `libres --planta` lista solo las salas libres<br>**Toca:** `docs/ayuda.md`</details> | ⏳ | — | S |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| B1 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
