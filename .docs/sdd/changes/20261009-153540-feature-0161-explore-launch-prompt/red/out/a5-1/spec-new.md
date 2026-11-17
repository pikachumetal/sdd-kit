---
id: 20261010-114712-feature-0012-libres-por-planta
feature: 0012
title: Filtrar libres por planta
mode: full
profile: delegate
status: draft
created: 2026-10-10
author: <git-user>
approvers:
  - role: dev-lead
    name: <git-user>
    approved_at: null
---

# Spec — Filtrar libres por planta

🦆 Hoy, al pedir las salas libres de una franja salen las de todo el coworking; con esta feature puedes añadir la planta y salen solo las de ella. Por ejemplo, con Norte en la planta 1 y Sur en la 2, las libres de 14:00-16:00 en la planta 1 son solo «Norte», y sin indicar planta siguen saliendo «Norte, Sur». Si pides una planta que no existe, te avisa en vez de devolver una lista vacía que parecería «todo ocupado». Para ello cada sala pasa a saber en qué planta está, y el filtro se aplica sobre las salas que ya salían libres.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se acota por planta

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: contrato público (la interfaz de línea de comandos de `libres` gana una opción) · tamaño: ~15 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`) → 1 señal, por debajo del umbral de 4; no se despacha revisor.
- Mínimo razonable: ninguna review — deja sin mirar si las plantas de Norte y Sur (decisión 1) coinciden con las reales, que solo puedes confirmar tú.

1. **Plantas de las salas: Norte → planta 1, Sur → planta 2.** Nadie las dijo y hoy el código no guarda planta alguna (`rooms = ['Norte', 'Sur']`). Las he puesto en plantas distintas para que el filtro sea comprobable. **Corrígelas con las plantas reales** antes de aprobar.
2. **«Sin `--planta`, lista todas las salas» lo leo como «libres de todas las plantas»**: el comando sigue devolviendo las salas *libres* de la franja, de cualquier planta, exactamente como hoy. No devuelve las ocupadas.
3. **Forma de la opción: `--planta <número>`**, con espacio (no `--planta=2`), y puede ir antes o después de la franja (`libres 14:00-16:00 --planta 1` y `libres --planta 1 14:00-16:00` dan lo mismo).
4. **La planta es un número entero** (1, 2…), no un nombre.
5. **Planta sin salas libres: salida vacía**, igual que hoy cuando no queda ninguna libre.
6. **Planta que no existe o no es un número: error, no lista vacía.** Texto literal: `planta no válida: 9 (plantas: 1, 2)`; con `--planta abc`, `planta no válida: abc (plantas: 1, 2)`. Lo elegí así para que un typo no se confunda con «todo ocupado».
7. **`--planta` sin valor: error con el texto literal** `planta no válida: falta el número`.
8. **El formato de la salida no cambia** (nombres separados por «, »): no se muestra la planta de cada sala.
9. **Capacidad nueva `room-availability`** (no hay `capabilities/` todavía). Declaro como ADDED también el comportamiento que ya existía de `libres`, para que la capacidad nazca completa.
10. **Término**: «Planta» — piso del edificio donde está la sala; se evita «piso». Lo escribirá el cierre en `PRODUCT.md`.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas» (la lectura exacta, en la decisión 2)
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `libres <franja>` devuelve las salas libres de todo el coworking sin forma de acotar por planta, y cada sala no sabe en qué planta está. Con varias plantas, quien va a una reunión en la planta 1 tiene que filtrar a ojo. Se quiere poder pedir las libres de una planta concreta sin cambiar lo que devuelve hoy el comando sin esa opción.

## Scope

- Entra: dato de planta por sala; opción `--planta <número>` en `libres`; error ante planta inexistente o sin valor; tests.
- No entra: mostrar la planta en la salida; filtrar otros comandos (`reservar`, `cancelar`, `anular`) por planta; que `libres` considere el día (hoy solo mira la franja); nombres de planta que no sean números.

Archivos que lo implementan: `src/app.js` (datos de `rooms`, `freeRooms`, rama `libres` de `run`) y `test/app.test.js`.

## Approach

Cada sala pasa de ser un nombre a llevar también su planta. `libres` separa de sus argumentos la opción `--planta` y su valor; lo que queda es la franja. Si hay planta, valida que exista y filtra las salas libres de esa planta; si no, devuelve las libres de todas, como hoy.

## Dónde se prueba

- `libres` con y sin planta, y sus errores: por `run('libres', [...])`, como el test actual «libres excluye la sala reservada en la franja», en `test/app.test.js`.

## Términos y ADR

- Términos resueltos: Planta — piso del edificio donde está la sala (evitar «piso»)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

**ADDED — Libres de una franja**
- GIVEN Norte (planta 1) reservada de 10:00-12:00 y Sur (planta 2) sin reservas
- WHEN `libres 10:00-12:00`
- THEN la salida es `Sur`
- AND con `libres 14:00-16:00` la salida es `Norte, Sur`

**ADDED — Libres de una planta**
- GIVEN Norte (planta 1) reservada de 10:00-12:00 y Sur (planta 2) sin reservas
- WHEN `libres 14:00-16:00 --planta 1`
- THEN la salida es `Norte`
- AND `libres --planta 2 14:00-16:00` da `Sur` (la opción puede ir antes de la franja)
- AND `libres 10:00-12:00 --planta 1` da una salida vacía (Norte está reservada y es la única de la planta 1)

**ADDED — Planta no válida**
- GIVEN las plantas 1 y 2
- WHEN `libres 14:00-16:00 --planta 9`
- THEN la salida es `planta no válida: 9 (plantas: 1, 2)`
- AND con `--planta abc` es `planta no válida: abc (plantas: 1, 2)`
- AND con `libres 14:00-16:00 --planta` (sin valor) es `planta no válida: falta el número`

**Reglas de la capacidad**
- **Dónde viven los datos**: la planta de cada sala vive junto a la sala en `src/app.js`; las reservas siguen en memoria, sin persistencia.
- **Idioma de los nombres**: no aplica (los nombres de sala no cambian; los mensajes de error van en castellano, Art. 4 de la constitution).
- **Límites**: no aplica.
- **Avisos**: planta inexistente, no numérica o sin valor → `planta no válida: …` (textos en «Planta no válida»).
- **Regla ante conflicto**: no aplica.

## Enmiendas

- Ninguna.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | <git-user> | | pendiente |
