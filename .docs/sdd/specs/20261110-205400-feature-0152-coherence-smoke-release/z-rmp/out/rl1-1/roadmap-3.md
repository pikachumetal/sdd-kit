# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |
| 0010 | — | **Mensajes de error de `salas`: franja no válida, día y sala sin indicar**<br>*Tres respuestas erróneas de `salas` que deben avisar al usuario*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner: `libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM» (hoy lista las salas); `cancelar Norte` responde «indica un día» (hoy «cancelada Norte undefined»); `reservar` sin argumentos responde «indica una sala» (hoy «salas»)<br>**Decisiones ya tomadas:** los tres fallos están reproducidos y la solución es la de cada respuesta indicada; son tres comportamientos nuevos, con una prueba cada uno, por eso es feature y no patch; el primero solapa con la fila «Sin validación del formato de franja horaria» de «Por triar» en `debt.md`, que no se toca<br>**Salda:** nada<br>**Toca:** `src/app.js`, `test/app.test.js`</details> | ⏳ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
