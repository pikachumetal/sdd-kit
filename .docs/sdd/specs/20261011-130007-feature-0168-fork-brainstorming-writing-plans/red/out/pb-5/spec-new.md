---
id: 20261011-132947-feature-0013-informes
feature: 0013
title: Informes de ocupación de las salas
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

# Spec — Informes de ocupación de las salas

🦆 Hoy solo se puede reservar y cancelar; no hay forma de ver cómo se usan las salas. Con `informes` sale una tabla de texto con cuatro vistas: reservas por sala, por día de la semana, franjas más reservadas y salas que nadie ha reservado. Ejemplo: con una reserva de Norte el lunes de 10:00 a 12:00, «Norte» sale con 1, «lun» con 1 y «Sur» aparece entre las salas sin reservar. `--sala Norte` limita las cuatro vistas a esa sala, y si no hay reservas cada vista dice «sin reservas».

## Capacidades

- Nuevas: `reports` — informes de ocupación de las salas a partir de las reservas activas.
- Modificadas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`reports`); una señal de ocho, por debajo del umbral de cuatro · tamaño: ~60 líneas en 2 ficheros (`src/app.js` y un test nuevo)
- Mínimo razonable: ninguna — deja sin cubrir solo la lectura de otra persona; la pasada de coherencia la he hecho yo.

1. **Capacidad nueva `reports`** (slug en inglés, kebab-case): no hay capacidades en `capabilities/` y el informe es un sustantivo del dominio propio.
2. **Nombre y forma del comando**: `node src/app.js informes [--sala <nombre>]`; `informes` y `--sala` son literales vuestros, el resto de la sintaxis es mía.
3. **«Ocupación» = número de reservas activas**, no porcentaje: el modelo no tiene horas de apertura contra las que medir un porcentaje. Las reservas canceladas o anuladas (`status` distinto de `active`) no cuentan en ninguna vista.
4. **Forma de la tabla**: título de la vista, fila de cabecera y una fila por elemento, columnas separadas por ` | ` y rellenadas con espacios al ancho de la más larga; una línea en blanco entre vistas. Orden y títulos de las vistas: `Ocupación por sala`, `Ocupación por día`, `Franjas más reservadas`, `Salas sin reservar`. Cabeceras: `sala | reservas`, `día | reservas`, `franja | reservas`, `sala`.
5. **Ocupación por sala** lista todas las salas, también las que tienen 0, en el orden de `rooms` (Norte, Sur).
6. **Ocupación por día** lista siempre los siete días, también con 0, en el orden `lun mar mie jue vie sab dom`. Solo `lun` existe hoy en el código; el resto de abreviaturas son suposición mía.
7. **Franjas más reservadas** lista solo las franjas con al menos una reserva, de más a menos reservas y, a igualdad, por franja en orden alfabético. Sin tope de filas.
8. **Salas que nadie ha reservado**: las salas con 0 reservas activas. Si todas tienen, dice `ninguna`.
9. **«sin reservas»**: una vista dice `sin reservas` en lugar de su tabla cuando no hay ninguna reserva activa dentro del ámbito (todas las salas, o la de `--sala`). Incluye la vista de salas sin reservar: con el sistema vacío no lista Norte y Sur, dice `sin reservas`. Es mi lectura de vuestra frase y tiene esa consecuencia: con `--sala Sur` y Sur sin reservas, esa vista dice `sin reservas`, no `Sur`.
10. **Sala desconocida**: `--sala Este` responde `sala desconocida: Este` en lugar de las vistas. `--sala` sin nombre responde `falta el nombre de la sala`. El nombre de la sala se compara exacto, con mayúsculas.
11. **Solo lectura**: `informes` no modifica ninguna reserva.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — entrevista con el dev-lead.
- Una opción `--sala` que filtra las cuatro vistas — entrevista con el dev-lead.
- Salida en tabla de texto — entrevista con el dev-lead.
- Sin reservas, cada vista dice «sin reservas» — entrevista con el dev-lead.
- El plan sale en 5 tasks: una por vista y otra para `--sala` — entrevista con el dev-lead.
- Perfil `delegate` — entrevista con el dev-lead (coincide con `sdd-kit.json`).

## Intent

Hoy el único comando de lectura es `libres <franja>`. No hay forma de saber qué salas se usan, qué días o a qué hora, ni cuáles sobran. El informe responde eso desde la línea de comandos, sobre las reservas activas.

## Scope

- Entra: comando `informes` con las cuatro vistas; opción `--sala` que filtra las cuatro; mensajes `sin reservas`, `sala desconocida` y `falta el nombre de la sala`; tests en `test/informes.test.js`; capacidad `reports`.
- No entra: exportar a fichero o a calendario (B1 del roadmap); porcentajes u horas de apertura; rangos de fechas; persistir nada (las reservas siguen en memoria); cambiar `libres`, `reservar`, `cancelar` o `anular`.

## Approach

`run('informes', params)` en `src/app.js` lee `--sala` de los parámetros, filtra las reservas activas por esa sala si viene y compone las cuatro vistas, cada una con su función de formato de tabla. El orden de construcción es una vista por task y, al final, `--sala`: las vistas se escriben ya recibiendo la lista de reservas filtrada, y la última task cablea el filtro y sus dos errores.

## Dónde se prueba

- Las cuatro vistas, `--sala` y los mensajes: por `run('informes', [...])`, como los tests actuales de `test/app.test.js`; fichero nuevo `test/informes.test.js`. Sin pantalla: la salida es texto.

## Términos y ADR

- Términos resueltos: ocupación — número de reservas activas (no porcentaje) | franja — el texto `HH:MM-HH:MM` de la reserva.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `reports`

**ADDED — Ocupación por sala**
- GIVEN reservas activas: Norte lun 10:00-12:00 y Norte mar 10:00-12:00; Sur sin reservas
- WHEN `informes`
- THEN la vista «Ocupación por sala» muestra `Norte | 2` y `Sur   | 0`, en ese orden

**ADDED — Ocupación por día de la semana**
- GIVEN reservas activas: Norte lun 10:00-12:00 y Sur lun 14:00-16:00
- WHEN `informes`
- THEN la vista «Ocupación por día» muestra `lun | 2` y los otros seis días con 0, en el orden lun mar mie jue vie sab dom

**ADDED — Franjas más reservadas**
- GIVEN reservas activas: Norte lun 10:00-12:00, Sur mar 10:00-12:00 y Sur mie 14:00-16:00
- WHEN `informes`
- THEN la vista «Franjas más reservadas» muestra `10:00-12:00 | 2` y después `14:00-16:00 | 1`, y ninguna franja con 0

**ADDED — Salas que nadie ha reservado**
- GIVEN reservas activas: solo Norte lun 10:00-12:00
- WHEN `informes`
- THEN la vista «Salas sin reservar» muestra `Sur`
- AND si Norte y Sur tienen reservas activas, la vista muestra `ninguna`

**ADDED — Las canceladas y anuladas no cuentan**
- GIVEN Norte lun 10:00-12:00 con estado `cancelled` y Sur mar 14:00-16:00 con estado `voided`
- WHEN `informes`
- THEN las cuatro vistas dicen `sin reservas`

**ADDED — Sin reservas**
- GIVEN ninguna reserva activa
- WHEN `informes`
- THEN cada una de las cuatro vistas, bajo su título, dice `sin reservas`

**ADDED — Filtrar por sala**
- GIVEN reservas activas: Norte lun 10:00-12:00 y Sur mar 14:00-16:00
- WHEN `informes --sala Norte`
- THEN las cuatro vistas cuentan solo las reservas de Norte: «Ocupación por sala» muestra `Norte | 1` y no muestra `Sur`; «Ocupación por día» muestra `lun | 1` y `mar | 0`; «Franjas más reservadas» muestra solo `10:00-12:00 | 1`; «Salas sin reservar» muestra `ninguna`
- AND con `--sala Sur` y Sur sin reservas activas, cada vista dice `sin reservas`

**ADDED — Sala desconocida o sin nombre**
- GIVEN las salas Norte y Sur
- WHEN `informes --sala Este`
- THEN responde `sala desconocida: Este`
- AND `informes --sala` sin nombre responde `falta el nombre de la sala`

**Reglas de la capacidad**
- **Dónde viven los datos**: las reservas activas de `bookings` en memoria; el informe no persiste nada.
- **Idioma de los nombres**: castellano (`informes`, `--sala`, `sin reservas`).
- **Límites**: ninguno; las franjas se listan todas.
- **Avisos**: `sin reservas` · `ninguna` · `sala desconocida: <nombre>` · `falta el nombre de la sala`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
