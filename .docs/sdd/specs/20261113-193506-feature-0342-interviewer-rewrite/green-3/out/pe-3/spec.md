---
id: 20261114-161151-feature-0010-exportar-reservas-csv
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

🦆 Hoy `salas` no deja sacar las reservas de una sala a una hoja de cálculo. Con esto, `salas exportar Norte` imprime `día;franja` y una línea por reserva, p. ej. `lun;10:00-12:00`. Tú rediriges esa salida a un fichero y lo abres en Excel en castellano. Por dentro, es una rama nueva en `run` de `src/app.js` que filtra `bookings` por sala y las une con `;`.

Validación: dev-lead — solo un humano con Excel en castellano ve si las tildes y las columnas salen bien con su redirección real.

## Capacidades

- Nuevas: `booking-export` — exportación a CSV de las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el CSV lo consume Excel) · tamaño: ~25 líneas en 3 ficheros
- Dominio (sonnet): si `día;franja` más la BOM bastan para que el responsable cuadre las reservas de la sala en Excel, y si falta alguna columna (señal: contrato público)
- Técnica (sonnet): si los escenarios de «Exportar las reservas de una sala» cubren sala vacía, sala desconocida y falta de argumento con la BOM exacta (señal: capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar si las columnas sirven al responsable

### Hallazgos de la review

**No se despachó.** El rubro pedía dos revisores (contrato público + capacidad nueva), pero esta sesión no tiene herramienta de subagentes. Hice yo los siete puntos sobre la spec y no encontré nada que cambiar. Eso no sustituye a un revisor independiente: si lo quieres, se lanza antes de aprobar.

1. Nombre del comando: `salas exportar <sala>` — encaja con `reservar`, `cancelar`, `libres`, todos verbos en castellano.
2. Separador `;` — Excel con configuración regional española separa columnas por `;`, no por `,`.
3. UTF-8 con BOM al inicio de la salida — sin ella Excel interpreta mal las tildes (`día`). Pendiente: no sé desde qué shell redirige el dev-lead; si su redirección reescribe la codificación, la BOM no llega tal cual. Lo cubre la validación, probada con su redirección real.
4. Columnas `día;franja`, con la cabecera en la primera línea, valores tal como se guardan (`lun`, `10:00-12:00`) y en el orden en que están guardadas. No hay columna de sala (va en el nombre del comando) ni de fecha: las reservas no la guardan.
5. Se exportan todas las reservas de la sala, no solo las de «la semana»: las reservas guardan el día de la semana, sin fecha, así que no hay nada que filtrar.
6. La sala se busca con el nombre exacto, con mayúsculas (`Norte`; `norte` no vale).
7. Sala sin reservas: sale la BOM y la cabecera, sin más líneas.
8. Sala desconocida: responde `sala desconocida: Oeste`. Sin argumento: `uso: salas exportar <sala>`.
9. Las reservas semanales (`--cada-semana`) no entran: hoy no se guardan, solo devuelven un texto.
10. Enfoque: una rama nueva en `run` de `src/app.js`, frente a un módulo `src/export.js` o a una librería de CSV (ver Approach).
11. Capacidad nueva: `booking-export`. Es la primera de `capabilities/`: la crea esta spec.
12. Delta probado sobre una copia de `.docs/sdd`: `sdd capability merge` añade «Exportar las reservas de una sala» y las cinco reglas sin rechazar nada.

### Decisiones tomadas con el dev-lead

- La salida va por la salida estándar y el dev-lead la redirige a un fichero — «Por la salida estándar (opción 2). Yo la redirijo a un fichero.»
- El CSV lo abre el responsable de cada sala los lunes en Excel en castellano — «Es Excel, en castellano.»

## Intent

Hoy el responsable de cada sala cuadra los lunes sus reservas a mano, sin una exportación. Con `salas exportar <sala>` obtiene un CSV de esa sala y lo abre en Excel. Éxito: el CSV abre en Excel en castellano con dos columnas (`día` y `franja`), la tilde de `día` bien y una fila por reserva. Fracaso aunque funcione: que Excel muestre todo en una sola columna o `dÃ­a`.

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js`; sus tests en `test/app.test.js`; la capacidad `booking-export`.
- No entra: las reservas semanales; filtrar por fecha o por semana; escribir un fichero; cambiar los demás comandos.

## Lo que se retira o cambia de forma

Nada se retira ni cambia de forma: el comando es nuevo y la rama `return 'salas'` de `run` sigue siendo el valor por defecto.

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | — | — |

- Filas que implementa: 0010 no tiene fila en `ROADMAP.md` → la fila se añade al cerrar | nada más: comprobado con `git grep -n "exportar" -- . ':!.docs'` (sin resultados)

## Approach

- A. Una rama nueva en `run` de `src/app.js` que filtra `bookings` por sala y devuelve el texto. Cuesta ~10 líneas; se prueba como los tests actuales, con `run('exportar', ['Norte'])`.
- B. Un módulo `src/export.js`. Cuesta un fichero para una función de pocas líneas, en una app de un solo fichero de entrada.
- C. Una librería de CSV. Cuesta una dependencia: `operations.md` fija Node 22 sin dependencias externas.
- Elegido: A — es la forma de los demás comandos y no añade ficheros ni dependencias.

`run('exportar', [sala])` devuelve la BOM (el carácter U+FEFF) seguida de la cabecera `día;franja` y de una línea `<día>;<franja>` por reserva, unidas por un salto de línea (`\n`). La salida estándar se imprime como el resto de comandos, con `console.log`.
`. La salida estándar se imprime como el resto de comandos, con `console.log`.

## Dónde se prueba

- Exportar una sala con reservas, vacía, desconocida y sin argumento: por `run`, en `test/app.test.js`, como los tests actuales.
- Cómo lo abre Excel (tildes, columnas) con la redirección real del dev-lead: manual, en la validación.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala Norte con la reserva `lun 10:00-12:00`
- WHEN el responsable ejecuta `salas exportar Norte`
- THEN la salida es la BOM, `día;franja` y `lun;10:00-12:00`, en líneas separadas por `\n`

- GIVEN la sala Sur, sin reservas
- WHEN ejecuta `salas exportar Sur`
- THEN la salida es la BOM y `día;franja`, sin más líneas

- GIVEN las salas Norte y Sur
- WHEN ejecuta `salas exportar Oeste`
- THEN responde `sala desconocida: Oeste`

- GIVEN cualquier estado
- WHEN ejecuta `salas exportar` sin sala
- THEN responde `uso: salas exportar <sala>`

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: las reservas en memoria de `src/app.js`
- **Idioma de los nombres**: castellano (`día`, `franja`, los dos mensajes)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` y `uso: salas exportar <sala>`
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
