---
id: 20261113-143209-feature-0010-exportar-csv
feature: 0010
title: Exportar a CSV las reservas de una sala para la semana siguiente
mode: full
status: draft
created: 2026-11-13
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala para la semana siguiente

🦆 Con `exportar Norte` sale por pantalla un CSV con las reservas de la sala Norte para la semana que empieza el lunes que viene: si hoy es viernes 13/11/2026, la reserva del lunes 10:00-12:00 sale como `Norte,2026-11-16,lun,10:00-12:00`. El responsable de la sala redirige la salida a un fichero y lo abre en su hoja de cálculo. Las reservas solo guardan el día de la semana, no una fecha, así que el comando pone a cada una la fecha de ese día en la semana siguiente; lo que no sabe es si una reserva puntual era de esta semana. Por dentro es una función nueva en el fichero principal, que calcula el lunes y ordena las filas.

Validación: dev-lead — el CSV lo abre una persona en su hoja de cálculo; solo ella ve si las columnas y las fechas le sirven para cuadrar los lunes.

## Capacidades

- Nuevas: `booking-export` — cómo se exportan las reservas de una sala a CSV.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el formato CSV lo consume una hoja de cálculo) · tamaño: ~30 líneas de código y ~40 de tests en 2 ficheros
- Dominio (sonnet): si «la semana que empieza el lunes que viene» se entiende igual cuando hoy es lunes (THEN del lunes 16/11) y si pasar toda reserva guardada a la semana siguiente (decisión 2) es aceptable (señal: capacidad nueva)
- Técnica (sonnet): si las columnas `sala,fecha,dia,franja` y la coma (decisión 4) son un formato estable para la hoja de cálculo (señal: contrato público)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin mirar a fondo el cálculo de fechas con un lente propio
- **Estado: no despachada.** Esta sesión no dispone de subagentes para lanzar los revisores; el repaso de coherencia sí está hecho (abajo). Si quieres la review, dímelo y la lanzo desde una sesión que pueda.

1. **Comando `exportar <sala>`**: escribe el CSV por la salida estándar; para guardarlo se redirige (`exportar Norte > norte.csv`). Nadie dijo el nombre ni el destino.
2. **Semana de la exportación = la que empieza el lunes siguiente a hoy, y toda reserva guardada se pone en ella.** Lo delegaste («decide tú») porque las reservas solo guardan día y franja. Riesgo que asumo: una reserva puntual de esta semana saldría también en el CSV de la semana siguiente. Si hoy es lunes, «el lunes que viene» es el de dentro de 7 días, no hoy.
3. **Columnas `sala,fecha,dia,franja`**, con fila de cabecera; `fecha` en formato `AAAA-MM-DD` (lo entienden Excel y Google Sheets sin configurar), `dia` como en las reservas (`lun`), `franja` como `10:00-12:00`.
4. **Separador coma**, sin comillas (ningún valor lleva coma). Si tu Excel está en castellano y abre todo en una columna, el cambio a `;` es de una línea: dímelo.
5. **Orden de las filas**: por fecha y, dentro del mismo día, por franja.
6. **Sala sin reservas**: solo la cabecera. **Sala que no existe** (`exportar Oeste`): `sala desconocida: Oeste`, sin CSV. **Sin sala** (`exportar`): `uso: exportar <sala>`.
7. **Capacidad nueva `booking-export`**: el proyecto no tiene capacidades; esta recoge el comportamiento del comando.
8. **Enfoque**: A, función en `src/app.js` que recibe la fecha de hoy como parámetro, frente a B y C (ver Approach).
9. **Sin `§Frontend`**: es una herramienta de terminal, sin pantalla.
10. **Repaso de coherencia hecho**: sin literales contradichos, nada que se retire (`git grep` sin resultados fuera de esta carpeta) y el delta, fusionado en una copia fuera del repo con `sdd capability merge`, sale con 6 requisitos añadidos a `booking-export.md` y sin rechazos.
- Política de modelos: revisores de la spec: ninguno (ver Estado) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno.

### Decisiones tomadas con el dev-lead

- La semana es la del lunes que viene y el cómo del filtro lo decido yo — «Quiero las reservas de la sala de la semana que empieza el lunes que viene. Si las reservas no tienen fecha, no sé cómo filtrar por semana; decide tú.»
- Motivo del comando: el responsable de cada sala cuadra las reservas los lunes en su hoja de cálculo — petición inicial.

## Intent

Hoy `salas` no saca las reservas de ninguna sala en un formato que una hoja de cálculo abra. El responsable de cada sala las cuadra los lunes y tendría que copiarlas a mano. Con `exportar`, saca el CSV de la semana que empieza ese lunes y lo pega o abre en su hoja. Éxito: el CSV abre en la hoja con una fila por reserva, sin retocar nada. Fracaso aunque funcione: fechas que la hoja no reconoce, o una semana equivocada si el comando se lanza un lunes.

## Scope

- Entra: el comando `exportar <sala>`, la fecha del lunes siguiente, el formato CSV y sus tres casos de error (sin reservas, sala desconocida, sin sala).
- No entra: reservas con fecha concreta (el modelo no las tiene); elegir otra semana con una opción; filtrar por día; exportar todas las salas a la vez; escribir el fichero (se redirige); cambiar `reservar`, `cancelar` o `libres`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -n "exportar\|0010" -- . ":!.docs/sdd/changes"` (sin resultados fuera de esta carpeta).

## Approach

- **A. Función `exportCsv(sala, hoy)` en `src/app.js`**, enlazada desde `run` — una función pura que recibe la fecha; se prueba sola, sin reloj. Cuesta crecer el único fichero de entrada unas 30 líneas.
- **B. Módulo nuevo `src/export.js`** — separa el formato del resto; cuesta un fichero más y un `import` para 30 líneas, en un proyecto de un solo fichero de entrada (`operations.md`).
- **C. Guardar fecha en cada reserva** — da la semana exacta, pero cambia el modelo de datos (`day` pasa a fecha) y toca `reservar`, `cancelar` y `libres`; la petición no lo pide.
- Elegido: **A** — encaja con «un solo fichero de entrada» y no toca el modelo.

Partes del cómo que fija A: `run(cmd, params, hoy = new Date())` pasa la fecha de hoy; el lunes siguiente es hoy más (8 − día de la semana) días, con el lunes como 1 y el domingo como 7 (así, si hoy es lunes, suma 7); la fecha de cada reserva es ese lunes más el índice de su día (`lun` = 0 … `dom` = 6) y se escribe en `AAAA-MM-DD` con el calendario local.

## Dónde se prueba

- Casos de CSV, orden y errores: por `run('exportar', [...], hoy)` con una fecha fija, como los tests actuales de `run` en `test/app.test.js`.
- Redirección a fichero y apertura en la hoja: validación del dev-lead, con `node src/app.js exportar Norte > norte.csv`.

## Términos y ADR

- Términos resueltos: semana siguiente — la que empieza el lunes posterior a hoy (si hoy es lunes, el de dentro de 7 días).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar a CSV las reservas de una sala

- GIVEN la sala Norte con una reserva `lun 10:00-12:00` y hoy es viernes 2026-11-13
- WHEN se ejecuta `exportar Norte`
- THEN sale `sala,fecha,dia,franja` y debajo `Norte,2026-11-16,lun,10:00-12:00`, en dos líneas

#### ADDED — La semana exportada empieza el lunes siguiente a hoy

- GIVEN la sala Norte con una reserva `lun 10:00-12:00` y hoy es lunes 2026-11-16
- WHEN se ejecuta `exportar Norte`
- THEN la fila lleva la fecha `2026-11-23`, no `2026-11-16`

#### ADDED — Las filas salen ordenadas por fecha y franja

- GIVEN la sala Norte con `mar 09:00-10:00`, `lun 15:00-16:00` y `lun 10:00-12:00`, y hoy es viernes 2026-11-13
- WHEN se ejecuta `exportar Norte`
- THEN tras la cabecera salen `Norte,2026-11-16,lun,10:00-12:00`, `Norte,2026-11-16,lun,15:00-16:00` y `Norte,2026-11-17,mar,09:00-10:00`, en ese orden

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN sale solo `sala,fecha,dia,franja`

#### ADDED — Una sala que no existe no exporta nada

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `exportar Oeste`
- THEN sale `sala desconocida: Oeste` y ninguna línea de CSV

#### ADDED — Sin sala, el comando dice cómo se usa

- GIVEN cualquier estado
- WHEN se ejecuta `exportar` sin sala
- THEN sale `uso: exportar <sala>`

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
