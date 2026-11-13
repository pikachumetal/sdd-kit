---
id: 20261113-224354-feature-0010-exportar-reservas-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-13
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Hasta ahora no había forma de sacar las reservas de una sala. Con `salas exportar Norte` sale una tabla CSV con una fila por reserva, que el responsable abre en su hoja de cálculo el lunes: `Norte,lun,10:00-12:00`. Si la sala no existe, el comando falla con un mensaje y no escribe nada por la salida normal, para que `> norte.csv` no guarde un fichero falso. Por dentro es una función pura nueva en `src/app.js` y un pequeño cambio en la entrada para mandar los errores a stderr.

Validación: dev-lead — el CSV lo usa una persona en su hoja de cálculo; solo ella ve si sale como espera al abrirlo.

## Capacidades

- Nuevas: `booking-export` — exportar las reservas de una sala a CSV.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el formato CSV lo consume la hoja de cálculo del responsable) · tamaño: ~40 líneas en 3 ficheros
- Dominio (sonnet): si `sala,dia,franja` y el orden por día y franja bastan para cuadrar las reservas de la sala, y si «sala sin reservas = solo cabecera» es lo que esperaría el responsable (señal: capacidad nueva)
- Técnica (sonnet): si la salida `\n` sin línea final y el error por stderr con código 1 se comportan igual al redirigir `> norte.csv` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el contenido del CSV es el que el responsable necesita

1. Capacidad nueva `booking-export` (slug en inglés, kebab-case) — la spec declara una capacidad porque el comando añade comportamiento visible y no hay ninguna capacidad en el proyecto.
2. Sintaxis `exportar <sala>`, con la sala escrita igual que en `libres` (`Norte`, `Sur`; distingue mayúsculas) — sigue el patrón de `reservar`/`cancelar`, que reciben la sala como argumento.
3. Cabecera en castellano `sala,dia,franja`, coma como separador, filas separadas por `\n` y sin línea final extra (`console.log` ya añade el salto) — la cabecera es la que pediste; el resto es el CSV más simple que abre cualquier hoja de cálculo.
4. Sin comillas ni escapes: ninguno de los tres campos puede llevar comas, comillas ni saltos de línea (salas fijas `Norte`/`Sur`, días `lun`…, franjas `HH:MM-HH:MM`) — escapar sería código que nada ejercita. Si algún día un campo admite comas, se añade entonces.
5. Orden de las filas: por día de la semana (`lun`, `mar`, `mie`, `jue`, `vie`, `sab`, `dom`) y, dentro del día, por franja — para que el responsable las lea en el orden de la semana. Un día fuera de esa lista va al final.
6. Sala sin reservas: solo la cabecera — una sala libre es un caso válido, no un error.
7. Sala desconocida o sin argumento: error por stderr y código de salida 1, sin nada por stdout — así `salas exportar Oeste > norte.csv` no deja un CSV con un mensaje dentro. Textos literales: `sala desconocida: Oeste (salas: Norte, Sur)` y `uso: salas exportar <sala>`.
8. Sin fecha ni parámetro de semana: las reservas guardan solo día y franja, así que «las de la semana que empieza el lunes que viene» son todas las de la sala — el modelo no tiene otra cosa que filtrar.
9. Enfoque: función pura `exportCsv(room, rooms, bookings)` exportada desde `src/app.js` y enganchada en `run`, frente a probar solo por `run` o separar un módulo nuevo (ver Approach).
10. Validación: `dev-lead` — lo abre una persona en su hoja de cálculo.
- Política de modelos: revisores de la spec con sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` (3).

### Hallazgos de la review

No se han despachado los dos revisores de la propuesta: en esta sesión no hay herramienta para lanzar subagentes. La review la he hecho yo, con los siete puntos, y no equivale a la de dos lentes independientes. Si prefieres revisores reales, dilo en el gate y se relanza en otra sesión.

- **Aceptado** — Punto 4 (decisiones del cuerpo fuera de ✋): la ortografía `mie` de los días no estaba justificada y el código solo usa `lun` y `mar` → decisión 5 la nombra como mía.
- **Aceptado** — Punto 3 (alcance oculto): el cambio del `README.md` solo estaba en el Scope → queda en Scope y en «Dónde se prueba» no hace falta test.
- Sin hallazgo en los puntos 1 (no hay capacidades vivas), 2 (cada requisito tiene su escenario con datos), 5 y 5 bis (sin roles; las cinco reglas dichas), 6 (el contrato CSV está en las decisiones 3 a 8) y 7 (los ejemplos `Norte` y `Sur` salen del propio código).
- Delta probado en una copia fuera del repo con `sdd capability merge`: añade 2 requisitos y las 5 reglas de `booking-export.md`, sin rechazos.

### Decisiones tomadas con el dev-lead

- Columnas `sala,dia,franja` y nada más — «Opción 1: solo `sala,dia,franja`, tal como pedí. Si el responsable quiere fechas, lo ponemos después.»
- Contenido: las reservas de la sala de la semana del próximo lunes, con sala, día y franja — «Las reservas de su sala de la semana que empieza el lunes que viene, con sala, día y franja de cada una. No sé si necesita algún dato más.»

## Intent

Hoy `salas` solo permite consultar salas libres, reservar y cancelar: no hay forma de sacar las reservas de una sala. El responsable de cada sala las cuadra los lunes en su hoja de cálculo y necesita una tabla que pueda abrir allí. El éxito es que `salas exportar Norte > norte.csv` produzca un fichero que la hoja de cálculo abra con tres columnas y una fila por reserva, sin retoques. Fracaso aunque «funcione»: que un error acabe escrito dentro del CSV, o que salgan reservas de otra sala.

## Scope

- Entra: comando `exportar <sala>` en `src/app.js` (`run`), función pura `exportCsv`, manejo de errores en la entrada (stderr y código 1), una línea en `README.md` con el comando y tests en `test/app.test.js`.
- No entra: fechas o columna `fecha`, filtro o parámetro de semana, exportar varias salas a la vez, escritura a fichero (se redirige con `>`), otros formatos (el `.ics` es la fila 0009), reservas semanales `--cada-semana` (hoy no se guardan).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La línea de entrada `if (command) console.log(run(command, args));` pasa a capturar el error de `run` y mandarlo a stderr con código 1 | `src/app.js:14` | Scope, decisión 7 |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv"` fuera de `.docs/sdd/specs` (solo aparece la fila 0009 del roadmap, que es el `.ics` y queda fuera).

## Approach

- A — probar solo por `run('exportar', ['Norte'])` con los datos del módulo: sin código nuevo exportado, pero con una sola reserva en memoria no se pueden probar el orden, las salas sin reservas ni que no se cuelen las de otra sala.
- B — función pura `exportCsv(room, rooms, bookings)` exportada de `src/app.js`, y `run` la llama con los datos del módulo: se prueba con los datos que haga falta y el fichero sigue siendo uno solo.
- C — un módulo nuevo `src/exportar.js`: separa responsabilidades, pero el proyecto tiene un único fichero de entrada (`operations.md`) y no hay dependencias entre módulos que lo justifiquen.
- Elegido: B — cubre todos los escenarios sin romper la regla de un fichero de entrada.

`exportCsv` lanza `Error` con el texto de la decisión 7 si la sala no está en `rooms`. `run` no captura: la entrada (`if (command) …`) captura, escribe `error.message` por stderr y pone `process.exitCode = 1`.

## Dónde se prueba

- Contenido, orden, sala sin reservas y que no salgan reservas de otra sala: por `exportCsv` con datos propios, en `test/app.test.js`, como los tests actuales de `libres`.
- `exportar Norte` cableado en `run`: por `run('exportar', ['Norte'])`, como los tests de `run` actuales.
- Error de sala desconocida y de falta de argumento (stderr, código 1, stdout vacío): lanzando `node src/app.js exportar Oeste` como proceso hijo; es la única forma de ver el código de salida.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar a CSV las reservas de una sala

- GIVEN Norte tiene una reserva `lun 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN sale por stdout `sala,dia,franja` y debajo `Norte,lun,10:00-12:00`, y el código de salida es 0
- AND si Norte tiene `mar 09:00-10:00`, `lun 10:00-12:00` y `lun 08:00-09:00`, y Sur tiene `mie 09:00-10:00`, salen tras la cabecera `Norte,lun,08:00-09:00`, `Norte,lun,10:00-12:00` y `Norte,mar,09:00-10:00`, en ese orden y sin ninguna fila de Sur
- AND si Sur no tiene reservas, `exportar Sur` saca solo `sala,dia,franja`

#### ADDED — Rechazar la exportación de una sala que no existe

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `exportar Oeste`
- THEN por stderr sale `sala desconocida: Oeste (salas: Norte, Sur)`, nada por stdout y el código de salida es 1
- AND con `exportar` sin sala, por stderr sale `uso: salas exportar <sala>`, nada por stdout y el código de salida es 1

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: no aplica — la exportación solo lee las reservas que ya tiene `src/app.js`.
- **Idioma de los nombres**: castellano (cabecera `sala,dia,franja`, mensajes de error), como pide la constitución.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: no aplica.

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
