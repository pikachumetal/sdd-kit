---
id: 20261113-151047-feature-0010-exportar-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
profile: delegate
status: draft
created: 2026-11-13
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Con `salas exportar Norte > norte.csv` sale un CSV de tres columnas con las reservas de esa sala, y el responsable lo abre en su hoja de cálculo el lunes y las cuadra. Por ejemplo, con `Norte` reservada el lunes de 10:00 a 12:00 sale `Norte;lun;10:00-12:00` bajo la cabecera `sala;dia;franja`. Se separa con punto y coma, que es lo que una hoja de cálculo en castellano parte en columnas sin preguntar. Se añade un comando a `src/app.js` y no se cambia ninguno de los existentes.

Validación: dev-lead — lo usa una persona con su hoja de cálculo y solo ella puede decir si el CSV se abre bien y le sirve para cuadrar.

## Capacidades

- Nuevas: `room-booking-export` — cómo se exportan las reservas de una sala a un fichero para la hoja de cálculo.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-booking-export`), contrato público (formato de fichero que consume una hoja de cálculo) · tamaño: ~40 líneas en 2 ficheros
- Dominio (sonnet): si «de la semana que empieza el lunes que viene» se cumple de verdad con un modelo sin fechas (decisión 3) y si el CSV sirve para cuadrar sin la columna de fecha (señal: capacidad nueva)
- Técnica (sonnet): si cabecera, separador, orden y fin de línea del requisito «Exportar las reservas de una sala» se abren sin sorpresas en una hoja en castellano (señal: contrato público)
- Mínimo razonable: solo dominio — deja sin mirar el formato del fichero (separador, acentos, fin de línea)
```

Estado de la review: **no se ha podido despachar a revisores independientes** (esta sesión no tiene herramienta para lanzar subagentes). Hice yo la lectura de los siete puntos, que no sustituye a un revisor con contexto limpio. Los hallazgos de esa lectura están abajo.

1. **Comando `exportar <sala>`**, con la salida por pantalla (se redirige con `> fichero.csv`), igual que los demás comandos — nadie dijo cómo se llamaba ni adónde escribía.
2. **Columnas y cabecera**: `sala;dia;franja`, con la cabecera en la primera línea. Sin tilde en `dia`, para que no dependa de la codificación del fichero. Tú dijiste «sala, día y franja»; la cabecera literal es mía.
3. **Sin filtro de semana**: salen todas las reservas de la sala. Hoy una reserva solo guarda el día de la semana (`lun`) y la franja, sin fecha, así que «la semana que empieza el lunes que viene» no se puede calcular. Si más adelante las reservas llevan fecha, el filtro es otra feature. **Esta es la decisión que más conviene que mires.**
4. **Orden**: por día (`lun`, `mar`, `mie`, `jue`, `vie`, `sab`, `dom`) y, dentro del día, por franja. Un día que no esté en esa lista va al final. El orden lo elegí yo.
5. **Sala sin reservas**: sale solo la cabecera.
6. **Sala que no existe**: no sale CSV, sale el texto `sala desconocida: <sala>`. La comparación distingue mayúsculas, como `libres`.
7. **Sin sala**: sale el texto `uso: exportar <sala>`.
8. **Formato del fichero**: separador `;`, saltos de línea `\n`, sin BOM y sin comillas. Los valores (salas, días y franjas) nunca llevan `;`, así que no hace falta escapar nada.
9. **Capacidad nueva `room-booking-export`**, en inglés kebab-case. Hoy no hay ninguna en `capabilities/`.
10. **Enfoque**: A, frente a B y C (ver Approach).
- Delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: 4 requisitos y las 5 reglas añadidos a `room-booking-export.md`, sin rechazos. El `capabilities/` del repo no se ha tocado.
- Política de modelos: revisores de la spec — dominio y técnica en sonnet, **no lanzados** (ver arriba) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Lectura mía, no de revisores independientes.

- **Aceptado** — «de la semana que viene» promete algo que el modelo no puede cumplir → decisión 3 en el ✋ y «No entra: filtrar por semana» en el Scope.
- **Aceptado** — con un solo escenario no se ve el orden → escenario «Reservas en varios días» con datos concretos.

### Decisiones tomadas con el dev-lead

- Columnas sala, día y franja, separadas por punto y coma — «con columnas sala, día y franja, separadas por punto y coma»
- Las reservas son las de la semana que empieza el lunes que viene — «Cuadra las reservas de su sala de la semana que empieza el lunes que viene» (ver decisión 3: no se puede filtrar con los datos de hoy)
- Lo demás lo decido yo — «Lo que mire exactamente en la hoja, no sé; decide tú»

## Intent

Hoy `salas` reserva, cancela y dice qué salas están libres, pero no hay forma de sacar las reservas de una sala. El responsable de cada sala las cuadra los lunes en su hoja de cálculo y las copia a mano. Con el comando nuevo las obtiene en un CSV que la hoja abre en tres columnas (sala, día y franja). Es un éxito si el responsable lo abre sin tocar nada y lo cuadra. Sería un fracaso que se abriera todo en una sola columna, o que faltara una reserva de la sala o sobrara una de otra.

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js` con la salida de «Exportar las reservas de una sala»; sus tests en `test/app.test.js`; la línea del comando en `README.md`.
- No entra: filtrar por semana o por fecha (el modelo no guarda fechas, decisión 3); escribir el fichero en disco (se redirige la salida); exportar todas las salas de una vez; otras columnas; BOM; el comando `reservar` y sus reservas semanales.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -n "0010\|exportar" -- . ':!.docs'` (sin resultados) y con la fila 0009 de `ROADMAP.md`, que habla de `.ics` y no se toca.

## Approach

- A — una función pura que recibe las reservas y la sala y devuelve el texto CSV, y el comando `exportar` que la llama desde `run`, todo en `src/app.js` — cuesta poco y se prueba sin tocar la lista global de reservas. Encaja con «un solo fichero de entrada».
- B — un fichero nuevo `src/exportar.js` — separa bien, pero para unas 15 líneas añade un fichero y una importación que hoy no hacen falta.
- C — un comando genérico `exportar --formato csv|ics` — se adelanta a la fila 0009 (`.ics`), que nadie ha pedido todavía.
- Elegido: A — es lo más pequeño que cumple lo pedido y deja el modelo de datos como está.

La función es `bookingsCsv(bookings, room)` y se exporta para probarla con reservas de ejemplo. `run('exportar', [sala])` la llama con las reservas de `src/app.js`.

## Dónde se prueba

- Cabecera, filas y orden: por `bookingsCsv` con reservas de ejemplo, que son los tests unitarios de `test/app.test.js`.
- El comando completo: por `run('exportar', ['Norte'])`, como los tests actuales de `libres` y `cancelar`.
- Sala desconocida y sin sala: por `run`, igual.
- Que la hoja de cálculo lo abre en tres columnas: lo comprueba el dev-lead con su hoja real en la validación.

## Términos y ADR

- Términos resueltos: franja — el intervalo de una reserva, como `10:00-12:00`
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN `Norte` reservada el `lun` de `10:00-12:00` y `Sur` sin reservas
- WHEN se ejecuta `exportar Norte`
- THEN sale `sala;dia;franja` en la primera línea y `Norte;lun;10:00-12:00` en la segunda
- AND no sale ninguna reserva de `Sur`

#### ADDED — Reservas en varios días

- GIVEN `Norte` reservada el `mar` de `09:00-10:00`, el `lun` de `15:00-16:00` y el `lun` de `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN salen, tras la cabecera, `Norte;lun;10:00-12:00`, `Norte;lun;15:00-16:00` y `Norte;mar;09:00-10:00`, en ese orden

#### ADDED — Sala sin reservas

- GIVEN `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN sale solo `sala;dia;franja`

#### ADDED — Sala desconocida o sin indicar

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Este`
- THEN sale `sala desconocida: Este` y ninguna cabecera
- AND con `exportar` sin sala sale `uso: exportar <sala>`

#### Reglas de la capacidad — room-booking-export

- **Dónde viven los datos**: no aplica — solo lee las reservas que ya existen en `src/app.js`
- **Idioma de los nombres**: castellano en los textos de aviso y la cabecera (`sala;dia;franja`)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` y `uso: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
