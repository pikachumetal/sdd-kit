---
id: 20261011-132524-feature-0012-informes
feature: 0012
title: Informes de ocupación de salas
mode: full
profile: delegate
status: draft
created: 2026-10-11
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Informes de ocupación de salas

🦆 Con `informes` ves, en una sola salida, cuántas reservas tiene cada sala, qué días de la semana se usa más, qué franjas se reservan más y qué salas nadie ha reservado. Por ejemplo, con una reserva en Norte el lunes de 10:00-12:00, `informes` enseña `Norte | 1` y `Sur | 0`, el lunes con 1 reserva, la franja 10:00-12:00 con 1 y `Sur` como sala sin reservar. `informes --sala Norte` enseña lo mismo pero solo de Norte. Si no hay reservas, cada una de las cuatro vistas dice «sin reservas». Es una orden nueva que solo lee las reservas: no cambia nada.

## Capacidades

- Nuevas: `booking-reports` — los cuatro informes de ocupación del comando `informes` y su filtro por sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva · tamaño: ~60 líneas en 2 ficheros (`src/app.js` y un test nuevo)
- Mínimo razonable: ninguna — no hay contrato que consuma otro sistema ni datos persistentes; lo que queda sin mirar es el reparto de decisiones de abajo, que valida el dev-lead.

1. **Capacidad nueva `booking-reports`** (inglés, kebab-case): hoy no hay `capabilities/` y los informes no encajan en ninguna existente.
2. **Qué cuenta como reserva**: solo las `active`. Las canceladas y anuladas no ocupan la sala, igual que en `libres`.
3. **Formato de la tabla**: cada vista es una línea de título, una línea de cabecera y una fila por elemento, con las columnas separadas por ` | `; las vistas van separadas por una línea en blanco. Los títulos y cabeceras literales están en los THEN.
4. **Orden**: ocupación por sala, en el orden de las salas del producto (Norte, Sur); por día, de lunes a domingo; franjas, de más a menos reservas y, a igualdad, por franja ascendente; salas sin reservar, en el orden de las salas.
5. **Qué lista cada vista**: ocupación por sala lista todas las salas, también las de 0 reservas; ocupación por día y franjas solo listan lo que tiene al menos una reserva; franjas lista todas, sin tope («las 3 primeras» no lo fijó nadie).
6. **Nombres de día**: los de los datos actuales, `lun mar mie jue vie sab dom`, sin tildes.
7. **«Sin reservas»** significa que, tras aplicar `--sala`, no queda ninguna reserva activa: entonces las cuatro vistas dicen «sin reservas», también «salas sin reservar» (con cero reservas todas las salas estarían sin reservar y listarlas es ruido). Con alguna reserva, «salas sin reservar» sin elementos dice `ninguna`.
8. **`--sala` con una sala que no existe** (`--sala Este`): `sala desconocida: Este`, sin vistas. El nombre se compara tal cual, con la mayúscula de `rooms`.
9. **`--sala` sin valor**: `falta el nombre de la sala`, sin vistas.
10. **`--sala` y «salas sin reservar»**: el filtro nunca saca otra sala a esa vista; con `--sala Sur` y Sur con reservas, dice `ninguna`.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas, salas que nadie ha reservado) — entrevista previa.
- Una opción `--sala` que filtra las cuatro vistas — entrevista previa.
- La salida es una tabla de texto — entrevista previa.
- Sin reservas, cada vista dice «sin reservas» — entrevista previa.
- Perfil `delegate` — entrevista previa.

## Intent

Hoy el producto solo responde a «qué salas están libres en una franja». No se puede ver cómo se usan las salas en conjunto: cuáles se llenan, qué días y a qué horas. `informes` lo enseña desde la terminal, sin tocar las reservas.

## Scope

- Entra: el comando `informes`, sus cuatro vistas, la opción `--sala <nombre>` y los dos avisos de error de la opción.
- No entra: exportar a fichero o `.ics`, filtrar por día o por franja, rangos de fechas, ordenar a gusto del usuario, informes de canceladas o anuladas, cambiar `libres`, `reservar`, `cancelar` o `anular`.
- Ficheros que lo implementan: `src/app.js` (la función `run` y las vistas) y un test nuevo, `test/informes.test.js`.

## Approach

El comando lee las reservas activas (filtradas por `--sala` si viene), las cuenta por sala, por día y por franja, y arma las cuatro vistas en texto. Las vistas son independientes entre sí salvo en la regla de «sin reservas», que se decide una vez para todas. Nada se escribe en las reservas.

## Dónde se prueba

- Las cuatro vistas, el filtro y los avisos: por `run('informes', [...])`, como los tests actuales de `libres` y `cancelar`, en `test/informes.test.js`. Cómo fija el test varias reservas es contenido del plan.

## Términos y ADR

- Términos resueltos: **informe** — cada una de las cuatro vistas del comando `informes`; **franja** — el rango horario de una reserva, como `10:00-12:00`.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `booking-reports`

**ADDED — Ocupación por sala**
- GIVEN reservas activas: Norte lun 10:00-12:00, Norte mar 10:00-12:00, Sur lun 14:00-16:00
- WHEN `informes`
- THEN la primera vista es:
  ```
  Ocupación por sala
  sala | reservas
  Norte | 2
  Sur | 1
  ```
- AND una sala sin reservas aparece con `0` (con solo reservas en Norte, `Sur | 0`).

**ADDED — Ocupación por día de la semana**
- GIVEN las mismas reservas
- WHEN `informes`
- THEN la segunda vista es:
  ```
  Ocupación por día
  día | reservas
  lun | 2
  mar | 1
  ```
- AND solo aparecen los días con al menos una reserva, de lunes a domingo.

**ADDED — Franjas más reservadas**
- GIVEN reservas activas: Norte lun 10:00-12:00, Norte mar 10:00-12:00, Sur lun 14:00-16:00
- WHEN `informes`
- THEN la tercera vista es:
  ```
  Franjas más reservadas
  franja | reservas
  10:00-12:00 | 2
  14:00-16:00 | 1
  ```
- AND ante igual número de reservas, por franja ascendente; sin tope de filas.

**ADDED — Salas sin reservar**
- GIVEN una única reserva activa: Norte lun 10:00-12:00
- WHEN `informes`
- THEN la cuarta vista es:
  ```
  Salas sin reservar
  sala
  Sur
  ```
- AND si todas las salas tienen alguna reserva, la vista dice `ninguna` en lugar de las filas.

**ADDED — Solo cuentan las reservas activas**
- GIVEN Norte lun 10:00-12:00 activa, Norte mar 10:00-12:00 cancelada, Sur lun 14:00-16:00 anulada
- WHEN `informes`
- THEN la ocupación por sala es `Norte | 1` y `Sur | 0`, y la única franja es `10:00-12:00 | 1`.

**ADDED — Filtrar por sala**
- GIVEN reservas activas: Norte lun 10:00-12:00, Norte mar 10:00-12:00, Sur lun 14:00-16:00
- WHEN `informes --sala Norte`
- THEN las cuatro vistas cuentan solo las reservas de Norte: ocupación por sala solo `Norte | 2`; por día `lun | 1` y `mar | 1`; franjas `10:00-12:00 | 2`; y salas sin reservar `ninguna`.

**ADDED — Sin reservas**
- GIVEN ninguna reserva activa (o ninguna en la sala filtrada, p. ej. `informes --sala Sur` con solo Norte reservada)
- WHEN `informes`
- THEN la salida es:
  ```
  Ocupación por sala
  sin reservas

  Ocupación por día
  sin reservas

  Franjas más reservadas
  sin reservas

  Salas sin reservar
  sin reservas
  ```

**ADDED — Sala del filtro desconocida o sin nombre**
- GIVEN las salas Norte y Sur
- WHEN `informes --sala Este`
- THEN la salida es `sala desconocida: Este`, sin vistas.
- AND con `informes --sala` (sin nombre) la salida es `falta el nombre de la sala`, sin vistas.

**Reglas de la capacidad**
- **Dónde viven los datos**: no aplica; el informe solo lee las reservas en memoria que ya existen.
- **Idioma de los nombres**: títulos, cabeceras y avisos en castellano, como dice la constitution.
- **Límites**: sin tope de filas.
- **Avisos**: `sin reservas`, `ninguna`, `sala desconocida: <nombre>`, `falta el nombre de la sala`.
- **Regla ante conflicto**: no aplica; el informe no escribe.

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
