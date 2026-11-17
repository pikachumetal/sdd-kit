---
id: 20261106-114953-feature-0012-libres-por-planta
feature: 0012
title: Filtrar salas libres por planta
mode: full
profile: delegate
status: approved
created: 2026-11-06
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-06
---

# Spec — Filtrar salas libres por planta

🦆 Hoy `libres 10:00-12:00` lista las salas libres en esa franja y no dice en qué planta está cada una. Con el cambio, `libres 10:00-12:00 --planta 2` solo enseña las libres de la planta 2 (`Sur`), y sin `--planta` todo sigue igual (`Sur`). Por dentro, cada sala pasa a tener una planta y el listado filtra por ella antes de excluir las reservadas.

Validación: dev-lead — cambia lo que se ve en la salida de `libres`; el agente no lo da por bueno solo (la frase de delegación no nombra `agente`).

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~30 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Revisor único (sonnet, siete puntos): si los dos requisitos nuevos de `room-availability` cubren lo que el Intent promete sin dejar fuera el caso «planta sin salas libres» (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar si el THEN de planta desconocida contradice el de planta sin libres, el tipo de hueco que no se ve hasta usar el comando

1. Plantas de las salas: `Norte` en la planta 1 y `Sur` en la planta 2 — nadie dijo en qué planta está cada sala; son datos de ejemplo que hay que corregir si la realidad es otra.
2. Forma del comando: `libres <franja> --planta <n>`; la franja sigue siendo el primer argumento y la opción va después — respeta cómo se lee hoy `params[0]`.
3. Valor de `--planta`: un número entero de planta (`1`, `2`); se compara por igualdad exacta.
4. Planta sin ninguna sala (`--planta 9`): responde `planta desconocida: 9`, para distinguirlo de «planta existente sin libres».
5. Planta existente sin salas libres en la franja: salida vacía, igual que hoy cuando no queda ninguna libre — no cambia el formato.
6. `--planta` sin valor: responde `falta el número de planta` — evita filtrar por `undefined` sin avisar.
7. Capacidad nueva `room-availability` — hoy `libres` no tiene capacidad; el filtro nuevo y el comportamiento sin filtro (que antes no estaba escrito) van juntos para no dejar un requisito sin dueño.
8. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` añade los requisitos a `room-availability.md` sin rechazos (resultado de la primera versión, con tres; la separación posterior a cinco no cambia su forma).
9. Un valor de `--planta` que no es una planta existente (`9`, `abc`, `0`, `2.5`, `-1`) cae en `planta desconocida: <valor>`: una sola regla, sin validar que sea entero.
10. Orden de las comprobaciones: primero `falta el número de planta`, después `planta desconocida`; la franja no se valida (ya es deuda técnica del roadmap).
11. Orden invertido (`libres --planta 2 10:00-12:00`), `--planta` repetida y otras opciones quedan sin definir: no se soportan ni se prueban.
- Política de modelos: un revisor de spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Hallazgos de la review

- **Aceptado** — tres ADDED en uno solo y recuento incoherente → el tercero se divide en tres (planta sin libres, desconocida, sin valor) y se unifica el recuento.
- **Aceptado** — `libres` sin filtro declarado como ADDED sin avisar → nota de que recoge lo que ya hace, comprobado con el código de hoy.
- **Rechazado** — plantas de `Norte` y `Sur` sin confirmar → ya son la decisión 1 de ✋, que es lo que el dev-lead valida; parametrizarlas no aporta (los escenarios dicen sus plantas en el GIVEN).
- **Aceptado** — valores no enteros sin regla → decisión 9 (`planta desconocida`) y un AND en «Planta desconocida».
- **Aceptado** — orden invertido, opción repetida u otras opciones → decisión 11 y «No entra».
- **Aceptado** — prioridad entre avisos y franja inválida → decisión 10.
- **Rechazado** — status `approved` con review pendiente → la review ya está recogida aquí; la aprobación es por delegación (2026-11-06).
- **Aceptado** — decisión 8 como afirmación sin evidencia → queda con su resultado literal.
- **Aceptado** — sin filtro no figura en «Dónde se prueba» → añadido.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»
- Spec aprobada por delegación (2026-11-06) — «Apruebo la spec por delegación, nos vemos en la validación: escribe la spec y el plan y para antes de implementar»

## Intent

Hoy `libres <franja>` lista las salas libres sin decir en qué planta están. Quien reserva en una planta concreta tiene que descartar a ojo las demás. Éxito: `libres 10:00-12:00 --planta 2` devuelve solo las libres de la planta 2, y `libres 10:00-12:00` devuelve lo mismo que hoy. Fracaso aunque «funcione»: que sin `--planta` cambie la salida actual.

## Scope

- Entra: opción `--planta <n>` en `libres`; cada sala con su planta; avisos de planta desconocida y de falta de valor.
- No entra: mostrar la planta en la salida; filtrar `reservar` o `cancelar`; cargar las plantas desde fuera del código; orden invertido de argumentos, `--planta` repetida u otras opciones.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` como lista de nombres | `src/app.js:2`, `src/app.js:5-6` | Scope: cada sala gana su planta; lo resuelve el plan |

- Filas que implementa: 0012 → nada: comprobado con `git grep -nE "0012|libres|freeRooms" -- . ':!.docs/sdd/specs'`; `changelog.md:10` cita `libres` y no cambia (su entrada es de v0.3.0).

## Approach

Cada sala tiene una planta (decisión 1) y `libres` filtra por planta antes de excluir las reservadas en la franja. Alternativas descartadas: filtrar después de excluir (mismo resultado, y el aviso de planta desconocida exigiría volver a recorrer las salas); un comando nuevo `libres-planta` (duplica el comando y rompe el nombre que ya conoce el usuario).

## Dónde se prueba

- `libres` sin `--planta` (regresión: misma salida que hoy), con `--planta`, planta sin libres, planta desconocida y falta de valor: por `run('libres', […])`, como los tests actuales de `test/app.test.js`.

## Términos y ADR

- Términos resueltos: planta — nivel del edificio donde está una sala
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres sin filtro de planta

> Recoge el comportamiento que `libres` ya tiene hoy (comprobado: `node src/app.js libres 10:00-12:00` → `Sur`); no cambia nada de lo que hace.

- GIVEN `Norte` (planta 1) con reserva activa de 10:00-12:00 y `Sur` (planta 2) sin reservas
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`

#### ADDED — Libres filtradas por planta

- GIVEN `Norte` (planta 1) y `Sur` (planta 2), ambas sin reservas a las 14:00-16:00
- WHEN `libres 14:00-16:00 --planta 2`
- THEN responde `Sur`
- AND `libres 14:00-16:00 --planta 1` responde `Norte`

#### ADDED — Planta sin salas libres

- GIVEN `Norte` (planta 1) con reserva activa de 10:00-12:00
- WHEN `libres 10:00-12:00 --planta 1`
- THEN responde cadena vacía

#### ADDED — Planta desconocida

- GIVEN `Norte` (planta 1) y `Sur` (planta 2)
- WHEN `libres 10:00-12:00 --planta 9`
- THEN responde `planta desconocida: 9`
- AND `libres 10:00-12:00 --planta abc` responde `planta desconocida: abc`

#### ADDED — Planta sin valor

- GIVEN `Norte` (planta 1) y `Sur` (planta 2)
- WHEN `libres 10:00-12:00 --planta`
- THEN responde `falta el número de planta`

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-06 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación: escribe la spec y el plan y para antes de implementar» |
