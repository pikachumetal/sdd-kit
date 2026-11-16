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

Validación: dev-lead — lo usa una persona desde la terminal y la respuesta es texto que ella lee.

## Capacidades

- Nuevas: `rooms` — consultar las salas libres de una franja (hoy no hay ninguna capacidad escrita).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: `MODIFIED` no (es capacidad nueva), capacidad nueva · tamaño: ~15 líneas en 2 ficheros
- Dominio+técnica (sonnet): si los tres escenarios de `rooms` cubren el caso reportado (`10:00-10:00`) y si comparar la franja como texto da el THEN en los tres (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar que la capacidad nueva `rooms` describa solo lo que el código hace hoy

### Hallazgos de la review

Primera ronda:

- **Aceptado** — el escenario de `Sur` pasa hoy sin validación y el GIVEN no fija las salas → queda como regresión y su GIVEN dice «salas Norte y Sur»; los rechazos añaden «y no lista ninguna sala».
- **Aceptado** — requisito único que mezcla lo existente y lo nuevo → dos requisitos `ADDED`, «Consultar las salas libres de una franja» y «Rechazar una franja no válida»; el primero solo recoge la regresión.
- **Aceptado** — falso rechazo de `9:00-10:00` por comparar texto → declarado en la decisión 4 con la alternativa B; sin cambio de enfoque, el gate lo valida.
- **Aceptado** — Intent cita línea y cliente → ahora cita la función y «se reportó».
- **Aceptado** — referencias incoherentes y 0021 sin fila de roadmap → corregido en «Lo que se retira».
- **Rechazado** — canal de salida y argumentos mal formados → decisión 5: es la respuesta de texto de `run`, y el formato es la fila de deuda.
- **Rechazado** — quién es Laura, perfil y nivel de review → Laura es la aprobadora del dev-lead que ya traía la spec; el perfil `delegate` viene de `sdd-kit.json` y un revisor es lo que da la rúbrica para ~15 líneas sin contrato público.
- **Rechazado** — `rooms` contra el glosario y falta de «franja» → el slug de capacidad va en inglés por regla; el glosario no es de este cambio.
- **Rechazado** — mapear escenarios a tests y el RED → es del plan.

Segunda ronda (por el Crítico aceptado; sin tercera):

- **Aceptado (Crítico)** — con texto, `9:00-10:00` falla y ningún escenario lo dice → el requisito se acota a franjas `HH:MM` de dos dígitos, y la decisión 4 sigue ofreciendo el enfoque B.
- **Aceptado** — sin escenario de frontera ni de «todas libres» → añadido `libres 10:00-10:01` → `Norte, Sur`, que fija el «estrictamente posterior» y el caso de todas libres.
- **Aceptado** — `capabilities/rooms.md` no estaba en Scope, la capacidad parecía completa y la tabla de retiros iba vacía → Scope la lista y dice que solo recoge estos escenarios; la tabla se quita.
- **Aceptado** — canal de salida sin observable → es el valor que devuelve `run` (decisión 5); cita de `CHANGELOG.md` sin número de línea.
- **Rechazado** — `10:00-10:00` hoy no daría `Norte, Sur` → `freeRooms` compara la franja por igualdad con `10:00-12:00`, y `10:00-10:00` no es igual: Norte sale libre.
- **Rechazado** — comportamiento de `10:00` y `abc`, política de modelos en la lista de ✋, rol de Laura → lo primero es la fila de deuda; la línea de política la pide la plantilla en `delegate`; Laura sigue como aprobadora.

1. Capacidad nueva `rooms` (no había ninguna en `capabilities/`): el delta usa `ADDED`, con dos requisitos: el de consultar libres, que recoge solo el caso ya existente que sirve de regresión (`10:00-12:00` → `Sur`), y el de rechazar la franja no válida, que es el cambio.
2. El texto de la respuesta: «franja no válida: el final va después del inicio».
3. Una franja es válida si su final es **estrictamente posterior** a su inicio: `10:00-10:00` (cero minutos) también se rechaza.
4. La comparación es sobre el texto `HH:MM`. Consecuencia conocida, `sin medir` (se medirá en el RED de la task): con una hora de un dígito `9:00-10:00` se rechazaría por error y `10:00-9:00` pasaría como válida. Es el formato de franja, que sigue en la fila de deuda y no se toca aquí. Si no lo aceptas, el enfoque B lo evita a costa de entrar en esa fila.
- Fusión del delta en una copia de `.docs/sdd`: `rooms.md: añadido «Consultar las salas libres de una franja»` · `rooms.md: añadido «Rechazar una franja no válida»` (sin errores; `capabilities/` del repo intacto).
5. Los rechazos salen por la misma respuesta de texto que el resto de `run` (el valor que devuelve `run`, que es lo que prueba el test); los argumentos mal formados (`10:00`, `abc`) quedan fuera, con la fila de deuda.
6. Enfoque: A (comparar los dos extremos como texto en `run('libres', …)`), frente a B (convertir a minutos con una función de análisis) y C (validar dentro de `freeRooms`); ver Approach.
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

## Intent

Hoy `libres` acepta cualquier franja y responde con salas libres aunque la franja no tenga sentido. Se reportó `libres 10:00-10:00`: `run('libres', …)` responde `Norte, Sur` para una franja de cero minutos. Éxito: `libres` con un final que no es posterior al inicio responde el rechazo, sin listar salas, y `libres 10:00-12:00` sigue respondiendo `Sur`.

## Scope

- Entra: la comprobación en `run('libres', …)` de `src/app.js`; `freeRooms` no cambia.
- No entra: el formato `HH:MM`, que es la fila de deuda «Sin validación del formato de franja horaria».
- Entra, al archivar: `capabilities/rooms.md`, que nace de este delta y solo recoge estos escenarios, no describe `libres` entera.
- No entra: la entrada del CHANGELOG, que se escribe al cortar la versión.

## Lo que se retira o cambia de forma

Nada se retira ni cambia de forma (sin filas): `libres` solo lo nombran `run` en `src/app.js`, el test de `libres` en `test/app.test.js` y `CHANGELOG.md` (la entrada de la 0006, que sigue siendo cierta).

- Filas que implementa: nada: comprobado con `git grep -niE "0021|libres|franja" -- . ':!.docs/sdd/specs'` (la 0021 no tiene fila en `ROADMAP.md`: se reservó con la rama `feature/0021`; la fila de deuda del formato queda fuera).

## Approach

- A — comparar los dos extremos como texto en `run('libres', …)`: un `if` de dos líneas, sin funciones nuevas; vale mientras la franja sea `HH:MM` con dos dígitos.
- B — convertir a minutos con una función de análisis: correcto también con `9:00`, pero es validar el formato, que es otra fila de deuda.
- C — validar dentro de `freeRooms`: mezcla la entrada del comando con la consulta.
- Elegido: A — es lo que cabe en el alcance y deja el formato para su fila.

## Dónde se prueba

- La franja: por `run('libres', …)`, en `test/app.test.js`, como el test actual de `libres`.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Consultar las salas libres de una franja

- GIVEN las salas Norte y Sur, y la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`

- GIVEN las salas Norte y Sur, y la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 10:00-10:01`
- THEN responde `Norte, Sur`

#### ADDED — Rechazar una franja no válida

- GIVEN las salas Norte y Sur, la reserva de Norte del lunes de 10:00 a 12:00 y una franja `HH:MM` de dos dígitos (el resto es la fila de deuda del formato)
- WHEN `libres 12:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»
- AND no lista ninguna sala

- GIVEN las salas Norte y Sur, la reserva de Norte del lunes de 10:00 a 12:00 y una franja `HH:MM` de dos dígitos (el resto es la fila de deuda del formato)
- WHEN `libres 10:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»
- AND no lista ninguna sala

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
