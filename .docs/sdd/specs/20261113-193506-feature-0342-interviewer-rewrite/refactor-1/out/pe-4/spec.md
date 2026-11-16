---
id: 20261113-221758-feature-0010-exportar-csv-sala
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

🦆 Hoy no hay forma de sacar las reservas de una sala fuera de la herramienta. Con esto, `node src/app.js exportar Norte > norte.csv` deja un fichero que Excel en castellano abre ya en tres columnas: `sala`, `día` y `franja` (`Norte;lun;10:00-12:00`). El responsable de la sala lo abre los lunes y cuadra las reservas con su hoja. Por dentro es un comando nuevo `exportar` en `src/app.js` que construye el texto del CSV con `;` como separador.

Validación: dev-lead — el CSV lo abre una persona en Excel y lo que importa (tildes, columnas) solo se ve ahí.

## Capacidades

- Nuevas: `booking-export` — qué contiene y cómo se escribe la exportación de las reservas de una sala.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el fichero CSV lo consume Excel) · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (opus): si «Exportar las reservas de una sala» cubre lo que cuadra el responsable cada lunes y qué falta (señal: capacidad nueva)
- Técnica (sonnet): si `;` + BOM + CRLF bastan para que Excel en castellano abra tres columnas con la tilde de `día`, y si el escape del requisito «Campos con caracteres especiales» es correcto (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si faltan columnas que el responsable necesita

1. Enfoque: función pura que construye el texto, devuelta por `run` como el resto de comandos (ver Approach).
2. Nombre del comando: `exportar <sala>` — verbo en castellano como `libres`, `reservar`, `cancelar`.
3. Contenido: tres columnas `sala`, `día`, `franja`, en ese orden, con cabecera. Son los únicos datos que tiene una reserva hoy; quién reserva y la fecha concreta no existen y no entran.
4. Formato para Excel en castellano: separador `;`, UTF-8 con marca BOM (`﻿`) al principio, fin de línea CRLF entre líneas; la última fila no lleva CRLF propio porque `console.log` añade el salto final al imprimir. Con `,` Excel lo abriría en una sola columna; sin BOM, `día` saldría con la tilde rota.
5. Salida por la salida estándar, para redirigirla con `>`: el comando no escribe ficheros ni pide una ruta.
6. Sala sin reservas: solo la cabecera (`sala;día;franja`).
7. Sala que no existe: el texto `sala desconocida: <nombre>`, sin cabecera ni BOM. La sala se busca con el nombre exacto de la lista de salas (`Norte`, `Sur`), como hace `libres`.
8. Sin nombre de sala: el texto `uso: exportar <sala>`.
9. Las reservas semanales (`--cada-semana`) no se distinguen: hoy no se guardan como dato, solo devuelven un texto. Queda fuera.
10. Escape: un campo con `;`, comillas o salto de línea va entre comillas dobles y las comillas internas se duplican (`"a;b"`, `"di ""hola"""`). Hoy ningún dato lo necesita; se fija para que no se rompa si aparecen.
11. Redirección: asumo shell tipo POSIX (`> norte.csv`), como en el servidor donde lo despliegas. En PowerShell 5 `>` reescribe en UTF-16 y el BOM no sirve.
12. Capacidad nueva: `booking-export` (slug en inglés, kebab-case).
13. No hay fila de roadmap para esta feature; el id 0010 lo reservé con `sdd id next --reserve`. La idea 0009 (.ics) es otra cosa y no se toca.
- Pendiente de ti: nada.
- Política de modelos: revisores de la spec con modelo: ninguno despachado (esta sesión no tiene herramienta para lanzar subagentes; la revisión adversarial la hago yo en línea, ver Hallazgos) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Hallazgos de la review

Revisión en línea (sin subagentes, ver Política de modelos), con las dos lentes juntas y los siete puntos:

- **Aceptado** — Importante · Delta, «Exportar las reservas de una sala»: el THEN terminaba en `\r\n`, pero `console.log` añade un `\n` y el fichero acabaría en `\r\n\n` (una línea vacía en Excel) → la salida de `run` no lleva `\r\n` final; decisión 4, Approach y THEN corregidos.
- **Aceptado** — Importante · Dónde se prueba: el escape se prueba «con datos de prueba» pero `exportCsv(sala)` no los admite → firma `exportCsv(sala, lista = bookings)`.
- **Rechazado** — Menor · Escape: un campo que empieza por `=` podría leerse como fórmula en Excel → no hay más usuarios ni datos de terceros (`PRODUCT.md`), y los datos son del propio responsable.
- Sin hallazgos sobre capacidades existentes (no hay), ejemplos (salen del código) ni reglas de producto (la constitución no fija ninguna).

Pasada de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` en una carpeta temporal fuera del repo: 5 requisitos y 5 reglas añadidos a `booking-export.md`, sin rechazos; el `capabilities/` del repo no se toca.

### Decisiones tomadas con el dev-lead

- Exportar a CSV, por sala, para cuadrar las reservas los lunes — «añade un comando que exporte a CSV las reservas de una sala, porque el responsable de cada sala las cuadra los lunes en su hoja de cálculo»
- El programa de destino es Excel con configuración regional en castellano — «Excel, con la configuración regional en castellano.»

## Intent

Hoy las reservas solo se ven dentro de `salas`. El responsable de cada sala las cuadra los lunes en una hoja de cálculo (Excel, regional castellano) y tiene que copiarlas a mano. Éxito: `exportar <sala>` da un CSV que Excel abre en tres columnas con las tildes bien, sin tocar nada. Fracaso aunque «funcione»: un CSV con `,` que Excel abre en una sola columna, o con `día` ilegible.

## Scope

- Entra: comando `exportar <sala>` en `src/app.js`; sus tests en `test/app.test.js`.
- No entra: columnas de quién reserva o fecha concreta (no existen en los datos); distinguir reservas semanales; escribir a fichero o elegir ruta; exportar todas las salas a la vez; el .ics (fila 0009); validación del formato de franja (deuda «Por triar»).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv|export"` fuera de `.docs/sdd/specs` (solo `ROADMAP.md:19`, la idea 0009 .ics, y `export function run`, sin relación).

## Approach

- Función pura `exportCsv(sala, lista = bookings)` en `src/app.js` que devuelve el texto, y `run('exportar', params)` la llama: se prueba sola, como `freeRooms`. Cuesta una función más en un fichero que hoy tiene una.
- Escribir un fichero desde el comando (`exportar Norte norte.csv`): descartado, añade rutas, sobrescrituras y errores de disco para un uso que `>` ya cubre.
- Módulo separado `src/export.js`: descartado, `operations.md` fija «un solo fichero de entrada» y esto son pocas líneas.
- Elegido: la función pura en `src/app.js`, salida por `run` (decisiones 1 y 5).

Lo que fija: el texto es `﻿` + cabecera + filas, las líneas unidas con `\r\n` y sin `\r\n` final; las filas siguen el orden de `bookings`.

## Dónde se prueba

- Contenido y formato del CSV: llamando a `run('exportar', ['Norte'])`, como los tests de `libres` y `cancelar` en `test/app.test.js`; sin pantalla ni captura.
- Sala sin reservas, sala desconocida, sin argumento: igual, por `run`.
- Escape de campos: por la función pura `exportCsv` con datos de prueba, porque hoy ninguna reserva real lo necesita.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala `Norte` con la reserva `lun 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida es `﻿sala;día;franja\r\nNorte;lun;10:00-12:00`

#### ADDED — Sala sin reservas

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es `﻿sala;día;franja`

#### ADDED — Sala desconocida

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Este`
- THEN la salida es `sala desconocida: Este`, sin cabecera ni BOM

#### ADDED — Falta el nombre de la sala

- GIVEN cualquier estado
- WHEN se ejecuta `exportar` sin argumentos
- THEN la salida es `uso: exportar <sala>`

#### ADDED — Campos con caracteres especiales

- GIVEN una reserva de `Norte` con franja `a;b` y otra con franja `di "hola"`
- WHEN se exporta `Norte`
- THEN las filas salen `Norte;lun;"a;b"` y `Norte;lun;"di ""hola"""`

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: no aplica, la exportación no guarda nada
- **Idioma de los nombres**: castellano (`sala`, `día`, `franja`)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <nombre>`, `uso: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
