---
id: 20261113-143518-feature-0010-exportar-reservas
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

🦆 Quien lleva la sala Norte escribe «exportar Norte» y encuentra en su carpeta un fichero `norte.csv` con una fila por reserva, por ejemplo `Norte;lun;10:00-12:00`. Excel en castellano lo abre ya repartido en columnas y con los acentos bien. Si el fichero del lunes anterior seguía allí, se sustituye sin avisar. Si la sala no existe, el comando lo dice y no crea nada. Por dentro, lee la misma lista de reservas que usa «libres» y escribe el fichero con punto y coma.

Validación: dev-lead — el CSV lo abre una persona en Excel en castellano; el agente no ve cómo se reparte en columnas ni cómo salen los acentos.

## Capacidades

- Nuevas: `bookings-export` — exportar a un fichero CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores (dominio sonnet, técnica sonnet) — señales: capacidad nueva (`bookings-export`), contrato público (el formato del CSV lo consume Excel) · tamaño: ~45 líneas en 3 ficheros
- Dominio (sonnet): si el CSV sirve a quien cuadra la sala los lunes: columnas `sala;día;franja` y la sobrescritura silenciosa (señal: contrato público)
- Técnica (sonnet): si el BOM, el `;`, el CRLF y el entrecomillado dejan el fichero abierto en columnas en Excel en castellano (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las columnas y el orden sirven a quien cuadra la sala
- **No se ha despachado**: esta sesión no tiene herramienta para lanzar subagentes. Lo que hay es mi propia repasada de los siete puntos, que no es independiente; si quieres la review de verdad, dímelo y se lanza desde otra sesión.

1. Nombre del comando: `exportar <sala>`, en castellano como `libres`, `reservar` y `cancelar`.
2. Fichero de salida: el nombre de la sala en minúsculas más `.csv` (`norte.csv`), en la carpeta desde la que se lanza el comando.
3. Si el fichero ya existe, **se sobrescribe sin avisar**. Lo decidí yo: el usuario dijo «No sé, decide tú» (ver «Decisiones tomadas con el dev-lead»).
4. Formato: separador `;`, UTF-8 con BOM, saltos de línea CRLF y una cabecera `sala;día;franja`. El `;` lo eligió el usuario; BOM, CRLF y la cabecera con tilde los pongo yo para que Excel en castellano lo abra bien.
5. Contenido: todas las reservas de la sala, en el orden de la lista. No filtro por semana: una reserva guarda día de la semana y franja, no una fecha.
6. La sala se acepta sin importar mayúsculas (`norte` vale como `Norte`); en el fichero sale el nombre canónico.
7. Textos: éxito `reservas de Norte exportadas a norte.csv: 1`; sala inexistente `sala desconocida: Oeste`; sin sala `uso: salas exportar <sala>`. Una sala sin reservas genera el fichero solo con la cabecera y dice `…: 0`.
8. Un valor con `;`, comillas o salto de línea sale entrecomillado y con las comillas duplicadas (`"mañana; tarde"`), porque la franja hoy no se valida (ver deuda técnica).
9. Enfoque: todo en `src/app.js` (opción B), frente a un módulo `src/csv.js` (A) y a escribir por pantalla (C) (ver Approach).
10. Capacidad nueva `bookings-export` (slug en inglés, kebab-case).
11. Los errores de escritura (carpeta sin permisos, disco lleno) no se tratan: salta el error de Node tal cual.
12. No se neutralizan celdas que empiezan por `=`, `+`, `-` o `@`: un solo usuario con datos propios.
13. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → exit 0 (7 requisitos y 5 reglas añadidos); `sdd capability check` → «Capacidades válidas: 1».
- Política de modelos: revisores de la spec: ninguno despachado (sin herramienta de subagentes en esta sesión) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Separador `;` porque el responsable de cada sala usa Excel en castellano — «Opción 1, el separador `;`. El responsable de cada sala usa Excel en castellano.»
- El comando escribe el fichero él mismo — «Recomiendo la 2️⃣: el fichero lo escribe el propio comando.»
- Fichero existente: decidido por el agente — «No sé, decide tú.»

## Intent

Hoy `salas` no saca las reservas de ningún modo, y quien lleva cada sala las cuadra los lunes en su hoja de cálculo, así que tiene que copiarlas a mano. Con el comando, escribe `exportar Norte` y abre `norte.csv` en Excel en castellano. Éxito: el fichero se abre repartido en columnas, con acentos correctos, y tiene tantas filas como reservas tiene la sala. Fracasaría, aunque el comando funcione, si Excel mostrara todo en una columna o los acentos rotos.

Nota: hoy la lista de reservas es la que vive en memoria en `src/app.js` y `reservar` no la modifica, así que el export refleja esa lista (ahora, una reserva de ejemplo). Guardarlas entre ejecuciones es otra tarea.

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js`, sus tests en `test/app.test.js` y una línea de uso en `README.md`.
- No entra: guardar las reservas entre ejecuciones; filtrar por semana o por día; el export a calendario `.ics` (fila 0009); validar el formato de la franja (deuda técnica); elegir el nombre o la carpeta del fichero; neutralizar fórmulas; tratar errores de escritura.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | Solo se añade un comando; `libres`, `reservar` y `cancelar` no cambian |

- Filas que implementa: nada: comprobado con `git grep -n 0010 -- . ':!.docs/sdd/specs'` (sin resultados); la fila 0009 del roadmap (`.ics`) es otra tarea.

## Approach

- A: módulo `src/csv.js` con la función que construye el CSV — se prueba sola, pero son ~10 líneas y un fichero más para una herramienta de una persona.
- B: todo en `src/app.js` — sin ficheros nuevos; el comando crece unas 20 líneas y se prueba por `run()`, como los tests actuales.
- C: escribir por pantalla y redirigir — descartado por el usuario: prefiere que el comando escriba el fichero.
- Elegido: B — es lo más pequeño que cumple y no abre costuras nuevas; si el export crece (filtros, otros formatos) se extrae entonces.

`run(cmd, params, { dir, bookings } = {})` recibe la carpeta de destino (por defecto la actual) y la lista de reservas (por defecto la de `app.js`); así los tests escriben en una carpeta temporal y pueden probar franjas como `mañana; tarde`, que la lista de ejemplo no tiene.

## Dónde se prueba

- Todos los comportamientos: por `run('exportar', [...], { dir })` con `node --test`, como los tests de `libres` y `cancelar`; el contenido se lee del fichero como bytes para comprobar el BOM y el CRLF.
- Que Excel en castellano reparte las columnas: lo valida el dev-lead abriendo el fichero.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala Norte con la reserva `lun`, `10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN se crea `norte.csv` en la carpeta actual, en UTF-8 con BOM, con separador `;` y saltos CRLF, con el contenido `sala;día;franja` y `Norte;lun;10:00-12:00`
- AND se muestra `reservas de Norte exportadas a norte.csv: 1`

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN `sur.csv` contiene solo `sala;día;franja`
- AND se muestra `reservas de Sur exportadas a sur.csv: 0`

#### ADDED — La sala se acepta sin importar mayúsculas

- GIVEN la sala Norte con la reserva `lun`, `10:00-12:00`
- WHEN se ejecuta `salas exportar norte`
- THEN se crea `norte.csv` con la fila `Norte;lun;10:00-12:00`

#### ADDED — Una sala inexistente no crea fichero

- GIVEN que no existe una sala Oeste
- WHEN se ejecuta `salas exportar Oeste`
- THEN se muestra `sala desconocida: Oeste`
- AND no se crea ningún fichero

#### ADDED — Sin sala se muestra el uso

- GIVEN cualquier estado
- WHEN se ejecuta `salas exportar` sin sala
- THEN se muestra `uso: salas exportar <sala>`
- AND no se crea ningún fichero

#### ADDED — Un fichero existente se sobrescribe

- GIVEN un `norte.csv` que ya contiene `viejo`
- WHEN se ejecuta `salas exportar Norte`
- THEN `norte.csv` contiene la cabecera y `Norte;lun;10:00-12:00`, sin rastro de `viejo`

#### ADDED — Los valores con separador se entrecomillan

- GIVEN la sala Norte con una reserva de franja `mañana; tarde`
- WHEN se ejecuta `salas exportar Norte`
- THEN la fila es `Norte;lun;"mañana; tarde"`
- AND una franja `a"b` sale como `"a""b"`

#### Reglas de la capacidad — bookings-export

- **Dónde viven los datos**: `<sala en minúsculas>.csv` en la carpeta desde la que se lanza el comando
- **Idioma de los nombres**: castellano (constitución, art. 4): cabecera `sala;día;franja` y mensajes en castellano
- **Límites**: no aplica
- **Avisos**: `reservas de <Sala> exportadas a <fichero>: <n>`, `sala desconocida: <sala>` y `uso: salas exportar <sala>`
- **Regla ante conflicto**: si el fichero ya existe, se sobrescribe

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
