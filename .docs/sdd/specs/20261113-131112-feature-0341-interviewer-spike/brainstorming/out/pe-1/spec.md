---
id: 20261113-150305-feature-0010-exportar-csv
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

🦆 Hasta ahora las reservas de una sala solo se veían dentro del programa. Con esta feature, `node src/app.js exportar Norte > norte.csv` deja un fichero que Excel en castellano abre en tres columnas: `sala;dia;franja`, y debajo `Norte;lun;10:00-12:00`. Si la sala no existe, el programa avisa por el canal de errores y no escribe nada en el fichero. Por dentro, un comando nuevo `exportar` en `src/app.js`.

Validación: dev-lead — lo usa una persona con Excel; el agente no puede ver cómo lo abre.

## Capacidades

- Nuevas: `booking-export` — salida de las reservas de una sala en un formato que abre la hoja de cálculo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el CSV lo consume la hoja de cálculo del responsable) · tamaño: ~25 líneas en 2 ficheros
- Dominio (sonnet): si `sala;dia;franja` y la sala sin reservas (solo cabecera) bastan para cuadrar los lunes (señal: contrato público)
- Técnica (sonnet): si el error por `stderr` con código 1 deja el `> norte.csv` limpio y si `exportar` sin sala está cubierto (señal: contrato público)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin mirar a fondo el formato frente a Excel
- **No se ha dispatchado ninguna review**: esta sesión no dispone de la herramienta para lanzar subagentes. Los siete puntos los he pasado yo, sin lente independiente; si la quieres, dímelo y se lanza antes de implementar.

1. Separador `;` y no `,` — Excel en castellano espera el punto y coma; con comas abre una sola columna. (Tú dijiste que usas Excel en castellano; el separador es mío.)
2. Columnas `sala;dia;franja`, con cabecera, en el orden en que están las reservas — sin tilde en `dia` para que no dependa de la codificación. Tuyo solo el contenido (una fila por reserva); lo demás es mío.
3. Sala sin reservas: solo la cabecera `sala;dia;franja` — CSV válido, hoja vacía. («No sé, decide tú.»)
4. Sala inexistente: error `no existe la sala Oeste` por `stderr`, código de salida 1, nada por `stdout`. Así `> norte.csv` no guarda el mensaje dentro del fichero. («No sé, decide tú.»)
5. `exportar` sin sala: error `uso: exportar <sala>` por `stderr`, código 1 — mismo criterio que el punto 4.
6. Sin comillas ni escape de campos: las salas y las franjas son valores fijos sin `;` ni comillas. Si algún día hay nombres libres, habrá que añadirlo.
7. Codificación UTF-8 sin BOM, fin de línea `\n` (el de `console.log`) — Excel los abre; los datos de hoy son ASCII.
8. Enfoque: A, frente a B y C (ver Approach).
9. Capacidad nueva `booking-export` (inglés kebab-case) — `capabilities/` no existe aún; la crea esta spec.
10. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` OK, crea `booking-export.md` con tres requisitos.
11. Fila de roadmap: esta feature no tiene fila; el id 0010 lo reservé con `sdd id next --reserve`. Propongo añadirla al cerrar.
- Política de modelos: sin revisores de spec (ver arriba) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- La salida va por la salida estándar, como los demás comandos — «a) Por la salida estándar, como los demás comandos. Yo redirijo a un fichero.»
- El CSV se abre en Excel en castellano — «Excel en castellano: el responsable de cada sala cuadra las reservas en su hoja de cálculo los lunes, y el Excel está en castellano.»
- Sala vacía o inexistente: lo decide el agente — «No sé, decide tú.»

## Intent

El responsable de cada sala cuadra sus reservas los lunes en su hoja de cálculo, hoy a mano. Con `exportar <sala>` obtiene un CSV que Excel en castellano abre directamente en columnas, sin retocar nada. Éxito: el fichero se abre con tres columnas y una fila por reserva. Fracaso aunque funcione: abrirlo y ver todo en una sola columna, o encontrar un mensaje de error dentro del fichero.

## Scope

- Entra: comando `exportar <sala>` en `src/app.js`; sus tests en `test/app.test.js`. El `README.md` no lista comandos y no se toca.
- No entra: escribir a un fichero (`--salida`), filtrar por día, exportar todas las salas a la vez, comillas y escape, el `.ics` (fila 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "exportar\|csv\|export"` fuera de `specs/`: solo `ROADMAP.md:19` (fila 0009, `.ics`) y `src/app.js:9` (`export function run`) | Sin cambio: ninguno nombra `exportar` ni CSV |

- Filas que implementa: nada: esta feature no tiene fila; la 0009 es otra cosa (`.ics`) y no se toca.

## Approach

- A. Rama `exportar` en `run`, que construye la cadena CSV desde `bookings` y lanza un `Error` para sala inexistente o falta de sala; el arranque (`if (command)`) captura el error, lo escribe por `stderr` y fija `process.exitCode = 1` — lo más simple, coherente con `run` que devuelve texto; el cambio del arranque es pequeño.
- B. Un módulo nuevo `src/exportar.js` con la función — separa, pero para ~10 líneas el proyecto, de un solo fichero de entrada (`operations.md`), no lo pide.
- C. Que `run` devuelva el mensaje de error como texto — el más simple, pero con `> norte.csv` el error acaba dentro del fichero.
- Elegido: A — mantiene un solo fichero y deja `stdout` limpio para redirigir.

`exportar` valida la sala contra `rooms`, filtra `bookings` por sala y une con `;`: `[cabecera, ...filas].join('\n')`.

## Dónde se prueba

- Contenido del CSV (con reservas, sin reservas): `run('exportar', [...])` como los tests actuales de `test/app.test.js`.
- Sala inexistente y falta de sala: `run` lanza el error (mismo patrón).
- `stdout` vacío, `stderr` con el mensaje y código 1: un test que lanza `node src/app.js exportar Oeste` con `child_process` — es la única costura que lo ve entero.
- Cómo lo abre Excel: lo valida el dev-lead a mano.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala `Norte` con una reserva `lun` `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida estándar es `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`
- AND los campos van separados por `;`

#### ADDED — Sala sin reservas

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida estándar es solo `sala;dia;franja`

#### ADDED — Sala inexistente o ausente

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Oeste`
- THEN no se escribe nada por la salida estándar, `stderr` dice `no existe la sala Oeste` y el código de salida es 1
- AND con `exportar` sin sala, `stderr` dice `uso: exportar <sala>` y el código de salida es 1

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
