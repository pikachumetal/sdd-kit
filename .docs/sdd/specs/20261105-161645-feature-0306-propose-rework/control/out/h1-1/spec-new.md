---
id: 20261105-212201-feature-0012-libres-planta
feature: 0012
title: Filtrar libres por planta
mode: full
status: approved
created: 2026-11-05
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-05
---

# Spec — Filtrar libres por planta

🦆 Hoy `libres 10:00-12:00` enseña todas las salas libres de esa franja, estén en la planta que estén. Con el cambio, `libres 10:00-12:00 --planta 2` enseña solo las libres de la planta 2 (`Sur`), y sin `--planta` sigue enseñando todas, como ahora. Para que exista el filtro, cada sala pasa a tener una planta: la propongo yo (Norte en la 1, Sur en la 2) y hay que validarla.

Validación: dev-lead — lo usa una persona desde la terminal y lo que ve (salidas y mensajes) lo decide ella.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran (por planta).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos (Sonnet) — señales: capacidad nueva (`room-availability`), datos (cada sala gana una planta) · tamaño: ~15 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Único (sonnet): si los THEN de «Planta sin salas» y «Planta no válida» salen de decisiones declaradas aquí y no del cuerpo, y si el reparto de plantas inventado contradice algo de `PRODUCT.md` (señal: datos nuevos + capacidad nueva)
- Mínimo razonable: sin revisor — deja sin mirar si algún mensaje o valor del cuerpo no está declarado aquí

1. **Las salas tienen planta: Norte en la 1, Sur en la 2.** Nadie lo dijo y hoy las salas no tienen planta; sin ese dato el filtro no tiene sobre qué actuar. Es un dato de ejemplo: lo corriges tú.
2. **El valor es un número entero: `--planta 2`.** Y puede ir antes o después de la franja (`libres --planta 2 10:00-12:00` = `libres 10:00-12:00 --planta 2`); la franja sigue siendo el primer argumento que no es la opción ni su valor.
3. **Formato de salida sin cambios**: nombres separados por `, `; si no queda ninguna libre, línea vacía, como hoy.
4. **Planta que no existe (`--planta 9`)**: `sin salas en la planta 9`. Distingue «esa planta no existe» de «existe y no hay libres» (línea vacía).
5. **Valor ausente o no numérico (`--planta`, `--planta dos`)**: `planta no válida: usa un número`. No se ignora en silencio ni se lista todo.
6. **Capacidad nueva `room-availability`** (inglés kebab-case): el proyecto no tiene capacidades y esta recoge también el comportamiento actual de `libres` (primer requisito) para que el filtro no quede suelto.
7. **Enfoque**: un asistente pequeño en `src/app.js` que separa `--planta <n>` de los argumentos y `freeRooms(slot, floor)` con `floor` opcional. Descartado: un parser genérico de opciones (hoy solo hay una opción; se hará cuando haya una segunda) y un comando nuevo `libres-planta` (rompe «sin `--planta`, lista todas»).
8. **Término nuevo «Planta»** (evitar «piso», «floor»): lo escribe el cierre en `PRODUCT.md`, que entra en el Scope.
9. **Fila 0012 en el roadmap**, en «Próximo» con `🔄 en curso`: la feature no tenía fila.
10. **«Número entero» = solo dígitos** (`2`, `9`, `0`). `-1`, `2.5`, `dos`, el valor ausente o una franja tomada como valor (`libres --planta 10:00-12:00`) dan el mensaje de la decisión 5.
11. **Orden de comprobación**: primero que el valor sea válido (decisión 5), después que la planta exista (decisión 4), después se filtra. La franja no se valida: `libres` sin franja se comporta como hoy.
12. **`--planta` repetido: gana la última** (`--planta 1 --planta 2` = `--planta 2`); los argumentos sobrantes se ignoran, como hoy.
13. **`libres` no tiene día**: filtra solo por franja, como hoy; las reservas de los escenarios son las del dato de ejemplo actual (Norte reservada en `10:00-12:00`).

### Hallazgos de la review

- **Aceptado** — GIVEN que habla de un día que `libres` no tiene → decisión 13 y GIVEN reescritos con las reservas del dato actual.
- **Aceptado** — AND que mezcla otro GIVEN → escenario propio «Planta sin libres».
- **Aceptado** — `--planta` con 0, negativos, decimales, valor ausente en medio → decisión 10 y THEN en «Planta no válida».
- **Aceptado** — orden de validación → decisión 11.
- **Aceptado** — `--planta` repetido y argumentos sobrantes → decisión 12.
- **Aceptado** — «Límites» y «Regla ante conflicto» → rellenadas.
- **Rechazado** — nombre `room-availability` frente a «Evitar: room» → el slug es un nombre de fichero en inglés kebab-case por la plantilla; el contenido va en castellano.
- **Aceptado** — `PRODUCT.md` fuera del Scope → entra en el Scope.
- **Aceptado** — líneas citadas → se cita por símbolo.
- **Rechazado** — `approved` antes de la review → la review se hizo antes de fijar la aprobación; la planta Norte 1 / Sur 2 queda para la validación, decisión 1.

- Política de modelos: revisor de la spec Sonnet (uno, dominio y técnica juntos) · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»
- Spec aprobada por delegación (2026-11-05) — «Apruebo la spec por delegación, nos vemos en la validación»; el plan se escribe y se para antes de implementar — «escribe la spec y el plan y para antes de implementar»

## Intent

Hoy `libres <franja>` lista todas las salas libres y quien está en una planta tiene que descartar a ojo las de otra. Se quiere poder acotar por planta con `--planta`, sin cambiar nada para quien no la use. Éxito: `libres 10:00-12:00 --planta 2` → `Sur`; `libres 10:00-12:00` → `Sur` (sin cambios). Fracaso aunque funcione: que sin `--planta` cambie la salida de hoy.

## Scope

- Entra: la opción `--planta <n>` en `libres`; la planta de cada sala (Norte 1, Sur 2); los dos mensajes de error de las decisiones 4 y 5; el término «Planta» en `PRODUCT.md` (lo escribe el cierre).
- No entra: filtrar `reservar`, `cancelar` o `anular` por planta; plantas con nombre o letra; más opciones; mostrar la planta junto al nombre de la sala en la salida.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de `['Norte', 'Sur']` a objetos `{ name, floor }` | `src/app.js`: definición de `rooms` y su único uso, `freeRooms` | Scope: se adapta `freeRooms`; decisión 1 |
| `freeRooms(slot)` gana el parámetro `floor` | `src/app.js`: `freeRooms` y su llamada en `run` | Scope; decisión 7 |

- Filas que implementa: 0012 → nada la nombra fuera de esta carpeta; la fila nueva del roadmap es la decisión 9 | nada más: comprobado con `git grep -n -iE "rooms|libres|planta|freeRooms"`: solo `src/app.js`, `test/app.test.js` y `changelog.md:10` (entrada de la 0006, que describe `libres <franja>` y sigue siendo cierta)

## Approach

`run('libres', params)` separa `--planta <n>` de `params`, valida el número y llama a `freeRooms(slot, floor)`, que filtra por la planta de la sala solo si `floor` viene. Los errores de las decisiones 4 y 5 los devuelve `run` como texto, igual que `cancelar` devuelve `sin reserva …`. Datos y salida según las decisiones 1–5.

## Dónde se prueba

- `libres` con y sin `--planta`, planta inexistente, valor no válido y orden de argumentos: por `run('libres', [...])`, como el test actual de `libres` en `test/app.test.js`.
- La salida real de la terminal: un smoke `node src/app.js libres 10:00-12:00 --planta 2` en la validación.

## Términos y ADR

- Términos resueltos: Planta — el nivel del edificio donde está una sala (Norte 1, Sur 2); evitar «piso», «floor».
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres sin planta lista todas las salas libres de la franja

- GIVEN Norte (planta 1) con una reserva en 10:00-12:00 y Sur (planta 2) sin reservas
- WHEN `libres 10:00-12:00`
- THEN la salida es `Sur`
- AND con `libres 14:00-16:00` la salida es `Norte, Sur`

#### ADDED — Libres filtra por planta

- GIVEN Norte (planta 1) y Sur (planta 2), ninguna con reserva en 14:00-16:00
- WHEN `libres 14:00-16:00 --planta 2`
- THEN la salida es `Sur`
- AND `libres --planta 2 14:00-16:00` da la misma salida
- AND `libres 14:00-16:00 --planta 1 --planta 2` da `Sur` (gana la última)

#### ADDED — Planta sin libres

- GIVEN Norte (planta 1) con una reserva en 10:00-12:00
- WHEN `libres 10:00-12:00 --planta 1`
- THEN la salida es una línea vacía

#### ADDED — Planta sin salas

- GIVEN Norte (planta 1) y Sur (planta 2)
- WHEN `libres 14:00-16:00 --planta 9`
- THEN la salida es `sin salas en la planta 9`

#### ADDED — Planta no válida

- GIVEN Norte (planta 1) y Sur (planta 2)
- WHEN `libres 14:00-16:00 --planta`, `--planta dos`, `--planta -1` o `--planta 2.5`, o `libres --planta 10:00-12:00`
- THEN la salida es `planta no válida: usa un número`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: en memoria, en `src/app.js` (cada sala con su planta: Norte 1, Sur 2).
- **Idioma de los nombres**: castellano (`--planta`, `libres`).
- **Límites**: plantas existentes 1 y 2; el valor de `--planta` son solo dígitos.
- **Avisos**: `sin salas en la planta <n>` · `planta no válida: usa un número`.
- **Regla ante conflicto**: `--planta` repetido, gana la última.

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-05 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
