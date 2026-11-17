---
id: 20261011-133137-feature-0012-informes
feature: 0012
title: Informes de ocupación de las salas
mode: full
profile: delegate
status: draft
created: 2026-10-11
author: <git-user> (con Claude)
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Informes de ocupación de las salas

🦆 Hasta ahora nadie puede ver cómo se usan las salas: no hay forma de saber cuál se llena o qué hora se reserva más. Con `informes`, la herramienta enseña cuatro tablas de texto: reservas por sala, reservas por día de la semana, franjas más reservadas y salas que nadie ha reservado; con `informes --sala Norte`, las cuatro hablan solo de Norte. Por ejemplo, con una reserva de Norte el lunes de 10:00 a 12:00, la primera tabla dice «Norte 1» y «Sur 0». Si no hay ninguna reserva, cada tabla dice «sin reservas». Solo cuentan las reservas vigentes: cancelaciones y anulaciones no.

## Capacidades

- Nuevas: `reports` — informes de uso de las salas a partir de las reservas vigentes.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (1 de 8) · tamaño: ~60 líneas en 2 ficheros (`src/app.js` y un test)
- Mínimo razonable: ninguna — no deja nada sin cubrir que las señales marquen; la regla de qué cuenta como reserva (decisión 1) la lees tú en esta lista.

1. **Capacidad nueva `reports`** — no existe ninguna capacidad en `capabilities/` y estos informes no pertenecen a reservar ni a cancelar.
2. **Solo cuentan las reservas vigentes** (estado activo): una cancelación o una anulación no ocupa la sala. Consecuencia: una sala con todas sus reservas canceladas cuenta como «nadie la ha reservado» en la cuarta vista.
3. **Nombre y forma**: el comando es `informes` y el filtro `--sala <nombre>`, con el nombre tal como está en la lista de salas (`Norte`, `Sur`).
4. **Salida**: las cuatro vistas salen siempre juntas, en este orden, separadas por una línea en blanco; cada vista es su título, una cabecera y una fila por elemento, columnas separadas por dos espacios y alineadas a la izquierda.
5. **Títulos y cabeceras literales**: «Ocupación por sala» (`sala  reservas`), «Ocupación por día de la semana» (`día  reservas`), «Franjas más reservadas» (`franja  reservas`) y «Salas sin reservas» (`sala`).
6. **Orden**: por sala, en el orden de la lista de salas; por día, de lunes a domingo, con los nombres de tres letras `lun mar mié jue vie sáb dom`; por franja, de más a menos reservas y, a igualdad, por franja ascendente. Sin tope de filas.
7. **Qué filas salen**: la vista por sala saca todas las salas, también con 0; la vista por día y la de franjas sacan solo los días y las franjas con al menos una reserva.
8. **Sin reservas**: si no hay ninguna reserva vigente (con `--sala`, ninguna de esa sala), cada vista dice solo `sin reservas` en lugar de su tabla. Esto incluye la cuarta vista, aunque entonces todas las salas estén sin reservar: lo dijo el dev-lead («cada vista dice sin reservas») y lo aplico al pie de la letra. Dime si prefieres que la cuarta vista liste las salas en ese caso.
9. **`--sala` en la cuarta vista**: si la sala filtrada tiene reservas, la vista dice `ninguna` bajo su título (esa sala no está entre las que nadie ha reservado); si no tiene reservas, rige la decisión 8 (`sin reservas`). Con las otras tres vistas, el filtro limita las filas a esa sala.
10. **Sala que no existe**: `informes --sala Este` responde `sala desconocida: Este` y no saca ninguna vista.
11. **`--sala` sin nombre** responde `falta el nombre de la sala` y no saca ninguna vista.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas».
- Una opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro».
- La salida es una tabla de texto — «la salida es una tabla de texto».
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»».
- El plan sale en 5 tasks, una por vista y otra para `--sala`; perfil delegate — «el plan sale en 5 tasks, una por vista y otra para --sala. Perfil delegate».

## Intent

Hoy se puede reservar, cancelar y anular, pero no hay forma de ver cómo se usan las salas en conjunto: qué sala se llena, qué días y a qué hora se reserva más y qué sala está sin uso. Se quiere un comando que lo conteste con tablas de texto, para toda la oficina o para una sala.

## Scope

- Entra: el comando `informes` con las cuatro vistas; la opción `--sala`; los mensajes de sin reservas, sala desconocida y falta de nombre; tests de cada vista y del filtro.
- No entra: otros formatos de salida (CSV, JSON); filtros por fecha o por franja; informes de cancelaciones o anulaciones; persistencia de las reservas (siguen en memoria); el listado de canceladas de la feature 0010.

## Approach

El comando recorre las reservas vigentes y cuenta por sala, por día y por franja; la cuarta vista parte de las salas y quita las que tienen alguna reserva. `--sala` se aplica antes de contar, así las cuatro vistas comparten el filtro. La salida se compone con las reglas de las decisiones 4 a 11. Las pruebas necesitan reservas distintas de la semilla (una sola reserva de Norte); cómo se cargan es cosa del plan.

## Dónde se prueba

- Las cuatro vistas y los mensajes: por `run('informes', …)`, como los tests actuales de `test/app.test.js`, en un fichero de test nuevo `test/informes.test.js`.
- Los datos de cada caso (varias reservas, ninguna, canceladas): la costura de carga de reservas la fija el plan; la prueba compara el texto devuelto entero.

## Términos y ADR

- Términos resueltos: **reserva vigente** — la que no está cancelada ni anulada; es la única que cuentan los informes. **Franja** — el tramo horario de una reserva, tal como se escribe al reservar (`10:00-12:00`).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reports`

**ADDED — Ocupación por sala**
- GIVEN reservas vigentes: Norte lun 10:00-12:00 y Norte mar 10:00-12:00; Sur sin reservas
- WHEN `informes`
- THEN la vista «Ocupación por sala» dice `Norte  2` y `Sur  0`, en ese orden

**ADDED — Ocupación por día de la semana**
- GIVEN reservas vigentes: Norte lun 10:00-12:00, Sur lun 14:00-16:00 y Norte mié 10:00-12:00
- WHEN `informes`
- THEN la vista «Ocupación por día de la semana» dice `lun  2` y `mié  1`, y no saca ningún otro día

**ADDED — Franjas más reservadas**
- GIVEN reservas vigentes: Norte lun 10:00-12:00, Sur mar 10:00-12:00, Norte mié 14:00-16:00 y Sur jue 09:00-10:00
- WHEN `informes`
- THEN la vista «Franjas más reservadas» dice `10:00-12:00  2`, `09:00-10:00  1` y `14:00-16:00  1`, en ese orden

**ADDED — Salas que nadie ha reservado**
- GIVEN reservas vigentes: Norte lun 10:00-12:00; Sur sin reservas vigentes
- WHEN `informes`
- THEN la vista «Salas sin reservas» dice `Sur`
- AND con Norte y Sur reservadas, la vista dice `ninguna`

**ADDED — Solo cuentan las reservas vigentes**
- GIVEN Norte lun 10:00-12:00 cancelada y Sur mar 14:00-16:00 vigente
- WHEN `informes`
- THEN «Ocupación por sala» dice `Norte  0` y `Sur  1`, y la vista «Salas sin reservas» dice `Norte`

**ADDED — Informes sin reservas**
- GIVEN ninguna reserva vigente
- WHEN `informes`
- THEN cada una de las cuatro vistas dice `sin reservas` bajo su título

**ADDED — Filtrar los informes por sala**
- GIVEN reservas vigentes: Norte lun 10:00-12:00 y Sur mar 14:00-16:00
- WHEN `informes --sala Norte`
- THEN «Ocupación por sala» dice solo `Norte  1`, «Ocupación por día de la semana» solo `lun  1`, «Franjas más reservadas» solo `10:00-12:00  1` y «Salas sin reservas» dice `ninguna`
- AND con `informes --sala Sur` sin reservas de Sur, cada vista dice `sin reservas`

**ADDED — Sala desconocida o sin nombre en el filtro**
- GIVEN las salas Norte y Sur
- WHEN `informes --sala Este`
- THEN la respuesta es `sala desconocida: Este` y no hay ninguna vista
- AND `informes --sala` responde `falta el nombre de la sala`

**Reglas de la capacidad**
- **Dónde viven los datos**: no aplica; los informes leen las reservas en memoria y no guardan nada.
- **Idioma de los nombres**: castellano, con los términos de `PRODUCT.md` (reserva, sala).
- **Límites**: sin tope de filas.
- **Avisos**: `sin reservas` · `ninguna` · `sala desconocida: <nombre>` · `falta el nombre de la sala`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
