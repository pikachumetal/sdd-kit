---
id: 20261114-160012-feature-0010-exportar-reservas-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-14
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Con `exportar Norte` sale por pantalla el CSV de las reservas de esa sala: una cabecera `sala;día;franja` y una línea por reserva, por ejemplo `Norte;lun;10:00-12:00`. Redirigido a un fichero (`exportar Norte > norte.csv`), el responsable de la sala lo abre los lunes en Excel en castellano y le salen tres columnas, con tildes bien. Si la sala no existe, no sale nada por pantalla: el error va aparte, para que no acabe dentro del fichero. Por dentro, el comando arma las líneas a partir de las reservas que ya conoce la herramienta.

Validación: dev-lead — lo que se comprueba es cómo se ve el fichero abierto en Excel, y eso solo lo observa una persona.

## Capacidades

- Nuevas: `bookings` — las reservas de las salas y cómo se consultan y se sacan de la herramienta.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (el formato del fichero lo consume la hoja de cálculo del responsable), capacidad nueva (`bookings`) · tamaño: ~30 líneas de código y ~40 de tests en 2 ficheros
- Dominio (sonnet): si la cabecera `sala;día;franja` y el aviso de sala desconocida bastan para cuadrar reservas los lunes, y si falta algo que el responsable necesite (señal: contrato público)
- Técnica (sonnet): si el BOM, el entrecomillado de `;` y `"` y el error por la salida de errores se comportan como dice el THEN con una redirección real (señal: contrato público)
- Mínimo razonable: un solo revisor técnico — deja sin mirar si las columnas sirven de verdad para cuadrar

**La review no se ha despachado:** esta sesión no dispone de la herramienta de subagentes. Me he releído la spec con los siete puntos del rubric y no he encontrado contradicciones, pero no cuenta como revisión independiente. Dime si quieres que se haga antes de implementar.

1. Capacidad nueva `bookings` (sustantivo del dominio, no la feature): las reservas hoy no tienen capacidad y esta es la primera que las describe — el delta solo añade el requisito de exportar.
2. Nombre del comando: `exportar <sala>` — nadie lo dijo; sigue la línea de `libres`, `reservar`, `cancelar`.
3. Enfoque: función pura `toCsv(filas)` + `exportBookings(sala)`, frente a escribir las cadenas a mano en `run` o a un fichero con `--salida` (ver Approach).
4. Cabecera `sala;día;franja`, en minúsculas y con tilde (texto en castellano, regla 4 de la constitution). Las filas salen en el orden en que están las reservas.
5. Sala sin reservas: sale solo la cabecera, para que el responsable vea una hoja vacía y no un error.
6. Sala desconocida o sin nombre de sala: error por la salida de errores y código de salida 1, sin nada por la salida normal. Literales: `sala desconocida: Oeste (salas: Norte, Sur)` y `falta la sala: exportar <sala>`. Motivo: con `> norte.csv` un mensaje por la salida normal acabaría como una fila más del CSV.
7. Un valor con `;`, `"` o salto de línea sale entre comillas dobles y con las comillas internas duplicadas. Hoy la franja no se valida (deuda «Sin validación del formato de franja horaria»), así que un valor así puede existir y partiría la fila en Excel.
8. Los nombres de sala se comparan tal cual (`Norte`, no `norte`) — igual que el resto de comandos, que no normalizan.
9. Fin de línea `\n` — Excel lo abre bien.
- Pasada de coherencia: nada se retira; el delta probado sobre una copia de `.docs/sdd` con `sdd capability merge` — 4 requisitos añadidos a `bookings.md`, sin rechazos.
- Política de modelos: revisores de la spec — ninguno despachado (sin herramienta de subagentes) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- El CSV usa `;` como separador y UTF-8 con BOM — «Excel, en castellano. El separador `;` les funciona.»
- Sale por pantalla y se redirige con `>`; sin opción para escribir el fichero — «No sé, decide tú.» (la decisión técnica es mía, la opción 1️⃣ recomendada; la tomo como delegada)
- Pendiente: quién ejecuta el comando (tú en el servidor o el responsable desde su equipo). No cambia el comportamiento; sí cambia cómo se entrega el fichero.

## Intent

Hoy el responsable de cada sala cuadra las reservas los lunes a mano, sin una vista suya. Se quiere que un comando le dé las reservas de su sala en un fichero que abra directamente en su hoja de cálculo. Éxito: `exportar Norte > norte.csv` se abre en Excel en castellano con tres columnas y los datos de Norte, sin pasos de importación. Fracaso, aunque «funcione»: que Excel meta cada fila en una sola celda, que las tildes salgan rotas, o que un mensaje de error acabe como fila dentro del fichero.

## Scope

- Entra: comando `exportar <sala>` con el CSV descrito; errores de sala desconocida y de sala ausente.
- No entra:
  - Filtrar por día o por franja.
  - Escribir el fichero con una opción (`--salida`).
  - Exportar a calendario (`.ics`): es la fila 0009, aparte.
  - Neutralizar celdas que empiezan por `=` en la hoja de cálculo: el producto lo usa una sola persona y la deuda de validar la franja es otra.
  - Guardar las reservas que crea `reservar`: hoy `reservar` no guarda nada y las reservas salen de una lista fija en el código, así que `exportar` muestra lo mismo que ve `libres`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: ninguna — `git grep -nEi "export|csv"` solo da la fila 0009 (`.ics`, otra cosa) del `ROADMAP.md` y `export function run`; la fila 0010 se añade a `Now` con la apertura.

## Approach

- A. Escribir las líneas dentro de `run`, a mano: cabe en pocas líneas, pero el entrecomillado y el BOM no se pueden probar sin tocar la lista de reservas fija del módulo.
- B. Función pura `toCsv(filas)` que arma texto con BOM, `;` y comillas; y `exportBookings(sala)` que filtra las reservas y la llama. `run` solo despacha. `toCsv` se prueba con filas inventadas, que es la única forma de probar el entrecomillado hoy.
- C. B más `--salida fichero`: evita el problema de redirigir desde PowerShell clásico, pero añade escribir en disco y sus errores (ruta inválida, fichero existente) por algo que quien lo ejecuta en el servidor no necesita.
- Elegido: B — lo prueba todo con la costura que ya existe (`run` y funciones exportadas) y no añade opciones. C queda descartada con la decisión del dev-lead de redirigir con `>` y la 6.

Partes del cómo que fija B:
- `run('exportar', [sala])` devuelve el texto y lanza un `Error` con el literal de la decisión 6 en los dos casos de error.
- El arranque (`if (command)`) captura ese error, lo escribe por la salida de errores y deja `process.exitCode = 1`; el resultado normal sigue saliendo por `console.log`. `console.log` añade un salto de línea final: es el que cierra la última fila.

## Dónde se prueba

- Contenido del CSV de una sala (cabecera, filas, BOM, sala vacía): `run('exportar', ['Norte'])`, como los tests de `libres` actuales.
- Entrecomillado de `;`, `"` y salto de línea: `toCsv` con filas inventadas, porque la lista de reservas es fija.
- Errores de sala desconocida y ausente: `run` lanza el `Error` con el literal; y una prueba que lanza `src/app.js` como proceso (`exportar Oeste`) comprueba que no sale nada por la salida normal, el error sale por la de errores y el código es 1.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala Norte tiene una reserva el lunes de 10:00-12:00
- WHEN se ejecuta `exportar Norte`
- THEN sale por pantalla el texto que empieza por el BOM UTF-8 (`U+FEFF`) seguido de `sala;día;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`
- AND el separador es `;` y cada línea acaba en `\n`

#### ADDED — Una sala sin reservas se exporta con solo la cabecera

- GIVEN la sala Sur no tiene reservas
- WHEN se ejecuta `exportar Sur`
- THEN sale el BOM y `sala;día;franja`, sin más líneas

#### ADDED — Un valor con el separador se entrecomilla

- GIVEN una reserva de Norte con la franja `10:00;12:00` y otra con la franja `"tarde"`
- WHEN se arma el CSV de Norte
- THEN la primera sale como `Norte;lun;"10:00;12:00"` y la segunda como `Norte;lun;"""tarde"""`

#### ADDED — Exportar una sala que no existe es un error y no ensucia el fichero

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `exportar Oeste`
- THEN no sale nada por la salida normal, por la de errores sale `sala desconocida: Oeste (salas: Norte, Sur)` y el código de salida es 1
- AND con `exportar` sin sala, por la de errores sale `falta la sala: exportar <sala>`, con el mismo código de salida 1 y sin nada por la salida normal

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
