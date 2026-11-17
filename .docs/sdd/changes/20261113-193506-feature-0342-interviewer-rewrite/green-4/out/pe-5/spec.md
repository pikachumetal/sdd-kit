---
id: 20261114-165909-feature-0010-exportar-reservas-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-14
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Hoy `salas` no puede listar las reservas de una sala. Con esta feature, `exportar Norte` imprime una línea de cabecera y una línea por reserva de esa sala, separadas por punto y coma: `Norte;lun;10:00-12:00`. El responsable de la sala lo guarda con `> norte.csv` y lo abre en su hoja de cálculo para cuadrarlo los lunes. Por dentro es una función más en `src/app.js`, junto a `libres`, que lee la lista de reservas y no la modifica.

Validación: dev-lead — el CSV lo abre una persona en su hoja de cálculo; solo ella ve si las columnas y el separador le sirven.

## Capacidades

- Nuevas: `room-bookings-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-bookings-export`), contrato público (el formato CSV lo consume la hoja de cálculo del responsable) · tamaño: ~15 líneas en 2 ficheros
- Dominio (sonnet): si `sala;dia;franja` y el orden por día de la semana permiten cuadrar una sala sin ambigüedad, y si «sala desconocida» y «sala sin reservas» se distinguen (señal: capacidad nueva)
- Técnica (sonnet): si la cabecera sin acento evita que la hoja de cálculo rompa la `í`, y si salida por pantalla con `\n` y sin comillas aguanta lo que el CSV declara (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el orden y los avisos sirven al responsable de la sala, que es el uso real

### Hallazgos de la review

- **Sin ejecutar**: esta sesión no tiene herramienta para lanzar subagentes, así que no se despacharon los dos revisores. Yo hice la lectura de los siete puntos sobre esta spec: no encontré contradicciones con capacidades (no existe ninguna), cada requisito tiene su escenario con datos, y las decisiones del cuerpo están todas abajo. No es una review independiente: si la quieres, lánzala tú desde una sesión que sí pueda.

1. Comando: `exportar <sala>` — nadie dijo el nombre; va en castellano como `libres`, `reservar` y `cancelar`.
2. Salida por pantalla (stdout), sin fichero: el responsable la guarda con `> norte.csv`. Descartada una opción `--salida` — añade escritura de ficheros que nadie pidió.
3. Columnas, en este orden: sala, día, franja — las que dijo el usuario. Lo demás («no sé») no entra: ni hora de creación, ni quién reservó (no se guarda).
4. Cabecera de una línea: `sala;dia;franja`, sin tilde en `dia`. Una hoja de cálculo que abra el fichero sin saber que es UTF-8 mostraría `dÃ­a`; sin tilde no hay nada que romper. Es un cambio sobre la palabra del usuario («día»).
5. Separador `;` (lo dijo el usuario) y fin de línea `\n`, sin comillas ni escape: las salas son una lista cerrada (`Norte`, `Sur`) y ni los días ni las franjas llevan `;`.
6. Orden: por día de la semana (`lun`, `mar`, `mié`, `jue`, `vie`, `sáb`, `dom`; un día que no esté en la lista sale el último) y, dentro del día, por franja. Con una sola reserva no se nota; con varias, el responsable las recorre como en una agenda.
7. «De la semana»: la app guarda el día de la semana, no una fecha, así que todas las reservas de la sala son «las de la semana». No hay filtro por fechas.
8. La sala se busca igual que en `libres`: nombre exacto, con mayúscula inicial (`Norte`; `norte` no vale).
9. Sala sin reservas: solo la cabecera. Sala que no existe: `sala desconocida: <sala>` y nada de CSV. Sin sala: `uso: exportar <sala>`. Las tres salidas se distinguen para que una hoja vacía no se confunda con un error de escritura.
10. Capacidad nueva: `room-bookings-export` (el repo aún no tiene `capabilities/`; esta spec crea el primero).
11. Enfoque: una función `exportCsv` en `src/app.js` junto a `freeRooms` (ver Approach).
12. Delta probado sobre una copia de `.docs/sdd`: `capability merge` → 5 requisitos y 5 reglas añadidos a `room-bookings-export.md`, `capability check` → «Capacidades válidas: 1». El repo no cambia hasta el cierre.
13. Sin cambios en `operations.md` ni `§Frontend`: no hay pantalla.
- Política de modelos: ningún revisor de spec despachado (ver Hallazgos) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Qué necesita el responsable: «Cuadra las reservas de su sala de la semana con su hoja de cálculo. Necesita ver sala, día y franja de cada reserva, separados por punto y coma. Lo demás, no sé.»

## Intent

Hoy el responsable de cada sala no tiene forma de sacar de `salas` lo que hay reservado, así que los lunes no puede cuadrarlo con su hoja de cálculo. Con el comando, saca las reservas de su sala en un fichero que la hoja abre sin tocar nada. Éxito: `exportar Norte > norte.csv` abre en la hoja con tres columnas, sala, dia y franja, una fila por reserva. Anti-objetivo: que el fichero abra con las columnas pegadas en una sola o con caracteres rotos.

## Scope

- Entra: el comando `exportar <sala>` con la salida de los escenarios; los tests de los cinco escenarios; la línea del comando en `README.md`.
- No entra: filtros por fecha o por día; escribir ficheros; exportar todas las salas de una vez; otras columnas; escapar `;` en los valores; quién reservó (no se guarda); el `.ics` (es la 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "exportar\|csv"` fuera de las carpetas de evidencia: solo `ROADMAP.md:19` (fila 0009, el `.ics`, otra feature) | Scope: sin cambios en lo existente |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv"`; esta feature no tiene fila en el roadmap (id 0010 reservado en local, sin remoto). La 0009 (`.ics`) es otra feature y no se toca aquí.

## Approach

- A. Una función `exportCsv(room, list = bookings)` en `src/app.js`, junto a `freeRooms`, y un caso `exportar` en `run` — ~15 líneas, se prueba por `run`, como los tests actuales; el fichero de entrada sigue siendo uno solo (`operations.md`).
- B. Un módulo nuevo `src/exportar.js` — separa la lógica, pero para ~15 líneas añade un fichero y su import; la 0008 ya añade `src/correo.js`.
- C. Escribir un fichero con `--salida norte.csv` — añade escritura en disco, rutas y sobreescritura que nadie pidió; la redirección del shell hace lo mismo.
- Elegido: A — es lo más pequeño que da el CSV; B y C resuelven problemas que hoy no existen.

`run('exportar', [sala])` devuelve el texto, y la línea final de `app.js` ya lo imprime con `console.log`. El orden de días es una lista fija `['lun','mar','mié','jue','vie','sáb','dom']`.

## Dónde se prueba

- Los cinco escenarios de `exportar`: por `run`, como los tests de `test/app.test.js` actuales. `exportCsv` recibe la lista de reservas como segundo parámetro (por defecto, la de la app) para que el test del orden y el de «solo la sala pedida» usen sus propios datos.
- Que la hoja abre bien el fichero: a mano, por el dev-lead, en la validación.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-bookings-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala `Norte` con una reserva el `lun` en `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida es `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`

#### ADDED — Las reservas salen ordenadas por día y franja

- GIVEN la sala `Norte` con reservas el `mar` en `09:00-10:00`, el `lun` en `14:00-15:00` y el `lun` en `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN tras la cabecera salen `Norte;lun;10:00-12:00`, `Norte;lun;14:00-15:00` y `Norte;mar;09:00-10:00`, en ese orden

#### ADDED — Solo salen las reservas de la sala pedida

- GIVEN `Norte` con una reserva el `lun` en `10:00-12:00` y `Sur` con otra el `mar` en `09:00-10:00`
- WHEN se ejecuta `exportar Sur`
- THEN la salida es `sala;dia;franja` y `Sur;mar;09:00-10:00`, sin ninguna línea de `Norte`

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es `sala;dia;franja` y nada más

#### ADDED — Una sala desconocida o sin nombre no exporta CSV

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Este`
- THEN la salida es `sala desconocida: Este`, sin cabecera
- AND con `exportar` sin sala, la salida es `uso: exportar <sala>`

#### Reglas de la capacidad — room-bookings-export

- **Dónde viven los datos**: no aplica — solo lee la lista de reservas de `src/app.js`; no guarda nada.
- **Idioma de los nombres**: castellano, sin tildes en la cabecera (`sala;dia;franja`).
- **Límites**: no aplica.
- **Avisos**: `sala desconocida: <sala>` y `uso: exportar <sala>`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
