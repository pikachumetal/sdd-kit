---
id: 20261113-224130-feature-0010-exportar-csv
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

🦆 Podrás pedir las reservas de una sala por su nombre y te saldrá una tabla lista para la hoja de cálculo: una línea por reserva, con la sala, el día y la franja, como `Norte;lun;10:00-12:00`. Las columnas van separadas por `;` porque el Excel del responsable está en castellano. Si la sala no existe, sale un aviso en vez de una tabla vacía que parezca buena. El resultado sale por pantalla, como el resto de comandos, y para guardarlo en un fichero basta redirigir la salida. Por dentro es una función nueva junto a las que ya hay, sin ficheros ni dependencias nuevos.

Validación: dev-lead — es lo que abre una persona en su hoja de cálculo; solo ella ve si las columnas salen separadas.

## Capacidades

- Nuevas: `room-export` — exportar a CSV las reservas de una sala

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-export`), contrato público (el CSV lo consume la hoja de cálculo del responsable) · tamaño: ~40 líneas en 3 ficheros
- Dominio (opus): si faltan casos que el responsable vea en su hoja el lunes (una sala sin reservas, una sala escrita con otra mayúscula) (señal: capacidad nueva)
- Técnica (sonnet): si el formato `sala;dia;franja` y los avisos de «Delta de comportamiento» bastan para que la hoja lo abra en columnas (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin mirar la segunda lente, la del formato frente a la hoja
- **No se ha dispatchado ninguna review**: esta sesión no tiene herramienta para lanzar subagentes. La coherencia la he repasado yo; si quieres la review, hay que lanzarla desde otra sesión antes de aprobar.

1. Nombre del comando `exportar <sala>` — en castellano y en infinitivo, como `libres`, `reservar` y `cancelar`; nadie lo nombró.
2. Salida por pantalla, sin fichero propio — igual que el resto de comandos (`console.log` en `src/app.js`); se guarda con `salas exportar Norte > norte.csv`. Descartado `--salida <fichero>`: añade un argumento y un modo de fallo (ruta no escribible) para algo que la redirección ya hace.
3. Columnas `sala;dia;franja`, con esa cabecera, en ese orden — son los únicos datos que tiene hoy una reserva; la cabecera es para que la hoja la lea como títulos.
4. Un salto de línea (`\n`) entre filas, sin salto final extra y sin comillas ni escapes — los valores salen de una lista fija de salas y de días y franjas con formato fijo, ninguno contiene `;`; si algún día una reserva lleva texto libre, habrá que escapar (queda fuera).
5. Sin BOM ni codificación especial — hoy ningún valor lleva tildes; si entran, hay que revisarlo.
6. La sala se busca con el nombre exacto, mayúsculas incluidas (`Norte`, no `norte`) — igual que `libres` compara hoy; `norte` da «sala desconocida».
7. Sala sin reservas (`Sur`): sale solo la cabecera — el CSV es válido y la hoja queda vacía, que es la verdad; no es un error.
8. Sala desconocida: `sala desconocida: <nombre>`; sin nombre: `uso: exportar <sala>` — ambos por la salida normal, sin código de error ni excepción, como el resto de la herramienta, que nunca falla con excepción.
9. Orden de filas: el de las reservas tal como están — hoy hay una sola por sala; ordenar queda para cuando haya más y alguien lo pida.
10. Capacidad nueva `room-export` — el proyecto no tiene `capabilities/` y esto es comportamiento observable nuevo; kebab-case en inglés.
11. Enfoque: A frente a B y C (ver Approach).
12. La carpeta de la spec va en `.docs/sdd/changes/`, no en `specs/` como las anteriores — es la ruta que lee el kit actual; las carpetas viejas quedan donde están.
- Pendiente de ti: qué hace el responsable los lunes con esas reservas en su hoja («las cuadra», dijiste, sin más). Si cuadra contra otra lista y necesita otro dato (una fecha, un nombre, un estado) o filtrar por semana, habrá que ampliar las columnas; hoy no existe ese dato en las reservas.
- Política de modelos: revisores de la spec — ninguno despachado (sin herramienta de subagentes) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Coherencia: delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: salió sin errores (4 requisitos añadidos y las 5 reglas de `room-export`). Búsqueda de `exportar` en el repo fuera de la spec: sin resultados.

### Decisiones tomadas con el dev-lead

- Separador `;` — «el Excel del responsable está en castellano, así que el separador tiene que ser `;`»

## Intent

Hoy `salas` no tiene ningún comando que liste las reservas, y el responsable de cada sala las cuadra los lunes en su hoja de cálculo, con lo que hay que copiarlas a mano. Se quiere que, dada una sala, salga su lista en un formato que la hoja abra en columnas. Éxito: `exportar Norte` pegado o abierto en un Excel en castellano muestra tres columnas (`sala`, `dia`, `franja`) con una fila por reserva. Fracaso aunque funcione: que la hoja abra todo en una sola columna, o que una sala mal escrita dé un CSV vacío que parezca «no hay reservas».

Aviso de alcance: las reservas son hoy una lista fija en memoria de `src/app.js`; `reservar` no guarda nada. El CSV refleja esa lista. Que las reservas se guarden de verdad es otra feature.

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js` con sus avisos de error; sus tests en `test/app.test.js`.
- No entra: guardar en fichero (`--salida`), filtrar por día o semana, ordenar, escapar texto libre, BOM, persistir reservas, elegir el separador, exportar todas las salas a la vez.

## Lo que se retira o cambia de forma

Nada se retira ni cambia de forma: solo se añade un comando. Los casos `libres`, `reservar` y `cancelar` de `run` no se tocan.

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| (ninguna) | — | — |

- Filas que implementa: nada: comprobado con `git grep -n "0010\|exportar" -- . ':!.docs/sdd/changes'` (sin resultados; no hay fila de roadmap para esta feature).

## Approach

- A. Una función `exportCsv(room)` en `src/app.js`, con una rama nueva en `run` — como `freeRooms`; un solo fichero, sin dependencias, que es lo que dice `operations.md`. Coste: `app.js` crece unas 15 líneas.
- B. Un módulo nuevo `src/csv.js` — se prueba solo y sirve si hay más exportaciones, pero `operations.md` fija un único fichero de entrada y hoy no hay una segunda exportación que lo pida.
- C. Escribir un fichero con `--salida` — más superficie (rutas, permisos, sobrescribir) para algo que `>` ya resuelve.
- Elegido: A — es lo más pequeño que cumple lo pedido y sigue la estructura que ya tiene el proyecto. Cuesta tener que extraerlo a un módulo si crecen las exportaciones.

Partes que fija A: `run('exportar', [sala])` devuelve el texto completo (cabecera y filas unidas por `\n`) o el aviso; la rama de `run` usa la lista `bookings` y `rooms` ya existentes. Las filas se arman con `;` entre `room`, `day` y `slot`.

## Dónde se prueba

- Todos los comportamientos: `run('exportar', […])` en `test/app.test.js`, como los tests actuales (`run('libres', …)`). Sin pantalla ni entorno: es texto en, texto fuera. Comprobación a ojo de la hoja de cálculo: en la validación, abriendo la salida en el Excel (el único paso que no cubre un test).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-export`

#### ADDED — Exportar a CSV las reservas de una sala

- GIVEN la sala `Norte` con la reserva `lun`, `10:00-12:00`
- WHEN se pide `exportar Norte`
- THEN sale `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`
- AND las dos líneas van separadas por `\n` y sin salto de línea al final

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala `Sur` sin reservas
- WHEN se pide `exportar Sur`
- THEN sale solo `sala;dia;franja`

#### ADDED — Una sala que no existe da un aviso

- GIVEN las salas `Norte` y `Sur`
- WHEN se pide `exportar Oeste`
- THEN sale `sala desconocida: Oeste` y ninguna línea de CSV
- AND `exportar norte` (con minúscula) da `sala desconocida: norte`

#### ADDED — Pedir la exportación sin sala da el uso

- GIVEN cualquier estado
- WHEN se pide `exportar` sin nombre de sala
- THEN sale `uso: exportar <sala>`

#### Reglas de la capacidad — room-export

- **Dónde viven los datos**: la lista de reservas de `src/app.js` (en memoria, hoy fija)
- **Idioma de los nombres**: castellano (`sala`, `dia`, `franja`; avisos en castellano, regla 4 de la constitución)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <nombre>` · `uso: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
