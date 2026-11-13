---
id: 20261113-155128-feature-0010-exportar-reservas-csv
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

🦆 Habrá un comando nuevo, `exportar Norte`, que imprime las reservas de esa sala como una tabla de tres columnas: `sala;día;franja` y debajo `Norte;lun;10:00-12:00`. Tú rediriges esa salida a un fichero (`> norte.csv`) y lo abres en tu Excel en castellano, que lo separará en columnas por el punto y coma. Si escribes mal la sala (`exportar Oeste`), el aviso sale por pantalla y el fichero queda vacío, así no cuadras un fichero con un mensaje dentro. Ojo: hoy `reservar` y `cancelar` no guardan nada, así que el CSV solo mostrará la reserva que ya viene cargada en el programa.

Validación: dev-lead — el CSV lo abre una persona en su hoja de cálculo en castellano; solo ella ve si las columnas salen separadas y con las tildes bien.

## Capacidades

- Nuevas: `room-booking-export` — exportar a CSV las reservas de una sala.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores (dominio sonnet, técnica sonnet) — señales: capacidad nueva (`room-booking-export`), contrato público (formato del CSV que consume la hoja de cálculo) · tamaño: ~60 líneas en 4 ficheros
- Dominio (sonnet): si «sala sin reservas» y «sala desconocida» (decisiones 4 y 5) son lo bastante distintas para quien cuadra el lunes, y si la limitación de la decisión 9 está dicha donde la leerá el usuario (señal: capacidad nueva)
- Técnica (sonnet): si el escenario «Campos con separador o comillas» (decisión 7) y el código de salida 1 por la salida de error (decisión 6) se pueden probar con la costura de `run` y un solo test de arranque (señal: contrato público)
- Mínimo razonable: una sola revisión técnica — deja sin mirar si el comportamiento de «sala vacía» frente a «sala desconocida» sirve a quien cuadra el lunes
```

**Los revisores no se despacharon**: esta sesión no tiene herramienta para lanzar subagentes. El repaso de los siete puntos lo hice yo mismo y no es una revisión independiente: sin hallazgos de contradicción, de escenarios sin THEN ni de ejemplos con datos reales; lo único que encontré lo corregí (salto de línea sin escenario, reglas de la capacidad sin declarar).

Resultado de `sdd capability merge` sobre una copia de `.docs/sdd` (rc 0): `room-booking-export.md` con 4 requisitos añadidos y 5 reglas añadidas.

### Hallazgos de la review

- **Aceptado** (repaso propio) — la decisión 7 nombra el salto de línea y ningún escenario lo cubre → añadido un AND en «Campos con separador o comillas».
- **Aceptado** (repaso propio) — las reglas de la capacidad no estaban entre mis decisiones → decisión 11.

1. Nombre del comando: `exportar <sala>` — verbo en castellano, como `libres`, `reservar` y `cancelar`.
2. Capacidad nueva `room-booking-export` (slug en inglés kebab-case; no hay ninguna capacidad en el proyecto todavía).
3. Cabecera fija `sala;día;franja`, con la tilde de «día», y una fila por reserva en el orden en que están guardadas. Fin de línea `\n`, sin BOM: es lo que imprime Node. No he podido medir cómo lo abre tu Excel (con la tilde, y si lo redirigiste desde PowerShell 5, que guarda en UTF-16): `sin medir`, lo comprueba la validación.
4. Una sala sin reservas (`Sur`) imprime solo la cabecera y termina bien.
5. El nombre de la sala se compara exacto, con mayúsculas: `norte` es «sala desconocida».
6. Sala desconocida o sin argumento: el mensaje va a la salida de error y el comando termina con código 1, sin escribir nada en la salida normal. **Difiere de lo que te describí en la entrevista** (ahí el mensaje habría caído en tu fichero): con tu redirección `> oeste.csv` el fichero queda vacío y el mensaje lo ves en pantalla. Decidido por el motivo de la entrevista (que no se cuadre un fichero con un mensaje dentro). Literales: `sala desconocida: Oeste (salas: Norte, Sur)` y `uso: exportar <sala>`.
7. Un campo que contenga `;`, `"` o un salto de línea sale entre comillas dobles, y las comillas internas se duplican (`"10:00;12:00"`). Hoy la franja no se valida (deuda «Sin validación del formato de franja horaria») y una franja con `;` rompería las columnas.
8. Sin filtro de periodo ni de día: las reservas no guardan fecha, solo el día de la semana, así que se exportan todas las de la sala.
9. Las reservas semanales (`reservar --cada-semana`) quedan fuera: hoy `run` solo responde `reserva semanal creada` y no guarda nada, ni `reservar` ni `cancelar` modifican la lista. Por eso el CSV de hoy muestra solo lo que ya está cargado en `src/app.js` (la reserva `Norte · lun · 10:00-12:00`). Cuadrar de verdad los lunes necesita que las reservas se guarden, y eso es otra feature.
10. Enfoque: A, frente a B y C (ver Approach).
11. Las «Reglas de la capacidad» son mías: la constitución del proyecto no tiene «Reglas de producto» de las que tomarlas.
- Política de modelos: dos revisores de la spec en paralelo (dominio sonnet, técnica sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Separador `;` — «Punto y coma (`;`), porque el Excel del responsable está en castellano.»
- Salida por pantalla, la redirige el usuario — «1️⃣, por pantalla. Yo redirijo la salida a un fichero.»
- Sala desconocida: error en lugar de cabecera vacía — «No sé, decide tú.» (la decisión es la 6 de arriba)

## Intent

El responsable de cada sala cuadra los lunes las reservas de su sala en su hoja de cálculo, y hoy no tiene cómo sacarlas de `salas` salvo copiarlas a mano. Con `exportar Norte` obtiene `sala;día;franja` y una fila por reserva, y al redirigir la salida a un fichero lo abre en columnas en un Excel en castellano. Éxito: abrir `norte.csv` con doble clic y ver tres columnas con las reservas de la sala, sin importar nada a mano. Sería un fracaso que el fichero se abriera en una sola columna, con la tilde rota, o que una sala mal escrita diera un fichero que parezca válido.

## Scope

- Entra: comando `exportar <sala>` en `src/app.js`; tests en `test/app.test.js`; una línea en `README.md` que lo documente.
- No entra: persistencia de reservas; que `reservar` y `cancelar` modifiquen la lista; reservas semanales; filtro por periodo o por día; escribir el fichero desde el programa; exportar todas las salas a la vez; el calendario `.ics` (fila 0009); validar el formato de la franja (deuda ya anotada).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0010 no tiene fila en el roadmap → `ROADMAP.md` solo nombra la 0009 (`.ics`), que es otra cosa y queda fuera del Scope | comprobado con `git grep -niE "export|csv|0010"`: sin más sitios que `src/app.js:9` (la función exportada `run`, que no se toca en su forma).

## Approach

- A: una función pura `reservasCsv(sala)` en `src/app.js`, que `run` llama para `exportar`; el error es una excepción que el arranque convierte en mensaje a la salida de error y código 1 — un solo fichero, como pide `operations.md`, y se prueba llamando a `run`, como los tests actuales.
- B: el comando escribe el fichero él mismo — descartado en la entrevista (el usuario redirige).
- C: un módulo nuevo `src/csv.js` — descartado: `operations.md` fija un solo fichero de entrada y son unas quince líneas.
- Elegido: A — encaja con la estructura actual y no añade ficheros ni dependencias.

`run('exportar', [sala])` devuelve el texto del CSV (sin salto final: `console.log` lo añade) o lanza `Error` con el literal del mensaje; el arranque (`if (command) …`) captura el error, lo escribe con `console.error` y fija `process.exitCode = 1`.

## Dónde se prueba

- Exportar una sala con reservas, sala sin reservas, sala desconocida, falta de argumento y escapado: llamando a `run('exportar', …)` en `test/app.test.js`, como los tests actuales.
- Salida de error y código 1: lanzando `node src/app.js exportar Oeste` con `node:child_process`, una sola prueba, porque es lo que ocurre en el arranque.
- Que el Excel en castellano lo abra en columnas: lo valida el dev-lead con el fichero real.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala `Norte` con la reserva `lun`, `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN imprime `sala;día;franja` y debajo `Norte;lun;10:00-12:00`, separados por `;`, y termina con código 0
- AND no filtra por periodo: imprime todas las reservas de la sala

#### ADDED — Sala sin reservas

- GIVEN la sala `Sur`, que existe y no tiene reservas
- WHEN se ejecuta `exportar Sur`
- THEN imprime solo `sala;día;franja` y termina con código 0

#### ADDED — Sala desconocida o sin indicar

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Oeste`
- THEN escribe `sala desconocida: Oeste (salas: Norte, Sur)` en la salida de error, no escribe nada en la salida normal y termina con código 1
- AND `exportar norte` da el mismo error con `norte`: el nombre se compara exacto
- AND `exportar` sin sala escribe `uso: exportar <sala>` en la salida de error y termina con código 1

#### ADDED — Campos con separador o comillas

- GIVEN una reserva de `Norte`, `mar`, con la franja `10:00;12:00`
- WHEN se ejecuta `exportar Norte`
- THEN esa fila sale como `Norte;mar;"10:00;12:00"`
- AND una franja `a"b` sale como `"a""b"`
- AND una franja con un salto de línea sale entera entre comillas dobles

#### Reglas de la capacidad — room-booking-export

- **Dónde viven los datos**: en memoria, la lista de reservas de `src/app.js`; el comando no guarda nada.
- **Idioma de los nombres**: castellano (cabecera `sala;día;franja`, mensajes de error).
- **Límites**: no aplica.
- **Avisos**: los dos mensajes de error del escenario «Sala desconocida o sin indicar», por la salida de error.
- **Regla ante conflicto**: no aplica.

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
