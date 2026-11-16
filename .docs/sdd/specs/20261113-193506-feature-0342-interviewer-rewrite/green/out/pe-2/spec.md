---
id: 20261113-213158-feature-0010-exportar-reservas-csv
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

🦆 Hoy no hay forma de sacar las reservas de una sala de `salas`. Con esto, `salas exportar Norte > norte.csv` deja un fichero que Excel (en castellano) abre ya en tres columnas: `Norte;lun;10:00-12:00`, una fila por reserva de esa sala, con las tildes bien. El comando solo escribe por la salida estándar: el fichero lo creas tú con la redirección. Por dentro es una función nueva en `src/app.js` que filtra las reservas por sala y las une con `;`.

Validación: dev-lead — lo usa una persona y lo que importa es que Excel abra el fichero bien, cosa que solo se ve abriéndolo.

## Capacidades

- Nuevas: `booking-export` — sacar las reservas de una sala en un CSV que Excel en castellano abre sin ajustes.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (formato de fichero que consume Excel) · tamaño: ~40 líneas en 3 ficheros
- Dominio (opus): si el formato (`;`, BOM, cabecera) deja a Excel en castellano con tres columnas y sin tildes rotas (señal: contrato público)
- Técnica (sonnet): si los errores por `stderr` y código de salida encajan con el punto de entrada actual de `src/app.js` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el CSV se ve bien en Excel, que solo se ve abriéndolo (ver Validación)

1. Enfoque: función de exportación dentro de `run()`, dato por la salida estándar, frente a que el propio comando escriba el fichero o a añadir un módulo nuevo (ver Approach).
2. Comando `exportar <sala>`: el nombre y la forma nadie los dijo; sigue el estilo de `libres`, `reservar`, `cancelar` (verbo en castellano).
3. Cabecera `sala;día;franja` en la primera línea: la hoja necesita saber qué es cada columna.
4. Los valores salen tal cual están guardados (`lun`, `10:00-12:00`), en el orden en que se hicieron las reservas.
5. Marca BOM UTF-8 (`﻿`) al principio: sin ella Excel lee el UTF-8 como ANSI y rompe las tildes (`Sótano`). Hoy las salas son `Norte` y `Sur`, pero el nombre es libre.
6. La sala debe escribirse exacta: `norte` en minúscula es sala desconocida (las salas son `Norte` y `Sur`, con mayúscula inicial).
7. Una sala sin reservas exporta solo la cabecera (con BOM): un fichero válido y vacío, no un error.
8. Una sala que no existe, o falta el argumento, es un error: el mensaje va por `stderr` con código de salida 1 y la salida estándar queda vacía, para que `> norte.csv` no meta el texto del error en el fichero. Los literales: `sala desconocida: <sala>` y `uso: salas exportar <sala>`.
9. Sin entrecomillado de campos con `;`, comillas o saltos de línea: hoy ningún dato puede contenerlos (las salas están fijas y `reservar` no guarda nada). Si la deuda «Sin validación del formato de franja horaria» (`debt.md`) se salda con franjas libres, habrá que escapar.
10. Capacidad nueva `booking-export` (slug en inglés, kebab-case): lo declaro aquí porque `capabilities/` no existe todavía.
11. Validación `dev-lead`: Excel solo se comprueba abriéndolo.
12. Pasada de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` acepta el delta (`booking-export.md`: 4 requisitos y 5 reglas añadidos, código 0); `git grep` de `exportar|csv` y de `0010` fuera de esta carpeta solo encuentra la fila de la 0009 (`.ics`), que es otra cosa.
13. Review de la spec: no la he despachado a subagentes (esta sesión no tiene herramienta para lanzarlos); la he repasado yo contra los siete puntos y apunto el resultado en «Hallazgos de la review». Si prefieres revisores independientes, dímelo antes de aprobar.
- Pendiente de ti: qué haces después con la hoja para dar la sala por cuadrada (dijiste no saberlo). No cambia el diseño del CSV; si lo pide después, entra como otra feature.
- Política de modelos: revisores de la spec — dominio opus, técnica sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Autorrevisión (sin subagentes), contra los siete puntos:

- **Aceptado** — Un THEN sobre código de salida y `stderr` no se podía probar con `run()` y se dejaba a mano → «Dónde se prueba» lo cubre con `spawnSync`.
- **Aceptado** — La decisión 6 citaba `libres` como precedente de nombre exacto, pero `libres` recibe una franja, no una sala → reescrita sin esa cita.
- **Rechazado** — Añadir un escenario de «solo salen reservas de Norte» con dos salas con reservas: los datos fijos solo tienen una reserva (Norte), así que `exportar Sur` (solo cabecera) ya prueba el filtro; un fixture con datos nuevos obligaría a abrir el módulo a inyección de datos, fuera de alcance.
- Sin hallazgos en los puntos 1 (no hay capacidades vivas), 3, 4 (todo valor tomado por mí está arriba), 5 y 5 bis (no hay roles; las cinco reglas están declaradas) ni 7 (ejemplos inventados: `Norte`, `Sur`, `Oeste`, `Sótano`).

### Decisiones tomadas con el dev-lead

- Separador `;`: tu hoja es Excel con configuración regional en castellano — «Uso Excel, con la configuración regional en castellano, así que espera `;` como separador.»
- El CSV sale por la salida estándar y lo rediriges tú a un fichero — «La opción 1: sale por la salida estándar y yo lo redirijo a un fichero.»
- El responsable de cada sala lo abre en su hoja los lunes — «Abro el CSV en mi hoja de cálculo y cuadro ahí las reservas de mi sala los lunes.»

## Intent

El responsable de cada sala cuadra los lunes sus reservas en una hoja de cálculo, y `salas` no le da forma de llevárselas. Queremos un comando que las saque en un CSV que Excel en castellano abra directamente. Éxito: `salas exportar Norte > norte.csv`, doble clic en el fichero y Excel muestra tres columnas con las reservas de Norte, sin ajustar nada. Anti-objetivos (lo que la haría fracasar aunque «funcione»): que Excel abra todo en una columna, que las tildes salgan rotas, o que el texto de un error acabe dentro del fichero.

## Scope

- Entra: el comando `exportar <sala>`; la cabecera `sala;día;franja`; BOM; los errores por `stderr` con código 1; una línea en `README.md`.
- No entra: escribir el fichero desde el comando; filtros por día, franja o fecha; otras salas a la vez; el entrecomillado de campos (decisión 9); otros formatos (`.ics` es la 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | `git grep -niE "exportar|csv"` fuera de `.docs/sdd/specs/`: solo la fila de la 0009 (`ROADMAP.md:19`, el `.ics`, otra cosa) | Scope: queda fuera |

- Filas que implementa: nada: la 0010 no tiene fila en `ROADMAP.md`; comprobado con `git grep -n "0010"`.

## Approach

- A. Una función `exportar(sala)` dentro de `src/app.js` que `run()` llama y devuelve el texto; el punto de entrada lo imprime, como `libres`. Encaja con el diseño actual y se prueba llamando a `run()`. El BOM va dentro del texto devuelto.
- B. Que el comando escriba el fichero él mismo: toca disco, abre la decisión de sobrescribir y complica los tests. Descartada por ti.
- C. Un módulo nuevo `src/csv.js`: sobra para unas veinte líneas y el proyecto tiene un solo fichero de entrada (`operations.md`).
- Elegido: A — es lo que ya hace todo el CLI y la salida estándar la pediste tú.

Para los errores, `run()` lanza un `Error` con el mensaje y el punto de entrada lo imprime por `stderr` y fija `process.exitCode = 1`; los demás comandos no lanzan y no cambian.

## Dónde se prueba

- Exportar una sala con y sin reservas: `run('exportar', ['Norte'])`, como los tests de `libres` en `test/app.test.js`.
- Sala desconocida y falta de argumento: `assert.throws` sobre `run()` para el mensaje.
- Que el error sale por `stderr`, con código 1 y la salida estándar vacía: lanzando `node src/app.js exportar Oeste` con `spawnSync` de `node:child_process` en `test/app.test.js` (es la única forma de ver el código de salida; es un test nuevo de este patrón, el proyecto no tiene otro).
- Que Excel lo abre en tres columnas: la validación del dev-lead.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala Norte tiene una reserva `lun`, `10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN la salida estándar es la marca BOM, la línea `sala;día;franja` y la línea `Norte;lun;10:00-12:00`, cada una terminada en salto de línea
- AND solo salen reservas de Norte

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala Sur no tiene reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN la salida estándar es la marca BOM y la línea `sala;día;franja`, y el código de salida es 0

#### ADDED — Una sala desconocida no exporta nada

- GIVEN no existe la sala `Oeste`
- WHEN se ejecuta `salas exportar Oeste`
- THEN `stderr` dice `sala desconocida: Oeste`, el código de salida es 1 y la salida estándar queda vacía

#### ADDED — Exportar exige una sala

- GIVEN cualquier estado
- WHEN se ejecuta `salas exportar` sin sala
- THEN `stderr` dice `uso: salas exportar <sala>`, el código de salida es 1 y la salida estándar queda vacía

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: en memoria, la lista de reservas de `src/app.js`
- **Idioma de los nombres**: castellano (`exportar`, `sala;día;franja`)
- **Límites**: no aplica
- **Avisos**: errores por `stderr` con código 1: `sala desconocida: <sala>`, `uso: salas exportar <sala>`
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
