---
id: 20261113-220847-feature-0010-exportar-reservas-csv
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

🦆 Hoy no hay forma de sacar las reservas de una sala fuera de la terminal. Con `salas exportar Norte > norte.csv` te queda un fichero con una fila por reserva (`Norte;lun;10:00-12:00`), separado por `;` para que el Excel en castellano del responsable de la sala lo abra ya en columnas. Si la sala no existe, no se crea nada que parezca bueno: sale un error y el fichero queda vacío. Por dentro es un comando más junto a `libres` y `reservar`, que escribe el CSV por la salida normal y los errores por la de errores.

Validación: dev-lead — lo abre una persona en su hoja de cálculo, y que Excel en castellano lo separe en columnas solo se ve abriéndolo.

## Capacidades

- Nuevas: `room-export` — exportar a CSV las reservas de una sala

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-export`), contrato público (el CSV lo consume el Excel del responsable de cada sala) · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (sonnet): si los THEN de `room-export` cubren lo que el responsable necesita al abrir el fichero en Excel (sala sin reservas, sala que no existe, acentos) y si «todas las reservas de la sala» es lo que cuadra «las de la semana» (señal: capacidad nueva)
- Técnica (sonnet): si la marca BOM y el `;` de «Approach» hacen que Excel en castellano abra el fichero en columnas, y si el error por la salida de errores con código 1 es comprobable desde los tests (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si «todas las reservas» sirve de verdad para cuadrar la semana
- **Estado: NO despachada.** Esta sesión no dispone de herramienta de subagentes, así que ninguno de los dos revisores ha leído la spec: no hay «Hallazgos de la review». Lo único revisado es mi pasada de coherencia. Si apruebas así, apruebas una spec sin revisión adversarial.

1. Enfoque: función dentro de `src/app.js` que devuelve el texto, frente a un módulo nuevo y a escribir directo en la salida (ver Approach) — el proyecto tiene un solo fichero de entrada y 30 líneas de código.
2. La capacidad nueva se llama `room-export` — nombre en inglés kebab-case, como pide el kit.
3. Cabecera `sala;día;franja`, con acento en «día» — es texto de interfaz y la constitución pide castellano.
4. El fichero empieza por la marca BOM de UTF-8 — Excel en castellano la necesita para no estropear los acentos (la cabecera ya lleva uno).
5. Saltos de línea `\n` (no `\r\n`) — Excel abre las dos formas, y es lo que ya escribe `console.log`.
6. Sala sin reservas: sale solo la cabecera — así el fichero siempre abre igual.
7. «Las reservas de la semana» se exporta como todas las reservas de la sala: hoy cada reserva solo tiene día de la semana (`lun`), sin fecha, así que no hay nada que filtrar por semana.
8. Sala que no existe: error `sala desconocida: Zzz` por la salida de errores, código de salida 1, nada por la salida normal — para que la redirección no deje un CSV falso.
9. Sin argumento (`salas exportar`): error `falta la sala: uso: salas exportar <sala>`, mismo tratamiento que la sala desconocida.
10. El nombre de la sala se compara tal cual, mayúsculas incluidas (`norte` ≠ `Norte`), como hace `libres` — no abro otra regla.
11. Sin escapado de comillas ni de `;` dentro de los campos: las salas, días y franjas de hoy no los llevan. Entra cuando una sala se llame de otra forma.
- Repaso de coherencia: el delta probado en una copia de `.docs/sdd` fuera del repo — `sdd capability merge` sin rechazos (4 requisitos y 5 reglas añadidos a `room-export.md`) y `capability check`: «Capacidades válidas: 1»; los literales `sala;día;franja`, `sala desconocida: Zzz` y `falta la sala: uso: salas exportar <sala>` coinciden entre decisiones, Approach y THEN.
- Pendiente de ti: cómo cuadras cada reserva en la hoja — dijiste que no lo sabes; no cambia el formato, pero si después necesitas otra columna (p. ej. fecha), será otra feature.
- Política de modelos: revisores de la spec: ninguno despachado (sin herramienta de subagentes; la propuesta era dominio sonnet y técnica sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` (3)

### Decisiones tomadas con el dev-lead

- El CSV sale solo por la salida estándar; el usuario lo guarda con redirección — «Lo guardo en un fichero con la redirección y el lunes lo abro en mi hoja de cálculo»
- Separador `;`, porque el responsable de cada sala usa Excel en castellano — «El responsable de cada sala usa Excel en castellano, así que el `;` es lo que necesita»
- Comando `exportar <sala>` — «Sí, `exportar <sala>` es lo que propuse»

## Intent

Hoy las reservas de una sala solo se ven dentro del programa, y el responsable de cada sala las cuadra los lunes en su hoja de cálculo, así que las pasa a mano. Se quiere que `salas exportar <sala>` saque un fichero que Excel en castellano abra en columnas sin tocar nada. Éxito: `salas exportar Norte > norte.csv` y, al abrirlo, sala, día y franja salen en tres columnas, con los acentos bien. Anti-objetivo: un fichero que parezca bueno y esté mal (error mezclado dentro del CSV, o columnas pegadas en una sola).

## Scope

- Entra: el comando `exportar <sala>` con su CSV, sus dos errores y sus tests.
- No entra: filtrar por fecha o por semana (las reservas no tienen fecha), exportar todas las salas a la vez, escapado de campos, otras columnas, exportar a calendario (`.ics`, fila 0009 de Later), cambiar `libres`, `reservar` o `cancelar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -n -iE "0010|exportar|csv"` (solo la fila 0009 de Later, otra idea: `.ics`)

## Approach

- A. Una función `exportar(sala)` en `src/app.js` que devuelve el texto y lanza un error con el mensaje; el arranque del fichero lo captura, escribe el mensaje por la salida de errores y fija el código 1 — cuesta: `run` hoy no conoce errores y el arranque gana un `try/catch`.
- B. Un módulo nuevo `src/exportar.js` — cuesta un fichero y una importación para ~15 líneas; `operations.md` dice «un solo fichero de entrada».
- C. Que `exportar` escriba directo con `process.stdout.write` — cuesta que los tests de `run` ya no ven el resultado, y el proyecto prueba `run`.
- Elegido: A — la función se prueba como las demás, por `run`, y solo el arranque toca las salidas.

Partes que fija: `run('exportar', [sala])` devuelve `﻿` + cabecera + una línea por reserva de esa sala, unidas por `\n`; sala desconocida o ausente lanza `Error` con el literal de la decisión 8 o 9.

## Dónde se prueba

- Contenido del CSV (con reservas, sin reservas): por `run('exportar', …)`, como los tests actuales de `libres`.
- Errores (sala desconocida, sin argumento): por `run`, que lanza, y un test que lanza el programa de verdad (`node src/app.js exportar Zzz`) y mira que la salida normal esté vacía, la de errores lleve el mensaje y el código sea 1.
- Que Excel en castellano lo abra en columnas: lo valida el dev-lead a mano con un fichero real.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala Norte tiene una reserva el lun de 10:00-12:00
- WHEN se ejecuta `salas exportar Norte`
- THEN la salida normal es la marca BOM de UTF-8 y, en dos líneas separadas por `\n`, `sala;día;franja` y `Norte;lun;10:00-12:00`
- AND el separador es `;`

#### ADDED — Una sala sin reservas sale solo con cabecera

- GIVEN la sala Sur no tiene reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN la salida normal es la marca BOM y la línea `sala;día;franja`, sin más líneas

#### ADDED — Una sala que no existe no produce CSV

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `salas exportar Zzz`
- THEN no sale nada por la salida normal, la salida de errores dice `sala desconocida: Zzz` y el código de salida es 1

#### ADDED — Exportar exige una sala

- GIVEN cualquier estado
- WHEN se ejecuta `salas exportar` sin sala
- THEN no sale nada por la salida normal, la salida de errores dice `falta la sala: uso: salas exportar <sala>` y el código de salida es 1

#### Reglas de la capacidad — room-export

- **Dónde viven los datos**: las reservas en memoria de `src/app.js`; el CSV no se guarda en ningún sitio, lo guarda quien redirige la salida
- **Idioma de los nombres**: castellano (`sala`, `día`, `franja`, mensajes de error)
- **Límites**: no aplica
- **Avisos**: los errores van por la salida de errores, nunca por la normal
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
