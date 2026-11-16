---
id: 20261113-222025-feature-0010-exportar-reservas-csv
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

🦆 Podrás escribir `salas exportar Norte > norte.csv` y obtener un fichero que se abre en la hoja de cálculo con una fila por reserva de esa sala, por ejemplo `Norte;lun;10:00-12:00`, ordenadas por día de la semana y hora. Pedir una sala que no existe da un error claro, y una sala sin reservas da solo la fila de cabecera. Por dentro es un comando nuevo en `src/app.js` que lee la lista de reservas que ya existe y la imprime con `;` como separador.

Validación: dev-lead — lo que se ve es un fichero que una persona abre en su hoja de cálculo; el agente no puede comprobar cómo lo interpreta.

## Capacidades

- Nuevas: `bookings-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings-export`), contrato público (el CSV lo consume una hoja de cálculo ajena) · tamaño: ~15 líneas de código en 1 fichero + tests
- Dominio (opus): si el orden por día y franja y la cabecera `sala;dia;franja` bastan para cuadrar reservas, y qué pasa con una sala sin reservas o inexistente (señal: capacidad nueva)
- Técnica (sonnet): si `;` sin comillas ni BOM se abre bien en una hoja de cálculo en castellano y si el orden de días cubre días escritos de otra forma (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin mirar la lente técnica del formato del fichero

> Estado de la review: **no despachada**. Esta sesión no dispone de herramienta para lanzar subagentes, y el kit no permite sustituir a los revisores por mí mismo. Hay que despacharla antes de aprobar, o decidir tú sin review; no la doy por hecha.

1. Nombre del comando: `salas exportar <sala>` — verbo en infinitivo como `reservar`, `cancelar`, `libres`; es lo que el responsable teclea.
2. Salida por pantalla (stdout), sin fichero: `salas exportar Norte > norte.csv` — `run()` ya devuelve texto y `app.js` lo imprime; el redireccionamiento lo hace la terminal y no añade ni un flag ni un camino de escritura a disco.
3. Columnas `sala;dia;franja` con cabecera — son los tres campos que ya tiene cada reserva y que ya usan `libres` y `cancelar`; nombres sin tildes y en castellano (art. 4 de la constitución). Si el lunes necesita otra columna, se añade aparte.
4. Separador `;` — una hoja de cálculo en castellano (Excel con configuración regional de España) abre un CSV con `,` entero en una sola columna; con `;` lo parte bien. Google Sheets y LibreOffice lo detectan igual.
5. Sin comillas, sin BOM, UTF-8, saltos de línea `\n` — las salas y franjas son valores fijos sin `;` ni comillas ni tildes (`Norte`, `Sur`, `10:00-12:00`).
6. Orden: por día `lun, mar, mie, jue, vie, sab, dom` y, dentro del día, por franja de menor a mayor hora — es el orden en que se cuadra una semana; un día con otra grafía va al final, en el orden en que se reservó.
7. Sala sin reservas: solo la cabecera `sala;dia;franja`, sin error — no tener reservas es un estado válido de una sala, y la hoja del lunes sale vacía.
8. Sala que no existe o sin argumento: `sala desconocida: Oeste` y `uso: salas exportar <sala>` — evita exportar un fichero vacío por un error de escritura (`norte` ≠ `Norte`; se compara exacto, como el resto del programa).
9. No entra el calendario `.ics` (es la 0009), ni exportar todas las salas a la vez, ni filtrar por fechas.
10. Capacidad nueva `bookings-export`, en inglés kebab-case por ser nombre de fichero; el proyecto no tiene capacidades todavía.
11. Reglas de la capacidad: datos en la lista `bookings` de memoria de `src/app.js`; nombres en castellano; sin topes; aviso solo por sala desconocida; sin regla de conflicto — la constitución no trae «Reglas de producto», así que son mías.
12. Enfoque: A (función pura aparte, `exportar`, en `src/app.js`), frente a B (módulo nuevo `src/export.js`) y C (flag `--csv` sobre un listado) (ver Approach).
- Fusión del delta probada en una copia de `.docs/sdd`: `sdd capability merge` sale con 0, añade 4 requisitos y las 5 reglas a `bookings-export.md`; `capabilities/` del repo no cambia.
- Pendiente de ti: con qué compara el responsable las filas el lunes (dijiste no saberlo). Si compara contra otra hoja con columnas distintas, o con fechas reales, las columnas y el orden de la decisión 3 y 6 cambiarían.
- Política de modelos: revisores de la spec con modelo (dominio opus, técnica sonnet) — sin despachar en esta sesión, ver arriba · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Carril feature, modo full — «Carril feature, modo full: añade un comando que exporte a CSV las reservas de una sala»
- Todo lo no dicho lo decido yo — «Con qué compara exactamente, no sé; lo demás, decide tú.»

## Intent

Hoy las reservas viven dentro del programa y la única forma de verlas es ejecutar `libres` o recordarlas. El responsable de cada sala las cuadra los lunes en su hoja de cálculo, así que necesita sacar las de su sala en un fichero que la hoja abra bien. Éxito: `salas exportar Norte > norte.csv` produce un fichero que se abre en la hoja con tres columnas separadas y una fila por reserva, en orden de semana. Fracaso aunque funcione: que la hoja lo abra todo en una sola columna, o que una sala mal escrita dé un fichero vacío sin avisar.

## Scope

- Entra: comando `exportar <sala>` que imprime las reservas de esa sala en CSV; errores de sala desconocida y de falta de argumento; el texto de uso en el README.
- No entra: exportar a `.ics` (0009), exportar todas las salas, filtrar por día o rango, escribir a fichero con un flag, cambiar cómo se guardan las reservas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: ninguna (id 0010 reservado sin fila; la 0009 es otra cosa, el `.ics`) → comprobado con `git grep -niE "exportar|csv|0009|0010"`: solo `ROADMAP.md:19` (la 0009, no se toca).

## Approach

- A: una función `exportar(sala)` en `src/app.js`, junto a `freeRooms`, llamada desde `run()` — cuesta ~15 líneas y comparte el array `bookings` sin exportarlo; se prueba por `run('exportar', ['Norte'])` como los tests actuales.
- B: módulo nuevo `src/export.js` — obliga a exportar `bookings` y `rooms` o pasarlos; para un comando de 15 líneas añade un fichero y una dependencia interna.
- C: un flag `--csv` sobre un listado de reservas — no existe ese listado hoy; habría que crear dos comandos.
- Elegido: A — es la única que no crea estructura nueva y encaja en el único fichero de entrada que fija `operations.md`.

La salida es una cabecera `sala;dia;franja` y una línea `Norte;lun;10:00-12:00` por reserva de la sala, unidas con `\n` y sin salto final (`console.log` ya lo añade). Una sala que no está en `rooms` devuelve `sala desconocida: <nombre>`; sin argumento, `uso: salas exportar <sala>`.

## Dónde se prueba

- Todos los escenarios: por `run('exportar', [...])` en `test/app.test.js`, igual que `libres` y `cancelar`; no hay pantalla que capturar.
- Que la hoja de cálculo lo abre bien: lo valida el dev-lead a mano con un `norte.csv` real (Validación: dev-lead).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala `Norte` con la reserva `lun 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida es `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`
- AND solo aparecen reservas de `Norte`, no las de `Sur`

#### ADDED — Las reservas salen en orden de semana

- GIVEN `Norte` con las reservas `mar 09:00-10:00`, `lun 11:00-12:00` y `lun 10:00-11:00`
- WHEN se ejecuta `exportar Norte`
- THEN las líneas de datos son, en este orden, `Norte;lun;10:00-11:00`, `Norte;lun;11:00-12:00` y `Norte;mar;09:00-10:00`

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es exactamente `sala;dia;franja`

#### ADDED — Sala desconocida o sin indicar

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Oeste`
- THEN la salida es `sala desconocida: Oeste` y no hay cabecera CSV
- AND `exportar` sin sala da `uso: salas exportar <sala>`

#### Reglas de la capacidad — bookings-export

- **Dónde viven los datos**: lista `bookings` en memoria de `src/app.js`
- **Idioma de los nombres**: castellano, sin tildes (`sala;dia;franja`)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <nombre>` y `uso: salas exportar <sala>`
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
