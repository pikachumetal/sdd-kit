---
id: 20261113-221532-feature-0010-exportar-csv-sala
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

🦆 Hasta ahora no había forma de sacar las reservas de una sala: no había ningún comando que las listara. Ahora `salas exportar Norte` escribe en pantalla una tabla de texto con una reserva por línea: `Norte;lun;10:00-12:00`. El responsable de la sala la guarda en un fichero (`salas exportar Norte > norte.csv`) y la abre en Excel los lunes para cuadrarla. Las columnas van separadas por `;`, que es lo que Excel en castellano espera. Si la sala no existe, avisa y no escribe tabla.

Validación: dev-lead — lo usa una persona con Excel, y el agente no puede ver cómo lo abre.

## Capacidades

- Nuevas: `booking-export` — la salida CSV de las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores (según la rúbrica), **no despachados** — señales: contrato público (formato de fichero que consume Excel), capacidad nueva · tamaño: ~15 líneas de código y ~40 de tests en 2 ficheros
- Dominio (sonnet): si `Norte;lun;10:00-12:00` cuadra con lo que el responsable necesita cuadrar (señal: contrato público)
- Técnica (sonnet): si la salida es segura en Excel de España con la redirección de PowerShell (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin mirar la lente que no elija
- Esta sesión no tiene herramienta para lanzar subagentes: **no hay revisión independiente**. Hice yo la lectura de los siete puntos (ver Hallazgos) y la dejo dicha para que lo sepas al aprobar.

1. Comando: `exportar <sala>`, el nombre en castellano como `libres`, `reservar` y `cancelar` — nadie lo dijo.
2. La salida va a pantalla (stdout), una reserva por línea, y no a un fichero; para guardarla, `> norte.csv` — así es todo el resto de la herramienta, y evita decidir ruta y nombre de fichero.
3. Primera línea de cabecera: `sala;dia;franja`, sin tilde — así no hay problema de codificación al redirigir en PowerShell, y no hace falta BOM.
4. Sala sin reservas: solo la cabecera.
5. Sala que no existe (no está en Norte, Sur): `sala desconocida: <sala>`, sin cabecera ni líneas.
6. Sin sala (`exportar` a secas): `indica la sala: exportar <sala>`.
7. El nombre de sala se compara exacto, con mayúsculas, como hace `libres`.
8. Sin comillas ni escapado: hoy ningún valor lleva `;`, comillas ni saltos de línea (salas fijas Norte y Sur, días y franjas con formato fijo).
9. Solo las reservas sueltas que guarda `bookings`. Las semanales (`--cada-semana`) hoy no se guardan en ninguna parte, así que no salen — no puedo exportar lo que no existe.
10. Enfoque: función `exportCsv(room)` dentro de `src/app.js`, frente a un módulo nuevo y a una opción `--salida` que escriba fichero (ver Approach).
11. Capacidad nueva `booking-export` (slug en inglés), con sus cinco reglas declaradas abajo.
12. Id 0010 sin fila de roadmap: la reservé con `sdd id next`; no hay remoto, así que `id claim` solo comprobó el contador local.
13. La carpeta va en `.docs/sdd/changes/`, como pide el kit; el proyecto tiene las anteriores en `specs/`, que no toco.
14. Delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: salió bien (exit 0, `booking-export.md` con 4 requisitos y 5 reglas); el `capabilities/` del repo no cambia.
- Pendiente de ti: qué hace el responsable con el CSV después de abrirlo («no sé»), y la región/versión de su Excel («no sé»). Si su región usa `,`, el CSV saldría en una sola columna y habría que cambiar el separador.
- Política de modelos: sin revisores de spec (no hay herramienta de subagentes) · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Hallazgos de la review

Lectura mía, no de un revisor independiente:
- **Aceptado** — el THEN de «sala sin reservas» no tenía dato concreto → escenario con `Sur`, que hoy no tiene reservas.
- **Aceptado** — la spec no decía qué pasa con las reservas semanales → decisión 9 y «No entra».
- **Aceptado** — `console.log` añade un salto final: lo que se prueba es la salida de `run`, sin él → Approach.

### Decisiones tomadas con el dev-lead

- Separador de columnas `;` fijo — «La 1️⃣: `;` fijo, porque el Excel del responsable está en castellano. Si su región usa otro separador, no lo sé; decide tú.»

## Intent

Hoy no hay forma de listar las reservas de una sala. El responsable de cada sala las cuadra los lunes en su hoja de cálculo (Excel, en castellano) y no tiene de dónde sacarlas. El éxito es que pueda guardar un fichero y abrirlo en Excel con tres columnas, una reserva por fila. Fracasaría, aunque funcionara, si en su Excel saliera todo en una columna o con caracteres rotos.

## Scope

- Entra: comando `exportar <sala>` en `src/app.js`, sus tests en `test/app.test.js` y una línea en `README.md`.
- No entra: exportar a calendario (`.ics`, roadmap 0009); guardar a fichero con opción propia; reservas semanales; filtrar por día; elegir separador.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv|0010"` (solo sale la 0009, `.ics`, otra cosa).

## Approach

- A. Función `exportCsv(room)` en `src/app.js`, enganchada en `run` — cabe en el único fichero de la herramienta (`operations.md`), se prueba sola con `run`. Coste: `app.js` crece unas 12 líneas.
- B. Módulo nuevo `src/exportar.js` — separa responsabilidades, pero el proyecto es un solo fichero y `bookings` no se exporta de `app.js`: habría que sacarla o duplicarla.
- C. Opción `--salida fichero.csv` que escribe el fichero — decide ruta, nombre y qué hace si existe; la redirección ya lo resuelve.
- Elegido: A — es lo más pequeño y sigue el estilo de `libres`.

`run('exportar', [sala])` devuelve el texto, líneas unidas con `\n` y sin salto final; `console.log` lo añade al imprimir.

## Dónde se prueba

- `exportar`: llamando a `run`, como los tests actuales de `libres`, `reservar` y `cancelar`. Un test por escenario, sin pantalla.
- Que Excel lo abra en tres columnas: lo valida el dev-lead a mano (no es observable por test).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala `Norte` con la reserva `lun 10:00-12:00`
- WHEN `exportar Norte`
- THEN sale `sala;dia;franja` y debajo `Norte;lun;10:00-12:00`, dos líneas, columnas separadas por `;`

#### ADDED — Sala sin reservas

- GIVEN la sala `Sur` sin reservas
- WHEN `exportar Sur`
- THEN sale solo `sala;dia;franja`

#### ADDED — Sala desconocida

- GIVEN las salas `Norte` y `Sur`
- WHEN `exportar Este`
- THEN sale `sala desconocida: Este`, sin cabecera ni líneas

#### ADDED — Falta la sala

- GIVEN cualquier estado
- WHEN `exportar` sin sala
- THEN sale `indica la sala: exportar <sala>`

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: en memoria, en `bookings` de `src/app.js` (hoy no hay almacenamiento)
- **Idioma de los nombres**: castellano (comando, cabecera y mensajes), sin tildes en la cabecera
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` e `indica la sala: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
