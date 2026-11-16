---
id: 20261106-100919-feature-0012-planta-libres
feature: 0012
title: Filtrar libres por planta
mode: full
status: approved
created: 2026-11-06
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-06
---

# Spec — Filtrar libres por planta

🦆 Hoy `libres 10:00-12:00` lista todas las salas libres de la franja, estén en la planta que estén. Con esta feature, `libres 10:00-12:00 --planta 2` enseña solo las de la planta 2 (`Sur`), y sin `--planta` sigue listando todas, como ahora. Para ello cada sala pasa a tener una planta: `Norte` en la 1 y `Sur` en la 2.

Validación: dev-lead — es un comando que usa una persona desde la terminal.

## Capacidades

- Nuevas: `room-availability` — qué salas hay libres en una franja y cómo se filtran

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`room-availability`) · tamaño: ~25 líneas en 2 ficheros
- Único (sonnet): los siete puntos sobre esta spec; en particular que el requisito «Listar las salas libres de una franja» describe fielmente lo que `libres` hace hoy (sin `--planta`) y que los textos de error de «Filtrar libres por planta» no chocan con la salida vacía de «ninguna libre» (señal: capacidad nueva)
- Mínimo razonable: sin revisión — deja sin cubrir si el requisito que documenta el comportamiento actual de `libres` lo describe bien, que es lo que quedará como verdad viva

1. **Planta de cada sala**: `Norte` está en la planta 1 y `Sur` en la 2. Nadie dijo qué sala está en qué planta; es un dato inventado para poder probar. Si no es el real, hay que decir cuál es antes de implementar.
2. **La planta es un número** (`--planta 2`), no un nombre («baja», «segunda»).
3. **Forma de la opción**: `--planta <n>` puede ir antes o después de la franja (`libres --planta 2 10:00-12:00` y `libres 10:00-12:00 --planta 2` dan lo mismo). Es lo que ya hace `reservar` en `src/app.js`, que acepta `--cada-semana` en cualquier posición.
4. **Planta que no existe**: las plantas válidas son exactamente `1` y `2`; cualquier otro valor (`9`, `0`, `abc`, `1.5`, `02`) responde `planta desconocida: <valor tal cual>`, no una lista vacía, para que un error al teclear no se confunda con «no queda ninguna libre».
5. **`--planta` sin valor** (`libres 14:00-16:00 --planta`): responde `falta el valor de --planta`.
6. **Ninguna libre en esa planta** (`libres 10:00-12:00 --planta 1`): `run` devuelve la cadena vacía `""`, que es lo que ya devuelve hoy cuando no queda ninguna libre sin filtrar.
7. **Sin franja** (`libres --planta 2`): lista las libres de la planta 2 sin mirar reservas, igual que hoy `libres` sin franja lista todas.
8. **Capacidad nueva `room-availability`**: el proyecto no tiene capacidades; el comportamiento de `libres` es observable y merece una. Su primer requisito documenta lo que `libres` ya hace.
9. **Enfoque** (central): el dato de planta vive junto a la lista de salas en `src/app.js` (pasa de `['Norte', 'Sur']` a salas con nombre y planta) y `run` separa `--planta <n>` de los parámetros posicionales. Descartados: un módulo aparte para parsear opciones (YAGNI: un solo fichero de entrada, `tech-stack.md`) y filtrar tras listar por nombre de sala (obligaría a un mapa sala→planta aparte que se desincroniza).
10. **Repaso de coherencia**: `git grep` de `libres` y `planta` en todo el repo solo encuentra `src/app.js`, `test/app.test.js` y el `changelog.md` histórico; el delta probado en una copia de `.docs/sdd` con `sdd capability merge`: 4 requisitos y 5 entradas de reglas añadidos (la de conflicto, «no aplica»), `capability check` válido (rc 0). No hay `MODIFIED`, así que nada fuera de la spec que corregir.
- Política de modelos: revisor de la spec en sonnet (un revisor, siete puntos) · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo

### Hallazgos de la review

- **Aceptado (parcial)** — Importante: la asignación `Norte`=1, `Sur`=2 está inventada y se presenta como hecho → sigue marcada en la decisión 1 como dato inventado; se confirma en la validación, que es donde el dev-lead la corrige si no es la real.
- **Rechazado** — condicionar la aprobación por delegación a esa confirmación → el dev-lead dijo «Apruebo la spec por delegación, nos vemos en la validación»: la validación es el sitio de confirmar el dato, y condicionar la aprobación contradiría su frase.
- **Aceptado** — Importante: «el lunes» no está definido → el GIVEN de «Listar las salas libres de una franja» pasa a «una reserva activa de `Norte` en 10:00-12:00», como el test actual.
- **Aceptado** — Importante: «falta el valor» mezclado y sin escenario para valores no enteros → requisitos «Rechazar una planta inválida» y «Rechazar `--planta` sin valor» separados; decisión 4 fija que todo valor distinto de `1` y `2` es `planta desconocida: <valor>`, con `abc`, `1.5` y `02` como escenarios.
- **Aceptado** — Importante: sin escenario para `libres --planta 2` sin franja → decisión 7 y escenario en «Filtrar libres por planta»; la justificación de la posición de la opción cita `src/app.js`.
- **Aceptado (parcial)** — Importante: «salida vacía» no es comprobable → los THEN dicen la cadena `""`. No añado el escenario «sin filtrar y ninguna libre»: sin una forma de crear reservas en los tests, no se puede preparar y no cambia nada en esta feature.
- **Aceptado** — Importante: Límites sin rango y «no aplica» de conflicto sin justificar → Límites: plantas `1` y `2`, el resto desconocida; conflicto: «una sala solo tiene una planta».
- **Aceptado** — Menor: recuento de reglas → aclarado en la decisión 10.
- **Aceptado** — Menor: referencias por línea → la tabla de «Lo que se retira» cita funciones (`freeRooms`, `run`), no líneas.
- **Rechazado** — Menor: el Intent depende del dato inventado y la salida sin planta no es un límite → el Intent ya cita `Norte` y `Sur` como el dato de la decisión 1 y los THEN con literal fijan que la salida son solo nombres.
- **Rechazado** — Menor: «dev-lead» no está en la misión → es el nombre que el kit da a quien dirige el cambio; aquí es la única persona del proyecto.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»
- Spec aprobada por delegación — «Apruebo la spec por delegación, nos vemos en la validación» (2026-11-06)
- Parar tras escribir spec y plan, antes de implementar — «escribe la spec y el plan y para antes de implementar»

## Intent

Hoy `libres <franja>` devuelve todas las salas libres, y el coworking tiene salas en varias plantas: quien está en la planta 2 tiene que descartar a ojo las de la 1. Se quiere poder acotar por planta con `--planta <n>`. Éxito: `libres 10:00-12:00 --planta 2` devuelve `Sur`, y `libres 10:00-12:00` sin la opción devuelve lo mismo que hoy. Sería un fracaso que, sin `--planta`, la salida cambiara en algo, o que un número de planta mal tecleado diera una lista vacía indistinguible de «no queda ninguna».

## Scope

- Entra: la opción `--planta <n>` en `libres`; la planta de cada sala (`Norte` 1, `Sur` 2); los dos mensajes de error (planta desconocida, falta el valor); `libres --planta <n>` sin franja.
- No entra: filtrar por planta en `reservar`, `cancelar` o `anular`; mostrar la planta en la salida; elegir la planta por nombre; persistir plantas fuera de `src/app.js`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Lista de salas `['Norte', 'Sur']` (pasa a salas con nombre y planta) | constante `rooms` de `src/app.js`, usada en `freeRooms` | Scope: se modifica en la Task 1 |
| Primer parámetro de `libres` = la franja (`params[0]`) | rama `libres` de `run` en `src/app.js`; test `libres excluye la sala reservada en la franja` | Scope: la franja pasa a ser el primer parámetro que no es `--planta` ni su valor; el test existente sigue valiendo sin cambios |

- Filas que implementa: 0012 (no tiene fila en el roadmap) → nada: comprobado con `git grep -nE "libres|planta"`, que solo encuentra `src/app.js`, `test/app.test.js` y la entrada de `changelog.md` de la 0006 (histórica, no se toca).

## Approach

La lista de salas pasa a llevar la planta de cada una. `run('libres', params)` extrae `--planta <n>` de `params`, deja el resto como parámetros posicionales (el primero es la franja) y filtra las salas libres por planta si la opción vino. Los errores se devuelven como texto, igual que `cancelar` devuelve `sin reserva …`.

## Dónde se prueba

- Filtro por planta, sin opción, opción antes o después de la franja, ninguna libre: por `run('libres', …)`, como el test actual de `test/app.test.js`.
- Planta desconocida y opción sin valor: por `run('libres', …)`, igual.

## Términos y ADR

- Términos resueltos: **planta** — nivel del edificio donde está una sala, un número entero; se añade a `PRODUCT.md` en el cierre
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Listar las salas libres de una franja

- GIVEN una reserva activa de `Norte` en 10:00-12:00 y `Sur` sin reservas
- WHEN se ejecuta `libres 10:00-12:00` (sin `--planta`)
- THEN responde `Sur`
- AND con `libres 14:00-16:00` responde `Norte, Sur`

#### ADDED — Filtrar libres por planta

- GIVEN `Norte` en la planta 1 y `Sur` en la planta 2, sin reservas en 14:00-16:00
- WHEN se ejecuta `libres 14:00-16:00 --planta 1`
- THEN responde `Norte`
- AND `libres 14:00-16:00 --planta 2` responde `Sur`
- AND `libres --planta 2 14:00-16:00` responde `Sur` (la opción puede ir antes de la franja)
- AND `libres --planta 2` (sin franja) responde `Sur`

#### ADDED — Planta sin salas libres

- GIVEN `Norte` en la planta 1 con una reserva activa en 10:00-12:00
- WHEN se ejecuta `libres 10:00-12:00 --planta 1`
- THEN responde la cadena vacía `""`

#### ADDED — Rechazar una planta inválida

- GIVEN las plantas 1 y 2
- WHEN se ejecuta `libres 14:00-16:00 --planta 9`
- THEN responde `planta desconocida: 9`
- AND `--planta abc` responde `planta desconocida: abc`, `--planta 1.5` responde `planta desconocida: 1.5` y `--planta 02` responde `planta desconocida: 02`

#### ADDED — Rechazar `--planta` sin valor

- GIVEN las plantas 1 y 2
- WHEN se ejecuta `libres 14:00-16:00 --planta` (la opción es el último parámetro)
- THEN responde `falta el valor de --planta`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: en memoria, en `src/app.js`: cada sala con su nombre y su planta
- **Idioma de los nombres**: castellano (`libres`, `--planta`, mensajes)
- **Límites**: las plantas válidas son exactamente `1` y `2`, escritas así; cualquier otro valor es `planta desconocida`
- **Avisos**: `planta desconocida: <n>` y `falta el valor de --planta`
- **Regla ante conflicto**: no aplica: una sala tiene una sola planta

## Enmiendas

(ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-06 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
