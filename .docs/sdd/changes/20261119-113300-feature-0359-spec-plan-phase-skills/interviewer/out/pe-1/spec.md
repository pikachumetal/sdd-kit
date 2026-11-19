---
id: 20261119-155159-feature-0010-exportar-reservas-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Un comando nuevo saca las reservas de una sala como CSV para pegarlas en una hoja de cálculo: `exportar Norte` imprime `sala;dia;franja` y una fila por reserva, por ejemplo `Norte;lun;10:00-12:00`. Si la sala no existe, da un error en vez de un CSV vacío, para que un typo no parezca «sin reservas». Solo usa lo que las reservas guardan hoy (sala, día, franja).

Validación: dev-lead — lo usa una persona y lo que sale se abre en una hoja de cálculo real; el agente no puede ver cómo la importa.

## Capacidades

- Nuevas: `booking-export` — exportar a CSV las reservas de una sala.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el CSV es un formato de fichero que consume la hoja de cálculo) · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (opus): si falta el complemento de la sala sin reservas y de la sala inexistente, y si los THEN de «Orden de las filas» y «Sala sin indicar» pasarían sin el comportamiento (señal: capacidad nueva)
- Técnica (sonnet): si el error por stderr con código 1 es compatible con `if (command) console.log(run(...))` y si el orden por texto de la franja aguanta (señal: contrato público)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin segunda lente separada sobre el contrato del CSV
```

**Lo que no se hizo como pide la rúbrica:** esta sesión no tiene herramienta para despachar subagentes, así que no hubo dos revisores independientes. Los siete puntos del brief los pasé yo en el hilo, sobre `spec.md`, `constitution.md` y `PRODUCT.md` (no hay `capabilities/` que contrastar). Es una revisión del mismo agente que escribió la spec y vale menos que la de un revisor aparte; el dev-lead decide en el gate si quiere repetirla desde una sesión que pueda despachar.

1. **Nombre del comando: `exportar <sala>`** — nadie lo dijo; sigue el verbo en infinitivo de `reservar`, `cancelar` y `libres` (`src/app.js`).
2. **Sala sin reservas: solo la cabecera `sala;dia;franja`** — es el caso vacío natural; el typo ya no se confunde con él gracias a la decisión del dev-lead sobre sala inexistente.
3. **Salida por pantalla (stdout)**, sin fichero propio; se guarda con `> norte.csv` — `run()` devuelve una cadena y `app.js` la imprime, como los demás comandos.
4. **Orden de las filas: lun, mar, mie, jue, vie, sab, dom y, dentro de un día, por franja** — un `sort()` alfabético pondría `jue` antes de `lun`. Un día fuera de esa lista va al final, ordenado por texto.
5. **Sin escapado de comillas ni de `;`** — hoy salas, días y franjas no llevan `;`, `"` ni saltos de línea. Si algún día los llevan, hay que escapar y es otra tarea.
6. **Cabecera `sala;dia;franja` sin tilde y fin de línea `\n`** — `dia` sin tilde es como lo escribió el dev-lead; `\n` por defecto (Excel lo lee bien) y sin BOM, porque no hay acentos en el CSV.
7. **Sin argumento (`exportar` a secas)** — error `falta la sala: uso exportar <sala>`, código de salida 1. Nadie lo dijo; se queda en la línea del error de sala inexistente.
8. **Nombre de sala exacto, con mayúscula** (`Norte`, no `norte`) — igual que `libres`, que compara por igualdad.
9. **El error sale por stderr y termina con código 1; en stdout no va nada** — para que `exportar Oeste > oeste.csv` no deje un fichero con el mensaje dentro como si fuera un CSV.
10. **Nombre de la capacidad nueva: `booking-export`** — slug en inglés, kebab-case.
- **Enfoque**: A (función `exportar` aparte en `app.js` y `run` la llama), frente a B (CSV dentro de `run`) y C (módulo `src/csv.js`); ver Approach.
- Prueba del delta sobre una copia de `.docs/sdd`: `capability merge` sin rechazos, 5 requisitos añadidos a `booking-export.md`; `capabilities/` del repo sin tocar.
- Orden por franja: es por texto, y vale mientras la hora lleve cero a la izquierda (`09:00`); sin validar el formato de la franja (deuda sin triar), una `9:00` saldría después de `10:00`. Se apunta, no se arregla aquí.
- Política de modelos: revisores de la spec, los que dimensione `sdd-spec-review` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Revisión en el hilo con los siete puntos (ver arriba), sin críticos: no hay segunda ronda.

- **Aceptado** — Menor · Scope · el cambio del bloque que imprime en `app.js` (capturar el error, stderr, código 1) no estaba en «Entra» → añadido a «Entra».
- **Aceptado** — Menor · Delta · «Avisos» nuevos (dos mensajes de error) sin declarar en «Reglas de la capacidad» → añadido el bloque; el resto, «no aplica».
- **Aceptado** — Menor · Intent y Validación · el éxito («se abre en columnas») depende de la configuración regional de la hoja: con `;` las hojas en castellano separan solas, y una en inglés no → el dev-lead lo comprueba en su hoja al validar; el `;` es decisión suya.
- **Rechazado** — Menor · THEN de «Sala sin indicar» con GIVEN «cualquier estado» → se queda: el resultado no depende del estado, y un GIVEN inventado sería ruido.
- Sin hallazgos en los puntos 1 (no hay `capabilities/`), 5 (no hay roles ni estados) ni 7 (los ejemplos son datos del propio proyecto: `Norte`, `Sur`).

### Decisiones tomadas con el dev-lead

- Columnas: tres, con la sala en cada fila — «Me quedo con la 1️⃣: tres columnas, `sala;dia;franja`, porque la sala es lo que el responsable necesita en cada fila.»
- Separador `;` (de esa misma frase).
- Sala que no existe: error, no CSV vacío — «Me quedo con la 1️⃣: si escribo mal el nombre de la sala, quiero un error y no una hoja vacía que parezca «sin reservas».»
- **Pendiente (no sabe):** qué compara exactamente el responsable los lunes, con qué, y qué le haría ver que algo no cuadra — «No sé qué compara exactamente, con qué, ni qué le haría ver que algo no cuadra.» Por eso el CSV se limita a lo que las reservas guardan hoy.

## Intent

El responsable de cada sala cuadra los lunes sus reservas en una hoja de cálculo, y hoy `salas` no le da una forma de sacarlas: solo tiene `libres`, `reservar` y `cancelar`. Se quiere un comando que le dé las reservas de su sala en un formato que la hoja abra directamente. Éxito: `exportar Norte` da un CSV que se abre en columnas en la hoja sin retocarlo.

Anti-objetivo: que un typo en el nombre de la sala dé una hoja vacía que parezca «sin reservas» y haga que algo cuadre sin ser verdad. El dev-lead no sabe aún qué compara el responsable; si en el uso real echa algo en falta, será otra feature.

## Scope

- Entra: un comando `exportar <sala>` que imprime el CSV de las reservas de esa sala, con cabecera, en el orden de la decisión 4.
- Entra: el error por sala inexistente y por sala ausente (decisiones 7 y 9), con el cambio en el bloque que imprime de `src/app.js` para capturarlo, escribirlo en stderr y salir con código 1.
- No entra: columnas que las reservas no guardan hoy (quién reservó, fecha concreta).
- No entra: exportar todas las salas a la vez, escribir a un fichero con nombre propio, otros formatos (`.ics` es la fila 0009) y validar el formato de la franja (deuda sin triar).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `grep -rn "0010\|csv\|exportar" ROADMAP.md PRODUCT.md README.md CHANGELOG.md .docs` (sin resultados).

## Approach

- A: una función `exportar(sala)` en `src/app.js`, y `run('exportar', …)` la llama — una función pura de unas pocas líneas, se prueba con `run()` como los tests actuales.
- B: meter el CSV directo dentro de `run` — menos líneas, pero `run` mezcla ya tres comandos y se vuelve más difícil de leer y de probar.
- C: un módulo aparte `src/csv.js` — sobra para una sola exportación de tres columnas, y el proyecto tiene un solo fichero de entrada (`operations.md`).
- Elegido: A — es lo que cabe en la estructura de un fichero, sin dependencias, y cada regla (cabecera, orden, error) se prueba con `run()`.

Cómo, dicho en lo que fija el enfoque:
- Las reservas son las de `bookings` filtradas por `room === sala`.
- Sala inexistente es la que no está en `rooms`.
- `run('exportar', [sala])` lanza un `Error` con el texto del mensaje; el bloque que imprime en `app.js` lo captura, escribe el mensaje en stderr y sale con código 1.
- `run('exportar', …)` devuelve la cadena entera, sin `\n` final extra, que `console.log` ya añade.

## Dónde se prueba

- Cabecera y filas: `run('exportar', ['Norte'])` en `test/app.test.js`, como los tests de `libres` y `cancelar`.
- Sala sin reservas: `run('exportar', ['Sur'])` da solo la cabecera.
- Sala inexistente y sala ausente: `assert.throws` sobre `run` con el mensaje exacto.
- Orden: una prueba con varias reservas en días desordenados.
- Stderr y código de salida 1: un test que lanza `node src/app.js exportar Oeste` con `child_process` y comprueba código, stderr y stdout vacío.
- Apertura real en la hoja de cálculo: la validación del dev-lead.

## Términos y ADR

- Términos resueltos: ninguno.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala `Norte` con las reservas `lun 10:00-12:00` y `mar 09:00-10:00`
- WHEN se ejecuta `exportar Norte`
- THEN sale por stdout `sala;dia;franja`, `Norte;lun;10:00-12:00` y `Norte;mar;09:00-10:00`, una por línea
- AND solo salen las reservas de esa sala, no las de `Sur`

#### ADDED — Orden de las filas

- GIVEN `Norte` con `jue 09:00-10:00`, `lun 11:00-12:00` y `lun 10:00-11:00`
- WHEN se ejecuta `exportar Norte`
- THEN las filas salen `lun 10:00-11:00`, `lun 11:00-12:00`, `jue 09:00-10:00`

#### ADDED — Sala sin reservas

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN sale solo `sala;dia;franja`

#### ADDED — Sala que no existe

- GIVEN que no hay una sala `Oeste`
- WHEN se ejecuta `exportar Oeste`
- THEN no sale nada por stdout, por stderr sale `sala desconocida: Oeste` y el comando termina con código 1

#### ADDED — Sala sin indicar

- GIVEN cualquier estado
- WHEN se ejecuta `exportar` sin sala
- THEN no sale nada por stdout, por stderr sale `falta la sala: uso exportar <sala>` y el comando termina con código 1

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: no aplica (se leen de `bookings`, sin datos nuevos)
- **Idioma de los nombres**: no aplica
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` y `falta la sala: uso exportar <sala>`, ambos por stderr
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
