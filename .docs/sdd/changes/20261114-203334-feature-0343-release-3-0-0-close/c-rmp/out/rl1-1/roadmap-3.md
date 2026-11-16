# Roadmap — salas

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0008 | — | **Avisos por correo antes de la reserva**<br>*Un aviso por correo antes de cada reserva*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** los del one-liner<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/correo.js`</details> | ⏳ | — | M |
| 0010 | — | **Mensajes de error de `salas` en `libres`, `cancelar` y `reservar`**<br>*Tres entradas inválidas que hoy no avisan*<details><summary>Brief</summary>**Carril:** lite<br>**Requisitos:** `libres 25:00-26:00` debe responder «franja no válida: usa HH:MM-HH:MM» (hoy lista las salas); `cancelar Norte` debe responder «indica un día» (hoy «cancelada Norte undefined»); `reservar` sin más debe responder «indica una sala» (hoy «salas»)<br>**Decisiones ya tomadas:** una sola fila porque son tres validaciones de entrada del mismo fichero; los textos son literales; los tres casos están reproducidos<br>**Salda:** nada<br>**Toca:** `src/app.js`, `test/app.test.js`</details> | ⏳ | — | S |
| 0007 | — | **La cancelación borraba reservas de otro día con la misma hora**<br>*2026-09-18*<details><summary>Brief</summary>**Carril:** patch<br>**Requisitos:** `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`<br>**Decisiones ya tomadas:** ninguna<br>**Salda:** nada<br>**Toca:** `src/app.js`</details> | ✅ | — | S |

## Next

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |

## Later

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0009 | — | **Exportar reservas a calendario (.ics)**<br>*Idea propia* | ⏳ | — | — |
