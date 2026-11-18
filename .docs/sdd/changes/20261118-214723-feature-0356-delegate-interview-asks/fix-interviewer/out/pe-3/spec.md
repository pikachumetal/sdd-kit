---
id: 20261118-233923-feature-0010-exportar-csv
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

🦆 Nuevo comando `salas exportar Norte`: imprime las reservas de esa sala como CSV, listo para redirigirlo a un fichero y abrirlo en la hoja de cálculo. Por ejemplo, `salas exportar Norte > norte.csv` deja un fichero con la cabecera `sala;dia;franja` y una fila por reserva, como `Norte;lun;10:00-12:00`. Por dentro es una función que construye el texto y una rama nueva en `run` de `src/app.js`.

Validación: dev-lead — el CSV lo abre una persona en su hoja de cálculo; solo ella ve si las columnas salen bien separadas.

## Capacidades

- Nuevas: `booking-export` — exportación de las reservas de una sala a CSV.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (el formato del CSV lo consume una hoja de cálculo ajena), capacidad nueva (`booking-export`) · tamaño: ~40 líneas en 3 ficheros
- Dominio (sonnet): si «Exportar las reservas de una sala» y «Sala sin reservas» dejan algo que el responsable no pueda cuadrar, y si «el responsable» choca con «No hay más usuarios» de `PRODUCT.md` (señal: capacidad nueva)
- Técnica (sonnet): si el separador `;` y la salida sin BOM se abren bien en una hoja en castellano, y si la rama nueva de `run` respeta el patrón de `libres` y `cancelar` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las columnas sirven para lo que el responsable cuadra, que además está pendiente

1. Nombre del comando: `exportar <sala>` — sigue el verbo en infinitivo de `reservar`, `cancelar` y `libres`.
2. La salida va por la salida estándar, sin opción de fichero — `run` devuelve un texto y el usuario lo redirige (`> norte.csv`).
3. Separador `;` y no `,` — una hoja de cálculo con configuración regional en castellano abre `,` como una sola columna. Si el responsable usa otra configuración, hay que revisarlo.
4. Columnas `sala;dia;franja`, con cabecera, en ese orden, en minúsculas y sin tilde — son los tres datos que guarda hoy cada reserva. **Pendiente**: qué columnas mira el responsable y qué comprueba al cuadrar no se sabe; el dev-lead dijo «no lo sé».
5. Una fila por reserva en el orden en que están guardadas, sin ordenar — hoy no hay fechas, solo el día de la semana, y ordenar sería inventar un criterio.
6. Sala sin reservas: solo la cabecera `sala;dia;franja`, sin error — una sala libre es un caso válido para quien cuadra.
7. Sala que no existe: `sala desconocida: Este`. Es un texto nuevo.
8. Sin sala (`salas exportar`): `falta la sala: usa «exportar <sala>»`. Es un texto nuevo.
9. Sin escapado de comillas ni de `;` dentro de un campo, UTF-8 sin BOM y saltos de línea `\n` — las salas son una lista fija (`Norte`, `Sur`) y ningún dato lleva `;` ni tilde; se revisa si hay nombres libres.
10. Capacidad nueva `booking-export` — el proyecto no tiene `capabilities/` y esta feature es el primer comportamiento que declara; nombre en kebab-case en inglés.
11. Enfoque: función `exportCsv(sala)` en `src/app.js`, frente a un módulo `src/export.js` y a un flag `--csv` sobre un listado que no existe (ver Approach).
12. Sin `§Frontend`: es un comando de terminal, sin pantalla.
13. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` sale con 0 y añade los 4 requisitos a `booking-export.md`; el `capabilities/` del repo no cambia.
14. El nombre de la sala se compara tal cual, con mayúsculas como `libres` y `cancelar`: `salas exportar norte` da `sala desconocida: norte`.
15. Quién ejecuta el comando: **pendiente**. `PRODUCT.md` dice que solo lo usa el dev-lead; el responsable recibe el CSV, no lo genera. La spec no cambia por ello, pero `PRODUCT.md` queda tal cual.
- Política de revisión: no se despacharon revisores porque la sesión no tiene herramienta de subagentes; la revisión la hizo la propia sesión con las dos lentes y los siete puntos. No es independiente: si prefieres revisores aparte, dilo y se hace en otra sesión.

### Hallazgos de la review

- **Aceptado** — Importante · «Exportar las reservas de una sala» · el THEN no dice si hay salto de línea final → añadido «sin salto de línea final propio (el que se ve al final lo añade `console.log`)».
- **Aceptado** — Menor · decisiones · el caso `norte` en minúsculas no estaba dicho → decisión 14.
- **Aceptado** — Menor · Intent y `PRODUCT.md` · «el responsable» no es usuario del programa según `PRODUCT.md` → decisión 15, pendiente.
- **Rechazado** — Menor · separador · ofrecer `,` o `;` con un flag → fuera de Scope; se revisa en la validación con un fichero real.
- Sin Críticos: no hay segunda ronda.
- Política de modelos: revisores de la spec en sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

### Decisiones tomadas con el dev-lead

- Es una feature en modo full — «Carril feature, modo full».
- El motivo es que el responsable de cada sala cuadra las reservas los lunes en su hoja de cálculo — «Los lunes el responsable de la sala abre el CSV en su hoja de cálculo para cuadrar las reservas de la semana».

## Intent

Hoy `salas` guarda las reservas y no hay forma de sacarlas del programa. El responsable de cada sala las cuadra los lunes en una hoja de cálculo, y ahora tendría que copiarlas a mano. Éxito: `salas exportar Norte > norte.csv` produce un fichero que la hoja abre con tres columnas y una fila por reserva. Fracaso aunque funcione: que la hoja abra todo en una sola columna, o que falte una reserva de la sala. Qué columnas mira el responsable y qué comprueba al cuadrar es **pendiente**: el dev-lead no lo sabe.

## Scope

- Entra: el comando `exportar <sala>`; la cabecera `sala;dia;franja`; una fila por reserva de esa sala; los dos errores (sala desconocida, sin sala).
- Entra, si el RED lo exhibe: nada.
- No entra: otros formatos (`.ics` es la fila 0009); filtrar por día o semana; escribir el fichero desde el programa; exportar todas las salas a la vez; escapado de campos.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "exportar\|csv\|export"` fuera de `.docs/sdd/specs`: solo `ROADMAP.md:19` (fila 0009, `.ics`, otra idea) y `src/app.js:9` (`export function run`) | ninguno: no se tocan |

- Filas que implementa: nada: comprobado con `git grep -niE "0010\|exportar\|csv" -- . ':!.docs/sdd/specs'`; la 0010 se reservó con `sdd id next --reserve` y no tiene fila en `ROADMAP.md`.

## Approach

- Función `exportCsv(sala)` en `src/app.js`, junto a `freeRooms` — se prueba a través de `run`, como `libres`, y no añade ficheros.
- Módulo nuevo `src/export.js` — cuesta un fichero y un `import` para una función de pocas líneas; `operations.md` dice un solo fichero de entrada.
- Un flag `--csv` sobre un listado de reservas — ese listado no existe; habría que crearlo para colgarle el flag.
- Elegido: `exportCsv(sala)` en `src/app.js` — es lo más pequeño que encaja con el patrón del proyecto.

`run('exportar', [sala])` comprueba los dos errores y devuelve el texto; `bookings` se lee tal cual está.

## Dónde se prueba

- Cabecera y filas: `run('exportar', ['Norte'])`, en `test/app.test.js`, como los tests de `libres`.
- Sala sin reservas y los dos errores: igual, con `run`.
- Que la hoja lo abre bien: el dev-lead, en la validación, con un `norte.csv` real.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala Norte tiene una reserva `lun 10:00-12:00`
- WHEN el usuario ejecuta `salas exportar Norte`
- THEN la salida es `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`, separadas por `\n` y sin salto de línea final propio (el que se ve al final lo añade `console.log`)

#### ADDED — Sala sin reservas

- GIVEN la sala Sur no tiene reservas
- WHEN el usuario ejecuta `salas exportar Sur`
- THEN la salida es solo `sala;dia;franja`

#### ADDED — Sala que no existe

- GIVEN las salas son Norte y Sur
- WHEN el usuario ejecuta `salas exportar Este`
- THEN la salida es `sala desconocida: Este` y no hay cabecera

#### ADDED — Falta la sala

- GIVEN el usuario no da ninguna sala
- WHEN ejecuta `salas exportar`
- THEN la salida es `falta la sala: usa «exportar <sala>»`

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
