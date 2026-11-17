---
id: 20261113-150849-feature-0010-exportar-csv
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

🦆 Hasta ahora, para cuadrar una sala los lunes había que copiar las reservas a mano. Con `salas exportar Norte` sale por pantalla una tabla lista para la hoja de cálculo: una cabecera `sala;día;franja` y una línea por reserva, por ejemplo `Norte;lun;10:00-12:00`. Tú rediriges la salida a un fichero (`salas exportar Norte > norte.csv`) y lo abres en el Excel en castellano, que separa por punto y coma. El comando es una rama nueva de `run()` en `src/app.js` que recorre las reservas de esa sala.

Validación: dev-lead — es lo que usa una persona cada lunes y solo ella ve si el fichero se abre bien en su hoja de cálculo.

## Capacidades

- Nuevas: `bookings` — qué se puede consultar y sacar de las reservas de una sala

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), contrato público (el formato del CSV lo consume la hoja de cálculo del responsable) · tamaño: ~15 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (opus): si el THEN de «sala sin reservas» y el de «sala que no existe» dejan al responsable un fichero que no confunda con un lunes sin reservas (señal: capacidad nueva)
- Técnica (sonnet): si la cabecera `sala;día;franja` con tilde y sin BOM se abre bien en un Excel en castellano (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si un error de «sala no encontrada» puede confundirse con datos al redirigir la salida

Review no despachada: esta sesión no tiene herramienta para lanzar subagentes, así que la spec llega al gate sin los revisores. Los puntos de arriba quedan como lo que yo he mirado a mano en la pasada de coherencia.

1. Nombre del comando: `exportar <sala>` — sigue los verbos en castellano de `libres`, `reservar` y `cancelar`. Nadie lo dijo.
2. Capacidad nueva `bookings`, en inglés kebab-case (el slug es un nombre de fichero): sustantivo del dominio, y hoy `capabilities/` está vacía.
3. Cabecera: `sala;día;franja`, con tilde, tal cual dijiste las columnas. Riesgo mío: sin BOM, un Excel antiguo puede mostrar `dÃ­a`. Si pasa, la salida correcta es `dia` sin tilde o con BOM, y se enmienda.
4. Sin BOM, saltos de línea `\n`, sin comillas: los nombres de sala (`Norte`, `Sur`), los días y las franjas no llevan `;` ni saltos de línea.
5. «La semana que empieza ese lunes»: las reservas no guardan fecha, solo día de la semana, así que el comando saca todas las de la sala y no filtra por semana. Lo he supuesto yo.
6. Orden: el de alta en `bookings` (el de hoy en memoria), sin ordenar por día ni por hora.
7. Sala sin reservas: solo la cabecera (`sala;día;franja`), sin error.
8. Sala que no existe (`salas exportar Oeste`): `sala no encontrada: Oeste`, sin cabecera, para que un error no se cuele como datos al redirigir.
9. Sin sala (`salas exportar`): `uso: salas exportar <sala>`.
10. La sala se compara tal cual (`Norte`, no `norte`), como ya hace `libres` con las franjas.
11. No entra el `.ics` de la fila 0009: es otra exportación y sigue en Later.
12. Enfoque: una función pura `bookingsCsv(room)` llamada desde `run()`, frente a un módulo nuevo `src/csv.js` y a escribir el fichero desde el comando (descartado por ti). Ver Approach.
13. Delta probado en una copia de `.docs/sdd` fuera del repo: `sdd capability merge` añade los cuatro requisitos a `bookings.md` sin rechazos (`capabilities/` del repo sin tocar).
- Política de modelos: revisores de la spec, ninguno (sin herramienta de subagentes en esta sesión) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- La salida es la estándar y el responsable redirige a fichero él mismo — «Por la salida estándar: yo mismo redirijo el resultado a un fichero.»
- Columnas sala, día y franja, separadas por punto y coma — «necesita columnas sala, día y franja, separadas por punto y coma porque su Excel está en castellano.»

## Intent

Hoy `salas` solo muestra salas libres y crea o cancela reservas; no hay forma de sacar las reservas de una sala. El responsable de cada sala las cuadra los lunes en su hoja de cálculo y hoy tendría que copiarlas a mano. Se quiere un comando que las dé en CSV, con punto y coma. El éxito es que `salas exportar Norte > norte.csv` se abra en un Excel en castellano con tres columnas y una fila por reserva, sin arreglos a mano. Falla, aunque funcione, si el fichero se abre en una sola columna o con la tilde rota.

## Scope

- Entra: el comando `exportar <sala>` y sus tres salidas (reservas, sala sin reservas, error por sala desconocida o sin sala), con tests.
- No entra: filtrar por semana o por fecha (no hay fechas), escribir ficheros, exportar todas las salas a la vez, `.ics` (fila 0009), cambiar `reservar`, `libres` o `cancelar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "exportar\|csv"` fuera de `.docs/sdd/specs`: solo `ROADMAP.md:19` (fila 0009, `.ics`) | Scope: la fila 0009 queda fuera |

- Filas que implementa: nada: comprobado con `git grep -nE "0010" -- ROADMAP.md`. No hay fila para esta feature: nace de la petición directa.

## Approach

- Función pura `bookingsCsv(room)` en `src/app.js` llamada desde `run()` — no añade ficheros y se prueba como `libres`, con `run()` comparando texto.
- Módulo nuevo `src/csv.js` — separa la lógica, pero es un fichero más para 5 líneas y la constitución no pide módulos.
- Escribir el fichero desde el comando — descartado por el dev-lead.
- Elegido: función pura en `src/app.js` — encaja con el estilo actual, el coste es que `app.js` crece unas líneas.

Las partes que fija: la cabecera es la constante `sala;día;franja`; cada reserva de la sala sale como `${room};${day};${slot}`; las líneas se unen con `\n` y no hay salto final.

## Dónde se prueba

- Reservas, sala sin reservas, sala desconocida y sin sala: por `run('exportar', [...])` en `test/app.test.js`, como los tests actuales de `libres` y `cancelar`.
- Que el fichero se abre bien en la hoja de cálculo: lo valida el dev-lead a mano (`Validación: dev-lead`).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Exportar a CSV las reservas de una sala

- GIVEN la sala Norte con la reserva `lun` `10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN sale `sala;día;franja` y debajo `Norte;lun;10:00-12:00`
- AND los campos van separados por `;`, sin comillas y sin BOM

#### ADDED — Exportar una sala sin reservas

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN sale solo `sala;día;franja`

#### ADDED — Exportar una sala que no existe

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `salas exportar Oeste`
- THEN sale `sala no encontrada: Oeste`
- AND no sale la cabecera

#### ADDED — Exportar sin indicar la sala

- GIVEN cualquier estado de las reservas
- WHEN se ejecuta `salas exportar` sin sala
- THEN sale `uso: salas exportar <sala>`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
