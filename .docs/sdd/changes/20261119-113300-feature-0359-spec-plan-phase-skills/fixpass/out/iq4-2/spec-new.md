---
id: 20261119-175857-feature-0012-aviso-sala-ocupada
feature: 0012
title: Aviso de sala muy ocupada
mode: full
profile: delegate
status: approved
created: 2026-11-19
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-19
---

# Spec — Aviso de sala muy ocupada

🦆 Hoy `salas libres 10:00-12:00` solo dice qué salas están libres. Con este cambio, si una sala acumula 3 o más reservas activas, la salida añade una línea: `aviso: Norte muy ocupada (3 reservas activas)`. Las canceladas y anuladas no cuentan. Se implementa contando las reservas activas de cada sala al listar.

Validación: dev-lead — es salida de la terminal que lee una persona, y el umbral y el texto del aviso son decisiones mías sin confirmar.

## Capacidades

- Nuevas: `room-occupancy` — aviso al usuario cuando una sala acumula muchas reservas activas.

## ✋ Decisiones que he tomado yo — valida estas

Nadie respondió a la entrevista (spec aprobada por delegación): todo lo de abajo es mío y está **pendiente** de que lo confirmes en la validación.

1. **Qué es «muy ocupada»** — pendiente: 3 o más reservas activas de la sala. Es mi valor; la petición no dio ninguno.
2. **Cuenta global, no por día** — pendiente: se cuentan todas las reservas activas de la sala, porque `libres` recibe solo la franja, sin día, y así no cambia su sintaxis.
3. **Dónde sale el aviso** — pendiente: como líneas extra de `libres`, después del listado, una por sala. No creo comando nuevo ni toco `reservar`, que hoy no crea reservas sueltas.
4. **Texto del aviso** — pendiente: `aviso: <sala> muy ocupada (<n> reservas activas)`.
5. **Alcance del aviso** — pendiente: se avisa de toda sala muy ocupada, esté libre en la franja o no.
6. **Sin correo ni otro canal** — pendiente: el aviso es solo texto en la terminal; la 0008 (avisos por correo) es otra fila.
7. **Capacidad nueva `room-occupancy`** — su slug en inglés kebab-case, a aprobar con la spec (regla 1 de `capability-template.md`).
8. **Carpeta** — `.docs/sdd/changes/` por convención del kit; las specs anteriores del proyecto siguen en `specs/` y no las muevo.
9. **Revisión de la spec** — decidida por mí sin revisores: el cambio es de una función y un umbral, sin migración ni superficie nueva; la opción mínima deja sin cubrir una lectura independiente de la spec.
10. **Enfoque**: A, frente a B y C (ver Approach).
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.
- `capability merge` sobre una copia de `.docs/sdd`: 3 requisitos y 5 reglas añadidos a `room-occupancy.md`, rc=0.

### Decisiones tomadas con el dev-lead

- Aprobar la spec sin esperar — «Apruebo la spec por delegación, nos vemos en la validación»
- Perfil `delegate` — viene del proyecto (`sdd-kit.json`)

## Intent

Hoy `libres` solo dice qué salas están libres en una franja; quien reserva no se entera de que una sala está casi siempre ocupada. Se quiere que la terminal avise cuando una sala acumula muchas reservas activas. Éxito: con Norte a 3 reservas activas, `libres` lo dice; con 2, la salida no cambia. Anti-goal: que el aviso rompa el listado existente (`Sur` sigue saliendo como hoy cuando no hay sala muy ocupada).

## Scope

- Entra: aviso en la salida de `libres`; umbral de 3 reservas activas; capacidad `room-occupancy`.
- No entra: avisos por correo (fila 0008), comando nuevo, umbral configurable, conteo por día, avisos al reservar o cancelar.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Salida de `libres`: ahora puede llevar líneas `aviso:` tras el listado | `src/app.js` (`run`), `test/app.test.js`, `CHANGELOG.md:10` | Scope y delta `ADDED`; la salida sin aviso no cambia, el test existente sigue valiendo; el CHANGELOG lo escribe el cierre de la release |

- Filas que implementa: nada: comprobado con `git grep -n -i -E "libres|ocupad" -- . ':!src' ':!test'`, que solo da `CHANGELOG.md:10`.

## Approach

- A. Contar al listar en `libres`: una función pura `busyRooms()` sobre `bookings`, y `run('libres')` añade las líneas — un cambio pequeño en `src/app.js`, se prueba por `run`.
- B. Comando nuevo `ocupacion` — más superficie y quien reserva tendría que preguntar a propósito, justo lo contrario de un aviso.
- C. Avisar al reservar — `reservar` hoy no crea reservas sueltas; habría que construir esa función antes.
- Elegido: A — es lo único que avisa sin que nadie lo pida y sin construir lo que no existe.

El umbral vive como constante con nombre en `src/app.js`. Solo cuentan reservas con `status: 'active'`.

## Dónde se prueba

- Aviso con 3 reservas activas, sin aviso con 2, y canceladas que no cuentan: `run('libres', …)` en `test/app.test.js`, como el test actual de `libres`; el plan decide cómo sembrar las reservas.
- Salida sin aviso sin cambios: el test actual de `libres`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-occupancy`

#### ADDED — Aviso de sala muy ocupada

- GIVEN Norte con 3 reservas activas (lun, mar, mié) y Sur con ninguna
- WHEN se ejecuta `libres 10:00-12:00`
- THEN la salida es `Sur` y, en una línea aparte, `aviso: Norte muy ocupada (3 reservas activas)`

#### ADDED — Sin aviso por debajo del umbral

- GIVEN Norte con 2 reservas activas
- WHEN se ejecuta `libres 10:00-12:00`
- THEN la salida no contiene ninguna línea `aviso:`

#### ADDED — Las reservas no activas no cuentan

- GIVEN Norte con 2 reservas activas y 1 cancelada
- WHEN se ejecuta `libres 10:00-12:00`
- THEN la salida no contiene ninguna línea `aviso:`

#### Reglas de la capacidad — room-occupancy

- **Dónde viven los datos**: memoria; las reservas de la lista `bookings` de `src/app.js`.
- **Idioma de los nombres**: castellano en los mensajes; el comando sigue siendo `libres`.
- **Límites**: muy ocupada = 3 o más reservas activas de la sala, contadas sin distinguir día.
- **Avisos**: `aviso: <sala> muy ocupada (<n> reservas activas)`, una línea por sala, en la salida de `libres`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-19 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
