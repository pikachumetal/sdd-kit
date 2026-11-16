---
id: 20261113-211546-feature-0010-exportar-csv
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

🦆 Con `salas exportar Norte`, el responsable de la sala Norte obtiene un fichero `norte.csv` en la carpeta donde está, con una fila por reserva: `Norte;lun;10:00-12:00`. Lo abre con doble clic en Excel en castellano y le salen tres columnas (sala, día, franja) y las tildes bien. Si la sala no existe, el comando avisa y no crea ningún fichero. Por dentro, una función pura arma el texto del CSV y otra capa fina lo escribe en disco.

Validación: dev-lead — lo que el responsable verá es un fichero abierto en Excel en castellano (columnas y tildes), y eso solo lo observa una persona.

## Capacidades

- Nuevas: `booking-export` — exportar a fichero CSV las reservas de una sala

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el formato del fichero lo consume Excel) · tamaño: ~25 líneas de código y ~40 de tests en 2 ficheros
- Dominio (sonnet): si el CSV de la sala Norte con `lun;10:00-12:00` es lo que el responsable necesita para cuadrar, y qué pasa con una sala sin reservas (señal: capacidad nueva)
- Técnica (sonnet): si BOM + `;` + `\r\n` abren bien en Excel en castellano y si el nombre de fichero derivado de la sala es seguro (señal: contrato público)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin mirar el segundo ángulo (formato de fichero frente a regla de dominio)
- **Estado de la review: sin despachar.** Esta sesión no tiene herramienta para lanzar subagentes, así que no se ha hecho; la decisión de aprobar sin review o de pasarla en otra sesión es tuya.

1. Nombre de la capacidad: `booking-export` (kebab-case en inglés, regla 1 de `capability-template.md`) — no existe ninguna capacidad en el proyecto.
2. Columnas: `sala;dia;franja`, con fila de cabecera, en ese orden — es lo que guarda hoy cada reserva y nadie pidió más. Sin columna de fecha: las reservas no tienen fecha, solo día de la semana (`lun`).
3. Separador `;` y fin de línea `\r\n` — el `;` lo dijiste tú; el `\r\n` es lo habitual en ficheros que abre Excel.
4. Codificación UTF-8 con BOM — Excel en castellano solo reconoce las tildes (`Fábrica`) con BOM.
5. Nombre del fichero: la sala en minúsculas más `.csv` (`norte.csv`), en el directorio actual — el «Norte → norte.csv» lo dijiste tú; lo de minúsculas generaliza a otras salas.
6. Fichero ya existente: se sobrescribe sin preguntar — pediste que decidiera yo; es un volcado que se regenera cada lunes, y preguntar rompería el uso sin teclado.
7. Sala escrita sin respetar mayúsculas (`norte`): vale y se trata como `Norte` — el responsable no debería fallar por una mayúscula.
8. Sala desconocida (`exportar Este`): el comando responde `sala desconocida: Este` y no crea fichero — no exportar nada es mejor que un `este.csv` vacío que parezca bueno.
9. Sin sala (`exportar` a secas): responde `uso: salas exportar <sala>` y no crea fichero.
10. Sala sin reservas (`exportar Sur`): crea `sur.csv` solo con la cabecera — una sala libre es un resultado válido para cuadrar.
11. Mensaje al exportar: `exportadas 1 reservas de Norte a norte.csv` (el número cambia; no se distingue singular de plural) — confirma al responsable qué ha pasado.
12. Orden de las filas: el de registro de las reservas — no hay fecha que ordenar.
13. Valores con `;`, `"` o salto de línea se entrecomillan y se duplican las comillas — hoy ningún valor los tiene; es defensa barata para que el fichero nunca se desplace de columnas.
14. Enfoque: A (función pura `csvDeSala` + escritura fina en `run`), frente a B (todo dentro de `run`) y C (módulo nuevo `src/export.js`) — ver Approach.
15. Carpeta del artefacto: `.docs/sdd/changes/…`, como manda el kit, aunque las specs viejas del proyecto estén en `.docs/sdd/specs/`.
16. No he añadido fila al `ROADMAP.md`: el id 0010 está reservado por la rama, sin fila.
- Delta sobre una copia de `.docs/sdd`: `sdd capability merge` sale con 0 y crea `booking-export.md` con 6 requisitos y las 5 reglas; `capability check` previo a la fusión solo dice que la capacidad nueva aún no tiene fichero, lo esperado.
- Repaso de coherencia: `git grep` de `0010`, `exportar` y `csv` fuera de la spec, sin resultados; no hay `MODIFIED`; los literales (`sala;dia;franja`, mensajes, `norte.csv`) coinciden entre decisiones, THEN y reglas.
- Política de modelos: revisores de la spec — ninguno despachado (ver arriba); si se despachan, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (un solo fichero de entrada) · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Comando: `salas exportar <sala>` que escribe `<sala en minúsculas>.csv` en la carpeta actual — «La 2: que `salas exportar Norte` escriba `norte.csv` en la carpeta actual.»
- Separador `;` — «necesita el separador `;`»
- Fichero ya existente: lo decide el agente — «Si el fichero ya existe, no sé; decide tú.»

## Intent

Hoy no hay forma de sacar las reservas de una sala de `salas`. El responsable de cada sala las cuadra los lunes en su hoja de Excel en castellano y tendría que teclearlas a mano. Éxito: un comando, un fichero que Excel abre sin pasos extra, con las columnas separadas y las tildes bien. Fracasaría aunque funcione si Excel abre el CSV en una sola columna o con `Ã¡` en vez de `á`.

## Scope

- Entra: comando `exportar <sala>` en `src/app.js`; la función pura que arma el CSV; los tests; la capacidad `booking-export`.
- No entra: columna de fecha (las reservas no la tienen), filtrar por día o semana, exportar varias salas a la vez, otros formatos (`.xlsx`, `.ics` —ese es la fila 0009—), elegir ruta o nombre de salida, avisos por correo (fila 0008).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | `git grep -in "exportar\|csv"` sin resultados en `src/`, `test/`, `README.md`, `PRODUCT.md`, `ROADMAP.md` | no aplica |

- Filas que implementa: ninguna (id 0010 sin fila en el roadmap) → nada: comprobado con `git grep -n "0010"`, sin resultados.

## Approach

- A. Una función pura `csvDeSala(sala)` que devuelve el texto del CSV, y `run` la usa y escribe el fichero — se prueba sola sin disco y el disco queda en tres líneas.
- B. Todo dentro de `run('exportar', …)` — menos código, pero la prueba del formato exige tocar el disco siempre.
- C. Un módulo nuevo `src/export.js` — separa más, pero el proyecto tiene «un solo fichero de entrada» (`operations.md`) y no hay otra lógica que justifique el módulo.
- Elegido: A — separa el formato (lo delicado: BOM, `;`, comillas) de la escritura, y respeta el fichero único.

Partes que fija A: `csvDeSala(sala)` busca la sala sin distinguir mayúsculas contra `rooms`, filtra `bookings` por esa sala y devuelve `﻿` + cabecera + filas, con `\r\n` al final de cada línea. `run('exportar', [sala])` escribe con `writeFileSync` en `process.cwd()` y devuelve el mensaje. La sala desconocida o ausente no llega a escribir.

## Dónde se prueba

- Formato del CSV (BOM, `;`, `\r\n`, cabecera, filas, comillas): llamando a `csvDeSala` directamente, como unidad pura.
- `exportar` de punta a punta (fichero creado, mensaje, sobrescritura, sala desconocida sin fichero, sin argumento): por `run`, como los tests actuales de `test/app.test.js`, con una carpeta temporal como directorio actual.
- Excel abre bien el fichero: a mano, en la validación del dev-lead.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala `Norte` con la reserva `lun`, `10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN se crea `norte.csv` en la carpeta actual, en UTF-8 con BOM, con las líneas `sala;dia;franja` y `Norte;lun;10:00-12:00`, cada una terminada en `\r\n`
- AND la respuesta es `exportadas 1 reservas de Norte a norte.csv`

#### ADDED — Exportar una sala sin reservas

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN se crea `sur.csv` con solo la línea `sala;dia;franja`
- AND la respuesta es `exportadas 0 reservas de Sur a sur.csv`

#### ADDED — La sala se reconoce sin distinguir mayúsculas

- GIVEN la sala `Norte`
- WHEN se ejecuta `salas exportar norte`
- THEN se crea `norte.csv` con las reservas de `Norte`
- AND la respuesta es `exportadas 1 reservas de Norte a norte.csv`

#### ADDED — Sala desconocida o sin indicar

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `salas exportar Este`
- THEN la respuesta es `sala desconocida: Este` y no se crea ningún fichero
- AND con `salas exportar` sin sala, la respuesta es `uso: salas exportar <sala>` y no se crea ningún fichero

#### ADDED — Un fichero existente se sobrescribe

- GIVEN `norte.csv` ya existe en la carpeta actual con otro contenido
- WHEN se ejecuta `salas exportar Norte`
- THEN `norte.csv` queda con el contenido nuevo, sin preguntar

#### ADDED — Los valores con separador se entrecomillan

- GIVEN una reserva cuyo valor contiene `;`, `"` o un salto de línea (p. ej. la franja `10:00;12:00`)
- WHEN se exporta su sala
- THEN ese valor sale entre comillas dobles, con cada `"` duplicada (`"10:00;12:00"`)

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: el fichero `<sala en minúsculas>.csv` en la carpeta actual; las reservas siguen en memoria de `src/app.js`
- **Idioma de los nombres**: cabecera `sala;dia;franja` y mensajes en castellano
- **Límites**: ninguno
- **Avisos**: `sala desconocida: <sala>` · `uso: salas exportar <sala>` · `exportadas <n> reservas de <sala> a <fichero>`
- **Regla ante conflicto**: una exportación nueva sobrescribe el fichero existente

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
