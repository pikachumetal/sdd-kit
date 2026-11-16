---
id: 20261105-171812-feature-0012-informes
feature: 0012
title: Informes de ocupación de las salas
mode: full
profile: delegate
status: draft
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Informes de ocupación de las salas

🦆 Hoy no se puede ver qué salas, días y franjas se usan más. Con `informes` sacas cuatro tablas de texto: reservas por sala (`Norte  3`), reservas por día de la semana (`lun  3`), franjas más reservadas (`10:00-12:00  3`) y salas que nadie ha reservado (`Sur`). Con `--sala Norte` las cuatro tablas cuentan solo esa sala. Sin reservas, cada tabla dice «sin reservas». Solo cuentan las reservas activas: las canceladas y las anuladas no.

Validación: dev-lead — es una salida de terminal que lee una persona; solo ella confirma que las tablas se entienden.

## Capacidades

- Nuevas: `reports` — informes de ocupación de las salas por línea de comandos.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor, sonnet — señales: capacidad nueva (`reports`) · tamaño: ~60 líneas en 3 ficheros (`src/app.js`, un test nuevo, el delta)
- Dominio y técnica (sonnet): si los THEN de las cuatro vistas son coherentes entre sí con los mismos datos (p. ej. que `Norte 3` de la vista por sala cuadra con `lun 2 + mar 1` de la vista por día) y si el caso «sin reservas» choca con «salas que nadie ha reservado» (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar esa coherencia cruzada, el tipo de hueco que no se ve hasta que sale una tabla que no suma

1. Capacidad nueva `reports` (slug en inglés, kebab-case) — es el sustantivo del dominio de la feature.
2. «Ocupación» = número de reservas **activas**; no hay porcentaje porque no existe un total de horas de la sala que sirva de base. Las reservas con estado `cancelled` o `voided` no cuentan en ninguna vista.
3. Formato de cada tabla: una línea de título, una línea de cabecera con las columnas, y una fila por elemento; las columnas se alinean a la izquierda con dos espacios entre ellas. Las cuatro vistas salen en el orden pedido, separadas por una línea en blanco. Los títulos literales: `Ocupación por sala`, `Ocupación por día de la semana`, `Franjas más reservadas`, `Salas que nadie ha reservado`; cabeceras: `sala` y `reservas`, `día` y `reservas`, `franja` y `reservas`, y solo `sala`. Cada columna mide lo que su celda más ancha (cabecera incluida) y se separa de la siguiente con dos espacios, como en los escenarios. La última columna no se rellena (sin espacios al final de línea) y la salida no añade más salto de línea que el del `console.log` final.
4. Ocupación por sala: una fila por cada sala, en el orden de la lista de salas, también las que tienen 0.
5. Ocupación por día: siete filas, de lunes a domingo, con los nombres `lun mar mie jue vie sab dom` (sin tildes, como el `lun` que ya existe; la regla es solo de los nombres de día: títulos y cabeceras llevan tilde), también las de 0.
6. Franjas más reservadas: solo las franjas con alguna reserva, de más a menos reservas; con empate, por hora de menos a más.
7. Salas que nadie ha reservado: una fila por sala sin reservas activas. Si todas las salas tienen reservas, la vista dice `ninguna`.
8. «Sin reservas»: si, tras aplicar el filtro, no hay ninguna reserva activa, **las cuatro vistas** dicen `sin reservas` bajo su título, también la de «salas que nadie ha reservado» (aunque entonces todas las salas están sin reservar): es lo que dijo el dev-lead («cada vista dice «sin reservas»»).
9. `--sala <nombre>` filtra las cuatro vistas: solo cuentan las reservas de esa sala, y «salas que nadie ha reservado» enseña esa sala solo si no tiene reservas (y entonces rige la decisión 8). El orden de `--sala` respecto a otros argumentos no importa.
10. Errores: una sala que no existe → `sala desconocida: Oeste`; `--sala` sin nombre → `falta el nombre de la sala`. Solo sale esa línea, sin tablas.
11. Dependencias del modelo actual: las salas salen de la lista de salas existente (Norte, Sur, en ese orden); el día y la franja de cada reserva son los campos que ya tiene; el estado `active` es el único que cuenta. Una reserva semanal (`--cada-semana`) hoy no guarda nada, así que no cuenta: las reservas recurrentes no entran.
12. Precedencia y casos límite: el error de sala va antes que `sin reservas`; el nombre de sala se compara tal cual, con mayúsculas (`norte` → `sala desconocida: norte`); lo que sigue a `--sala` es el nombre, sea lo que sea (`--sala --otra` → `sala desconocida: --otra`); los demás argumentos se ignoran. Con `--sala Sur` sin reservas de Sur pero con reservas de Norte, las cuatro vistas dicen `sin reservas` (la decisión 8 manda sobre las filas a 0 de la decisión 4).
13. Al cerrar se tocan también `PRODUCT.md` (término) y `capabilities/reports.md` (la fusión): trabajo de cierre, fuera del recuento de la review.
14. Términos nuevos en `PRODUCT.md` al cerrar: **Ocupación** (número de reservas activas), sin término a evitar.

15. Delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: crea `reports.md` con 9 requisitos añadidos y ningún rechazo.

### Hallazgos de la review

Un revisor (sonnet), 10 hallazgos, ningún Crítico, así que no hay segunda ronda.

- **Aceptado** — AND sin datos propios y `Sur  0` mal relleno → escenarios nuevos «Solo cuentan las reservas activas» y «Franjas con el mismo número de reservas», y `Sur    0` corregido
- **Aceptado** — falta el GIVEN de las salas → los escenarios dicen Norte y Sur, y la decisión 11 declara de dónde salen
- **Aceptado** — relleno de la última columna y salto de línea → decisión 3
- **Aceptado** — precedencia error/`sin reservas`, mayúsculas, `--sala --otra` → decisión 12 y un escenario más
- **Aceptado** — dependencia del modelo de reservas y recurrentes → decisión 11
- **Rechazado** — quitar la decisión 15 (el delta probado) → la pasada de coherencia pide escribir ahí la línea del resultado de `sdd capability merge`; es un hecho comprobado, no una promesa
- **Aceptado** — `PRODUCT.md` y `reports.md` → decisión 13 y Scope
- **Aceptado** — «sin tildes» → decisión 5 lo limita a los días
- **Aceptado** — `AND GIVEN` mezclado → dividido en dos escenarios
- **Rechazado** — «dev-lead» sin existir → el dev-lead es la misma persona que usa la herramienta; el rol es el del perfil del kit y valida ella

- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas, salas que nadie ha reservado) y una opción `--sala` que filtra las cuatro — «un comando informes con cuatro vistas […] y una opción --sala que filtra las cuatro»
- La salida es una tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks: una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy el coworking tiene dos salas y una lista de reservas, pero no hay forma de saber cuál se usa más, qué días se llena, qué franjas se piden más ni si alguna sala está olvidada. Eso obliga a contar a mano. Con `informes` se ve en una sola orden y, con `--sala`, por sala. Éxito: con los datos de ejemplo de los escenarios, las cuatro tablas salen exactamente como se escriben abajo y las cifras de las cuatro vistas cuadran entre sí (la suma de la vista por sala es la de la vista por día y la de franjas).

## Scope

- Entra: el comando `informes`, las cuatro vistas, la opción `--sala` y sus dos errores, en `src/app.js` y `test/informes.test.js`.
- No entra: porcentajes de ocupación, rangos de fechas, ordenar o exportar (el `.ics` es B1), reservas de varias semanas (`--cada-semana` sigue creando solo su aviso), cualquier otro comando.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: ninguna → no hay fila del roadmap para el 0012 | nada: comprobado con `git grep -niE "informe|ocupaci" -- . ':!.docs/sdd/specs'` (sin resultados)

## Approach

Una función por vista, cada una sobre las reservas activas ya filtradas por sala, y un único punto de entrada: `run('informes', params)` en `src/app.js` las junta, en el orden de la decisión 3, separadas por una línea en blanco. El reparto en tasks que decidió el dev-lead es: una por vista (la primera crea además el comando) y una última para `--sala`.

## Dónde se prueba

- Las cuatro vistas, `--sala` y los errores: por `run('informes', …)`, como los tests actuales de `test/app.test.js`, en un fichero nuevo `test/informes.test.js`; la salida se compara con el texto exacto de los escenarios. Los datos de cada escenario se montan en el test (cómo lo decide el plan).

## Términos y ADR

- Términos resueltos: Ocupación — número de reservas activas de una sala, un día o una franja
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reports`

#### ADDED — Ocupación por sala

- GIVEN las salas Norte y Sur (en ese orden) y las reservas activas Norte lun 10:00-12:00, Norte lun 14:00-16:00, Norte mar 10:00-12:00 y Sur lun 10:00-12:00
- WHEN se ejecuta `informes`
- THEN la primera vista sale así:
  ```
  Ocupación por sala
  sala   reservas
  Norte  3
  Sur    1
  ```
- AND GIVEN solo Norte lun 10:00-12:00, la fila de Sur sale con 0: `Sur    0`

#### ADDED — Solo cuentan las reservas activas

- GIVEN Norte lun 10:00-12:00 activa, Norte mar 10:00-12:00 cancelada y Sur lun 10:00-12:00 anulada
- WHEN se ejecuta `informes`
- THEN la vista por sala dice `Norte  1` y `Sur    0`, y la de día solo cuenta `lun  1`

#### ADDED — Ocupación por día de la semana

- GIVEN las mismas cuatro reservas activas
- WHEN se ejecuta `informes`
- THEN la segunda vista sale así:
  ```
  Ocupación por día de la semana
  día  reservas
  lun  3
  mar  1
  mie  0
  jue  0
  vie  0
  sab  0
  dom  0
  ```

#### ADDED — Franjas más reservadas

- GIVEN las mismas cuatro reservas activas
- WHEN se ejecuta `informes`
- THEN la tercera vista sale así:
  ```
  Franjas más reservadas
  franja       reservas
  10:00-12:00  3
  14:00-16:00  1
  ```

#### ADDED — Franjas con el mismo número de reservas

- GIVEN Norte lun 14:00-16:00 y Sur mar 10:00-12:00, ambas activas
- WHEN se ejecuta `informes`
- THEN la vista de franjas lista primero `10:00-12:00  1` y después `14:00-16:00  1`

#### ADDED — Salas que nadie ha reservado

- GIVEN las salas Norte y Sur, y una única reserva activa Norte lun 10:00-12:00
- WHEN se ejecuta `informes`
- THEN la cuarta vista sale así:
  ```
  Salas que nadie ha reservado
  sala
  Sur
  ```

#### ADDED — Todas las salas reservadas

- GIVEN las cuatro reservas activas de arriba (Norte y Sur tienen reservas)
- WHEN se ejecuta `informes`
- THEN la cuarta vista dice `ninguna` bajo su título

#### ADDED — Sin reservas

- GIVEN ninguna reserva activa (todas canceladas o anuladas, o no hay)
- WHEN se ejecuta `informes`
- THEN cada una de las cuatro vistas lleva su título y debajo `sin reservas`, p. ej. `Ocupación por sala` y `sin reservas`

#### ADDED — Filtrar por sala

- GIVEN las cuatro reservas activas de arriba
- WHEN se ejecuta `informes --sala Norte`
- THEN la vista por sala solo trae `Norte  3`, la de día trae `lun  2`, `mar  1` y 0 el resto, la de franjas trae `10:00-12:00  2` y `14:00-16:00  1`, y «salas que nadie ha reservado» dice `ninguna`
- AND GIVEN solo la reserva Norte lun 10:00-12:00, `informes --sala Sur` pone `sin reservas` bajo las cuatro vistas
- AND `informes --sala Oeste` responde solo `sala desconocida: Oeste`
- AND `informes --sala` responde solo `falta el nombre de la sala`
- AND `informes --sala norte` responde solo `sala desconocida: norte`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
