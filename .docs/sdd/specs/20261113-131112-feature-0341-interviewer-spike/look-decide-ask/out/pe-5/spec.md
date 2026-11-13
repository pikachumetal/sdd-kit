---
id: 20261113-154644-feature-0010-exportar-reservas-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: in-review
created: 2026-11-13
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Hoy el responsable de una sala no puede sacar sus reservas de la herramienta, y las copia a mano a su hoja de cálculo. Con `exportar Norte` verá `día;franja` y debajo `lun;10:00-12:00`, una línea por reserva, con punto y coma para que su Excel en castellano lo abra en columnas. Se guarda con `exportar Norte > norte.csv`. Una sala sin reservas da solo la cabecera, y una sala que no existe da un aviso.

Validación: dev-lead — lo que importa es que el fichero se abra en columnas y con la tilde bien en el Excel del responsable, y el agente no puede abrir Excel.

## Capacidades

- Nuevas: `bookings` — las reservas de las salas y lo que se puede sacar de ellas (hoy, la exportación a CSV).
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (el CSV lo consume la hoja de cálculo del responsable), capacidad nueva (`bookings`) · tamaño: ~40 líneas en 2 ficheros
- Dominio (sonnet): si los THEN de «sala sin reservas» y de «sala que no existe» dejan algo ambiguo para quien cuadra los lunes, y si la cabecera `día;franja` basta sin la sala (señal: capacidad nueva)
- Técnica (sonnet): si el BOM y el `;` bastan para que el Excel en castellano abra el fichero en columnas y con la tilde, y si `run` puede devolver el CSV como las demás órdenes (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el texto de los avisos le sirve a quien cuadra, que es quien lo lee

1. **Nombre del comando: `exportar <sala>`** — es un verbo en infinitivo, como `reservar`, `cancelar` y `libres`; la fila 0009 ya usa «Exportar» para otra salida (`.ics`), y el nombre deja sitio a una orden aparte para ella.
2. **El CSV sale por pantalla**, sin escribir ficheros — es lo que hacen las demás órdenes, y `> norte.csv` lo guarda. Coste: un aviso de error también acabaría en el fichero si se redirige.
3. **Columnas: `día;franja`**, sin la sala — la sala la pide quien exporta; la reserva solo tiene `sala`, `día` y `franja`, y no hay fecha ni titular que añadir.
4. **Cabecera siempre presente**, también con cero reservas — así la hoja conserva su estructura aunque la sala esté libre ese lunes.
5. **Orden: el de alta de las reservas** — es el orden de `bookings`; no hay fecha con la que ordenar mejor.
6. **Salto de línea `\n`, sin comillas** — ningún valor posible lleva `;` ni comillas hoy (los días son `lun`…, las franjas `HH:MM-HH:MM`). Pero la deuda «sin validación del formato de franja horaria» deja entrar una franja con `;`, que rompería el CSV. Queda anotado, no resuelto.
7. **El fichero empieza con la marca BOM de UTF-8** (`﻿`) — sin ella, el Excel en castellano lee la `í` de `día` como `dÃ­a`. Coste: un carácter invisible al principio que otra herramienta podría tomar como parte de la primera cabecera.
8. **Textos de aviso:** sin sala: `indica la sala: exportar <sala>`; sala desconocida: `sala desconocida: Este`. El nombre de sala debe coincidir exacto con el de la lista (`Norte`, `Sur`), como en `libres`.
9. **Enfoque: A frente a B y C** (ver Approach).
10. **Nueva capacidad `bookings`** (slug en inglés, kebab-case) — es el sustantivo del dominio: reservas; la exportación es un requisito suyo.
11. **Las reservas semanales (`reservar … --cada-semana`) no entran**: hoy no se guardan en `bookings`, solo devuelven un mensaje. Si el responsable espera verlas en el CSV, es otra feature.
- Delta probado en una copia de `.docs/sdd`: `sdd capability merge` crea `bookings.md` con 4 requisitos y las 5 reglas, sin rechazos; `capabilities/` del repo no cambia.
- Política de modelos: revisores de la spec Sonnet ×2 (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar.

### Hallazgos de la review

Sin despachar: en esta sesión no hay herramienta para lanzar subagentes revisores, así que no hay hallazgos de revisores. Hice yo la lectura con los siete puntos y lo que encontré ya está en las decisiones 2, 6 y 7. Con la spec aprobada, el dev-lead decide si se despachan antes del plan.

### Decisiones tomadas con el dev-lead

- Separador `;` — «Punto y coma (`;`), porque el Excel del responsable está en castellano.»

## Intent

Hoy no hay forma de sacar las reservas de una sala de la herramienta: quien las cuadra los lunes las copia a mano a su hoja de cálculo. Se quiere un comando que las dé en un formato que el Excel en castellano abra sin ajustes. Éxito: `exportar Norte > norte.csv` se abre en dos columnas, `día` y `franja`, con la tilde bien. Fracaso, aunque «funcione»: todo el contenido en una sola celda, o `dÃ­a` en la cabecera.

## Scope

- Entra: la orden `exportar <sala>`; el CSV con `;`, cabecera y BOM; los dos avisos.
- No entra: guardar en fichero sin redirección, exportar todas las salas a la vez, filtrar por fecha, las reservas semanales (decisión 11), la exportación a `.ics` (la fila 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "exportar\|csv\|export"` fuera de `.docs/sdd/specs`: solo `ROADMAP.md:19` (la fila 0009, otra salida) y `src/app.js:9` (`export function run`) | no aplica |

- Filas que implementa: nada: no hay fila en el roadmap; el id 0010 se reservó con `sdd id next`.

## Approach

- A — una función pura `bookingsCsv(room, list)` en `src/app.js` y una rama `exportar` en `run` que la llama con `bookings`. Se prueba con varias reservas sin tocar el estado compartido. Coste: ninguno.
- B — un módulo nuevo `src/csv.js`. Coste: parte en dos ficheros un programa de unas 15 líneas, cuando `operations.md` dice «un solo fichero de entrada».
- C — una librería de CSV. Coste: `operations.md` dice «sin dependencias externas» y, con dos columnas de valores simples, no aporta nada.
- Elegido: A — lo más pequeño que sirve y respeta las dos reglas de `operations.md`.

`run('exportar', [sala])` devuelve la cadena entera; `console.log` la imprime como las demás órdenes.

## Dónde se prueba

- `exportar Norte` y los dos avisos: por `run`, como los tres tests actuales de `test/app.test.js`.
- Varias reservas, orden y sala vacía: por `bookingsCsv` directamente, con una lista de reservas propia del test.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Exportar a CSV las reservas de una sala

- GIVEN la sala `Norte` con una reserva el `lun` en la franja `10:00-12:00`
- WHEN el responsable ejecuta `exportar Norte`
- THEN la salida empieza con la marca BOM de UTF-8 y sigue con `día;franja`, un salto de línea y `lun;10:00-12:00`
- AND los campos van separados por `;`

#### ADDED — Exportar una sala sin reservas

- GIVEN la sala `Sur` sin ninguna reserva
- WHEN el responsable ejecuta `exportar Sur`
- THEN la salida es el BOM y `día;franja`, sin más líneas

#### ADDED — Exportar mantiene el orden de las reservas

- GIVEN la sala `Norte` con las reservas `lun 10:00-12:00` y `mar 09:00-10:00`, en ese orden
- WHEN se exporta `Norte`
- THEN tras la cabecera salen primero `lun;10:00-12:00` y después `mar;09:00-10:00`

#### ADDED — Exportar sin sala o con una sala desconocida

- GIVEN las salas `Norte` y `Sur`
- WHEN el responsable ejecuta `exportar` sin sala
- THEN la salida es `indica la sala: exportar <sala>`, sin cabecera
- AND con `exportar Este` la salida es `sala desconocida: Este`, sin cabecera

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria (`bookings` de `src/app.js`)
- **Idioma de los nombres**: castellano
- **Límites**: no aplica
- **Avisos**: `indica la sala: exportar <sala>` · `sala desconocida: <sala>`
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
