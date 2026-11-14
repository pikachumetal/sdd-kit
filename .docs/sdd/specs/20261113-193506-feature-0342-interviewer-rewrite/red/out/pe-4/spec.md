---
id: 20261113-211333-feature-0010-exportar-csv
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

🦆 Hoy no hay forma de sacar las reservas de una sala para llevarlas a una hoja de cálculo. Con esto, `salas exportar Norte` imprime una línea de cabecera y una línea por reserva, separadas por `;` para que el Excel en castellano del responsable las abra en columnas: `Norte;lun;10:00-12:00`. El responsable lo redirige a un fichero (`> norte.csv`) y lo abre el lunes. Se añade un comando en `src/app.js` que lee la lista de reservas y la ordena por día y franja.

Validación: dev-lead — lo usa una persona y el resultado se ve en su Excel en castellano, que el agente no puede abrir.

## Capacidades

- Nuevas: `room-bookings-export` — exportar a CSV las reservas de una sala
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva, formato de fichero que consume otra herramienta (la hoja de cálculo) · tamaño: ~40 líneas en 2 ficheros
- Único revisor (sonnet, los siete puntos): comprueba que el THEN de «sala sin reservas» y el de «sala inexistente» no se contradicen con el Scope, y que el formato con `;` y la cabecera `sala;dia;franja` están en un solo sitio (señal: formato de fichero)
- Mínimo razonable: sin revisor — deja sin mirar si las decisiones 2 a 7 de esta lista contradicen algo no escrito en la spec

1. Nombre del comando: `exportar <sala>`. Es el verbo en castellano, como `libres`, `reservar` y `cancelar`.
2. Columnas: cabecera `sala;dia;franja`, sin tildes, igual que los nombres de campo de `bookings`.
3. Orden de las filas: por día (`lun`, `mar`, `mie`, `jue`, `vie`, `sab`, `dom`) y, dentro del día, por franja. Un día fuera de esa lista va al final.
4. Sala sin reservas: la salida es solo la cabecera `sala;dia;franja`.
5. Sala que no existe: el texto `sala desconocida: Oeste` y nada de CSV. Sin argumento: `uso: exportar <sala>`.
6. Formato de texto: sin BOM, saltos de línea `\n`, sin comillas ni escapes; las salas y las franjas actuales no llevan `;`. Si algún día lo llevan, es otra feature.
7. La semana del lunes que viene no se filtra: las reservas no guardan fecha, solo día de la semana y franja, así que se exportan todas las de la sala. Lo de la fecha concreta va a «No entra».
8. Nombre de la capacidad nueva: `room-bookings-export`.
9. Política de modelos (`delegate`): revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.
10. Delta probado en una copia de `.docs/sdd` fuera del repo: `sdd capability merge` termina bien (5 requisitos y 5 reglas añadidos a `room-bookings-export`) y `sdd capability check --artifact` da «Capacidades válidas: 1».

### Hallazgos de la review

Esta sesión no tiene herramienta para lanzar un subagente, así que el revisor no se despachó: apliqué yo los siete puntos del brief y no es una revisión independiente.

- **Aceptado** — el orden de los días fuera de la lista (decisión 3) no tenía escenario → queda como decisión 3 de ✋, sin THEN, porque hoy no hay ningún día fuera de la lista.
- Sin hallazgos en capacidades existentes (no hay ninguna), `MODIFIED` (no hay), ejemplos (inventados) ni dependencias (ninguna).

### Decisiones tomadas con el dev-lead

- Salida por la salida estándar, sin escribir ficheros — «Opción 1️⃣: por la salida estándar. Yo lo redirijo a un fichero.»
- Separador `;` — «Punto y coma (`;`), porque el Excel del responsable está en castellano.»
- Contenido: las reservas de una sala, para cuadrarlas el lunes en la hoja de cálculo — «Las reservas de esa sala de la semana que empieza el lunes que viene, para cuadrarlas en su hoja de cálculo.»

## Intent

Hoy `salas` reserva y cancela, pero no saca las reservas de una sala. El responsable de cada sala las cuadra los lunes en una hoja de cálculo, y tendría que copiarlas a mano. Con `salas exportar Norte > norte.csv` el responsable se lleva las reservas de esa sala en un fichero que abre su Excel en castellano con una columna por campo. El éxito es abrirlo sin importar ni cambiar el separador. Sería un fracaso que todo apareciera en una sola columna, o que faltara o sobrara una reserva.

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js`, con su test en `test/app.test.js`.
- Entra: una línea en `README.md` con el uso del comando.
- No entra: filtrar por fecha o por «la semana del lunes que viene», porque las reservas no guardan fecha.
- No entra: escribir ficheros; el responsable redirige la salida.
- No entra: exportar todas las salas a la vez, otros formatos (`.ics` es la 0009) y los avisos por correo (0008).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv"`, que solo encuentra la fila 0009 (`.ics`), otra feature.

## Approach

- Función pura `exportBookings(room)` en `src/app.js`, que devuelve el texto y la llama `run`, como `freeRooms`. Se prueba sola con `run`, como los tests actuales.
- Fichero aparte `src/csv.js`: separaría el formato, pero para un comando de ~15 líneas es más estructura que código.
- Escribir el fichero desde el comando: lo descartó el dev-lead (por la salida estándar).
- Elegido: la función en `src/app.js` — es el único fichero de entrada (`operations.md`) y no hay dependencias.

El separador `;` y la cabecera son constantes del módulo, para cambiarlos en un solo sitio.

## Dónde se prueba

- `exportar` con reservas, sin reservas, sala inexistente y sin argumento: por `run('exportar', [...])`, como los tests actuales de `libres` y `cancelar`.
- Apertura en Excel en castellano: a mano, por el dev-lead, en la validación.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-bookings-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala `Norte` con reservas `lun 10:00-12:00` y `mar 09:00-10:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida es `sala;dia;franja`, `Norte;lun;10:00-12:00` y `Norte;mar;09:00-10:00`, una por línea y separadas por `\n`

#### ADDED — Las reservas salen ordenadas por día y franja

- GIVEN la sala `Norte` con reservas `mar 09:00-10:00`, `lun 14:00-15:00` y `lun 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN las filas salen en el orden `lun 10:00-12:00`, `lun 14:00-15:00`, `mar 09:00-10:00`

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es solo `sala;dia;franja`

#### ADDED — Una sala inexistente se avisa

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Oeste`
- THEN la salida es `sala desconocida: Oeste`, sin cabecera ni filas

#### ADDED — Sin sala se indica el uso

- GIVEN el comando sin argumentos
- WHEN se ejecuta `exportar`
- THEN la salida es `uso: exportar <sala>`

#### Reglas de la capacidad — room-bookings-export

- **Dónde viven los datos**: la lista de reservas en memoria de `src/app.js`
- **Idioma de los nombres**: castellano, sin tildes en las columnas
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` · `uso: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
