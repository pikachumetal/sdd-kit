---
id: 20261113-213518-feature-0010-exportar-csv
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

🦆 Hoy no hay forma de sacar las reservas de una sala de la terminal. Con esto, `salas exportar Norte > norte.csv` deja un fichero que Excel en castellano abre en tres columnas: `Norte;lun;10:00-12:00` es una fila, y hay una fila por reserva. Por dentro, un comando nuevo `exportar` lee la lista de reservas, se queda con las de esa sala y las escribe por la salida estándar separadas por `;`.

Validación: dev-lead — es un fichero que una persona abre en su hoja de cálculo, y solo ella ve si las columnas salen bien.

## Capacidades

- Nuevas: `booking-export` — exportar las reservas de una sala a un fichero que abre una hoja de cálculo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos lentes (dominio y técnica) — **hechas por mí en el hilo, no por subagentes: esta sesión no tiene herramienta de despacho; no es una revisión independiente** — señales: capacidad nueva (`booking-export`), contrato público (el CSV lo consume la hoja de cálculo del responsable) · tamaño: ~45 líneas en 3 ficheros
- Dominio: si lo que sale basta para cuadrar «día por día» las franjas de una sala, dado que las reservas solo guardan día de la semana y franja (señal: contrato público)
- Técnica: si el formato `;`, la cabecera sin tilde y el fallo por `stderr` con código 1 se comportan bien al redirigir con `>` y al abrirlo en Excel (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las columnas bastan para cuadrar la semana

1. Nombre del comando: `exportar <sala>` — sigue el verbo en castellano de `libres`, `reservar` y `cancelar`.
2. Cabecera `sala;dia;franja`, sin tilde — Excel en castellano abre como ANSI un CSV en UTF-8 sin BOM y la «í» saldría rota; los valores de hoy (`Norte`, `lun`, `10:00-12:00`) no llevan acentos.
3. Cabecera presente — Excel la toma como títulos de columna.
4. «La semana siguiente» no se filtra: las reservas solo guardan el día de la semana, sin fecha. Sale todo lo reservado en la sala; filtrar por fecha será otra feature cuando existan fechas.
5. Orden de las filas: el de la lista de reservas, sin reordenar — no hay un orden de días que nadie haya dicho; ordenarlos exigiría decidir cómo se escriben los días.
6. Sala sin reservas: sale solo la cabecera — es un CSV válido y tampoco es un error.
7. Sala que no existe, o falta el nombre: nada por la salida estándar, el mensaje por la salida de errores y código de salida 1 — con `>` el mensaje no acabaría dentro del fichero. Textos: `sala desconocida: Oeste` y `uso: salas exportar <sala>`.
8. Sin comillas ni escapes — las salas y las franjas de hoy no llevan `;` ni comillas; si algún día las llevan, será otra feature.
9. Capacidad nueva `booking-export` (inglés, kebab-case) — hoy no hay ninguna capacidad en `capabilities/`.
10. Repaso de coherencia: el delta probado en una copia de `.docs/sdd` con `sdd capability merge` — añade 3 requisitos y las 5 reglas de `booking-export`, sin rechazos; `git grep` de `exportar` y `0010` fuera de la carpeta del cambio, sin resultados.
11. La sala se busca con el nombre exacto, con mayúsculas: `exportar norte` da `sala desconocida: norte` — igual que hoy `libres` compara cadenas exactas.
12. Enfoque: una función `exportCsv` en `src/app.js` frente a un módulo aparte y frente a una opción `--csv` de un listado (ver Approach).
- Pendiente de ti: las reservas viven hoy en una lista fija de `src/app.js` y `reservar` no añade nada a ella, así que lo que sale es esa lista y las reservas semanales de `--cada-semana` no aparecen. ¿Te vale así hasta que las reservas se guarden en algún sitio, o lo quieres como prerrequisito?
- Aviso, no decidido: `>` en PowerShell 5.1 guarda el fichero en UTF-16; Excel lo suele abrir bien, pero con `cmd` o PowerShell 7 sale en UTF-8 sin BOM. No lo trato en esta feature.

- Política de modelos: revisores de la spec, ninguno por subagente (las dos lentes las hice yo en el hilo) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` (3)

### Hallazgos de la review

- **Aceptado** — Importante · Dominio · las reservas son una lista fija y `reservar` no la modifica, el responsable no vería sus reservas reales → a «Pendiente de ti», sin cambiar el alcance.
- **Aceptado** — Menor · Técnica · mayúsculas en el nombre de sala sin decidir → decisión 11.
- **Aceptado** — Importante · Técnica · el «código de salida 0» del primer escenario no se ve por `run()` → «Dónde se prueba» ejecuta también el caso feliz con `child_process`.
- **Aceptado** — Menor · Técnica · codificación de `>` en PowerShell 5.1 → aviso arriba.
- Sin Críticos ni decisión central reescrita: no hay segunda ronda.

### Decisiones tomadas con el dev-lead

- Una fila por reserva con sala, día y franja, separadas por `;` — «una fila por reserva con sala, día y franja, separadas por punto y coma para que Excel en castellano lo abra en columnas»
- Salida por la salida estándar — «Por la salida estándar: quiero poder redirigirla a un fichero con `>`»

## Intent

El responsable de una sala cuadra los lunes, día por día, qué franjas de la semana siguiente tiene reservadas en su hoja de cálculo. Hoy tendría que copiar las reservas a mano. El éxito es que `salas exportar <sala> > <fichero>.csv` produzca algo que su Excel en castellano abra en columnas, sin tocar nada.

Anti-objetivo (lo deduzco, no lo dijo): que Excel lo abra todo en una sola columna o con caracteres rotos.

## Scope

- Entra: el comando `exportar <sala>`; su salida CSV; los dos errores de uso (sala desconocida, falta la sala); tests.
- No entra: filtrar por semana o fecha; ordenar; escribir a fichero sin `>`; comillas y escapes; exportar todas las salas a la vez; el resto de comandos.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -n "0010\|exportar" -- . ':!.docs/sdd/changes'` sin resultados fuera de esta carpeta

## Approach

- A. Función `exportCsv(room)` en `src/app.js`, cableada en `run` como un comando más — es el patrón de `freeRooms`; cuesta crecer `app.js`, que ya es el único fichero de entrada según `operations.md`.
- B. Módulo nuevo `src/exportar.js` — separa mejor, pero `operations.md` dice «un solo fichero de entrada» y para una función de ~8 líneas añade un fichero y un import.
- C. Opción `--csv` en un listado de reservas — hoy no existe ese listado; habría que crearlo para exportarlo.
- Elegido: A — la más corta y la que sigue el patrón del proyecto.

`run('exportar', [sala])` devuelve el texto CSV con filas unidas por `\n`; `console.log` ya pone el salto final. Los errores los lanza `run` como `Error` con el mensaje de la decisión 7, y el punto de entrada los captura: `console.error(mensaje)` y `process.exitCode = 1`.

## Dónde se prueba

- CSV de una sala, y sala sin reservas: por `run()`, como los tests actuales de `app.test.js`; y `node src/app.js exportar Norte` con `child_process` una vez, para comprobar la salida estándar y el código 0.
- Errores de uso: por `run()` con `assert.throws`, y una vez ejecutando `node src/app.js exportar Oeste` con `child_process`, para comprobar que la salida estándar queda vacía y el código es 1.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala Norte con una reserva `lun` `10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN la salida estándar es `sala;dia;franja` y `Norte;lun;10:00-12:00`, una por línea, y no contiene reservas de otras salas
- AND el código de salida es 0

#### ADDED — Sala sin reservas

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN la salida estándar es solo `sala;dia;franja`

#### ADDED — Sala desconocida o sin indicar

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `salas exportar Oeste`
- THEN no sale nada por la salida estándar, la salida de errores dice `sala desconocida: Oeste` y el código de salida es 1
- AND con `salas exportar` sin sala, la salida de errores dice `uso: salas exportar <sala>` y el código de salida es 1

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: la lista de reservas en memoria de `src/app.js`
- **Idioma de los nombres**: el comando y los mensajes, en castellano; la cabecera del CSV sin tilde
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` y `uso: salas exportar <sala>`, por la salida de errores
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
