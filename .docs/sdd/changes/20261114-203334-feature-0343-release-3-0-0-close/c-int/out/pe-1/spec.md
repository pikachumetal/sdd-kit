---
id: 20261114-223303-feature-0010-exportar-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-14
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Hoy no hay forma de sacar de `salas` las reservas de una sala. Con esta feature, `salas exportar Norte` imprime un CSV con una línea por reserva (`Norte;lun;10:00-12:00`), pensado para abrirlo en Excel en castellano. El responsable de la sala lo guarda con `> norte.csv` y lo cuadra los lunes en su hoja. Por dentro es una función más en `src/app.js` que filtra la lista de reservas por sala y une los campos con `;`.

Validación: dev-lead — es una salida que una persona abre en su hoja de cálculo; el agente no puede comprobar cómo la ve Excel.

## Capacidades

- Nuevas: `bookings-export` — exportar a CSV las reservas de una sala.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings-export`), contrato público (el formato del CSV lo consume una hoja de cálculo ajena) · tamaño: ~40 líneas en 3 ficheros
- Dominio (sonnet): si el CSV de `Norte` (cabecera `sala;dia;franja` y `Norte;lun;10:00-12:00`) basta para cuadrar reservas, y si lo no decidido (qué compara el responsable) deja un hueco que el Scope no declara (señal: contrato público)
- Técnica (sonnet): si la salida por stdout con error por stderr funciona con `> norte.csv`, y si el literal `dia` sin tilde y sin BOM se abre bien en Excel con configuración en castellano (señal: contrato público)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin mirar a fondo el lado de la hoja de cálculo (separador, acentos, BOM), que es donde este formato suele fallar

1. Capacidad nueva `bookings-export` (el proyecto no tiene `capabilities/`) — el requisito es un comportamiento observable y la spec lo declara; nombre en inglés kebab-case.
2. Nombre del comando: `exportar <sala>` — verbo en castellano como `reservar`, `cancelar`, `libres`.
3. Salida por stdout, no por fichero — el responsable redirige con `>`; evita decidir rutas, nombres de fichero y qué hacer si ya existe.
4. Columnas `sala;dia;franja`, en ese orden — son los tres campos que hoy tiene una reserva. La cabecera va **sin tilde** (`dia`) y el CSV **sin BOM**: Excel en castellano abre UTF-8 sin BOM con los acentos rotos, y sin tilde la cabecera no depende de la codificación. Riesgo: una sala futura con tilde («Cafetería») saldría mal en Excel; hoy las salas son `Norte` y `Sur`.
5. Todas las reservas de la sala, sin filtros ni orden propio — el orden es el de la lista de reservas. El usuario no sabe qué compara el responsable (**pendiente**): filtrar por día o rango sería otra feature.
6. Sin reservas, solo la cabecera: `sala;dia;franja` — un CSV vacío de datos pero válido.
7. Sala distinta de las existentes (coincidencia exacta, distingue mayúsculas): error `sala desconocida: Oeste` por stderr, código de salida 1, sin nada en stdout — así `> oeste.csv` no guarda el mensaje como si fuera dato. Sin sala (`exportar` solo): error `uso: exportar <sala>`, igual.
8. Fin de línea `\n` — el que ya produce `console.log`.
9. Enfoque elegido: A, frente a B y C (ver Approach).
10. Repaso de coherencia: delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: crea `bookings-export.md` con 3 requisitos y las 5 reglas, sin rechazos; `capabilities/` del repo sin tocar.
11. **Review de la spec no despachada**: esta sesión no tiene herramienta para lanzar subagentes, así que los dos revisores de arriba no han leído la spec. Lo que habrían mirado queda sin cubrir; decide si lo apruebas así o la revisas tú.
- Política de modelos: revisores de la spec en sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Decisiones tomadas con el dev-lead

- Separador `;` — «Punto y coma (`;`), opción 1: el responsable abre el fichero en Excel con configuración en castellano.»
- Qué compara el responsable cada lunes: pendiente — «Qué compara exactamente, no sé.»

## Intent

Hoy el único dato de reservas es la lista interna de `src/app.js`; no hay comando que la muestre. El responsable de cada sala cuadra los lunes las reservas de su sala en su hoja de cálculo, y ahora tendría que transcribirlas a mano. Éxito: `salas exportar Norte > norte.csv` produce un fichero que Excel en castellano abre en tres columnas, con una fila por reserva de Norte. Fracaso, aunque funcione: que Excel lo abra en una sola columna, con acentos rotos, o con un mensaje de error dentro del fichero.

## Scope

- Entra: comando `exportar <sala>`; CSV `;` con cabecera; errores por stderr con código 1; tests.
- No entra: filtros por día o franja, orden, otros formatos (`.ics` es la fila 0009), exportar todas las salas a la vez, escribir a fichero, BOM, citado de campos con `;` o saltos de línea (hoy ningún campo los lleva), ayuda de uso general.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "exportar\|csv"` fuera de `.docs/sdd/specs`: solo `ROADMAP.md:19` (fila 0009, `.ics`) | Scope: la 0009 queda fuera |

- Filas que implementa: ninguna fila de `ROADMAP.md` (la 0010 se añade con esta feature) → ficheros que la nombran: ninguno | nada: comprobado con `git grep -niE "exportar|csv"`

## Approach

- A. Función `exportBookings(room)` en `src/app.js` que filtra `bookings`, une con `;` y la rama `exportar` de `run`; el entry captura el error y lo manda a stderr — un fichero, sigue el patrón de `freeRooms`; cuesta tocar el entry (`console.log` hoy no distingue errores).
- B. Módulo nuevo `src/csv.js` con un serializador genérico (citado, escape) — más preparado para columnas futuras, pero código sin uso hoy: ningún campo lleva `;`, comillas ni saltos.
- C. `run` devuelve el mensaje de error como texto, sin tocar el entry — cero cambios en el entry, pero `> oeste.csv` guardaría el error como dato.
- Elegido: A — el proyecto es un fichero de entrada sin dependencias (`operations.md`) y B añade abstracción sin uso; C rompe el criterio de éxito (nada de errores dentro del fichero).

`run` lanza `Error` con el mensaje; el entry (`if (command)`) lo captura, escribe en stderr y pone `process.exitCode = 1`.

## Dónde se prueba

- Exportar sala con reservas, sin reservas, y los dos errores: llamando a `run('exportar', [...])` en `test/app.test.js`, como los tests actuales; los errores con `assert.throws`.
- Que el error sale por stderr con código 1 y sin stdout: ejecutando `node src/app.js exportar Oeste` como proceso hijo en un test (`node:child_process`); es la única costura que cubre `> oeste.csv`.
- Cómo se ve en Excel en castellano: lo valida el dev-lead abriendo la salida de `node src/app.js exportar Norte`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings-export`

#### ADDED — Exportar a CSV las reservas de una sala

- GIVEN la sala `Norte` con la reserva `lun 10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN stdout es `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`
- AND cada línea termina en `\n` y no hay BOM

#### ADDED — Sala sin reservas

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN stdout es solo `sala;dia;franja`

#### ADDED — Sala desconocida o sin indicar

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `salas exportar Oeste`
- THEN stdout queda vacío, stderr dice `sala desconocida: Oeste` y el código de salida es 1
- AND con `salas exportar` sin sala, stderr dice `uso: exportar <sala>` y el código de salida es 1

#### Reglas de la capacidad — bookings-export

- **Dónde viven los datos**: la lista de reservas en memoria de `src/app.js`.
- **Idioma de los nombres**: comando y mensajes en castellano; cabecera `sala;dia;franja` sin tilde.
- **Límites**: no aplica.
- **Avisos**: `sala desconocida: <sala>` y `uso: exportar <sala>`, por stderr.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
