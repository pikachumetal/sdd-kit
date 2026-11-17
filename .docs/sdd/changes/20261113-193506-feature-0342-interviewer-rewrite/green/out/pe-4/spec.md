---
id: 20261113-213804-feature-0010-exportar-csv
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

🦆 Un comando nuevo, `exportar <sala>`, imprime las reservas de esa sala en CSV con `;` como separador. Con `exportar Norte` sale `sala;dia;franja` y debajo `Norte;lun;10:00-12:00`. El responsable de la sala lo guarda con `> norte.csv` y lo abre en su hoja de cálculo en español, que lo reparte en tres columnas. Por dentro es una función más en `src/app.js` que filtra las reservas por sala y une los campos con `;`.

Validación: dev-lead — lo que cuenta es que la hoja real del responsable abra el fichero en tres columnas, y eso solo lo ve una persona.

## Capacidades

- Nuevas: `bookings-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: no despachada. Señales: capacidad nueva y contrato público (el formato del fichero lo consume la hoja del responsable) · tamaño: ~25 líneas en 2 ficheros. Por la rúbrica serían dos revisores (dominio en sonnet y técnica en sonnet). Esta sesión no tiene herramienta de subagentes, así que no hay review y la spec llega al gate sin ella.
- Mínimo razonable: un revisor con los siete puntos — lo que queda sin cubrir es el complemento de lo que el CSV no debe contener (no hay roles en el producto, así que el riesgo es bajo).

1. Nombre del comando: `exportar <sala>`, en castellano como `libres`, `reservar` y `cancelar`.
2. Salida por la salida estándar, no a fichero: es lo que hacen hoy los demás comandos y `> norte.csv` cubre el caso del lunes sin añadir rutas ni sobrescrituras.
3. Columnas y cabecera: `sala;dia;franja`, tal cual lo dijiste. `dia` sin tilde para que el literal de la cabecera sea el mismo que el del campo `day`.
4. Filas en el orden en que están las reservas, sin filtrar por día. No dijiste que quisieras un día concreto.
5. Fin de línea `\n`, sin BOM, UTF-8. Hoy ni las salas ni los días ni las franjas llevan tilde, así que la hoja no corrompe nada.
6. Sin comillas ni escapes: las salas son una lista cerrada (`Norte`, `Sur`) y ningún campo puede contener `;`. Si algún día entran salas con nombre libre, será otra feature.
7. La sala se compara exacta, con mayúscula inicial (`Norte`). `norte` cuenta como sala desconocida.
8. Una sala sin reservas devuelve solo la cabecera. Una sala desconocida devuelve `sala desconocida: <sala>` y sin sala devuelve `uso: exportar <sala>`; en ambos casos no sale CSV, para que una redirección no deje un fichero engañoso.
9. Enfoque: A (elegido), frente a B y C (ver Approach).
10. Capacidad nueva `bookings-export` (kebab-case en inglés): el proyecto no tiene `capabilities/` y esta spec crea la primera.
- Repaso de coherencia: `sdd capability merge` sobre una copia sin errores (4 requisitos añadidos a `bookings-export`); `git grep` de `exportar|csv` sin choques.
- Pendiente de ti: qué compara exactamente el responsable con qué y qué busca cada lunes. Dijiste que no lo sabes. La spec solo entrega las reservas en un formato que la hoja abre bien; no promete cuadrar nada.
- Política de modelos: sin revisores de la spec (no hay herramienta de subagentes en esta sesión) · ejes de la revisión final según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Separador `;` — «Punto y coma (opción 1). La hoja del responsable está en configuración regional española y abre `sala;dia;franja` en tres columnas.»
- El dev-lead no sabe qué compara el responsable ni qué busca — «Qué compara exactamente con qué y qué busca, no lo sé.»

## Intent

Hoy no hay forma de sacar las reservas de una sala de la terminal. El responsable de cada sala las cuadra los lunes en su hoja de cálculo, así que hoy tiene que copiarlas a mano. Se quiere que un comando las entregue en un formato que esa hoja abra sin pasos extra. Éxito: `salas exportar Norte > norte.csv` produce un fichero que la hoja del responsable abre en tres columnas, sin importar a mano.
Anti-objetivo: un CSV que parezca bien pero que la hoja española abra en una sola columna.

## Scope

- Entra: el comando `exportar <sala>` con el formato de las decisiones 3 a 8; su prueba; una línea en `README.md` que lo nombre.
- No entra: filtros por día o por franja, exportar todas las salas a la vez, escribir a fichero con una opción, comillas y escapes, el formato `.ics` (es la fila 0009), cambiar cómo se guardan las reservas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv"`, que solo da la fila 0009 del roadmap (`.ics`, otra feature).

## Approach

- A — una función `exportar(sala)` en `src/app.js` que filtra `bookings` por sala y une los campos con `;`, y se engancha en `run` como los demás comandos. Coste: una función y una rama en `run`; se prueba llamando a `run`, como los tests actuales.
- B — un módulo nuevo `src/csv.js` con un escritor CSV genérico (separador y escapes configurables). Coste: un fichero y una abstracción para una sola salida; no encaja con un proyecto de un solo fichero de entrada.
- C — escribir directamente un fichero con `fs`. Coste: rutas, sobrescritura y errores de disco para algo que `>` ya resuelve.
- Elegido: A — es lo más pequeño que cumple el Intent y sigue el patrón del proyecto (un solo fichero de entrada, comandos por `run`).

`run('exportar', [sala])` devuelve el texto completo, con las líneas unidas por `\n` y sin `\n` final: `console.log` ya añade el salto.

## Dónde se prueba

- Exportar una sala con reservas, sin reservas, desconocida y sin argumento: por `run('exportar', …)`, como los tests actuales de `test/app.test.js`.
- Que la hoja real lo abra en tres columnas: lo prueba el dev-lead en la validación, con su hoja.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala `Norte` con la reserva `lun`, `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida es `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`
- AND las líneas se separan con `\n`, el separador de columnas es `;` y no hay comillas ni BOM

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es exactamente `sala;dia;franja`

#### ADDED — Una sala desconocida no exporta CSV

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Este`
- THEN la salida es `sala desconocida: Este` y no contiene la cabecera `sala;dia;franja`

#### ADDED — Exportar exige una sala

- GIVEN cualquier estado
- WHEN se ejecuta `exportar` sin sala
- THEN la salida es `uso: exportar <sala>` y no contiene la cabecera `sala;dia;franja`

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
