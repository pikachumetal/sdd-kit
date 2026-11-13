---
id: 20261113-143801-feature-0010-exportar-reservas-csv
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

🦆 Hoy, para cuadrar las reservas de una sala, el responsable tiene que mirarlas en la terminal y copiarlas a mano. Con esta feature escribe `salas exportar Norte` y obtiene una tabla con una fila por reserva: `Norte,lun,10:00-12:00`. La guarda con `> norte.csv` y la abre en su hoja de cálculo. Por dentro es una orden nueva en el fichero de entrada que filtra las reservas por sala y las escribe separadas por comas.

Validación: dev-lead — es una salida que una persona abre en su hoja de cálculo; el agente no puede comprobar cómo la ve.

## Capacidades

- Nuevas: `room-bookings` — las reservas de una sala, consultadas y exportadas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (el CSV lo consume una hoja de cálculo), capacidad nueva (`room-bookings`) · tamaño: ~45 líneas en 3 ficheros
- Dominio (sonnet): si la cabecera `sala,dia,franja` y los valores de `dia` (`lun`) se pueden cuadrar sin fechas concretas (señal: contrato público)
- Técnica (sonnet): si los cuatro escenarios cubren las salidas de `run('exportar', …)` y si el separador coma abre bien en una hoja (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el CSV le sirve de verdad al responsable
- **No se ha despachado ninguno:** esta sesión no tiene herramienta para lanzar subagentes. La spec va al gate sin revisión independiente; la pasada de coherencia la he hecho yo.

1. Nombre del comando: `exportar <sala>` (`salas exportar Norte`). Frente a `exportar-csv`: es el único formato que se exporta; si llega el `.ics` de la 0009 se decidirá entonces.
2. La salida va por pantalla (stdout), igual que el resto de órdenes; se guarda con `> norte.csv`. No escribe ficheros por su cuenta ni pide una ruta.
3. Columnas: `sala,dia,franja`, con cabecera en castellano (art. 4 de la constitución). `dia` es lo que guarda hoy cada reserva (`lun`), no una fecha.
4. Separador: coma, fin de línea `\n`, sin BOM ni comillas. **Riesgo que no puedo medir:** un Excel configurado en castellano abre un CSV con comas en una sola columna; Google Sheets y LibreOffice lo abren bien. Si tu hoja es un Excel en castellano, hay que cambiar a `;`.
5. El orden de las filas es el de alta de las reservas.
6. La sala se busca tal cual está escrita (`Norte`, con mayúscula inicial); `norte` no coincide y da el mismo aviso que una sala inexistente.
7. Sala sin reservas: sale solo la cabecera. Sala que no existe: `sala desconocida: Oeste`. Sin sala: `uso: exportar <sala>`. Los textos son míos.
8. Capacidad nueva `room-bookings`: nombre en inglés kebab-case por la regla de la plantilla. Solo recoge este comportamiento; `libres`, `reservar` y `cancelar` no tienen capacidad y no los vuelco.
9. Enfoque: A (elegido) — función `bookingsCsv(room)` en `src/app.js` que usa el mismo `bookings`, frente a B — fichero `src/csv.js` nuevo. B es más estructura de la que justifican 10 líneas, y el proyecto trabaja con un solo fichero de entrada (operations.md).
10. Sin comillas ni escape: salas y franjas son valores cerrados (`Norte`, `10:00-12:00`) y no llevan comas. Si algún día una sala las lleva, hay que añadirlo.
11. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` añade los 4 requisitos a `room-bookings.md` y `sdd capability check` da «Capacidades válidas: 1». El repo no se ha tocado.

### Pendiente de descubrimiento

- **Contra qué cuadra el responsable las reservas los lunes.** No lo sé y el dev-lead dijo «No sé contra qué cuadra. Decide tú.»: no lo invento. Afecta a si hacen falta fechas concretas, filtro por semana o más columnas; hoy el CSV solo vuelca lo que hay guardado. Se afina cuando se use por primera vez, y lo recoge el walkthrough.

### Decisiones tomadas con el dev-lead

- Exportar a CSV las reservas de una sala, para que su responsable las cuadre los lunes en su hoja de cálculo — petición original.
- Las decisiones de método y de formato las toma el agente — «No sé contra qué cuadra. Decide tú.»

- Política de modelos: ningún revisor de la spec (sin subagentes en esta sesión) · ejes de la revisión final: los del kit, según lo permita la sesión · sin despachos en paralelo previstos.

## Intent

Hoy `salas` guarda las reservas pero no las puede sacar de la terminal en un formato que una hoja de cálculo entienda. El responsable de cada sala las cuadra los lunes en esa hoja. Éxito: `salas exportar Norte > norte.csv` produce un fichero que la hoja abre con una fila por reserva y tres columnas. Sería un fracaso que saliera una sola columna, o con cabeceras que obliguen a retocarlo a mano.

## Scope

- Entra: la orden `exportar <sala>` en `src/app.js`; sus cuatro casos de salida; sus tests; la capacidad `room-bookings`.
- No entra: fechas concretas por reserva (el modelo no las guarda); filtrar por semana; exportar todas las salas a la vez; escribir a un fichero; escape de comas y comillas; BOM; el `.ics` (fila 0009, otra idea); las reservas semanales de `--cada-semana` (esa orden hoy solo responde un texto y no guarda nada).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "exportar\|csv\|export"` fuera de las carpetas de evidencia: solo `ROADMAP.md:19` (fila 0009, `.ics`) y `src/app.js:9` (`export function run`) | ninguno: la 0009 es otra feature y `export` es sintaxis de módulos |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv|0010"`. La feature 0010 no tiene fila en `ROADMAP.md`; el cierre la añade.

## Approach

- A — función `bookingsCsv(room)` en `src/app.js` — 10 líneas, se prueba por `run`, sin ficheros nuevos.
- B — `src/csv.js` aparte — más estructura de la que justifica el tamaño.
- Elegido: A — un solo fichero de entrada (operations.md) y el cambio cabe en una task.

`run('exportar', [sala])` devuelve el texto completo (cabecera y filas unidas con `\n`, sin salto final); `console.log` ya añade el último. Los avisos de la decisión 7 se devuelven como cadena, como hace `run` con el resto.

## Dónde se prueba

- Los cuatro escenarios: `run('exportar', […])` en `test/app.test.js`, con el patrón de los tests actuales (`assert.equal` sobre el texto devuelto).
- Cómo lo ve la hoja de cálculo: lo comprueba el dev-lead al validar, abriendo `node src/app.js exportar Norte > norte.csv`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-bookings`

#### ADDED — Exportar a CSV las reservas de una sala

- GIVEN la sala `Norte` con una reserva el `lun` de `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida es `sala,dia,franja` y debajo `Norte,lun,10:00-12:00`, una fila por reserva y en el orden en que se hicieron

#### ADDED — Una sala sin reservas se exporta solo con la cabecera

- GIVEN la sala `Sur`, sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es solo `sala,dia,franja`

#### ADDED — Una sala que no existe no se exporta

- GIVEN que no hay ninguna sala `Oeste`
- WHEN se ejecuta `exportar Oeste`
- THEN la salida es `sala desconocida: Oeste`

#### ADDED — Exportar exige indicar la sala

- GIVEN cualquier estado de las reservas
- WHEN se ejecuta `exportar` sin sala
- THEN la salida es `uso: exportar <sala>`

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
