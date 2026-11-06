---
id: 20261106-114217-feature-0012-libres-por-planta
feature: 0012
title: Filtrar las salas libres por planta
mode: full
status: approved
created: 2026-11-06
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-06
---

# Spec — Filtrar las salas libres por planta

🦆 Hoy `libres 10:00-12:00` dice qué salas están libres en esa franja, sin importar en qué planta están. Con el cambio, `libres 10:00-12:00 --planta 2` solo enseña las libres de la planta 2: con Norte en la 1 y Sur en la 2, y Norte reservada de 10:00 a 12:00, da `Sur`; con `--planta 1` no da nada. Sin `--planta` todo sigue igual: lista todas las salas libres. Para que haya plantas, cada sala pasa a llevar la suya (Norte 1, Sur 2: un valor mío).

Validación: dev-lead — es la salida de un comando que usa una persona; la frase de delegación no nombra al agente como validador.

## Capacidades

- Nuevas: `room-availability` — qué salas hay libres en una franja y cómo se filtran.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos, más una segunda ronda por un Crítico aceptado — señales: capacidad nueva (`room-availability`), dato nuevo (la planta de cada sala, en memoria) · tamaño: ~40 líneas en 4 ficheros (`src/app.js`, `test/app.test.js`, `PRODUCT.md`, la spec)
- Único (sonnet): si los escenarios fijan el orden de `--planta` respecto a la franja y los casos sin valor, y si «planta» choca con algún término de `PRODUCT.md` (señal: capacidad nueva + dato nuevo)
- Mínimo razonable: sin revisor — deja sin mirar los huecos de entrada de `--planta` (sin valor, repetida, no numérica), que son lo que más se escapa a quien escribe la spec
- Contrato público: el CLI lo usa solo su dueño (misión: «No hay más usuarios»), por eso no cuenta como señal y baja a un revisor.

1. **Enfoque elegido** (en `delegate` no hay mensaje de enfoques): la planta es un campo `planta` de cada sala en `src/app.js` (cada elemento de `rooms` pasa de texto a `{ name, planta }`) y `libres` filtra por él. Descartados: una tabla aparte sala→planta (dos sitios que mantener para dos salas) y deducir la planta del nombre de la sala (no hay regla que lo permita).
2. Norte está en la planta 1 y Sur en la 2 — nadie dijo en qué planta está cada sala; es el dato inventado de los ejemplos y del código.
3. La planta es un entero sin signo y se escribe `--planta 2` (con espacio) — es la forma de las demás opciones (`--cada-semana`) y el nombre de la opción lo fijó el dev-lead.
4. `--planta` vale antes o después de la franja (`libres --planta 2 10:00-12:00` y `libres 10:00-12:00 --planta 2` dan lo mismo) — hoy la franja es el primer argumento y no quiero que escribir la opción antes la rompa. La franja es el primer argumento que no es `--planta` ni su valor.
5. Una planta donde no queda ninguna sala libre, o donde no hay salas (`--planta 9`), da la salida vacía, igual que hoy cuando no queda ninguna libre — no inventar un mensaje ni validar que la planta exista.
6. `--planta` sin valor, con un valor que no es un entero sin signo (`abc`, `2.5`, `-1`), seguido de la franja (`--planta 10:00-12:00`) o escrito `--planta=2` da el texto `falta el número de planta` y no lista nada — listar todas en silencio engañaría a quien creyó filtrar; el texto es mío. Con `--planta` repetida decide la última: `--planta 2 --planta` da el aviso.
7. Capacidad nueva `room-availability` (inglés kebab-case): hoy no hay `capabilities/`, y la spec documenta también el comportamiento de `libres` sin filtro para que el escenario «sin --planta» tenga dónde apoyarse.
8. Término nuevo «Planta» en `PRODUCT.md` (_Evitar_: piso), lo escribe el cierre — es vocabulario del producto que hoy no está.
9. `libres` no mira el día: una reserva activa en la franja, de cualquier día, deja la sala ocupada. Es lo que hace hoy (`freeRooms` solo compara la franja); no lo cambio aquí y el escenario base lo documenta así.
10. El aviso sale por la misma salida y con el mismo código que cualquier otra respuesta de `libres`; no hay stderr ni código de error nuevos — el programa hoy imprime todo con `console.log`.
11. Sin franja, `libres` sigue como hoy (lista todas, porque ninguna reserva tiene franja vacía) y `libres --planta 2` da `Sur`.
12. Repaso de coherencia: `git grep` de `libres` y `planta` fuera de `.docs/sdd/specs/` solo encuentra los sitios de la tabla de abajo; el delta, probado en una copia de `.docs/sdd` con `sdd capability merge` tras los cambios de la review, termina sin rechazos: cinco requisitos y cinco reglas añadidos.
- Política de modelos: un revisor de spec en sonnet, más una segunda ronda en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (el plan dice `no`) · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

### Hallazgos de la review

- **Aceptado** — Crítico: el escenario base hablaba de «el lunes» pero `libres` no recibe día → GIVEN sin día y decisión 9.
- **Aceptado** — `libres` sin escenario de varias salas ni formato de salida → `libres 12:00-14:00` da `Norte, Sur` y la nota del delta dice cómo se separan.
- **Aceptado** — `--planta 10:00-12:00` consume la franja como valor → aviso, escenario y decisión 6.
- **Aceptado** — valores no numéricos, repetida, sin valor y límites «no aplica» contradictorio → decisión 6, escenarios y reglas de la capacidad (Límites y Regla ante conflicto).
- **Aceptado** — canal y código de salida del aviso → decisión 10.
- **Aceptado** — política de review mezclada y conteos desfasados → un solo bloque de review y sin conteos en la decisión 12.
- **Aceptado** — Segunda ronda, Crítico: `2.5` y `-1` sin escenario, `--planta 2 --planta` sin definir, `--planta=2` sin THEN, sin franja sin escenario, y un caso que pruebe que el filtro filtra con ambas libres → escenarios añadidos y decisiones 6 y 11.
- **Aceptado** — nombre del campo y forma de `rooms` → decisión 1 y Scope.
- **Aceptado** — numeración de las decisiones → reordenadas del 1 al 12.
- **Rechazado** — «Planta» sin tarea que lo verifique (Menor) → lo escribe el cierre (`sdd-archive`) y el dev-lead lo ve en el diff de `PRODUCT.md`; no es paso de ninguna task del plan.
- **Rechazado** — `status: approved` antes de la review (Menor) → la spec se aprueba por delegación del dev-lead, que pidió escribir spec y plan sin pausa; la review corrió antes de escribir el plan y cerró con esta versión.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»
- Spec aprobada por delegación; se escribe el plan y se para antes de implementar — «Apruebo la spec por delegación, nos vemos en la validación: escribe la spec y el plan y para antes de implementar»

## Intent

Hoy `libres <franja>` lista las salas libres de todo el edificio. Quien está en una planta y quiere una sala sin cambiar de piso tiene que leer la lista entera y saber de memoria dónde está cada una. Con `--planta` la lista llega ya filtrada. Éxito: `libres 10:00-12:00 --planta 2` solo da salas de la planta 2 y `libres 10:00-12:00` da exactamente lo que da hoy. Fracaso aunque funcione: que cambie la salida sin `--planta`, o que un `--planta` mal escrito parezca un filtro aplicado y liste todo.

## Scope

- Entra: la planta de cada sala como dato (cada sala de `rooms` pasa a `{ name, planta }`); la opción `--planta <n>` de `libres`; el término «Planta» en `PRODUCT.md`.
- No entra: reservar o cancelar por planta; mostrar la planta en la salida; validar que la planta exista; filtrar por otra cosa (capacidad, equipo).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira: `libres <franja>` sin opción queda igual; `rooms` cambia de forma interna | `src/app.js:2` (`rooms`), `src/app.js:28`, `test/app.test.js:5`, `.docs/sdd/changelog.md:10` | delta, escenario «Libres por franja»; el changelog describe lo ya entregado y no cambia |

- Filas que implementa: nada: comprobado con `git grep -niE "libres|planta"` fuera de `.docs/sdd/specs/`; los únicos sitios son los de la tabla.

## Approach

Cada sala lleva su planta (Norte 1, Sur 2). `libres` separa de sus argumentos la opción `--planta` y su valor; lo que queda es la franja. Si hay `--planta`, solo pasan las salas de esa planta y libres en la franja; si no, todas las libres, como hoy.

## Dónde se prueba

- `libres` con y sin `--planta`, con la opción antes y después de la franja, sin valor, no numérica, repetida, sin franja: por `run('libres', …)`, como los tests actuales de `test/app.test.js`; sin capturas, es texto de consola.

## Términos y ADR

- Términos resueltos: Planta — el piso del edificio donde está una sala (_Evitar_: piso)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

> «Libres por franja» solo documenta lo que `libres` ya hace hoy y no lo cambia: `libres` no mira el día, una reserva activa en la franja, de cualquier día, deja la sala ocupada; las libres salen separadas por coma y espacio.

#### ADDED — Libres por franja

- GIVEN las salas Norte (planta 1) y Sur (planta 2), y Norte con una reserva activa en 10:00-12:00
- WHEN se pide `libres 10:00-12:00`
- THEN la salida es `Sur`
- AND con `libres 12:00-14:00` la salida es `Norte, Sur`
- AND con `libres` sin franja la salida es `Norte, Sur`

#### ADDED — Filtrar libres por planta

- GIVEN las salas Norte (planta 1) y Sur (planta 2), y Norte con una reserva activa en 10:00-12:00
- WHEN se pide `libres 10:00-12:00 --planta 2`
- THEN la salida es `Sur`
- AND con `libres 10:00-12:00 --planta 1` la salida es vacía
- AND con `libres 12:00-14:00 --planta 1` la salida es `Norte`
- AND con `libres --planta 2 10:00-12:00` la salida es `Sur`
- AND con `libres --planta 2` sin franja la salida es `Sur`

#### ADDED — Planta sin salas libres o inexistente

- GIVEN las salas Norte (planta 1) y Sur (planta 2)
- WHEN se pide `libres 10:00-12:00 --planta 9`
- THEN la salida es vacía

#### ADDED — Planta sin valor o que no es un número

- GIVEN las salas Norte (planta 1) y Sur (planta 2)
- WHEN se pide `libres 10:00-12:00 --planta`
- THEN la salida es `falta el número de planta`
- AND con `libres 10:00-12:00 --planta abc` la salida es `falta el número de planta`
- AND con `libres 10:00-12:00 --planta 2.5` la salida es `falta el número de planta`
- AND con `libres 10:00-12:00 --planta -1` la salida es `falta el número de planta`
- AND con `libres --planta 10:00-12:00` la salida es `falta el número de planta`
- AND con `libres 10:00-12:00 --planta=2` la salida es `falta el número de planta`

#### ADDED — Planta repetida

- GIVEN las salas Norte (planta 1) y Sur (planta 2), y Norte con una reserva activa en 10:00-12:00
- WHEN se pide `libres 10:00-12:00 --planta 1 --planta 2`
- THEN la salida es `Sur`
- AND con `libres 10:00-12:00 --planta 2 --planta` la salida es `falta el número de planta`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: la planta es el campo `planta` de cada sala en `src/app.js`, en memoria como las reservas
- **Idioma de los nombres**: castellano (`--planta`)
- **Límites**: el valor de `--planta` es un entero sin signo (`0`, `1`, `2`…); cualquier otra cosa cuenta como «sin número»; no se comprueba que la planta exista
- **Avisos**: `falta el número de planta` cuando `--planta` no trae un entero sin signo o se escribe `--planta=<n>`; sale por la misma salida que el resto de respuestas de `libres`, sin cambiar nada más
- **Regla ante conflicto**: con `--planta` repetida decide la última

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-06 | aprobada: «Apruebo la spec por delegación, nos vemos en la validación: escribe la spec y el plan y para antes de implementar» |
