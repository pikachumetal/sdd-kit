---
id: 20261114-165233-feature-0010-exportar-reservas-csv
feature: 0010
title: Exportar las reservas de una sala a CSV
mode: full
status: draft
created: 2026-11-14
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar las reservas de una sala a CSV

🦆 Hoy no hay forma de sacar las reservas de una sala. Con esta feature, `exportar Norte` crea el fichero `reservas-Norte.csv` con una línea por reserva (`Norte;lun;10:00-12:00`). El responsable lo abre con doble clic en Excel en castellano, con las columnas ya separadas y sin letras rotas. Para eso el fichero separa las columnas con punto y coma y lleva una marca al principio que le dice a Excel que los acentos van en UTF-8. Si el fichero está abierto en Excel y no se puede sobrescribir, el comando lo avisa en vez de romperse. Una reserva semanal (`--cada-semana`) no saldrá, porque hoy no se guarda en ningún sitio.

Validación: dev-lead — lo que se ve es el fichero abierto en Excel; solo una persona con Excel en castellano puede confirmarlo.

## Capacidades

- Nuevas: `bookings` — las reservas de las salas y cómo salen de la herramienta (hoy, solo la exportación a CSV).
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), contrato público (el formato del fichero lo consume Excel) · tamaño: ~70 líneas en 3 ficheros
- Dominio (sonnet): si el contenido exacto del fichero (BOM, `;`, CRLF, cabecera `sala;dia;franja`) hace que Excel en castellano lo abra con doble clic sin arreglos, y si los escenarios cubren sala sin reservas y sala desconocida (señal: contrato público)
- Técnica (sonnet): si la opción `dir` de `run` y la escritura en disco se prueban sin ensuciar la carpeta del proyecto, y si «pisa el fichero» queda cubierto (señal: capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar si el fichero se abre bien en Excel, que es el objetivo de la feature

1. Capacidad nueva `bookings` (sustantivo del dominio, para que `reservar` y `cancelar` cuelguen de ella en el futuro) — el proyecto no tiene `capabilities/` y el delta necesita un sitio.
2. Enfoque: ampliar `run` con una opción `dir` (carpeta donde escribir), frente a un módulo aparte o a imprimir por pantalla (ver Approach).
3. Nombre del comando: `exportar <sala>` — verbo en infinitivo como `reservar` y `cancelar`.
4. Nombre y carpeta del fichero: `reservas-<sala>.csv` en la carpeta desde la que se ejecuta el comando — el usuario lo delegó; la carpeta actual es donde ya está quien lo lanza y no obliga a configurar nada.
5. Cabecera y columnas: `sala;dia;franja`, sin tilde, igual que los datos de `src/app.js`; no hay más datos que exportar, porque una reserva hoy solo tiene esos tres campos. Las filas salen en el orden de la lista de reservas.
6. Formato para Excel: UTF-8 con BOM y fin de línea CRLF — es lo que hace que Excel en castellano respete los acentos y lo abra directo; pendiente de confirmarlo en Excel en la validación.
7. Un fichero ya existente se pisa, sin avisar — regenerarlo cada lunes sin acumular copias es lo que menos fricción da; el coste es que se pierde lo que alguien hubiera editado a mano en ese fichero.
8. Una sala sin reservas genera el fichero con solo la cabecera — así el lunes se distingue «no hay reservas» de «no se exportó».
9. Una sala que no existe: `sala desconocida: Oeste`, sin crear fichero. Sin argumento: `uso: exportar <sala>`, sin crear fichero. Los nombres de sala distinguen mayúsculas (`norte` no es `Norte`), como hoy `libres`. Argumentos de más (`exportar Norte Sur`) se ignoran: solo cuenta el primero.
10. Texto de respuesta al exportar: `exportadas las reservas de Norte en reservas-Norte.csv (total: 1)` — sin plural variable, para no escribir «1 reservas».
11. No se escapan `;`, comillas ni saltos de línea en los campos: ningún valor posible los lleva hoy (salas `Norte` y `Sur`, días y franjas con formato fijo). Si algún día entran nombres libres, hay que añadirlo.
12. Limitación conocida: solo salen las reservas guardadas en la lista de `src/app.js`. `reservar --cada-semana` hoy responde «reserva semanal creada» pero no guarda nada, así que una reserva semanal **no aparecerá** en el CSV. No lo arreglo aquí (es otra feature); lo dejo dicho para que el lunes nadie dé por hecho que el CSV las incluye.
13. Si el fichero no se puede escribir (típico: lo tienes abierto en Excel, que en Windows lo bloquea), el comando responde `no se pudo escribir reservas-Norte.csv (EBUSY)` en vez de caerse con una traza — el responsable lo regenera cada lunes con el fichero del lunes anterior posiblemente aún abierto. En los tests se provoca con una carpeta que se llama como el fichero (`EISDIR`).
- Repaso de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` sale con código 0 (5 requisitos y 5 reglas añadidos a `bookings`); `git grep` de `exportar`, `csv` y `0010` fuera de las specs, sin resultados.
- Política de modelos: revisores de la spec Dominio sonnet y Técnica sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

No se pudieron despachar los dos revisores de la rúbrica: esta sesión no tiene herramienta de subagentes. La lectura adversarial con los siete puntos la hizo el propio autor de la spec, que no es independiente; el dev-lead debe tomarla como una pasada de autor, no como una review. Hallazgos de esa lectura:

- **Aceptado** — Importante · Delta: la línea `Se valida en: la rama` no es un valor válido; lo que se ve desde la rama no lleva esa línea → quitada; lo de Excel queda en «Dónde se prueba».
- **Aceptado** — Importante · Scope: el caso de fichero abierto en Excel (Windows lo bloquea y `writeFileSync` lanzaría una excepción sin controlar) no estaba cubierto → nuevo requisito «Si no se puede escribir el fichero, lo dice sin romperse», decisión 13 y aviso nuevo en las reglas.
- **Aceptado** — Menor · Decisión 7: atribuía al responsable un deseo («no quiere acumular copias») que nadie dijo → reescrita como razón mía, con su coste.
- **Aceptado** — Menor · Decisiones: orden de las filas y argumentos de más sin decidir → añadidos a las decisiones 5 y 9.
- **Sin hallazgos** en los puntos 1 (no hay capacidades vivas con las que chocar), 5 y 5 bis (sin roles; las cinco reglas están declaradas) y 7 (los ejemplos salen del código).

### Decisiones tomadas con el dev-lead

- El responsable de cada sala abre el fichero en Excel con la configuración en castellano, por eso el separador es `;` — «Excel, con la configuración en castellano. Por eso el separador es punto y coma.»
- El comando guarda un fichero (no imprime por pantalla) y se abre con doble clic en Excel sin arreglos a mano — «Opción 1: que guarde un fichero. Lo quiero abrir en Excel con doble clic y sin arreglos a mano.»
- El nombre y la carpeta del fichero los decide el agente — «El nombre y la carpeta los decides tú.»

## Intent

El responsable de cada sala cuadra los lunes las reservas en su hoja de cálculo, y hoy no tiene de dónde sacarlas: `salas` no lista reservas. Se quiere un comando que las exporte a un fichero CSV que Excel en castellano abra con doble clic. Éxito: `exportar Norte` y, con doble clic, Excel muestra tres columnas (`sala`, `dia`, `franja`) y una fila por reserva de Norte, sin pasos manuales. Anti-objetivo: un fichero que haga falta importar con el asistente de texto, que muestre las columnas pegadas en una sola celda o que estropee los acentos, aunque técnicamente sea un CSV válido.

## Scope

- Entra: comando `exportar <sala>` que escribe `reservas-<sala>.csv` con las reservas guardadas de esa sala; mensajes de error por sala desconocida y por falta de argumento; la capacidad `bookings` con su delta.
- No entra: exportar todas las salas a la vez; filtrar por día; exportar a calendario `.ics` (es la 0009, otra feature); guardar de verdad las reservas semanales (`--cada-semana`); elegir nombre o carpeta de salida; escapar caracteres especiales (decisión 11).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "exportar\|csv\|0010"` fuera de las specs: sin resultados | no aplica |

- Filas que implementa: nada: comprobado con `git grep -nE "0010" -- ROADMAP.md` (la 0010 no tiene fila; la 0009, `.ics`, es distinta y queda fuera).

## Approach

- A. Ampliar `run` en `src/app.js` con una rama `exportar` y una opción `dir` (por defecto la carpeta actual) para poder probarlo en una carpeta temporal — una función más en el único fichero de entrada; `run` deja de ser pura solo en esta rama.
- B. Un módulo aparte `src/exportar.js` con la función que construye el CSV — se prueba sola, pero las reservas viven en `src/app.js` sin exportar y habría que moverlas o exportarlas: más ficheros para tres líneas de lógica.
- C. Imprimir por pantalla — descartada por el dev-lead: no controla los bytes y Excel puede romper los acentos.
- Elegido: A — respeta que `src/app.js` es el único fichero de entrada (`operations.md`) y prueba por `run`, la costura que ya usan los tests actuales.

Partes del cómo que fija A: el contenido es `﻿` + cabecera + una línea por reserva de la sala, todas terminadas en `\r\n`; las líneas siguen el orden de la lista; se escribe con `writeFileSync` en `join(dir, 'reservas-<sala>.csv')`; `run` devuelve el texto de respuesta o de error.

## Dónde se prueba

- Exportar una sala con reservas, sin reservas, desconocida y sin argumento: por `run('exportar', [...], { dir })` con una carpeta temporal, como los tests de `test/app.test.js`; el contenido se lee del disco con `readFileSync` y se compara byte a byte (incluido el BOM).
- Pisar un fichero existente: el mismo test, con el fichero creado antes.
- Fichero que no se puede escribir: el mismo test, con una carpeta llamada `reservas-Norte.csv` dentro de `dir`, que da `EISDIR`; el bloqueo real de Excel (`EBUSY`) lo prueba el dev-lead.
- Que Excel lo abre con doble clic: validación del dev-lead, a mano, con Excel en castellano.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala Norte con una reserva (`lun`, `10:00-12:00`)
- WHEN se ejecuta `exportar Norte`
- THEN se crea `reservas-Norte.csv` en la carpeta actual con exactamente estos bytes: BOM UTF-8, `sala;dia;franja`, fin de línea CRLF, `Norte;lun;10:00-12:00`, fin de línea CRLF
- AND responde `exportadas las reservas de Norte en reservas-Norte.csv (total: 1)`

#### ADDED — Una sala sin reservas se exporta con solo la cabecera

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN se crea `reservas-Sur.csv` con solo el BOM y `sala;dia;franja` más su fin de línea CRLF
- AND responde `exportadas las reservas de Sur en reservas-Sur.csv (total: 0)`

#### ADDED — Exportar sustituye el fichero anterior

- GIVEN `reservas-Norte.csv` ya existe con otro contenido
- WHEN se ejecuta `exportar Norte`
- THEN el fichero queda con el contenido nuevo, sin copia del anterior

#### ADDED — Una sala desconocida o sin nombre no exporta nada

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `exportar Oeste`
- THEN responde `sala desconocida: Oeste` y no se crea ningún fichero
- AND `exportar norte` responde `sala desconocida: norte` y no crea ningún fichero
- AND `exportar` sin sala responde `uso: exportar <sala>` y no crea ningún fichero

#### ADDED — Si no se puede escribir el fichero, lo dice sin romperse

- GIVEN `reservas-Norte.csv` no se puede escribir (por ejemplo, está abierto en Excel, que en Windows lo bloquea)
- WHEN se ejecuta `exportar Norte`
- THEN responde `no se pudo escribir reservas-Norte.csv (<código del sistema>)`, por ejemplo `(EBUSY)`, y el programa no termina con una traza de error

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, la lista de reservas de `src/app.js`; el CSV es una copia que se regenera en cada exportación.
- **Idioma de los nombres**: castellano (comando `exportar`, columnas `sala`, `dia`, `franja`, mensajes).
- **Límites**: no aplica.
- **Avisos**: `exportadas las reservas de <sala> en reservas-<sala>.csv (total: <n>)`, `sala desconocida: <sala>`, `uso: exportar <sala>` y `no se pudo escribir reservas-<sala>.csv (<código del sistema>)`.
- **Regla ante conflicto**: un `reservas-<sala>.csv` existente se sustituye entero.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
