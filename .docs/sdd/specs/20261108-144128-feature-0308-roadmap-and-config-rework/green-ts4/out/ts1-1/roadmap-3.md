# Roadmap — salas

## Now

Perfil de control: delegate

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0012 | — | **Exportar a Excel**<br>*Una hoja por sala con una fila por reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reglas de negocio<br>**Decisiones ya tomadas:** una hoja por sala<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | M |
| 0014 | — | **Arreglar el filtro de `libres --planta`**<br>*Debe listar solo las salas de la planta pedida*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/steering/debt.md`, fila «`salas libres --planta 2` lista también salas de la planta 1»<br>**Decisiones ya tomadas:** en `roomsOnFloor` de `src/app.js` el filtro es `floors[room] === floor`; el `<` que propone el informe de QA no arregla nada (con `--planta 2` sigue saliendo `Norte (planta 1)`), probado en una copia fuera del árbol: con `===`, `--planta 2` no devuelve salas y `--planta 1` devuelve `Norte (planta 1)`<br>**Salda:** la fila «`salas libres --planta 2` lista también salas de la planta 1» de `debt.md`<br>**Toca:** `src/app.js`, `test/app.test.js`</details> | ⏳ | — | S |
| 0015 | — | **Aclarar `libres --planta` en la ayuda**<br>*Dice qué lista y qué da sin número*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/steering/debt.md`, fila «`docs/ayuda.md` no dice que `libres --planta` lista solo las salas libres…»<br>**Decisiones ya tomadas:** sale la frase «`libres --planta <n>` lista las salas de la planta <n>; sin número, responde «indica una planta».» y entra «`libres --planta <n>` lista las salas libres de la planta <n>; sin número, las libres de todas las plantas.»; coincide con lo que hace hoy el comando<br>**Tras:** 0014 aconsejable, no obligatorio<br>**Salda:** la fila «`docs/ayuda.md` no dice que `libres --planta` lista solo las salas libres…» de `debt.md`<br>**Toca:** `docs/ayuda.md`</details> | ⏳ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0013 | — | **Aviso semanal a los responsables**<br>*Cada lunes, las reservas de su planta*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reglas de negocio y §Enmiendas<br>**Decisiones ya tomadas:** el aviso sale los lunes a las 8:00<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | 0012, 0014 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| B1 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
