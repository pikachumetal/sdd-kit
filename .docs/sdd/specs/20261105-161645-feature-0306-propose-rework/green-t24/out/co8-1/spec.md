---
id: 20261008-190000-feature-0021-slot-check
feature: 0021
title: Franja no válida en libres
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Franja no válida en libres

🦆 Hoy, si pides `libres 10:00-10:00` —una franja de cero minutos—, la herramienta contesta «Norte, Sur» como si fuera una franja real. Con el cambio contesta «franja no válida: el final va después del inicio», y lo mismo con `libres 12:00-10:00`. Una franja bien puesta, como `libres 10:00-12:00`, sigue contestando `Sur`. Por dentro, `libres` comprueba que el final sea posterior al inicio antes de buscar salas.

Validación: dev-lead — es el texto que lee quien usa `libres`.

## Capacidades

- Nuevas: `rooms` — qué responde `libres` según la franja (por ahora, solo ese requisito: el resto del comportamiento de las salas no está escrito en capacidades).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor, despachado — señales: capacidad nueva (`rooms`) · tamaño: ~10 líneas en 2 ficheros
- Único (sonnet), con los siete puntos: que el escenario de `10:00-10:00` cubra el caso de conserjería y que `rooms` no contradiga `PRODUCT.md` ni la constitución (señal: capacidad nueva)
- Mínimo razonable: sin revisión — deja sin mirar que un THEN no atrape el caso real, que es lo que más barato falla aquí

1. El caso que reportó conserjería, `libres 10:00-10:00` (`src/app.js:5`, `freeRooms`), lista Norte y Sur como libres en una franja de cero minutos: es el caso que esta spec cierra.
2. El texto de la respuesta: «franja no válida: el final va después del inicio».
3. Una franja con el final igual al inicio también es no válida (el caso 1 lo exige), no solo la invertida.
4. Capacidad nueva `rooms` (inglés, kebab-case): `capabilities/` está vacía, así que no hay requisito que modificar. El requisito entra como `ADDED` y recoge también lo que `libres` ya hacía con una franja válida (task 0006), para que la capacidad diga el comportamiento entero y no solo el rechazo. Es una decisión de alcance: si prefieres que `rooms` nazca solo con los dos rechazos, dímelo y quito el primer requisito.
5. La comparación es de texto `HH:MM` con cero a la izquierda, y la validación va antes de buscar salas. Una franja sin ese formato, como `9:00-10:00`, no es objeto de esta spec: hoy comparada como texto saldría «invertida» y se rechazaría; lo cubrirá la fila de deuda del formato.
6. El aviso es una respuesta más de `libres`: `run` devuelve la cadena y la herramienta la imprime, sin error y sin cambiar el código de salida (0). `libres` no recibe día: la franja se compara con las reservas activas sin mirar el día, como hoy.
7. Reglas de la capacidad: dónde vive el dato, no aplica (no se guarda nada); idioma de los nombres, castellano en el texto y `rooms` en inglés por ser fichero; límites, no aplica fuera de «el final va después del inicio» (horas fuera de rango, `25:00`, y franjas que cruzan medianoche, quedan en la deuda del formato); avisos, el literal de la decisión 2; conflicto, no aplica.

### Hallazgos de la review

- **Aceptado** — el escenario «Ver las salas libres» no fija salas ni día → el GIVEN dice que las salas son Norte y Sur; el día no cuenta (decisión 6).
- **Aceptado** — el GIVEN de la reserva sobra en los rechazos → los dos rechazos lo quitan y llevan el AND «no lista ninguna sala».
- **Aceptado** — el requisito previo es un alcance que el Intent no decía → Intent y Scope lo dicen, y la decisión 4 lo marca como de alcance.
- **Aceptado** — decisiones sin listar (orden de validación, aviso sin error, comparación) → decisiones 5 y 6.
- **Aceptado** — reglas de la capacidad sin declarar → decisión 7.
- **Aceptado** — criterio de «bien formada» sin escribir → decisión 5.
- **Rechazado** — «el mínimo razonable se auto-afirma» → es la línea que pide el formato de la review: nombra lo que queda sin cubrir.
- **Rechazado** — nombres reales (Laura, conserjería) y perfil → Laura es la aprobadora del proyecto en su cabecera y conserjería viene del caso reportado; el perfil `delegate` es el del proyecto (`sdd-kit.json`).
- **Rechazado** — franjas con solape parcial (`11:00-13:00`) → la lógica de coincidencia no cambia; es de la 0006 y esta spec no la toca.

- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

Fusión del delta sobre una copia de `.docs/sdd` (`sdd capability merge`): `rooms.md: añadido «Ver las salas libres»`, `añadido «Rechazar la franja invertida»`, `añadido «Rechazar la franja de cero minutos»`, salida 0. La primera versión de la spec, con `MODIFIED` sobre `rooms`, la rechazó («`rooms` no tiene fichero en capabilities/»): por eso es capacidad nueva.

## Intent

Hoy `libres` acepta cualquier franja y responde con salas libres aunque la franja no tenga sentido. Debe rechazarla cuando el final no va después del inicio. Esta spec también deja escrito, como requisito de `rooms`, lo que `libres` ya hacía con una franja válida. Éxito: `libres 10:00-10:00` y `libres 12:00-10:00` responden el aviso; `libres 10:00-12:00` sigue respondiendo `Sur`.

## Scope

- Entra: escribir en `rooms` también el comportamiento previo de `libres` con franja válida (decisión 4); `freeRooms` y `run('libres', …)` en `src/app.js`, y su test en `test/app.test.js`.
- No entra: el formato `HH:MM`, que es la fila de deuda «Sin validación del formato de franja horaria» (se compara con franjas bien formadas; una mal formada sigue como hoy).
- Otros sitios revisados: `git grep` de «libres» y «franja» fuera de la spec solo da `src/app.js`, `test/app.test.js`, `changelog.md` (histórico de la 0006, no se toca) y la fila de deuda (se queda).

## Dónde se prueba

- La franja: por `run('libres', …)`, en `test/app.test.js`.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Ver las salas libres

- GIVEN las salas Norte y Sur, y la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`

#### ADDED — Rechazar la franja invertida

- GIVEN las salas Norte y Sur
- WHEN `libres 12:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»
- AND no lista ninguna sala

#### ADDED — Rechazar la franja de cero minutos

- GIVEN las salas Norte y Sur
- WHEN `libres 10:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»
- AND no lista ninguna sala

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
