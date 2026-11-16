---
id: 20261116-183556-feature-0010-exportar-reservas-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Con `salas exportar Norte > norte.csv` tendrás un fichero con las reservas de Norte, una por línea, que se abre en columnas en la hoja de cálculo: `sala;día;franja` y debajo `Norte;lun;10:00-12:00`. Si escribes mal la sala (`Nrte`), el comando avisa por pantalla y no escribe nada en el fichero, para que no se cuadre contra un export vacío por error. Cómo le llega el fichero al responsable queda fuera: el comando solo escribe el CSV.

Validación: dev-lead — lo que se observa es el fichero abierto en la hoja de cálculo (columnas, tilde de `día`), y eso solo lo ve una persona.

## Capacidades

- Nuevas: `room-bookings-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-bookings-export`), contrato público (el formato del CSV lo consume una hoja de cálculo) · tamaño: ~25 líneas en 2 ficheros
- Dominio (sonnet): si el THEN de «Exportar la sala» y el de «Sala sin reservas» dejan clara la diferencia con el error de sala inexistente, y si falta algún caso del responsable (señal: contrato público)
- Técnica (sonnet): si lanzar un error desde `run` y capturarlo en la entrada (stderr + código 1) cabe en `src/app.js` sin romper `libres`, `reservar` y `cancelar`, y si la prueba de proceso es viable (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el CSV cubre lo que cuadra el responsable los lunes

1. Nombre del comando: `exportar <sala>` (frente a `reservas <sala> --csv`) — lo pediste a mí («No sé, decide tú»); sigue el estilo de verbos sueltos de `libres`, `reservar`, `cancelar`, y no hay otro formato que distinguir.
2. Sala inexistente: error por el canal de errores, código de salida 1 y nada por la salida estándar (frente a «solo cabecera») — lo dejaste a mi criterio; un typo no debe parecer una sala sin reservas en un fichero que se cuadra a mano.
3. Texto del error de sala inexistente: `No existe la sala Nrte (salas: Norte, Sur)`. Falta de argumento (`salas exportar`): `Falta la sala (salas: Norte, Sur)`, mismo canal y código.
4. Sala existente sin reservas (`Sur`): solo la cabecera `sala;día;franja`.
5. Orden de las filas: el de alta de las reservas (el de `bookings`); sin ordenar por día ni franja.
6. El nombre de la sala se compara exacto, con mayúsculas, como `libres` (`norte` no vale).
7. Codificación UTF-8 con BOM (`﻿` al principio), por la tilde de `día` y porque el consumidor previsto es Excel en castellano. **Sin verificar**: no pude consultar la documentación de Microsoft (búsqueda web no autorizada); de memoria, Excel abre un UTF-8 sin BOM con la tilde rota. Contra: un lector que no espere el BOM lo verá como un carácter invisible al inicio de `sala`.
8. Cabecera `sala;día;franja` con tilde en `día`, como la pediste; saltos de línea `\n`.
9. Sin comillas ni escape: los valores (sala, día, franja) no llevan `;` ni comillas hoy; si algún día llevaran, el CSV saldría mal (entra en «No entra»).
10. Enfoque: A, frente a B y C (ver Approach).
11. `Validación: dev-lead`, no `agente`: lo que importa es cómo lo abre la hoja de cálculo.
12. Repaso de coherencia: delta probado en una copia de `.docs/sdd` con `sdd capability merge` (3 requisitos y las 5 reglas añadidos, código 0) y `sdd capability check` (`Capacidades válidas: 1`); el repositorio no cambia. Nada se retira ni se renombra: `git grep` de `exportar`, `csv` y `0010` solo encuentra la fila 0009 del roadmap, que es otra feature.
- Política de modelos: revisores de la spec en sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

La rúbrica pedía dos revisores en paralelo, pero esta sesión no tiene herramienta para lanzar subagentes: **no hubo revisores independientes**. Hice yo las dos lentes sobre la spec, con las limitaciones de revisar mi propio texto; si quieres revisores de verdad, se lanzan desde una sesión que los pueda despachar.

- **Aceptado** — Técnica: los THEN de código 0 (`Exportar la sala`, `Sala sin reservas`) no tenían prueba que los observara, porque `run` no devuelve código de salida → «Dónde se prueba» lleva ahora un test de proceso también para `exportar Norte`.
- **Aceptado** — Dominio: el responsable es un usuario que `PRODUCT.md` no contempla (solo usa la herramienta el dev-lead) → queda en Intent como pendiente y en «No entra» la entrega del fichero; `PRODUCT.md` no se toca.
- **Rechazado** — Dominio: filtrar las reservas por semana, porque el responsable cuadra los lunes → las reservas guardan solo el día de la semana (`lun`), sin fecha, así que no hay semana que filtrar.
- **Rechazado** — Técnica: ordenar por día y franja → decidido en 5 como orden de alta; ordenar no cambia lo que se cuadra y añade reglas (¿`lun` antes que `mar`?) que nadie ha pedido.

### Decisiones tomadas con el dev-lead

- Separador `;` y cabecera de tres columnas: sala, día y franja — «Punto y coma, con cabecera de tres columnas: sala, día y franja. Eso es la opción 1.»
- Quien ejecuta el comando es el dev-lead y redirige la salida a un fichero; la entrega del fichero al responsable no está decidida — «Quien ejecuta el comando soy yo, y redirijo la salida a un fichero; cómo le llega ese fichero al responsable, no sé.»

## Intent

Hoy no hay forma de sacar las reservas de una sala de la herramienta. El responsable de cada sala las cuadra los lunes en su hoja de cálculo, y ahora tendría que copiarlas a mano. Se quiere un comando que las vuelque a CSV y que se abra bien en la hoja de cálculo (columnas separadas, tilde correcta). Éxito: `salas exportar Norte > norte.csv` produce un fichero que se abre en tres columnas con las reservas de Norte. Fracaso aunque funcione: un export de una sala mal escrita que parezca válido, o un CSV que la hoja abra con todo en una columna.

Pendiente: cómo llega el fichero al responsable (lo hace el dev-lead a mano por ahora).

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js`, la salida CSV por la salida estándar y los errores por el canal de errores con código 1; sus tests en `test/app.test.js`.
- No entra: entregar el fichero al responsable (correo, carpeta compartida…); escribir directamente a un fichero (`--salida`); exportar todas las salas a la vez; las reservas semanales (`--cada-semana`), que hoy no se guardan; escape de `;` o comillas en los valores; ordenar las filas; otros formatos (`.ics` es la fila 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "exportar\|csv\|0010"` fuera de `.docs/sdd/specs`: solo `ROADMAP.md:19` (0009, `.ics`, otra feature) | no aplica |

- Filas que implementa: nada: comprobado con `git grep -nE "0010"` (sin hits); no hay fila en `ROADMAP.md`.

## Approach

- A. Rama `exportar` en `run` de `src/app.js` que arma el CSV desde `bookings` y lanza un `Error` si la sala no existe; la entrada lo captura, escribe el mensaje por stderr y pone `process.exitCode = 1` — ~15 líneas, sin ficheros nuevos, y `run` sigue devolviendo texto en el camino normal.
- B. Módulo nuevo `src/exportar.js` con la función pura que arma el CSV — un fichero más para ~8 líneas; `operations.md` habla de «un solo fichero de entrada» y el proyecto no tiene más módulos.
- C. `run` devuelve el mensaje de error como texto, como hoy — el mensaje iría a la salida estándar y acabaría dentro del CSV al redirigir, que es justo lo que se quiere evitar.
- Elegido: A — es lo único que da la salida limpia al redirigir sin crear módulos; `libres`, `reservar` y `cancelar` no cambian.

Las partes del cómo que fija A: el BOM y la cabecera son constantes de la rama `exportar`; el error de sala se lanza con `throw new Error(<texto>)`; la entrada pasa de `if (command) console.log(run(command, args))` a un `try/catch` que mantiene el `console.log` del camino normal.

## Dónde se prueba

- Exportar una sala con reservas, una sala sin reservas y el texto de los dos errores: por `run`, como los tests actuales de `libres` y `cancelar`.
- Salida limpia y código de salida: dos tests que lanzan `node src/app.js` como proceso, uno con `exportar Nrte` (stdout vacío, stderr con el texto, código 1) y otro con `exportar Norte` (stdout con BOM, cabecera y fila, código 0); la entrada no se puede ejercitar por `run`.
- Cómo abre el fichero la hoja de cálculo (columnas, tilde): lo valida el dev-lead a mano.

## Términos y ADR

- Términos resueltos: ninguno.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `room-bookings-export`

#### ADDED — Exportar la sala

- GIVEN la sala Norte con la reserva lun 10:00-12:00
- WHEN se ejecuta `salas exportar Norte`
- THEN la salida estándar es, tras el BOM, las líneas `sala;día;franja` y `Norte;lun;10:00-12:00`, y termina con código 0

#### ADDED — Sala sin reservas

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN la salida estándar es, tras el BOM, solo la línea `sala;día;franja`, y termina con código 0

#### ADDED — Sala inexistente o ausente

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `salas exportar Nrte`
- THEN no se escribe nada por la salida estándar, el canal de errores recibe `No existe la sala Nrte (salas: Norte, Sur)` y termina con código 1
- AND con `salas exportar` sin sala, el canal de errores recibe `Falta la sala (salas: Norte, Sur)` y termina con código 1

#### Reglas de la capacidad — room-bookings-export

- **Dónde viven los datos**: no aplica (las reservas están en memoria en `src/app.js`; esta capacidad solo las lee)
- **Idioma de los nombres**: castellano (comando `exportar`, cabecera `sala;día;franja`, mensajes de error)
- **Límites**: no aplica
- **Avisos**: sala inexistente → `No existe la sala <sala> (salas: <lista>)`; sala ausente → `Falta la sala (salas: <lista>)`; siempre por el canal de errores, con código 1
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
