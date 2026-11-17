---
id: 20261011-132656-feature-0012-informes
feature: 0012
title: Informes de reservas
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

# Spec — Informes de reservas

🦆 Podrás pedir los informes de reservas y ver, en cuatro tablas de texto, cuántas reservas tiene cada sala, cuántas cae en cada día de la semana, qué franjas se reservan más y qué salas nadie ha reservado; si indicas una sala, las cuatro tablas se limitan a ella. Por ejemplo, con Norte reservada el lunes y el martes de 10:00 a 12:00 y Sur el lunes de 14:00 a 16:00, Norte sale con 2 reservas y Sur con 1, el lunes con 2 y la franja 10:00-12:00 es la más reservada. Solo cuentan las reservas vigentes: las canceladas y las anuladas no suman. Si no hay ninguna reserva, cada tabla dice «sin reservas».

> **Estado**: draft. **Siguiente paso**: aprobación de la spec → `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Nuevas: `reports` — informes de ocupación de las reservas (por sala, por día, por franja y salas sin reservar), con filtro por sala.
- Modificadas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (1 de 8) · tamaño: ~60 líneas en 2 ficheros (la lógica y sus tests)
- Mínimo razonable: ninguna — no hay contrato público, datos persistentes ni roles; lo que queda sin segunda mirada es solo mi pasada de coherencia.

1. **Capacidad nueva `reports`** (slug en inglés, como pide el kit): el proyecto aún no tiene `capabilities/`, y los informes son un sustantivo del dominio propio.
2. **Forma de la orden: `informes` y `informes --sala <sala>`**, con el nombre de la sala como valor tras la opción. La entrevista fijó el comando y la opción; el valor tras un espacio es mi elección, como el resto de comandos.
3. **«Ocupación» es el número de reservas vigentes**, no un porcentaje: el proyecto no define horario de apertura, así que no hay denominador.
4. **Solo cuentan las reservas vigentes.** Las canceladas y las anuladas no suman en ninguna vista.
5. **Orden y filas.** Salas en el orden en que existen (Norte, Sur); días de lunes a domingo, con los siete aunque tengan 0; franjas de más a menos reservas y, en empate, por franja ascendente, solo las que tienen alguna reserva; salas sin reservar, en el orden de las salas.
6. **Códigos de día `lun`, `mar`, `mie`, `jue`, `vie`, `sab`, `dom`**, sin tildes. Solo `lun` aparece hoy en los datos del código; el resto lo infiero por analogía.
7. **Formato de cada tabla**: línea de título, línea de cabecera, línea de guiones con el ancho de la cabecera y una línea por fila; las columnas, alineadas a la izquierda al ancho de su celda más larga y unidas con ` | `. Entre vistas, una línea en blanco. Los títulos son: «Ocupación por sala», «Ocupación por día de la semana», «Franjas más reservadas» y «Salas que nadie ha reservado».
8. **«sin reservas» sustituye a la tabla en las cuatro vistas** cuando no hay ninguna reserva vigente en lo que se mira, también en «Salas que nadie ha reservado» (aunque ahí todas las salas estén sin reservar): es la regla del dev-lead aplicada al pie de la letra. Con `--sala`, «lo que se mira» es esa sala.
9. **«ninguna»** es lo que dice «Salas que nadie ha reservado» cuando hay reservas y todas las salas tienen alguna.
10. **Avisos de `--sala`**: sala que no existe → `sala desconocida: <sala>`; opción sin valor → `falta el nombre de la sala: informes --sala <sala>`. La sala se reconoce por su nombre exacto, mayúsculas incluidas (`Norte`, no `norte`).
11. **Fuera: README y PRODUCT.** El comando no se documenta en el README ni se añaden términos al glosario en esta feature; el cierre ya apunta el changelog.

### Decisiones tomadas con el dev-lead

- Un comando de informes con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)».
- Una opción `--sala` filtra las cuatro vistas — «una opción --sala que filtra las cuatro».
- La salida es una tabla de texto — «la salida es una tabla de texto».
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»».
- Perfil `delegate` — «Perfil delegate».

## Intent

Hoy solo se puede preguntar por una franja (`libres`) o cancelar y anular reservas: no hay forma de ver cómo se usan las salas. Se quiere un resumen de ocupación que responda a cuatro preguntas: qué salas se usan más, qué días, qué franjas, y qué salas no ha reservado nadie, también por una sola sala.

## Scope

- Entra: el comando `informes` con las cuatro vistas; la opción `--sala` que las filtra; los avisos de `--sala` incorrecta; sus tests.
- No entra: porcentajes de ocupación; filtros por día, franja o fechas; exportar el informe (el backlog B1 es otra cosa); documentación en el README; cambios en los comandos existentes.

## Approach

Una orden nueva de solo lectura sobre las reservas vigentes: recuenta por sala, por día y por franja, y compone las cuatro tablas de texto en un orden fijo. `--sala` restringe las reservas contadas a una sala antes de componer las vistas. No modifica reservas ni comandos existentes.

## Dónde se prueba

- Cada escenario del delta: por `run('informes', …)`, comparando la salida literal, como los tests actuales de `test/app.test.js`; sin pantalla, no hay captura.

## Términos y ADR

- Términos resueltos: **Franja** — tramo horario de una reserva (`10:00-12:00`); **Ocupación** — número de reservas vigentes, no un porcentaje.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `reports`

**ADDED — Informe de ocupación por sala, día y franja**
- GIVEN reservas vigentes: Norte lun 10:00-12:00, Norte mar 10:00-12:00 y Sur lun 14:00-16:00
- WHEN se ejecuta `informes`
- THEN la salida, literal, es:

```text
Ocupación por sala
Sala  | Reservas
----------------
Norte | 2
Sur   | 1

Ocupación por día de la semana
Día | Reservas
--------------
lun | 2
mar | 1
mie | 0
jue | 0
vie | 0
sab | 0
dom | 0

Franjas más reservadas
Franja      | Reservas
----------------------
10:00-12:00 | 2
14:00-16:00 | 1

Salas que nadie ha reservado
ninguna
```

**ADDED — Salas que nadie ha reservado**
- GIVEN una única reserva vigente: Norte lun 10:00-12:00
- WHEN se ejecuta `informes`
- THEN «Ocupación por sala» da `Norte | 1` y `Sur   | 0`
- AND «Salas que nadie ha reservado» lista una fila, `Sur`, bajo la cabecera `Sala`

**ADDED — Las reservas canceladas y anuladas no cuentan**
- GIVEN Norte lun 10:00-12:00 cancelada, Sur mar 09:00-10:00 vigente y Sur mie 09:00-10:00 anulada
- WHEN se ejecuta `informes`
- THEN «Ocupación por sala» da `Norte | 0` y `Sur   | 1`
- AND «Ocupación por día de la semana» da `mar | 1` y `0` en los otros seis días
- AND «Franjas más reservadas» lista solo `09:00-10:00 | 1`
- AND «Salas que nadie ha reservado» lista `Norte`

**ADDED — Sin reservas**
- GIVEN ninguna reserva vigente
- WHEN se ejecuta `informes`
- THEN cada una de las cuatro vistas muestra su título y debajo `sin reservas`, en el orden de siempre y separadas por una línea en blanco

**ADDED — Filtro por sala**
- GIVEN las reservas del primer escenario (Norte lun 10:00-12:00, Norte mar 10:00-12:00, Sur lun 14:00-16:00)
- WHEN se ejecuta `informes --sala Norte`
- THEN «Ocupación por sala» solo lista `Norte | 2`
- AND «Ocupación por día de la semana» da `lun | 1`, `mar | 1` y `0` en los otros cinco días
- AND «Franjas más reservadas» lista solo `10:00-12:00 | 2`
- AND «Salas que nadie ha reservado» dice `ninguna`

**ADDED — Filtro por una sala sin reservas**
- GIVEN una única reserva vigente: Norte lun 10:00-12:00
- WHEN se ejecuta `informes --sala Sur`
- THEN cada una de las cuatro vistas dice `sin reservas`

**ADDED — Sala desconocida en el filtro**
- GIVEN las salas Norte y Sur
- WHEN se ejecuta `informes --sala Este`
- THEN la salida es `sala desconocida: Este` y no se muestra ninguna vista

**ADDED — Filtro sin nombre de sala**
- GIVEN las salas Norte y Sur
- WHEN se ejecuta `informes --sala`
- THEN la salida es `falta el nombre de la sala: informes --sala <sala>` y no se muestra ninguna vista

**Reglas de la capacidad**
- **Dónde viven los datos**: en memoria, sin base de datos (`operations.md`); el informe solo lee las reservas, no guarda nada.
- **Idioma de los nombres**: castellano (artículo 4 de la constitución): títulos, avisos y nombre del comando.
- **Límites**: no aplica.
- **Avisos**: `sin reservas`; `ninguna`; `sala desconocida: <sala>`; `falta el nombre de la sala: informes --sala <sala>`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
