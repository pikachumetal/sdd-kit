---
id: 20261008-140000-feature-0029-room-floors
feature: 0029
title: Ocupación por planta
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Ocupación por planta

🦆 Cada sala pasa a tener planta (Norte y Sur en la 0, Este en la 1). Con `ocupacion` sacas el informe por planta: con una reserva activa en Norte, `planta 0: 1` y `planta 1: 0`. Con `libres 10:00-12:00 --planta 1` ves solo las salas libres de esa planta (`Este`). Por dentro, la lista de salas guarda `{ name, floor }`, se añade Este, que hoy no está en el código, y los tests pueden fijar las reservas porque `bookings` se exporta.

Validación: dev-lead — lo que usa una persona (el informe y `libres --planta`) lo tiene que ver el dev-lead en la terminal.

## Capacidades

- Modificadas: `rooms` — cada sala tiene planta (el código se alinea con `rooms`, que ya dice que existe Este).
- Modificadas: `reports` — el informe de ocupación se reparte por planta.
- Modificadas: `cli` — `libres` acepta `--planta <n>` y hay un comando `ocupacion`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (la interfaz de línea de comandos: `libres --planta` y `ocupacion`), MODIFIED (`Consultar las salas libres` de `cli` y `El informe cuenta las reservas activas` de `reports`) · tamaño: ~70 líneas en 6 ficheros
- Dominio (sonnet): si `planta N: n` cuenta solo reservas activas como exige `reports` hoy y si el filtro `--planta` y el informe dicen lo mismo de una planta vacía (señal: MODIFIED)
- Técnica (sonnet): si `libres <franja> --planta <n>` no rompe `libres <franja>` ni el test existente al añadir Este, y si `ocupacion` encaja en `run()` de `src/app.js` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el informe cuenta lo que conserjería espera contar (activas, plantas vacías)

### Hallazgos de la review

- **Aceptado** — (técnica, Crítico) los escenarios de `reports` no se pueden montar: `bookings` es una constante no exportada con una sola reserva → decisión 11: `bookings` se exporta y los tests fijan su estado; entra en el Scope.
- **Aceptado** — (dominio) el requisito vivo `El informe cuenta las reservas activas` se cambiaba como `ADDED` → pasa a `MODIFIED` en el delta de `reports` («cuenta dos, repartidas por planta»).
- **Aceptado** — (técnica) el escenario de `rooms` no era observable → se reescribe sobre `libres 13:00-14:00 --planta 0`.
- **Aceptado** — (técnica, dominio) faltaban límites de planta, sintaxis de `--planta`, planta sin salas, opción desconocida y `libres` sin opción → decisiones 1, 7 y 12 y los escenarios nuevos de `cli`.
- **Aceptado** — (dominio, técnica) faltaban periodo del informe, `voided` y sala desconocida → decisión 6 y 13, y `voided` en el escenario.
- **Aceptado** — (dominio) `PRODUCT.md` queda desfasado (solo Norte y Sur) → entra en el Scope, con el término Planta.
- **Aceptado** — (técnica, Menor) línea de `run()` mal citada → `src/app.js:27-33`.
- **Aceptado** — (dominio) falta la regla de idioma y de conflicto → decisión 14.
- **Rechazado** — (dominio) dejar las plantas de Norte, Sur y Este sin valor en `rooms`: sin valores no hay escenario que lo ejercite; el dato queda en la decisión 4 y se confirma aquí.
- **Rechazado** — (dominio, Menor) alinear el Intent con «no hay más usuarios» de `PRODUCT.md`: quién pide el informe es del Intent ya escrito; lo dejo en la decisión 8 para que lo valides tú.
- **Aceptado (2.ª ronda, Crítico)** — el `MODIFIED` de `reports` decía «cuenta dos, repartidas por planta» sin dar las líneas → ahora trae salas, plantas y las líneas literales `planta 0: 2` y `planta 1: 0`.
- **Aceptado (2.ª ronda)** — estado compartido en los tests → decisión 11: cada test fija y restaura `bookings`; sin escenario para «cualquier día y franja», sala desconocida y argumentos de `ocupacion` → tres escenarios nuevos; precedencia de errores, forma del entero y `libres` sin franja → decisión 7 y escenario; vacío = cadena `''` → escenario de planta sin salas; el estado de partida de «sin planta» → fijado en su GIVEN; decisión 10 con el resultado vigente.
- **Rechazado (2.ª ronda)** — fundir «Consultar las salas libres sin planta» en el `MODIFIED`: es un escenario con título propio, no un requisito vivo cambiado; el `MODIFIED` ya copia el vivo entero.
- **Rechazado (2.ª ronda)** — actualizar el Purpose de `PRODUCT.md` o reescribir el Intent: quién usa la herramienta lo decides tú, no yo; queda como la primera cosa a confirmar (decisiones 4 y 8, **pendiente**), sin tocar Purpose.
- **Rechazado** — (técnica, Menor) escenario para el README: es un texto, se comprueba en la validación del dev-lead, no con un test.

1. Las plantas son números enteros no negativos, y la planta baja es la 0. No hay sótanos ni máximo.
2. El informe ordena las plantas de menor a mayor.
3. Este se añade al catálogo de `src/app.js` (hoy solo hay Norte y Sur): `rooms` ya dice que existe, y sin Este no hay planta 1 que agrupar. Efecto: `libres 10:00-12:00` pasa de `Sur` a `Sur, Este`, y el test actual de `test/app.test.js:5-7` se actualiza.
4. Norte y Sur están en la planta 0 y Este en la 1 (dato de ejemplo, a confirmar contra el edificio real).
5. El comando del informe se llama `ocupacion` (no existe ninguno hoy: `run()` responde `salas` a lo desconocido, `src/app.js:32`). Los argumentos que se le pasen se ignoran.
6. El informe cuenta todas las reservas activas, de cualquier día y franja; las canceladas y las anuladas no cuentan, como ya exige `reports`. Una reserva de una sala que no está en el catálogo se ignora.
7. `--planta <n>` va después de la franja y con el valor en el argumento siguiente. Se comprueba primero la forma y luego el valor: `libres` sin franja, `--planta` antes de la franja, repetido, con `=`, otra opción o un argumento sobrante responde `uso: libres <franja> [--planta <n>]` (aunque además el valor sea malo). Después, un valor ausente o que no cumple `/^d+$/` (`--planta`, `--planta alta`, `--planta -1`, `--planta 1.0`) responde `planta no válida: usa un número entero`; `01` cumple y vale 1. Una planta sin salas responde la cadena vacía `''`. Una franja inválida no cambia (hoy devuelve todas las salas).
8. Quién pide el informe: conserjería, y «de paso quien reserva quiere ver solo lo que tiene cerca» (`libres --planta`). Eso viene en la spec ya escrita, no de una respuesta tuya que yo pueda citar; la fila 0029 del roadmap no trae brief, y `PRODUCT.md` dice que no hay más usuarios que el autor. Confírmalo.
9. Enfoque: A, frente a B y C (ver Approach).
10. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` sale con 0 con el delta ya corregido (2 requisitos sustituidos y el resto añadidos); `capabilities/` del repo sin tocar.
11. `bookings` se exporta desde `src/app.js` para que los tests fijen el estado de partida (`bookings.length = 0` y `push`): es un export solo para tests, el cambio mínimo. Cada test fija `bookings` al empezar y lo restaura al acabar (`beforeEach`/`afterEach`, con la reserva de Norte de partida), para que no dependan del orden.
12. Los dos mensajes de error son literales míos: `planta no válida: usa un número entero` y `uso: libres <franja> [--planta <n>]`. `libres` sin `--planta` no cambia salvo por Este.
13. El informe lista una línea por planta del catálogo, también con 0; esa línea es su subtotal y no hay total general.
14. Reglas de la planta: viven en la lista de salas de `src/app.js` · texto de la interfaz en castellano, identificadores del código en inglés (`floor`) · límites: entero ≥ 0 · avisos: los dos literales de la decisión 12 · conflicto: una sala sin planta no puede existir (el catálogo la exige) y una reserva de sala desconocida se ignora.
15. `PRODUCT.md` gana el término **Planta** y la lista de salas (Norte, Sur, Este).
- Política de modelos: revisores de la spec, dos en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Perfil `delegate` del proyecto (`sdd-kit.json`).

## Intent

Conserjería reparte la limpieza por plantas y hoy saca la ocupación a mano, sala por sala. Quiere el informe agrupado por planta (`planta 0: 2`, `planta 1: 1`), y de paso quien reserva quiere ver solo las salas libres que tiene cerca. Éxito: el informe sale sin sumar a mano. Fracaso aunque funcione: que el informe cuente reservas canceladas, o que `libres` sin `--planta` cambie de comportamiento.

## Scope

- Entra: la lista de salas de `src/app.js` guarda la planta de cada una y suma Este (decisiones 3 y 4); `freeRooms` y el informe pasan a comparar con el nombre de la sala.
- Entra: `bookings` se exporta de `src/app.js` (decisión 11).
- Entra: `ocupacion` imprime el informe por planta, con un subtotal por cada una (decisiones 5, 6 y 13).
- Entra: `libres <franja> --planta <n>` lista solo las salas libres de esa planta (decisión 7).
- Entra: `test/app.test.js` cubre la agrupación, el filtro y el nuevo resultado de `libres` con Este.
- Entra: `README.md` explica cómo leer el informe.
- Entra: `PRODUCT.md` gana el término Planta y las salas Norte, Sur y Este (decisión 15).
- No entra: reservar por planta; exportar el informe; `cancelar` y `anular` no cambian.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `libres` solo acepta la franja | `.docs/sdd/capabilities/cli.md:20` («`libres` no acepta más argumentos ni opciones que la franja») | delta de `cli`, `MODIFIED` |
| `El informe cuenta las reservas activas` sin reparto | `.docs/sdd/capabilities/reports.md:9-13` | delta de `reports`, `MODIFIED` |
| `libres 10:00-12:00` responde `Sur` | `test/app.test.js:5-7` | Scope: se actualiza a `Sur, Este` (decisión 3) |
| catálogo `['Norte', 'Sur']` sin planta | `src/app.js:2`, `freeRooms` (`src/app.js:5-7`) | Scope y delta de `rooms` |
| sala solo con «Norte, Sur» | `PRODUCT.md` (Terminology, «Sala») | Scope y decisión 15 |
| `run()` responde `salas` a un comando que no conoce | `src/app.js:27-33` (el requisito «Un comando desconocido» de `cli` pide `comando desconocido`) | no se toca: deuda previa fuera de esta feature; `ocupacion` se añade antes del `return` final |

- Filas que implementa: 0029 → `ROADMAP.md:9` (su fila, la cierra el archivo) | sin otro fichero que la nombre: comprobado con `git grep -n 0029` fuera de `.docs/sdd/specs/`

## Approach

- A — la planta junto al nombre en la lista de salas (`{ name, floor }`); `freeRooms` y el informe recorren esa lista. Cuesta cambiar la forma de `rooms`, que hoy es una lista de textos; está en un solo fichero.
- B — un mapa aparte `sala → planta`. Cuesta dos fuentes que pueden desincronizarse (una sala sin planta).
- C — deducir la planta del nombre. No encaja: Norte, Sur y Este no la dicen.
- Elegido: A — una sola fuente de verdad; el cambio de forma no sale del fichero.

Norte y Sur están en la 0 y Este en la 1. El informe recorre las reservas activas, acumula por planta y escribe `planta <n>: <total>` una por línea, de menor a mayor planta.

## Dónde se prueba

- planta de una sala, filtro `libres --planta` y sus errores: por el comando (`run('libres', [...])`), como `test/app.test.js`.
- agrupación del informe: por el comando (`run('ocupacion', [])`) con `bookings` fijado en el test, como `test/app.test.js`.
- README y `PRODUCT.md`: texto, lo ve el dev-lead en la validación.

## Términos y ADR

- Términos resueltos: Planta — nivel del edificio de una sala; la baja es la 0
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Cada sala tiene planta

- GIVEN las salas Norte y Sur en la planta 0 y Este en la 1, sin reservas en la franja `13:00-14:00`
- WHEN la persona ejecuta `libres 13:00-14:00 --planta 0`
- THEN responde `Norte, Sur`
- AND con `--planta 1` responde `Este`

### Capacidad: `reports`

#### MODIFIED — El informe cuenta las reservas activas

- GIVEN dos reservas activas en Norte y una cancelada en Este
- WHEN se pide el informe de ocupación
- THEN sale `planta 0: 2` y `planta 1: 0`, sin total general

#### ADDED — La ocupación se agrupa por planta

- GIVEN dos reservas activas en Norte, una activa en Este, una cancelada en Sur y una anulada en Este
- WHEN se pide el informe de ocupación
- THEN sale `planta 0: 2` y `planta 1: 1`

#### ADDED — El informe cuenta cualquier día y franja e ignora salas desconocidas

- GIVEN una reserva activa en Norte el lunes `10:00-12:00`, otra en Norte el martes `14:00-16:00` y una activa en la sala Oeste, que no está en el catálogo
- WHEN se pide el informe de ocupación
- THEN sale `planta 0: 2` y `planta 1: 0`

#### ADDED — Una planta sin reservas sale con cero

- GIVEN ninguna reserva activa en Este y una activa en Norte
- WHEN se pide el informe de ocupación
- THEN sale `planta 0: 1` y `planta 1: 0`

### Capacidad: `cli`

#### MODIFIED — Consultar las salas libres

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres, separadas por comas
- AND `libres` no acepta más argumentos ni opciones que la franja y `--planta <n>`

#### ADDED — Consultar las salas libres sin planta

- GIVEN Norte reservada en la franja `10:00-12:00` (estado fijado por el test), y Sur y Este libres
- WHEN la persona ejecuta `libres 10:00-12:00`
- THEN responde `Sur, Este`

#### ADDED — Consultar las salas libres de una planta

- GIVEN Norte reservada en la franja `10:00-12:00`, Sur y Este libres, Sur en la planta 0 y Este en la 1
- WHEN la persona ejecuta `libres 10:00-12:00 --planta 1`
- THEN responde `Este`

#### ADDED — Una planta sin salas

- GIVEN las salas en las plantas 0 y 1
- WHEN la persona ejecuta `libres 10:00-12:00 --planta 5`
- THEN `run` devuelve la cadena vacía `''`

#### ADDED — Una planta que no es un número entero no negativo

- GIVEN cualquier estado
- WHEN la persona ejecuta `libres 10:00-12:00 --planta alta`
- THEN responde `planta no válida: usa un número entero`
- AND con `--planta -1`, `--planta 1.0` o con `--planta` sin valor responde lo mismo

#### ADDED — Una opción que `libres` no admite

- GIVEN cualquier estado
- WHEN la persona ejecuta `libres 10:00-12:00 --otra`
- THEN responde `uso: libres <franja> [--planta <n>]`
- AND con `libres` sin franja, `--planta 1` antes de la franja, `--planta` repetido o un argumento sobrante responde lo mismo
- AND con `libres 10:00-12:00 --planta alta --otra` responde también `uso: …` (la forma se comprueba antes que el valor)

#### ADDED — Informe de ocupación

- GIVEN una reserva activa en Norte
- WHEN la persona ejecuta `ocupacion`
- THEN responde una línea por planta, `planta 0: 1` y `planta 1: 0`, de menor a mayor planta
- AND `ocupacion extra` responde lo mismo: los argumentos se ignoran

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
