---
id: 20261113-152111-feature-0010-exportar-reservas-csv
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

🦆 Hasta ahora no hay forma de sacar las reservas de una sala de la herramienta. Con esto, `node src/app.js exportar Norte > norte.csv` deja en `norte.csv` una fila por reserva, con las columnas separadas por `;` para que el Excel en castellano del responsable de la sala las abra ya divididas: `Norte;lun;10:00-12:00`. El CSV sale por la salida estándar, y si algo falla (sala que no existe, sala sin indicar) el aviso sale por la salida de errores, para que nunca acabe dentro del fichero. Por dentro, es una función nueva en `src/app.js` junto a `libres` y un `catch` en la entrada para los errores.

Validación: dev-lead — lo usa una persona y el éxito es abrir el fichero en su hoja de cálculo sin arreglarlo a mano; el agente no puede verlo en un Excel en castellano.

## Capacidades

- Nuevas: `booking-export` — exportar las reservas de una sala a CSV para la hoja de cálculo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el CSV es un formato de fichero que consume la hoja de cálculo) · tamaño: ~45 líneas en 3 ficheros
- Dominio (sonnet): si el CSV cubre lo que el responsable necesita para cuadrar (columnas `sala;día;franja`, sala sin reservas) y si los avisos de error nunca pueden acabar dentro del fichero redirigido (señal: contrato público)
- Técnica (sonnet): si el entrecomillado de «Entrecomillado de campos» y el `catch` de la entrada no cambian la salida de `libres`, `reservar` y `cancelar` (señal: capacidad nueva)
- Mínimo razonable: un solo revisor técnico — deja sin mirar si el CSV le sirve de verdad al responsable de sala

**La review NO se ha despachado**: esta sesión no tiene herramienta de subagentes, y lanzar un flujo multiagente necesita que lo pidas tú. Si apruebas así, la spec pasa sin review independiente; si prefieres que la haga, dímelo y se despacha desde una sesión que pueda.

1. **Nombre del comando: `exportar <sala>`.** Nadie lo dijo; sigue el estilo de `libres`, `reservar` y `cancelar` (verbo en castellano, sin guiones).
2. **Cabecera de una fila: `sala;día;franja`.** Va en castellano (constitución, art. IV) y con la tilde de «día». Sin cabecera el responsable no sabría qué columna es cuál al abrirlo.
3. **Marca BOM de UTF-8 al principio del fichero** (`﻿`). Un Excel en castellano que abre un CSV sin ella lee mal las tildes («mié» saldría «miÃ©»), incluida la de la cabecera. Cuesta tres bytes invisibles al principio; otras herramientas casi siempre los ignoran. Si el responsable no usa Excel o no te gusta, se quita en una línea.
4. **Entrecomillado de campos.** Un campo con `;`, `"` o salto de línea va entre comillas dobles, y las comillas dobles de dentro se duplican (`"10:00;12:00"`). La deuda ya apunta que la franja no se valida, así que hoy podría traer cualquier cosa.
5. **Una fila por reserva, en el orden en que están guardadas, con saltos de línea `\n`.** Sin ordenar por día: las reservas no tienen fecha y hoy no hay un orden de días definido.
6. **La sala se busca con el nombre exacto** (`Norte`, no `norte`), igual que está en la lista de salas. El aviso de error lista las salas válidas, así que corregirlo es inmediato.
7. **Una sala sin reservas da solo la cabecera.** Un fichero vacío o sin cabecera parecería un fallo; así se ve que la sala existe y está libre.
8. **Los errores salen por la salida de errores y terminan con código 1**, nunca por la salida estándar. Si salieran por stdout, `> norte.csv` guardaría el aviso como si fuera una fila y no te enterarías. Textos literales: `no existe la sala «Oeste»; salas: Norte, Sur` y `uso: exportar <sala>`.
9. **Enfoque: función nueva en `src/app.js`, frente a módulo aparte y frente a escribir el fichero** (ver Approach).
10. **La capacidad nueva se llama `booking-export`** (slug en inglés kebab-case, como pide la plantilla de capacidades). Hoy `capabilities/` está vacía: ninguna otra capacidad cubre las reservas.
11. **Una línea en `README.md`** con el comando y la redirección. No la pediste; sin ella nadie sabría que existe.
12. **Fila 0010 en `ROADMAP.md`**, en Now con `🔄 en curso`, porque el id salió de la secuencia sin fila previa. `Toca`: `src/app.js`, `test/app.test.js`, `README.md`.
13. **Pasada de coherencia hecha**: no se retira nada (`git grep` sin más hits que la fila 0009 y el `export` de `run`), y el delta probado sobre una copia de `.docs/sdd` con `sdd capability merge` (5 requisitos y 5 reglas añadidos, sin errores) y `sdd capability check` (`Capacidades válidas: 1`). El repo no se ha tocado.
- Política de modelos: revisores de la spec con sonnet (dominio y técnica), ninguno despachado en esta sesión · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo previstos · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- El CSV sale por la salida estándar y no se escribe ningún fichero — «Por la salida estándar: yo lo redirijo a un fichero con `>`.»
- El separador de columnas es `;` — «Punto y coma (`;`), porque el Excel del responsable está en castellano.»

## Intent

El responsable de cada sala cuadra los lunes las reservas de su sala en su hoja de cálculo, y hoy no puede sacarlas de la herramienta. Se quiere un comando que dé las reservas de una sala en CSV. El éxito es que el responsable abra el fichero en su Excel en castellano y vea tres columnas bien divididas, con las tildes bien, sin tocar nada a mano. Fracasa si abre una sola columna con todo dentro, si ve «miÃ©», o si el fichero trae un aviso de error en lugar de reservas.

## Scope

- Entra: el comando `exportar <sala>`, que escribe en la salida estándar la cabecera y una fila por reserva de la sala, con `;` y entrecomillado (decisiones 2 a 5).
- Entra: los avisos de error del comando por la salida de errores, con código de salida 1 (decisión 8).
- Entra: una línea en `README.md` con el comando y la fila 0010 en `ROADMAP.md`.
- No entra: escribir ficheros (lo hace la redirección del usuario), filtrar por día o por franja, exportar todas las salas a la vez, otros formatos (el `.ics` es la fila 0009), ni validar el formato de la franja (deuda ya anotada).
- No entra: cambiar `libres`, `reservar` o `cancelar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "exportar\|csv\|export"` fuera de `.docs/sdd/specs`: solo `ROADMAP.md:19` (fila 0009, `.ics`) y `src/app.js:9` (`export function run`) | ninguno: la 0009 es otro formato y otro comando, sin solape |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv|export"`. La fila 0010 de `ROADMAP.md` se añade con esta feature.

## Approach

- **A. Función nueva en `src/app.js`, junto a `freeRooms`** — una función pura `reservasCsv(sala, lista = bookings)` y el cableado de `exportar` en `run`. Es lo más pequeño: las reservas ya viven ahí, y el parámetro `lista` permite probar con datos propios. Coste: `app.js` crece unas 25 líneas.
- **B. Módulo aparte `src/exportar.js`** — se prueba solo. Coste: `bookings` es privado de `app.js`, así que habría que exportarlo o pasarlo, para sacar 25 líneas de un fichero de 15.
- **C. Escribir el fichero desde el código** — descartada por el dev-lead («yo lo redirijo a un fichero con `>`»).
- Elegido: A — es lo único que no añade estructura nueva y encaja con cómo está hecho el resto.

Fijado por el enfoque:
- `run` lanza un `Error` con el texto del aviso cuando falla `exportar`. La entrada (`if (command)`) lo captura, escribe el mensaje con `console.error` y deja `process.exitCode = 1`. Los demás comandos no lanzan, así que su salida no cambia.
- La salida es `﻿` + cabecera + filas unidas por `\n`; `console.log` añade el último salto.

## Dónde se prueba

- Cabecera, filas, BOM, sala sin reservas y entrecomillado: llamando a `reservasCsv(sala, lista)` con datos propios, y por `run('exportar', ['Norte'])` para la reserva sembrada, como los tests de `test/app.test.js`.
- Errores (sala inexistente, sin sala): `run` lanza el `Error` con el texto literal (`assert.throws`).
- Salida de errores y código de salida: lanzando `node src/app.js exportar Oeste` como proceso hijo (`node:child_process`, sin dependencias nuevas) y comprobando stdout vacío, stderr y código 1.
- El Excel en castellano: lo valida el dev-lead al cerrar, abriendo el fichero.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala Norte con la reserva `lun`, `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida estándar es `sala;día;franja` y debajo `Norte;lun;10:00-12:00`, con el separador `;`, y empieza por la marca BOM de UTF-8
- AND el código de salida es 0

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida estándar es solo `sala;día;franja`, sin ninguna fila
- AND el código de salida es 0

#### ADDED — Entrecomillado de campos

- GIVEN la sala Norte con una reserva `mié`, `10:00;12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la fila sale como `Norte;mié;"10:00;12:00"`, con la tilde de «mié» bien
- AND un campo con `"` o con salto de línea también va entre comillas dobles, y las comillas de dentro se duplican

#### ADDED — Una sala que no existe no produce CSV

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `exportar Oeste`
- THEN la salida estándar queda vacía y la salida de errores dice `no existe la sala «Oeste»; salas: Norte, Sur`
- AND el código de salida es 1

#### ADDED — Exportar sin indicar la sala no produce CSV

- GIVEN cualquier estado de las reservas
- WHEN se ejecuta `exportar` sin sala
- THEN la salida estándar queda vacía y la salida de errores dice `uso: exportar <sala>`
- AND el código de salida es 1

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: no aplica: lee las reservas que ya guarda `src/app.js` y no guarda nada
- **Idioma de los nombres**: castellano: la cabecera `sala;día;franja` y los avisos
- **Límites**: no aplica
- **Avisos**: los errores van por la salida de errores con código de salida 1, nunca por la salida estándar
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
