---
id: 20261106-100417-feature-0013-export-csv
feature: 0013
title: Exportar las reservas a CSV
mode: full
profile: delegate
status: draft
created: 2026-11-06
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar las reservas a CSV

🦆 Hoy las reservas solo se ven una a una con `libres`, `cancelar` y `anular`. Con esta feature, `salas exportar` escribe un fichero `reservas.csv` con una fila por reserva: `Norte,lun,10:00-12:00,activa`. Lo abres en una hoja de cálculo y ves todas, también las canceladas y anuladas, con su estado. Si la ruta no se puede escribir, el comando lo dice en vez de romperse. Por dentro, una función convierte la lista de reservas en texto CSV y el comando lo escribe en disco.

Validación: dev-lead — el fichero lo abre una persona en su hoja de cálculo y solo ella ve si las columnas y los acentos salen bien (ver decisión 5 sobre el BOM).

## Capacidades

- Nuevas: `booking-export` — el CSV con las reservas y el comando que lo escribe.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el formato del CSV lo consume una hoja de cálculo ajena) · tamaño: ~40 líneas en 3 ficheros
- Dominio (sonnet): si «una fila por reserva» incluye las canceladas y anuladas (decisión 3) y si los literales `activa`, `cancelada`, `anulada` casan con «Cancelación» y «Anulación» de PRODUCT.md (señal: contrato público)
- Técnica (sonnet): si el escape de comas, comillas y saltos de línea (decisión 6) y la escritura que pisa el fichero (decisión 7) están cubiertos por un THEN (señal: capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar si los estados y las columnas dicen lo que el dev-lead espera ver en la hoja

### Hallazgos de la review

Dominio:
- **Rechazado** — «los literales de estado no tienen respaldo en PRODUCT.md» → el revisor no leía PRODUCT.md; `## Terminology` define «Cancelación» y «Anulación», y `activa` es decisión mía (4); el escenario de estados lo fija ahora por separado.
- **Aceptado** — falta «Reglas de la capacidad» → añadida con las cinco reglas por nombre; decisión 11 reescrita.
- **Aceptado** — falta el escenario del fallo de escritura → escenario «Si la ruta no se puede escribir, lo dice» y decisión 9.
- **Aceptado** — `[ruta]` sin escenario con otra ruta → escenario con `salida/x.csv` y 2 reservas.
- **Aceptado** — los estados no se fijan por separado → escenario «Canceladas y anuladas salen con su estado».
- **Aceptado** — coma, comilla y salto de línea mezclados → tres escenarios con su GIVEN.
- **Aceptado** — plural mal concordado en el mensaje → mensaje `reservas exportadas: <n> en <ruta>`.
- **Aceptado** — la persistencia no se declaraba en el Intent → añadida al Intent y a la decisión 12.
- **Rechazado** — Excel abre UTF-8 sin BOM como ANSI → el BOM estropea otras herramientas y la fila no pide Excel; queda sin BOM, dicho en la decisión 5 y como criterio de la validación.
- **Aceptado** — la cifra «5 requisitos» envejece → quitada de la decisión 15.

Técnica:
- **Aceptado** (Crítico) — el `\n` final no estaba fijado → decisión 5: el texto acaba en un único `\n`; todos los THEN llevan el literal con `\n` final.
- **Aceptado** (Crítico) — «solo la cabecera» sin saltos → THEN con `sala,dia,franja,estado\n`.
- **Aceptado** — el salto de línea en un campo no tenía THEN → escenario propio; `\r` se entrecomilla igual.
- **Aceptado** — con ruta y sin ruta en un solo escenario → dos escenarios; el segundo se prueba con `process.chdir` a una carpeta temporal.
- **Aceptado** — mensaje fijado solo con `reservas.csv` y N=1 → escenario con otra ruta y N=2.
- **Aceptado** — los bytes UTF-8 sin BOM no se comprobaban → AND en el escenario del comando.
- **Aceptado** — decisiones del cuerpo fuera de ✋ (error de escritura, `utf8` explícito, dónde vive la función) → decisiones 9, 5 y 14.
- **Aceptado** — sobrescribir cualquier ruta → decisión 7 lo acota a «cualquier ruta que se dé».
- **Aceptado** — estado interno desconocido → decisión 4: sale el literal interno tal cual.
- **Aceptado** — los tests no deben depender de la reserva de arranque → «Dónde se prueba» fija `bookings` en cada test.

Segunda ronda (un revisor Sonnet con los siete puntos, por los dos Críticos aceptados; sin ningún Crítico nuevo, no hay tercera):
- **Aceptado** — el escenario de sobrescribir no fijaba contenidos → el fichero previo vale `viejo\n` y se fija el CSV esperado.
- **Aceptado** — la decisión 9 prometía directorio y permisos sin escenario → «sin permisos» sale del compromiso (no es fiable en Windows ni como root) y se añade el escenario del directorio.
- **Aceptado** — el estado desconocido de la decisión 4 no tenía escenario → escenario propio; los GIVEN de estados llevan los literales internos.
- **Aceptado** — el `\r` y el `\n` del escenario del salto de línea eran ambiguos → cada uno con su fila exacta y dicho que son caracteres de control.
- **Rechazado** — los nombres internos `active`, `cancelled`, `voided` se afirman sin leer código → salen del `status` de `bookings` en `src/app.js`, que sí leí al clasificar; no hay asunción.
- **Aceptado** — «no deja ningún fichero a medias» contradecía `writeFileSync` → decisión 9: «no crea el fichero cuando falla la escritura».
- **Aceptado** — «su resultado, abajo» colgaba y la política decía «tercero» → reescrito en esta lista y en la política.
- **Aceptado** — la política de modelos como viñeta suelta tras la 16 → pasa a su propia línea bajo un encabezado.
- **Rechazado** — «Límites» y «Avisos» sin escenario → son ausencia de comportamiento («sin tope», «ninguno»); lo observable de «Avisos», que sobrescribir no avisa, ya lo cubre el escenario de sobrescribir.
- **Aceptado** — las decisiones de numeración y de estructura de carpetas no cambian el contenido → salen de la lista y van como «Notas del arranque»; la línea 9 del roadmap la leí (`0013 · Exportar las reservas a CSV`).

1. Comando `exportar [ruta]`; sin ruta, escribe `reservas.csv` en la carpeta desde la que se lanza — nadie dijo ni el nombre del comando ni el del fichero; `exportar` sigue los verbos en castellano de `libres`, `cancelar` y `anular`.
2. Cabecera `sala,dia,franja,estado`, en castellano (constitución, art. 4) y sin acentos en los nombres de columna; no hay columna de persona porque la reserva no guarda a quien la pide.
3. Salen todas las reservas, sea cual sea su estado, en el orden del array en memoria (el de creación) — «una fila por reserva» no excluye ninguna, y la columna `estado` permite filtrar en la hoja.
4. Estados con el literal `activa`, `cancelada` o `anulada` (PRODUCT.md fija Cancelación y Anulación; los internos `active`, `cancelled`, `voided` no salen). Un estado interno desconocido sale tal cual, sin error.
5. Coma como separador, saltos de línea `\n`, y el texto acaba en un único `\n` tras la última fila; UTF-8 explícito y **sin BOM**. Riesgo: Excel en configuración regional española puede abrirlo como ANSI (`mié` saldría roto) o pedir `;`; el BOM estropea otras herramientas, así que queda fuera y es lo primero que mirar en la validación.
6. Un campo con coma, comilla doble, `\n` o `\r` va entre comillas dobles y la comilla se duplica; hoy ninguna sala ni franja lo necesita, pero un nombre de sala con coma rompería el fichero.
7. Si el fichero ya existe, se sobrescribe sin preguntar, sea cual sea la ruta que se dé (también una que no acabe en `.csv`); asumido por ser una herramienta de una sola persona (`mission.md`).
8. Sin reservas, el fichero lleva solo la cabecera y su `\n`.
9. Respuesta del comando: `reservas exportadas: <n> en <ruta>`, con la ruta tal como se escribió o `reservas.csv`; si la escritura falla porque la carpeta no existe o la ruta es un directorio, responde `no se pudo escribir <ruta>` y no crea el fichero. Los demás fallos (permisos, disco lleno) no se prometen. Son textos nuevos míos.
10. Nombre de la capacidad nueva, en inglés kebab-case: `booking-export`.
11. «Reglas de la capacidad»: la constitución no define «Reglas de producto», así que las cinco entradas van con el valor que propongo yo (ver el delta): datos en memoria y fichero en disco, nombres en castellano, sin tope de filas, sin avisos al sobrescribir y sobrescribir ante conflicto.
12. Las reservas viven solo en memoria (`bookings` de `src/app.js`, con una sola reserva de arranque), así que cada lanzamiento exporta lo que ese proceso conoce, hoy una sola; guardarlas entre lanzamientos no es de esta feature, y la exportación no tiene utilidad real hasta que lo sea.
13. Delta probado sobre una copia de `.docs/sdd` en una carpeta temporal tras las enmiendas de la primera ronda: `sdd capability merge` fusiona los requisitos y las cinco reglas y `sdd capability check` da «Capacidades válidas: 1»; el `capabilities/` del repo no cambia. Se repite con las de la segunda.
14. La función `exportBookings()` vive en `src/app.js`, el único fichero de entrada (`tech-stack.md`), y el comando escribe con `writeFileSync(ruta, texto, 'utf8')`.

Notas del arranque (no cambian el comportamiento): la 0012 que reservaba esta fila ya la tenía «Informe de ocupación» en `origin/develop`, `sdd id claim` la pasó a 0013 y la rama es `feature/0013-export-csv`; los artefactos van en `.docs/sdd/specs/` y no en `changes/` porque el proyecto sigue con la estructura anterior a 3.0.0 aunque `sdd-kit.json` diga 3.0.0.

### Política de modelos

- Política de modelos: revisores de la spec, dominio y técnica, ambos en Sonnet, y un revisor de la segunda ronda, también en Sonnet · revisión final con Spec en opus+high y Código en sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

### Decisiones tomadas con el dev-lead

- Carril feature, perfil `delegate` — «Arranca la 0012 con sdd-propose, carril feature […] Perfil delegate».
- Al fusionar, se empuja con `sdd merge --push` — «Al fusionar, `sdd merge --push`».

## Intent

Hoy no hay forma de sacar las reservas del programa: se consultan de una en una. Se quiere un fichero que se abra en una hoja de cálculo con una fila por reserva. Éxito: `salas exportar` escribe un CSV cuyo número de filas de datos es el de reservas y cuyas columnas se leen sin tocar nada. Fracasaría aunque funcione si dejase fuera las canceladas sin decirlo, o si un nombre con coma desplazase las columnas. Limitación conocida: las reservas viven solo en memoria, así que hoy cada exportación sale con la reserva de arranque; guardarlas es otra feature.

## Scope

- Entra: el comando `exportar [ruta]`, la función que genera el CSV, sus tests y la mención en el changelog al cerrar.
- No entra: persistencia de las reservas entre lanzamientos, filtros (por sala, por día, por estado), otros formatos (`.ics` es B1 del backlog), el informe de ocupación (0012) y cualquier columna de persona.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0013 → `.docs/sdd/roadmap.md:9` (su propia fila; se marca al cerrar) | comprobado con `git grep -niE "0013|exportar|csv" -- . ':!.docs/sdd/specs'`, que solo da esa fila.

## Approach

`exportBookings()` en `src/app.js` recorre `bookings` y devuelve el texto CSV (cabecera y una línea por reserva, con el escape de la decisión 6, los estados de la decisión 4 y un `\n` tras cada línea). `run('exportar', params)` escribe ese texto en `params[0]` o en `reservas.csv` y devuelve la frase de la decisión 9, o `no se pudo escribir <ruta>` si la escritura falla.

## Dónde se prueba

- Texto del CSV (cabecera, estados, escape, orden, sin reservas): llamando a `exportBookings()` desde `test/`, como `run` en los tests actuales. Cada test fija `bookings` (la vacía o la siembra con las reservas de su GIVEN) y la restaura al acabar: no depende de la reserva de arranque.
- Comando `exportar`: por `run('exportar', [ruta])` con una ruta en una carpeta temporal, leyendo el fichero escrito como `Buffer`, igual que `test/cancel.test.js` llama a `run('cancelar', …)`. El caso sin ruta se prueba con `process.chdir` a una carpeta temporal, restaurado al acabar.

## Términos y ADR

- Términos resueltos: **Exportación** — el fichero CSV con todas las reservas, en cualquier estado. | _Evitar_: informe (es la 0012).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — El CSV lleva una fila por reserva

- GIVEN las reservas `Norte lun 10:00-12:00` activa y `Sur mar 09:00-10:00` activa
- WHEN se exporta
- THEN el contenido es `sala,dia,franja,estado\nNorte,lun,10:00-12:00,activa\nSur,mar,09:00-10:00,activa\n`, en el orden en que están las reservas

#### ADDED — Canceladas y anuladas salen con su estado

- GIVEN `Sur mar 09:00-10:00` con estado interno `cancelled` y `Norte mié 11:00-12:00` con estado interno `voided`
- WHEN se exporta
- THEN el contenido es `sala,dia,franja,estado\nSur,mar,09:00-10:00,cancelada\nNorte,mié,11:00-12:00,anulada\n`

#### ADDED — Un estado desconocido sale tal cual

- GIVEN `Sur mar 09:00-10:00` con estado interno `foo`
- WHEN se exporta
- THEN su fila es `Sur,mar,09:00-10:00,foo\n`, sin error

#### ADDED — Sin reservas, solo la cabecera

- GIVEN ninguna reserva
- WHEN se exporta
- THEN el contenido es exactamente `sala,dia,franja,estado\n`

#### ADDED — Un campo con coma va entrecomillado

- GIVEN una reserva de la sala `Sala, grande` el `lun` en `10:00-12:00`, activa
- WHEN se exporta
- THEN su fila es `"Sala, grande",lun,10:00-12:00,activa\n`

#### ADDED — Una comilla en un campo se duplica

- GIVEN una reserva de la sala `La "Sur"` el `lun` en `10:00-12:00`, activa
- WHEN se exporta
- THEN su fila es `"La ""Sur""",lun,10:00-12:00,activa\n`

#### ADDED — Un salto de línea en un campo va entrecomillado

- GIVEN una reserva de la sala `Sala\nX` el `lun` en `10:00-12:00`, activa
- WHEN se exporta
- THEN su fila es `"Sala` + salto de línea real (carácter de control, no la barra y la `n`) + `X",lun,10:00-12:00,activa` + `\n` final
- AND con la sala `Sala` + retorno de carro real (carácter de control) + `X`, la fila es `"Sala` + retorno de carro + `X",lun,10:00-12:00,activa` + `\n` final

#### ADDED — El comando escribe el fichero en la ruta dada

- GIVEN las reservas `Norte mié 11:00-12:00` activa y `Sur mar 09:00-10:00` activa y una carpeta `salida` que existe
- WHEN se ejecuta `exportar salida/x.csv`
- THEN se escribe `salida/x.csv` con la cabecera y las dos filas, y el comando responde `reservas exportadas: 2 en salida/x.csv`
- AND el fichero leído como bytes empieza por `sala` (sin BOM) y `mié` está en UTF-8 (`6D 69 C3 A9`)

#### ADDED — Sin ruta, el comando escribe `reservas.csv`

- GIVEN la reserva `Norte lun 10:00-12:00` activa
- WHEN se ejecuta `exportar` sin ruta
- THEN se escribe `reservas.csv` en la carpeta desde la que se lanza, con la cabecera y `Norte,lun,10:00-12:00,activa\n`, y el comando responde `reservas exportadas: 1 en reservas.csv`

#### ADDED — Exportar de nuevo sobrescribe el fichero

- GIVEN un `reservas.csv` que ya existe con el contenido `viejo\n` y la reserva `Norte lun 10:00-12:00` activa
- WHEN se ejecuta `exportar`
- THEN el fichero es exactamente `sala,dia,franja,estado\nNorte,lun,10:00-12:00,activa\n`, sin restos de `viejo`

#### ADDED — Si la ruta no se puede escribir, lo dice

- GIVEN la carpeta `no-existe`, que no existe
- WHEN se ejecuta `exportar no-existe/x.csv`
- THEN el comando responde `no se pudo escribir no-existe/x.csv` y no crea ningún fichero

#### ADDED — Si la ruta es un directorio, lo dice

- GIVEN una carpeta `salida` que existe
- WHEN se ejecuta `exportar salida`
- THEN el comando responde `no se pudo escribir salida` y la carpeta `salida` sigue siendo una carpeta, sin cambios

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: las reservas, en memoria; el CSV, en el fichero de la ruta dada o `reservas.csv` en la carpeta de lanzamiento.
- **Idioma de los nombres**: castellano; cabecera `sala,dia,franja,estado` sin acentos y estados `activa`, `cancelada`, `anulada`.
- **Límites**: sin tope de filas.
- **Avisos**: ninguno; sobrescribir un fichero existente no avisa, sea cual sea la ruta que se dé.
- **Regla ante conflicto**: si el fichero ya existe, se sobrescribe; si no se puede escribir, `no se pudo escribir <ruta>`.

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
