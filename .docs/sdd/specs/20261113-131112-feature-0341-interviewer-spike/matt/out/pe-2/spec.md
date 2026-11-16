---
id: 20261113-144909-feature-0010-exportar-csv
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

🦆 Hasta ahora no hay forma de sacar las reservas de una sala. Con esto, `node src/app.js exportar Norte > norte.csv` deja un fichero que el responsable abre en su hoja de cálculo en castellano, con tres columnas: `sala;dia;franja`, y debajo `Norte;lun;10:00-12:00`. Si la sala no existe, avisa con un error en vez de entregar un fichero vacío. Por dentro es una función más en `src/app.js`, que filtra las reservas por sala y las une con `;`.

Validación: dev-lead — lo que sale es un fichero que una persona abre en su hoja de cálculo, y solo ella ve si se reparte bien en columnas.

## Capacidades

- Nuevas: `booking-export` — exportar las reservas de una sala a CSV.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores según la rúbrica — señales: capacidad nueva (`booking-export`), contrato público (un formato de fichero que consume la hoja de cálculo) · tamaño: ~25 líneas de código y tests en 2 ficheros, más README
- Dominio (sonnet): si el CSV se abre bien en Excel en castellano con `;`, sin BOM y con `dia` sin tilde, y si «sala sin reservas» frente a «sala inexistente» cubre lo que el responsable necesita los lunes (señal: contrato público)
- Técnica (sonnet): si `exportar` se decide contra `rooms` y no contra `bookings`, y si los tests por `run()` cubren los cuatro THEN (señal: capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar si el formato se abre bien en la hoja de cálculo
**No se despachó**: en esta sesión no hay herramienta para lanzar subagentes revisores. Pasé yo los siete puntos sobre la spec y corregí dos erratas en las decisiones 11 y Approach B (ver Hallazgos). No equivale a una revisión independiente: decide tú si quieres que se haga aparte.

### Hallazgos de la review

- **Aceptado** — decisión 11 decía «igual que `libres` y `cancelar`», pero `cancelar` no recibe sala → ahora cita solo `libres`.
- **Aceptado** — Approach B atribuía a la constitution lo del fichero de entrada único, y está en `operations.md` → corregido.
- **Aceptado** — el README entraba en el Scope sin aparecer en las decisiones → añadida la decisión 13.

Repaso de coherencia: `git grep -n "0010\|exportar\|csv"` fuera de `.docs/` sin resultados; el delta sobre una copia de `.docs/sdd` con `sdd capability merge` fusiona sin errores (4 requisitos y 5 reglas añadidos) y `sdd capability check --artifact` da «Capacidades válidas: 1».

1. Nombre de la capacidad nueva: `booking-export` — el proyecto no tiene `capabilities/`; la declaro aquí, como pide el kit, para que el comportamiento viva en un sitio.
2. Comando `exportar <sala>` — nadie dijo el nombre; sigue los verbos en infinitivo de los comandos actuales (`libres`, `reservar`, `cancelar`).
3. Columnas y cabecera: `sala;dia;franja` y una fila por reserva — nadie dijo las columnas; son los tres campos que tiene hoy una reserva.
4. `dia` sin tilde en la cabecera — un UTF-8 sin BOM con acento se abre mal en Excel en castellano, y no quiero meter un BOM.
5. Sala inexistente: `no existe la sala Este` (con el nombre escrito) — «decide tú» del dev-lead; evita que una errata dé un fichero vacío que parezca «sin reservas».
6. Sala existente sin reservas: solo la cabecera `sala;dia;franja` — «decide tú» del dev-lead; es un CSV válido y vacío.
7. Sin sala: `uso: exportar <sala>` — nadie dijo el texto.
8. Orden de las filas: el de las reservas guardadas — no hay requisito de orden y no quiero inventar uno.
9. Sin entrecomillado ni escape — hoy ningún campo lleva `;`, comillas ni saltos de línea; si `reservar` deja meterlos algún día, entonces habrá que escapar.
10. Líneas separadas por `\n`, sin salto final extra — `console.log` ya añade el último.
11. Mayúsculas: la sala se compara tal cual está guardada (`Norte`, no `norte`) — igual que `libres`.
12. Enfoque: función pura dentro de `src/app.js`, frente a un módulo nuevo y a escribir el fichero desde el comando (ver Approach).
13. README: añado una línea con el uso `exportar <sala> > fichero.csv` — nadie dijo si se documenta; el README es lo único que describe el proyecto.
- Política de modelos: revisores de la spec según el bloque de arriba · revisión final según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- La salida va por la salida estándar y el dev-lead redirige a un fichero — «Por la salida estándar: 1️⃣. Yo redirijo a un fichero.»
- El separador es `;` — «Punto y coma (opción 1): el Excel del responsable está en castellano.»
- Qué pasa con una sala inexistente o sin reservas lo decide el agente — «No sé, decide tú.»

## Intent

Hoy el responsable de cada sala no tiene cómo sacar sus reservas y las cuadra a mano los lunes en su hoja de cálculo. Se quiere un comando que las deje en un CSV que esa hoja, en castellano, abra directamente. Éxito: `exportar Norte > norte.csv` se abre con tres columnas y una fila por reserva, sin pasos intermedios. Fracaso, aunque «funcione»: que se abra todo en una columna, con acentos rotos, o que una errata en el nombre de la sala dé un fichero vacío que parezca «sin reservas».

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js` y sus tests en `test/app.test.js`; el texto del README con el uso.
- No entra: escribir el fichero desde el comando (se redirige la salida), exportar todas las salas a la vez, filtrar por día, el `.ics` (es la 0009), cambiar cómo se reserva o se cancela.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -n "0010\|exportar\|csv"` fuera de `.docs/`.

## Approach

- A. Una función pura `exportCsv(room)` en `src/app.js` que `run` llama con `exportar` — cuesta poco: es el patrón de `freeRooms`, se prueba por `run()` como los tests actuales y no toca nada más.
- B. Un módulo nuevo `src/csv.js` — separa la lógica, pero para una función de unas diez líneas añade un fichero y un import, y `operations.md` fija un solo fichero de entrada.
- C. Escribir el fichero desde el comando — el dev-lead eligió la salida estándar, así que descartado.
- Elegido: A — es lo más pequeño que cumple lo pedido y sigue cómo está hecho el resto.

`run('exportar', [sala])` devuelve el texto completo, y `app.js` lo imprime con el `console.log` que ya hay. Con una sala existente devuelve `sala;dia;franja` y, por cada reserva de esa sala, `<sala>;<dia>;<franja>`, unidas con `\n`. El que no exista se decide contra la lista `rooms` y no contra las reservas.

## Dónde se prueba

- Todos los comportamientos: por `run()`, como los tests actuales de `test/app.test.js` (`node --test`).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala Norte con una reserva el lunes de 10:00-12:00
- WHEN se ejecuta `exportar Norte`
- THEN sale `sala;dia;franja` y debajo `Norte;lun;10:00-12:00`, separados por `;`, una línea por fila

#### ADDED — Sala sin reservas

- GIVEN la sala Sur, que existe y no tiene reservas
- WHEN se ejecuta `exportar Sur`
- THEN sale solo `sala;dia;franja`

#### ADDED — Sala inexistente

- GIVEN que no existe una sala llamada Este
- WHEN se ejecuta `exportar Este`
- THEN sale `no existe la sala Este` y ningún CSV

#### ADDED — Exportar sin indicar sala

- GIVEN cualquier estado
- WHEN se ejecuta `exportar` sin sala
- THEN sale `uso: exportar <sala>`

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: las reservas en memoria de `src/app.js`; el CSV sale por la salida estándar y no se guarda.
- **Idioma de los nombres**: cabecera `sala;dia;franja` y mensajes en castellano.
- **Límites**: no aplica
- **Avisos**: `no existe la sala <nombre>` y `uso: exportar <sala>`.
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
