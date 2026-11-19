---
id: 20261119-163406-feature-0010-exportar-reservas-csv
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

🦆 El responsable de cada sala podrá escribir `exportar Norte` y obtener sus reservas como un CSV que Excel en castellano abre en columnas y con las tildes bien: `sala;dia;franja` y `Norte;lun;10:00-12:00`. Si la sala no existe (`exportar Este`), recibe `No existe la sala Este. Salas: Norte, Sur` y ningún CSV. Hoy tiene que copiar las reservas a mano cada lunes.

Validación: dev-lead — lo que se ve es un fichero abierto en Excel, con sus columnas y sus tildes, y eso lo observa una persona.

## Capacidades

- Nuevas: `booking-export` — exportar a CSV las reservas de una sala

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores (dominio sonnet + técnica sonnet) — señales: capacidad nueva (`booking-export`), contrato público (el CSV lo consume Excel) · tamaño: ~40 líneas en 2 ficheros
- Dominio (sonnet): si lo que el responsable ve el lunes (tres columnas, tildes, error sin ensuciar el CSV) lo cubren el delta y el Intent (señal: capacidad nueva)
- Técnica (sonnet): si `run`, que hoy solo devuelve texto, puede dar error por la salida de errores y código 1, y si la marca de codificación sobrevive a `console.log` y a `>` (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin mirar la segunda lente
NO DESPACHADO: esta sesión no tiene herramienta para lanzar subagentes. Lo que sigue lo hizo la propia sesión que escribió la spec, sin independencia: no equivale a la review del rubric. Decide en el gate si la repites con revisores.
```

1. Capacidad nueva `booking-export` — el nombre de fichero va en inglés kebab-case; no existe ninguna capacidad previa que cubra exportar.
2. El comando se llama `exportar <sala>` — sigue los verbos de `run` (`libres`, `reservar`, `cancelar`).
3. Columnas `sala;dia;franja`, con cabecera y una fila por reserva, en el orden en que están en `bookings` — son los campos que guarda cada reserva.
4. El CSV sale por la salida estándar, como el resto de comandos; para tener un fichero, el responsable redirige la salida (`exportar Norte > norte.csv`). La spec no añade ninguna opción para escribir ficheros — `run` devuelve texto y `console.log` lo imprime. `console.log` añade un salto de línea final, que Excel acepta. **Sin verificar**: que la marca de codificación llegue intacta al fichero con la redirección del shell que usa el responsable (en Windows PowerShell 5.1, `>` reescribe la salida en UTF-16); la validación se hace abriendo en Excel un fichero generado como lo genera él.
5. Saltos de línea `\n` y sin comillas en los valores — los valores de hoy (`Norte`, `lun`, `10:00-12:00`) no llevan `;` ni saltos; Excel acepta `\n`.
6. **Matiz sobre «no genere fichero»**: el comando no escribe ficheros, así que ante una sala inexistente no genera ninguno por sí mismo. Pero con `exportar Este > norte.csv` el shell crea `norte.csv` vacío igualmente. Para que el mensaje de error no acabe dentro del CSV, el error sale por la salida de errores (no por la estándar) y el comando termina con código 1. Esto no se puede evitar desde el comando.
7. Sala existente sin reservas (`exportar Sur`): sale solo la cabecera `sala;dia;franja` — propuesta mía, no preguntada.
8. El nombre de la sala se compara tal cual (`Norte`, con esa mayúscula): `exportar norte` da el error de sala inexistente. Es como compara hoy `freeRooms` el nombre de la sala (`b.room === room`).
9. **No entra** filtrar por día — el dev-lead dijo «No sé, decide tú»; lo decido yo: exporta siempre todas las reservas de la sala y la hoja filtra. Se puede añadir después sin romper nada.
10. Texto del error, literal: `No existe la sala Este. Salas: Norte, Sur` — el dev-lead pidió un error en castellano que liste las salas; la redacción, el punto tras el nombre y la lista separada por «, » en el orden de `rooms` son míos.
10 bis. Enfoque: una función `exportar` dentro de `src/app.js`, frente a un módulo nuevo y a una librería de CSV (ver Approach).
11. Repaso de coherencia: el delta probado sobre una copia de `.docs/sdd` con `capability merge` da `booking-export.md: añadido` ×3 requisitos y ×5 reglas, y `capability check` da `Capacidades válidas: 1`; sin correcciones en la spec.
- Política de modelos (solo en `delegate`): revisores de la spec: según la rúbrica de `sdd-spec-review` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Hechos por la sesión autora, no por revisores independientes (ver el aviso de arriba).

- **Aceptado** — Importante · el texto del error y el formato de su lista no estaban en ✋ → decisión 10 con el literal.
- **Aceptado** — Importante · «Es lo que hace hoy `libres`» era inexacto: `libres` recibe una franja, no una sala → decisión 8 corregida.
- **Aceptado** — Importante · la marca de codificación puede perderse según cómo redirija la salida el shell → decisión 4 lo marca `sin verificar` y la validación lo comprueba con el fichero real.
- **Aceptado, sin cambio en la spec** — Menor · hoy los datos no tienen tildes, así que la marca de codificación se ve solo con datos futuros → se mantiene: lo pidió el dev-lead.
- **Abierto para el plan** — Importante · `run` solo devuelve texto: dar el error por la salida de errores con código 1 exige cambiar cómo `run` y el bloque de entrada se comunican → está en Approach y lo decide el plan, con su prueba.

### Decisiones tomadas con el dev-lead

- Separador `;` y marca de codificación UTF-8 (BOM) al principio — «Excel en castellano: el responsable de la sala cuadra las reservas los lunes con punto y coma como separador.»
- Sala inexistente: error en castellano que lista las salas existentes — «Opción 1: un error en castellano que liste las salas existentes y no genere fichero.»

## Intent

Hoy el responsable de cada sala no tiene forma de sacar sus reservas de la herramienta: `libres` solo dice qué salas están libres en una franja. Cada lunes las cuadra en su hoja de cálculo, así que las transcribe a mano. Se quiere que un solo comando le dé las reservas de su sala en un CSV que Excel en castellano abra directamente, en tres columnas y con las tildes intactas.

Éxito: `exportar Norte` abierto en Excel en castellano da tres columnas y `Norte | lun | 10:00-12:00` en la primera fila de datos, sin pasos de importación. Fracaso aunque funcione: todo el contenido en una sola columna (separador equivocado), caracteres rotos (sin marca de codificación) o un error dentro del CSV que el responsable pega sin darse cuenta.

## Scope

- Entra: el comando `exportar <sala>` con el CSV descrito, el error de sala inexistente y la cabecera sola para una sala sin reservas.
- No entra: filtrar por día o por franja (decisión 9); escribir ficheros desde el comando (decisión 4); otros formatos como `.ics` (ya está en el roadmap como 0009); exportar varias salas a la vez; cambiar cómo se guardan las reservas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma: solo se añade un comando | — | — |

- Filas que implementa: nada: comprobado con `grep -rniE "exportar|csv" src test README.md ROADMAP.md PRODUCT.md`, que solo encuentra la fila 0009 (`.ics`), que es otra cosa.

## Approach

- **A. Una función en `src/app.js`**, junto a `freeRooms` — cuesta poco: unas líneas y un caso más en `run`; `src/app.js` es el único fichero de entrada y todo vive ahí.
- **B. Un módulo nuevo `src/exportar.js`** — se prueba solo, pero parte en dos un proyecto de un solo fichero para unas pocas líneas.
- **C. Una librería de CSV** — descartada: `operations.md` fija Node 22 sin dependencias, y los valores son tres campos sin comas.
- Elegido: **A** — encaja con cómo está hecho el proyecto y es lo más pequeño que cumple lo pedido.

Lo que fija A:

- Cabecera `sala;dia;franja`, tras ella `Norte;lun;10:00-12:00` por reserva, unidas con `\n`.
- Marca de codificación `﻿` al principio de la salida, solo en el CSV (no en el mensaje de error).
- Sala inexistente: error por la salida de errores y código de salida 1; en la salida estándar no sale nada. Cómo se pasa eso por `run` (que hoy solo devuelve texto) lo decide el plan.

## Dónde se prueba

- CSV de una sala con reservas: unitario sobre `run`, como los tests actuales de `test/app.test.js`.
- Sala sin reservas (`Sur`): igual, un unitario sobre `run`.
- Sala inexistente: unitario sobre `run` para el texto y el código de error; no hace falta prueba de extremo a extremo.
- Apertura en Excel en castellano (columnas y tildes): a mano en la validación, con una captura; no hay forma de probarlo con `node --test`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar a CSV las reservas de una sala

- GIVEN la sala `Norte` con la reserva `lun 10:00-12:00`
- WHEN el responsable ejecuta `exportar Norte`
- THEN sale `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`
- AND la salida empieza con la marca de codificación UTF-8, de modo que Excel en castellano la abre en tres columnas y respeta las tildes

#### ADDED — Sala sin reservas

- GIVEN la sala `Sur`, sin reservas
- WHEN el responsable ejecuta `exportar Sur`
- THEN sale solo `sala;dia;franja`

#### ADDED — Sala que no existe

- GIVEN las salas `Norte` y `Sur`
- WHEN el responsable ejecuta `exportar Este`
- THEN sale `No existe la sala Este. Salas: Norte, Sur` por la salida de errores, el código de salida es 1 y la salida estándar queda vacía

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: en memoria, en `bookings` de `src/app.js`; la exportación no guarda nada.
- **Idioma de los nombres**: los mensajes y las cabeceras van en castellano (`sala`, `dia`, `franja`); `exportar` es el nombre del comando.
- **Límites**: no aplica.
- **Avisos**: `No existe la sala <sala>. Salas: <lista separada por comas y un espacio>` cuando la sala no existe.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
