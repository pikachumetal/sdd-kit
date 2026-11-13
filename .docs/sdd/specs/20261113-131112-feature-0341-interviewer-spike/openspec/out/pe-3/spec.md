---
id: 20261113-152625-feature-0010-exportar-csv-sala
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

🦆 Al pedir la exportación de una sala, por ejemplo Norte, sale una línea de cabecera con sala, día y franja, y debajo una línea por reserva, como «Norte;lun;10:00-12:00». Las columnas van separadas por punto y coma, y el texto empieza con una marca invisible que avisa a Excel de que está en UTF-8, para que tu Excel en castellano abra tres columnas y no estropee la tilde de «día». Si la sala no existe o no la indicas, no entra nada en el fichero y el aviso sale solo por pantalla. Tú guardas el resultado redirigiendo la salida, sin opción de ruta. Hoy solo salen las reservas que ya están en la lista del programa; las semanales todavía no se guardan en ningún sitio.

Validación: dev-lead — el CSV lo abre una persona en su Excel en castellano; que `día` salga bien y las tres columnas queden separadas no lo mide un test.

## Capacidades

- Nuevas: `booking-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el CSV lo consume la hoja de cálculo del responsable) · tamaño: ~25 líneas en 2 ficheros
- Dominio (sonnet): si la cabecera `sala;día;franja` y la marca BOM de «Exportar las reservas de una sala a CSV» dan lo que el responsable necesita para cuadrar en su hoja, y si falta algún dato de la reserva (señal: contrato público)
- Técnica (sonnet): si lanzar un error desde `run()` y capturarlo en el bloque que imprime deja stdout vacío y código de salida 1 en «Una sala que no existe no produce CSV», y si la marca BOM sobrevive a `console.log` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el contenido del CSV responde al uso real de la hoja de cálculo

1. Comando: `exportar <sala>` (`node src/app.js exportar Norte`) — nadie dijo el nombre; verbo en infinitivo, como `reservar` y `cancelar`.
2. Cabecera `sala;día;franja`, con tilde en `día` — son tus columnas, con tu ortografía. La salida empieza por la marca BOM UTF-8 (`U+FEFF`) para que Excel en castellano lea UTF-8 al abrir el fichero y no estropee `día`. Descartada: cabecera `dia` sin tilde, que cambiaría tu literal. **Sin medir**: lo confirmas tú al validar abriéndolo en tu Excel; tampoco he comprobado cómo queda con `>` en PowerShell 5.1, que escribe UTF-16.
3. Una fila por reserva de esa sala, en el orden en que están guardadas, sin reordenar por día — hoy hay una sola reserva y no hay criterio de orden que nadie haya pedido.
4. Saltos de línea `\n`; `run()` devuelve el texto sin salto final y `console.log` añade uno, como con `libres`.
5. Una sala sin reservas (p. ej. `exportar Sur`) sale con solo la cabecera — es la respuesta que no obliga a tratar el caso aparte en la hoja.
6. Una sala que no existe, o sin indicar sala, no escribe nada en stdout: el mensaje va por stderr y el código de salida es 1. Si fuera por stdout, con `> norte.csv` acabaría dentro del fichero. Literales: `sala desconocida: Oeste (salas: Norte, Sur)` y `falta la sala (uso: exportar <sala>)`. El nombre distingue mayúsculas: `norte` es desconocida, porque se compara tal cual con la lista `rooms` de `src/app.js`.
7. Sin escapado de comillas ni de `;` en los valores: ninguna sala ni franja de hoy los lleva. Pero la franja no se valida (deuda «Sin validación del formato de franja horaria»): cuando entre una franja con `;`, el CSV saldrá mal.
8. Origen de los datos: la lista `bookings` de `src/app.js`, la misma que lee `libres`. `reservar --cada-semana` hoy no guarda nada, así que esas reservas no salen en el CSV hasta que haya dónde guardarlas.
9. Capacidad nueva `booking-export`, con su slug en inglés (`capabilities/` está vacío).
10. Enfoque: A frente a B y C (ver Approach).
11. Pruebas: tests de `run('exportar', …)` en `test/app.test.js` y uno que lanza `node src/app.js` como proceso, porque el código de salida y stderr solo existen ahí.
12. Reglas de la capacidad (la constitución no tiene «Reglas de producto», las pongo yo): datos en memoria, en `bookings`; nombres y mensajes en castellano; sin límites; el aviso va por stderr; sin conflicto posible.
13. Repaso de coherencia: el delta probado sobre una copia de `.docs/sdd`: `sdd capability merge` → 4 requisitos y 5 reglas añadidos, `sdd capability check` → «Capacidades válidas: 1». Corregido en la spec: la nota de «Filas que implementa» decía «sin resultados» y `git grep` da una coincidencia (la fila 0009).
### Hallazgos de la review

**No se despacharon los dos revisores de la rúbrica**: la sesión no dispone de herramienta para lanzar subagentes. La pasada con los siete puntos del brief la hizo el agente que escribió la spec, así que no es una lectura independiente: de ahí que quede sin cubrir justo lo que los revisores habrían visto con ojos nuevos. Si prefieres revisores reales, dilo y se lanzan desde una sesión que pueda.

- **Aceptado** — ✋ 6 decía que el nombre de sala distingue mayúsculas «como en `libres`», y `libres` recibe una franja, no una sala → ahora cita la lista `rooms` de `src/app.js`.
- **Aceptado** — ✋ 1 decía que `libres`, `reservar` y `cancelar` están todos en infinitivo o imperativo, y `libres` no lo es → ahora cita solo `reservar` y `cancelar`.
- **Aceptado** — el Scope no nombraba el cambio del bloque que imprime en `src/app.js`, que ya estaba en el Approach → añadido a «Entra».
- Sin hallazgo: contradicciones con `capabilities/` (está vacío), escenarios sin GIVEN/WHEN/THEN, roles o permisos (no hay), las cinco reglas (declaradas), ejemplos (`Norte`, `Sur` salen del código).

- Política de modelos: dos revisores de la spec, ambos sonnet (la spec no toca reglas de negocio ni roles) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Separador `;`, columnas sala, día y franja — «Punto y coma (`;`), porque el Excel del responsable está en castellano. Las columnas son sala, día y franja.»
- Salida por la salida estándar, sin opción de fichero ni manejo de rutas — «Por la salida estándar: opción 1️⃣. Yo redirijo la salida a un fichero con `>`, así que no necesito opción `--salida` ni manejo de rutas.»

## Intent

Cada lunes el responsable de una sala cuadra sus reservas en una hoja de cálculo, y hoy no tiene cómo sacarlas de `salas` salvo copiarlas a mano. Quiere un comando que las exporte de una sala a CSV.

Éxito: ejecutar `node src/app.js exportar Norte > norte.csv` y, al abrir `norte.csv` en un Excel en castellano, ver cada reserva en su fila con sala, día y franja en tres columnas, y `día` sin caracteres rotos. Fracaso aunque el comando funcione: toda la fila en una sola columna, `dÃ­a` en la cabecera, o un mensaje de error dentro del fichero.

## Scope

- Entra: el comando `exportar <sala>` y su salida CSV por stdout; el error de sala desconocida o ausente por stderr con código 1, lo que obliga a que el bloque final de `src/app.js` capture los errores de `run()`; los tests de todo ello.
- No entra: exportar todas las salas a la vez; filtrar por día o franja; opción de fichero de salida; escapado de valores; reordenar; las reservas semanales (`--cada-semana`), que no se guardan; el formato `.ics` (fila 0009 de `ROADMAP.md`, una idea distinta y posterior).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv" -- . ':!.docs/sdd/changes'` → una sola coincidencia, la fila 0009 de `ROADMAP.md` (`.ics`), que es otra cosa y no la salda esta spec.

## Approach

- A. Una rama `exportar` en `run()` de `src/app.js` que filtra `bookings` por sala y une las filas con `;`; `run()` lanza un `Error` si la sala falta o no existe, y el bloque que imprime lo captura y lo manda a stderr con `process.exitCode = 1` — unas 15 líneas, usa los datos que ya están en ese módulo y no añade ficheros.
- B. Un módulo nuevo `src/exportar.js` — `bookings` no se exporta de `src/app.js`: habría que exportarla, o importar `app.js` desde el módulo y `app.js` desde `exportar.js` (dependencia circular). Costaría más que lo que aísla.
- C. Una librería de CSV — descartada: la constitución y `operations.md` piden Node sin dependencias externas, y lo que hace falta es unir tres campos.
- Elegido: A — es lo que cabe en el módulo único de hoy y hace que el error sea comprobable desde `run()` y desde el proceso.

El texto que devuelve `run('exportar', ['Norte'])` es `﻿sala;día;franja\nNorte;lun;10:00-12:00`. El bloque final de `src/app.js` pasa a capturar errores de `run()` para no imprimir el mensaje de error por stdout.

## Dónde se prueba

- Contenido del CSV (con reservas, sin reservas): por `run('exportar', [...])`, como los tres tests actuales de `test/app.test.js`.
- Sala desconocida o ausente (stdout vacío, stderr, código 1): lanzando `node src/app.js exportar Oeste` como proceso (`spawnSync`), porque el código de salida y stderr no se ven desde `run()`; y que `run()` lanza el error, por la misma vía que los demás tests.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala Norte con una reserva el lunes en la franja 10:00-12:00
- WHEN se ejecuta `exportar Norte`
- THEN la salida es la marca BOM UTF-8 seguida de las líneas `sala;día;franja` y `Norte;lun;10:00-12:00`, separadas por un salto de línea

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala Sur, sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es la marca BOM UTF-8 seguida de la línea `sala;día;franja` y nada más

#### ADDED — Una sala que no existe no produce CSV

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `exportar Oeste`
- THEN no se escribe nada por stdout, se escribe `sala desconocida: Oeste (salas: Norte, Sur)` por stderr y el código de salida es 1
- AND con `exportar norte` pasa lo mismo, porque el nombre distingue mayúsculas

#### ADDED — Exportar sin indicar la sala no produce CSV

- GIVEN cualquier estado de las reservas
- WHEN se ejecuta `exportar` sin sala
- THEN no se escribe nada por stdout, se escribe `falta la sala (uso: exportar <sala>)` por stderr y el código de salida es 1

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: en memoria, en la lista `bookings` de `src/app.js`
- **Idioma de los nombres**: castellano, en la cabecera y en los mensajes
- **Límites**: no aplica
- **Avisos**: sala desconocida o ausente, por stderr con código de salida 1
- **Regla ante conflicto**: no aplica

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
