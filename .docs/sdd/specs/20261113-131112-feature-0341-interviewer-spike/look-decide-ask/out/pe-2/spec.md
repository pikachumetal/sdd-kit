---
id: 20261113-153851-feature-0010-exportar-csv
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

🦆 Con `salas exportar Norte` salen por pantalla las reservas de esa sala, una por línea y con una cabecera: `sala;dia;franja` y debajo `Norte;lun;10:00-12:00`. Redirigido a un fichero (`salas exportar Norte > norte.csv`), Excel en español lo abre en tres columnas, porque el separador es el punto y coma. Una sala sin reservas da solo la cabecera, y una sala que no existe da un aviso en lugar de un CSV vacío. Por dentro es una función más junto a `libres`, que devuelve texto como el resto de comandos.

Validación: dev-lead — lo usa una persona con Excel en español y solo ella puede ver si las columnas se abren bien.

## Capacidades

- Nuevas: `booking-export` — exportar las reservas de una sala a CSV.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el formato CSV lo consume una hoja de cálculo ajena) · tamaño: ~15 líneas de código y ~25 de tests en 2 ficheros
- Dominio (opus): si la cabecera `sala;dia;franja` y los avisos de «sala desconocida» y de uso cubren lo que quien cuadra los lunes necesita ver (señal: capacidad nueva)
- Técnica (sonnet): si el formato (`;`, saltos `\n`, sin BOM, sin comillas) se abre bien en Excel en español y qué pasa con un nombre de sala con acento (señal: contrato público)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin mirar a fondo el formato frente a Excel, el hueco que solo aparece al abrirlo

**Esta sesión no ha lanzado la review: no tiene herramienta para despachar subagentes. El nivel de arriba es lo que pide la rúbrica y queda pendiente; las dos lentes de arriba van a tu lectura de este gate.**

1. Nombre del comando: `salas exportar <sala>` — sigue el verbo en infinitivo de `reservar`, `cancelar`; `libres` es la excepción.
2. Cabecera `sala;dia;franja` — nombres en castellano y en minúsculas, igual que los campos de la reserva (`room`, `day`, `slot`) traducidos; Excel la muestra como títulos de columna.
3. Salto de línea `\n` y sin línea final extra: `run()` devuelve texto y `console.log` añade el último salto.
4. Orden de las filas: el de las reservas tal como están guardadas; no se reordena por día ni por hora.
5. Sala sin reservas: solo la cabecera (`sala;dia;franja`), porque es un CSV válido y «cero reservas» es una respuesta real.
6. Sala que no existe: `sala desconocida: Este` y ningún CSV. Sala con mayúsculas distintas (`norte`) cuenta como desconocida: se compara literal, como el resto de comandos.
7. Sin sala (`salas exportar`): `uso: salas exportar <sala>`.
8. Sin BOM, sin comillas ni escape de `;`: ninguna sala ni franja guardada contiene `;`, `"` ni saltos de línea. Si una sala con acento aparece algún día rota en Excel, hará falta BOM: queda fuera.
9. Todas las reservas de la sala, sin filtro por fecha: las reservas guardan un nombre de día (`lun`) y no una fecha, así que no hay con qué filtrar.
10. Capacidad nueva con nombre `booking-export` — sustantivo del dominio, en inglés kebab-case; todavía no hay capacidades en el proyecto.
11. Enfoque: función dentro de `src/app.js` frente a módulo aparte o a una librería de CSV (ver Approach).
12. Validación `dev-lead` en lugar de `agente`: lo que importa es ver el fichero abierto en Excel.
13. Repaso de coherencia: los literales (`sala;dia;franja`, `sala desconocida: <sala>`, `uso: salas exportar <sala>`) coinciden en decisiones, Approach y THEN. El delta probado en una copia de `.docs/sdd` da `capability merge` con salida 0: `booking-export.md` con 4 requisitos añadidos. El `capabilities/` del repo no cambia.
- Política de modelos: revisores de la spec — dominio opus y técnica sonnet, pendientes de lanzar (ver aviso arriba) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Sin review lanzada (ver aviso arriba): no hay hallazgos que plegar.

### Decisiones tomadas con el dev-lead

- La salida va por la salida estándar y el usuario la redirige a un fichero — «Opción 1: por la salida estándar. Yo lo redirijo a un fichero.»
- Separador punto y coma, porque quien cuadra las reservas usa Excel en español — «Quien cuadra las reservas usa Excel en español. Elijo el punto y coma (opción 1️⃣).»

## Intent

Hoy no hay forma de sacar las reservas de una sala de la herramienta. El responsable de cada sala las cuadra los lunes en su hoja de cálculo, y ahora las tendría que copiar a mano. Se quiere un comando que las dé en un formato que Excel en español abra en columnas. Es un éxito si `salas exportar Norte > norte.csv` se abre en Excel con tres columnas y una fila por reserva, sin ajustes al importar. Es un fracaso, aunque el comando funcione, si Excel mete todo en la primera columna.

## Scope

- Entra: el comando `exportar <sala>` con su salida CSV, los avisos de sala desconocida y de uso, y su línea en el README.
- No entra: escribir ficheros (se redirige), filtrar por fecha o por día, exportar todas las salas a la vez, BOM o escapes (decisión 8), el export a calendario `.ics` (fila 0009 del roadmap).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv|0010" -- . ':!.docs/sdd/specs'`, cuyo único resultado es la fila 0009 (`.ics`), otra feature. Esta feature no tiene fila en `ROADMAP.md`.

## Approach

- A. Una función `exportCsv(room)` en `src/app.js`, junto a `freeRooms`, y un caso más en `run()` — son unas diez líneas, se prueba por `run()` como los tests de hoy, y sin ficheros nuevos. Crece el fichero único de entrada, que ya es el patrón del proyecto.
- B. Un módulo aparte `src/csv.js` — separa el formato del comando, pero para una cabecera y un `join` añade un fichero y un import en un proyecto de un solo fichero de entrada.
- C. Una librería de CSV — descartada: `operations.md` fija Node 22 sin dependencias externas.
- Elegido: A — es lo más pequeño que cumple, respeta «un solo fichero de entrada» de `operations.md` y B se puede hacer después sin cambiar la salida.

`exportCsv(room)`: si `room` no está en `rooms`, devuelve `sala desconocida: <room>`; si no, devuelve la cabecera y, por cada reserva de esa sala, `room;day;slot`, todo unido con `\n`. `run('exportar', [])` devuelve el aviso de uso.

## Dónde se prueba

- Exportar una sala con reservas, sin reservas, desconocida y sin argumento: por `run('exportar', [...])` en `test/app.test.js`, como los tests actuales.
- Que Excel lo abra en columnas: lo valida el dev-lead a mano, abriendo `norte.csv` en Excel en español.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala Norte tiene una reserva el lun de 10:00-12:00
- WHEN se ejecuta `salas exportar Norte`
- THEN sale por la salida estándar `sala;dia;franja` y, en la línea de abajo, `Norte;lun;10:00-12:00`
- AND los campos van separados por `;`, para que Excel en español los abra en tres columnas

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala Sur no tiene reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN sale solo `sala;dia;franja`

#### ADDED — Una sala desconocida no exporta nada

- GIVEN no existe la sala Este
- WHEN se ejecuta `salas exportar Este`
- THEN sale `sala desconocida: Este` y ningún CSV
- AND `salas exportar norte` (con minúscula) da `sala desconocida: norte`

#### ADDED — Exportar sin indicar sala avisa del uso

- GIVEN cualquier estado
- WHEN se ejecuta `salas exportar` sin sala
- THEN sale `uso: salas exportar <sala>`

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
