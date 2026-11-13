---
id: 20261113-142149-feature-0010-exportar-csv-sala
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

🦆 Hasta ahora no hay forma de sacar las reservas de una sala de la terminal. Con `salas exportar Norte` saldrá por pantalla una tabla de texto con una fila por reserva, por ejemplo `Norte;lun;10:00-12:00`, separada por punto y coma. Tú la guardas con `salas exportar Norte > norte.csv` y el responsable de la sala la abre en su Excel en castellano, donde sale ya en columnas. Si la sala no existe, el comando avisa por la vía de los errores y no escribe nada en el fichero.

Validación: dev-lead — el CSV lo abre una persona en su hoja de cálculo, y que salga en columnas en un Excel en castellano solo lo comprueba quien lo abre.

## Capacidades

- Nuevas: `booking-export` — exportar las reservas de una sala a CSV

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el CSV lo consume la hoja de cálculo del responsable) · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (sonnet): si la cabecera `sala;dia;franja` y las filas de «Exportar las reservas de una sala en CSV» bastan para que el responsable cuadre la semana, y qué pasa con una sala sin reservas (señal: capacidad nueva). Sonnet porque no hay reglas de negocio ni roles.
- Técnica (sonnet): si el error de sala desconocida por la salida de errores con código 1 es compatible con `run()`, que hoy solo devuelve texto, y con el arranque de `src/app.js` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el CSV sirve de verdad para cuadrar la semana en la hoja
- Lo que se hizo: esta sesión no tiene herramienta para lanzar subagentes, así que no hubo dos revisores. Hice yo la revisión con los siete puntos, leyendo la spec, `src/app.js`, `test/app.test.js` y la constitución. Es una revisión con menos independencia que la propuesta.

1. Nombre del comando: `exportar <sala>` — no lo dijo nadie; sigue el estilo de `libres`, `reservar`, `cancelar`.
2. Cabecera en la primera línea: `sala;dia;franja` — en minúsculas y sin tildes; una hoja de cálculo la toma como títulos de columna.
3. Una fila por reserva, en el orden en que están guardadas — hoy no hay fechas, solo día de la semana, así que no hay otro orden natural.
4. Saltos de línea `\n` (los de `console.log`) — Excel y LibreOffice los leen; no uso `\r\n`.
5. Sin BOM y sin escapado de campos — el BOM estropearía el fichero al encadenar la salida; ningún dato actual (salas fijas, día, franja) lleva `;` ni comillas.
6. La sala se busca por nombre exacto, respetando mayúsculas (`Norte`, no `norte`) — es como están guardadas.
7. Sala sin reservas: sale solo la cabecera — así el fichero de una sala vacía se abre igual que el de una con reservas.
8. Sala que no existe: `sala desconocida: Oeste` por la salida de errores, código de salida 1 y nada por la salida estándar — para que un `> fichero.csv` no mezcle el aviso con los datos.
9. Sin nombre de sala: `uso: salas exportar <sala>` por la salida de errores, código 1 — mismo motivo.
10. Capacidad nueva `booking-export` — la capacidad es el sustantivo del dominio; hoy no hay ninguna en `capabilities/`.
11. Enfoque: función pura en `src/app.js` y salida estándar, frente a escribir un fichero (ver Approach).
12. Delta probado sobre una copia de `.docs/sdd`: `sdd capability merge` termina bien y añade los 4 requisitos a `booking-export.md`; el `capabilities/` del repo no cambia.
13. Las reservas que exporta son las que el programa tiene en memoria en ese momento (hoy una sola, `Norte · lun · 10:00-12:00`) — ver el hallazgo 1 de la review; guardar reservas entre ejecuciones no entra.

### Hallazgos de la review

1. **Aceptado** — Importante · Intent y Scope: `reservar` no guarda nada y la lista de reservas está escrita dentro de `src/app.js`, así que cada ejecución de `salas exportar Norte` exporta siempre la misma única reserva; el responsable no vería reservas reales → añadido a Intent («Límite conocido») y a «No entra» (guardar reservas entre ejecuciones), y a la decisión 13. Esto afecta a si el comando te sirve de verdad el lunes: lo dejo para que lo decidas en el gate.
2. **Aceptado** — Menor · «Dónde se prueba»: el código de salida y la salida de errores no se ven llamando a `run()` → ya cubierto con la prueba por proceso hijo.
3. **Rechazado** — Menor · escapado de campos y BOM: hoy ningún dato lleva `;`, comillas ni tildes → queda en «No entra» y en las decisiones 5; se revisará cuando existan salas con esos caracteres.
- Política de modelos: revisores de la spec: dominio sonnet y técnica sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Decisiones tomadas con el dev-lead

- El separador es `;` — «Punto y coma (`;`), porque el Excel del responsable está en castellano.»
- La salida va por la terminal, sin crear fichero — «La opción 1️⃣, por la terminal: quiero la salida estándar y ya redirijo yo a un fichero.»
- Uso: el responsable abre el CSV en su hoja de cálculo y cuadra ahí las reservas de la semana, cada lunes — «El responsable de cada sala lo abre en su hoja de cálculo y cuadra ahí las reservas de la semana, cada lunes.»

## Intent

Hoy las reservas viven en memoria y solo se pueden consultar con `libres`, que no las lista. El responsable de cada sala las cuadra los lunes en su hoja de cálculo y no tiene de dónde sacarlas. Éxito: `salas exportar Norte > norte.csv` produce un fichero que un Excel en castellano abre en tres columnas (`sala`, `dia`, `franja`) sin pasos de importación. Sería un fracaso que se abriera todo en una sola columna o que el aviso de error acabara dentro del fichero.

Límite conocido: hoy `reservar` no guarda nada y la lista de reservas está escrita en `src/app.js`; el CSV de `Norte` contendrá siempre esa única reserva hasta que otra feature guarde las reservas entre ejecuciones.

## Scope

- Entra: el comando `exportar <sala>` con salida CSV por la salida estándar, y los avisos de error por la salida de errores.
- No entra: escribir ficheros desde el programa; filtrar por día o por semana (las reservas solo tienen día de la semana); exportar todas las salas a la vez; guardar reservas entre ejecuciones; escapado de campos; BOM; la exportación a calendario `.ics` (fila 0009 del roadmap, otra idea).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv"` (solo aparece la fila 0009, `.ics`, que es otra)

## Approach

- A. Función pura `exportCsv(room)` en `src/app.js`, llamada desde `run()` — cambia poco: un fichero, probable en un test como los de `libres` y `cancelar`. El error necesita que el arranque de `src/app.js` sepa decir «esto va por la salida de errores».
- B. Escribir el CSV a un fichero desde el comando — habría que decidir nombre, ruta y qué hacer si ya existe; el dev-lead lo descartó.
- Elegido: A, porque la salida estándar la fijó el dev-lead y es la forma de trabajar de los demás comandos.

`run()` hoy devuelve un texto que el arranque imprime con `console.log`. El plan decide cómo distinguir un error de un resultado (p. ej. que `run()` devuelva un objeto con texto y código para `exportar`) sin cambiar lo que devuelven los demás comandos.

## Dónde se prueba

- Exportar una sala con reservas, sin reservas, desconocida y sin nombre: llamando a `run('exportar', [...])`, como los tests actuales de `test/app.test.js`.
- Que el error sale por la salida de errores con código 1 y la salida estándar queda vacía: lanzando el programa como proceso hijo (`node src/app.js exportar Oeste`).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala en CSV

- GIVEN la sala `Norte` con la reserva `lun · 10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN la salida estándar es `sala;dia;franja` en la primera línea y `Norte;lun;10:00-12:00` en la segunda
- AND el código de salida es 0

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN la salida estándar es solo `sala;dia;franja`

#### ADDED — Una sala que no existe no exporta nada

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `salas exportar Oeste`
- THEN la salida de errores es `sala desconocida: Oeste`, el código de salida es 1 y la salida estándar queda vacía

#### ADDED — Exportar exige nombre de sala

- GIVEN el comando sin argumentos
- WHEN se ejecuta `salas exportar`
- THEN la salida de errores es `uso: salas exportar <sala>`, el código de salida es 1 y la salida estándar queda vacía

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
