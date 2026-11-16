---
id: 20261114-224647-feature-0010-exportar-reservas-csv
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

🦆 Hoy `salas` no deja sacar las reservas de una sala a una hoja de cálculo. Con esto, `node src/app.js exportar Norte` escribe en pantalla una tabla de texto con una fila por reserva, por ejemplo `Norte;lun;10:00-12:00`, que se guarda con `> norte.csv` y se abre en la hoja. Por dentro es una función que convierte las reservas de esa sala en líneas separadas por `;` y la engancha al comando `run` existente. No se sabe qué compara el responsable de la sala los lunes, así que no hay filtros ni columnas pensadas para ese cuadre: eso queda pendiente.

Validación: dev-lead — lo usa una persona y lo que cuenta es que la hoja de cálculo lo abra en columnas; el agente no tiene hoja con la que comprobarlo.

## Capacidades

- Nuevas: `bookings-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings-export`), contrato público (el CSV lo consume una hoja de cálculo) · tamaño: ~40 líneas en 3 ficheros
- Dominio (opus): si `sala;dia;franja` y el orden de inserción bastan para lo que el responsable hace con las reservas, y si «sala sin reservas» debe dar solo cabecera (señal: capacidad nueva)
- Técnica (sonnet): si `;` y UTF-8 sin BOM se abren en columnas en la hoja, y si el entrecomillado de la decisión 6 es correcto (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las columnas sirven al cuadre del lunes

**Esta sesión no ha lanzado esa review**: no dispone de herramienta para despachar subagentes. Va sin revisar y lo declaro aquí en vez de simular que se hizo.

1. Comando `exportar <sala>` que escribe el CSV por pantalla (el usuario redirige con `> norte.csv`) — es como ya responden `libres` y `cancelar` (devuelven texto que `app.js` imprime) y no toca el sistema de ficheros.
2. Columnas `sala;dia;franja`, con cabecera — son los tres campos que hoy tiene una reserva; nadie dijo qué necesita el cuadre, así que no invento ninguno más ni parto la franja en inicio y fin.
3. Separador `;` — la hoja de cálculo en castellano suele abrir el CSV con coma en una sola columna; `;` se abre en columnas. Sin medir: no sé qué hoja usa el responsable.
4. UTF-8 sin BOM y saltos de línea `\n` — hoy los datos no llevan acentos; si algún nombre de sala los lleva, Excel puede necesitar BOM. Sin medir.
5. Orden: el de alta de las reservas — no hay criterio de orden pedido.
6. Un valor con `;`, `"` o salto de línea va entre comillas dobles, y las `"` interiores se duplican — evita que un valor parta una fila en columnas de más. Hoy ningún dato lo provoca (la franja no se valida, ver deuda «Sin validación del formato de franja horaria»), por eso se prueba sobre la función.
7. Sala sin reservas: solo la cabecera `sala;dia;franja` — es un CSV válido y se distingue de un error.
8. Sala que no existe: `sala desconocida: Oeste`; sin sala: `uso: exportar <sala>` — textos míos, en castellano por la constitución, y devueltos como texto igual que el resto de comandos.
9. Capacidad nueva `bookings-export` — el proyecto no tiene capacidades; esta recoge un comportamiento nuevo y no hay otra a la que sumarlo.
10. Enfoque: A, una función `toCsv` en `src/app.js` y la rama nueva en `run`, frente a B y C (ver Approach).
- Pendiente (sin decidir, del usuario): qué compara el responsable cada lunes y contra qué lo cuadra. Dicho por el usuario: «No sé qué compara exactamente ni contra qué lo cuadra… Decide tú». Hasta saberlo: sin filtro por día o semana, sin columnas de cuadre.
- Coherencia: delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: añade 4 requisitos y 5 reglas a `bookings-export.md`, sin rechazos; el `capabilities/` del repo no cambia.
- Política de modelos: revisores de la spec — ninguno despachado (sin herramienta de subagentes) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- La spec decide formato y columnas sin su entrada — «Decide tú»

## Intent

Hoy no hay forma de sacar las reservas de una sala de `salas`. El responsable de cada sala las cuadra los lunes en su hoja de cálculo, y para eso tiene que poder llevárselas allí sin reescribirlas. Éxito: `exportar Norte > norte.csv` produce un fichero que la hoja abre en tres columnas (`sala`, `dia`, `franja`) con una fila por reserva de esa sala. Fracaso, aunque funcione: que la hoja lo abra todo en una sola columna, o que una reserva parta su fila en columnas de más.

## Scope

- Entra: comando `exportar <sala>`; CSV `sala;dia;franja` con cabecera; entrecomillado de valores; mensajes de sala desconocida y de uso; una línea en `README.md` que lo nombre.
- No entra: filtros por día o semana; columnas de cuadre (aún no se sabe qué compara el responsable); escribir el fichero (`--salida`); exportar todas las salas de una vez; las reservas semanales de `--cada-semana`, que hoy `run` no guarda en `bookings`; protección contra fórmulas (`=`, `+`, `-`, `@` al principio de un valor), porque los datos son propios.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "export|csv"` (solo la 0009 `.ics` del roadmap, que es otra cosa y no se toca) y con `git grep -n 0010`.

## Approach

- A: función `toCsv` en `src/app.js` y rama `exportar` en `run` — ~15 líneas, un solo fichero, se prueba por `run` como los tests actuales. Cuesta: `app.js` crece.
- B: módulo nuevo `src/csv.js` — aísla el formato, pero para 15 líneas añade un fichero y su import.
- C: escribir el fichero con `--salida <ruta>` — evita redirigir, pero añade rutas, sobrescritura y permisos que nadie pidió.
- Elegido: A — es lo mínimo que cubre lo pedido y sigue cómo ya responden los demás comandos; si crece, se saca a un módulo después.

`toCsv(filas)` recibe una lista de reservas y devuelve el texto con cabecera; `run('exportar', [sala])` filtra `bookings` por sala y lo llama.

## Dónde se prueba

- Exportar una sala con y sin reservas, sala desconocida y falta de sala: por `run`, en `test/app.test.js`, como los tests actuales.
- Entrecomillado: sobre `toCsv` exportada, porque ningún dato de `bookings` lo provoca hoy.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN las reservas `Norte · lun · 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida es `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`, sin línea final extra

#### ADDED — Sala sin reservas

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es solo `sala;dia;franja`

#### ADDED — Sala desconocida o ausente

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Oeste`
- THEN la salida es `sala desconocida: Oeste`
- AND `exportar` sin sala responde `uso: exportar <sala>`

#### ADDED — Valores con separador o comillas

- GIVEN una reserva con franja `10:00;12:00` y otra con franja `a"b`
- WHEN se convierten a CSV
- THEN salen como `"10:00;12:00"` y `"a""b"`, cada una en su columna

#### Reglas de la capacidad — bookings-export

- **Dónde viven los datos**: no aplica, no hay datos nuevos; se leen de las reservas existentes
- **Idioma de los nombres**: castellano (`sala`, `dia`, `franja`)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` · `uso: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
