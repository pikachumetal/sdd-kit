---
id: 20261119-163854-feature-0010-exportar-reservas-csv
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

🦆 Hoy, para cuadrar las reservas de una sala, el responsable tiene que copiarlas a mano. Con el comando nuevo, `salas exportar Norte > norte.csv` deja un fichero que Excel en castellano abre con doble clic, con tres columnas: `Norte · lun · 10:00-12:00`. Si se escribe mal la sala, el comando avisa en vez de dejar un fichero vacío que parezca una sala sin reservas. Por dentro es un comando más de `src/app.js`, que escribe las filas con `;` y la marca UTF-8 que pide Excel.

Validación: dev-lead — el fichero lo abre una persona en su Excel; el separador y los acentos solo se ven ahí. Debe hacerlo con el fichero guardado por la misma shell que usará (`exportar Norte > norte.csv`).

## Capacidades

- Nuevas: `booking-export` — exportar a CSV las reservas de una sala, en el formato que abre Excel en castellano.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: la rúbrica da dos revisores (dominio y técnica) — señales: capacidad nueva, contrato público (el formato de fichero que consume Excel) · tamaño: ~40 líneas de código y ~12 de tests en 2 ficheros. **No se despacharon**: esta sesión no tiene herramienta para lanzar subagentes. En su lugar hice yo la pasada de los siete puntos, que no es una revisión independiente.
- Dominio (sonnet, sin lanzar): si las seis reglas del CSV (decisiones 4 a 11) cubren lo que el responsable ve al abrirlo en Excel.
- Técnica (sonnet, sin lanzar): si el error con código 1 y el CSV con marca UTF-8 se pueden probar y producir desde `app.js`, que hoy solo imprime una cadena.
- Mínimo razonable: una pasada propia (la hecha) — deja sin cubrir lo que un revisor distinto vería en mi redacción.

### Hallazgos de la review

- **Aceptado** — (4) «Límites: sin límite de filas» estaba en las reglas y no en ✋ → añadido como decisión 13.
- **Aceptado** — (6) la redirección `> norte.csv` en Windows PowerShell 5.1 guarda en UTF-16 y no en UTF-8, y con la marca que escribe el comando saldría mal; en PowerShell 7 y en bash no. Está sin verificar → anotado en la decisión 3 y en la validación del dev-lead, que debe probarlo con la shell que use.
- Sin hallazgos en los puntos 1, 2, 3, 5, 5 bis y 7 (no hay capacidades previas; cada requisito tiene escenario con datos; Intent y Scope coinciden; no hay roles; los ejemplos son los datos de `app.js`).

1. Nueva capacidad `booking-export` (nombre en inglés, kebab-case) — no existe ninguna capacidad en `capabilities/` que cubra reservas.
2. Comando `exportar <sala>` — nadie dio el nombre; sigue los comandos en minúsculas y en castellano (`libres`, `reservar`, `cancelar`).
3. El CSV sale por pantalla y se guarda con `> fichero.csv` — `run()` ya devuelve una cadena que se imprime; así la shell decide el nombre y el sitio, sin que la app escriba ficheros. **Riesgo sin verificar**: `>` en Windows PowerShell 5.1 re-codifica a UTF-16; si el dev-lead usa esa shell, se valida al cierre y, si falla, se enmienda (p. ej. un segundo argumento con el nombre del fichero).
4. Separador `;` y fichero con marca UTF-8 (BOM) al principio — Excel en castellano usa `;` y, sin la marca, rompe los acentos al abrir con doble clic. **Sin verificar**: la búsqueda en la web no estaba permitida y no hay otra fuente en la sesión. Se comprueba al cierre abriendo el fichero real en el Excel del responsable.
5. Cabecera `sala;día;franja`, en minúsculas y castellano — constitución, art. 4.
6. Una fila por reserva, en el orden en que están guardadas — el modelo no tiene fecha ni hora de alta que permita ordenar mejor.
7. Final de línea `\r\n` — es el formato estándar del CSV y Excel lo abre igual que con `\n`.
8. El nombre de la sala se compara tal cual está escrito, con mayúscula inicial (`Norte`, no `norte`) — como hacen hoy `libres` y la lista de salas.
9. Sala que existe y sin reservas: solo la cabecera. Sala que no existe: error `No existe la sala <nombre>. Salas: Norte, Sur`, por el canal de errores y con código de salida 1 — el dev-lead no eligió («No sé, decide tú»). Motivo: una errata no debe pasar por sala vacía, porque el responsable cuadra a mano y lo haría con datos que no son.
10. Un campo con `;`, comillas o salto de línea se entrecomilla y las comillas se duplican — la franja horaria no se valida hoy (`debt.md`, «Por triar») y un valor raro rompería las columnas sin avisar.
11. `exportar` sin sala responde `Falta la sala. Salas: Norte, Sur` por el canal de errores y con código 1 — nadie dijo qué hacer; es la misma regla que la sala inexistente y evita una cabecera sin sala.
12. Enfoque: función pura que construye el CSV y se prueba sola, frente a escribirlo todo dentro de `run()` y a escribir el fichero desde la app (ver Approach).
13. Sin límite de filas y una sola sala por comando — el modelo guarda pocas reservas y el responsable cuadra una sala cada vez.
- Repaso de coherencia: el delta probado sobre una copia de `.docs/sdd` con `sdd capability merge` fusiona sin rechazos (5 requisitos y 5 reglas añadidos en `booking-export`) y `sdd capability check` da «Capacidades válidas: 1». Sin cambios a `capabilities/` del repo. Corregida la decisión 11, que estaba mal redactada.
- Política de modelos (solo en `delegate`): revisores de la spec: ninguno (sin herramienta de subagentes en la sesión) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` (3 por defecto).

### Decisiones tomadas con el dev-lead

- Excel, en castellano, abre el fichero — «Con Excel, y el Excel está en castellano.»
- Qué hace el comando con una sala sin reservas o inexistente lo decido yo — «No sé, decide tú.»
- Pendiente (solo lo sabe el dev-lead): qué sería un fallo aunque técnicamente funcione. Sin preguntar más; el cierre lo repasa con la validación.

## Intent

Hoy no hay forma de sacar las reservas de una sala de la herramienta. El responsable de cada sala las cuadra los lunes en su hoja de cálculo, y hacerlo a mano es lento y se presta a errores.

Se quiere un comando que las saque a CSV. Éxito: `exportar Norte` produce un fichero que Excel en castellano abre con doble clic, con las tres columnas y los acentos bien, y una sala mal escrita no produce nada que parezca válido.

Anti-goals: un CSV que Excel abra en una sola columna o con acentos rotos aunque el contenido sea correcto; una sala inexistente que salga como sala sin reservas. Los demás anti-goals están pendientes (ver arriba).

## Scope

- Entra: el comando `exportar <sala>` con el formato de las decisiones 4 a 11.
- No entra: filtrar por semana o por fecha (el modelo guarda el día de la semana, no una fecha); exportar todas las salas de una vez; escribir el fichero desde la app; otros formatos (`.ics` es la fila 0009); cambiar cómo se guardan las reservas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `grep -rn -i "exportar\|csv" ROADMAP.md PRODUCT.md README.md CHANGELOG.md .docs src test` (solo la 0009, que es `.ics` y otra tarea).

## Approach

- **A. Función pura `reservasCsv(sala)` en `src/app.js` y `run('exportar', …)` que la llama** — una función que se prueba sola, con un caso por regla; un poco más de código que escribirlo en línea.
- **B. Todo dentro de `run()`** — menos código, pero mezcla la sala inexistente, el entrecomillado y las filas en una sola rama sin forma de probarlas por separado.
- **C. La app escribe el fichero (`exportar Norte norte.csv`)** — añade nombres de fichero, sobrescrituras y rutas para un comando que la shell ya resuelve con `>`.
- Elegido: A — es lo que mantiene probable cada regla del CSV sin añadir ficheros; B y C no aportan nada a Excel.

Partes del cómo que fija A: el error de sala inexistente lo da la función con un mensaje y el punto de entrada lo lleva al canal de errores con código 1; los literales (separador, cabecera, final de línea, marca) son constantes en un sitio.

## Dónde se prueba

- Filas y cabecera, sala sin reservas, orden, final de línea y marca UTF-8: unitarios de `test/app.test.js`, por `run('exportar', [sala])`, como los tests actuales.
- Entrecomillado de `;`, comillas y salto de línea: unitario sobre la función pura.
- Sala inexistente y `exportar` sin sala: el texto, por `run`; el código de salida 1 y el canal de errores, con un test que lanza `node src/app.js exportar Oeste` (no hay hoy un test así).
- Que Excel en castellano lo abre bien: la validación del dev-lead, con el fichero real.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala Norte con una reserva `lun`, `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN sale `﻿sala;día;franja\r\nNorte;lun;10:00-12:00\r\n`, con la marca UTF-8 al principio
- AND las filas van en el orden en que están guardadas las reservas

#### ADDED — Sala sin reservas

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN sale solo `﻿sala;día;franja\r\n`

#### ADDED — Sala que no existe

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `exportar Oeste`
- THEN sale por el canal de errores `No existe la sala Oeste. Salas: Norte, Sur`, no sale nada por la salida normal y el código de salida es 1

#### ADDED — Falta la sala

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `exportar` sin sala
- THEN sale por el canal de errores `Falta la sala. Salas: Norte, Sur` y el código de salida es 1

#### ADDED — Campos con separador

- GIVEN una reserva de Norte con la franja `10:00;12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la fila sale `Norte;lun;"10:00;12:00"`

#### Reglas de la capacidad — `booking-export`

- **Dónde viven los datos**: las reservas guardadas por la herramienta; el comando solo las lee.
- **Idioma de los nombres**: cabecera `sala;día;franja` y mensajes en castellano.
- **Límites**: sin límite de filas; solo exporta una sala por comando.
- **Avisos**: `No existe la sala <nombre>. Salas: <lista>` y `Falta la sala. Salas: <lista>`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
