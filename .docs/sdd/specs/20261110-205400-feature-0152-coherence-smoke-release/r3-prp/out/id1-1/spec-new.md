---
id: 20261111-190557-feature-0013-export-csv
feature: 0013
title: Exportar las reservas a CSV
mode: full
profile: delegate
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar las reservas a CSV

🦆 Hoy las reservas solo se ven una a una desde la terminal. Con `node src/app.js exportar reservas.csv` se crea un fichero con una fila por reserva, p. ej. `Norte,lun,10:00-12:00,activa`, que se abre en una hoja de cálculo. Entran también las canceladas y las anuladas, con su estado. Por dentro es un comando nuevo en `src/app.js` que escribe el fichero.

Validación: dev-lead — el fichero lo abre quien lo usa en su hoja de cálculo (separador y acentos), y eso no lo mide el agente.

## Capacidades

- Nuevas: `booking-export` — volcado de las reservas a un fichero CSV.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva, contrato público (el formato del fichero lo consume una hoja de cálculo) · tamaño: ~40 líneas en 3 ficheros
- Técnica y dominio juntas (sonnet): si la cabecera `sala,dia,franja,estado` y el mapeo de estados `activa`/`cancelada`/`anulada` casan con el término «Reserva» de PRODUCT.md y con los estados reales de `src/app.js` (señal: contrato público); si cada THEN de «Exportar las reservas a un CSV» se puede probar sin romper la costura de `run` (señal: capacidad nueva)
- Mínimo razonable: sin revisor — deja sin mirar si un THEN pasa sin el comportamiento

1. **Id 0013, no 0012**: la 0012 ya estaba reservada en `origin/develop` para «Informe de ocupación»; `sdd id claim` movió esta feature a la 0013, renombró la rama a `feature/0013-export-csv` y la fila del roadmap es la 0013.
2. **Comando `exportar [ruta]`**, con la ruta opcional; sin ruta, `reservas.csv` en el directorio actual. Si el fichero existe, se sobrescribe.
3. **Columnas**: `sala,dia,franja,estado`, con cabecera, separador coma, saltos `\n`, UTF-8 sin BOM y salto de línea final. En castellano, como el resto de la interfaz (constitución 4). Sin comillas ni escapes: ningún campo puede llevar comas hoy (salas fijas, franjas `HH:MM-HH:MM`).
4. **Entran todas las reservas**, también canceladas y anuladas, y el estado va en su columna (`activa`, `cancelada`, `anulada`); filtrar queda fuera. `cancelada` y `anulada` son los términos de PRODUCT.md (Cancelación, Anulación) sobre los estados `cancelled` y `voided` de `src/app.js`; `activa` (`active`) no está en PRODUCT.md y es mía. Los nombres de columna `sala,dia,franja,estado` también.
5. **Textos de salida**: `exportado <ruta> · filas: <n>` (n sin contar la cabecera); `no se pudo escribir <ruta>` si falla la escritura, sin tocar lo que hubiera; `uso: exportar [ruta]` si se dan dos o más rutas.
6. **Capacidad nueva `booking-export`** (slug en inglés, kebab-case).
7. **Enfoque**: A, frente a B y C (ver Approach).
8. **Delta probado en una copia** de `.docs/sdd` con `sdd capability merge`: añade 5 requisitos y las 5 reglas a `booking-export.md`, sin errores; `capabilities/` del repo no cambia.
9. **Validación: dev-lead**, porque el uso real es abrir el CSV en una hoja de cálculo (en Excel con configuración regional española el separador por defecto es `;`; lo dejo en coma y es lo primero que mirar).
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — «Sin reservas» no se puede dar con los datos actuales → `bookings` se exporta y el GIVEN lo dice.
- **Aceptado** — un escenario cubría cancelada y anulada → partido en dos, cada uno con su GIVEN/WHEN/THEN y `filas: 1`.
- **Aceptado** — «no queda fichero» no distingue nada con carpeta inexistente → añadido el destino que es una carpeta, que no se toca; y la sobrescritura.
- **Aceptado** — estados sin respaldo en PRODUCT.md → decisión 4 cita Cancelación y Anulación y marca `activa` y las columnas como mías.
- **Aceptado** — Límites y Regla ante conflicto en «no aplica» → declarados (sin comas; gana lo último exportado).
- **Aceptado** — más de un argumento sin definir → `uso: exportar [ruta]` y escenario.
- **Aceptado** — `process.chdir` global → se restaura el `cwd` en un `finally`.
- **Aceptado** — BOM/acentos sin fijar → UTF-8 sin BOM en la decisión 3; sin escenario con tilde porque los datos actuales no las tienen, y la apertura en la hoja de cálculo la mira el dev-lead.
- **Rechazado** — mover la decisión del id a una nota de proceso → el usuario pidió la 0012; que sea la 0013 debe verlo en el gate.

## Intent

Hoy no hay forma de sacar las reservas de la herramienta: el listado vive en memoria y solo `libres`, `cancelar` y `anular` lo tocan. Quien administra las salas quiere revisarlas, contarlas o compartirlas en una hoja de cálculo. Éxito: tras `exportar reservas.csv`, el fichero tiene exactamente una fila por reserva existente, con su sala, día, franja y estado. Fracaso aunque «funcione»: que falte una reserva (p. ej. las canceladas), que sobren filas o que, si falla la escritura, quede un fichero a medias o se toque lo que había.

## Scope

- Entra: comando `exportar [ruta]`; cabecera y una fila por reserva; estado traducido; ruta por defecto; sobrescritura; errores de escritura y de uso.
- No entra: filtros (por sala, día o estado), otros formatos (el `.ics` es la 0004), exportar a la salida estándar, escapes de CSV, elegir separador.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0013 → `ROADMAP.md:9` (renumerada desde la 0012 local por el claim; ningún otro fichero la nombra) | comprobado con `git grep -n "0012\|0013"` y `git grep -n -i "csv\|exportar"`: el único hit de «Exportar» fuera del roadmap es la 0004 (`.ics`), que no se toca.

## Approach

- A. Función pura `bookingsToCsv(bookings)` que devuelve el texto, y `run('exportar', …)` que lo escribe con `writeFileSync` — se prueba la función sin disco y el comando con un directorio temporal.
- B. Todo dentro de `run`, sin función aparte — menos código, pero el formato solo se prueba escribiendo ficheros.
- C. Devolver el CSV por pantalla y dejar que el usuario redirija — no cumple «un fichero», y `run` hoy devuelve mensajes de una línea, no volcados.
- Elegido: A — separa el formato (lo que consume la hoja de cálculo) de la escritura (lo que puede fallar), y sigue el patrón actual de funciones exportadas junto a `run` (`cancelBooking`, `voidBooking`).

Partes que fija A: `bookings` se exporta para que los tests puedan vaciar o ampliar la lista; la escritura es síncrona y, si falla, `run` devuelve `no se pudo escribir <ruta>`.

## Dónde se prueba

- Formato (cabecera, filas, estados): por `run('exportar', [ruta])` con un directorio temporal, como los tests actuales de `run`; leyendo el fichero.
- Ruta por defecto: `run('exportar', [])` tras `process.chdir` al directorio temporal, restaurando el `cwd` en un `finally` para no afectar a otros tests de `node --test`.
- Errores: carpeta inexistente, destino que es una carpeta y más de una ruta, por `run('exportar', …)` en el directorio temporal.
- Sobrescritura: se escribe `viejo` en el fichero antes de exportar.
- Sin reservas: vaciando `bookings` con `splice` en el test.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas a un CSV

- GIVEN la reserva Norte, lun, 10:00-12:00, activa
- WHEN se ejecuta `exportar reservas.csv`
- THEN `reservas.csv` contiene dos líneas: `sala,dia,franja,estado` y `Norte,lun,10:00-12:00,activa`
- AND la salida es `exportado reservas.csv · filas: 1`

#### ADDED — Las canceladas se exportan con su estado

- GIVEN la reserva Norte, lun, 10:00-12:00 tras `cancelar Norte lun`
- WHEN se ejecuta `exportar reservas.csv`
- THEN el fichero contiene `Norte,lun,10:00-12:00,cancelada`
- AND la salida es `exportado reservas.csv · filas: 1`

#### ADDED — Las anuladas se exportan con su estado

- GIVEN la reserva Norte, lun, 10:00-12:00 tras `anular Norte lun`
- WHEN se ejecuta `exportar reservas.csv`
- THEN el fichero contiene `Norte,lun,10:00-12:00,anulada`
- AND la salida es `exportado reservas.csv · filas: 1`

#### ADDED — Sin ruta se exporta a reservas.csv

- GIVEN la reserva Norte, lun, 10:00-12:00, activa
- WHEN se ejecuta `exportar` sin ruta
- THEN se crea `reservas.csv` en el directorio actual con el mismo contenido
- AND la salida es `exportado reservas.csv · filas: 1`

#### ADDED — Sin reservas solo sale la cabecera

- GIVEN ninguna reserva (el test vacía `bookings`, que se exporta)
- WHEN se ejecuta `exportar reservas.csv`
- THEN el fichero contiene solo la línea `sala,dia,franja,estado`
- AND la salida es `exportado reservas.csv · filas: 0`

#### ADDED — Un fichero existente se sobrescribe

- GIVEN `reservas.csv` ya existe con el texto `viejo`
- WHEN se ejecuta `exportar reservas.csv`
- THEN el fichero contiene solo la cabecera y las filas actuales, sin `viejo`

#### ADDED — Si no se puede escribir, se avisa y no queda fichero

- GIVEN la carpeta `no-existe` no existe
- WHEN se ejecuta `exportar no-existe/reservas.csv`
- THEN la salida es `no se pudo escribir no-existe/reservas.csv`
- AND no se crea ningún fichero

#### ADDED — Si el destino es una carpeta, se avisa y no se toca

- GIVEN `datos` es una carpeta existente
- WHEN se ejecuta `exportar datos`
- THEN la salida es `no se pudo escribir datos`
- AND `datos` sigue siendo una carpeta

#### ADDED — Más de una ruta es un error de uso

- GIVEN la reserva Norte, lun, 10:00-12:00, activa
- WHEN se ejecuta `exportar a.csv b.csv`
- THEN la salida es `uso: exportar [ruta]`
- AND no se crea `a.csv` ni `b.csv`

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: las reservas, en memoria; el CSV, en la ruta pedida, sobrescrito si existía
- **Idioma de los nombres**: castellano: cabecera `sala,dia,franja,estado` y estados `activa`, `cancelada`, `anulada`
- **Límites**: los campos no llevan comas ni saltos de línea (salas fijas, franjas `HH:MM-HH:MM`), por eso no hay escapes; si una sala futura rompe esa invariante, esta capacidad se enmienda
- **Avisos**: `exportado <ruta> · filas: <n>`; `no se pudo escribir <ruta>`; `uso: exportar [ruta]`
- **Regla ante conflicto**: gana lo último que se exporta: un fichero existente se sobrescribe sin avisar

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
