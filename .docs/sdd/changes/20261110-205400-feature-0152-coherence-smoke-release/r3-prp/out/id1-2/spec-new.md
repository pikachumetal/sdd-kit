---
id: 20261111-195425-feature-0013-export-csv
feature: 0013
title: Exportar las reservas a CSV
mode: full
profile: delegate
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar las reservas a CSV

🦆 Hoy las reservas solo se ven por la terminal, una a una. Con `exportar` se guardan todas en un fichero CSV, una fila por reserva: `Norte,lun,10:00-12:00,activa`. Las canceladas y las anuladas también salen, con su estado. El fichero se crea en la carpeta donde se ejecuta, o donde se indique, y si ya existía se sustituye sin preguntar. Si no se puede escribir, el comando lo dice y no afirma haber exportado nada.

Validación: dev-lead — el fichero lo abre una persona (hoja de cálculo o editor) y solo ella ve si las columnas y los textos son los que quiere.

## Capacidades

- Nuevas: `reservation-export` — el fichero CSV con las reservas y el comando que lo escribe.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reservation-export`), contrato público (el formato del fichero lo consumirá una hoja de cálculo) · tamaño: ~70 líneas en 3 ficheros
- Dominio (sonnet): si las filas de una reserva cancelada o anulada deben salir y con qué texto de estado, frente a los términos de `PRODUCT.md` (señal: contrato público)
- Técnica (sonnet): si el escape de comas, comillas y saltos de línea y el reemplazo de un fichero existente de las decisiones 5 y 6 dejan el CSV válido (señal: contrato público + capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar si el estado en castellano coincide con los términos del producto

1. Comando `exportar [fichero]` — nombre y forma que nadie dijo; sigue el estilo de `libres`, `cancelar` y `anular`.
2. Sin argumento escribe `reservas.csv` en la carpeta de trabajo — evita pedir un dato para el caso común.
3. Salen todas las reservas, también canceladas y anuladas, en el orden en que se crearon, con la columna `estado`. Los textos son `activa`, `cancelada` y `anulada`: `cancelada` y `anulada` derivan de los términos Cancelación y Anulación de `PRODUCT.md`; `activa` es un término nuevo, que propongo añadir a `PRODUCT.md` al cerrar. Los estados internos `active`, `cancelled` y `voided` se traducen al exportar. «Una fila por reserva» no excluye ninguna, y quien filtra lo hace en la hoja.
4. Columnas, en este orden y con esta cabecera: `sala,dia,franja,estado` — son los campos que hoy guarda cada reserva, nombres en castellano como el resto del producto. No sale quién hizo la reserva: la herramienta no guarda ese dato (ver «No entra»).
5. Formato: separador coma, UTF-8 sin BOM, saltos de línea `\n` (también tras la última fila), y un campo con coma, comilla o salto de línea va entre comillas con las comillas internas dobladas. Sigue RFC 4180 salvo en el salto de línea (`\n`, no CRLF): se trabaja en terminal y las hojas de cálculo lo aceptan.
6. Si el fichero ya existe, se sobrescribe sin preguntar y sin límite de ruta (`exportar src/app.js` pisaría ese fichero) — **decisión de riesgo destructivo, validala**: es un volcado sin nada que fusionar y la herramienta la usa una sola persona. Alternativa descartada: limitar a la extensión `.csv`.
7. Respuesta del comando: `exportadas <n> reservas a <fichero>`, con `n` = 1 → `exportada 1 reserva a <fichero>`; `<fichero>` es el argumento tal como se escribió, no la ruta absoluta.
8. Sin reservas, el fichero lleva solo la cabecera y la respuesta es `exportadas 0 reservas a <fichero>`.
9. Si no se puede escribir (carpeta inexistente, sin permiso, la ruta es una carpeta), la respuesta es `error: no se pudo escribir <fichero>` y el comando no lanza excepción ni dice «exportadas».
10. Enfoque: función pura + función que escribe + comando fino (ver Approach), frente a escribir el CSV a mano dentro de `run` y a una dependencia de CSV — el proyecto no tiene dependencias.
11. Capacidad nueva `reservation-export` (slug en inglés, kebab-case, con «reservation» y no «booking», que `PRODUCT.md` marca como _Evitar_). El nombre del comando y la cabecera van en castellano; los nombres de función en el código siguen los de hoy (`cancelBooking`, `voidBooking`).
12. Las reservas viven en memoria, así que cada ejecución exporta las que tiene en ese momento (hoy, la reserva de partida). No añado persistencia: está fuera de esta feature, y el valor real del comando crece cuando exista.
- Repaso de coherencia: `git grep` no halló nada que retirar. El delta, probado en una copia con `sdd capability merge` tras integrar la review, añadió 6 requisitos y las 5 reglas a `reservation-export.md` sin rechazos (`exit 0`).
- Política de modelos: revisores de la spec en sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura: no (sin módulo, dependencia ni contrato entre módulos) · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar.

### Hallazgos de la review

Técnica:
- **Aceptado** — el escenario del CSV no fija el texto exacto ni el `\n` final → el THEN da el fichero completo y el test compara la cadena entera (decisión 5).
- **Aceptado** — falta escenario del salto de línea y de un campo sin comillas → requisito «Un campo con coma, comillas o salto de línea va entre comillas».
- **Aceptado** — `reservas.csv` en la carpeta de trabajo no se puede probar tal cual → «Dónde se prueba»: el test cambia a una carpeta temporal con `process.chdir`.
- **Aceptado** — dos comportamientos en un requisito y cero reservas sin GIVEN → requisitos separados; el caso vacío se prueba con la función que escribe y una lista vacía.
- **Aceptado** — decisiones fuera de ✋ (orden, traducción de estados, error de escritura) → decisiones 3 y 9.
- **Aceptado** — RFC 4180 y `\n` se contradecían → decisión 5 lo dice.
- **Aceptado** — sin requisito de fallo de escritura → decisión 9 y su requisito.
- **Aceptado** — «Límites: no aplica» sin motivo → regla con el valor real.
- **Aceptado** — `anulada` sin GIVEN → el escenario crea las tres reservas.
- **Aceptado** — firma de la función que escribe sin fijar → Approach.

Dominio:
- **Aceptado** — el slug usaba «booking» → `reservation-export` (decisión 11).
- **Rechazado** — añadir una columna con quien reservó → la herramienta no guarda ese dato; va a «No entra» (decisión 4).
- **Aceptado** — los estados no están en `PRODUCT.md` → decisión 3, con `activa` marcado como nuevo.
- **Aceptado** — sin aviso de fallo de escritura → decisión 9 y regla de Avisos.
- **Aceptado** — sobrescribir sin límite es destructivo → decisión 6, marcada para validar.
- **Aceptado** — «Límites: no aplica» → regla con el valor real.
- **Aceptado** — el valor depende de la persistencia → decisión 12 y Intent.
- **Aceptado** — `anulada` sin GIVEN → igual que arriba.
- **Aceptado** — números de fila: comprobados en `ROADMAP.md` (0004 `.ics`, 0012 informe de ocupación).
- **Rechazado** — quitar el mínimo «solo técnica» → es el registro de lo que el rubric daba, no una opción que se despache; lo dejo para que veas qué cubriría cada lente.

### Decisiones tomadas con el dev-lead

- Carril feature, perfil delegate — «0012 carril feature … Perfil delegate»
- Al fusionar, con push — «Al fusionar, `sdd merge --push`»
- La id pasó de 0012 a 0013 — `sdd id claim` la renumeró porque otra fila ya publicaba la 0012 en `origin/develop`.

## Intent

Hoy no hay forma de sacar las reservas de la herramienta: solo se consultan por la terminal. Se quiere un fichero CSV con una fila por reserva para abrirlo en una hoja de cálculo. Éxito: `node src/app.js exportar` crea `reservas.csv` con la cabecera y tantas filas como reservas, y la hoja lo abre sin columnas descuadradas. Fracaso, aunque «funcione»: que falte una reserva, que un campo con coma rompa las columnas o que el comando diga «exportadas» sin haber escrito. Mientras las reservas vivan solo en memoria, cada ejecución exporta la reserva de partida: la utilidad completa llega con la persistencia, que no es de esta feature.

## Scope

- Entra: el comando `exportar [fichero]`; la función que convierte las reservas a texto CSV; la que escribe el fichero; el aviso si no se puede escribir; los tests; la capacidad `reservation-export`.
- No entra: filtros (por sala, día o estado), otros formatos (`.ics` es la 0004), persistencia de las reservas, informe de ocupación (0012), elegir separador o codificación, la columna de quien hizo la reserva (la herramienta no guarda ese dato) y avisar al sobrescribir.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0013 → `ROADMAP.md:9`, solo su estado | nada más: comprobado con `git grep -niE "exportar|csv|0013"`, sin otros hits fuera de `ROADMAP.md`.

## Approach

- A. Función pura `bookingsToCsv(bookings)` que devuelve el texto; `exportBookings(bookings, path)` que lo escribe y devuelve la respuesta (éxito o error); y `run('exportar', …)` que llama a la segunda con las reservas del módulo — el formato y la escritura se prueban con una lista propia, sin depender del estado global. Cuesta tres funciones nuevas en `src/app.js`, el único fichero de entrada.
- B. Construir el CSV dentro de `run` — menos código, pero el formato solo se prueba escribiendo ficheros y no se puede probar la lista vacía.
- C. Una dependencia de CSV — el proyecto no tiene dependencias (`architecture.md`) y el formato es de 4 columnas.
- Elegido: A — el formato es lo que más puede fallar (comas, comillas, saltos) y así se prueba en una línea.

Partes del cómo: el escape sigue la decisión 5; los estados se traducen según la decisión 3; la escritura usa `node:fs` (módulo de Node, no una dependencia) y captura el fallo para dar la respuesta de la decisión 9.

## Dónde se prueba

- Formato del CSV (cabecera, filas, orden, escape, estados): llamando a la función pura con listas propias, como `test/app.test.js` llama a `run`.
- Escritura (fichero creado, sustituido, lista vacía, fallo, respuesta con n = 2): llamando a `exportBookings` con una carpeta temporal.
- Comando `exportar` (nombre por defecto, argumento, respuesta con n = 1): por `run('exportar', …)`, con `process.chdir` a una carpeta temporal para el caso sin argumentos.

## Términos y ADR

- Términos resueltos: `activa`, `cancelada` y `anulada` son los estados exportados; `cancelada` es la reserva anulada por el propio cliente antes de 24 h (Cancelación) y `anulada` la que anula el responsable de sala (Anulación), según `PRODUCT.md`. `activa` se propone añadirlo allí.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `reservation-export`

#### ADDED — El CSV lleva una fila por reserva

- GIVEN tres reservas en este orden: Norte, lun, 10:00-12:00, activa · Sur, mar, 09:00-10:00, cancelada · Norte, mié, 14:00-15:00, anulada
- WHEN se exportan las reservas
- THEN el fichero es exactamente `sala,dia,franja,estado\nNorte,lun,10:00-12:00,activa\nSur,mar,09:00-10:00,cancelada\nNorte,mié,14:00-15:00,anulada\n`, en UTF-8 sin BOM

#### ADDED — Un campo con coma, comillas o salto de línea va entre comillas

- GIVEN una sala llamada `Norte, 2`, otra llamada `Sala "A"`, otra con un salto de línea entre `Sala` y `B`, y la sala `Sur`
- WHEN se exportan las reservas
- THEN las filas llevan `"Norte, 2"`, `"Sala ""A"""` y `"Sala\nB"` en la columna `sala`
- AND `Sur` sale sin comillas

#### ADDED — El comando exportar escribe el fichero

- GIVEN una reserva activa en memoria
- WHEN se ejecuta `exportar` sin argumentos
- THEN se escribe `reservas.csv` en la carpeta de trabajo y la respuesta es `exportada 1 reserva a reservas.csv`
- AND con `exportar informe.csv` el fichero es `informe.csv` y la respuesta es `exportada 1 reserva a informe.csv`
- AND con dos reservas la respuesta es `exportadas 2 reservas a reservas.csv`

#### ADDED — Exportar sustituye el fichero existente

- GIVEN el fichero `reservas.csv` ya existe con otro contenido
- WHEN se ejecuta `exportar`
- THEN el contenido anterior desaparece y queda el nuevo

#### ADDED — Sin reservas el fichero lleva solo la cabecera

- GIVEN ninguna reserva
- WHEN se exportan las reservas a `reservas.csv`
- THEN el fichero es exactamente `sala,dia,franja,estado\n` y la respuesta es `exportadas 0 reservas a reservas.csv`

#### ADDED — Si no se puede escribir, lo dice

- GIVEN la ruta `no-existe/reservas.csv`, cuya carpeta no existe
- WHEN se exportan las reservas a esa ruta
- THEN la respuesta es `error: no se pudo escribir no-existe/reservas.csv`, no se lanza excepción y no se dice «exportadas»

#### Reglas de la capacidad — reservation-export

- **Dónde viven los datos**: el fichero que se indica o `reservas.csv`; las reservas, en memoria.
- **Idioma de los nombres**: castellano en el comando, la cabecera y los estados; el slug de la capacidad, en inglés.
- **Límites**: no aplica: salen todas las reservas, sin tope; la ruta de destino no tiene restricción.
- **Avisos**: la respuesta `exportadas <n> reservas a <fichero>` (`exportada 1 reserva` con una) y, si falla la escritura, `error: no se pudo escribir <fichero>`.
- **Regla ante conflicto**: el fichero existente se sobrescribe sin aviso.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
