---
id: 20261113-153737-feature-0002-exportar-csv-reservas
feature: 0002
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

🦆 Hoy el responsable de salas no puede sacar las reservas de una sala de la herramienta. Con `salas exportar Norte` verá por pantalla `sala;dia;franja` y, debajo, `Norte;lun;10:00-12:00`; lo redirige a su fichero y lo abre en su Excel en castellano, que separa columnas con punto y coma. Por dentro, un comando nuevo `exportar` en `src/app.js` recorre las reservas de esa sala y une los campos con `;`.

Validación: dev-lead — lo usa una persona con su Excel: solo él puede ver si las columnas caen donde espera.

## Capacidades

- Nuevas: `booking-export` — exportar las reservas de una sala en CSV por la salida estándar.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el CSV lo consume su hoja de cálculo) · tamaño: ~30 líneas en 2 ficheros
- Dominio (sonnet): si el formato (cabecera, orden de columnas, `;`) sirve a cuadrar los lunes en Excel castellano y si «sala desconocida» sin CSV es lo que quiere (señal: contrato público)
- Técnica (sonnet): si lanzar un error desde `run` y pasarlo a stderr con código 1 encaja con el `console.log` actual del arranque y con los tests de `run` (señal: capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar si el formato cuadra con lo que su hoja espera

1. Nombre del comando: `exportar <sala>` — sigue el verbo en castellano de `libres`, `reservar`, `cancelar`.
2. Columnas y orden: `sala;dia;franja`, con la cabecera en la primera línea — son los tres campos de una reserva, y la cabecera le da nombre a las columnas en la hoja.
3. Orden de las filas: el de las reservas en la herramienta (orden de alta) — no hay otro criterio dicho.
4. Sala sin reservas: solo sale la cabecera — un CSV válido, vacío de datos.
5. Sala que no existe (`exportar Oeste`): nada por la salida estándar, el texto `sala desconocida: Oeste` por la de error y código de salida 1 — si no, el aviso acabaría dentro de su fichero redirigido.
6. Sin sala (`exportar`): mismo tratamiento, `falta la sala: salas exportar <sala>`.
7. Sin comillas ni escapes y sin BOM, saltos de línea `\n`, cada línea terminada en `\n` incluida la última — hoy nombres, días y franjas no llevan `;` ni comillas; sin BOM porque «Norte» y «Sur» no llevan acentos, y la cabecera es `dia` sin tilde por lo mismo. Si aparece una sala o un día con tilde, se añade BOM: es una fila nueva, nadie «corrige» esto antes.
7b. El nombre de sala se compara exacto, como en `libres`: `exportar norte` → `sala desconocida: norte` — no hay otra regla de mayúsculas en la herramienta.
7c. Argumentos sobrantes (`exportar Norte Sur`) se ignoran; `exportar ""` cuenta como sin sala — lo mínimo; no se dijo otra cosa.
7d. El comando solo lee: no crea ni cambia reservas ni escribe ficheros.
8. Capacidad nueva `booking-export` (slug en inglés kebab-case) — no existe ninguna en `capabilities/`.
9. Validación: `dev-lead` — lo usa él con su Excel.
9b. Los datos de prueba son la semilla de `app.js` (Norte con `lun 10:00-12:00`, Sur sin reservas); para probar varias reservas y el orden, la lógica es una función exportada `exportarCsv(sala, lista)` que `run` llama con `bookings` — así el test pasa su propia lista sin tocar la semilla.
10. Enfoque: A, frente a B y C (ver Approach).
- Delta probado en una copia: `sdd capability merge` añade los 2 requisitos de `booking-export` sin rechazos.
- Política de modelos (solo en `delegate`): revisores de la spec: dos, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- Dominio — varias reservas y orden: aceptado → escenario con Norte y una de Sur intercalada, y `exportarCsv(sala, lista)` para probarlo (✋ 9b).
- Dominio — mayúsculas: aceptado → comparación exacta (✋ 7b), con su AND.
- Dominio — nada más por stdout, solo lectura: aceptado → THEN exacto y ✋ 7d.
- Dominio — argumentos sobrantes: aceptado → ✋ 7c. Mensaje con las salas válidas: rechazado, nadie lo pidió.
- Dominio — BOM, `dia` sin tilde, `\n` final: aceptado → ✋ 7.
- Técnica — cómo se lanza el proceso, un test por THEN, `\n` final, acotar el `catch`, falta de sala, datos semilla: aceptados → «Dónde se prueba», Approach, ✋ 7, 7c y 9b.

### Decisiones tomadas con el dev-lead

- Separador `;` y salida estándar, para su Excel en castellano — «así me sirve» (responsable de salas, 2026-11-01, en la fila 0002).

## Intent

Hoy las reservas viven solo dentro de la herramienta y el responsable las cuadra los lunes a mano. Quiere copiarlas a su hoja de cálculo. Éxito: `node src/app.js exportar Norte > norte.csv` produce un fichero que su Excel abre con tres columnas (`sala`, `dia`, `franja`) sin pasos de importación. Fracaso aunque «funcione»: un aviso de error dentro del fichero, o todo en una sola columna por llevar `,`.

## Scope

- Entra: comando `exportar <sala>` en `src/app.js` y sus tests en `test/app.test.js`; entrada en el README con un ejemplo.
- No entra: exportar todas las salas, filtrar por día, otros formatos (`,`, `.ics` es la fila 0009), escribir el fichero desde la herramienta (lo redirige él).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira | — | — |

- Filas que implementa: 0002 → nada la nombra fuera de `ROADMAP.md`: comprobado con `git grep -n -iE "0002|csv|exportar" -- . ':!ROADMAP.md'` (sin resultados).

## Approach

- A: `exportarCsv(sala, lista)` (exportada, pura) devuelve las líneas unidas con `\n` **sin** `\n` final —lo pone `console.log`— y lanza `SalaError` (clase nueva) si la sala no existe o falta; `run('exportar', [sala])` la llama con `bookings`; el arranque (`if (command)`) envuelve `run` en `try/catch`, atrapa solo `SalaError` (otro error se relanza con su traza), escribe el mensaje por stderr y pone `process.exitCode = 1`.
- B: `run` devuelve el aviso como texto, como hace `libres` — no toca el arranque, pero el aviso acabaría en su fichero redirigido.
- C: un módulo `src/exportar.js` — separa más, pero con un solo fichero de entrada (`operations.md`) es estructura de más.
- Elegido: A — es la única que mantiene limpio el fichero que redirige.

Las salas válidas son las de `rooms` y las filas salen de `bookings` filtrando por sala.

## Dónde se prueba

- Formato y filas con datos propios (varias reservas, orden de alta, otra sala intercalada que no sale): `exportarCsv(sala, lista)`, test unitario como los de `run` actuales; sin `\n` final.
- Datos semilla: `run('exportar', ['Norte'])` y `['Sur']`.
- Contrato de redirección, como proceso con `spawnSync(process.execPath, [ruta, 'exportar', …], {encoding: 'utf8'})` con la ruta resuelta desde `import.meta.url`: caso feliz (`stdout === 'sala;dia;franja\nNorte;lun;10:00-12:00\n'`, `status 0`), `exportar Oeste`, `exportar norte` y `exportar` (`stdout === ''`, `stderr` igual al mensaje más `\n`, `status 1`). Importar `app.js` desde un test no dispara el arranque (`argv.slice(2)` vacío).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala en CSV

- GIVEN la sala Norte con la reserva `lun 10:00-12:00`
- WHEN `salas exportar Norte`
- THEN la salida estándar es exactamente `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`, cada una terminada en salto de línea, sin líneas en blanco ni texto de más
- AND código de salida 0, nada por la salida de error, y no se crea ni cambia ninguna reserva

- GIVEN Norte con `lun 10:00-12:00` y `mar 09:00-10:00`, y una reserva de Sur `lun 08:00-09:00` dada de alta entre las dos
- WHEN se exporta Norte
- THEN salen la cabecera y las dos filas de Norte, en ese orden, y no la de Sur

- GIVEN la sala Sur sin reservas
- WHEN `salas exportar Sur`
- THEN la salida estándar es solo `sala;dia;franja` más su salto de línea

#### ADDED — Una sala inexistente o ausente no ensucia el fichero

- GIVEN las salas Norte y Sur
- WHEN `salas exportar Oeste`
- THEN la salida estándar queda vacía, la de error dice `sala desconocida: Oeste` y el código de salida es 1
- AND con `salas exportar norte` dice `sala desconocida: norte` (el nombre se compara exacto)
- AND con `salas exportar` sin sala, o con `""`, la de error dice `falta la sala: salas exportar <sala>` y el código es 1

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
