---
id: 20261113-225015-feature-0010-exportar-csv
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

🦆 Hoy `salas` no puede sacar las reservas de una sala. Con esto, `salas exportar Norte` escribe por pantalla una tabla con una fila por reserva (`Norte;lun;10:00-12:00`), lista para abrirla en Excel en castellano y cuadrarla los lunes. Por dentro: un comando nuevo en `src/app.js` que filtra las reservas por sala y las une con `;`.

Validación: dev-lead — lo usa una persona con Excel; solo ella puede ver si las columnas salen bien repartidas al abrir el fichero.

## Capacidades

- Nuevas: `bookings` — las reservas de las salas y lo que se puede hacer con ellas; esta feature añade su exportación a CSV.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), contrato público (el CSV lo consume Excel, fuera del programa) · tamaño: ~15 líneas de código y ~25 de tests en 2 ficheros
- Dominio (sonnet): si `exportar` sin reservas, con sala desconocida y sin sala cubren los casos que el responsable se encontrará un lunes (señal: capacidad nueva)
- Técnica (sonnet): si `;` como separador y la salida sin BOM se abren bien en Excel en castellano (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si faltan casos de uso del lunes

**Aviso: los dos revisores NO se han despachado.** Esta sesión no tiene herramienta para lanzar subagentes, así que la review que describe el bloque está sin hacer. Solo he repasado yo los siete puntos de la rúbrica y eso no sustituye a un revisor independiente; decide en el gate si la lanzo con otra herramienta o sigues sin ella.

Repaso de coherencia: el delta probado sobre una copia de `.docs/sdd` (`sdd capability merge`) → exit 0, `bookings.md` con 4 requisitos y las 5 reglas; el repo no cambia. Mi repaso encontró una cosa, ya corregida: el escenario de la sala sin reservas llevaba un `AND` que no se podía probar con los datos de hoy (Sur no tiene reservas), y ahora lo prueba el propio escenario de Sur.

1. **Enfoque**: una función `toCsv` dentro de `src/app.js` y una rama nueva en `run`, frente a un módulo aparte y a escribir un fichero (ver Approach) — `operations.md` fija un solo fichero de entrada y el programa ya escribe todo por pantalla.
2. **Nombre del comando: `exportar <sala>`** — como `libres`, `reservar` y `cancelar`: un verbo en castellano.
3. **Columnas: `sala;dia;franja`, con cabecera y una fila por reserva** — son los únicos datos que tiene hoy una reserva. `dia` sin tilde para que la cabecera sea ASCII.
4. **Separador `;`** — el Excel en castellano usa el punto y coma como separador de listas; con comas, al abrirlo saldría todo en una columna. Lo dijiste: Excel en castellano; la región exacta no la sabes, así que es un supuesto mío.
5. **Salida por pantalla, sin fichero** — como los demás comandos; para guardarlo, `salas exportar Norte > norte.csv`.
6. **Sin BOM y sin comillas** — las salas y los días de hoy son ASCII y no llevan `;`. Si una sala con tilde llegara a Excel mal codificada, habría que añadir el BOM.
7. **«Las de la semana» son todas las reservas de la sala** — la reserva solo guarda el día de la semana (`lun`), sin fecha, así que no hay nada que filtrar por semana.
8. **Sala sin reservas: solo la cabecera** — es una exportación válida y vacía, no un error.
9. **Sala desconocida: `sala desconocida: Este`; sin sala: `uso: exportar <sala>`** — los textos son míos, en castellano como pide la constitución.
10. **El nombre de la sala se compara tal cual** (`Norte`, no `norte`) — igual que hacen hoy `libres` y las reservas.
11. **Capacidad nueva `bookings`** — no existe ninguna; es el sustantivo del dominio al que pertenece la exportación. Slug en inglés, a validar por ti.
12. **El CHANGELOG no se toca aquí** — lo escribe el corte de la release.
- Pendiente de ti: qué miras en la hoja para saber que las reservas cuadran (dijiste «decide tú»; con las tres columnas actuales se puede comparar sala, día y franja), y la región exacta del Excel del responsable.
- Política de modelos: revisores de la spec: ninguno despachado (sin herramienta de subagentes) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Decisiones tomadas con el dev-lead

- Decide el separador y las columnas yo, que no sabes qué miras para cuadrar — «Qué miro para saber que cuadran, no sé; decide tú.»
- Excel en castellano — «Abro la hoja con Excel, y el Excel del responsable está en castellano. La región exacta no la sé.»

## Intent

Los lunes, el responsable de cada sala cuadra en su hoja de cálculo las reservas de su sala de la semana. Hoy no hay forma de sacarlas del programa y las copia a mano. Con el comando nuevo las saca en un CSV que Excel en castellano abre con cada dato en su columna. El éxito: `salas exportar Norte` se abre en Excel con tres columnas (sala, día, franja) y una fila por reserva, sin tocar nada. Fracaso aunque funcione: que Excel muestre todo en una sola columna, o que la sala salga mezclada con otras.

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js` y sus tests en `test/app.test.js`.
- No entra: guardar en fichero con opción propia, filtrar por fecha o semana (la reserva no tiene fecha), exportar todas las salas a la vez, otros formatos (`.ics` es la 0009), tocar el CHANGELOG.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -n "exportar"` fuera de `.docs/sdd/specs/`: sin resultados | Scope: solo se añade una rama a `run` |

- Filas que implementa: nada: el roadmap no tiene fila para esta feature (comprobado con `git grep -n "0010"`: sin resultados fuera de esta carpeta)

## Approach

- A. Función `toCsv` y rama nueva en `run`, todo en `src/app.js` — cuesta poco, se prueba con `run('exportar', [...])` como los tests actuales, y respeta el fichero único de entrada.
- B. Módulo aparte `src/csv.js` — separa el formato, pero añade un fichero para ~5 líneas y `operations.md` habla de un solo fichero de entrada.
- C. Escribir el fichero (`norte.csv`) desde el comando — el responsable no tendría que redirigir, pero añade rutas, sobrescrituras y errores de disco que hoy ningún comando tiene.
- Elegido: A — es lo más pequeño que cumple lo pedido; la redirección con `>` cubre el fichero.

`toCsv(room)` devuelve las líneas unidas por `\n`: la cabecera `sala;dia;franja` y una `sala;dia;franja` por reserva de esa sala, en el orden en que están. `run('exportar', [sala])` valida la sala y llama a `toCsv`.

## Dónde se prueba

- Exportar con reservas, sin reservas, sala desconocida y sin sala: por `run('exportar', [...])`, como los tests actuales de `libres`, `reservar` y `cancelar`.
- Que Excel lo abra en columnas: a mano por el dev-lead en la validación, con `salas exportar Norte > norte.csv`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Exportar a CSV las reservas de una sala

- GIVEN la sala Norte tiene una reserva el lun de 10:00-12:00
- WHEN se ejecuta `exportar Norte`
- THEN la salida es la cabecera `sala;dia;franja` y una línea `Norte;lun;10:00-12:00`, separadas por salto de línea, sin comillas

#### ADDED — Exportar una sala sin reservas

- GIVEN la sala Norte tiene una reserva el lun de 10:00-12:00 y la sala Sur no tiene ninguna
- WHEN se ejecuta `exportar Sur`
- THEN la salida es solo `sala;dia;franja`, sin la reserva de Norte

#### ADDED — Exportar una sala que no existe

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `exportar Este`
- THEN la salida es `sala desconocida: Este`

#### ADDED — Exportar sin indicar sala

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `exportar` sin sala
- THEN la salida es `uso: exportar <sala>`

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: no aplica
- **Idioma de los nombres**: castellano en los textos de salida; la cabecera `sala;dia;franja`, sin tildes
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` · `uso: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
