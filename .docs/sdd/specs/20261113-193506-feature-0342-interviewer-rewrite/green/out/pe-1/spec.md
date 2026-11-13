---
id: 20261113-212753-feature-0010-exportar-csv
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

🦆 Un comando nuevo, `exportar <sala>`, escribe por la terminal las reservas de esa sala como CSV con `;` de separador: `exportar Norte` da `sala;dia;franja` y debajo `Norte;lun;10:00-12:00`. Tú lo rediriges con `>` a un fichero y el responsable de la sala lo abre en su hoja de cálculo los lunes. Por dentro es una función pura que recibe la lista de reservas y la sala, y `run` la llama con las reservas del programa.

Validación: dev-lead — lo usa una persona y su resultado se abre en una hoja de cálculo; solo un humano ve si las columnas y el separador salen como los espera.

## Capacidades

- Nuevas: `bookings` — las reservas de las salas y lo que se puede sacar de ellas; de momento, su exportación a CSV.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), contrato público (el CSV lo consume la hoja de cálculo del responsable) · tamaño: ~40 líneas en 3 ficheros
- Dominio (opus): si `sala;dia;franja` y el orden de las filas dan al responsable lo que necesita para cuadrar, y qué pasa con una sala sin reservas o inexistente (señal: capacidad nueva)
- Técnica (sonnet): si el formato sin comillas aguanta cualquier valor posible de sala, día y franja, y si la función pura se prueba sin tocar el estado del módulo (señal: contrato público)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin mirar a fondo el formato frente a la hoja de cálculo

1. Capacidad nueva `bookings` (slug en inglés, requisito «Exportar las reservas de una sala a CSV») — no hay capacidades y esto es comportamiento observable nuevo; **valida el nombre**.
2. Comando `exportar <sala>` — nadie dijo el nombre; en castellano, como `libres`, `reservar` y `cancelar`.
3. Cabecera `sala;dia;franja`, sin tilde en `dia` — tú pediste «sala, día y franja»; sin tilde porque los datos del programa ya van sin ella (`lun`) y una tilde se rompe al abrir un CSV sin BOM en algunas hojas.
4. Una fila por reserva de esa sala, en el orden en que están guardadas; saltos de línea `\n`, sin línea vacía al final (el `console.log` ya añade el salto final) — nadie lo dijo.
5. Sin comillas ni escapes — las salas son `Norte` y `Sur`, los días `lun`…, las franjas `HH:MM-HH:MM`: ningún valor lleva `;` ni salto de línea. Si algún día entra un nombre de sala libre, habrá que escaparlos.
6. Sala sin reservas → solo la cabecera; sala que no existe → `sala desconocida: Oeste`; sin sala → `uso: exportar <sala>` — nadie lo dijo; el mensaje de error sale por la salida estándar como el resto de respuestas, porque `run` solo devuelve texto.
7. El nombre de la sala se compara tal cual (`Norte`, no `norte`) — como `libres` y `reservar`, que hoy distinguen mayúsculas.
8. Enfoque: función pura `csvDeSala(sala, reservas)` exportada desde `src/app.js` y llamada por `run`, frente a un módulo `src/csv.js` o al código dentro de `run` (ver Approach).
9. Las reservas recurrentes (`reservar --cada-semana`) no salen: hoy ese comando solo devuelve un texto y no guarda nada, así que no hay nada que exportar. Si quieres que salgan, es otra feature.
10. La fila 0010 no está en el `ROADMAP.md` (la reservó el script de ids al empezar). La añado en el commit de apertura, en Now, con el carril y el brief de esta feature.
11. «Exportar reservas a calendario (.ics)» (0009, Later) es otra cosa y no se toca: otro formato, otro destino.
- Pendiente de ti: qué compara el responsable en la hoja los lunes (dijiste no saberlo). Puede que necesite otra columna (quién reserva, fecha concreta); con lo que has dicho, el CSV lleva solo `sala;dia;franja`.
- Aviso de los datos: las reservas viven en un array dentro de `src/app.js` con una sola reserva de ejemplo (`Norte · lun · 10:00-12:00`). El comando exporta lo que haya ahí; hasta que las reservas se guarden de verdad, el CSV real saldrá casi vacío. No lo arreglo aquí: es otra feature.
- Delta probado en una copia de `.docs/sdd` fuera del repo: `sdd capability merge` acepta la spec (sale `bookings.md: añadido «Exportar las reservas de una sala a CSV»` y las cinco reglas); `capabilities/` del repo no cambia hasta el cierre.
- Política de modelos: revisores de la spec — dominio opus, técnica sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Revisión de la spec: no despachada, porque esta sesión no dispone de herramienta para lanzar subagentes. Hice yo la pasada con los siete puntos (sin contradicciones con capacidades, porque no hay; cada requisito tiene escenario con datos; sin alcance oculto; decisiones tomadas por mí, todas en esta lista; sin roles ni estados; sin datos nuevos persistentes; ejemplos inventados: `Norte`, `Sur`, `Oeste`). **No sustituye a los dos revisores de la rúbrica**: si quieres la review independiente, dímelo antes de aprobar y la lanzo cuando haya forma de hacerlo.

### Decisiones tomadas con el dev-lead

- Salida: por la salida estándar, el dev-lead redirige con `>` — «Por la salida estándar: yo redirijo a un fichero con `>`.»
- Columnas y separador: sala, día y franja, separadas por `;` — «Necesita ver sala, día y franja, separadas por punto y coma, como en tu ejemplo.»

## Intent

Hoy `salas` no tiene forma de sacar las reservas: el responsable de cada sala las cuadra los lunes en una hoja de cálculo y tendría que copiarlas a mano. Se quiere un comando que, dada una sala, las entregue como CSV listo para abrir. Éxito: `node src/app.js exportar Norte > norte.csv` produce un fichero que la hoja de cálculo abre en tres columnas (`sala`, `dia`, `franja`) sin retocarlo. Anti-objetivo: que el CSV salga con las columnas pegadas en una sola (separador equivocado) o con basura por encima de la cabecera.

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js`, su función pura `csvDeSala`, sus tests en `test/app.test.js`, la línea en `README.md` y la fila 0010 en `ROADMAP.md`.
- No entra: escribir ficheros (se redirige con `>`), más columnas que `sala;dia;franja`, exportar todas las salas a la vez, reservas recurrentes, persistir las reservas, otros formatos (`.ics` es la 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | `run` devuelve `salas` para un comando desconocido y sigue igual; `exportar` es un comando nuevo |

- Filas que implementa: 0010 → nada la nombra (no tiene fila; se añade, decisión 10) | comprobado con `git grep -n -iE "0010|exportar|csv"`: solo coincide la fila 0009 (`.ics`), que es otra feature.

## Approach

- A. Función pura `csvDeSala(sala, reservas)` exportada desde `src/app.js`; `run` la llama con el array `bookings` — cabe en el fichero único de entrada, se prueba con una lista de reservas que pasa el test (el array del módulo no es modificable desde fuera), cuesta exportar un símbolo más.
- B. Módulo nuevo `src/csv.js` — separa el formato, pero para ~10 líneas añade un fichero y un import, y el proyecto (`operations.md`) tiene un solo fichero de entrada.
- C. Todo dentro de `run` — no añade símbolos, pero solo se podría probar con la única reserva de ejemplo: no se ve el orden ni varias filas.
- Elegido: A — es lo único que prueba varias filas sin tocar el estado del módulo y sin fichero nuevo.

`csvDeSala` devuelve el texto completo (cabecera + filas unidas con `\n`). `run('exportar', [sala])` valida el argumento y la existencia de la sala (`rooms`), y delega.

## Dónde se prueba

- Formato del CSV, orden y varias filas: función `csvDeSala` con listas de reservas del test, en `test/app.test.js` como los tests actuales.
- Sala sin reservas, inexistente y sin argumento: por `run('exportar', …)`, como los tests actuales de `libres` y `cancelar`.
- Que el separador es `;` y se abre bien en la hoja de cálculo: lo mira el dev-lead en la validación, redirigiendo a un `.csv`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN las reservas `Norte · lun · 10:00-12:00` y `Norte · mar · 14:00-16:00`, en ese orden, y `Sur · lun · 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida es la cabecera `sala;dia;franja` y una fila por reserva de Norte, en ese orden, sin filas de otras salas:
  `sala;dia;franja` / `Norte;lun;10:00-12:00` / `Norte;mar;14:00-16:00`
- AND las líneas van separadas por `\n` y no hay línea vacía al final

- GIVEN la sala `Sur` existe y no tiene reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es solo `sala;dia;franja`

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Oeste`
- THEN la salida es `sala desconocida: Oeste`

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar` sin sala
- THEN la salida es `uso: exportar <sala>`

- GIVEN la sala `Norte`
- WHEN se ejecuta `exportar norte` (minúscula)
- THEN la salida es `sala desconocida: norte`

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: memoria del programa (el array `bookings` de `src/app.js`)
- **Idioma de los nombres**: castellano (comando `exportar`, cabecera `sala;dia;franja`, sin tildes)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` · `uso: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
