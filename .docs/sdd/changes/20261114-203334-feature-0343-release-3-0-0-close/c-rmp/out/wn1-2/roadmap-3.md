# Roadmap — salas

## Now

Perfil de control: delegate

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0020 | — | **Filtrar salas por aforo**<br>*`libres --aforo 8` lista solo las que caben*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | — | S |
| 0021 | — | **Recordatorio al cancelar**<br>*Avisa a quien estaba en espera*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | — | S |
| 0012 | — | **Exportar a Excel**<br>*Una hoja por sala con una fila por reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reglas de negocio<br>**Decisiones ya tomadas:** una hoja por sala<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | M |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0022 | — | **Colores por planta**<br>*Cada planta con su color en el listado*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | — | S |
| 0014 | — | **Ranking de salas**<br>*Las diez más reservadas del mes*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reparto<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | 0012 | S |
| 0015 | — | **Informe trimestral**<br>*Suma el ranking de los tres meses*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reparto<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | 0014 | S |
| 0013 | — | **Aviso semanal a los responsables**<br>*Cada lunes, las reservas de su planta*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** `.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md`, §Reglas de negocio y §Enmiendas<br>**Decisiones ya tomadas:** el aviso sale los lunes a las 8:00<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ⏳ | 0012 | M |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
