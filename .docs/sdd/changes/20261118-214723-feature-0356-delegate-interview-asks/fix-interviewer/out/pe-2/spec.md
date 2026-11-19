---
id: 20261118-233615-feature-0010-exportar-csv
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

🦆 Hoy `salas` no deja sacar las reservas de una sala a ningún sitio. Con esto, `salas exportar Norte` imprime las reservas de la sala Norte como CSV —una línea por reserva, `Norte;lun;10:00-12:00`—, y con `salas exportar Norte > norte.csv` el responsable de la sala lo abre cada lunes en su hoja de cálculo. Por dentro es un comando nuevo en `src/app.js` que recorre la lista de reservas y filtra por sala.

Validación: dev-lead — el CSV lo abre una persona en su hoja de cálculo; solo ella ve si las columnas salen separadas y legibles.

## Capacidades

- Nuevas: `bookings` — reservas de las salas: cómo se sacan del programa (hoy solo la exportación a CSV).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), contrato público (el formato CSV lo consume la hoja de cálculo del responsable) · tamaño: ~30 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (sonnet): si las columnas y el orden de «El CSV lleva una línea por reserva de la sala» bastan para cuadrar una sala contra una hoja, y si el texto de «sala desconocida» deja claro qué hacer (señal: contrato público)
- Técnica (sonnet): si el separador `;` y la cabecera sin tildes se abren bien en una hoja en castellano, y si devolver el texto como el resto de comandos (`run`) encaja con `src/app.js` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si lo que sale sirve para cuadrar, que es lo único que el dev-lead dijo querer

1. **Nombre y forma del comando**: `salas exportar <sala>`, sin argumentos extra — sigue los verbos en castellano de `libres`, `reservar` y `cancelar`; imprime en la salida estándar y quien quiera fichero redirige (`> norte.csv`), así no hace falta decidir ruta ni nombre de fichero.
2. **Qué reservas salen**: todas las de la sala, tal como están guardadas (`room`, `day`, `slot`), en el orden en que están. Hoy no hay fechas ni nombre de quien reserva, así que no hay otro criterio posible; si algún día se guardan, será otra feature.
3. **Columnas y cabecera**: `sala;dia;franja`, primera línea siempre, aunque la sala no tenga reservas — sin tildes en la cabecera para no depender de la codificación de la hoja.
4. **Separador `;`** y no `,` — una hoja de cálculo en castellano (Excel con configuración regional española) parte las columnas por `;`; con `,` abriría cada línea entera en una sola celda. Si tu hoja prefiere `,`, es un cambio de una línea. Líneas separadas con `\n`, sin BOM.
5. **Sala desconocida**: `sala desconocida: Oeste`, como texto de salida igual que el resto de comandos (el programa no usa códigos de salida). Sin argumento: `uso: exportar <sala>`. El nombre se compara tal cual, distinguiendo mayúsculas, como ya hace `libres`: `salas exportar norte` da `sala desconocida: norte`.
6. **Nombre de la capacidad nueva**: `bookings` (slug en inglés, contenido en castellano); `capabilities/` está vacía y no se vuelca lo que ya hay (`libres`, `reservar`, `cancelar`): crece feature a feature.
7. **Enfoque**: A, frente a B y C (ver Approach).
8. **Qué compara el responsable cada lunes con el CSV — pendiente**: el dev-lead dijo «no sé, decide tú». No lo he inventado: la spec exporta lo que hay y no añade columnas pensadas para un cuadre que nadie ha descrito.
9. **Política de modelos:** revisores de la spec: dominio sonnet y técnica sonnet (no toca reglas de negocio ni roles) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
10. **Carpeta de la feature**: `.docs/sdd/changes/…` como fija el kit, aunque las tres specs anteriores del proyecto viven en `.docs/sdd/specs/` (carpeta anterior a 3.0.1; no las muevo).

11. **Coherencia**: los literales (`sala;dia;franja`, `sala desconocida: <sala>`, `uso: exportar <sala>`) coinciden en decisiones, THENs y Reglas; `git grep` no halla nada que retirar. Delta probado en una copia temporal: `sdd capability merge` → 4 requisitos y 5 reglas añadidos a `bookings.md`, y `sdd capability check` → «Capacidades válidas: 1».
12. **Review de la spec: NO despachada.** Esta sesión no tiene herramienta para lanzar subagentes, así que los dos revisores de arriba no han leído la spec. En su lugar la he repasado yo con los siete puntos de `review-spec.md`: solo hallé que faltaba decir si el nombre de la sala distingue mayúsculas (corregido en 5). Eso no equivale a un revisor independiente: lo único sin cubrir es lo que el «Mínimo razonable» ya nombra, si lo exportado sirve para cuadrar. Si quieres la review de verdad, se lanza desde una sesión con subagentes antes de implementar.

### Hallazgos de la review

- Sin revisores: ninguno. Autorrevisión → **Aceptado** — el nombre de la sala no decía si distingue mayúsculas → añadido a la decisión 5.

### Decisiones tomadas con el dev-lead

- Exportar a CSV las reservas de una sala, para que su responsable las cuadre cada lunes en su hoja de cálculo — «añade un comando que exporte a CSV las reservas de una sala, porque el responsable de cada sala las cuadra los lunes en su hoja de cálculo»
- Que decida yo lo que no dijo (columnas, separador, nombres) — «No sé, decide tú»

## Intent

Hoy las reservas solo existen dentro del programa; el responsable de cada sala no tiene forma de verlas fuera de él, y cada lunes las cuadra a mano en una hoja de cálculo. Con el comando, saca las de su sala en un fichero que la hoja abre sin retocar nada. El éxito: `salas exportar Norte > norte.csv` se abre en la hoja con tres columnas, una fila por reserva. Fracasaría, aunque funcionara, si la hoja abriera cada línea en una sola celda. Qué compara el responsable con ese fichero es algo que el dev-lead no ha dicho (ver ✋ 8).

## Scope

- Entra: el comando `exportar <sala>` con su CSV, la sala sin reservas, la sala desconocida y la falta de argumento.
- No entra: exportar todas las salas a la vez, filtros por día o franja, un fichero escrito por el programa, otros formatos (el `.ics` es la fila 0009), fechas o nombre de quien reserva.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv|export" -- . ':!.docs/sdd/changes'` (solo `export function run` de `src/app.js` y la fila 0009, que es otro formato y otra feature)

## Approach

- A. Rama nueva en `run` que filtra `bookings` por sala y devuelve el texto CSV — es el patrón de `libres` y `cancelar`; se prueba llamando a `run`; cuesta unas 10 líneas.
- B. Escribir el fichero desde el programa (`exportar Norte norte.csv`) — obliga a decidir ruta, sobrescritura y errores de disco para algo que la redirección del intérprete de comandos ya resuelve.
- C. Un módulo nuevo `src/export.js` — separaría un código de diez líneas en otro fichero cuando `src/app.js` es el único punto de entrada (operations.md).
- Elegido: A — sigue lo que ya hace el proyecto y no añade decisiones de ficheros.

`run('exportar', ['Norte'])` devuelve `sala;dia;franja\nNorte;lun;10:00-12:00`; la validación de la sala usa la lista `rooms` que ya existe.

## Dónde se prueba

- Exportar una sala con reservas, sin reservas, desconocida y sin argumento: unitario sobre `run`, en `test/app.test.js`, como los tests actuales de `libres`, `reservar` y `cancelar` (`node --test`).
- Que la hoja de cálculo abre el fichero en tres columnas: lo ve el dev-lead abriendo `norte.csv`; no hay prueba automática.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — El CSV lleva una línea por reserva de la sala

- GIVEN la sala Norte tiene una reserva `lun` `10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN sale `sala;dia;franja` y, debajo, `Norte;lun;10:00-12:00`
- AND las líneas van separadas por `\n` y los campos por `;`

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala Sur no tiene reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN sale solo `sala;dia;franja`

#### ADDED — Una sala desconocida se avisa

- GIVEN no existe la sala Oeste
- WHEN se ejecuta `salas exportar Oeste`
- THEN sale `sala desconocida: Oeste` y ninguna línea de CSV

#### ADDED — Exportar pide la sala

- GIVEN el usuario no da sala
- WHEN se ejecuta `salas exportar`
- THEN sale `uso: exportar <sala>` y ninguna línea de CSV

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: la lista `bookings` en memoria de `src/app.js`
- **Idioma de los nombres**: castellano (artículo 4 de la constitution): `sala`, `dia`, `franja` y los mensajes
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` y `uso: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
