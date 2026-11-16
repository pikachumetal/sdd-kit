---
id: 20261113-155619-feature-0010-exportar-reservas-csv
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

🦆 Hasta ahora, para cuadrar una sala los lunes hay que mirar las reservas a ojo. Con `salas exportar Norte` saldrá una tabla lista para la hoja de cálculo: una línea por reserva, con `sala;dia;franja` (por ejemplo `Norte;lun;10:00-12:00`), separada por punto y coma para que el Excel en castellano la abra ya en columnas. Se redirige a un fichero (`salas exportar Norte > norte.csv`) y se abre. Por dentro es una función pura que da formato a la lista de reservas y una rama nueva en `run`.

Validación: dev-lead — lo usa una persona en su hoja de cálculo; solo ella ve si se abre en columnas.

## Capacidades

- Nuevas: `room-bookings` — qué se puede hacer con las reservas de una sala (de momento, exportarlas).
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (el formato del CSV lo consume una hoja de cálculo), capacidad nueva · tamaño: ~40 líneas en 2 ficheros
- Dominio (sonnet): si el CSV de «Exportar las reservas de una sala a CSV» sirve de verdad para cuadrar los lunes (columnas, orden, sala vacía) (señal: contrato público)
- Técnica (sonnet): si el escapado de `;` y `"` y el orden por día salen bien con los datos reales de `src/app.js` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las columnas bastan para el cuadre del lunes

1. Nombre del comando: `exportar <sala>`, en castellano y en infinitivo como `reservar`, `cancelar` y `libres`; no ha dicho nadie otro.
2. Salida por pantalla (stdout), sin flag `--salida`: se redirige con `>`; un flag para fichero queda fuera (ver «No entra»).
3. Columnas y cabecera: `sala;dia;franja`, sin tilde en `dia` para no depender de la codificación; una línea de cabecera siempre.
4. Orden: por día de la semana (`lun`, `mar`, `mie`, `jue`, `vie`, `sab`, `dom`; un día que no sea de esa lista va después) y, dentro del día, por franja; así el lunes se lee de arriba abajo. La grafía `mie` (sin tilde) es mía, y la franja se ordena como texto (vale con horas de dos cifras, `09:00`).
5. Sala sin reservas: solo la línea de cabecera.
6. Sala que no existe: `sala desconocida: Oeste`, sin cabecera ni líneas, para que no se tome por un CSV vacío.
7. Sin sala (`salas exportar`): `uso: exportar <sala>`.
8. Salto de línea `\n`, sin BOM UTF-8: con un BOM, redirigir con `>` ensuciaría el fichero. Coste: Excel abriría un nombre de sala con tilde como texto en ANSI. Hoy las salas (`Norte`, `Sur`) no la llevan.
9. Un campo que contenga `;` o `"` sale entre comillas dobles, con `"` duplicada (`a;b` → `"a;b"`); por seguridad aunque hoy no ocurra.
10. Capacidad nueva `room-bookings` (el proyecto no tiene capacidades: es la primera). El requisito vive ahí y no en un fichero por feature.
11. El nombre de la sala se compara exacto, con mayúsculas, como hace `libres`: `exportar norte` da `sala desconocida: norte`.
12. Enfoque: A, frente a B y C (ver Approach).

### Hallazgos de la review

No pude despachar revisores (esta sesión no tiene herramienta de subagentes); hice yo las dos lentes con los siete puntos, y no equivale a dos revisores independientes.

- **Aceptado** — Técnica: el orden por franja es por texto y solo vale con horas de dos cifras → dicho en la decisión 4.
- **Aceptado** — Punto 4: la comparación exacta de la sala (`exportar norte`) no estaba declarada → decisión 11.
- **Rechazado** — Dominio: falta la fecha de cada reserva para cuadrar → la reserva solo guarda día de la semana y franja; queda en «No entra».

- Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: 5 requisitos y 5 reglas añadidos a `room-bookings.md`, sin rechazos.
- Política de modelos (solo en `delegate`): revisores de la spec en sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Formato con separador `;` — «1️⃣, punto y coma. El Excel del responsable está en castellano y así se abre en columnas.»

## Intent

El responsable de cada sala cuadra sus reservas los lunes en una hoja de cálculo; hoy tiene que copiarlas a mano. Quiere sacar de una sala todas sus reservas, en un formato que la hoja abra en columnas sin importar nada a mano. Éxito: `salas exportar Norte > norte.csv` produce un fichero que el Excel en castellano abre con tres columnas. Fracaso, aunque funcione técnicamente: que salga todo en una sola columna, o que una sala sin reservas o mal escrita parezca un CSV válido.

## Scope

- Entra: el comando `exportar <sala>` con la salida de arriba (cabecera, orden, sala vacía, sala desconocida, sin sala, escapado).
- No entra: exportar todas las salas de golpe; filtrar por fecha o semana (la reserva solo guarda día de la semana y franja); la opción `--salida` para escribir un fichero; el BOM; las reservas semanales (`--cada-semana`, que hoy no se guardan como datos); el `.ics` (fila 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada: no se retira ni cambia de forma ningún literal | — | — |

- Filas que implementa: nada: la 0010 no tiene fila en `ROADMAP.md`; comprobado con `git grep -niE "exportar|csv"` (solo aparece la fila 0009, distinta: `.ics`).

## Approach

- A: una función pura exportada `reservasCsv(sala, lista)` en `src/app.js` y una rama `exportar` en `run` que la llama con `bookings` — la más sencilla, un solo fichero de entrada como pide `operations.md`, y la función se prueba con listas propias (orden, escapado) sin tocar los datos reales.
- B: un módulo nuevo `src/exportar.js` — separa el código, pero para ~20 líneas añade un fichero y un import sin que nada lo pida.
- C: A más un flag `--salida fichero` — escribe él el fichero, pero añade ruta, sobrescritura y errores de disco; con `>` ya basta.
- Elegido: A — la más pequeña que cumple el Intent.

`run('exportar', [sala])` devuelve el texto completo; el `console.log` de la entrada añade el salto final.

## Dónde se prueba

- Cabecera, línea de una reserva, sala vacía, sala desconocida y sin sala: por `run`, como los tests actuales de `test/app.test.js`.
- Orden y escapado: directamente sobre `reservasCsv(sala, lista)` con listas propias, porque `bookings` no se puede modificar desde fuera.
- Que Excel lo abra en columnas: lo ve el dev-lead en la validación.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-bookings`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala Norte con la reserva lun 10:00-12:00
- WHEN se ejecuta `exportar Norte`
- THEN la salida es `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`
- AND solo salen las reservas de esa sala; la de otra sala no aparece

#### ADDED — Orden de las reservas exportadas

- GIVEN la sala Norte con mar 09:00-10:00, lun 14:00-15:00 y lun 10:00-12:00
- WHEN se exporta Norte
- THEN tras la cabecera salen `Norte;lun;10:00-12:00`, `Norte;lun;14:00-15:00` y `Norte;mar;09:00-10:00`, en ese orden

#### ADDED — Exportar una sala sin reservas

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es solo `sala;dia;franja`

#### ADDED — Exportar una sala que no existe o sin indicar sala

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `exportar Oeste`
- THEN la salida es `sala desconocida: Oeste`, sin cabecera
- AND con `exportar` sin sala, la salida es `uso: exportar <sala>`

#### ADDED — Campos con separador o comillas

- GIVEN una reserva de la sala Norte con franja `10:00;12:00`
- WHEN se exporta
- THEN esa línea sale como `Norte;lun;"10:00;12:00"`
- AND una `"` dentro de un campo se duplica (`a"b` sale `"a""b"`)

#### Reglas de la capacidad — room-bookings

- **Dónde viven los datos**: en memoria, en `src/app.js` (la lista `bookings`)
- **Idioma de los nombres**: castellano (`exportar`, `sala`, `dia`, `franja`)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` · `uso: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
