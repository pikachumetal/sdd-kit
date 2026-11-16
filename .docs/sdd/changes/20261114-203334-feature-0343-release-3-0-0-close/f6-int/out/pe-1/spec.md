---
id: 20261116-182008-feature-0010-exportar-reservas-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Hoy no hay forma de ver las reservas de una sala fuera de la herramienta. Con esta feature, `exportar Norte` imprime un CSV listo para abrir en Excel en castellano: una fila por reserva, p. ej. `Norte;lun;10:00-12:00`, y el responsable lo redirige a un fichero y lo cuadra los lunes. Por dentro es un comando nuevo en `src/app.js` que filtra las reservas por sala y las une con `;`.

Validación: dev-lead — lo que importa es que Excel en castellano abra el fichero en tres columnas y con los acentos bien; el agente no puede abrir Excel.

## Capacidades

- Nuevas: `booking-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el CSV lo consume Excel de cada responsable) · tamaño: ~40 líneas en 3 ficheros
- Dominio (sonnet): si lo que el responsable necesita para cuadrar los lunes cabe en `sala;día;franja` sin fecha, y si «todas las reservas de la sala» es lo que espera (señal: contrato público)
- Técnica (sonnet): si el BOM y el `;` bastan para que Excel en castellano abra el fichero en tres columnas con «día» bien escrito, y si los THEN de error se pueden probar con `run` (señal: contrato público + capacidad nueva)
- Mínimo razonable: un revisor con los siete puntos — deja sin mirar la segunda lente, la del formato frente a Excel, que es donde falla este cambio si falla

### Hallazgos de la review

El rubric pedía dos revisores (señales: capacidad nueva y contrato público), pero esta sesión no tiene herramienta para despachar subagentes: **no se despachó ninguno**. Releí yo la spec con los siete puntos; es una lectura del mismo agente que la escribió, no una revisión independiente. Si la quieres con revisores de verdad, dímelo y se lanzan en una sesión que pueda.

- **Aceptado** — punto 4: el separador de líneas `\n` (sin salto final) estaba en el Approach y no aquí → añadido en la decisión 4.
- **Aceptado** — punto 4: «sin BOM ni cabecera» en el error de sala desconocida no estaba aquí → añadido en la decisión 6.
- **Aceptado** — punto 6: `FEFF` y `\n` en los THEN se leen como texto literal → aclarado en la decisión 3.
- **Aceptado** — punto 6: en Windows PowerShell 5, `>` reescribe la salida en UTF-16, lo que puede duplicar el BOM o descolocar la lectura → decisión 12, pendiente.
- Puntos 1, 2, 3, 5, 5 bis y 7: sin hallazgos. No hay capacidades previas con las que chocar, cada requisito tiene su escenario con datos, no hay roles y los ejemplos (`Norte`, `Sur`, `Oeste`) son los de la propia herramienta.

1. Comando `exportar <sala>`, que imprime por la salida estándar; el responsable lo guarda con `node src/app.js exportar Norte > norte.csv` — el repo no escribe ficheros en ningún sitio y así no hay que decidir ruta ni nombre.
2. Separador `;`, porque Excel en castellano parte el CSV por `;` (la coma es su separador decimal). La región exacta es **pendiente**: si alguna fuera de las que parten por coma, el CSV se verá en una sola columna.
3. El texto empieza con BOM UTF-8 (en los THEN, `<BOM>` es el carácter U+FEFF, no texto, y `\n` es un salto de línea): sin él, Excel lee el fichero como ANSI y «día» sale «dÃ­a».
4. Cabecera en castellano: `sala;día;franja`; después una fila por reserva, en el orden en que están guardadas; líneas separadas por `\n` y sin salto final (`console.log` pone el suyo).
5. Salen **todas** las reservas de la sala: no se guarda fecha, solo día de la semana, así que no se puede filtrar por semana.
6. Sala sin reservas: solo la cabecera. Sala que no existe: `sala desconocida: Oeste`. Sin sala: `uso: exportar <sala>`. Ambos textos son míos, y el de sala desconocida sale sin BOM ni cabecera.
7. Sin comillas ni escapes: sala, día y franja salen de valores fijos que no llevan `;`, `"` ni saltos de línea.
8. Capacidad nueva `booking-export` (slug en inglés), porque ninguna capacidad existente cubre exportar.
9. Enfoque: A (función `bookingsCsv(room)` en `src/app.js`, junto a `freeRooms`), frente a B (fichero nuevo `src/export.js`) y C (flag `--csv` de otro comando). Ver Approach.
10. La feature nace sin fila en el roadmap; le pongo la 0010 en «Now» al abrirla.
11. Pasada de coherencia: delta probado en una copia de `.docs/sdd` con `sdd capability merge` → 4 requisitos y 5 reglas añadidos a `booking-export.md`, sin rechazos; `sdd capability check` → «Capacidades válidas: 1». `git grep` de `exportar` y `0010` fuera de `changes/`: sin resultados, nada que retirar.
12. **Pendiente**: cómo redirige cada responsable la salida. En Windows PowerShell 5, `>` escribe UTF-16; en cmd, PowerShell 7 o bash, UTF-8. No lo he comprobado en Excel; lo cubre la validación a mano.
- Política de modelos: ningún revisor de la spec (no se despachó ninguno, ver «Hallazgos de la review») · ejes de la revisión final: Spec opus+high, Código sonnet+high · sin otros despachos en paralelo previstos.

### Decisiones tomadas con el dev-lead

- Excel en castellano como destino del CSV — «Usan Excel, con el idioma en castellano. No sé la región exacta.»
- Exportar a CSV las reservas de una sala para cuadrarlas los lunes en la hoja de cálculo — petición original.

## Intent

Cada responsable de sala cuadra los lunes las reservas de su sala en su hoja de cálculo, y hoy tiene que copiarlas a mano porque la herramienta solo reserva, cancela y lista salas libres. Se quiere un comando que las saque ya en CSV. Éxito: `exportar Norte > norte.csv` se abre en Excel en castellano con tres columnas (`sala`, `día`, `franja`), el acento de «día» bien y una fila por reserva. Fracaso aunque «funcione»: que Excel muestre todo en una columna o `dÃ­a`.

## Scope

- Entra: comando `exportar <sala>`; CSV con BOM, `;`, cabecera `sala;día;franja`; mensajes de sala desconocida y de uso; tests en `test/app.test.js`.
- No entra: filtrar por semana o fecha (no hay fecha guardada); escribir el fichero desde la herramienta; comillas y escapes; otros formatos (`.ics` es la 0009); exportar todas las salas a la vez.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -n exportar` y `git grep -nE "\b0010\b"` fuera de `.docs/sdd/changes/`: sin resultados | no aplica |

- Filas que implementa: 0010 (fila nueva en `ROADMAP.md`, Now) → ficheros que la nombran: `ROADMAP.md` y esta spec · nada más (comprobado con `git grep -nE "\b0010\b"`).

## Approach

- A. Función `bookingsCsv(room)` en `src/app.js`, junto a `freeRooms`, y una rama nueva en `run` — mismo patrón que `libres`; no añade ficheros; `app.js` crece unas 12 líneas.
- B. Módulo nuevo `src/export.js` — separa el formato, pero para una función de 6 líneas añade un fichero y un `import`; el proyecto tiene «un solo fichero de entrada».
- C. Flag `--csv` de un comando de listado — no hay comando que liste reservas, habría que crear ese primero.
- Elegido: A — es lo más pequeño que encaja con cómo está `app.js`; si el CSV crece (más columnas, escapes), se parte a B entonces.

`run('exportar', [sala])` devuelve el texto completo (BOM + cabecera + filas unidas con `\n`); `console.log` ya lo imprime.

## Dónde se prueba

- Exportar sala con reservas, sin reservas, desconocida y sin argumento: por `run`, como los tests actuales de `libres` y `cancelar` en `test/app.test.js`.
- Que Excel abra el fichero en tres columnas y con el acento bien: a mano, en la validación del dev-lead; ningún test lo cubre.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala `Norte` con una reserva `lun · 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida es `<BOM>sala;día;franja\nNorte;lun;10:00-12:00`

#### ADDED — Sala sin reservas

- GIVEN la sala `Sur`, sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es `<BOM>sala;día;franja`, solo la cabecera

#### ADDED — Sala desconocida

- GIVEN que no existe la sala `Oeste`
- WHEN se ejecuta `exportar Oeste`
- THEN la salida es `sala desconocida: Oeste`, sin BOM ni cabecera

#### ADDED — Exportar sin indicar sala

- GIVEN cualquier estado
- WHEN se ejecuta `exportar` sin argumentos
- THEN la salida es `uso: exportar <sala>`

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: memoria, el array `bookings` de `src/app.js`
- **Idioma de los nombres**: castellano (cabecera `sala;día;franja`, mensajes de error)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` y `uso: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
